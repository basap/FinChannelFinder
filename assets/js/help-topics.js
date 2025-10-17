// Tietopankin aiheet ja vastaukset syötetään tänne
window.helpTopics = [
  {
    question: "Perustiedot sovelluksesta",
    answer: `Tämä sovellus listaa kaikki tällä hetkellä Suomessa toimivat radioasemat sekä antennitelevision kanavat kunnittain. Data haetaan Traficomin avoimen datan lähteestä. Mikäli asemalla on voimassa oleva toimilupa, sen pitäisi listautua tälle sivustolle. Samaan tyyliin mikäli radioaseman toimilupa on päättynyt, se poistuu automaattisesti myös tästä sovelluksesta.
    Radioasemista sovellus listaa ainoastaan FM-radioasemat. Keskiaalto- (AM) ja lyhytaaltoasemia ei listata, sillä näiden käyttö Suomessa on hyvin minimaalista.
    <br><br>
    Logot ja kotisivujen linkit on syötetty manuaalisesti sovellukseen.
    Uusilta sekä väliaikaisesti toimivilta radioasemilta nämä voivat mahdollisesti puuttua.
    Myös mahdolliset brändiuudistukset eivät päivity automaattisesti tähän sovellukseen.
    Logot ja linkit ovat viimeksi päivitetty 6.10.2025, jolloin kaikille (myös tilapäisille) radioasemille nämä tiedot syötettiin, mikäli sellaisia oli saatavilla.
    <br><br>
    Voit halutessasi lukea lisää API-rajapinnasta seuraavista linkeistä:
    <br>
    <a href="https://tieto.traficom.fi/fi/tietotraficom/avoin-data?toggle=Taajuudet" target="_blank">Tieto.Traficom</a>
    <br>
    <a href="https://opendata.traficom.fi/swagger/ui/index#/Radioasematiedot" target="_blank">Traficom Avoin Data API V13 (Swagger)</a>
    <br><br>
    Kaikki asemien logot ja brändielementit ovat niiden omistajien tekijänoikeuden alaista materiaalia. Tätä sivustoa käytetään vain tiedon esittelyyn, eikä sillä ole kaupallista tarkoitusta tai lupaa käyttää logoja muuhun toimintaan.`
  },
  {
    question: "Miten vaihdan teeman?",
    answer: "Sovellus valitsee teeman automaattisesti laitteen preferenssien mukaisesti. Halutessasi voit vaihtaa tummaan tai vaaleaan teemaan painamalla sivuston oikeasta yläkulmasta löytyvää kuu/aurinko-painiketta. Valinta tallentuu evästeisiin."
  },
  {
    question: "Miksi asema kuuluu paikassa X, mutta ei paikassa Y?",
    answer: `Radiotaajuuksia on saatavilla rajoitetusti välillä 87.5 - 107.9 MHz. Usein suosituimmissa kaupungeissa, kuten Helsingissä, taajuudet ovat erittäin kovalla käytöllä eikä kaikille toimijoille välttämättä ole tilaa saapua alueelle, vaikka halua olisi.
    <br><br>
    Toisaalta taas syrjäseuduilla, kuten pohjoisimmassa Lapissa, taajuuksia olisi reilusti saatavilla, mutta nämä eivät radioyhtiöitä kiinnosta vähäisten kuuntelijamäärien vuoksi.
    Kulut aseman pyörittämiseen kasvavat sitä mukaa, mitä laajemmalla alueella asema kuuluu.
    <br><br>
    Kaupallisista radioasemista mikään ei kuulu koko maan laajuisesti, mutta Yleisradion asemat Yle Radio Suomi, Yle Radio 1 sekä YleX kuuluvat joka paikassa, missä asutusta on.`
  },
  {
    question: "Kuntaa ei ole listauksessa / Kunnastani puuttuu radioasemia",
    answer: `Kuntalistaus tulee Traficomilta ja listauksessa ovat kaikki ne kunnat, joista löytyy tällä hetkellä radiolähetin.
    Jos kuntaasi ei löydy listauksesta, valitse seuraavaksi lähin kunta mikä löytyy.
    Monissa tapauksissa lähettimen signaali kantaa vähintään useiden kymmenien kilometrien päähän, ääritapauksissa jopa sadan kilometrin päähän.
    Esimerkiksi Vantaalla ei ole omaa lähetintä, mutta Helsingin ja Espoon signaali kantaa helposti myös Vantaalle asti.
    <br><br>
    Jos radioasema puuttuu listauksesta, mutta tiedät että sellainen pitäisi olla olemassa, tarkista myös lähikuntien lähettimet.
    Esimerkkinä jälleen pääkaupunkiseutu: Espoon asemat kuuluvat myös lähikunnissa, joten erillinen lähetin esimerkiksi Helsingissä on tarpeeton.
    <br><br>
    Jos radioasemaa ei löydy edes lähikuntien listauksista, voi kyseessä olla ilman toimilupaa lähettävä radio, eli ns. <a href="https://fi.wikipedia.org/wiki/Piraattiradio">piraattiradio</a>. Tällaiset ovat kuitenkin olleet Suomessa hyvin harvinaisia.`
  },
  {
    question: `Miten "tilapäinen" ja "pysyvä" radioasema eroavat toisistaan?`,
    answer: `Tilapäinen radioasema toimii nimensä mukaisesti tilapäisellä radioluvalla, ilman erillistä ohjelmistotoimilupaa. Traficom myöntää tilapäisiä radiolupia enintään kolmeksi kuukaudeksi. Kahden perättäisen lupakauden välissä pitää olla vähintään kahden kuukauden tauko. Tilapäisillä radioluvilla toimivat esimerkiksi harrastajat, opiskelijaradiot, kesäradiot, raviradiot sekä Puolustusvoimat harjoituksineen.
    <br><br>
    Pysyvällä radioasemalla on voimassa oleva ohjelmistotoimilupa ja nämä ovat usein osa isompien radioyhtiöiden toimintaa. Pysyvät luvat eivät nimestään huolimatta ole pysyviä, vaan ne myönnetään aina kymmeneksi vuodeksi kerrallaan. Nykyinen toimilupakausi päättyy <b>31.12.2029</b>, minkä jälkeen taajuudet jaetaan uudelleen.`
  },
  {
    question: `Radioaseman taajuudella ei kuulu mitään`,
    answer: `Hakukone listaa asemat myönnettyjen toimilupien perusteella, mutta tämä ei takaa sitä, että asemalla välttämättä olisi lähetys käynnissä. Esimerkiksi raviradiot harvemmin lähettävät ohjelmaa ravien ulkopuolella. Kyseessä voi olla myös tilapäinen häiriö aseman lähetysvirrassa. Teoriassa saattaa olla myös mahdollisuus siihen, että taajuus on syötetty väärin Traficomin järjestelmään, mutta tämä on hyvin epätodennäköinen skenaario, jos ei mahdoton.`
  },
  {
    question: `Televisiokanava ei näy, vaikka se löytyy listasta`,
    answer: `Tämä ilmiö voi toteutua esimerkiksi pinta-alaltaan suurimpien kuntien kohdalla. Esimerkiksi Rovaniemen kohdalla listaus pitää paikkansa ainakin ydinkeskustassa, mutta syrjemmillä seuduilla kanavia voi olla saatavilla rajallisemmin. Rovaniemen pohjoisosiin signaali voi tulla esimerkiksi Kittilästä, missä on rajallisempi tarjonta.
    <br><br>Tähän ei ainakaan toistaiseksi ole saatavilla mitään ratkaisua, joten kanavalistaus on tässä tapauksessa hieman epätäydellinen.`
  }
];