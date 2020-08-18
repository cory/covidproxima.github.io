// (c) Cory Ondrejka 2020
'use strict'

import * as Places from './query/places.js?cachebust=80336';
import * as Colors from './util/colors.js?cachebust=80336';
import * as Numbers from './util/numbers.js?cachebust=80336';
import * as Text from './util/text.js?cachebust=80336';

let SVGs = {};
let Count = 0;
let Animate;

export function init(animate) {
  Animate = animate;
}

function setupSVG(el, parent, fips, c, dc) {
  let newSVG = {
    loaded: false,
    el: el,
    parent: parent,
    bounding: {
      left: 100000000,
      right: 0,
      top: 100000000,
      bottom: 0
    },
    boundingBoxes: {},
    highlights: {
      pending: {},
      on: {},
      new: false
    },
    origin: { x: 0, y: 0 },
    dimension: { width: 0, height: 0 },
    origWidth: 0,
    targetFIPS: fips,
    matrix: [1, 0, 0, 1, 0, 0],
    lastScale: 1,
    colors: c ? c : Colors.SVGColors,
    upGoodColors: c ? c : Colors.SVGUpGoodColors,
    divergentColors: dc ? dc : Colors.SVGDivColors,
    divergentUpGoodColors: dc ? dc : Colors.SVGUpGoodDivColors,
  };
  SVGs[Count] = newSVG;
  if (fips) {
    window.onresize = (e) => { calcMatrix(newSVG) };
  }
  return Count++;
}

function updateBounding(bounding, rect) {
  if (rect) {
    bounding.left = Math.min(bounding.left, rect.left);
    bounding.top = Math.min(bounding.top, rect.top);
    bounding.right = Math.max(bounding.right, rect.right);
    bounding.bottom = Math.max(bounding.bottom, rect.bottom);
  }
}

function setTargetBounding(bounding, rect) {
  if (rect) {
    bounding.left = rect.left;
    bounding.top = rect.top;
    bounding.right = rect.right;
    bounding.bottom = rect.bottom;
  }
}

function getFipsBoundingBoxes(svg) {
  let paths = svg.el.contentDocument.querySelectorAll('path');
  for (let p = 0; p < paths.length; p++) {
    let rect = paths[p].getBoundingClientRect();
    svg.boundingBoxes[paths[p].id] = rect;
    updateBounding(svg.bounding, rect);
  }
  svg.origin = { x: 0.5 * (svg.bounding.right + svg.bounding.left), y: 0.5 * (svg.bounding.bottom - svg.bounding.top) };
  svg.dimension = { width: svg.bounding.right - svg.bounding.left, height: svg.bounding.bottom - svg.bounding.top };
}

function animM(svg, m, time) {
  let svgM = svg.matrix;
  let start = svgM.slice();
  let f = (t, l) => {
    let newm = [];
    for (let i = 0; i < m.length; i++) {
      svgM[i] = Math.min(1, t / l * t / l) * (m[i] - start[i]) + start[i];
      let ms = "matrix(" + svgM.join(',') + ")";
      let cd = svg.el.contentDocument;
      cd.firstChild.style.transform = ms;
    }
  };
  Animate(f, time);
}

function calcMatrix(svg) {
  let currentDimensions = svg.el.getBoundingClientRect();
  if (svg.targetFIPS) {
    setTargetBounding(svg.bounding, svg.boundingBoxes['c' + svg.targetFIPS]);
  }
  if (!svg.origWidth) {
    svg.origWidth = currentDimensions.width;
  }
  let scale = currentDimensions.width / svg.origWidth;
  let m = [1, 0, 0, 1, 0, 0];
  let width = svg.bounding.right - svg.bounding.left;
  let height = svg.bounding.bottom - svg.bounding.top;
  let x = 0.5 * (svg.bounding.right + svg.bounding.left) - 12;
  let y = 0.5 * (svg.bounding.bottom + svg.bounding.top) - 4;

  let sx = svg.dimension.width / width * scale;
  let sy = svg.dimension.height / height * scale;

  if (sx > sy) {
    sx = sy;
  }

  sx = Math.min(sx, 30);
  if (sx < 2 && svg.lastScale < 2) {
    return;
  }
  svg.lastScale = sx;

  if (sx > 1) {
    sx = Math.sqrt(sx);
    m[0] = m[3] = sx;
    m[4] = sx * (svg.origin.x - x) * scale;
    m[5] = sx * (svg.origin.y - y) * scale;
  }

  if (!svg.targetFIPS) {
    animM(svg, m, 500);
  } else {
    let ms = "matrix(" + m.join(',') + ")";
    let cd = svg.el.contentDocument;
    cd.firstChild.style.transform = ms;
  }
}

