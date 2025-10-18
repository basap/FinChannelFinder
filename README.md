# FinChannelFinder

Tämä sovellus listaa kaikki Suomen radioasemat sekä antennitelevision kanavat. Käyttäjä voi valita haluamansa kunnan valikosta, ja sovellus listaa kaikki ne radioasemat ja televisiokanavat, mitkä ovat kyseisessä kunnassa saatavilla. Data haetaan Traficomin avoimen datan lähteestä. Sovellus on toteutettu käyttäen pääosin JavaScriptiä.

Koska data haetaan suoraan Traficomin API:sta, uusien asemien pitäisi automaattisesti ilmestyä sovellukseen, sekä lopettaneiden asemien poistua sovelluksesta. Aseman nimi ja taajuus haetaan suoraan API:sta. Logot ja kotisivujen linkit ovat manuaalisesti haettu ja syötetty sovellukseen, joten nämä tiedot eivät päivity automaattisesti.

> [!IMPORTANT]
> Kaikki asemien logot ja brändielementit ovat niiden omistajien tekijänoikeuden alaista materiaalia. Tätä sivustoa käytetään vain tiedon esittelyyn, eikä sillä ole kaupallista tarkoitusta tai lupaa käyttää logoja muuhun toimintaan.

## Ominaisuudet

- Hae radioasemat kuntavalinnan mukaisesti
- Radioasemat kahdessa kategoriassa: tilapäiset ja pysyvät asemat
- Hae antennitelevision kanavat kuntavalinnan mukaisesti
- Tietopankki joka sisältää fiksuja kysymyksiä ja fiksuja vastauksia
- Tumma ja vaalea tila - valinta tallentuu evästeisiin

## Live Demo

[basap.github.io](https://basap.github.io/FinChannelFinder)

> [!WARNING]  
> Mikäli lähetät API:lle liikaa pyyntöjä lyhyessä ajassa (spämmäät kuntavalintaa) pyynnöt IP-osoitteestasi saatetaan estää hetkeksi. Mikäli näin tapahtuu, odota muutama sekunti tai minuutti ja sovelluksen pitäisi toimia taas.

## Traficomin API

Lisätietoja Traficomin API:sta löytyy muun muassa seuraavista linkeistä:

- [Tieto.Traficom](https://tieto.traficom.fi/fi/tietotraficom/avoin-data)
- [Traficom Open Data API V13 (Swagger)](https://opendata.traficom.fi/swagger/ui/index#/Radioasematiedot)
