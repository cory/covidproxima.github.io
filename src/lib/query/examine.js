// (c) Cory Ondrejka 2020
'use strict'

export let Types = {
  none: { f: 'none', text: 'none' },
  geo: { f: 'geo', text: 'split by geo' },
  field: { f: 'field', text: 'split by increasing or decreasing in last 7 days' },
  split: { f: 'split', text: 'split on field' },
  count: { f: 'count', text: 'count by increasing or decreasing' },
  total: { f: 'total', text: 'total field increase or decrease' },
  histo: { f: 'histo', text: 'average by histogram bin' },
};

export function helper(examine) {
  examine = examine.value ? examine.value : examine;
  let ret = {
    f: examine,
    text: Types[examine].text,
  };
  return ret;
}