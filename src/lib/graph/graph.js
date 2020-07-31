// (c) Cory Ondrejka 2020
'use strict'
import * as PlaceData from '../../data/data.js';
import * as Dates from '../util/dates.js';
import * as Numbers from '../util/numbers.js';
import * as Text from '../util/text.js';

const offset = 4;
const twiceOffset = 2 * offset;

export function init(el, arr, alignWithUS, field) {
  field = field ? field : 'x';
  let xWidth = alignWithUS ? PlaceData.usDays() : arr.length;
  let rec = el.parentElement.getBoundingClientRect();
  el.className = '';
  let h = parseInt(rec.height);
  let w = parseInt(rec.width);
  el.width = w;
  el.height = h;
  let min = arr[0][field];
  let max = arr[0][field];
  for (let i = 1; i < arr.length; i++) {
    min = Math.min(arr[i][field], min);
    max = Math.max(arr[i][field], max);
  }
  function tx(x) {
    return (x + xWidth - arr.length) * (w) / xWidth;
  }
  function ty(y) {
    return (h - offset) - (y - min) * (h - twiceOffset) / (max - min);
  }
  return { ctx: el.getContext("2d"), min: min, max: max, tx: tx, ty: ty };
}

export function initScatter(el, arr) {
  el.className = 'scatter graphic';
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
    return offset + (x - xmin) * (w - twiceOffset) / (xmax - xmin);
  }
  function ty(y) {
    return (h - offset) - (y - ymin) * (h - twiceOffset) / (ymax - ymin);
  }
  return { tx: tx, ty: ty };
}

export function initMulti(el, set, alignWithUS, field) {
  el.parentElement.className = 'graphic';
  field = field ? field : 'x';
  let computed = getComputedStyle(el.parentElement);
  el.className = '';
  let h = parseInt(computed.height);
  let w = parseInt(computed.width);
  el.width = w;
  el.height = h;
  let min;
  let max;
  let tx = [];
  let ty = [];
  let derivs = [];
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
  let log = false;
  if (max >= 0 && min >= 0 && Math.abs(max / Math.max(1, Math.abs(min))) > 100000) {
    log = true;
  }
  for (let s = 0; s < set.length; s++) {
    let arr = set[s].arr;
    let xWidth = alignWithUS ? PlaceData.usDays() : arr.length;
    tx[s] = (x) => {
      return offset + (x + xWidth - arr.length) * (w - twiceOffset) / xWidth;
    };
    if (log) {
      ty[s] = (y) => {
        let logOffset = 1 - min;

        return (h - offset) - Math.log10(y + logOffset) * (h - twiceOffset) / Math.log10(max + logOffset);
      };
    } else {
      ty[s] = (y) => {
        return (h - offset) - (y - min) * (h - twiceOffset) / (max - min);
      };
    }
  }

  return { ctx: el.getContext("2d"), min: min, max: max, tx: tx, ty: ty, derivs: derivs, log: log };
}

export function init2d(el, arr, fieldx, fieldy) {
  el.parentElement.className = 'graphic';
  let rec = el.parentElement.getBoundingClientRect();
  el.className = '';
  let h = parseInt(rec.height);
  let w = parseInt(rec.width);
  el.width = w;
  el.height = h;
  let minx = arr[0][fieldx];
  let maxx = arr[0][fieldx];
  let miny = arr[0][fieldy];
  let maxy = arr[0][fieldy];
  for (let i = 1; i < arr.length; i++) {
    minx = Math.min(arr[i][fieldx], minx);
    maxx = Math.max(arr[i][fieldx], maxx);
    miny = Math.min(arr[i][fieldy], miny);
    maxy = Math.max(arr[i][fieldy], maxy);
  }
  function tx(x) {
    return offset + (x - xmin) * (w - twiceOffset) / (maxx - minx);
  }
  function ty(y) {
    return (h - offset) - (y - min) * (h - twiceOffset) / (maxy - miny);
  }
  return { ctx: el.getContext("2d"), min: minx, max: maxx, tx: tx, ty: ty };
}

