# FinChannelFinder

This tool lists all public radio stations and terrestrial television channels in Finland. Users can select a municipality from a dropdown menu, and the application will display all radio stations and TV channels available in that area. The data is retrieved from Traficom’s open data service. The application is primarily implemented using JavaScript.

Since the data is fetched directly from Traficom’s API, new stations should appear automatically in the application, and stations that have ended will be removed automatically as well.

All station logos and branding elements are the copyrighted property of their respective owners. This site is for informational purposes only and does not have any commercial intent or permission to use the logos for other purposes. Station logos and website links have been added manually to the application, so they may become outdated over time.

## Features

- Search for radio stations by municipality
- Search for terrestrial TV channels by municipality (may be slightly inaccurate due to technical limitations)
- Knowledge base with information about using the application… and a bit more
- Light and dark mode – preference is saved in cookies
- Radio stations are categorized into permanent and temporary stations. Temporary stations display their ending date

## Live Demo

[basap.github.io](https://basap.github.io/FinChannelFinder)

> [!WARNING]  
> If you check multiple municipalities too frequently, you might get timed out by the API. If this happens, just wait a few seconds or minutes and it should start working again.


## Traficom's API

Information about Traficom's API can be found in following links:

- [Tieto.Traficom](https://tieto.traficom.fi/fi/tietotraficom/avoin-data)
- [Traficom Open Data API V13 (Swagger)](https://opendata.traficom.fi/swagger/ui/index#/Radioasematiedot)
