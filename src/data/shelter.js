// (c) Cory Ondrejka 2020
'use strict'

let ShelterData = {
  alabama: [
    { date: '2020-04-05', val: true },
    { date: '2020-05-01', val: false },
  ],
  alaska: [
    { date: '2020-03-28', val: true },
    { date: '2020-04-24', val: false }
  ],
  arizona: [
    { date: '2020-03-32', val: true },
    { date: '2020-05-15', val: false }
  ],
  arizona: [
    { date: '2020-03-31', val: true },
    { date: '2020-05-15', val: false },
  ],
  california: [
    { date: '2020-03-19', val: true },
    { date: '2020-05-08', val: false },
  ],
  colorado: [
    { date: '2020-03-26', val: true },
    { date: '2020-04-26', val: false }
  ],
  connecticut: [
    { date: '2020-03-23', val: true },
    { date: '2020-05-20', val: false },
  ],
  deleware: [
    { date: '2020-03-24', val: true },
    { date: '2020-06-01', val: false }
  ],
  'district of columbia': [
    { date: '2020-04-01', val: true },
    { date: '2020-06-08', val: false }
  ],
  florida: [
    { date: '2020-04-03', val: true },
    { date: '2020-05-04', val: false },
  ],
  georgia: [
    { date: '2020-04-03', val: true },
    { date: '2020-04-30', val: false }
  ],
  hawaii: [
    { date: '2020-03-25', val: true },
    { date: '2020-05-07', val: false }
  ],
  idaho: [
    { date: '2020-03-25', val: true },
    { date: '2020-04-30', val: false }
  ],
  illinois: [
    { date: '2020-03-21', val: true },
    { date: '2020-05-31', val: false }
  ],
  indiana: [
    { date: '2020-03-24', val: true },
    { date: '2020-05-04', val: false }
  ],
  iowa: [
    { date: '2020-03-17', val: true },
    { date: '2020-05-01', val: false }
  ],
  kansas: [
    { date: '2020-03-30', val: true },
    { date: '2020-05-03', val: false }
  ],
  kentucky: [
    { date: '2020-03-26', val: true },
    { date: '2020-05-20', val: false },
  ],
  louisiana: [
    { date: '2020-03-23', val: true },
    { date: '2020-05-15', val: false },
  ],
  maine: [
    { date: '2020-04-02', val: true },
    { date: '2020-05-11', val: false }
  ],
  maryland: [
    { date: '2020-03-30', val: true },
    { date: '2020-05-15', val: false },
  ],
  massachusetts: [
    { date: '2020-03-24', val: true },
    { date: '2020-05-18', val: false }
  ],
  michigan: [
    { date: '2020-03-24', val: true },
    { date: '2020-05-28', val: false },
  ],
  minnesota: [
    { date: '2020-03-27', val: true },
    { date: '2020-05-17', val: false }
  ],
  mississippi: [
    { date: '2020-04-03', val: true },
    { date: '2020-04-27', val: false },
  ],
  missouri: [
    { date: '2020-04-06', val: true },
    { date: '2020-05-03', val: false }
  ],
  montana: [
    { date: '2020-03-28', val: true },
    { date: '2020-04-26', val: false }
  ],
  nebraska: [
    { date: '2020-04-01', val: true },
    { date: '2020-05-04', val: false }
  ],
  nevada: [
    { date: '2020-04-01', val: true },
    { date: '2020-05-09', val: false },
  ],
  'new hampshire': [
    { date: '2020-03-27', val: true },
    { date: '2020-05-18', val: false }
  ],
  'new jersey': [
    { date: '2020-03-21', val: true },
    { date: '2020-06-05', val: false }
  ],
  'new mexico': [
    { date: '2020-03-24', val: true },
    { date: '2020-05-31', val: false },
  ],
  'new york': [
    { date: '2020-03-22', val: true },
    { date: '2020-05-28', val: false }
  ],
  'north carolina': [
    { date: '2020-03-30', val: true },
    { date: '2020-05-08', val: false }
  ],
  'north dakota': [
    { date: '2020-03-20', val: true },
    { date: '2020-05-01', val: false }
  ],
  ohio: [
    { date: '2020-03-23', val: true },
    { date: '2020-05-29', val: false }
  ],
  oklahoma: [
    { date: '2020-03-28', val: true },
    { date: '2020-05-01', val: false }
  ],
  oregon: [
    { date: '2020-03-23', val: true },
    { date: '2020-05-15', val: false }
  ],
  pennsylvania: [
    { date: '2020-04-01', val: true },
    { date: '2020-06-04', val: false }
  ],
  'rhode island': [
    { date: '2020-03-28', val: true },
    { date: '2020-05-08', val: false }
  ],
  'south carolina': [
    { date: '2020-04-07', val: true },
    { date: '2020-05-04', val: false }
  ],
  tennessee: [
    { date: '2020-03-31', val: true },
    { date: '2020-04-27', val: false }
  ],
  texas: [
    { date: '2020-04-02', val: true },
    { date: '2020-04-30', val: false },
  ],
  utah: [
    { date: '2020-03-27', val: true },
    { date: '2020-05-01', val: false }
  ],
  vermont: [
    { date: '2020-03-25', val: true },
    { date: '2020-05-15', val: false }
  ],
  virginia: [
    { date: '2020-03-30', val: true },
    { date: '2020-06-10', val: false }
  ],
  washington: [
    { date: '2020-03-23', val: true },
    { date: '2020-05-11', val: false }
  ],
  'west virginia': [
    { date: '2020-03-24', val: true },
    { date: '2020-05-03', val: false }
  ],
  wisconsin: [
    { date: '2020-03-25', val: true },
    { date: '2020-05-13', val: false }
  ],
  wyoming: [
    { date: '2020-03-28', val: true },
    { date: '2020-05-01', val: false }
  ],
};

export default ShelterData;
