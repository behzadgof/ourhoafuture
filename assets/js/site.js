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

  window.SiteUtils = {
    loadCSV: loadCSV,
    parseCSV: parseCSV,
    formatCurrency: formatCurrency,
    formatPercent: formatPercent,
    safeLink: safeLink,
    toNumber: toNumber,
    filterRows: filterRows,
    sortRows: sortRows
  };
}());
