// (c) Cory Ondrejka 2020
'use strict'

import * as PlaceData from '../../data/data.js?cachebust=46662';
import * as Dates from '../util/dates.js?cachebust=46662';
import * as Numbers from '../util/numbers.js?cachebust=46662';
import * as Text from '../util/text.js?cachebust=46662';

const baseOffset = 16;
const twiceBaseOffset = 2 * baseOffset;
const legend_w = 75;
const legend_r = 150;

function setupGraphArea() {
  let html = ['<div style="display:flex;width:100%;height:100%" />'];
  return html.join('\n');
}

function getSVGParent(el) {
  return el.children[0];
}

export function initMulti(root, set, alignWithUS, stack, field, legend) {
  root.className = 'svggraphic';
  root.innerHTML = setupGraphArea();
  root.log = false;
  root.legend = legend;
  let el = getSVGParent(root);
  let rec = el.getBoundingClientRect();
  let h = parseInt(rec.height);
  let w = parseInt(rec.width);
  let len = 0;
  let idx = 0;
  for (let i = 0; i < set.length; i++) {
    let alen = set[i].arr.length;
    if (alen > len) {
      len = alen;
      idx = i;
    }
  }

  field = field ? field : 'x';

  el.width = w;
  el.height = h;
  let min;
  let max;
  let tx = [];
  let ty = [];
  let ty_log = [];
  let derivs = [];
  if (stack) {
    for (let s = 1; s < set.length; s++) {
      let arr = set[s].arr;
      let arr_prev = set[s - 1].arr;
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr_prev[i][field]) {
          arr[i][field] += arr_prev[i][field];
        }
      }
    }
  }
  for (let s = 0; s < set.length; s++) {
    let der = [];
    let dir = 0;
    let arr = set[s].arr;
    if (min === undefined) {
      min = arr[0][field];
      max = min;
    }
    for (let i = 1; i < arr.length; i++) {
      min = Math.min(arr[i][field], min);
      max = Math.max(arr[i][field], max);
      let delta = arr[i][field] - arr[i - 1][field];
      if (dir === 0) {
        dir = Math.sign(delta);
      } else if (Math.sign(delta) !== 0 && dir !== Math.sign(delta)) {
        dir = Math.sign(delta);
        der.push({ idx: i, dir: dir });
      } else if (i === arr.length - 1) {
        der.push({ idx: i, dir: 0 });
      }
    }
    derivs.push(der);
  }
  let offset = legend ? legend_w : baseOffset;
  let twiceOffset = legend ? legend_w + legend_r : 2 * baseOffset;;

  for (let s = 0; s < set.length; s++) {
    let arr = set[s].arr;
    let xWidth = alignWithUS ? PlaceData.usDays() : arr.length;
    tx[s] = (x) => {
      return offset + (x + xWidth - arr.length) * (w - twiceOffset) / xWidth;
    };
    ty_log[s] = (y) => {
      let logOffset = 1 - min;
      return (h - baseOffset) - Math.log10(y + logOffset) * (h - twiceBaseOffset) / Math.log10(max + logOffset);
    };
    ty[s] = (y) => {
      return (h - baseOffset) - (y - min) * (h - twiceBaseOffset) / (max - min);
    };
  }

  return { min: min, max: max, tx: tx, ty: ty, ty_log: ty_log, derivs: derivs, w: w, h: h, idx: idx };
}

export function initScatter(root, arr) {
  root.className = 'svggraphic';
  root.innerHTML = setupGraphArea();
  let el = getSVGParent(root);
  let rec = el.getBoundingClientRect();
  let h = parseInt(rec.height);
  let w = parseInt(rec.width);
  let xmin = arr[0].x;
  let xmax = arr[0].x;
  let ymin = arr[0].y;
  let ymax = arr[0].y;
  for (let i = 1; i < arr.length; i++) {
    xmin = Math.min(arr[i].x, xmin);
    xmax = Math.max(arr[i].x, xmax);
    ymin = Math.min(arr[i].y, ymin);
    ymax = Math.max(arr[i].y, ymax);
  }
  function tx(x) {
    return baseOffset + (x - xmin) * (w - twiceBaseOffset) / (xmax - xmin);
  }
  function ty(y) {
    return (h - baseOffset) - (y - ymin) * (h - twiceBaseOffset) / (ymax - ymin);
  }
  return { tx: tx, ty: ty, h: h, w: w };
}