export function addLabelsLine(el, zeroY, topY, topValue, keys, colors, set, ranges, tx, idx) {
  let existing = el.parentElement.getElementsByClassName('glabel');
  for (let i = 0; i < existing.length; i++) {
    el.parentElement.removeChild(existing[i]);
  }
  el.parentElement.style.position = 'relative';
  let div = document.createElement('div');
  div.className = 'glabel';
  div.style.width = el.width + 'px';
  div.style.height = el.height + 'px';
  let label = document.createElement('div');
  label.className = 'labely';
  label.style.top = topY + 'px';
  label.textContent = Numbers.prettyPrint(topValue, true);
  div.appendChild(label);
  label = document.createElement('div');
  label.className = 'labely';
  label.style.top = zeroY + 'px';
  label.textContent = '0';
  div.appendChild(label);
  let voffset = 0;
  let vwin = 10;

  function check(p, coll, win) {
    for (let i = 0; i < coll.length; i++) {
      if (Math.abs(p - coll[i]) < win) {
        coll = [];
        return true;
      }
    }
    coll.push(p);
    return false;
  }

  let endLabels = [];
  for (let s = 0; s < set.length; s++) {
    endLabels.push({
      y: keys[s][0][3],
      s: s,
      val: Numbers.prettyPrint(keys[s][0][2], true),
      text: set[s].shortText + ' (' + ranges[s].text + ')'
    });
  }

  endLabels.sort((a, b) => { return a.y - b.y; });
  let ypos = 0;
  for (let i = 0; i < endLabels.length; i++) {
    label = document.createElement('div');
    label.style.top = ypos + 'px';
    label.className = 'labelKeyYBig';
    label.style.color = colors['line' + endLabels[i].s];
    label.style.marginLeft = el.width + 'px';
    label.textContent = endLabels[i].val;
    let subtext = document.createElement('div');
    subtext.className = 'labelKeyYSmall';
    subtext.textContent = endLabels[i].text;
    label.appendChild(subtext);
    div.appendChild(label);
    if (i < endLabels.length - 1) {
      ypos += el.height / 5;
    }
  }
  if (keys.length <= 2) {
    for (let s = 0; s < keys.length; s++) {
      let vcollision = [];
      let pos;
      for (let i = 1; i < keys[s].length; i++) {
        label = document.createElement('div');
        label.className = 'labelKeyY';
        pos = keys[s][i][3];
        label.style.top = pos + 'px';
        voffset = check(pos, vcollision, vwin) ? voffset + 6 : voffset;
        label.className = 'labelKeyY';
        label.style.marginLeft = voffset + 'em';
        label.textContent = Numbers.prettyPrint(keys[s][i][2], true);
        div.appendChild(label);
      }
      voffset += 6;
    }
  }
  for (let i = 1; i < set[idx].arr.length; i++) {
    let entry = set[idx].arr[i];
    let d = entry.date;
    if (d.slice(-2) === '01') {
      let pos = tx[idx](i);
      label = document.createElement('div');
      label.className = 'labelKeyX';
      pos = el.width - pos;
      label.style.right = pos + 'px';
      label.textContent = Dates.prettyPrint(d, true);
      div.appendChild(label);
    }
  }
  el.parentElement.appendChild(div);
}

export function drawBackground(ctx, w, h, colors, showShelter, fips, length, tx) {
  let start = 0;
  let isSheltered = false;
  if (showShelter) {
    let shelter = PlaceData.getLockdownRange(fips);
    for (let i = 0; i < shelter.length; i++) {
      ctx.fillStyle = isSheltered ? colors.shelter : colors.background;
      ctx.fillRect(tx(start), 0, tx(length + shelter[i]) - tx(start), h);
      isSheltered = !isSheltered;
      start = shelter[i] + length;
    }
    ctx.fillStyle = isSheltered ? colors.shelter : colors.background;
    ctx.fillRect(tx(start), 0, w - tx(start), h);
  } else {
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, w, h);
  }
}

