// (c) Cory Ondrejka 2020
'use strict'

import * as Colors from '../util/colors.js?cachebust=16021';
//import * as Graph from './graph.js?cachebust=16021';
import * as Graph from './svggraph.js?cachebust=16021';


export default function drawSVG(el, set, ranges, stack, nolog) {
  let colors = Colors.LineColors;
  let graph = Graph.initMulti(el, set, true, stack, 'x', true);
  Graph.drawLines(el, set, colors, graph.tx, graph.ty, graph.ty_log, graph.w, graph.h, graph.min, graph.max, graph.idx, 'x', ranges);
}