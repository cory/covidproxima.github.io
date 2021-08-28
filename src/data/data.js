// (c) Cory Ondrejka 2020
'use strict'

import GovernorData from './governor.js?cachebust=43294';
import MaskData from './maskdata.js?cachebust=43294';
import PlaceData from './placedata.js?cachebust=43294';
import { ProcessNYTData, ProcessNYTStateData } from './procnytdata.js?cachebust=43294';
import ShelterData from './shelter.js?cachebust=43294';

let DATA_IDX = {
  date: 0,
  cases: 0,
  deaths: 0,
  recoveries: 0,
  activeCases: 0,
  probableCases: 0,
  pfr: 0,
  cfr: 0,
  ccfr: 0,
  cir: 0,
  crr: 0,
  cvr: 0,
  p20: 0,
  p50: 0,
  p10: 0,
  p10m: 0,
  p20m: 0,
  p50m: 0,
  sheltered: 0,
  masked: 0,
};
let ALL_ZEROES = [];
let FIELD_COUNT = 0;
for (let i in DATA_IDX) {
  DATA_IDX[i] = FIELD_COUNT++;
  ALL_ZEROES.push(0);
}

let CALC_FIELDS = FIELD_COUNT - 2;

export function field2idx(field) {
  if (DATA_IDX[field] !== undefined) {
    return DATA_IDX[field];
  } else {
    return field;
  }
}

function newPlace(weekly, demo) {
  let dateIdx = DATA_IDX['date'];
  let place = {
    weekly: weekly ? weekly : Float32Array(FIELD_COUNT),
    firstDate: weekly ? weekly[0][dateIdx] : '',
    lastDate: weekly ? weekly[weekly.length - 1][dateIdx] : '',
    totals: {},
  };
  for (let i in demo) {
    place[i] = demo[i];
  }
  place.bedsPerCapita = demo.beds / demo.population;
  return place;
}

let Places = {};

export function zip2fips(zip) {
  let ret = [];
  for (let z in PlaceData.zips) {
    if (z.match(zip)) {
      ret = ret.concat(PlaceData.zips[z]);
    }
  }
  return ret.length ? ret : undefined;
}

export function zip2fipsTypeahead(zip) {
  let hash = {};
  for (let z in PlaceData.zips) {
    if (z.match(zip)) {
      for (let f = 0; f < PlaceData.zips[z].length; f++) {
        if (PlaceData.fips[PlaceData.zips[z][f]]) {
          hash[PlaceData.fips[PlaceData.zips[z][f]].state] = PlaceData.fips[PlaceData.zips[z][f]].state;
          hash[PlaceData.zips[z][f]] = PlaceData.fips[PlaceData.zips[z][f]].county + ', ' + PlaceData.fips[PlaceData.zips[z][f]].state;
        }
      }
    }
  }
  let retArray = [];
  for (let c in hash) {
    retArray.push({ text: hash[c], value: c });
  }
  return retArray;
}

export function city2fips(zip) {
  let ret = [];
  for (let c in PlaceData.cities) {
    if (c.match(zip)) {
      ret = ret.concat(PlaceData.cities[c]);
    }
  }
  return ret.length ? ret : undefined;
}

export function city2fipsTypeahead(zip) {
  let hash = {};
  for (let c in PlaceData.cities) {
    if (c.match(zip)) {
      for (let f = 0; f < PlaceData.cities[c].length; f++) {
        if (PlaceData.fips[PlaceData.cities[c][f]]) {
          hash[PlaceData.fips[PlaceData.cities[c][f]].state] = PlaceData.fips[PlaceData.cities[c][f]].state;
          hash[PlaceData.cities[c][f]] = PlaceData.fips[PlaceData.cities[c][f]].county + ', ' + PlaceData.fips[PlaceData.cities[c][f]].state;
        }
      }
    }
  }
  let retArray = [];
  for (let c in hash) {
    retArray.push({ text: hash[c], value: c });
  }
  return retArray;
}

