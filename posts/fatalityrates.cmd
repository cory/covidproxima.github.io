// (c) Cory Ondrejka 2020

# How Deadly is Covid Now?

Even aside from the complete and utter bullshit being pushed by Fox News,
the President, etc, there is a lot of confusion about how dangerous covid
is. I'm just pulling US totals from the NY Times dataset, so all of this
is about averages, but let's dig in a bit.

First, [text 1] people have died. That's [text 2] people in the United States.

The overall *case fatality rate* tells you the overall number of deaths
divided by the total number of positive tests. It's current [text 3]. However,
if we look at the history of that number

[line 4]

We see that big initial spike from New York/New Jersey. That spike continues
to pull the average up. If we switch to a sliding window, we get a similar
curve

[line 5]

But a more accurate picture of what the odds are if you get covid now.
The overall US average now is [text 6].

It varies wildly by county and also by state.

[table 7]

Note that this is quite decorrelated from overall infection rates.

[table 8]

But the net is that there are many places in the US that look pretty scary
right now.

[1 result type:text; field:time; value:deaths; places:united states;]
[2 result type:text; field:time; value:deaths; places:united states; modifier:pc;]
[3 result type:text; field:time; value:cfr; places:united states;]
[4 result type:line; field:time; value:cfr; places:united states;]
[5 result type:line; field:time; value:ccfr; places:united states;]
[6 result type:text; field:time; value:ccfr; places:united states;]
[7 result type:table; field:time; value:ccfr; places:united states; states:true;]
[8 result type:table; field:time; value:cases; places:united states; states:true;]
