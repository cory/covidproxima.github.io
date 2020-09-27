// (c) Cory Ondrejka 2020
'use strict'

import * as Dates from './util/dates.js?cachebust=01880';
import * as Numbers from './util/numbers.js?cachebust=01880';

let classesToUpdate = {
  today: getDate,
  deaths: getDeathTotal,
  deathwow: getWeekOverWeekDeaths,
  popincounties: getPopInCounties,
  countyincrease: getCountiesAcc,
  countydecrease: getCountiesDec,
  timeincovid: getTimeInCovid,
  recovered: getRecoveredTotal,
}


export function getDate(data) {
  return Dates.prettyPrint(data['united states'].lastDate);
}
function getTimeInCovid(data) {
  let today = data['united states'].lastDate;
  let start = data['united states'].firstDate;
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

function getDeathTotal(data) {
  return Numbers.prettyPrint(data['united states'].totals.deaths);
}

function getRecoveredTotal(data) {
  return Numbers.prettyPrint(data['united states'].totals.recoveries);
}

function getWeekOverWeekDeaths(data) {
  return Numbers.prettyPrint(data['united states'].totals.deaths - data['united states'].daily[data['united states'].daily.length - 8].deaths);
}

function isCounty(data, f) {
  if (data[f].state !== 'new york city' && data[f].state === data[f].county) {
    return false;
  }
  return true;
}

function getPopInCounties(data) {
  let withcovid = 0;
  let total = 0;
  for (let i in data) {
    if (isCounty(data, i)) {
      total += data[i].population;
      if (data[i].totals.cases >= 10) {
        withcovid += data[i].population;
      }
    }
  }
  return parseInt(withcovid / total * 100) + '%';
}

function getCountiesAcc(data) {
  let total = 0;
  for (let i in data) {
    if (data[i].totals.casesSmoothA >= 0 && isCounty(data, i)) {
      total++;
    }
  }
  return Numbers.prettyPrint(total);
}

function getCountiesDec(data) {
  let total = 0;
  for (let i in data) {
    if (data[i].totals.casesSmoothA < 0 && isCounty(data, i)) {
      total++;
    }
  }
  return Numbers.prettyPrint(total);
}

export default function UpdateText(data) {
  for (let name in classesToUpdate) {
    let elements = document.getElementsByClassName(name);
    let txt = classesToUpdate[name](data);
    for (let i = 0; i < elements.length; i++) {
      elements[i].textContent = txt;
    }
  }
}
