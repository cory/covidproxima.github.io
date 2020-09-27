// (c) Cory Ondrejka 2020
'use strict'

let ShelterData = {
  alabama: [
    { date: '2020-04-05', shelter: true },
    { date: '2020-05-01', shelter: false },
    { date: '2020-07-29', shelter: true }
  ],
  alaska: [
    { date: '2020-03-28', shelter: true },
    { date: '2020-04-24', shelter: false }
  ],
  arkansas: [
    { date: '2020-07-20', shelter: true }
  ],
  arizona: [
    { date: '2020-03-31', shelter: true },
    { date: '2020-05-15', shelter: false },
    { date: '2020-06-29', shelter: true },
  ],
  california: [
    { date: '2020-03-19', shelter: true },
    { date: '2020-05-08', shelter: false },
    { date: '2020-06-30', shelter: true }
  ],
  colorado: [
    { date: '2020-03-26', shelter: true },
    { date: '2020-04-26', shelter: false }
  ],
  connecticut: [
    { date: '2020-03-23', shelter: true },
    { date: '2020-05-20', shelter: false },
    { date: '2020-07-07', shelter: true },
  ],
  deleware: [
    { date: '2020-03-24', shelter: true },
    { date: '2020-06-01', shelter: false }
  ],
  'district of columbia': [
    { date: '2020-04-01', shelter: true },
    { date: '2020-06-08', shelter: false }
  ],
  florida: [
    { date: '2020-04-03', shelter: true },
    { date: '2020-05-04', shelter: false },
    { date: '2020-06-26', shelter: true },
    { date: '2020-09-26', shelter: false }
  ],
  georgia: [
    { date: '2020-04-03', shelter: true },
    { date: '2020-04-30', shelter: false }
  ],
  hawaii: [
    { date: '2020-03-25', shelter: true },
    { date: '2020-05-07', shelter: false }
  ],
  idaho: [
    { date: '2020-03-25', shelter: true },
    { date: '2020-04-30', shelter: false }
  ],
  illinois: [
    { date: '2020-03-21', shelter: true },
    { date: '2020-05-31', shelter: false }
  ],
  indiana: [
    { date: '2020-03-24', shelter: true },
    { date: '2020-05-04', shelter: false }
  ],
  iowa: [
    { date: '2020-03-17', shelter: true },
    { date: '2020-05-01', shelter: false }
  ],
  kansas: [
    { date: '2020-03-30', shelter: true },
    { date: '2020-05-03', shelter: false }
  ],
  kentucky: [
    { date: '2020-03-26', shelter: true },
    { date: '2020-05-20', shelter: false },
    { date: '2020-07-28', shelter: true },
  ],
  louisiana: [
    { date: '2020-03-23', shelter: true },
    { date: '2020-05-15', shelter: false },
    { date: '2020-07-28', shelter: true },
  ],
  maine: [
    { date: '2020-04-02', shelter: true },
    { date: '2020-05-11', shelter: false }
  ],
  maryland: [
    { date: '2020-03-30', shelter: true },
    { date: '2020-05-15', shelter: false },
    { date: '2020-07-29', shelter: true },
  ],
  massachusetts: [
    { date: '2020-03-24', shelter: true },
    { date: '2020-05-18', shelter: false }
  ],
  michigan: [
    { date: '2020-03-24', shelter: true },
    { date: '2020-05-28', shelter: false },
    { date: '2020-07-29', shelter: true },
  ],
  minnesota: [
    { date: '2020-03-27', shelter: true },
    { date: '2020-05-17', shelter: false }
  ],
  mississippi: [
    { date: '2020-04-03', shelter: true },
    { date: '2020-04-27', shelter: false },
    { date: '2020-07-23', shelter: true },
  ],
  missouri: [
    { date: '2020-04-06', shelter: true },
    { date: '2020-05-03', shelter: false }
  ],
  montana: [
    { date: '2020-03-28', shelter: true },
    { date: '2020-04-26', shelter: false }
  ],
  nebraska: [
    { date: '2020-04-01', shelter: true },
    { date: '2020-05-04', shelter: false }
  ],
  nevada: [
    { date: '2020-04-01', shelter: true },
    { date: '2020-05-09', shelter: false },
    { date: '2020-07-28', shelter: true },
  ],
  'new hampshire': [
    { date: '2020-03-27', shelter: true },
    { date: '2020-05-18', shelter: false }
  ],
  'new jersey': [
    { date: '2020-03-21', shelter: true },
    { date: '2020-06-05', shelter: false }
  ],
  'new mexico': [
    { date: '2020-03-24', shelter: true },
    { date: '2020-05-31', shelter: false },
    { date: '2020-07-24', shelter: true },
  ],
  'new york': [
    { date: '2020-03-22', shelter: true },
    { date: '2020-05-28', shelter: false }
  ],
  'north carolina': [
    { date: '2020-03-30', shelter: true },
    { date: '2020-05-08', shelter: false }
  ],
  'north dakota': [
    { date: '2020-03-20', shelter: true },
    { date: '2020-05-01', shelter: false }
  ],
  ohio: [
    { date: '2020-03-23', shelter: true },
    { date: '2020-05-29', shelter: false }
  ],
  oklahoma: [
    { date: '2020-03-28', shelter: true },
    { date: '2020-05-01', shelter: false }
  ],
  oregon: [
    { date: '2020-03-23', shelter: true },
    { date: '2020-05-15', shelter: false }
  ],
  pennsylvania: [
    { date: '2020-04-01', shelter: true },
    { date: '2020-06-04', shelter: false }
  ],
  'rhode island': [
    { date: '2020-03-28', shelter: true },
    { date: '2020-05-08', shelter: false }
  ],
  'south carolina': [
    { date: '2020-04-07', shelter: true },
    { date: '2020-05-04', shelter: false }
  ],
  tennessee: [
    { date: '2020-03-31', shelter: true },
    { date: '2020-04-27', shelter: false }
  ],
  texas: [
    { date: '2020-04-02', shelter: true },
    { date: '2020-04-30', shelter: false },
    { date: '2020-06-26', shelter: true }
  ],
  utah: [
    { date: '2020-03-27', shelter: true },
    { date: '2020-05-01', shelter: false }
  ],
  vermont: [
    { date: '2020-03-25', shelter: true },
    { date: '2020-05-15', shelter: false }
  ],
  virginia: [
    { date: '2020-03-30', shelter: true },
    { date: '2020-06-10', shelter: false }
  ],
  washington: [
    { date: '2020-03-23', shelter: true },
    { date: '2020-05-11', shelter: false }
  ],
  'west virginia': [
    { date: '2020-03-24', shelter: true },
    { date: '2020-05-03', shelter: false }
  ],
  wisconsin: [
    { date: '2020-03-25', shelter: true },
    { date: '2020-05-13', shelter: false }
  ],
  wyoming: [
    { date: '2020-03-28', shelter: true },
    { date: '2020-05-01', shelter: false }
  ],
};

export default ShelterData;
