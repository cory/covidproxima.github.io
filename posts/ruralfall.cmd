// (c) Cory Ondrejka 2020

# The Rural Fall

General trend towards more cases and deaths is continuing. Lots of coverage of
COVID-19 shifting to rural counties, so I went looking. Definitely some signs.

First, if we just look at cases, split by counties with higher and lower population
density, the rise of the lower-density counties is very clear. Since early September,
low-density county cases have been more than half of the high-density counties and
that gap continues to close.

[line 1]

[1 result type:line; field:time; value:w_cases; field2:e2; places:united states; examine:split;]
[2 entry field:totals; value:density;]

Looking at the map, for a week with [text 3] deaths, it's surprising how few big hotspots
there are. Instead, many states just have 1 or 2 deaths in many, many counties. Expect those numbers
to increase.

[3 result type:text; field:time; value:w_deaths; places:united states;]

[map 4]
[4 result type:map; field:totals; value:w_deaths; places:united states;]
