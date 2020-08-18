// (c) Cory Ondrejka 2020
'use strict'

function prettyPrintFraction(number, tight) {
  let mult = 1;
  if (tight) {
    if (Math.round(number * 10000) / 100 !== 0) {
      return Math.round(number * 10000) / 100 + '%';
    } else {
      return Math.round(number * 100000) / 1000 + '%';
    }
  } else {
    while (mult <= 100000) {
      if (number <= 0.01) {
        return '1 out of ' + Math.round(1 / number).toLocaleString();
      }
      if (Math.abs(Math.round(number * mult) - number * mult) / (number * mult) < 0.01) {
        return Math.round(number * mult).toLocaleString() + ' out of ' + parseInt(mult).toLocaleString();
      }
      mult *= 10;
    }
    return 'all';
  }
}

function words(num) {
  if (num === 0) {
    return 'no additional';
  } else if (num > 0) {
    return parseInt(num).toLocaleString() + ' additional';
  } else {
    return parseInt(Math.abs(num)).toLocaleString() + ' fewer';
  }
}

export function prettyPrint(number, tight, useWords) {
  if (number >= 1 || number <= 0) {
    return useWords ? words(number) : parseInt(number).toLocaleString();
  } else {
    return tight ? prettyPrintFraction(number, tight) : prettyPrintFraction(number, tight) + ' (' + prettyPrintFraction(number, true) + ')';
  }
}
