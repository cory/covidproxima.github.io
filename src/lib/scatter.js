// (c) Cory Ondrejka 2020
'use strict'

function graph(id,  bounding, xlog, ylog, points, colors, ratio) {
  let cid = document.getElementById(id);
  let rec = cid.getBoundingClientRect();
  let h = rec.height;
  let w = rec.width;
  cid.width = w;
  cid.height = h;
  let drawPadding = 10;
  let gw = w - drawPadding * 20;
  let gh = h - drawPadding * 4;
  let ctx = cid.getContext("2d");
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, w * ratio, h);
  ctx.fillStyle = 'RGBA(0,0,0,0)';
  ctx.fillRect(w * ratio, 0, w - w * ratio, h);
  function tx(x) {
    if (xlog) {
      return Math.log10(Math.max(1, x - bounding.left)) * gw / Math.log10(bounding.right - bounding.left)  + drawPadding;
    } else {
      return (x - bounding.left) * gw / (bounding.right - bounding.left) + drawPadding;
    }
  }
  function ty(y) {
    if (ylog) {
      return gh - gh * Math.log10(Math.max(1, y - bounding.bottom)) / Math.log10(bounding.top - bounding.bottom) + drawPadding * 2;
    } else {
      return gh - (y - bounding.bottom) * gh / (bounding.top - bounding.bottom) + drawPadding * 2;
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
  ctx.font = '14px monospace';

  for (let i = 0; i < points.length; i++) {
    ctx.fillStyle = points[i].c;
    ctx.beginPath();
    ctx.arc(tx(points[i].x), ty(points[i].y), 5, 0, Math.PI * 2, true);
    ctx.fill()
    ctx.fillStyle = colors.label;
    ctx.fillText(points[i].label, tx(points[i].x) + 5, ty(points[i].y)+2.5)
  }
}

export default function ScatterPlot(data, xfield, yfield, xlog, ylog, counties, states, us) {
  let bounding;
  let colors = {
    background: '#232323',
    normal: 'RGBA(128,128,150,0.4)',
    label: 'RGBA(220,198,150,1)',    
    highlight: 'RGBA(200,60,20,1)'
  };
  let highlights = [true];
  let points = [];
  for (let i in data) {
    if (!counties && (data[i].state !== i || i === 'district of columbia')) {
      continue;
    }
    if (!states && i !== 'united states' && data[i].state == i) {
      continue;
    }
    if (!us && i === 'united states' && data[i].state == i) {
      continue;
    }
    let x = data[i][xfield] ? data[i][xfield] : data[i].totals[xfield];
    let y = data[i][yfield] ? data[i][yfield] : data[i].totals[yfield];
    if (x === undefined || y === undefined) {
      continue;
    }
    if (!bounding) {
      bounding = { left:x, right:x, top:y, bottom: y};
    }
    bounding.left = Math.min(bounding.left, x);
    bounding.right = Math.max(bounding.right, x);
    bounding.top = Math.max(bounding.top, y);
    bounding.bottom = Math.min(bounding.bottom, y);
    points.push({ x: x, y: y, c: data[i].state === i ? colors.highlight : colors.normal, label: data[i].state === i ? i : data[i].county});
  }
  points.sort((a,b) => {
    return a.x - b.x;
  });
  let f = (t, l) => {
    let ratio = Math.min(t / l, 1);
    graph('scatter', bounding, xlog, ylog, points, colors, ratio);
  };
  return f;
}

