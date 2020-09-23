// (c) Cory Ondrejka 2020
'use strict'

import { field2idx } from '../data/data.js?cachebust=64291';
import Line from './graph/line.js?cachebust=64291';
import Scatter from './graph/scatter.js?cachebust=64291';
import Person from './person.js?cachebust=64291';
import * as Examine from './query/examine.js?cachebust=64291';
import * as Fields from './query/fields.js?cachebust=64291';
import * as Modifiers from './query/modifiers.js?cachebust=64291';
import * as Places from './query/places.js?cachebust=64291';
import * as Special from './query/special.js?cachebust=64291';
import * as SVG from './svg.js?cachebust=64291';
import Table from './table.js?cachebust=64291';
import * as Numbers from './util/numbers.js?cachebust=64291';
import * as Text from './util/text.js?cachebust=64291';
import Typeahead from './util/typeahead.js?cachebust=64291';


let PlaceData;
let Data;
let DataPanels = {};
let DataPanelCount = 0;

function parseDatasetString(str) {
  let ret = {};
  let parts = str.split(/;\s*/);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      let part = parts[i].split(':');
      ret[part[0]] = part[1];
    }
  }
  return ret;
}

function recurseChildren(dp, parent) {
  for (let i = 0; i < parent.childNodes.length; i++) {
    let child = parent.childNodes[i];
    if (child.className) {
      let names = child.className.split(' ');
      for (let i = 0; i < names.length; i++) {
        let macro = names[i];
        if (dp.inputs[macro]) {
          dp.cache[macro] = { el: child, type: 'text' };
          child.addEventListener('click', (e) => {
            Typeahead(dlHelper(dp, macro, child));
          });
        } else if (dp.results[macro]) {
          if (dp.results[macro].type === 'map') {
            dp.pause = true;
            let svgID = SVG.add(parent, child, null, null, null, () => {
              delete dp.pause;
              update(dp, true);
            });
            dp.cache[macro] = { el: child, type: dp.results[macro].type, svgID: svgID };
          } else {
            dp.cache[macro] = { el: child, type: dp.results[macro].type };
          }
        }
      }
    }
    recurseChildren(dp, child);
  }
}

export function init(data, places) {
  Data = data;
  PlaceData = places;
  Places.init(places);
  Special.init(places);
  let queryElements = document.getElementsByClassName('query');
  for (let i = 0; i < queryElements.length; i++) {
    let dq = queryElements[i];
    let dp = { results: {}, inputs: {}, cache: {}, updateCache: {}, replace: {} };
    dp.updateCache = {};
    dp.id = DataPanelCount++;
    DataPanels[dp.id] = dp;

    for (let d in dq.dataset) {
      switch (d[0]) {
        case 'r':
          dp.results[d] = parseDatasetString(dq.dataset[d]);
          break;
        case 'e':
          dp.inputs[d] = parseDatasetString(dq.dataset[d]);
          break;
      }
    }
    recurseChildren(dp, dq);
    update(dp);
  }
}

function prettyPrintPlace(fips) {
  if (fips === 'united states') {
    return 'the ' + Text.firstCaps(fips);
  } else if (PlaceData[fips].state === PlaceData[fips].county) {
    return Text.firstCaps(PlaceData[fips].state);
  } else {
    return Text.firstCaps(PlaceData[fips].county + ', ' + PlaceData[fips].state);
  }
}

function placeTest(str) {
  let hashValue = {};
  if (str.match(/[0-9]{3,5}/)) {
    hashValue = Data.zip2fipsTypeahead(str);
  } else if (str.length > 1) {
    hashValue = Data.city2fipsTypeahead(str);
  }
  return hashValue;
}

