// ============================================================
// COMMIT GARDEN
// Renders a GitHub contribution graph as a garden — each day is a
// plant sprite instead of a square, growth stage mapped to GitHub's
// own 0-4 contribution "level" for that day.
//
// Data source: github-contributions-api.jogruber.de (unofficial,
// no auth needed, scrapes the same public data your profile shows).
// Cached in sessionStorage for the tab's lifetime so repeat visits
// within a session don't re-fetch.
//
// Renders into #commit-garden, which carries the GitHub username
// in its data-username attribute.
// ============================================================
(function () {
  const DEFAULT_USERNAME = "kameron-ctrl";
  const CACHE_KEY_PREFIX = "commit-garden-";

  // One plant path, reused at 5 growth stages. Level 0 is bare soil.
  const PLANT_PATHS = [
    null,
    "M12 20V15",
    "M12 20V12M12 12C12 9 10 9 9 7M12 12C12 9 14 9 15 7",
    "M12 20V9M12 9C12 6 9 6 7 4M12 9C12 6 15 6 17 4M12 13C12 11 10 11 9 10M12 13C12 11 14 11 15 10",
    "M12 20V7M12 7C12 4 9 4 7 2M12 7C12 4 15 4 17 2M12 11C12 9 9 9 8 8M12 11C12 9 15 9 16 8M12 15C12 13 10 13 9 12M12 15C12 13 14 13 15 12",
  ];

  const LEVEL_CLASS = ["soil", "sprout", "leaf", "moss", "bloom"];

  function groupIntoWeeks(days) {
    const weeks = [];
    let currentWeek = [];

    days.forEach((day, i) => {
      const dow = new Date(day.date + "T00:00:00").getDay();
      if (i === 0) {
        for (let pad = 0; pad < dow; pad++) currentWeek.push(null);
      }
      currentWeek.push(day);
      if (dow === 6 || i === days.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  }

  async function loadWeeks(username) {
    const cacheKey = CACHE_KEY_PREFIX + username;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    );
    if (!res.ok) throw new Error("contribution data unavailable");
    const data = await res.json();

    const weeks = groupIntoWeeks(data.contributions);
    sessionStorage.setItem(cacheKey, JSON.stringify(weeks));
    return weeks;
  }

  function buildCell(day) {
    const cell = document.createElement("div");

    if (!day) {
      cell.className = "cg-cell empty";
      return cell;
    }

    const level = day.level ?? 0;
    cell.className = `cg-cell cg-level-${LEVEL_CLASS[level]}`;
    cell.title = `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`;

    const path = PLANT_PATHS[level];
    if (path) {
      cell.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round">
          <path d="${path}" />
        </svg>
      `;
    }

    return cell;
  }

  function renderGrid(root, weeks) {
    const grid = document.createElement("div");
    grid.className = "cg-grid";

    weeks.forEach((week) => {
      week.forEach((day) => {
        grid.appendChild(buildCell(day));
      });
    });

    root.innerHTML = "";
    root.appendChild(grid);
  }

  function renderStatus(root, message, linkUsername) {
    root.innerHTML = `
      <div class="cg-status">
        ${message}
        ${
          linkUsername
            ? `<a href="https://github.com/${linkUsername}" target="_blank" rel="noopener">view on GitHub</a>.`
            : ""
        }
      </div>
    `;
  }

  async function init() {
    const root = document.getElementById("commit-garden");
    if (!root) return;

    const username = root.dataset.username || DEFAULT_USERNAME;

    renderStatus(root, "growing…");

    try {
      const weeks = await loadWeeks(username);
      renderGrid(root, weeks);
    } catch (err) {
      renderStatus(root, "couldn't load the garden right now — ", username);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