export function getLockdownRange(fips) {
  if (!Places[fips]) {
    return [];
  }
  let place = Places[Places[fips].state];
  let retval = [];
  let shelter = false;
  let shelterIdx = DATA_IDX['sheltered'];
  if (place) {
    for (let i = 0; i < place.weekly.length; i++) {
      if (place.weekly[i][shelterIdx] !== undefined && place.weekly[i][shelterIdx] !== shelter) {
        retval.push(i - place.weekly.length);
        shelter = place.weekly[i][shelterIdx];
      }
    }
  }
  return retval;
}

export function getMaskRange(fips) {
  if (!Places[fips]) {
    return [];
  }
  let place = Places[Places[fips].state];
  let retval = [];
  let mask = false;
  let maskIdx = DATA_IDX['masked'];
  if (place) {
    for (let i = 0; i < place.weekly.length; i++) {
      if (place.weekly[i][maskIdx] !== undefined && place.weekly[i][maskIdx] !== mask) {
        retval.push(i - place.weekly.length);
        mask = place.weekly[i][maskIdx];
      }
    }
  }
  return retval;
}

export function usDays() {
  return Places['united states'].weekly.length;
}

const COVID_DURATION = 28;
const COVID_INFECTION_ONSET = 6;
const COVID_CASE_MULTIPLE = 4;
const COVID_INFECTION_TO_DEATH = 21;

const SUM_FIELDS = { deaths: true, cases: true, recoveries: true, activeCases: true, probableCases: true };

function calculatedFields(entry, place) {
  let oopop = 1.0 / place.population;
  entry[DATA_IDX.cfr] = entry[DATA_IDX.cases] ? entry[DATA_IDX.deaths] / entry[DATA_IDX.cases] : 0;
  entry[DATA_IDX.pfr] = entry[DATA_IDX.deaths] * oopop;
  entry[DATA_IDX.cir] = entry[DATA_IDX.activeCases] * oopop;
  entry[DATA_IDX.crr] = entry[DATA_IDX.recoveries] * oopop;
  entry[DATA_IDX.cvr] = 1 - entry[DATA_IDX.cir] - entry[DATA_IDX.crr];
  entry[DATA_IDX.p10] = 1 - Math.pow(1 - entry[DATA_IDX.cir], 10);
  entry[DATA_IDX.p20] = 1 - Math.pow(1 - entry[DATA_IDX.cir], 20);
  entry[DATA_IDX.p50] = 1 - Math.pow(1 - entry[DATA_IDX.cir], 50);
  entry[DATA_IDX.p10m] = 1 - Math.pow(1 - entry[DATA_IDX.cir] * (1 - place.maskfreq), 10);
  entry[DATA_IDX.p20m] = 1 - Math.pow(1 - entry[DATA_IDX.cir] * (1 - place.maskfreq), 20);
  entry[DATA_IDX.p50m] = 1 - Math.pow(1 - entry[DATA_IDX.cir] * (1 - place.maskfreq), 50);
}

function calcIdxFields(arr, idx) {
  let newcases = arr[Math.max(0, idx)][DATA_IDX.cases] - arr[Math.max(0, idx - COVID_INFECTION_TO_DEATH)][DATA_IDX.cases];
  arr[idx][DATA_IDX.ccfr] = newcases ? (arr[Math.max(0, idx)][DATA_IDX.deaths] - arr[Math.max(0, idx - COVID_INFECTION_TO_DEATH)][DATA_IDX.deaths]) / newcases : 0;
}

function isSheltered(state, date, ShelterData) {
  if (!ShelterData[state]) {
    return false;
  }
  let shelter = false;
  for (let i = 0; i < ShelterData[state].length; i++) {
    let d = ShelterData[state][i].date;
    if (date < d) {
      return shelter;
    }
    shelter = ShelterData[state][i].shelter;
  }
  return shelter;
}

function isMasked(state, date, MaskData) {
  if (!MaskData[state]) {
    return false;
  }
  let masked = false;
  for (let i = 0; i < MaskData[state].length; i++) {
    let d = MaskData[state][i].date;
    if (date < d) {
      return masked;
    }
    masked = MaskData[state][i].mask;
  }
  return masked;
}

export function fips2county(fips) {
  return Places[fips] ? Places[fips].county : '';
}

