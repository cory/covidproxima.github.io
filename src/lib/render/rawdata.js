// (c) Cory Ondrejka 2020
'use strict'

function printVals(weekly) {
  let retval = '  [';
  for (let field in weekly) {
    if (field === '0') {
      retval += '"' + weekly[field] + '",';
    } else {
      retval += weekly[field] + ',';
    }
  }
  retval += '],<br>';
  return retval;
}

let start = 2000;
let count = -1;
let end = 4000;

export default function rawdata(data) {
  let retval = '<br><br><br><br><br><br><br><br><br><br><br><br><br><br>let PlaceData = {<br>';
  for (let fips in data) {
    count++;
    if (count < start || count >= end) {
      continue;
    }
    retval += '"' + fips + '": {<br>';
    for (let field in data[fips]) {
      if (field !== 'weekly' && field !== 'totals') {
        retval += field + ': ';
        let val = data[fips][field];
        switch (typeof data[fips][field]) {
          case 'boolean':
            retval += val;
            break;
          case 'number':
            retval += val;
            break;
          default:
            retval += '"' + val + '"';
            break;
        }
        retval += ',<br>'
      }
    }
    retval += 'totals:<br>';
    retval += printVals(data[fips].totals);
    retval += 'weekly: [<br>';
    for (let i = 0; i < data[fips].weekly.length; i++) {
      retval += printVals(data[fips].weekly[i]);
    }
    retval += '],<br>},<br>'
  }
  retval += '};'
  return retval;
}