// (c) Cory Ondrejka 2020

# How many people are infected near me?

For many of us, this is the most important question. This is interactive,
so you can click on the underlined text to see what's going on near you.

[text 1] are currently infectuous in [entry 2] right now.[1]

[map 3]

Put another way, [text 8] infectuous people suggests [text 9] change a group of 10 people
hss at least 1 infectuous person in it.

[map 10]


[table 4 Infectuous per capita]

[line 5]


[1] The map shows every county in the United States. The NYT dataset contains
daily cases and deaths by [FIPS](https://en.wikipedia.org/wiki/Federal_Information_Processing_Standard_state_code)
codes, which correspond to US counties. Their exception is that they report data on
New York City, rather than the five boroughs that make it up (the Bronx, Brooklyn, Manhattan, Queens, and Staten Island.)

[1 result type:text; field:e6; places:e2; modifier:e7;]
[2 entry places:statesUp; value:united states; title:type place or zipcode;]
[3 result type:map; field:e6; places:e2; modifier:e7;]
[4 result type:table; field:e6; places:e2; modifier:e7; delta:true; count:5;]
[5 result type:line; field:e6; places:e2; modifier:e7;]
[6 entry field:time; value:activeCases; title:select;]
[7 entry modifier:true; value:pc; title:select;]
[8 result type:text; field:e6; places:e2; modifier:e7;]
[9 result type:text; field:time; value:p10; places:e2; modifier:overall;]
[10 result type:map; field:time; value:p10; places:e2; modifier:overall;]
