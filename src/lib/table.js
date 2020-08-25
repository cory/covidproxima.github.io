// (c) Cory Ondrejka 2020
'use strict'

import Animate from './animate.js?cachebust=02822';
import Sparkline from './graph/sparkline.js?cachebust=02822';
import * as Numbers from './util/numbers.js?cachebust=02822';
import * as Text from './util/text.js?cachebust=02822';

const upTriangle = '▴';
const downTriangle = '▾';

let ID = 1;

export default function render(el, arr, shortText, upGood, count, places, field) {
  let existing = el.getElementsByClassName('table');
  for (let i = 0; i < existing.length; i++) {
    el.removeChild(existing[i]);
  }
  if (!el.sortBy) {
    el.sortBy = { order: true, field: 'd' };
  }
  let div = document.createElement('div');
  div.className = 'table';
  el.sparkCache = [];
  if (!el.tableID) {
    el.tableID = ID++;
  }
  if (el.children[0] || el.cache) {
    if (el.children[0]) {
      el.cache = el.children[0];
      div.appendChild(el.cache);
    } else {
      div.appendChild(el.cache);
    }
  }
  el.appendChild(div);
  let row = document.createElement('div');
  row = document.createElement('div');
  row.className = 'theader';
  div.appendChild(row);
  let span = document.createElement('span');
  span.className = 'tplace';
  span.addEventListener('click', (e) => {
    if (el.sortBy.field === 'county') {
      el.sortBy.order = !el.sortBy.order;
    } else {
      el.sortBy = { order: false, field: 'county' };
    }
    rerender(arr);
    return false;
  });
  row.appendChild(span);
  span = document.createElement('span');
  span.className = 'tvalue';
  span.textContent = shortText;
  span.addEventListener('click', (e) => {
    if (el.sortBy.field === 'd') {
      el.sortBy.order = !el.sortBy.order;
    } else {
      el.sortBy = { order: true, field: 'd' };
    }
    rerender(arr);
    return false;
  });
  row.appendChild(span);
  if (arr[0] && arr[0].delta !== undefined) {
    span = document.createElement('span');
    span.className = 'tdelta';
    span.textContent = 'w/w';
    span.addEventListener('click', (e) => {
      if (el.sortBy.field === 'delta') {
        el.sortBy.order = !el.sortBy.order;
      } else {
        el.sortBy = { order: true, field: 'delta' };
      }
      rerender(arr);
      return false;
    });
  }
  row.appendChild(span);
  span = document.createElement('span');
  span.className = 'tspark';
  row.appendChild(span);
  let scroll = document.createElement('div');
  scroll.className = 'tscroll';
  div.appendChild(scroll);
  let c = count ? count : 5;
  scroll.style.height = (0.5 + parseInt(c) * 1.5) + 'em';
  if (arr.length) {
    let show = arr.length - 1;
    add(0, show);
  }

  let sf = (t, l) => {
    for (let i = 0; i < 10; i++) {
      if (!el.sparkCache.length) {
        return;
      }
      let c = el.sparkCache.shift();
      Sparkline(c.c, c.arr, c.fips, field);
    }
    return el.sparkCache.length
  };

  Animate(sf, 0, el.tableID);

  function add(i, e) {
    let delta = i <= e ? 1 : -1;
    while (i * delta <= e * delta) {
      row = document.createElement('div');
      row.className = 'trow';
      let span = document.createElement('span');
      span.className = 'tplace';
      let place = arr[i].state === arr[i].county ? arr[i].state : arr[i].county + ', ' + arr[i].state;
      let anchor = document.createElement('a');
      anchor.textContent = Text.firstCaps(place);
      if (arr[i].state === arr[i].county) {
        anchor.href = '#states.' + arr[i].state.replace(/ /g, '-');
      } else {
        anchor.href = '#states.' + arr[i].state.replace(/ /g, '-') + '.' + arr[i].fips.replace(/ /g, '-');
      }
      span.appendChild(anchor);
      row.appendChild(span);
      span = document.createElement('span');
      span.className = 'tvalue';
      span.textContent = Numbers.prettyPrint(arr[i].d, true);
      row.appendChild(span);
      if (arr[i].delta !== undefined) {
        span = document.createElement('span');
        let color;
        if (upGood) {
          color = arr[i].delta >= 0 ? 'good' : 'bad';
        } else {
          color = arr[i].delta < 0 ? 'good' : 'bad';
        }
        span.className = 'tdelta ' + color;
        let triangle = arr[i].delta >= 0 ? upTriangle : downTriangle;
        span.textContent = triangle + ' ' + Numbers.prettyPrint(Math.abs(arr[i].delta), true);
        row.appendChild(span);
      }
      span = document.createElement('span');
      span.className = 'tspark';
      let canvas = document.createElement('canvas');
      canvas.className = 'tcanvas'
      el.sparkCache.push({ c: canvas, arr: places[arr[i].fips].daily, fips: arr[i].fips });
      span.appendChild(canvas);
      row.appendChild(span);
      scroll.appendChild(row);
      i += delta;
    }
  }

  function rerender(arr) {
    arr.sort((a, b) => {
      if (el.sortBy.field === 'county') {
        if (el.sortBy.order) {
          return b.county.localeCompare(a.county);
        } else {
          return a.county.localeCompare(b.county);
        }
      } else {
        if (el.sortBy.order) {
          return b[el.sortBy.field] - a[el.sortBy.field];
        } else {
          return a[el.sortBy.field] - b[el.sortBy.field];
        }
      }
    });
    render(el, arr, shortText, upGood, count, places, field);
  }
}