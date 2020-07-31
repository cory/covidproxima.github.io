// (c) Cory Ondrejka 2020
'use strict'

import * as Colors from '../util/colors.js';
import * as Graph from './graph.js';


export default function draw(el, set, ranges) {
  let colors = Colors.LineColors;
  let graph = Graph.initMulti(el, set, true);
  Graph.drawBackgroundMulti(graph.ctx, el.width, el.height, colors, true, set, graph.tx);
  Graph.drawZero(graph.ctx, el.width, colors, graph.ty[0]);
  Graph.drawAxes(graph.ctx, el.width, el.height, colors);
  let lineSpacing;
  let topValue;
  let lines = [];
  if (graph.log) {
    topValue = Math.pow(10, Math.floor(Math.log10(graph.max)));
    let i = topValue;
    while (i > 1) {
      lines.push(i);
      i /= 10;
    }
  } else {
    lineSpacing = Math.pow(10, Math.floor(Math.log10(graph.max)));
    if (graph.max / lineSpacing > 4) {
      lineSpacing *= 2;
    } else if (graph.max / lineSpacing < 4) {
      lineSpacing /= 2;
    }
    for (let i = lineSpacing; i < graph.max; i += lineSpacing) {
      lines.push(i);
      topValue = i;
    }
    for (let i = -lineSpacing; i > graph.min; i -= lineSpacing) {
      lines.push(i);
    }
  }
  let zeroY = graph.ty[0](0);
  let len = 0;
  let idx = 0;
  for (let i = 0; i < set.length; i++) {
    let alen = set[i].arr.length;
    if (alen > len) {
      len = alen;
      idx = i;
    }
  }
  let topY = Graph.drawLevels(graph.ctx, el.width, el.height, len, colors, graph.tx[idx], graph.ty[idx], lines);
  let keys = Graph.drawKeyDerivs(graph.ctx, set, el.height, colors, graph.tx, graph.ty, graph.derivs);
  for (let i = 0; i < set.length; i++) {
    if (set.length === 1) {
      Graph.drawSmoothedLine(graph.ctx, set[i].arr, { line: colors['line1'], box: colors['box'] }, graph.tx[i], graph.ty[i], 1, 2);
    } else {
      Graph.drawLine(graph.ctx, set[i].arr, { line: colors['line' + i] }, graph.tx[i], graph.ty[i], 1, 2);
    }
  }
  Graph.addLabelsLine(el, zeroY, topY, topValue, keys, colors, set, ranges, graph.tx, idx);
}