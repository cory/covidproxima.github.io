// (c) Cory Ondrejka 2020
'use strict'

function graph(id, max, log, values, highlights, colors, ratio) {
  let cid = document.getElementById(id);
  let rec = cid.getBoundingClientRect();
  let h = rec.height;
  let w = rec.width;
  cid.width = w;
  cid.height = h;
  let ctx = cid.getContext("2d");
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, w * ratio, h);
  ctx.fillStyle = 'RGBA(0,0,0,0)';
  ctx.fillRect(w * ratio, 0, w - w * ratio, h);
  function tx(x) {
    return x * w / max.width;
  }
  function ty(y) {
    if (log) {
      return h - Math.log10(y) * h / Math.log10(max.height);
    } else {
      return h - y * h / max.height;
    }
  }
  if (ratio < 1) {
    let gradient = ctx.createLinearGradient(ratio * w, 0, ratio * w + 5, 0);
    // Add three color stops
    gradient.addColorStop(0, 'RGBA(0,0,0,0.1)');
    gradient.addColorStop(0.5, 'green');
    gradient.addColorStop(1, 'green');
    ctx.fillStyle = gradient;
    ctx.fillRect(ratio * w, 0, 10, h);
  }

  for (let l = 0; l < values.length; l++) {
    ctx.strokeStyle = highlights[l] ? colors.highlight : colors.normal;
    ctx.beginPath();
    ctx.moveTo(tx(values[l][0].x), ty([l][0].y));
    for (let p = 1; p < values[l].length; p++) {
      if (values[l][p].x / max.width <= ratio) {
        ctx.lineTo(tx(values[l][p].x), ty(values[l][p].y));
      }
    }
    ctx.stroke();
  }
}

export default function LineGraph(data) {
  let max = { width: 0, height: 0 };
  let colors = {
    background: '#232323',
    normal: 'RGBA(128,128,150,0.5)',
    highlight: 'RGBA(200,60,20,0.5)'
  };
  let highlights = [true];
  let values = [];
  let points = [];
  let d = data['united states'].daily;
  for (let i = 0; i < d.length; i++) {
    max.width = i;
    max.height = Math.max(max.height, d[i].deaths);
    points.push({ x: i, y: d[i].deaths });
  }
  values.push(points);
  for (let i in data) {
    if (i === 'united states') {
      continue;
    }
    if (data[i].state !== data[i].county) {
      highlights.push(false);
    } else {
      highlights.push(true);
    }
    d = data[i].daily;
    points = [];
    for (let i = 0; i < d.length; i++) {
      max.height = Math.max(max.height, d[i].cases);
      points.push({ x: i + (max.width - d.length + 1), y: d[i].cases });
    }
    if (points.length) {
      values.push(points);
    }
  }
  let f = (t, l) => {
    let ratio = Math.min(t / l, 1);
    graph('line', max, true, values, highlights, colors, ratio);
  };
  return f;
}
