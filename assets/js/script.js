document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const sections = {
    kanavahaku: document.getElementById('kanavahaku'),
    ohjeet: document.getElementById('ohjeet')
  };
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  const municipalitySelect = document.getElementById('municipality-select');
  const stationList = document.getElementById('station-list');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      Object.keys(sections).forEach(key => {
        sections[key].style.display = key === tab.dataset.page ? 'block' : 'none';
      });
    });
  });

  const savedTheme = getCookie('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(newTheme);
    setCookie('theme', newTheme, 365);
  });

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

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!getCookie('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  const municipalities = [
    "Helsinki", "Espoo", "Vantaa", "Turku", "Tampere", "Oulu",
    "Jyväskylä", "Kuopio", "Lahti", "Pori", "Joensuu", "Rovaniemi"
  ];

  municipalities.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    municipalitySelect.appendChild(option);
  });

  function getStationLogo(stationName) {
    const fileName = stationName.toLowerCase().replace(/\s+/g, '') + '.png';
    return `assets/img/logos/${fileName}`;
  }

  municipalitySelect.addEventListener("change", async (e) => {
    const selected = e.target.value;
    if (!selected) return;

    stationList.innerHTML = `<p>Ladataan radiokanavia...</p>`;

    try {
      const url = `https://corsproxy.io/?https://opendata.traficom.fi/api/v13/Radioasematiedot?$filter=Municipality%20eq%20'${encodeURIComponent(selected)}'`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Virheellinen vastaus (${response.status})`);

      const data = await response.json();
      const stations = data.value || [];

      if (stations.length === 0) {
        stationList.innerHTML = `<p>Ei löytynyt asemia kunnalle ${selected}.</p>`;
        return;
      }

      stationList.innerHTML = "";

      stations.forEach(station => {
        const frequencyMHz = (station.Frequency / 1_000_000).toFixed(1);
        const div = document.createElement("div");
        div.className = "station-box";
        div.innerHTML = `
          <div class="station-logo">
            <img src="${getStationLogo(station.StationName)}" 
                 alt="${station.StationName} logo" 
                 onerror="this.src='/assets/img/logos/default.png'" />
          </div>
          <div class="station-separator"></div>
          <div class="station-info">
            <div class="station-name">${station.StationName}</div>
            <div class="station-frequency">${frequencyMHz} MHz</div>
            <button disabled>Sivusto</button>
          </div>
        `;
        stationList.appendChild(div);
      });
    } catch (err) {
      console.error(err);
      stationList.innerHTML = `<p>Virhe haettaessa tietoja: ${err.message}</p>`;
    }
  });
});
