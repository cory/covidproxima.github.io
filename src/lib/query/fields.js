// (c) Cory Ondrejka 2020
'use strict'

import { field2idx } from '../../data/data.js?cachebust=75763';


let BaseTypes = {
  covidtime: { f: 'covidtime', text: 'days', average: false, units: '' },
  siptime: { f: 'siptime', text: 'days', average: false, units: '' },
  today: { f: 'date', text: '', average: false, units: '' },
  firstcovid: { f: 'firstcovid', text: '', average: false, units: '' },
  deaths: { f: 'deaths', text: 'people have died', upGood: false, shortText: 'deaths', average: false, units: '', per: true },
  cases: { f: 'cases', text: 'people tested positive', upGood: false, shortText: 'tested positive', average: false, units: '', per: true },
  probableCases: { f: 'probableCases', text: 'people likely infected ever', upGood: false, shortText: 'infected', average: false, units: '', per: true },
  recoveries: { f: 'recoveries', text: 'people have recovered', upGood: true, shortText: 'recovered', average: false, units: '', per: true },
  activeCases: { f: 'activeCases', text: 'people likely infectious', upGood: false, shortText: 'infectious', average: false, units: '', per: true },
  cfr: { f: 'cfr', text: 'case fatality rate', upGood: false, shortText: 'case fatality rate', average: true, units: '' },
  ccfr: { f: 'ccfr', text: 'current case fatality rate', upGood: false, shortText: 'current case fatality rate', average: true, units: '' },
  pfr: { f: 'pfr', text: 'population fatality rate', upGood: false, shortText: 'population fatality rate', average: true, units: '' },
  p10: { f: 'p10', text: 'chance someone at a 10 person event is infectious', upGood: false, shortText: 'p10 infectious', average: true, units: '%' },
  p20: { f: 'p20', text: 'chance someone at a 20 person event is infectious', upGood: false, shortText: 'p20 infectious', average: true, units: '%' },
  p50: { f: 'p50', text: 'chance someone at a 50 person event is infectious', upGood: false, shortText: 'p50 infectious', average: true, units: '%' },
  p10m: { f: 'p10m', text: 'chance someone at a 10 person event is infectious and no mask', upGood: false, shortText: 'p10 no mask', average: true, units: '%' },
  p20m: { f: 'p20m', text: 'chance someone at a 20 person event is infectious and no mask', upGood: false, shortText: 'p20 no mask', average: true, units: '%' },
  p50m: { f: 'p50m', text: 'chance someone at a 50 person event is infectious and no mask', upGood: false, shortText: 'p50 no mask', average: true, units: '%' },
  w_deaths: { f: 'w_deaths', text: 'people have died in the last week', upGood: false, shortText: 'deaths/week', average: false, units: '', per: true },
  w_cases: { f: 'w_cases', text: 'people tested positive in the last week', upGood: false, shortText: 'tested positive/week', average: false, units: '', per: true },
  w_probableCases: { f: 'w_probableCases', text: 'people likely infected in the last week', upGood: false, shortText: 'infected/week', average: false, units: '', per: true },
  w_recoveries: { f: 'w_recoveries', text: 'people have recovered in the last week', upGood: true, shortText: 'recovered/week', average: false, units: '', per: true },
  w_activeCases: { f: 'w_activeCases', text: 'people likely became infectious in the last week', upGood: false, shortText: 'infectious/week', average: false, units: '', per: true },
  wow_deaths: { f: 'wow_deaths', text: 'people have died compared to last week', upGood: false, shortText: 'deaths w/w change', average: false, units: '', per: true },
  wow_cases: { f: 'wow_cases', text: 'people tested positive compared to last week', upGood: false, shortText: 'tested positive w/w change', average: false, units: '', per: true },
  wow_probableCases: { f: 'wow_probableCases', text: 'people likely infected compared to last week', upGood: false, shortText: 'infected w/w change', average: false, units: '', per: true },
  wow_recoveries: { f: 'wow_recoveries', text: 'people have recovered compared to last week', upGood: true, shortText: 'recovered w/w change', average: false, units: '', per: true },
  wow_activeCases: { f: 'wow_activeCases', text: 'people likely became infectious compared to last week', upGood: false, shortText: 'infectious w/w change', average: false, units: '', per: true },
  population: { f: 'population', text: 'population', shortText: 'population', average: false, units: '' },
  area: { f: 'area', text: 'area', shortText: 'area', average: false, units: 'sq.mi.' },
  density: { f: 'density', text: 'population density', shortText: 'popultation density', average: true, units: 'people/sq.mi.' },
  hhIncome: { f: 'hhIncome', text: 'household income', shortText: 'household income', average: true, units: '$' },
  pcIncome: { f: 'pcIncome', text: 'per capita income', shortText: 'per capita income', average: true, units: '$' },
  u18poverty: { f: 'u18poverty', text: 'under-18 poverty', shortText: 'u18 poverty', average: true, units: '%' },
  poverty: { f: 'poverty', text: 'poverty', shortText: 'poverty', average: true, units: '%' },
  deepPoverty: { f: 'deepPoverty', text: 'deep poverty', shortText: 'deep poverty', average: true, units: '%' },
  unemployment: { f: 'unemployment', text: 'pre-covid unemployment', shortText: 'unemployment', average: true, units: '%' },
  latitude: { f: 'latitude', text: 'average latitude', shortText: 'latitude', average: true, units: '' },
  u18pop: { f: 'u18pop', text: 'under-18 population', shortText: 'u18 population', average: true, units: '%' },
  o65pop: { f: 'o65pop', text: 'over-65 population', shortText: 'o65 population', average: true, units: '%' },
  white: { f: 'white', text: 'white population', shortText: 'white', average: true, units: '%' },
  black: { f: 'black', text: 'black population', shortText: 'black', average: true, units: '%' },
  asian: { f: 'asian', text: 'asian population', shortText: 'asian', average: true, units: '%' },
  nativeAmerican: { f: 'nativeAmerican', text: 'native american population', shortText: 'native american', average: true, units: '%' },
  hispanic: { f: 'hispanic', text: 'hispanic population', shortText: 'hispanic', average: true, units: '%' },
  nonEnglishHH: { f: 'nonEnglishHH', text: 'non-english speaking households', shortText: 'non-english', average: true, units: '' },
  edHSorLess: { f: 'edHSorLess', text: 'high-school education or less', shortText: 'hs or less', average: true, units: '%' },
  urbanRural: { f: 'urbanRural', text: 'urban/rural', shortText: 'urban', average: true, units: '' },
  beds: { f: 'beds', text: 'hospital beds', shortText: 'beds', average: false, units: '' },
  popmen: { f: 'popmen', text: 'percent male', shortText: '% men', average: true, units: '%' },
  aveage: { f: 'aveage', text: 'average age', shortText: 'ave age', average: true, units: '' },
  aveagem: { f: 'aveagem', text: 'average age of men', shortText: 'ave age men', average: true, units: '' },
  aveagew: { f: 'aveagew', text: 'average age of women', shortText: 'ave age women', average: true, units: '' },
  govrepublican: { f: 'govrepublican', text: 'Republican Governor', shortText: 'gop gov', average: false, units: '' },
  govmale: { f: 'govmale', text: 'Male Governor', shortText: 'male gov', average: false, units: '' },
  repvotes: { f: 'repvotes', text: 'Voted Republican in 2018 House election', shortText: 'voted republican', average: true, units: '%' },
  maskfreq: { f: 'maskfreq', text: 'Frequently or always wears a mask', shortText: 'mask frequent', average: true, units: '%' },
};

