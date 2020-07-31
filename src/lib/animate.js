// (c) Cory Ondrejka 2020
'use strict'

let actions = [];
let keyed = {};
let last;
let frameRequested;

export default function Animate(f, length, key) {
  if (key) {
    keyed[key] = { f: f, length: length, time: 0 };
  } else {
    actions.push({ f: f, length: length, time: 0 });
  }
  if (!frameRequested) {
    frameRequested = window.requestAnimationFrame(runStep);
  }
}

function runStep(timestamp) {
  frameRequested = undefined;
  let moreSteps = false;
  var step = last ? timestamp - last : 0;
  last = timestamp;
  for (let i in keyed) {
    let more = keyed[i].f(keyed[i].time, keyed[i].length);
    if (!more && keyed[i].time >= keyed[i].length) {
      delete keyed[i];
    } else {
      keyed[i].time += step;
      moreSteps = true;
    }
  }
  for (let i = actions.length - 1; i >= 0; i--) {
    let more = actions[i].f(actions[i].time, actions[i].length);
    if (!more && actions[i].time >= actions[i].length) {
      actions.splice(i, 1);
    } else {
      actions[i].time += step;
      moreSteps = true;
    }
  }
  if (moreSteps) {
    frameRequested = window.requestAnimationFrame(runStep);
  }
}
