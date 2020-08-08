// (c) Cory Ondrejka 2020
'use strict'

let usData = {};

export default function ProcessNYTData(placeData, d) {
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
          usData[fips] = { daily: [], place: place };
        }
        usData[fips].daily.push([date, cases, deaths]);
      }
    }
  }
  return usData;
}