import { muxChannels } from "./muxChannels.js";

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("tv-municipality-select");
  const container = document.getElementById("tv-stations-container");
  let allStations = [];

  async function fetchTvStations() {
    try {
      const url = `https://opendata.traficom.fi/api/v13/TVAsematiedot`;
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
    const municipalities = [...new Set(
      stations
        .map(s => s.Municipality)
        .filter(name => name && !municipalityBlacklist.includes(name))
    )].sort();

    const validMunicipalities = [];

    municipalities.forEach(m => {
      const availableMuxes = [
        ...new Set(
          stations
            .filter(s => s.Municipality === m)
            .map(s => (s.StationName || "").split(" ")[0])
        ),
      ];

      const hasChannels = availableMuxes.some(mux => muxChannels[mux] && muxChannels[mux].length > 0);

      if (hasChannels) validMunicipalities.push(m);
    });

    select.innerHTML = `<option value="">Valitse kunta</option>`;
    validMunicipalities.forEach(m => {
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
    activateInfoBoxPositioning();
  });

  function renderTvChannels(muxList) {
    let channels = muxList.flatMap(mux => muxChannels[mux] || []);

    channels = channels.sort((a, b) => {
      const numA = parseInt(a.number) || 9999;
      const numB = parseInt(b.number) || 9999;
      return numA - numB;
    });

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
              <div class="station-name">
                ${ch.name}
                ${ch.info ? `
                  <span class="info-icon" title="Lisätietoja">
                    <i class="fa-solid fa-circle-question"></i>
                    <div class="info-box">${ch.info}</div>
                  </span>` : ""}
              </div>
              <div class="station-frequency">Kanavapaikka: ${ch.number}</div>
              ${ch.website
                ? `<button onclick="window.open('${ch.website}', '_blank')" class="btn-active">Kotisivu</button>`
                : `<button class="btn-disabled" disabled>Ei kotisivuja</button>`}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function activateInfoBoxPositioning() {
    const icons = document.querySelectorAll(".info-icon");

    icons.forEach(icon => {
      const box = icon.querySelector(".info-box");
      if (!box) return;

      icon.addEventListener("mouseenter", () => {
        const rect = icon.getBoundingClientRect();
        const boxRect = box.getBoundingClientRect();

        box.classList.remove("top", "bottom", "left", "right");

        const spaceTop = rect.top;
        const spaceBottom = window.innerHeight - rect.bottom;
        const spaceLeft = rect.left;
        const spaceRight = window.innerWidth - rect.right;

        const verticalSpace = Math.max(spaceTop, spaceBottom);
        const horizontalSpace = Math.max(spaceLeft, spaceRight);

        if (verticalSpace >= horizontalSpace) {
          if (spaceBottom > boxRect.height + 20) {
            box.classList.add("bottom");
          } else {
            box.classList.add("top");
          }
        } else {
          if (spaceRight > boxRect.width + 20) {
            box.classList.add("right");
          } else {
            box.classList.add("left");
          }
        }
      });
    });
  }

  fetchTvStations();
});
