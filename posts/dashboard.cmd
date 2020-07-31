// (c) Cory Ondrejka 2020

# COVID-19 Dashboard

## New cases and deaths this week
[line 1]

## How safe are 10 person gatherings?
[line 4]

## Where are the deaths?
[map 6]

## Where are gatherings unsafe?
[map 8]

[1 result type:line; field:e2; places:united states; field2:e3; modifier:overall;]
[2 entry field:time; value:w_cases;]
[3 entry field:time; value:w_deaths;]
[4 result type:line; field:e9; places:united states; modifier:overall;]
[9 entry field:time; value:p10;]
[5 entry examine:true; value:split; title:select;]
[6 result type:map; field:e3; places:united states; modifier:overall;]
[7 entry field:totals; value:w_deaths;]
[8 result type:map; field:e9; places:united states; modifier:overall;]