function highlightCounties(svg, t, length) {
  let cd = svg.el.contentDocument;
  for (let i in svg.highlights.on) {
    let path = cd.getElementById('c' + i);
    if (path) {
      path.removeAttribute('fill');
      path.children[0].textContent = '';
    }
  }
  svg.highlights.on = svg.highlights.pending;
  svg.highlights.pending = {};
  svg.highlights.new = false;
  for (let i in svg.highlights.on) {
    let path = cd.getElementById('c' + i);
    if (path) {
      path.setAttribute('fill', svg.highlights.on[i].color);
      path.children[0].textContent = svg.highlights.on[i].text;
    }
  }
  calcMatrix(svg);
}

function addCounty(svg, fips, color, text) {
  if (fips === 'new york city') {
    addCounty(svg, 36061, color, text); // Manhattan Co
    addCounty(svg, 36047, color, text); // Kings Co
    addCounty(svg, 36005, color, text); // Bronx Co
    addCounty(svg, 36085, color, text); // Richmond Co
    addCounty(svg, 36081, color, text); // Queens Co
    return;
  } else if (isNaN(fips)) {
    let places = Places.allPlacesWithin(fips);
    for (let i = 0; i < places.length; i++) {
      if (places[i].value !== fips) {
        addCounty(svg, places[i].value, color, text);
      }
    }
    return;
  }
  svg.highlights.pending[fips] = { color: color, text: text };
  if (!svg.highlights.new) {
    svg.highlights.new = true;
    let f = (t, l) => {
      highlightCounties(svg, t, l);
    };
    Animate(f, 0);
  }
  updateBounding(svg.bounding, svg.boundingBoxes['c' + fips]);
}

function legend(el, ranges, colors, shortText) {
  let leg = el.parentNode.querySelector('#legend');
  if (leg) {
    el.parentNode.removeChild(leg);
  }
  leg = document.createElement('div');
  leg.id = 'legend';
  leg.className = 'legend';
  let row = document.createElement('div');
  row.className = 'legendrow';
  let tbox = document.createElement('div');
  tbox.className = 'tbox';
  tbox.textContent = Text.firstCaps(shortText);
  row.appendChild(tbox);
  leg.appendChild(row);
  for (let i = ranges.length - 1; i >= 0; i--) {
    if (!ranges[i]) {
      continue;
    }
    let row = document.createElement('div');
    row.className = 'legendrow';
    let tbox = document.createElement('div');
    tbox.className = 'tbox';
    let cbox = document.createElement('div');
    cbox.className = 'cbox';
    cbox.style.backgroundColor = colors[i];
    if (ranges[i].min === ranges[i].max) {
      tbox.textContent = Numbers.prettyPrint(ranges[i].min, true)
    } else {
      tbox.textContent = Numbers.prettyPrint(ranges[i].min, true) + ' - ' + Numbers.prettyPrint(ranges[i].max, true);
    }
    row.appendChild(tbox);
    row.appendChild(cbox);
    leg.appendChild(row);
  }
  el.parentNode.appendChild(leg);
}