export let Types = {
  time: {
    deaths: BaseTypes.deaths,
    cases: BaseTypes.cases,
    probableCases: BaseTypes.probableCases,
    recoveries: BaseTypes.recoveries,
    activeCases: BaseTypes.activeCases,
    cfr: BaseTypes.cfr,
    ccfr: BaseTypes.ccfr,
    pfr: BaseTypes.pfr,
    p10: BaseTypes.p10,
    p20: BaseTypes.p20,
    p50: BaseTypes.p50,
    p10m: BaseTypes.p10m,
    p20m: BaseTypes.p20m,
    p50m: BaseTypes.p50m,
    w_deaths: BaseTypes.w_deaths,
    w_cases: BaseTypes.w_cases,
    w_probableCases: BaseTypes.w_probableCases,
    w_recoveries: BaseTypes.w_recoveries,
    w_activeCases: BaseTypes.w_activeCases,
    wow_deaths: BaseTypes.wow_deaths,
    wow_cases: BaseTypes.wow_cases,
    wow_probableCases: BaseTypes.wow_probableCases,
    wow_recoveries: BaseTypes.wow_recoveries,
    wow_activeCases: BaseTypes.wow_activeCases,
  },
  special: {
    covidtime: BaseTypes.covidtime,
    siptime: BaseTypes.siptime,
    today: BaseTypes.today,
    firstcovid: BaseTypes.firstcovid,
  },
  totals: {
    deaths: BaseTypes.deaths,
    cases: BaseTypes.cases,
    probableCases: BaseTypes.probableCases,
    recoveries: BaseTypes.recoveries,
    activeCases: BaseTypes.activeCases,
    cfr: BaseTypes.cfr,
    ccfr: BaseTypes.ccfr,
    pfr: BaseTypes.pfr,
    p10: BaseTypes.p10,
    p20: BaseTypes.p20,
    p50: BaseTypes.p50,
    p10m: BaseTypes.p10m,
    p20m: BaseTypes.p20m,
    p50m: BaseTypes.p50m,
    w_deaths: BaseTypes.w_deaths,
    w_cases: BaseTypes.w_cases,
    w_probableCases: BaseTypes.w_probableCases,
    w_recoveries: BaseTypes.w_recoveries,
    w_activeCases: BaseTypes.w_activeCases,
    wow_deaths: BaseTypes.wow_deaths,
    wow_cases: BaseTypes.wow_cases,
    wow_probableCases: BaseTypes.wow_probableCases,
    wow_recoveries: BaseTypes.wow_recoveries,
    wow_activeCases: BaseTypes.wow_activeCases,
    population: BaseTypes.population,
    area: BaseTypes.area,
    density: BaseTypes.density,
    hhIncome: BaseTypes.hhIncome,
    pcIncome: BaseTypes.pcIncome,
    u18poverty: BaseTypes.u18poverty,
    poverty: BaseTypes.poverty,
    deepPoverty: BaseTypes.deepPoverty,
    unemployment: BaseTypes.unemployment,
    latitude: BaseTypes.latitude,
    u18pop: BaseTypes.u18pop,
    o65pop: BaseTypes.o65pop,
    white: BaseTypes.white,
    black: BaseTypes.black,
    asian: BaseTypes.asian,
    nativeAmerican: BaseTypes.nativeAmerican,
    hispanic: BaseTypes.hispanic,
    nonEnglishHH: BaseTypes.nonEnglishHH,
    edHSorLess: BaseTypes.edHSorLess,
    urbanRural: BaseTypes.urbanRural,
    beds: BaseTypes.beds,
    popmen: BaseTypes.popmen,
    aveage: BaseTypes.aveage,
    aveagem: BaseTypes.aveagem,
    aveagew: BaseTypes.aveagew,
    govrepublican: BaseTypes.govrepublican,
    govmale: BaseTypes.govmale,
    repvotes: BaseTypes.repvotes,
    maskfreq: BaseTypes.maskfreq,
  },
};

export function helper(field) {
  let modValue;
  let shortValue = field.value;
  let chopped = field.value.split('_');
  if (chopped.length === 2) {
    shortValue = chopped[1];
    modValue = chopped[0];
  }
  let ret = {
    type: field.field,
    text: Types[field.field][field.value].text,
    f: field.field !== 'special' ? field2idx(shortValue) : shortValue,
    modValue: modValue,
    average: Types[field.field][field.value].average,
    upGood: Types[field.field][field.value].upGood,
    shortText: Types[field.field][field.value].shortText,
    units: Types[field.field][field.value].units,
    per: Types[field.field][field.value].per,
  };
  if (field.smoothed) {
    ret.smoothed = true;
  }
  return ret;
}