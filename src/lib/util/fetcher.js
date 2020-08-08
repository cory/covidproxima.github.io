// (c) Cory Ondrejka 2020
'use strict'
import * as Numbers from './numbers.js?cachebust=65386';

export default function fetcher(uri, progresscb, cb) {
  fetch(uri, { cache: "no-store" }).then((response) => {
    let reader = response.body.getReader();
    const ce = response.headers.get('content-encoding');
    let dataSoFar = 0;
    let dataBlocks = [];

    function pump(pcb) {
      return reader.read().then(({ value, done }) => {
        if (done) {
          let rawData = new Uint8Array(dataSoFar);
          let idx = 0;
          for (let i = 0; i < dataBlocks.length; i++) {
            rawData.set(dataBlocks[i], idx);
            idx += dataBlocks[i].length;
          }
          const data = new TextDecoder("utf-8").decode(rawData);
          return cb(data);
        }

        dataBlocks.push(value);
        dataSoFar += value.byteLength;
        progresscb && progresscb(Numbers.prettyPrint(dataSoFar));
        pump(pcb);
      });
    }
    pump(cb);
  });
}
