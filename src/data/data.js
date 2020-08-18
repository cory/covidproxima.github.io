// (c) Cory Ondrejka 2020
'use strict'

import GovernorData from './governor.js?cachebust=24680';
import MaskData from './maskdata.js?cachebust=24680';
import PlaceData from './placedata.js?cachebust=24680';
import ProcessNYTData from './procnytdata.js?cachebust=24680';
import ShelterData from './shelter.js?cachebust=24680';

let DATA_IDX = {
  date: 0,
  cases: 0,
  deaths: 0,
  recoveries: 0,
  activeCases: 0,
  probableCases: 0,
  pfr: 0,
  cfr: 0,
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
  d_deaths: 0,
  d_recoveries: 0,
  d_activeCases: 0,
  d_probableCases: 0,
  d_pfr: 0,
  d_cfr: 0,
  d_cir: 0,
  d_crr: 0,
  d_cvr: 0,
  d_p20: 0,
  d_p50: 0,
  d_p10: 0,
  d_p10m: 0,
  d_p20m: 0,
  d_p50m: 0,
  w_deaths: 0,
  w_recoveries: 0,
  w_activeCases: 0,
  w_probableCases: 0,
  w_pfr: 0,
  w_cfr: 0,
  w_cir: 0,
  w_crr: 0,
  w_cvr: 0,
  w_p20: 0,
  w_p50: 0,
  w_p10: 0,
  w_p10m: 0,
  w_p20m: 0,
  w_p50m: 0,
  wow_deaths: 0,
  wow_recoveries: 0,
  wow_activeCases: 0,
  wow_probableCases: 0,
  wow_pfr: 0,
  wow_cfr: 0,
  wow_cir: 0,
  wow_crr: 0,
  wow_cvr: 0,
  wow_p20: 0,
  wow_p50: 0,
  wow_p10: 0,
  wow_p10m: 0,
  wow_p20m: 0,
  wow_p50m: 0,
};

let FIELD_COUNT = 0;
for (let i in DATA_IDX) {
  DATA_IDX[i] = FIELD_COUNT++;
}

export function field2idx(field) {
  if (DATA_IDX[field] !== undefined) {
    return DATA_IDX[field];
  } else {
    return field;
  }
}

