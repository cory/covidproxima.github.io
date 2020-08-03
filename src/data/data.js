// (c) Cory Ondrejka 2020
'use strict'

import GovernorData from './governor.js';
import PlaceData from './placedata.js';
import ProcessNYTData from './procnytdata.js';
import ShelterData from './shelter.js';

function newPlace(daily, demo) {
  let place = {
    daily: daily ? daily : [],
    firstDate: daily ? daily[0].date : '',
    lastDate: daily ? daily[daily.length - 1].date : '',
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
  if (place) {
    for (let i = 0; i < place.daily.length; i++) {
      if (place.daily[i].sheltered !== undefined && place.daily[i].sheltered !== shelter) {
        retval.push(i - place.daily.length);
        shelter = place.daily[i].sheltered;
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

const FIELDS = { deaths: true, cases: true, recoveries: true, activeCases: true, probableCases: true, cfr: true, cir: true, crr: true, cvr: true, p20: true, p50: true, p10: true, p10m: true, p20m: true, p50m: true };
const SUM_FIELDS = { deaths: true, cases: true, recoveries: true, activeCases: true, probableCases: true };

function calculatedFields(entry, place) {
  entry.cfr = entry.cases ? entry.deaths / entry.cases : 0;
  entry.cir = entry.activeCases / place.population;
  entry.crr = entry.recoveries / place.population;
  entry.cvr = 1 - entry.cir - entry.crr;
  entry.p10 = 1 - Math.pow(1 - entry.cir, 10);
  entry.p20 = 1 - Math.pow(1 - entry.cir, 20);
  entry.p50 = 1 - Math.pow(1 - entry.cir, 50);
  entry.p10m = 1 - Math.pow(1 - entry.cir * (1 - place.maskfreq), 10);
  entry.p20m = 1 - Math.pow(1 - entry.cir * (1 - place.maskfreq), 20);
  entry.p50m = 1 - Math.pow(1 - entry.cir * (1 - place.maskfreq), 50);
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

export function fips2county(fips) {
  return Places[fips] ? Places[fips].county : '';
}

export function BuildData(data) {
  let usData = ProcessNYTData(PlaceData.fips, data.split(/\r?\n/), ShelterData);
  let stateTotals = {};
  let usTotals = {};

  for (let f in PlaceData.fips) {
    let place = newPlace(usData[f], PlaceData.fips[f]);
    let d = place.daily;
    for (let i = 0; i < d.length; i++) {
      let di = d[i];
      di.probableCases = parseInt(di.cases * COVID_CASE_MULTIPLE);
      di.recoveries = d[Math.max(0, i - COVID_DURATION)].probableCases - di.deaths;
      di.recoveries = parseInt(Math.max(di.recoveries, 0));
      di.activeCases = d[Math.max(0, i - COVID_INFECTION_ONSET)].probableCases - di.recoveries
      di.activeCases = parseInt(Math.max(di.activeCases, 0));
      calculatedFields(di, place);
      for (let val in FIELDS) {
        if (i - 1 >= 0) {
          let dd = d[i - 1];
          di['d_' + val] = di[val] - dd[val];
        } else {
          di['d_' + val] = di[val];
        }
        if (i - 7 >= 0) {
          let dw = d[i - 7];
          di['w_' + val] = di[val] - dw[val];
          di['wow_' + val] = di['w_' + val] - dw['w_' + val];
        } else {
          di['w_' + val] = di[val];
          di['wow_' + val] = di['w_' + val];
        }
      }
      let date = di.date;
      let state = place.state;

      if (PlaceData.fips[state]) {
        if (!stateTotals[state]) {
          stateTotals[state] = {};
        }
        if (!stateTotals[state][date]) {
          stateTotals[state][date] = {
            date: date,
            sheltered: isSheltered(state, date, ShelterData)
          };
          for (let val in FIELDS) {
            stateTotals[state][date][val] = 0;
            stateTotals[state][date]['d_' + val] = 0;
            stateTotals[state][date]['w_' + val] = 0;
            stateTotals[state][date]['wow_' + val] = 0;
          }
        }
        for (let val in SUM_FIELDS) {
          stateTotals[state][date][val] += di[val];
          stateTotals[state][date]['d_' + val] += di['d_' + val];
          stateTotals[state][date]['w_' + val] += di['w_' + val];
          stateTotals[state][date]['wow_' + val] += di['wow_' + val];
        }

        if (!usTotals[date]) {
          usTotals[date] = {
            date: date,
            place: 'united states',
          };
          for (let val in FIELDS) {
            usTotals[date][val] = 0;
            usTotals[date]['d_' + val] = 0;
            usTotals[date]['w_' + val] = 0;
            usTotals[date]['wow_' + val] = 0;
          }
        }
        for (let val in SUM_FIELDS) {
          usTotals[date][val] += di[val];
          usTotals[date]['d_' + val] += di['d_' + val];
          usTotals[date]['w_' + val] += di['w_' + val];
          usTotals[date]['wow_' + val] += di['wow_' + val];
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
    usData[s] = [];
    for (let d in stateTotals[s]) {
      let di = stateTotals[s][d];
      calculatedFields(di, PlaceData.fips[s]);
      usData[s].push(di);
    }
    usData[s].sort((a, b) => {
      return a.date.localeCompare(b.date);
    });
    let place = newPlace(usData[s], PlaceData.fips[s]);
    let d = place.daily;
    for (let i in d[d.length - 1]) {
      place.totals[i] = d[d.length - 1][i];
    }
    Places[s] = place;
  }
  usData['united states'] = [];
  for (let d in usTotals) {
    let di = usTotals[d];
    calculatedFields(di, PlaceData.fips['united states']);
    usData['united states'].push(di);
  }
  usData['united states'].sort((a, b) => {
    return a.date.localeCompare(b.date);
  });
  let place = newPlace(usData['united states'], PlaceData.fips['united states']);
  let d = place.daily;
  for (let i in d[d.length - 1]) {
    place.totals[i] = d[d.length - 1][i];
  }
  Places['united states'] = place;
  return Places;
}
