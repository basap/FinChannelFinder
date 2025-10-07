import { muxChannels } from "./muxChannels.js";

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("tv-municipality-select");
  const container = document.getElementById("tv-stations-container");
  let allStations = [];

  async function fetchTvStations() {
    try {
      const url = `https://corsproxy.io/?https://opendata.traficom.fi/api/v13/TVAsematiedot`;
      const response = await fetch(url);
      const data = await response.json();
      allStations = data.value || [];
      populateMunicipalities(allStations);
    } catch (err) {
      console.error("Virhe TV-asemien haussa:", err);
      container.innerHTML = `<p>Virhe haettaessa TV-asemia.</p>`;
    }
  }

  function populateMunicipalities(stations) {
    const municipalities = [...new Set(stations.map(s => s.Municipality).filter(Boolean))].sort();
    municipalities.forEach(m => {
      const option = document.createElement("option");
      option.value = m;
      option.textContent = m;
      select.appendChild(option);
    });
  }

  select.addEventListener("change", () => {
    const selected = select.value;
    if (!selected) {
      container.innerHTML = "";
      return;
    }

    const availableMuxes = [
      ...new Set(
        allStations
          .filter(s => s.Municipality === selected)
          .map(s => (s.StationName || "").split(" ")[0])
      ),
    ];

    renderTvChannels(availableMuxes);
  });

  function renderTvChannels(muxList) {
    const channels = muxList.flatMap(mux => muxChannels[mux] || []);

    if (channels.length === 0) {
      container.innerHTML = `<p>Tälle alueelle ei löytynyt kanavia.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="station-section">
        ${channels.map(ch => `
          <div class="station-box">
            <div class="station-logo">
              <img src="${ch.logo}" alt="${ch.name} logo" onerror="this.src='assets/img/logos/default.png'" />
            </div>
            <div class="station-separator"></div>
            <div class="station-info">
              <div class="station-name">${ch.name}</div>
              <div class="station-frequency">Kanavapaikka: ${ch.number}</div>
              ${ch.website ? `<button onclick="window.open('${ch.website}', '_blank')" class="btn-active">Kotisivu</button>` : `<button class="btn-disabled" disabled>Ei kotisivuja</button>`}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  fetchTvStations();
});