function newPlace(daily, demo) {
  let dateIdx = field2idx('date');
  let place = {
    daily: daily ? daily : Float32Array(FIELD_COUNT),
    firstDate: daily ? daily[0][dateIdx] : '',
    lastDate: daily ? daily[daily.length - 1][dateIdx] : '',
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
  let shelterIdx = field2idx('sheltered');
  if (place) {
    for (let i = 0; i < place.daily.length; i++) {
      if (place.daily[i][shelterIdx] !== undefined && place.daily[i][shelterIdx] !== shelter) {
        retval.push(i - place.daily.length);
        shelter = place.daily[i][shelterIdx];
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
  let maskIdx = field2idx('masked');
  if (place) {
    for (let i = 0; i < place.daily.length; i++) {
      if (place.daily[i][maskIdx] !== undefined && place.daily[i][maskIdx] !== mask) {
        retval.push(i - place.daily.length);
        mask = place.daily[i][maskIdx];
      }
    }
  }
  return retval;
}

export function usDays() {
  return Places['united states'].daily.length;
}

const COVID_DURATION = 28;
const COVID_INFECTION_ONSET = 6;
const COVID_CASE_MULTIPLE = 5;

const FIELDS = { deaths: true, cases: true, recoveries: true, activeCases: true, probableCases: true, pfr: true, cfr: true, cir: true, crr: true, cvr: true, p20: true, p50: true, p10: true, p10m: true, p20m: true, p50m: true };
const SUM_FIELDS = { deaths: true, cases: true, recoveries: true, activeCases: true, probableCases: true };

function calculatedFields(entry, place) {
  entry[DATA_IDX.cfr] = entry[DATA_IDX.cases] ? entry[DATA_IDX.deaths] / entry[DATA_IDX.cases] : 0;
  entry[DATA_IDX.pfr] = entry[DATA_IDX.deaths] / place.population;
  entry[DATA_IDX.cir] = entry[DATA_IDX.activeCases] / place.population;
  entry[DATA_IDX.crr] = entry[DATA_IDX.recoveries] / place.population;
  entry[DATA_IDX.cvr] = 1 - entry[DATA_IDX.cir] - entry[DATA_IDX.crr];
  entry[DATA_IDX.p10] = 1 - Math.pow(1 - entry[DATA_IDX.cir], 10);
  entry[DATA_IDX.p20] = 1 - Math.pow(1 - entry[DATA_IDX.cir], 20);
  entry[DATA_IDX.p50] = 1 - Math.pow(1 - entry[DATA_IDX.cir], 50);
  entry[DATA_IDX.p10m] = 1 - Math.pow(1 - entry[DATA_IDX.cir] * (1 - place.maskfreq), 10);
  entry[DATA_IDX.p20m] = 1 - Math.pow(1 - entry[DATA_IDX.cir] * (1 - place.maskfreq), 20);
  entry[DATA_IDX.p50m] = 1 - Math.pow(1 - entry[DATA_IDX.cir] * (1 - place.maskfreq), 50);
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

export function BuildData(data) {
  let usData = ProcessNYTData(PlaceData.fips, data.split(/\r?\n/));
  let stateTotals = {};
  let usTotals = {};

  for (let f in PlaceData.fips) {
    if (!usData[f]) {
      continue;
    }
    let place = newPlace(usData[f].daily, PlaceData.fips[f]);
    let d = place.daily;
    for (let i = 0; i < d.length; i++) {
      let di = d[i];
      di[DATA_IDX.probableCases] = parseInt(di[DATA_IDX.cases] * COVID_CASE_MULTIPLE);
      di[DATA_IDX.recoveries] = d[Math.max(0, i - COVID_DURATION)][DATA_IDX.probableCases] - di[DATA_IDX.deaths];
      di[DATA_IDX.recoveries] = parseInt(Math.max(di[DATA_IDX.recoveries], 0));
      di[DATA_IDX.activeCases] = d[Math.max(0, i - COVID_INFECTION_ONSET)][DATA_IDX.probableCases] - di[DATA_IDX.recoveries];
      di[DATA_IDX.activeCases] = parseInt(Math.max(di[DATA_IDX.activeCases], 0));
      calculatedFields(di, place);
      for (let val in FIELDS) {
        let idx = field2idx(val);
        let d_idx = field2idx('d_' + val);
        let w_idx = field2idx('w_' + val);
        let wow_idx = field2idx('wow_' + val);
        if (i - 1 >= 0) {
          let dd = d[i - 1];
          di[d_idx] = di[idx] - dd[idx];
        } else {
          di[d_idx] = di[idx];
        }
        if (i - 7 >= 0) {
          let dw = d[i - 7];
          di[w_idx] = di[idx] - dw[idx];
          di[wow_idx] = di[w_idx] - dw[w_idx];
        } else {
          di[w_idx] = di[idx];
          di[wow_idx] = di[w_idx];
        }
      }
      let date = di[DATA_IDX.date];
      let state = place.state;

      if (PlaceData.fips[state]) {
        if (!stateTotals[state]) {
          stateTotals[state] = {};
        }

        if (!stateTotals[state][date]) {
          stateTotals[state][date] = [];
          let sdt = stateTotals[state][date];
          sdt[DATA_IDX.date] = date;
          sdt[DATA_IDX.sheltered] = isSheltered(state, date, ShelterData);
          sdt[DATA_IDX.masked] = isMasked(state, date, MaskData);
          for (let val in FIELDS) {
            let idx = field2idx(val);
            let d_idx = field2idx('d_' + val);
            let w_idx = field2idx('w_' + val);
            let wow_idx = field2idx('wow_' + val);
            sdt[idx] = 0;
            sdt[d_idx] = 0;
            sdt[w_idx] = 0;
            sdt[wow_idx] = 0;
          }
        }
        let sdt = stateTotals[state][date];
        for (let val in SUM_FIELDS) {
          let idx = field2idx(val);
          let d_idx = field2idx('d_' + val);
          let w_idx = field2idx('w_' + val);
          let wow_idx = field2idx('wow_' + val);
          sdt[idx] += di[idx];
          sdt[d_idx] += di[d_idx];
          sdt[w_idx] += di[w_idx];
          sdt[wow_idx] += di[wow_idx];
        }

        if (!usTotals[date]) {
          usTotals[date] = [];
          let ustd = usTotals[date];
          ustd[DATA_IDX.date] = date;
          for (let val in FIELDS) {
            let idx = field2idx(val);
            let d_idx = field2idx('d_' + val);
            let w_idx = field2idx('w_' + val);
            let wow_idx = field2idx('wow_' + val);
            ustd[idx] = 0;
            ustd[d_idx] = 0;
            ustd[w_idx] = 0;
            ustd[wow_idx] = 0;
          }
        }
        let ustd = usTotals[date];
        for (let val in SUM_FIELDS) {
          let idx = field2idx(val);
          let d_idx = field2idx('d_' + val);
          let w_idx = field2idx('w_' + val);
          let wow_idx = field2idx('wow_' + val);
          ustd[idx] += di[idx];
          ustd[d_idx] += di[d_idx];
          ustd[w_idx] += di[w_idx];
          ustd[wow_idx] += di[wow_idx];
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
    usData[s] = { daily: [] };
    for (let d in stateTotals[s]) {
      let di = stateTotals[s][d];
      calculatedFields(di, PlaceData.fips[s]);
      usData[s].daily.push(di);
    }
    usData[s].daily.sort((a, b) => {
      return a[DATA_IDX.date].localeCompare(b[DATA_IDX.date]);
    });
    let place = newPlace(usData[s].daily, PlaceData.fips[s]);
    let d = place.daily;
    for (let i in d[d.length - 1]) {
      place.totals[i] = d[d.length - 1][i];
    }
    Places[s] = place;
  }
  usData['united states'] = { daily: [] };
  for (let d in usTotals) {
    let di = usTotals[d];
    calculatedFields(di, PlaceData.fips['united states']);
    usData['united states'].daily.push(di);
  }
  usData['united states'].daily.sort((a, b) => {
    return a[DATA_IDX.date].localeCompare(b[DATA_IDX.date]);
  });
  let place = newPlace(usData['united states'].daily, PlaceData.fips['united states']);
  let d = place.daily;
  for (let i in d[d.length - 1]) {
    place.totals[i] = d[d.length - 1][i];
  }
  Places['united states'] = place;
  return Places;
}