function dlHelper(dp, macro, el) {
  let desc = {
    macro: macro,
    title: dp.inputs[macro].title,
    target: el,
    options: [],
    dp: dp,
    update: update
  };
  if (dp.inputs[macro].places) {
    desc.options = Places.Types[dp.inputs[macro].places]();
    desc.extraTest = placeTest;
  } else if (dp.inputs[macro].field) {
    for (let i in Fields.Types[dp.inputs[macro].field]) {
      desc.options.push({ text: Fields.Types[dp.inputs[macro].field][i].text, value: i });
    }
  } else if (dp.inputs[macro].modifier) {
    for (let i in Modifiers.Types) {
      desc.options.push({ text: Modifiers.Types[i].text, value: i });
    }
  } else if (dp.inputs[macro].examine) {
    for (let i in Examine.Types) {
      desc.options.push({ text: Examine.Types[i].text, value: i });
    }
  }
  return desc;
}

function updateDOM(dp) {
  for (let macro in dp.replace) {
    let text = dp.replace[macro].value || dp.replace[macro].text
    if (dp.replace[macro].place) {
      text = prettyPrintPlace(text);
      dp.cache[macro].text = text;
      dp.cache[macro].el.textContent = text;
    } else if (dp.cache[macro]) {
      switch (dp.cache[macro].type) {
        case 'text':
          dp.cache[macro].text = text;
          dp.cache[macro].el.textContent = text;
          if (dp.replace[macro].value && dp.replace[macro].text && dp.replace[macro].text !== 'per capita') {
            dp.cache[macro].el.textContent += ' ' + dp.replace[macro].text;
          }
          break;
        case 'map':
          SVG.render(dp.cache[macro].svgID, dp.replace[macro].value.text, dp.replace[macro].value.arr, dp.replace[macro].value.shortText, dp.replace[macro].value.upGood, dp.replace[macro].value.states);
          break;
        case 'table':
          Table(dp.cache[macro].el, dp.replace[macro].value.arr, dp.replace[macro].value.shortText, dp.replace[macro].value.upGood, dp.replace[macro].value.count, PlaceData, dp.replace[macro].value.field);
          break;
        case 'line':
          Line(dp.cache[macro].el, dp.replace[macro].value.lq.set, dp.replace[macro].value.lq.ranges, dp.replace[macro].value.stack, dp.replace[macro].value.nolog);
          break;
        case 'scatter':
          Scatter(dp.cache[macro].el, dp.replace[macro].value.arr, [dp.replace[macro].value.field, dp.replace[macro].value.field], dp.replace[macro].value.shortText);
          break;
        case 'people':
          Person(dp.cache[macro].el, dp.replace[macro].value.values, dp.replace[macro].value.count);
          break;
      }
    }
  }
}

