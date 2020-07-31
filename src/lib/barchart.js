// (c) Cory Ondrejka 2020
'use strict'

function graph(id, max, log, values, colors, ratio) {
  let cid = document.getElementById(id);
  let rec = cid.getBoundingClientRect();
  let h = rec.height;
  let w = rec.width;
  cid.width = w;
  cid.height = h;
  let ctx = cid.getContext("2d");
  ctx.fillStyle = colors.b;
  ctx.fillRect(0, 0, w, h);
  function tx(x) {
    return x * w / max.x;
  }
  function tyf(y) {
    y -= max.minf;
    if (log) {
      return h - Math.log10(y) * h / Math.log10(max.f - max.minf);
    } else {
      return h - y * h / (max.f - max.minf);
    }
  }
  function tys(y) {
    if (log) {
      return h - Math.log10(y) * h / Math.log10(max.s) * 0.5;
    } else {
      return h - y * h / max.s * 0.5 + h / (max.f - max.minf) * max.minf;
    }
  }

  for (let l = 1; l < Math.min((values.length) * ratio, values.length) ; l++) {
    ctx.fillStyle = colors.f;
    ctx.fillRect(tx(l),tyf(0),tx(1)*0.8,tyf(values[l].f)-tyf(0));
    ctx.strokeStyle = colors.s;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tx(l), tys(values[l-1].s));
    ctx.lineTo(tx(l+1), tys(values[l].s));
    ctx.stroke();
  }
}

let themeColors = {
  f: '#f21c2d',
  s: 'RGBA(22,25,18,0.7)',
  b: '#dee2dd'
};

let divergentColors = [
  '#f21c2d',
  '#fd685b',
  '#ff9b8d',
  '#ffc9c0',
  '#f6f6f6',
  '#d2f7ce',
  '#a9f7a5',
  '#78f57c',
  '#1cf24d'
];

export default function StateShelterVsData(data, field) {
  let max = { x: 0, f: 0, s: 0 };
  let vertSpace = 1.1;
  let dates = {};
  let firstDayWith10Cases = data['united states'].firstDate;
  for (let i=0; i < data['united states'].daily.length; i++) {
    if (data['united states'].daily[i].cases >= 10) {
      firstDayWith10Cases = data['united states'].daily[i].date;
      break;
    }
  }
  for (let f in data) {
    if (data[f].state === 'new york city' || data[f].state === 'united states' || data[f].state !== data[f].county) {
      // only do states
      continue;
    }
    let d = data[f].daily;
    for (let i=0; i < d.length; i++) {
      if (d[i][field] === undefined) {
        continue;
      }
      if (d[i].date < firstDayWith10Cases) {
        continue;
      }
      if (!dates[d[i].date]) {
        dates[d[i].date] = {f:0, s:0};
      }
      dates[d[i].date].f += d[i][field];
      dates[d[i].date].s += d[i].sheltered ? data[f].population : 0;
    }
  }
  let maxf = 0;
  let minf = 100000000000;
  let maxs = 0;
  let points = [];
  for (let d in dates) {
    maxf = Math.max(maxf, dates[d].f);
    minf = Math.min(minf, dates[d].f);
    maxs = Math.max(maxs, dates[d].s);
    points.push({date: d, f:dates[d].f, s:dates[d].s});
  }
  points.sort((a,b) => {
    return a.date < b.date ? -1 : 1;
  });
  max.x = points.length;
  max.f = maxf;
  max.minf = minf;
  max.s = maxs;

  let f = (t, l) => {
    let ratio = Math.min(t / l, 1);
    graph('shleter', max, false, points, themeColors, ratio);
  };
  return f;
}