function findMaxDeltas(arr, number) {
  let deltas = [];
  let retvals = [];
  let last = arr.length - 1;
  let min = arr[arr.length - 1].d;
  if (min === 0) {
    for (let i = arr.length - 2; i >= 0; i--) {
      if (arr[i].d > min) {
        last = i;
        break;
      }
    }
  }
  if (last === 0) {
    return [{ idx: arr.length }];
  }
  let split = Math.round(last / number);
  for (let i = 0; i < last; i++) {
    deltas.push({ d: Math.abs(arr[i].d - arr[i + 1].d), idx: i + 1 });
  }
  for (let i = 0; i < number; i++) {
    let window = Math.round(split * 0.9);
    let winDeltas = deltas.slice((i + 1) * split - window, (i + 1) * split);
    winDeltas.sort((a, b) => { return b.d - a.d; });
    retvals.push({ idx: winDeltas[0].idx });
  }
  return retvals;;
}

function getPercents(arr, max) {
  let limits;
  if (max > 0.8) {
    limits = [0.80, 0.60, 0.4, 0.2, 0.0];
  } else if (max > 0.5) {
    limits = [0.5, 0.25, 0.10, 0.05, 0.01];
  } else {
    limits = [0.1, 0.05, 0.02, 0.01, 0.005];
  }
  let retvals = [];
  let last = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].d < limits[last]) {
      retvals.push({ idx: i });
      last++;
    }
  }
  if (last === limits.length - 1) {
    retvals.push({ idx: arr.length - 1 });
  }
  return retvals;;
}

export function render(svgNumber, text, arr, shortText, upGood, states) {
  let svg = SVGs[svgNumber];
  if (!svg.loaded || !arr.length) {
    return;
  }
  svg.bounding = {
    left: 100000000,
    right: 0,
    top: 100000000,
    bottom: 0
  };
  let ranges = [];
  let cidx = 0;
  let colors;
  let max = arr[0].d;
  let min = arr[arr.length - 1].d;

  if (max > 0 && min >= 0) {
    colors = upGood ? svg.upGoodColors : svg.colors;
    let colorCount = colors.length;
    colors = upGood ? svg.upGoodColors : svg.colors;
    let splits;
    if (min < 0.05 && max > 0.25 && max <= 1) {
      splits = getPercents(arr, max);
    } else {
      splits = findMaxDeltas(arr, colorCount);
    }
    let start = 0;
    for (let i = 0; i < splits.length; i++) {
      let idx = splits[i].idx;
      ranges[i] = { count: idx, max: arr[start].d, min: arr[idx - 1].d };
      start = idx;
    }
    for (let i = 0; i < arr.length; i++) {
      let cidx = 0;
      for (let j = 0; j < ranges.length; j++) {
        cidx = j;
        if (i < ranges[j].count) {
          break;
        }
      }
      let hover;
      if (states) {
        hover = arr[i].state + ': ' + Numbers.prettyPrint(arr[i].d, true);
      } else {
        hover = arr[i].county + ', ' + arr[i].state + ': ' + Numbers.prettyPrint(arr[i].d, true) + ' (' + arr[i].state + ': ' + Numbers.prettyPrint(arr[i].sd, true) + ')';
      }
      addCounty(svg, arr[i].fips, colors[cidx], hover);
    }
  } else {
    colors = upGood ? svg.divergentUpGoodColors : svg.divergentColors;
    let lastZero = 0;
    for (let i = 0; i < arr.length; i++) {
      lastZero = i;
      if (arr[i].d < 0) {
        break;
      }
    }
    let computeIdx = lastZero > 1 ? Math.floor(Math.log10(lastZero)) : 0;
    let computeMax = arr[computeIdx].d;

    let colorCount = Math.floor(colors.length / 2) + 1;
    let step = Math.pow(computeMax, 1 / colorCount);
    let base = computeMax;
    let target = computeMax;
    for (let i = 0; i < lastZero; i++) {
      if (!ranges[cidx]) {
        ranges[cidx] = { count: i, max: min, min: max };
      }
      ranges[cidx].max = Math.max(ranges[cidx].max, arr[i].d);
      ranges[cidx].min = Math.min(ranges[cidx].min, arr[i].d);
      let hover;
      if (states) {
        hover = arr[i].state + ': ' + Numbers.prettyPrint(arr[i].d, true);
      } else {
        hover = arr[i].county + ', ' + arr[i].state + ': ' + Numbers.prettyPrint(arr[i].d, true) + ' (' + arr[i].state + ': ' + Numbers.prettyPrint(arr[i].sd, true) + ')';
      }
      addCounty(svg, arr[i].fips, colors[cidx], hover);

      if (i + 1 < lastZero && arr[i + 1].d < target && cidx < colorCount - 1) {
        base /= step;
        target = base;
        cidx++;
      }
    }
    computeIdx = Math.min(arr.length - Math.floor(Math.log10(arr.length - lastZero)), arr.length - 1);
    let computeMin = arr[computeIdx].d;

    colorCount = Math.floor(colors.length / 2) + 1;
    step = Math.pow(0 - computeMin, 1 / colorCount);
    let baseStep = step;

    for (let i = lastZero; i < arr.length; i++) {
      if (!ranges[cidx]) {
        ranges[cidx] = { count: i, max: min, min: max };
      }
      ranges[cidx].max = Math.max(ranges[cidx].max, arr[i].d);
      ranges[cidx].min = Math.min(ranges[cidx].min, arr[i].d);
      let hover;
      if (states) {
        hover = arr[i].state + ': ' + Numbers.prettyPrint(arr[i].d, true);
      } else {
        hover = arr[i].county + ', ' + arr[i].state + ': ' + Numbers.prettyPrint(arr[i].d, true) + ' (' + arr[i].state + ': ' + Numbers.prettyPrint(arr[i].sd, true) + ')';
      }
      addCounty(svg, arr[i].fips, colors[cidx], hover);

      if (i + 1 < arr.length && arr[i + 1].d < -step && cidx < colors.length - 1) {
        step *= baseStep;
        target = min + base;
        cidx++;
      }
    }

  }
  if (text) {
    legend(svg.el, ranges, colors, shortText);
  }
}