export function drawLines(parent, set, colors, txa, tya, tyloga, w, h, min, max, idx, field, ranges) {
  let el = getSVGParent(parent);
  el.innerHTML = '';
  let svg = ['<svg version="1.2" width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="graph" role="img">'];
  let zx = txa[0](0);
  let zy = parent.log ? tyloga[0](0) : tya[0](0);
  let top = parent.log ? tyloga[0](max) : tya[0](max);
  let bottom = parent.log ? tyloga[0](min) : tya[0](min);
  field = field ? field : 'x';

  let length = 0;
  let thisOne;
  for (let s = 0; s < set.length; s++) {
    let shelter = PlaceData.getLockdownRange(set[s].fips);
    let masks = PlaceData.getMaskRange(set[s].fips);
    if (shelter.length + masks.length > length) {
      thisOne = s;
      length = shelter.length + masks.length;
    }
  }
  if (thisOne !== undefined) {
    length = set[thisOne].arr.length;
    let start = 0;
    let fips = set[thisOne].fips;
    let isSheltered = false;
    let shelter = PlaceData.getLockdownRange(fips);
    let color;
    let tx = txa[thisOne];
    for (let i = 0; i < shelter.length; i++) {
      color = isSheltered ? colors.shelter : colors.background;
      svg.push('<rect y="' + top + '" opacity="50%" x="' + (tx(start)) + '" width="' + (tx(length + shelter[i]) - tx(start)) + '" height="' + (bottom - top) + '" fill="' + color + '" />');
      isSheltered = !isSheltered;
      start = shelter[i] + length;
    }
    color = isSheltered ? colors.shelter : colors.background;
    svg.push('<rect y="' + top + '" opacity="50%" x="' + (tx(start)) + '" width="' + (w - tx(start)) + '" height="' + (bottom - top) + '" fill="' + color + '" />');
    let isMasked = false;
    let mask = PlaceData.getMaskRange(fips);
    for (let i = 0; i < mask.length; i++) {
      if (isMasked) {
        color = colors.masked;
        svg.push('<rect y="' + top + '" opacity="50%" x="' + (tx(start)) + '" width="' + (tx(length + shelter[i]) - tx(start)) + '" height="' + (bottom - top) + '" fill="' + color + '" />');
      }
      isMasked = !isMasked;
      start = mask[i] + length;
    }
    if (isMasked) {
      color = colors.masked;
      svg.push('<rect y="' + top + '" opacity="50%" x="' + (tx(start)) + '" width="' + (w - tx(start)) + '" height="' + (bottom - top) + '" fill="' + color + '" />');
    }
  }

  if (parent.legend) {
    svg.push('<polyline fill="none" stroke="' + colors.zero + '" stroke-width="2" points="');
    svg.push(zx + ', ' + top);
    svg.push(zx + ', ' + bottom + '"/>');
    svg.push('<polyline fill="none" stroke="' + colors.zero + '" stroke-width="2" points="');
    svg.push(zx + ', ' + zy);
    svg.push((w - 2) + ', ' + zy + '"/>');
    let decade = Math.round(Math.log10(max));
    let p10 = Math.pow(10, decade);
    let scaleTop = Math.round(max / p10) * p10;
    let step = scaleTop / (parent.log ? 5 : 10);
    zx--;
    if (!step) {
      step = max;
    }
    for (let i = step; i <= max; i += step) {
      zy = parent.log ? tyloga[0](i) : tya[0](i);
      svg.push('<polyline fill="none" stroke="' + colors.level + '" stroke-width="1" stroke-dasharray="2 2" points="');
      svg.push(zx + ', ' + zy);
      svg.push((w - 2) + ', ' + zy + '"/>');
      svg.push('<text x="' + zx + '" y="' + zy + '" font-size="50%" dominant-baseline="middle" text-anchor="end" fill="' + colors.level + '">' + Numbers.prettyPrint(i, true) + '</text>');
    }
    for (let i = -step; i >= min; i -= step) {
      zy = parent.log ? tyloga[0](i) : tya[0](i);
      svg.push('<polyline fill="none" stroke="' + colors.level + '" stroke-width="1" stroke-dasharray="2 2" points="');
      svg.push(zx + ', ' + zy);
      svg.push((w - 2) + ', ' + zy + '"/>');
      svg.push('<text x="' + zx + '" y="' + zy + '" font-size="50%" dominant-baseline="middle" text-anchor="end" fill="' + colors.level + '">' + Numbers.prettyPrint(i, true) + '</text>');
    }
  }

  for (let s = 0; s < set.length; s++) {
    let arr = set[s].arr;
    let color = colors['line' + s];
    let tx = txa[s];
    let ty = tya[s];
    let tylog = tyloga[s];
    svg.push('<g>');
    svg.push('<polyline fill="none" stroke="' + color + '" stroke-width="5" points="');
    for (let i = 0; i < arr.length; i++) {
      svg.push(tx(i) + ', ' + (parent.log ? tylog(arr[i][field]) : ty(arr[i][field])));
    }

    svg.push('" />');
    if (parent.length) {
      for (let i = 0; i < arr.length; i++) {
        let d = arr[i].date;
        let day = d.slice(-2);
        if (day === '01' || day === '15') {
          svg.push('<circle cx="' + tx(i) + '" cy="' + (parent.log ? tylog(arr[i][field]) : ty(arr[i][field])) + '" r="' + 5 + '" fill="black" stroke="' + color + '" stroke-width="5" />');
        }
      }
      svg.push('</g>');
    }
  }
  if (parent.legend) {
    if (!parent.mouseX) {
      parent.mouseX = w - legend_r;
    }

    parent.mouseX = Math.max(legend_w, Math.min(w - legend_r, parent.mouseX));
    svg.push('<polyline fill="none" stroke="' + colors.zero + '" stroke-width="2" points="');
    svg.push(parent.mouseX + ', ' + top);
    svg.push(parent.mouseX + ', ' + bottom + '"/>');
    svg.push('<rect x="' + (parent.mouseX) + '" width="199" y="' + top + '" height="' + (bottom - top) + '" opacity="70%" />');
    let arrIdx = Math.round((parent.mouseX - legend_w) / (w - legend_w - baseOffset) * set[idx].arr.length);
    arrIdx = Math.min(arrIdx, set[idx].arr.length - 1);
    arrIdx = Math.max(arrIdx, 0);
    let delta = set[idx].arr.length - arrIdx;
    let date = Dates.prettyPrint(set[idx].arr[arrIdx].date, true);
    svg.push('<text x="' + (parent.mouseX - 1) + '" y="12" font-size="50%" text-anchor="start" dominant-baseline="middle" fill="' + colors.level + '">' + date + '</text>');
    let values = [];
    for (let i = 0; i < set.length; i++) {
      let arrIdx = set[i].arr.length - delta;
      if (arrIdx >= 0) {
        let val = set[i].arr[set[i].arr.length - delta][field];
        values.push([val, Numbers.prettyPrint(val, true), Text.firstCaps(set[i].shortText) + ' (' + Text.firstCaps(ranges[i].text) + ')', colors['line' + i]]);
      }
    }
    values.sort((a, b) => { return b[0] - a[0] });
    for (let i = 0; i < values.length; i++) {
      svg.push('<text x="' + (parent.mouseX) + '" y="' + (30 + 40 * i) + '" text-anchor="start" dominant-baseline="middle" fill="' + values[i][3] + '">' + values[i][1] + '</text>');
      svg.push('<text x="' + (parent.mouseX) + '" y="' + (50 + 40 * i) + '" font-size="50%" text-anchor="start" dominant-baseline="middle" fill="' + values[i][3] + '">' + values[i][2] + '</text>');
    }
    zy = parent.log ? tyloga[0](0) : tya[0](0);
    svg.push('<g id="log">');
    svg.push('<text x="' + (zx - 1) + '" y="' + (zy - 20) + '" dominant-baseline="middle" font-size="75%" text-anchor="end" fill="white" opacity="' + (parent.log ? 1.0 : 0.5) + '">log</text>');
    svg.push('<text x="' + (zx - 1) + '" y="' + zy + '" dominant-baseline="middle" font-size="75%" text-anchor="end" fill="white" opacity="' + (parent.log ? 0.5 : 1.0) + '">linear</text>');
    svg.push('</g>');
  }
  svg.push('</svg>');
  el.innerHTML = svg.join('\n');

  function redraw() {
    drawLines(parent, set, colors, txa, tya, tyloga, w, h, min, max, idx, field, ranges);
  }

  if (parent.legend) {
    let el = parent.querySelector('svg');
    el.addEventListener('mousemove', (e) => {
      if (e.offsetX >= legend_w && parent.mouseX !== e.offsetX) {
        parent.mouseX = e.offsetX;
        redraw();
      }
    });
    el.addEventListener('click', (e) => {
      if (e.offsetX >= legend_w && parent.mouseX !== e.offsetX) {
        parent.mouseX = e.offsetX;
        redraw();
      }
    });

    el = parent.querySelector('#log');
    el.addEventListener('click', () => {
      parent.log = !parent.log;
      redraw();
    });
  }
}

