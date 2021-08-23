// (c) Cory Ondrejka 2021

# Data and Delta

## Changing to weekly data

*Covid Proxima* was conceived as a quick experiment, a way to poke at the [New York Times](https://github.com/nytimes/covid-19-data)' dataset.
I didn't want to build hosting for this and wanted it to just run in a browser, so I could use it as a local tool and post it as 
a static website with no dependencies. It has all the delightful messiness of any quick and dirty side project.

Along the way, COVID-19 kept happening. Thanks to [delta](https://www.cdc.gov/coronavirus/2019-ncov/variants/delta-variant.html), the daily data
dump is bigger than ever. So, to keep this site working on all kinds of browsers and CPUs, I just made a change to only compute data in 7-day
chunks, moving backwards from the current day. Not perfect, and some of my previous posts read a bit strangely now, since they discuss
daily results. I'll fix those over time, but this was the quickest way to keep the startup time and memory usage down.

## So, how bad is delta?

The impact of delta is remarkable. Cases are more than halfway back to our all-time peaks over the winter, despite a majority of American adults
having at least one vaccination.

### Cases

[line 1]

### Deaths

[line 2]

Unfortunately, we know deaths are trailing indicator of cases. The US fatality rate remains at a relatively constant [text 3], so expect the deaths to go up quite a bit in the coming weeks. Per capita, the most infections are happening in Mississippi, Louisiana, Florida, Alabama, and Arkansas, with all of them near or above all-time weekly infection highs.

[line 4]

Since Florida isn't reporting county-level death statistics, it's weekly deaths graph looks whacky. 

[line 5]

Finally, looking at the absolute numbers on new cases gives a different list of states, with Florida, Texas, California, Georgia, and North Carolina leading the nation.

[line 6]

[1 result type:line; field:totals; value:w_cases; places:united states; hideparent:true;]
[2 result type:line; field:totals; value:w_deaths; places:united states; hideparent:true;]
[3 result type:text; field:time; value:cfr; places:united states;]
[4 result type:line; field:totals; value:w_cases; places:mississippi,louisiana,florida,alabama,arkansas; hideparent:true;]
[5 result type:line; field:totals; value:w_deaths; places:mississippi,louisiana,florida,alabama,arkansas; hideparent:true;]
[6 result type:line; field:totals; value:w_cases; places:florida,texas,california,georgia,north carolina; hideparent:true;]