export function queryToColorsAndViewPort(svgNumber, field, places, data) {
  if (!SVGs[svgNumber].loaded) {
    return;
  }
  let arr = [];
  let f = field.f;
  for (let fips in data) {
    let cd = data[fips];
    if (data[fips].county !== 'new york city' && data[fips].state === data[fips].county) {
      // filter out states and the US here
      continue;
    }
    if (places && places[0] !== 'united states' && !places.includes(fips) && !places.includes(data[fips].state)) {
      continue;
    }
    let d = data[fips][f] ? data[fips][f] : data[fips].totals[f] ? data[fips].totals[f] : 0;
    let sd = data[data[fips].state][f] ? data[data[fips].state][f] : data[data[fips].state].totals[f] ? data[data[fips].state].totals[f] : 0;
    let usd = data['united states'][f] ? data['united states'][f] : data['united states'].totals[f] ? data['united states'].totals[f] : 0;
    arr.push({ county: data[fips].county, state: data[fips].state, fips: fips, d: d, sd: sd, usd: usd });
  }
  if (!arr.length) {
    return;
  }
  arr.sort((a, b) => {
    return b.d - a.d;
  });
  render(svgNumber, undefined, arr);
}

function onloaded(svgNumber, cb) {
  let svg = SVGs[svgNumber];
  svg.loaded = true;
  getFipsBoundingBoxes(svg);
  cb();
}

export function addViaID(id, fips, c, dc, cb) {
  let parentEl = document.getElementById(id);
  return add(undefined, parentEl, fips, c, dc, cb);
}

export function add(paraEl, parentEl, fips, c, dc, cb) {
  if (paraEl) {
    paraEl.className = 'graphic';
  }
  parentEl.className = fips ? 'svgBackground' : 'svg';
  let svgEl = document.createElement('object');
  svgEl.data = 'us-fips.svg';
  svgEl.type = 'image/svg+xml';
  svgEl.style = 'display: inline-block; position: absolute; top: 0; left: 0;';
  parentEl.appendChild(svgEl);
  let svgNumber = setupSVG(svgEl, parentEl, fips, c, dc);
  if (cb) {
    svgEl.addEventListener('load', () => {
      onloaded(svgNumber, cb)
    });
  }
  return svgNumber;
}

