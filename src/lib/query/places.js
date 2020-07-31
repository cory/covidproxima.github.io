// (c) Cory Ondrejka 2020
'use strict'


function countryOnly() {
  return [{ text: 'united states', fips: 'united states' }];
}

function statesUp() {
  let retArr = [];
  for (let p in PlaceData) {
    if (PlaceData[p].state === PlaceData[p].county) {
      retArr.push({ text: PlaceData[p].state, value: p });
    }
  }
  retArr.sort((a, b) => {
    if (a.text < b.text) {
      return -1;
    }
    if (a.text > b.text) {
      return 1;
    }
    return 0;
  });
  return retArr;
}

function statesOnly() {
  let retArr = [];
  for (let p in PlaceData) {
    if (PlaceData[p].state === PlaceData[p].county && PlaceData[p].state !== 'united states') {
      retArr.push({ text: PlaceData[p].state, value: p });
    }
  }
  retArr.sort((a, b) => {
    if (a.text < b.text) {
      return -1;
    }
    if (a.text > b.text) {
      return 1;
    }
    return 0;
  });
  return retArr;
}

function countiesUp() {
  let retArr = [];
  for (let p in PlaceData) {
    if (PlaceData[p].state === PlaceData[p].county) {
      retArr.push({ text: PlaceData[p].state, value: p });
    } else {
      retArr.push({ text: PlaceData[p].county + ', ' + PlaceData[p].state, value: p });
    }
  }
  retArr.sort((a, b) => {
    if (a.text < b.text) {
      return -1;
    }
    if (a.text > b.text) {
      return 1;
    }
    return 0;
  });
  return retArr;
}

export function statesAndCounties() {
  let retArr = [];
  for (let p in PlaceData) {
    if (PlaceData[p].state === 'united states') {
      continue;
    }
    if (PlaceData[p].state === PlaceData[p].county) {
      retArr.push({ text: PlaceData[p].state, value: p });
    } else {
      retArr.push({ text: PlaceData[p].county + ', ' + PlaceData[p].state, value: p });
    }
  }
  retArr.sort((a, b) => {
    if (a.text < b.text) {
      return -1;
    }
    if (a.text > b.text) {
      return 1;
    }
    return 0;
  });
  return retArr;
}

function countiesOnly(state) {
  let retArr = [];
  for (let p in PlaceData) {
    if (PlaceData[p].state !== PlaceData[p].county) {
      if (!state || state === PlaceData[p].state) {
        retArr.push({ text: PlaceData[p].county + ', ' + PlaceData[p].state, value: p });
      }
    }
  }
  retArr.sort((a, b) => {
    if (a.text < b.text) {
      return -1;
    }
    if (a.text > b.text) {
      return 1;
    }
    return 0;
  });
  return retArr;
}

export let Types = {
  country: countryOnly,
  statesUp: statesUp,
  statesOnly: statesOnly,
  countiesUp: countiesUp,
  countiesOnly: countiesOnly,
};

export function helper(place) {
  return { fips: place.value ? place.value : place, text: place.value ? place.value : place };
}

let PlaceData;

export function states() {
  return statesOnly();
}

export function allPlacesWithin(fips) {
  if (fips === 'united states') {
    return countiesOnly();
  } else if (PlaceData[fips].state === PlaceData[fips].county) {
    return countiesOnly(PlaceData[fips].state);
  } else {
    return [{ text: PlaceData[fips].county + ', ' + PlaceData[fips].state, value: fips }];
  }
}

export function init(places) {
  PlaceData = places;
}