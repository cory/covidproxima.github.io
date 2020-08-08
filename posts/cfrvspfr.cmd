// (c) Cory Ondrejka 2020

# Population vs case fatality rates

There is sometimes confusion about the difference between *Case* Fatality Rates (CFR)
and *Population* Fatality Rates (PFR). CFR is the percentage of people who have died
out of the total number of positive cases. So, right now, in [entry 1], [text 2] people
have died and [text 3] people have tested positive, resulting in a CFR of [text 4].

The total population is [text 5], so the PFR is [text 6].

You can see them graphed against each other, below. Notice how CFR rises and falls, as
cases surge and ebb, followed by fatalities 2-3 weeks later. PFR, on the other hand, is
monotonically increasing -- the more people die, the higher your PFR.

#### Case Fatality Rate
[line 7]

#### Population Fatality Rate
[line 10]


[1 entry places:statesUp; value:united states; title:type place or zipcode;]
[2 result type:text; field:time; value:deaths; places:e1;]
[3 result type:text; field:time; value:cases; places:e1;]
[4 result type:text; field:time; value:cfr; places:e1;]
[5 result type:text; field:totals; value:population; places:e1;]
[6 result type:text; field:time; value:pfr; places:e1;]
[7 result type:line; field:e8; places:e1;]
[8 entry field:time; value:cfr;]
[10 result type:line; field:e9; places:e1;]
[9 entry field:time; value:pfr;]
