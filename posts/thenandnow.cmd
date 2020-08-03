// (c) Cory Ondrejka 2020

# How do states from the early criss compare to now?

New York, New Jersey, Massachusetts, Illinois, Pennsylvania, and Michigan were hit hard early in the crisis,
while Texas[1], Florida, Arizona, South Carolina, Georgia,
and California have been on a longer, slower trajectory. How do their weekly death totals compare to each other?

## Weekly Deaths
The early states had the sudden, terrifying spike we all remember from April, with deaths dominated by New York.
While those early states occasionally issue corrections as they reclassify deaths -- these show up as the big,
discontinuous jumps on the graphs -- they have generally settled down into comparatively few weekly deaths without
a signficiant resurgence.

[line 1]

The states spiking more recently show a very different pattern, with an initial rise at the start of the
pandemic followed by a long, fairly-stable plateau followed by a dramatic spike in July.

[line 2]

## Weekly Deaths per Capita

Changing to per capita statics helps give better intuition for whether a particular state is an outlier due
to being hit harder by the virus or simply due to having a larger population. While New York remains the largest
of the early states it's separation from New Jersey and Massachusetts is much smaller.

[line 3]

Similarly, California is more middle of the pack for the recent surging states and Arizona's struggles appear
much more clearly.

[line 4]

What's clear -- at least for these states -- is that in both cases we're still talking about the first wave of
infections. In the early states, it hit very hard and very fast, while in the later states the virus has been
growing more slowly, only accerlating hard since July.

[1 result type:line; field:time; value:w_deaths; places:new york,new jersey,massachusetts,illinois,pennsylvania,michigan; modifier:overall;]
[2 result type:line; field:time; value:w_deaths; places:texas,florida,arizona,south carolina,georgia,california; modifier:overall;]
[3 result type:line; field:time; value:w_deaths; places:new york,new jersey,massachusetts,illinois,pennsylvania,michigan; modifier:pc;]
[4 result type:line; field:time; value:w_deaths; places:texas,florida,arizona,south carolina,georgia,california; modifier:pc;]

[1] Note that on 28 July 2020 Texas changed to counting covid deaths based on death certificates, so there is a jump in their weekly totals