function update(dp, force) {
  if (dp.pause) {
    return;
  }
  let results = dp.results;
  let inputs = dp.inputs;
  let replace = dp.replace;
  let dirty = false;
  for (let r in results) {
    if (!replace[r]) {
      replace[r] = {};
    }
    let result = results[r];
    let args = {
      places: { fips: '', text: '' },
      field: { f: '', text: '' },
      field2: { f: '', text: '' },
      field3: { f: '', text: '' },
      modifier: { f: '', text: '' },
      examine: { f: '', text: '' },
    };
    let arg2helpers = {
      places: { mod: Places, extra: 'place' },
      field: { mod: Fields, text: false, obj: true },
      field2: { mod: Fields, map: 'field', text: false, obj: true },
      field3: { mod: Fields, map: 'field', text: false, obj: true },
      modifier: { mod: Modifiers, text: true },
      examine: { mod: Examine, text: true },
    };
    for (let arg in result) {
      if (arg2helpers[arg]) {
        if (inputs[result[arg]] && (inputs[result[arg]][arg] || inputs[result[arg]][arg2helpers[arg].map])) {
          args[arg] = arg2helpers[arg].mod.helper(inputs[result[arg]]);
          replace[result[arg]] = { text: args[arg].text, title: inputs[result[arg]].title };
          if (arg2helpers[arg].extra) {
            replace[result[arg]][arg2helpers[arg].extra] = true;
          }
        } else {
          args[arg] = arg2helpers[arg].obj ? arg2helpers[arg].mod.helper(result) : arg2helpers[arg].mod.helper(result[arg]);
          if (arg2helpers[arg].text) {
            replace[r].text = args[arg].text;
          }
        }
      }
    }
    if (force || replaceDirty(dp, r, args.places ? args.places.fips : undefined, args.field.f, args.field2.f, args.field3.f, args.modifier.f, args.examine.f)) {
      dirty = true;
      switch (result.type) {
        case 'text':
          replace[r].value = valueQuery(args.places ? args.places : undefined, args.field, args.modifier);
          break;
        case 'map':
          replace[r].value = { text: args.field.text, shortText: args.field.shortText, upGood: args.field.upGood, states: result.states, arr: placeDownQuery(args.places.fips, args.field, args.modifier, result.delta, result.states) };
          break;
        case 'table':
          replace[r].value = { field: args.field.f, text: args.field.text, shortText: args.field.shortText, upGood: args.field.upGood, arr: placeDownQuery(args.places.fips, args.field, args.modifier, result.delta, result.states), count: result.count, delta: result.delta };
          break;
        case 'line':
          replace[r].value = { text: args.field.text, shortText: args.field.shortText, stack: result.stack, nolog: result.nolog, lq: lineQuery(args.places.fips, args.field, args.modifier, args.field2, args.field3, args.examine.f) };
          break;
        case 'scatter':
          replace[r].value = { text: [args.field.text, args.field2.text], shortText: [args.field.shortText, args.field2.shortText], arr: scatterQuery(args.field, args.field2, args.modifier, result.states) };
          break;
        case 'people':
          replace[r].value = { text: [args.field.text, args.field2.text, args.field3.text], shortText: [args.field.shortText, args.field2.shortText, args.field3.shortText], count: result.count, values: peopleQuery(args.places.fips, args.field, args.field2, args.field3, args.modifier) };
          break;
      }
    }
  }
  if (dirty) {
    updateDOM(dp);
  }
}

function replaceDirty(dp, count, fips, field, field2, field3, modifier, examine) {
  let dirty = false;
  if (!dp.updateCache[count]) {
    dirty = true;
  } else if (dp.updateCache[count].fips !== fips) {
    dirty = true;
  } else if (dp.updateCache[count].field !== field) {
    dirty = true;
  } else if (dp.updateCache[count].field2 !== field2) {
    dirty = true;
  } else if (dp.updateCache[count].field3 !== field3) {
    dirty = true;
  } else if (dp.updateCache[count].modifier !== modifier) {
    dirty = true;
  } else if (dp.updateCache[count].examine !== examine) {
    dirty = true;
  }
  if (dirty === true) {
    dp.updateCache[count] = { fips: fips, field: field, field2: field2, field3: field3, modifier: modifier, examine: examine };
  }
  return dirty;
}

function valueQuery(places, field, modifier) {
  switch (field.type) {
    case 'time':
    case 'totals':
      return Numbers.prettyPrint(getValue(places.fips, field, modifier), field.units === '%');
    case 'special':
      return Special.route(field.f);
  }
}

function peopleQuery(fips, field, field2, field3, modifier) {
  let retval = [{ val: getValue(fips, field, modifier), t: field.shortText }];
  if (field2.f) {
    retval.push({ val: getValue(fips, field2, modifier), t: field2.shortText })
  }
  if (field3.f) {
    retval.push({ val: getValue(fips, field3, modifier), t: field3.shortText })
  }
  return retval;
}

