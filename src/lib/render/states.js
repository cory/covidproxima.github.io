// (c) Cory Ondrejka 2020
'use strict'

import * as Places from '../../data/data.js';
import Cmdown from '../render/cmdown.js';
import * as Text from '../util/text.js';

export default function states(path) {
  if (path[1] || path[2]) {
    let text = [];
    let location;
    if (path[2]) {
      location = path[2];
      text.push('# ' + Text.firstCaps(Places.fips2county(location)) +
        ', [' + Text.firstCaps(path[1].replace(/\-/g, ' ')) + '](#' + path[0] + '.' + path[1] + ')\n');
    } else {
      location = path[1].replace(/\-/g, ' ');
      text.push('# ' + Text.firstCaps(location) + '\n');
    }
    text.push('* [text 7] people died in the last week\n');
    text.push('* [text 8] new positive tests\n');
    text.push('* [text 9] current case fatality rate\n');
    text.push('[text 1] [entry 2] ([entry 3])\n');
    text.push('[map 4]\n');
    if (!path[2]) {
      text.push('[table 5]\n');
    }
    text.push('[line 6]\n');
    text.push('[1 result type:text; field:e2; places:' + location + '; modifier:e3;]')
    text.push('[2 entry field:time; value:p10; title:select;]')
    text.push('[3 entry modifier:true; value:overall; title:select;]')
    text.push('[4 result type:map; field:e2; places:' + location + '; modifier:e3;]')
    text.push('[5 result type:table; field:e2; places:' + location + '; modifier:e3; delta:true;]')
    text.push('[6 result type:line; field:e2; places:' + location + '; modifier:e3;]')
    text.push('[7 result type:text; field:time; value:w_deaths; places:' + location + ';]')
    text.push('[8 result type:text; field:time; value:w_cases; places:' + location + ';]')
    text.push('[9 result type:text; field:time; value:cfr; places:' + location + ';]')
    let data = Cmdown(text.join('\n'), 'story', 'footnote', 'States');
    return data.html;
  } else {
    let text = [];
    text.push('[table 4 Someone at a 10 person party is infectuous]\n');
    text.push('[table 0 Infectuous per capita]\n');
    text.push('[table 1 Weekly deaths]\n');
    text.push('[table 5 Total deaths]\n');
    text.push('[table 2 Weekly positive tests]\n');
    text.push('[table 3 Case fatality rates]\n');
    text.push('[0 result type:table; field:time; value:activeCases; places:united states; states:true; delta:true; count:10; modifier:pc;]')
    text.push('[1 result type:table; field:time; value:w_deaths; places:united states; states:true; delta:true; count:10; modifier:overall;]')
    text.push('[5 result type:table; field:time; value:deaths; places:united states; states:true; delta:true; count:10; modifier:overall;]')
    text.push('[2 result type:table; field:time; value:w_cases; places:united states; states:true; delta:true; count:10; modifier:overall;]')
    text.push('[3 result type:table; field:time; value:cfr; places:united states; states:true; delta:true; count:10; modifier:overall;]')
    text.push('[4 result type:table; field:time; value:p10; places:united states; states:true; delta:true; count:10; modifier:overall;]')
    let data = Cmdown(text.join('\n'), 'story', 'footnote', 'States');
    return data.html;
  }
}