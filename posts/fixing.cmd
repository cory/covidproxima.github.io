// (c) Cory Ondrejka 2021

# Fixing some bugs, looking at Florida

A few years later and the site is still mostly working, yay!
However, I missed some bugs I introduced in the last big change.

Also, the NY Times no longer updating their data and covid is no long a pandemic. Plus, states
were sort of random in when they stopped updating their data, so some of the graphs are a little
wonky. Need to ponder how to fix that.

It's also a chance to check in on the ultimate Florida Man
Governor Ron DeSantis. DeSantis wants to be President really, really bad.
Like, "Kevin McCarthy wants a gavel"-bad. How many extra Floridians died
because of that desire? Obviously, experts will weigh in, but we can look at a few graphs and make
some pretty good guesses.

## Population Fatality Rate 

Let's start with population fatality rate, e.g. what percentage of your population has been killed by covid?

*Population Fatality Rate*
[line 1]

[1 result type:line; field:time; value:pfr; places:florida,california,utah,united states; modifier:overall; total:true]

So, as of this writing, 0.07% more citizens killed by covid than the nationwide average. If Florida has just
achieved an average outcome, ~15,000 Floridians would be alive today. *15,000*. If Florida had matched the outcomes
of a wildly liberal state like, say, Utah, *50,000* Floridians would be alive today.

So, what happened?

## First, Summer Happened

DeSantis kept saying everything was fine. It wasn't. Each summer, Florida saw significantly higher per capita 
case totals than average. Worth noting, Utah saw very similar per capita infection rates to Florida.

*Total COVID Cases* 
[line 2]

[2 result type:line; field:time; value:cases; places:florida,california,utah,united states; modifier:pc; total:true]

If we cut county data by population voting more Republican in 2018, you can see Americans basically got infected at the same
per capita rates initially as most regions mandated sheltering in place. Then bluer regions started to get
a little less infected, then the Florida 2021 summer and Delta
hit as vaccines were starting. In the last year, rates get similar again as mask mandates ended and the people who were going
to get vaccinated did.

Note that the the average-of-averages is calculated slightly differently in this graph, so
different exact values than the prior graph.

*Per Capita COVID Cases by Republican Vote Share*
[line 3]

[3 result type:line; field:time; value:cases; field2:e4; places:united states; modifier:pc; examine:split]
[4 entry field:totals; value:repvotes]

## Second, COVID Kills In Florida

Along with higher infection rates, Florida case fatality rates are higher than the national average. So, more Floridians
catch covid and their survial rates are lower.

*COVID Case Fatality Rates*
[line 7]

[7 result type:line; field:time; value:ccfr; places:florida,california,utah,united states; total:true]

California really shows the effect of vaccines, with the variant fatality spikes starting until vaccination rates
caught up. Florida has a much higher case fatality rate.

Florida really stands out, because if you look at the overall trend, what you see is case fatality rates
converging. This matches expectations, since absent hospital overpopulation pressures, 
the folks dying now are the unvaccinated and high risk.

*Case Fatality Rates by Republican Vote Share*
[line 5]

[5 result type:line; field:time; value:ccfr; field2:e4; places:united states; examine:split]

Those differences in infection rates and case fatality rates really add up.
Across the dataset, what you see is 200,000 extra deaths in the United States -- almost 40% of the total
fatalities in more Republican regions. 200,000 Americans who wouldn't have died from covid.

*COVID Deaths by More or Less Republican Vote Share*
[line 6]

[6 result type:line; field:time; value:deaths; field2:e4; places:united states; examine:split]

So there you go. DeSantis -- a presumptive Presidential candidate -- made intentional decisions that killed tens 
of thousands of the people he's taken an oath to protect. I hope some media outlets will do more rigorous dives 
into this data than I did.