function getValue(fips, field, modifier, delta) {
  let place = PlaceData[fips];
  if (!place.daily) {
    return 0;
  }
  if (place.totals[field.f] === undefined) {
    if (place[field.f] === undefined) {
      return 0;
    } else {
      return place[field.f];
    }
  }
  if (delta) {
    if (modifier && modifier.func && field.per) {
      return modifier.func(place, field.f, Math.max(0, place.daily.length - 1)) - modifier.func(place, field.f, Math.max(0, place.daily.length - 1 - 7));
    } else {
      return place.totals[field.f] - place.daily[Math.max(0, place.daily.length - 1 - 7)][field.f];
    }
  } else if (modifier && modifier.func && field.per) {
    return modifier.func(place, field.f, place.daily.length - 1);
  } else {
    return place.totals[field.f];
  }
}

function placeDownQuery(fips, field, modifier, delta, statesOnly) {
  let arr = [];
  let sd = {}, usd = {}, place;
  let states = Places.states();
  for (let i = 0; i < states.length; i++) {
    sd[states[i].value] = {};
    sd[states[i].value].value = getValue(states[i].value, field, modifier);
    if (delta) {
      sd[states[i].value].delta = getValue(states[i].value, field, modifier, delta);
    }
  }
  usd.value = getValue('united states', field, modifier);
  if (delta) {
    usd.delta = getValue('united states', field, modifier, delta);
  }
  if (statesOnly) {
    place = PlaceData[fips];
    if (fips === 'united states') {
      for (let i in sd) {
        place = PlaceData[i];
        let entry = {
          county: place.county, state: place.state, fips: i,
          sd: sd[i] ? sd[i].value : undefined,
          sdd: sd[i] ? sd[i].delta : undefined,
          usd: usd.value,
          usdd: usd.delta
        };
        entry.d = entry.sd;
        entry.delta = entry.sdd;
        arr.push(entry);
      }
      arr.sort((a, b) => { return b.d - a.d });
      return arr;
    } else {
      let entry = {
        county: place.county, state: place.state, fips: place.state,
        sd: sd[place.state] ? sd[place.state].value : undefined,
        sdd: sd[place.state] ? sd[place.state].delta : undefined,
        usd: usd.value,
        usdd: usd.delta
      };
      entry.d = entry.sd;
      entry.delta = entry.sdd;
      arr.push(entry);
      return arr;
    }
  }
  let places = Places.allPlacesWithin(fips);
  for (let i = 0; i < places.length; i++) {
    let fips = places[i].value;
    place = PlaceData[fips];
    if (!place.daily.length) {
      continue;
    } let val, d;
    val = getValue(fips, field, modifier);
    if (delta) {
      d = getValue(fips, field, modifier, delta);
    }
    let entry = {
      county: place.county, state: place.state, fips: fips, d: val, delta: d,
      sd: sd[place.state] ? sd[place.state].value : undefined,
      sdd: sd[place.state] ? sd[place.state].delta : undefined,
      usd: usd.value,
      usdd: usd.delta
    };
    arr.push(entry);
  }
  arr.sort((a, b) => { return b.d - a.d });
  return arr;
}

function wrapNum(val, field) {
  if (!field.units) {
    return val;
  } else if (field.units === '$') {
    return '$' + val;
  } else if (field.units === '%') {
    return val + '%';
  } else {
    return val + ' ' + field.units;
  }
}

