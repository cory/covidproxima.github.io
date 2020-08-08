// (c) Cory Ondrejka 2020

# Race and covid in California

I had previously explored how [race](#posts.race) and [poverty](#posts.poverty)
show up in the NY Times data, but a friend suggested looking at California by
Hispanic population.

Again, the data is stark. Per capita deaths for counties with a larger Hispanic
population have three times the per capita death rate of less Hispanic counties.

[line 1]

Similarly, the chances of a group of 50 in more Hispanic counties is much more
likely to include someone infectious than a group in a less Hispanic county,
whether or not it includes the likelihood of wearing a mask.

#### Ignore mask rates
[line 8]

#### Include likelihood of wearing a mask
[line 10]


[1 result type:line; field:e2; field2:e3; places:california; examine:split; modifier:pc;]
[2 entry field:time; value:deaths;]
[3 entry field:totals; value:hispanic;]
[8 result type:line; field:e9; field2:e3; places:california; examine:split; modifier:overall]
[9 entry field:time; value:p50;]
[10 result type:line; field:e11; field2:e3; places:california; examine:split; modifier:overall]
[11 entry field:time; value:p50m;]