export function BuildData(data, stateData) {
  ProcessNYTData(PlaceData.fips, data.split(/\r?\n/));
  let usData = ProcessNYTStateData(PlaceData.fips, stateData.split(/\r?\n/));
  let stateTotals = {};
  let usTotals = {};

  for (let f in PlaceData.fips) {
    if (!usData[f]) {
      continue;
    }
    let place = newPlace(usData[f].weekly, PlaceData.fips[f]);
    let d = place.weekly;
    for (let i = 0; i < d.length; i++) {
      let di = d[i];
      di[DATA_IDX.probableCases] = parseInt(di[DATA_IDX.cases] * COVID_CASE_MULTIPLE);
      di[DATA_IDX.recoveries] = d[Math.max(0, i - COVID_DURATION)][DATA_IDX.probableCases] - di[DATA_IDX.deaths];
      di[DATA_IDX.recoveries] = parseInt(Math.max(di[DATA_IDX.recoveries], 0));
      di[DATA_IDX.activeCases] = d[Math.max(0, i - COVID_INFECTION_ONSET)][DATA_IDX.probableCases] - di[DATA_IDX.recoveries];
      di[DATA_IDX.activeCases] = parseInt(Math.max(di[DATA_IDX.activeCases], 0));
      let date = di[DATA_IDX.date];
      let state = place.state;
      if (f !== state) {
        calculatedFields(di, place);
        calcIdxFields(d, i);
      } else {
        if (!stateTotals[state]) {
          stateTotals[state] = {};
        }

        if (!stateTotals[state][date]) {
          stateTotals[state][date] = [];
          let sdt = stateTotals[state][date];
          sdt[DATA_IDX.date] = date;
          sdt[DATA_IDX.sheltered] = isSheltered(state, date, ShelterData);
          sdt[DATA_IDX.masked] = isMasked(state, date, MaskData);
          for (let val = 1; val < CALC_FIELDS; val++) {
            sdt[val] = 0;
          }
        }
        let sdt = stateTotals[state][date];
        for (let val in SUM_FIELDS) {
          let idx = DATA_IDX[val];
          sdt[idx] += di[idx];
        }

        if (!usTotals[date]) {
          usTotals[date] = [];
          let ustd = usTotals[date];
          ustd[DATA_IDX.date] = date;
          for (let val = 1; val < CALC_FIELDS; val++) {
            ustd[val] = 0;
          }
        }
        let ustd = usTotals[date];
        for (let val in SUM_FIELDS) {
          let idx = DATA_IDX[val];
          ustd[idx] += di[idx];
        }
        if (GovernorData[state]) {
          place.govrepublican = PlaceData.fips[state].govrepublican = GovernorData[state].republican;
          place.govmale = PlaceData.fips[state].govmale = GovernorData[state].male;
        }
      }
    }

    for (let i in d[d.length - 1]) {
      place.totals[i] = d[d.length - 1][i];
    }

    Places[f] = place;
  }

  for (let s in stateTotals) {
    usData[s] = { weekly: [] };
    for (let d in stateTotals[s]) {
      let di = stateTotals[s][d];
      usData[s].weekly.push(di);
    }
    usData[s].weekly.sort((a, b) => {
      return a[DATA_IDX.date].localeCompare(b[DATA_IDX.date]);
    });
    for (let i = 0; i < usData[s].weekly.length; i++) {
      calcIdxFields(usData[s].weekly, i);
    }
    let place = newPlace(usData[s].weekly, PlaceData.fips[s]);
    let d = place.weekly;
    for (let i in d[d.length - 1]) {
      place.totals[i] = d[d.length - 1][i];
    }
    Places[s] = place;
  }
  usData['united states'] = { weekly: [] };
  for (let d in usTotals) {
    let di = usTotals[d];
    calculatedFields(di, PlaceData.fips['united states']);
    usData['united states'].weekly.push(di);
  }
  usData['united states'].weekly.sort((a, b) => {
    return a[DATA_IDX.date].localeCompare(b[DATA_IDX.date]);
  });
  for (let i = 0; i < usData['united states'].weekly.length; i++) {
    calcIdxFields(usData['united states'].weekly, i);
  }
  let place = newPlace(usData['united states'].weekly, PlaceData.fips['united states']);
  let d = place.weekly;
  for (let i in d[d.length - 1]) {
    place.totals[i] = d[d.length - 1][i];
  }
  Places['united states'] = place;
  return Places;
}
