// (c) Cory Ondrejka 2020
'use strict'

let last, timer;

export default function Debounce(f, time) {
  return function (args) {
    let prev = last;
    last = Date.now();
    if (prev && last - prev <= time) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => f(args), time);
  }
}