// (c) Cory Ondrejka 2020
'use strict'

import * as Graph from './graph.js?cachebust=44302';

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
  Graph.drawScatter(el, arr, { good: colors.good, bad: colors.bad }, graph.tx, graph.ty);
}
