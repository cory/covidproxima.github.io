// (c) Cory Ondrejka 2020

# How many people are infectious in the United States right now?

My best guess is that [text 1] people are infectious right now. Put another way, that's [text 5]. What are my assumptions?

Based on [CDC Planning Scenarios](https://www.cdc.gov/coronavirus/2019-ncov/hcp/planning-scenarios.html) and public statements:
* *30-50%* of infected people are asymptomatic
* [New York City](https://www.nytimes.com/2020/08/19/nyregion/new-york-city-antibody-test.html?referringSource=articleShare) testing showed anitbody rates higher than that CDC estimate (*added on 22 August 2020*)
* Serology tests aren't reliable yet, but a significant multiple of detected cases are the actual probably case count, so currently using *5 times* the case count for probable cases
* Median time between exposure and symptoms is *6 days*
* Median time from symptom onset to death is *22 days*

Start with *probable cases*, which is positive test results times 8 (*changed from 5 on 22 August 2020 because of NYC data*). In the US, that number is currently [text 2].
Then, compute *recoveries*, probably cases from 22 days ago minus current deaths ([text 6]), currently [text 3].
Currently *infectious people* is then probable cases from 6 days ago minus current recoveries.

[line 4]

Another option to back check this is to look at this recent paper [estimating unobserved covid cases](https://www.pnas.org/content/early/2020/08/20/2005476117). It estimates approximately 100,000 covid infections by early March, about 2-3 weeks earlier than my graphs move, but fairly consistent with my delayed assumptions described above. I am most certainly not an epidemiologist, so the goal is to stay roughly within an order of magnitude.

[1 result type:text; field:time; value:activeCases; places:united states; modifier:overall;]
[2 result type:text; field:time; value:probableCases; places:united states; modifier:overall;]
[3 result type:text; field:time; value:recoveries; places:united states; modifier:overall;]
[4 result type:line; field:time; value:activeCases; places:united states; modifier:overall;]
[5 result type:text; field:time; value:activeCases; places:united states; modifier:pc;]
[6 result type:text; field:time; value:deaths; places:united states; modifier:overall;]
