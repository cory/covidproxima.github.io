// (c) Cory Ondrejka 2020

# Explore all the data

This is the page I use to explore the data and see what pops out. It is not
the easiest interface nor particularly intuitive. It will get better!

## Chart

Simple line chart with options to divide counties by a second signal.
the first field is the location. The second is the signal to be graphed.
The third is a second signal which is optionaly used by the field marked
"none." Finally, the field marked "total" give you the option to change the first 
signal to be per capita (and a few other options). This doesn't make sense
for all fields and for now the UI won't protect you!

[entry 2] in [entry 3] by [entry 4] ([entry 5]) ([entry 6])

[line 1]

## Map

Put geographic data on the map! Again, option to cut by per capita. Again,
it might not always be correct to do so.

[entry 8] in [entry 9] ([entry 10])

[map 7]

## Table

Get a list of counties ranked by the chosen statistic.

[entry 16] in [entry 17] ([entry 18])

[table 19]

Get a list of states ranked by the chosen statistic.

[entry 24] in [entry 25] ([entry 26])

[table 23]

## People chart

Show the recovered, currently infected, and dead out of total population for [entry 19].

[people 20]

## Scatter

Even more experimental than the rest.

[entry 12] vs [entry 13] ([entry 14])

#### States Only

[scatter 11]

#### States and Counties

[scatter 15]


[1 result type:line; field:e3; field2:e4; places:e2; examine:e5; modifier:e6;]
[2 entry places:statesUp; value:united states; title:type place or zipcode;]
[3 entry field:time; value:activeCases; title:select;]
[4 entry field:totals; value:population; title:select;]
[5 entry examine:true; value:none; title:select;]
[6 entry modifier:true; value:overall; title:select;]

[7 result type:map; field:e8; places:e9; modifier:e10;]
[8 entry field:totals; value:activeCases; title:select;]
[9 entry places:statesUp; value:united states; title:type place or zipcode;]
[10 entry modifier:true; value:overall; title:select;]

[11 result type:scatter; field:e12; field2:e13; modifier:e14; states:1;]
[15 result type:scatter; field:e12; field2:e13; modifier:e14;]
[12 entry field:totals; value:activeCases; title:select;]
[13 entry field:totals; value:poverty; title:select;]
[14 entry modifier:true; value:overall; title:select;]

[19 result type:table; field:e16; places:e17; modifier:e18; delta:true; count:10]
[16 entry field:totals; value:p50m; title:select;]
[17 entry places:statesUp; value:united states; title:type place or zipcode;]
[18 entry modifier:true; value:overall; title:select;]

[20 result type:people; field:time; value:deaths; field2:e21; field3:e22; places:e19; modifier:pc; count:1000;]
[19 entry places:statesUp; value:united states; title:type place or zipcode;]
[21 entry field:time; value:activeCases;]
[22 entry field:time; value:recoveries;]

[23 result type:table; field:e24; places:e25; modifier:e26; delta:true; count:10; states:true;]
[24 entry field:totals; value:p50m; title:select;]
[25 entry places:statesUp; value:united states; title:type place or zipcode;]
[26 entry modifier:true; value:overall; title:select;]