export function drawScatter(parent, arr, colors, tx, ty, w, h) {
  let el = getSVGParent(parent);
  let svg = ['<svg version="1.2" width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="graph" role="img">'];
  svg.push('<g><polyline fill="none" stroke="' + colors.label + '" stroke-width="2" points="');
  svg.push('0, 0');
  svg.push('0, ' + (h - 2));
  svg.push((w - 2) + ', ' + (h - 2) + '"');
  svg.push('</polyline></g>');
  svg.push('<g>');
  let popText = '';
  let infoText = '';
  let color;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].state === arr[i].county) {
      popText = Text.firstCaps(arr[i].county);
      color = colors.good;
    } else {
      popText = Text.firstCaps(arr[i].county + ', ' + arr[i].state);
      color = colors.bad;
    }
    infoText = Text.firstCaps(arr[i].f1 + ':' + Numbers.prettyPrint(arr[i].x, true) + ' ' + arr[i].f2 + ':' + Numbers.prettyPrint(arr[i].y, true));
    svg.push('<g id="label' + i + '" class="graphText opacityZero">');
    svg.push('<text x="5" y="25" font-size="125%" fill="' + colors.label + '">' + popText + '</text>');
    svg.push('<text x="5" y="45" font-size="85%" fill="' + colors.label + '">' + infoText + '</text>');
    svg.push('</g>');
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].state === arr[i].county) {
      popText = Text.firstCaps(arr[i].county);
      color = colors.good;
    } else {
      popText = Text.firstCaps(arr[i].county + ', ' + arr[i].state);
      color = colors.bad;
    }
    svg.push('<circle class="circle" id="circle' + i + '" cx="' + tx(arr[i].x) + '" cy="' + ty(arr[i].y) + '" r="' + baseOffset + '" fill="' + color + '">');
    svg.push('<title>' + popText + '</title></circle>');
  }
  svg.push('</g>');
  svg.push('</svg>');
  el.innerHTML = svg.join('\n');

  function mouseOver(idx) {
    let l = parent.querySelector('#label' + idx);
    l.classList.remove('opacityZero');
    let c = parent.querySelectorAll('.circle');
    for (let i = 0; i < c.length; i++) {
      if (i !== idx) {
        c[i].classList.add('opacityFifty');
      }
    }
  }

  function mouseOut(idx) {
    let l = parent.querySelector('#label' + idx);
    l.classList.add('opacityZero');
    let c = parent.querySelectorAll('.circle');
    for (let i = 0; i < c.length; i++) {
      if (i !== idx) {
        c[i].classList.remove('opacityFifty');
      }
    }
  }

  for (let i = 0; i < arr.length; i++) {
    let c = parent.querySelector('#circle' + i);
    c.addEventListener('mouseover', () => {
      mouseOver(i);
    });
    c.addEventListener('mouseout', () => {
      mouseOut(i);
    });
  }
}