export function drawBackgroundMulti(ctx, w, h, colors, showShelter, set, tx) {
  let length = 0;
  let thisOne;
  for (let s = 0; s < set.length; s++) {
    let shelter = PlaceData.getLockdownRange(set[s].fips);
    if (shelter.length > length) {
      thisOne = s;
      length = shelter.length;
    }
  }
  if (thisOne) {
    drawBackground(ctx, w, h, colors, showShelter, set[thisOne].fips, set[thisOne].arr.length, tx[thisOne]);
  }
}

export function drawZero(ctx, w, colors, ty) {
  ctx.strokeStyle = colors.zero;
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(offset, ty(0) + offset);
  ctx.lineTo(w - offset, ty(0) + offset);
  ctx.stroke();
}

export function drawLevels(ctx, w, h, len, colors, tx, ty, levels) {
  ctx.strokeStyle = colors.level;
  ctx.lineWidth = 1;
  ctx.setLineDash([1, 1]);
  let top;
  for (let i = 0; i < levels.length; i++) {
    let y = ty(levels[i]) + offset;
    if (top === undefined || top > y) {
      top = y;
    }
    ctx.beginPath();
    ctx.moveTo(offset, y);
    ctx.lineTo(w - offset, y);
    ctx.stroke();
  }
  for (let i = 7; i < len; i += 7) {
    ctx.beginPath();
    ctx.moveTo(tx(i), offset);
    ctx.lineTo(tx(i), h - offset);
    ctx.stroke();
  }
  return top;
}

export function drawZeroes(ctx, w, h, colors, tx, ty) {
  ctx.strokeStyle = colors.base;
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(0, ty(0) + offset);
  ctx.lineTo(w, ty(0) + offset);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(tx(0) + offset, 0);
  ctx.lineTo(tx(0) + offset, h);
  ctx.stroke();
}

export function drawKeyDerivs(ctx, set, h, colors, tx, ty, derivs, field) {
  field = field ? field : 'x';
  let keySpots = [];
  ctx.strokeStyle = colors.guide;
  ctx.lineWidth = 1;
  ctx.setLineDash([1, 1]);
  for (let s = 0; s < set.length; s++) {
    keySpots[s] = []
    let arr = set[s].arr;
    let der = derivs[s];
    let top = arr[0][field], thisOneT, thisOneB, bottom;
    for (let i = 0; i < der.length - 1; i++) {
      if (der[i].dir === -1) {
        if (arr[der[i].idx][field] > top && arr[der[i].idx][field] > arr[arr.length - 1][field]) {
          top = arr[der[i].idx][field];
          thisOneT = der[i].idx;
          thisOneB = undefined;
          bottom = top;
        }
      } else if (der[i].dir === 1) {
        if (thisOneT) {
          bottom = arr[der[i].idx][field];
          thisOneB = der[i].idx;
        }
      } else if (thisOneB) {
        if (bottom > arr[der[i].idx][field]) {
          thisOneB = undefined;
        }
      }
    }
    let yarr = [], y;
    y = ty[s](arr[arr.length - 1][field]) + offset;
    keySpots[s].push([arr[arr.length - 1].date, tx[s](arr.length - 1) + offset, arr[arr.length - 1][field], y]);
    if (set.length <= 2) {
      if (thisOneT) {
        y = ty[s](arr[thisOneT][field]) + offset;
        yarr.push(y);
        keySpots[s].push([arr[thisOneT].date, tx[s](thisOneT) + offset, arr[thisOneT][field], y]);
        ctx.beginPath();
        ctx.moveTo(offset, y);
        ctx.lineTo(tx[s](thisOneT) + offset, y);
        ctx.stroke();
      }
      if (thisOneB) {
        let skip = false;
        y = ty[s](arr[thisOneB][field]) + offset;
        for (let j = 0; j < yarr.length; j++) {
          if (Math.abs(y - yarr[j]) / h < 0.1) {
            skip = true;
            break;
          }
        }
        if (!skip) {
          keySpots[s].push([arr[thisOneB].date, tx[s](thisOneB) + offset, arr[thisOneB][field], y]);
          ctx.beginPath();
          ctx.moveTo(offset, y);
          ctx.lineTo(tx[s](thisOneB) + offset, y);
          ctx.stroke();
        }
      }
    }
  }
  return keySpots;
}

