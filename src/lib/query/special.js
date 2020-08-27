// (c) Cory Ondrejka 2020
'use strict'

import * as Dates from '../util/dates.js?cachebust=25154';
import * as Numbers from '../util/numbers.js?cachebust=25154';
import * as Text from '../util/text.js?cachebust=25154';

let specialQueries = {
  today: getDate,
  covidtime: () => getTimeInCovid(true),
  firstcovid: () => getFirstCovid(false),
}

function getDate() {
  return Dates.prettyPrint(Places['united states'].lastDate);
}

function getTimeInCovid(total) {
  let today = Places['united states'].lastDate;
  let start = total ? Places['united states'].firstDate : '2020-03-19';
  let tnumbers = today.split('-');
  for (let i = 0; i < tnumbers.length; i++) {
    tnumbers[i] = parseInt(tnumbers[i]);
  }
  let snumbers = start.split('-');
  for (let i = 0; i < snumbers.length; i++) {
    snumbers[i] = parseInt(snumbers[i]);
  }
  let days = 0;
  for (let y = snumbers[0]; y <= tnumbers[0]; y++) {
    for (let m = snumbers[1]; m <= tnumbers[1]; m++) {
      if (snumbers[0] === tnumbers[0] && snumbers[1] === tnumbers[1]) {
        return tnumbers[2] - snumbers[2]; // started in same month, year
      } else if (m === snumbers[1] && y === snumbers[0]) {
        days += Dates.getDaysIn(m, y) - snumbers[2]; // get days in first month
      } else if (m === tnumbers[1] && y === tnumbers[0]) {
        return Numbers.prettyPrint(days += tnumbers[2]); // get days in last month
      } else {
        days += Dates.getDaysIn(m, y);
      }
    }
  }
  return days;
}

function getFirstCovid() {
  let start = Places['united states'].firstDate;
  for (let i in Places) {
    if (Places[i].daily[0] && Places[i].state !== Places[i].county && Places[i].daily[0].date === start) {
      return Text.firstCaps(Places[i].county + ', ' + Places[i].state);
    }
  }
  return '';
}

export function route(field) {
  return specialQueries[field]();
}

let Places;

export function init(places) {
  Places = places;
}