// (c) Cory Ondrejka 2020

# COVID-19 and the election

Election day is tomorrow and the US is hitting new highs everyday for covid infections. The election is likely to come
down to Pennsylvania, Florida, Arizona, North Carolina, and Georgia. What's happening there?

## Weekly Infectious

[line 1]

## Weekly Deaths

[line 2]

While Florida and Georgia had larger summer spikes, infections are moving back up in all four states. Deaths are more mixed,
but we're still early in this surge and we'd expect mortality to keep falling given better treatments.

What about states a bit further out on both sides of the spectrum: Ohio, Texas, Nevada, and Michigan?

## Weekly Infectious

[line 3]

## Weekly Deaths

[line 4]

Michigan, Texas, and Ohio all look scary.

Lots of reporting on covid being worse in Republican states. Looking at 2018 House vote as a proxy for that vs
weekly infectious people. I've been too lazy to build a good scatter graph, but the assertion passes the eyeball test,
with most the rapidly expanding infections in states that voted more republican in 2018.

## Republic vs Weekly Infectious

[scatter 15]

Please vote. Be careful.

[1 result type:line; field:time; value:w_probableCases; places:florida,georgia,pennsylvania,north carolina; modifier:overall;]
[2 result type:line; field:time; value:w_deaths; places:florida,georgia,pennsylvania,north carolina; modifier:overall;]
[3 result type:line; field:time; value:w_probableCases; places:texas,ohio,nevada,michigan; modifier:overall;]
[4 result type:line; field:time; value:w_deaths; places:texas,ohio,nevada,michigan; modifier:overall;]
[15 result type:scatter; field:e12; field2:e13; modifier:e14; states:1;]
[12 entry field:totals; value:repvotes; title:select;]
[13 entry field:totals; value:w_probableCases; title:select;]
[14 entry modifier:true; value:pc; title:select;]
