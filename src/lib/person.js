// (c) Cory Ondrejka 2020
'use strict'

import * as Colors from './util/colors.js?cachebust=54836';
import * as Numbers from './util/numbers.js?cachebust=54836';
import * as Text from './util/text.js?cachebust=54836';

function createDiv(l, t, w, h, br, bc) {
  let el = document.createElement('div');
  el.style.position = 'absolute';
  el.style.left = l + 'em';
  el.style.top = t + 'em';
  el.style.width = w + 'em';
  el.style.height = h + 'em';
  if (br) {
    el.style.borderRadius = br;
  }
  if (bc) {
    el.style.backgroundColor = bc;
  }
  return el;
}

function buildPerson(scale, colors) {
  let base = document.createElement('div');
  base.className = 'stickster';
  base.style.position = 'relative';
  base.style.fontSize = '10em';
  base.style.width = 0.1 * scale + 'em';
  base.style.paddingLeft = 0.1 * scale + 'em';
  base.style.height = 0.3 * scale + 'em';
  base.style.paddingTop = 0.3 * scale + 'em';
  if (!colors) {
    colors = [{ color: '#fff', val: 1.0 }];
  }
  colors.sort((a, b) => { return b.val - a.val });
  let s = document.createElement('div');
  s.style.position = 'absolute';
  s.style.transform = 'scale(' + (scale / 10) + ')';
  base.appendChild(s);
  let start = 0;
  for (let i = 1; i < colors.length; i++) {
    if (colors[i].val <= 1.0) {
      break;
    }
    start++;
  }
  for (let i = start; i < colors.length; i++) {
    if (colors[i].val <= 0) {
      break;
    }
    let height = 5 * Math.min(1.0, colors[i].val);
    let clip = createDiv(-0.9, 0, 1.8, height);
    clip.style.overflow = 'hidden';
    let color = colors[i].color;
    clip.appendChild(createDiv(0.4, 0, 1, 1, '50%', color));
    clip.appendChild(createDiv(0.4, 1.1, 1, 2, 0, color));
    clip.appendChild(createDiv(0, 1.1, 1.8, 0.6, '0.3em', color));
    clip.appendChild(createDiv(0, 1.2, 0.3, 1.7, '0.15em', color));
    clip.appendChild(createDiv(1.5, 1.2, 0.3, 1.7, '0.15em', color));
    clip.appendChild(createDiv(0.4, 2.5, 0.45, 2.5, '0.225em', color));
    clip.appendChild(createDiv(0.95, 2.5, 0.45, 2.5, '0.225em', color));
    s.appendChild(clip);
  }
  return base;
}

function person(rootEl, count, colors) {
  let container = document.createElement('div');
  container.className = 'lineosticks';
  container.style.position = 'relative';
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.width = '100%';
  if (!colors) {
    colors = [
      { color: '#f00', val: Math.random() },
      { color: '#0f0', val: Math.random() },
      { color: '#ff0', val: Math.random() },
      { color: '#00f', val: Math.random() },
      { color: '#0ff', val: Math.random() },
      { color: '#f0f', val: Math.random() },
      { color: '#fff', val: 1.0 },
    ];
  }
  colors.sort((a, b) => { return b.val - a.val });
  for (let i = 0; i < colors.length; i++) {
    colors[i].val *= count;
  }
  for (let i = 0; i < count; i++) {
    let p = buildPerson(0.25, colors);
    container.appendChild(p);
    for (let i = 0; i < colors.length; i++) {
      colors[i].val--;
    }
  }
  rootEl.appendChild(container);
}

function addLegend(el, fields, colors) {
  let leg = document.createElement('div');
  leg.className = 'legend';
  if (!fields) {
    fields = [undefined];
  }
  for (let i = fields.length - 1; i >= 0; i--) {
    let row = document.createElement('div');
    row.className = 'legendrow';
    row.textContent = Text.firstCaps(fields[i].t + ': ' + Numbers.prettyPrint(fields[i].val));
    row.style.color = colors['line' + i];
    leg.appendChild(row);
  }
  el.appendChild(leg);
}


export default function people(rootEl, values, count) {
  rootEl.innerHTML = '';
  let colorsList = Colors.LineColors;
  let colors = [];
  let total = 1;
  for (let i = 0; i < values.length; i++) {
    colors.push({ color: colorsList['line' + i], val: total });
    total -= values[i].val;
  }
  rootEl.className = 'graphic';
  colors.push({ color: '#fff', val: total });
  person(rootEl, count ? count : 100, colors);
  addLegend(rootEl, values, colorsList);
}