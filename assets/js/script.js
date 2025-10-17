// JAVASCRIPT: Yleinen asettelu, radioasemat, tietopankki
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const sections = {
    kanavahaku: document.getElementById('kanavahaku'),
    televisio: document.getElementById('televisio'),
    ohjeet: document.getElementById('ohjeet')
  };
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  const municipalitySelect = document.getElementById('municipality-select');
  const stationList = document.getElementById('station-list');

  // Header-valikko
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      Object.keys(sections).forEach(key => {
        sections[key].style.display = key === tab.dataset.page ? 'block' : 'none';
      });
    });
  });

  // Teeman valinta ja tallennus evästeisiin
  const savedTheme = getCookie('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(newTheme);
    setCookie('theme', newTheme, 365);
  });

  // Vaihdetaan ikoni teeman perusteella
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      document.body.classList.remove('dark');
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? parts[1] : r;
    }, '');
  }

  // Haetaan käyttäjän järjestelmän teema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!getCookie('theme')) applyTheme(e.matches ? 'dark' : 'light');
  });

  // Logon hakeminen
  function getStationLogo(stationName) {
    const fileName = stationName.toLowerCase().replace(/\s+/g, '') + '.png';
    return `assets/img/logos/${fileName}`;
  }

  // Kuntalistauksen haku Traficomin avoimesta datasta
  async function populateMunicipalities() {
    try {
      const url = `https://corsproxy.io/?https://opendata.traficom.fi/api/v13/Radioasematiedot`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Virheellinen vastaus (${response.status})`);
      const data = await response.json();
      const allStations = data.value || [];

      // Kerätään kunnat, poistetaan blacklistillä olevat ruotsinkieliset nimet
      const municipalitiesSet = new Set(
        allStations
          .map(s => s.Municipality)
          .filter(name => name && !municipalityBlacklist.includes(name))
      );

      const municipalities = Array.from(municipalitiesSet).sort();

      // Päivitetään dropdown-lista
      municipalitySelect.innerHTML = `<option value="">Valitse kunta</option>`;
      municipalities.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        municipalitySelect.appendChild(option);
      });
    } catch (err) {
      console.error("Kuntien haku epäonnistui:", err);
      municipalitySelect.innerHTML = `<option value="">Virhe haettaessa kuntia</option>`;
    }
  }
  populateMunicipalities();

  // Radioasemien hakeminen kunnan perusteella
  municipalitySelect.addEventListener("change", async (e) => {
    const selected = e.target.value;
    if (!selected) return;

    stationList.innerHTML = `<p>Ladataan radioasemia...</p>`;

    try {
      // Haetaan valitun kunnan asemmat API:sta
      const url = `https://corsproxy.io/?https://opendata.traficom.fi/api/v13/Radioasematiedot?$filter=Municipality%20eq%20'${encodeURIComponent(selected)}'`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Virheellinen vastaus (${response.status})`);
      const data = await response.json();
      let stations = data.value || [];

      // Suodatetaan pois pienet taajuudet (alle 87.6 MHz)
      stations = stations.filter(s => (s.Frequency / 1_000_000) >= 87.6);

      // Mahdolliset duplikaattien poisto
      const uniqueStations = [];
      const seen = new Set();
      stations.forEach(station => {
        const key = station.StationName + "_" + (station.Frequency / 1_000_000).toFixed(1);
        if (!seen.has(key)) {
          seen.add(key);
          uniqueStations.push(station);
        }
      });

      if (uniqueStations.length === 0) {
        stationList.innerHTML = `<p>Ei löytynyt asemia kunnalle ${selected}.</p>`;
        return;
      }

      // Erotellaan tilapäiset ja pysyvät asemat. Pysyvälle asemalle API ei palauta aloituspäivää.
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const temporaryStations = uniqueStations.filter(station => {
        if (station.StartingDate === null) return false;

        const startDate = new Date(station.StartingDate);
        startDate.setHours(0, 0, 0, 0);

        if (startDate > today) return false;

        if (station.EndingDate) {
          const endDate = new Date(station.EndingDate);
          endDate.setHours(0, 0, 0, 0);
          if (endDate < today) return false;
        }

        return true;
      });

      const permanentStations = uniqueStations.filter(s => s.StartingDate === null);

      // Listan tyhjennys ennen uutta tulostusta
      stationList.innerHTML = "";

        // Luodaan asemakortti: sisältää nimen, logon, taajuuden, kotisivunapin ja mahdollisen päättysmispäivän
        function createStationBox(station) {
        const frequencyMHz = (station.Frequency / 1_000_000).toFixed(1);
        const normalizedName = station.StationName.toLowerCase().replace(/\s+/g, '');
        const website = stationWebsites[normalizedName];

        const div = document.createElement("div");
        div.className = "station-box";

        let endingButtonHTML = "";
        if (station.StartingDate !== null && station.EndingDate) {
            const endDate = new Date(station.EndingDate);
            const formattedDate = `${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}`;
            endingButtonHTML = `<button class="btn-ending" disabled>${formattedDate} asti</button>`;
        }

        div.innerHTML = `
            <div class="station-logo">
            <img src="${getStationLogo(station.StationName)}" 
                alt="${station.StationName} logo" 
                onerror="this.src='assets/img/logos/default.png'" />
            </div>
            <div class="station-separator"></div>
            <div class="station-info">
            <div class="station-name">${station.StationName}</div>
            <div class="station-frequency">${frequencyMHz} MHz</div>
            <div style="display:flex; gap:0.5rem; margin-top:0.3rem;">
                <button 
                ${website ? `onclick="window.open('${website}', '_blank')"` : 'disabled'} 
                class="${website ? 'btn-active' : 'btn-disabled'}">
                ${website ? 'Kotisivut' : 'Ei kotisivuja'}
                </button>
                ${endingButtonHTML}
            </div>
            </div>
        `;
        return div;
        }

      // Osioidaan pysyvät ja tilapäiset radioasemat
      function renderSection(title, stations) {
        if (stations.length === 0) return;
        const group = document.createElement("div");
        group.className = "station-group";
        group.innerHTML = `<h3>${title}</h3><div class="station-section"></div>`;
        const section = group.querySelector(".station-section");
        stations.forEach(station => section.appendChild(createStationBox(station)));
        stationList.appendChild(group);
      }

      renderSection("Tilapäiset radioasemat", temporaryStations);
      renderSection("Pysyvät radioasemat", permanentStations);

      if (temporaryStations.length === 0 && permanentStations.length === 0) {
        stationList.innerHTML = `<p>Ei näytettäviä asemia kunnalle ${selected}.</p>`;
      }

    } catch (err) {
      console.error(err);
      stationList.innerHTML = `<p>Virhe haettaessa tietoja: ${err.message}</p>`;
    }
  });

  // Tietopankin generointi
  function populateHelpTopics() {
    const helpList = document.getElementById('help-list');
    if (!helpList || !window.helpTopics) return;

    helpList.innerHTML = "";

    // Jokaisesta aiheesta oma avautuva laatikko
    helpTopics.forEach(topic => {
      const topicDiv = document.createElement("div");
      topicDiv.className = "help-topic";

      const questionDiv = document.createElement("div");
      questionDiv.className = "help-question";
      questionDiv.textContent = topic.question;

      const answerDiv = document.createElement("div");
      answerDiv.className = "help-answer";
      answerDiv.innerHTML = topic.answer;

      // Klikkaus avaa tai sulkee laatikon
      questionDiv.addEventListener("click", () => {
        topicDiv.classList.toggle("active");
      });

      topicDiv.appendChild(questionDiv);
      topicDiv.appendChild(answerDiv);
      helpList.appendChild(topicDiv);
    });
  }

  populateHelpTopics();
});

// Mobiilivalikon (hampurilaisvalikko) avaaminen/sulkeminen
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('header-menu').classList.toggle('open');
});