export function drawAxes(ctx, w, h, colors) {
  ctx.strokeStyle = colors.base;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(0, h - 1);
  ctx.lineTo(w, h - 1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, h);
  ctx.stroke();
}

export function drawLine(ctx, arr, colors, tx, ty, step, width, field) {
  field = field ? field : 'x';
  step = step ? step : 1;
  let color = colors.line;
  ctx.lineWidth = width;
  if (step >= arr.length) {
    step = 1;
  }
  if (step >= arr.length) {
    return;
  }
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(tx(0), ty(arr[0][field]) + offset - width / 2);
  for (let i = step; i < arr.length; i += step) {
    ctx.lineTo(tx(i), ty(arr[i][field]) + offset - width / 2);
  }
  ctx.stroke();
}

export function drawSmoothedLine(ctx, arr, colors, tx, ty, step, width, field) {
  field = field ? field : 'x';
  step = step ? step : 1;
  let color = colors.box;
  ctx.lineWidth = width;
  if (step >= arr.length) {
    step = 1;
  }
  if (step >= arr.length) {
    return;
  }
  let average = [];
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.setLineDash([]);
  for (let i = 0; i < arr.length; i += step) {
    let row = {};
    let total = 0;
    for (let j = i; j >= Math.max(0, i - 6); j--) {
      total += arr[j][field];
    }
    total /= 7;

    row[field] = total;
    average.push(row);
    let y = ty(arr[i][field]) + offset - width / 2;
    ctx.rect(tx(i), y, 1, ty(0) - y);
  }
  ctx.stroke();
  drawLine(ctx, average, colors, tx, ty, step, 4, field);
}

export function drawScatter(parent, arr, colors, tx, ty) {
  parent.innerHTML = '';
  for (let i = 0; i < arr.length; i++) {
    let spot = document.createElement('div');
    spot.className = 'dot';
    spot.style.borderColor = arr[i].state === arr[i].county ? colors.good : colors.bad;
    spot.style.left = tx(arr[i].x) + 'px';
    spot.style.top = ty(arr[i].y) + 'px';
    let popText = '';
    if (arr[i].state === arr[i].county) {
      popText = Text.firstCaps(arr[i].county);
      if (arr.length < 100) {
        let span = document.createElement('span');
        span.textContent = popText;
        spot.appendChild(span);
      }
    } else {
      popText = Text.firstCaps(arr[i].county + ', ' + arr[i].state);
    }
    popText += ' ';
    let popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = popText + arr[i].f1 + ':' + Numbers.prettyPrint(arr[i].x, true) + ' ' + arr[i].f2 + ':' + Numbers.prettyPrint(arr[i].y, true);
    spot.appendChild(popup);
    parent.appendChild(spot);
  }
}

export function addLegend(el, ranges, colors) {
  let existing = el.parentElement.getElementsByClassName('legend');
  for (let i = 0; i < existing.length; i++) {
    el.parentElement.removeChild(existing[i]);
  }
  el.parentElement.style.position = 'relative';

  let leg = document.createElement('div');
  leg.className = 'legend';
  if (!ranges) {
    ranges = [undefined];
  }
  for (let i = 0; i < ranges.length; i++) {
    let row = document.createElement('div');
    row.className = 'legendrow';
    let tbox = document.createElement('div');
    let cbox = document.createElement('div');
    cbox.className = 'cbox';
    cbox.style.backgroundColor = colors['line' + i];
    if (ranges[i]) {
      tbox.className = 'tbox';
      tbox.textContent = ranges[i].text;
      row.appendChild(tbox);
    }
    row.appendChild(cbox);
    leg.appendChild(row);
  }
  el.parentNode.appendChild(leg);
}