// (c) Cory Ondrejka 2020
'use strict'

export let Types = {
  overall: { text: 'total' },
  pc: { text: 'per capita', func: (place, value) => divideBy(place, value, 'population', 1), average: true },
  pa: { text: 'per land area', func: (place, value) => divideBy(place, value, 'area', 1), average: true },
  pd: { text: 'per population density', func: (place, value) => divideBy(place, value, 'density', 1), average: true },
  picu: { text: 'per icu bed', func: (place, value) => divideBy(place, value, 'icuBeds', 1), average: true },
  w: { hidden: true, func: (weekly, val, idx) => delta(weekly, val, idx, 1) },
  wow: { hidden: true, func: (weekly, val, idx) => deltadelta(weekly, val, idx, 1) },
}

function divideBy(place, value, field, number) {
  return place[field] ? value * number / place[field] : 0;
}

function delta(weekly, val, idx, time) {
  if (idx < 0) {
    return 0;
  } else if (idx > time) {
    return weekly[idx][val] - weekly[idx - time][val];
  } else {
    return weekly[idx][val];
  }
}

function deltadelta(weekly, val, idx, time) {
  let d2 = delta(weekly, val, idx, time);
  let d1 = delta(weekly, val, idx - time, time);
  return d2 - d1;
}

export function helper(modifier) {
  modifier = modifier.value ? modifier.value : modifier;
  let ret = {
    f: modifier,
    average: Types[modifier].average,
    text: Types[modifier].text,
    func: Types[modifier].func,
  };
  return ret;
}