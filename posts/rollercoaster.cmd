// (c) Cory Ondrejka 2020

# Fall is going to be a rollercoaster

Positive tests are rising rapidly in several states, despite a testing rates in the US either
generally [holding constant or declining](https://coronavirus.jhu.edu/testing/individual-states).
We might be at the start of enough big spike even through overall US cases look flat.

[line 1]

[1 result type:line; field:time; value:w_cases; places:iowa,alabama,ohio,missouri,south dakota,tennessee; modifier:overall; total:true]

Looking at the US overall, split by larger and smalle counties helps to understand
why it's so difficult to track what's happening with covid. The large, early counties
continue to decline but lots of less populous counties are still growing.

[line 2]

[2 result type:line; field:time; field2:e4; value:w_cases; places:united states; examine:split;]
[4 entry field:totals; value:population;]

Looking across the country, you can see the big swings.

[map 3]

[3 result type:map; field:totals; value:wow_cases; places:united states; modifier:overall;]
