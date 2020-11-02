// (c) Cory Ondrejka 2020
'use strict'

import * as Colors from '../util/colors.js?cachebust=82445';
import * as Graph from './graph.js?cachebust=82445';

export default function draw(el, arr, fips, field) {
  let colors = Colors.LineColors;

  let graph = Graph.init(el, arr, true, field);
  Graph.drawBackground(graph.ctx, el.width, el.height, colors, true, fips, arr.length, graph.tx);
  Graph.drawZero(graph.ctx, el.width, colors, graph.ty);
  Graph.drawLine(graph.ctx, arr, { line: colors.line0 }, graph.tx, graph.ty, 2, 2, field);
}
