// (c) Cory Ondrejka 2020
'use strict'

import * as Graph from './svggraph.js?cachebust=64291';

export default function draw(el, arr) {
  let colors = {
    background: '#080206',
    shelter: '#042201',
    zero: '#aa8159',
    line: '#ffc199',
    bad: '#ff4f40',
    good: '#488f31',
    base: '#f3f3f3',
    label: '#aa8159',
  };
  let graph = Graph.initScatter(el, arr);
  Graph.drawScatter(el, arr, colors, graph.tx, graph.ty, graph.w, graph.h);
}