function lineQuery(fips, field, modifier, field2, field3, examine) {
  let retval = [];
  let ranges = [];
  let toDo = [];
  let place;
  if (fips.match(',')) {
    toDo = fips.split(',');
  } else {
    place = PlaceData[fips];
    if (place.state === 'united states') {
      toDo.push('united states');
    } else if (place.state === place.county) {
      toDo.push('united states');
      toDo.push(fips);
    } else {
      toDo.push(place.state);
      toDo.push(fips);
    }
  }
  let date_idx = field2idx('date');
  if (!examine) {
    let fieldToDo = [{ f: field.f, t: field.shortText, per: field.per }];
    if (field2.f) {
      fieldToDo.push({ f: field2.f, t: field2.shortText, per: field3.per });
    }
    if (field3.f) {
      fieldToDo.push({ f: field3.f, t: field3.shortText, per: field3.per });
    }
    for (let fld = 0; fld < fieldToDo.length; fld++) {
      for (let f = 0; f < toDo.length; f++) {
        let ret = [];
        place = PlaceData[toDo[f]];
        ranges.push({ text: place.state === place.county ? Text.firstCaps(place.state) : Text.firstCaps(place.county + ', ' + place.state) });
        let arr = place.daily;
        for (let i = 0; i < arr.length; i++) {
          if (modifier && modifier.func && fieldToDo[fld].per) {
            ret[i] = {};
            ret[i].x = modifier.func(place, fieldToDo[fld].f, i);
          } else {
            ret[i] = {};
            ret[i].x = arr[i][fieldToDo[fld].f];
          }
          ret[i].date = arr[i][date_idx];
        }
        retval.push({ fips: toDo[f], arr: ret, shortText: Text.firstCaps(fieldToDo[fld].t) });
      }
    }
  } else if (examine === 'geo' || examine === 'none') {
    for (let f = 0; f < toDo.length; f++) {
      let ret = [];
      place = PlaceData[toDo[f]];
      ranges.push({ text: place.state === place.county ? Text.firstCaps(place.state) : Text.firstCaps(place.county + ', ' + place.state) });
      let arr = place.daily;
      for (let i = 0; i < arr.length; i++) {
        if (modifier && modifier.func && field.per) {
          ret[i] = {};
          ret[i].x = modifier.func(place, field.f, i);
        } else {
          ret[i] = {};
          ret[i].x = arr[i][field.f];
        }
        ret[i].date = arr[i][date_idx];
      }
      retval.push({ fips: toDo[f], arr: ret, shortText: Text.firstCaps(field.shortText) });
    }
    if (examine === 'geo' && toDo.length === 2) {
      let lengthOffset = retval[0].arr.length - retval[1].arr.length;
      for (let i = 0; i < retval[0].arr.length; i++) {
        retval[0].arr[i].x -= retval[1].arr[i - lengthOffset] ? retval[1].arr[i - lengthOffset].x : 0;
      }
    }
  } else {
    let pIdx = 0;
    if (toDo[0] === 'united states') {
      pIdx = toDo.length - 1;
    } else {
      pIdx = 0;
    }
    for (let f = 0; f < (examine === 'histo' ? 6 : 2); f++) {
      let ret = [];
      let place = PlaceData[toDo[pIdx]];
      let arr = place.daily;
      for (let i = 0; i < arr.length; i++) {
        ret[i] = {};
        ret[i].x = 0;
        ret[i].count = 0;
        ret[i].date = arr[i][date_idx];
      }
      retval.push({ fips: f === 0 ? 'increasing' : 'decreasing', arr: ret, shortText: Text.firstCaps(field.shortText) });
    }
    let places = Places.allPlacesWithin(toDo[pIdx]);
    switch (examine) {
      case 'field':
        ranges[0] = { text: 'Increasing' };
        ranges[1] = { text: 'Decreasing' };
        for (let f = 0; f < places.length; f++) {
          let fips = places[f].value;
          let place = PlaceData[fips];
          let arr = place.daily;
          let change;
          change = getValue(fips, field, modifier, true);
          let lengthOffset = retval[0].arr.length - arr.length;
          for (let i = 0; i < arr.length; i++) {
            let val;
            if (modifier && modifier.func && field.per) {
              val = modifier.func(place, field.f, i);
            } else {
              val = arr[i][field.f];
            }
            if (change >= 0) {
              retval[0].arr[i + lengthOffset].x += val;
              retval[0].arr[i + lengthOffset].count++;
            } else {
              retval[1].arr[i + lengthOffset].x += val;
              retval[1].arr[i + lengthOffset].count++;
            }
          }
        }
        if (field.average) {
          for (let r = 0; r < retval.length; r++) {
            for (let i = 0; i < retval[r].arr.length; i++) {
              if (retval[r].arr[i].count) {
                retval[r].arr[i].x /= retval[r].arr[i].count;
              }
            }
          }
        }
        break;
      case 'split':
        ranges[0] = { text: 'More ' + Text.firstCaps(field2.shortText) };
        ranges[1] = { text: 'Less ' + Text.firstCaps(field2.shortText) };
        let splitAve = 0;
        for (let f = 0; f < places.length; f++) {
          let fips = places[f].value;
          splitAve += getValue(fips, field2);
        }
        splitAve /= places.length;
        for (let f = 0; f < places.length; f++) {
          let fips = places[f].value;
          let place = PlaceData[fips];
          let arr = place.daily;
          let split = getValue(fips, field2);
          let lengthOffset = retval[0].arr.length - arr.length;
          for (let i = 0; i < arr.length; i++) {
            let val;
            if (modifier && modifier.func && field.per) {
              val = modifier.func(place, field.f, i);
            } else {
              val = arr[i][field.f];
            }
            if (split >= splitAve) {
              retval[0].arr[i + lengthOffset].x += val;
              retval[0].arr[i + lengthOffset].count++;
            } else {
              retval[1].arr[i + lengthOffset].x += val;
              retval[1].arr[i + lengthOffset].count++;
            }
          }
        }
        if (field.average) {
          for (let r = 0; r < retval.length; r++) {
            for (let i = 0; i < retval[r].arr.length; i++) {
              if (retval[r].arr[i].count) {
                retval[r].arr[i].x /= retval[r].arr[i].count;
              }
            }
          }
        }
        break;
      case 'count':
        ranges[0] = { text: 'Increasing' };
        ranges[1] = { text: 'Decreasing' };
        for (let f = 0; f < places.length; f++) {
          let fips = places[f].value;
          let place = PlaceData[fips];
          let arr = place.daily;
          let lengthOffset = retval[0].arr.length - arr.length;
          for (let i = 0; i < arr.length; i++) {
            let val;
            if (modifier && modifier.func && field.per) {
              val = modifier.func(place, field.f, i) - modifier.func(place, field.f, Math.max(0, i - 7));
            } else {
              val = arr[i][field.f] - arr[Math.max(0, i - 7)][field.f];
            }
            if (val >= 0) {
              retval[0].arr[i + lengthOffset].x++;
            } else {
              retval[1].arr[i + lengthOffset].x++;
            }
          }
        }
        break;
      case 'total':
        ranges[0] = { text: 'Increasing' };
        ranges[1] = { text: 'Descreasong' };
        for (let f = 0; f < places.length; f++) {
          let fips = places[f].value;
          let place = PlaceData[fips];
          let arr = place.daily;
          let lengthOffset = retval[0].arr.length - arr.length;
          for (let i = 0; i < arr.length; i++) {
            let val;
            if (modifier && modifier.func && field.per) {
              val = modifier.func(place, field.f, i) - modifier.func(place, field.f, Math.max(0, i - 7));
            } else {
              val = arr[i][field.f] - arr[Math.max(0, i - 7)][field.f];
            }
            if (val >= 0) {
              retval[0].arr[i + lengthOffset].x += getValue(fips, field2);
              retval[0].arr[i + lengthOffset].count++;
            } else {
              retval[1].arr[i + lengthOffset].x += getValue(fips, field2);
              retval[1].arr[i + lengthOffset].count++;
            }
          }
        }
        if (field2.average) {
          for (let r = 0; r < retval.length; r++) {
            for (let i = 0; i < retval[r].arr.length; i++) {
              if (retval[r].arr[i].count) {
                retval[r].arr[i].x /= retval[r].arr[i].count;
              }
            }
          }
        }
        break;
      case 'histo':
        let histoSteps = 6;
        let step;
        let max, min;
        let stepUsed = [];
        let boolean = true;
        for (let i = 0; i < histoSteps; i++) {
          stepUsed[i] = false;
        }
        for (let f = 0; f < places.length; f++) {
          let fips = places[f].value;
          let place = PlaceData[fips];
          let val = place.totals[field2.f] ? place.totals[field2.f] : place[field2.f];
          if (val !== undefined) {
            if (max === undefined) {
              max = min = val;
            } else {
              if (typeof val !== 'boolean') {
                boolean = false;
              }
              if (val !== undefined) {
                max = Math.max(val, max);
                min = Math.min(val, min);
              }
            }
          }
        }
        if (boolean) {
          histoSteps = 2;
          step = 1;
          ranges[0] = { text: Text.firstCaps(field2.shortText) + ' false' };
          ranges[1] = { text: Text.firstCaps(field2.shortText) + ' true' };
          retval = retval.slice(0, 2);
        } else {
          step = (max - min) / histoSteps;
          for (let i = 0; i < histoSteps; i++) {
            let text = Text.firstCaps(field2.shortText) + ' ';
            text += wrapNum(Numbers.prettyPrint(min + i * step, true), field2);
            text += '-'
            text += wrapNum(Numbers.prettyPrint(min + (i + 1) * step, true), field2);
            ranges[i] = { text: text };
          }
        }
        for (let f = 0; f < places.length; f++) {
          let fips = places[f].value;
          let place = PlaceData[fips];
          let arr = place.daily;
          let lengthOffset = retval[0].arr.length - arr.length;
          let compare = place.totals[field2.f] ? place.totals[field2.f] : place[field2.f];
          if (compare === undefined) {
            continue;
          }
          let insertLevel;
          if (boolean) {
            insertLevel = compare === false ? 0 : 1;
          } else {
            for (insertLevel = 0; insertLevel < histoSteps - 1; insertLevel++) {
              if (compare <= (insertLevel + 1) * step + min) {
                break;
              }
            }
          }
          stepUsed[insertLevel] = true;
          for (let i = 0; i < arr.length; i++) {
            let val;
            if (modifier && modifier.func && field.per) {
              val = modifier.func(place, field.f, i);
            } else {
              val = arr[i][field.f];
            }
            retval[insertLevel].arr[i + lengthOffset].x += val;
            retval[insertLevel].arr[i + lengthOffset].count++;
          }
        }
        for (let i = histoSteps - 1; i >= 0; i--) {
          if (!stepUsed[i]) {
            retval.splice(i, 1);
          }
        }
        if (field.average || (modifier && modifier.average)) {
          for (let r = 0; r < retval.length; r++) {
            for (let i = 0; i < retval[r].arr.length; i++) {
              if (retval[r].arr[i].count) {
                retval[r].arr[i].x /= retval[r].arr[i].count;
              }
            }
          }
        }
        break;
    }
  }
  return { set: retval, ranges: ranges };
}

function scatterQuery(field1, field2, modifier, statesOnly) {
  let places = statesOnly ? Places.states() : Places.statesAndCounties();
  let retval = [];
  for (let p = 0; p < places.length; p++) {
    let place = PlaceData[places[p].value];
    let x, y;
    if (modifier && modifier.func && field1.per && place.totals[field1.f] !== undefined) {
      x = modifier.func(place, field1.f, place.daily.length - 1);
    } else {
      x = place.totals[field1.f] ? place.totals[field1.f] : place[field1.f];
    }
    if (modifier && modifier.func && field2.per && place.totals[field2.f] !== undefined) {
      y = modifier.func(place, field2.f, place.daily.length - 1);
    } else {
      y = place.totals[field2.f] ? place.totals[field2.f] : place[field2.f];
    }

    if (x != undefined && y !== undefined) {
      retval.push({
        x: x, y: y, state: place.state, county: place.county, f1: field1.shortText, f2: field2.shortText
      });
    }
  }
  return retval;
}