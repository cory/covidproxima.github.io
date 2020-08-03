// (c) Cory Ondrejka 2020

# How does race change the impact of covid-19?

Covid is not a uniform expeirence for Americans. The CDC [reports](https://www.cdc.gov/coronavirus/2019-ncov/need-extra-precautions/racial-ethnic-minorities.html) higher hospitalization rates for Americans of color. It also shows up in the NY Times data.
The graphs below show outcomes based on the Black popupalation of US counties.

Per capita fatality rate percentage of Black residents in a county 
As I write, the overall fatality rate for communities with more Black residents
is 2-6 times higher than counties with the fewest Black residents.

[line 1]

Percentage of people in a county who are likely infectious, again cut by percent of population who are Black.
Again, counties with more Black residents are over twice as likely to be infectious compared to
counties with fewer Black residents.

[line 8]

As we'd expect, this translates into groups with twice the likelihood of an infectious participant.

[line 12]

And catching covid is more dangerous in heavily Black counties as well, with double the case
fatality rates.

[line 10]


[1 result type:line; field:e2; field2:e3; places:united states; examine:histo; modifier:pc;]
[2 entry field:time; value:deaths;]
[3 entry field:totals; value:black;]
[8 result type:line; field:e9; field2:e3; places:united states; examine:histo; modifier:pc]
[9 entry field:time; value:activeCases;]
[10 result type:line; field:e11; field2:e3; places:united states; examine:histo; modifier:overall]
[11 entry field:time; value:cfr;]
[12 result type:line; field:e13; field2:e3; places:united states; examine:histo; modifier:overall]
[13 entry field:time; value:p20;]
