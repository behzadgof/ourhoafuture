(function () {
  "use strict";

  function parseCSV(text) {
    var rows = [];
    var field = "";
    var row = [];
    var inQuotes = false;
    var input = String(text || "").replace(/\r\n/g, "\n");

    for (var i = 0; i < input.length; i += 1) {
      var ch = input[i];
      var next = input[i + 1];

      if (ch === '"') {
        if (inQuotes && next === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (ch === "," && !inQuotes) {
        row.push(field.trim());
        field = "";
        continue;
      }

      if (ch === "\n" && !inQuotes) {
        row.push(field.trim());
        field = "";
        if (row.some(function (v) { return v !== ""; })) {
          rows.push(row);
        }
        row = [];
        continue;
      }

      field += ch;
    }

    if (field.length > 0 || row.length > 0) {
      row.push(field.trim());
      if (row.some(function (v) { return v !== ""; })) {
        rows.push(row);
      }
    }

    if (rows.length < 2) return [];

    var headers = rows[0];
    return rows.slice(1).map(function (values) {
      var record = {};
      headers.forEach(function (key, idx) {
        record[key] = values[idx] || "";
      });
      return record;
    });
  }

  function toNumber(value) {
    if (value === null || value === undefined) return null;
    var cleaned = String(value).trim().replace(/[$,%\s,]/g, "");
    if (!cleaned || cleaned === "-") return null;
    if (!/^[+-]?\d+(\.\d+)?$/.test(cleaned)) return null;
    var n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  function formatCurrency(value) {
    var n = toNumber(value);
    if (n === null) return value || "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(n);
  }

  function formatPercent(value) {
    var n = toNumber(value);
    if (n === null) return value || "-";
    var prefix = n > 0 ? "+" : "";
    return prefix + n.toFixed(1) + "%";
  }

  function safeLink(url) {
    if (!url) return null;
    try {
      var parsed = new URL(url, window.location.href);
      var isSafe = parsed.protocol === "http:" || parsed.protocol === "https:";
      return isSafe ? parsed.href : null;
    } catch (e) {
      return null;
    }
  }

  function filterRows(rows, term, fields) {
    var query = String(term || "").trim().toLowerCase();
    if (!query) return rows.slice();
    return rows.filter(function (row) {
      var haystack = fields.map(function (f) { return row[f] || ""; }).join(" ").toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  }

  function sortRows(rows, mode, accessorMap) {
    var list = rows.slice();
    var accessor = accessorMap[mode];
    if (!accessor) return list;
    return list.sort(accessor);
  }

  function loadCSV(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) {
        throw new Error("Request failed: " + response.status);
      }
      return response.text();
    }).then(parseCSV);
  }

  function setupMobileNav() {
    var header = document.querySelector("header");
    var topbar = document.querySelector(".topbar");
    var nav = document.querySelector("header nav");
    if (!header || !topbar || !nav) return;

    if (topbar.querySelector(".mobile-nav-toggle")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mobile-nav-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Toggle navigation menu");
    btn.textContent = "Menu";

    btn.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("nav-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });

    topbar.insertBefore(btn, nav);
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function savedTheme() {
    try {
      return localStorage.getItem("site-theme");
    } catch (e) {
      return null;
    }
  }

  function persistTheme(theme) {
    try {
      localStorage.setItem("site-theme", theme);
    } catch (e) {
      return;
    }
  }

  function setupThemeToggle() {
    var topbar = document.querySelector(".topbar");
    var nav = document.querySelector("header nav");
    if (!topbar || !nav) return;
    if (topbar.querySelector(".theme-toggle")) return;

    var initial = savedTheme() || "light";
    applyTheme(initial);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";

    function iconMarkup(theme) {
      if (theme === "dark") {
        return '<span class="theme-toggle-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg></span>';
      }
      return '<span class="theme-toggle-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1Zm10-7a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2h2ZM5 12a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h2Zm13.07 5.66a1 1 0 0 1 1.41 1.41l-1.41 1.42a1 1 0 1 1-1.42-1.42l1.42-1.41ZM7.34 6.93a1 1 0 0 1 1.41 1.41L7.34 9.76A1 1 0 0 1 5.93 8.34l1.41-1.41Zm11.14 1.41a1 1 0 0 1-1.41 0l-1.42-1.41a1 1 0 1 1 1.42-1.42l1.41 1.42a1 1 0 0 1 0 1.41ZM8.76 17.07a1 1 0 0 1 0 1.41l-1.41 1.42a1 1 0 1 1-1.42-1.42l1.42-1.41a1 1 0 0 1 1.41 0Z"/></svg></span>';
    }

    function syncLabel(theme) {
      btn.innerHTML = iconMarkup(theme) + '<span class="theme-toggle-label">' + (theme === "dark" ? "Light Mode" : "Dark Mode") + "</span>";
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }

    syncLabel(initial);

    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      persistTheme(next);
      syncLabel(next);
    });

    topbar.insertBefore(btn, nav);
  }

  window.SiteUtils = {
    loadCSV: loadCSV,
    parseCSV: parseCSV,
    formatCurrency: formatCurrency,
    formatPercent: formatPercent,
    safeLink: safeLink,
    toNumber: toNumber,
    filterRows: filterRows,
    sortRows: sortRows,
    setupMobileNav: setupMobileNav,
    setupThemeToggle: setupThemeToggle
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setupThemeToggle();
      setupMobileNav();
    });
  } else {
    setupThemeToggle();
    setupMobileNav();
  }
}());
