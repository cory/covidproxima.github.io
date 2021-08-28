// (c) Cory Ondrejka 2020
'use strict'

let usData = {};
export function ProcessNYTData(placeData, d) {
  // skip header row
  for (let r = 1; r < d.length; r++) {
    let row = d[r].split(',');
    let date = row[0];
    let county = row[1].toLowerCase();
    let state = row[2].toLowerCase();
    let fips = row[3];
    let cases = parseInt(row[4]);
    let deaths = parseInt(row[5]);
    if (!fips && county === 'new york city') {
      fips = county;
    }
    if (fips) {
      if (placeData[fips]) {
        if (!usData[fips]) {
          let place = placeData[fips].county + ', ' + state;
          usData[fips] = { weekly: [], daily: [], place: place };
        }
        usData[fips].daily.push([date, cases, deaths]);
      }
    }
  }
}

export function ProcessNYTStateData(placeData, d) {
  // skip header row
  let dates = {};
  for (let r = 1; r < d.length; r++) {
    let row = d[r].split(',');
    let date = row[0];
    dates[date] = 1;
    let state = row[1].toLowerCase();
    let cases = parseInt(row[3]);
    let deaths = parseInt(row[4]);
    if (state) {
      if (placeData[state]) {
        if (!usData[state]) {
          usData[state] = { weekly: [], daily: [], place: state };
        }
        usData[state].daily.push([date, cases, deaths]);
      }
    }
  }
  let orderedDates = Object.keys(dates).sort((a, b) => { return a.localeCompare(a); });
  let weeklyKeys = {};
  for (let i = 0; i < orderedDates.length; i += 7) {
    weeklyKeys[orderedDates[i]] = 1;
  }
  for (let f in usData) {
    for (let i = 0; i < usData[f].daily.length; i++) {
      if (weeklyKeys[usData[f].daily[i][0]]) {
        usData[f].weekly.push(usData[f].daily[i]);
      }
    }
  }
  return usData;
}