// (c) Cory Ondrejka 2020
'use strict'

export function firstCaps(str) {
  return str.split(/([\s\-\/])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}