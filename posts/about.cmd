// (c) Cory Ondrejka 2020

# About this site

*Covid Proxima* is built by [Cory Ondrejka](https://www.linkedin.com/in/coryondrejka/) as a personal COVID-19 coping mechanism.
It is a staic site served off of GitHub with no production dependancies. It uses the [FetchAPI](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
to pull data from the [New York Times on Github](https://github.com/nytimes/covid-19-data).
You can fork the [repository](https://github.com/cory/covidproxima) and run it all locally if you prefer.

If you find an error, get stumped, or thnk either the code or data is wrong, feel free to create an [issue](https://github.com/cory/covidproxima.github.io/issues)
on GitHub. This is a labor of love (and sanity), so it might take me a bit to respond.

Development has been done in [VS Code](https://code.visualstudio.com/), [Chrome](https://www.google.com/chrome), [Safari](https://www.apple.com/safari/)
on a [MacBook Pro](https://www.apple.com/macbook-pro-16/).

# Useful links

* [US census data for populations](https://www.census.gov/data/datasets/time-series/demo/popest/2010s-counties-total.html)
* [US demo data per county](https://www.ers.usda.gov/data-products/atlas-of-rural-and-small-town-america/)
* [US FIPS latitude data](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html)
* [US hospital data](https://opendata.dc.gov/datasets/1044bb19da8d4dbfb6a96eb1b4ebf629_0/data)
* Shelter in place timelines: [here](https://www.nytimes.com/interactive/2020/us/coronavirus-stay-at-home-order.html) and [here](https://www.nytimes.com/interactive/2020/us/states-reopen-map-coronavirus.html)
* [zipcodes](https://www.census.gov/geographies/reference-files/time-series/geo/relationship-files.html)
* [US voting data](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/UYSHST)
* [US State mask requirements](https://www.aarp.org/health/healthy-living/info-2020/states-mask-mandates-coronavirus.html)
* [New York City antibody rates](https://www.nytimes.com/2020/08/19/nyregion/new-york-city-antibody-test.html?referringSource=articleShare)

# Errata

#### Alaska 2018 Voting Data
Finding freely licensed, per-county (well, per-burough) 2018 election data for Alaska has proven more challenging than I care to solve.
The Harvard dataset uses FIPS identifiers that don't map back to buroughs, so I just made all the Alaskan buroughs vote at the same
rate as the state average for 2018 House race, which was 53.08% for Don Young.

