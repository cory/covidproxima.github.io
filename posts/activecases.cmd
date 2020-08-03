// (c) Cory Ondrejka 2020

# How many people are infectious in the United States right now?

My best guess is that [text 1] people are infectious right now. Put another way, that's [text 5]. What are my assumptions?

Based on [CDC Planning Scenarious](https://www.cdc.gov/coronavirus/2019-ncov/hcp/planning-scenarios.html) and public statements:
* *30-50%* of infected people are assymptomatic 
* Serology tests aren't reliable yet, but a significant multiple of detected cases are the actual probably case count, so currently using *5 times* the case count for probable cases
* Median time between exposure and symptoms is *6 days*
* Median time from symptom onset to death is *22 days*

Start with *probably cases*, which is positive test results times 5. In the US, that number is currently [text 2].
Then, compute *recoveries*, probably cases from 22 days ago minus current deaths ([text 6]), currently [text 3].
Currently *infectious people* is then probable cases from 6 days ago minus current recoveries.

[line 4]

[1 result type:text; field:time; value:activeCases; places:united states; modifier:overall;]
[2 result type:text; field:time; value:probableCases; places:united states; modifier:overall;]
[3 result type:text; field:time; value:recoveries; places:united states; modifier:overall;]
[4 result type:line; field:time; value:activeCases; places:united states; modifier:overall;]
[5 result type:text; field:time; value:activeCases; places:united states; modifier:pc;]
[6 result type:text; field:time; value:deaths; places:united states; modifier:overall;]
