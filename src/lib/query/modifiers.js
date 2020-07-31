// (c) Cory Ondrejka 2020
'use strict'

export let Types = {
  overall: { text: 'total' },
  pc: { text: 'per capita', func: (place, val, idx) => divideBy(place, val, idx, 'population', 1), average: true },
  pa: { text: 'per land area', func: (place, val, idx) => divideBy(place, val, idx, 'area', 1), average: true },
  pd: { text: 'per population density', func: (place, val, idx) => divideBy(place, val, idx, 'density', 1), average: true },
  picu: { text: 'per icu bed', func: (place, val, idx) => divideBy(place, val, idx, 'icuBeds', 1), average: true },
}

function divideBy(place, val, idx, field, number) {
  return place[field] ? place.daily[idx][val] * number / place[field] : 0;
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