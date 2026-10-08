/* The /changelogs/ page: renders this site's CHANGELOG.md client-side. No dependencies. */
(function () {
  "use strict";

  // Section types always render in this order (unknown types last), whatever order the
  // markdown lists them in. Colours live in style.css (.cl-label-*).
  var ORDER = ["Added", "Changed", "Fixed", "Removed", "Security", "Deprecated"];
  var SOURCE = {
    changelog: "/CHANGELOG.md",
    version: "/VERSION.md",
    github: "https://github.com/StuxDigital/Clients/blob/main/CHANGELOG.md"
  };

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function safeUrl(u) {
    return /^(https?:\/\/|\/|#|mailto:)/i.test(u) ? u : "#";
  }
  function inline(s) {
    var codes = [];
    s = s.replace(/`([^`]+)`/g, function (_, c) { codes.push("<code>" + esc(c) + "</code>"); return "\u0000" + (codes.length - 1) + "\u0000"; });
    s = esc(s);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, text, url) {
      var ext = /^https?:/i.test(url);
      return '<a href="' + esc(safeUrl(url.replace(/&amp;/g, "&"))) + '"' + (ext ? ' rel="noopener"' : "") + ">" + text + "</a>";
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^\w*])\*([^*\s][^*]*)\*(?![\w*])/g, "$1<em>$2</em>");
    return s.replace(/\u0000(\d+)\u0000/g, function (_, n) { return codes[+n]; });
  }

  function rank(heading) {
    var word = ((heading.match(/^###\s+([A-Za-z]+)/) || [])[1] || "").toLowerCase();
    for (var i = 0; i < ORDER.length; i++) if (ORDER[i].toLowerCase() === word) return i;
    return ORDER.length;
  }
  // Sort the ### sections inside each ## release into ORDER, keeping ties in file order.
  function sortSections(md) {
    var out = [], pre = [], secs = [];
    function flush() {
      secs.sort(function (a, b) { return (a.rank - b.rank) || (a.idx - b.idx); });
      out = out.concat(pre);
      secs.forEach(function (s) { out = out.concat(s.lines); });
      pre = []; secs = [];
    }
    md.split("\n").forEach(function (line) {
      if (/^#{1,2}\s/.test(line)) { flush(); pre.push(line); return; }
      if (/^###\s/.test(line)) { secs.push({ rank: rank(line), idx: secs.length, lines: [line] }); return; }
      if (secs.length) secs[secs.length - 1].lines.push(line); else pre.push(line);
    });
    flush();
    return out.join("\n");
  }

  function render(md) {
    var lines = sortSections(md.replace(/\r\n/g, "\n").trim()).split("\n");
    var html = "", inEntry = false, inList = false, item = null, para = null;
    var typeRe = new RegExp("^(" + ORDER.join("|") + ")\\b");
    function flushItem() { if (item !== null) { html += "<li>" + inline(item) + "</li>"; item = null; } }
    function flushList() { flushItem(); if (inList) { html += "</ul>"; inList = false; } }
    function flushPara() { if (para !== null) { if (inEntry) html += '<p class="cl-msg">' + inline(para) + "</p>"; para = null; } }
    function flushEntry() { flushPara(); flushList(); if (inEntry) { html += "</article>"; inEntry = false; } }

    lines.forEach(function (raw) {
      var line = raw.replace(/\s+$/, "");
      if (!line.trim()) { flushItem(); flushPara(); return; }
      var m = line.match(/^##\s+(.+)$/);
      if (m) {
        flushEntry();
        html += '<article class="cl-entry"><h2>' + esc(m[1].trim()) + "</h2>";
        inEntry = true;
        return;
      }
      if (/^#\s/.test(line)) return;             // the file's own title
      if (!inEntry) return;                      // intro text above the first release
      m = line.match(/^###\s+(.+)$/);
      if (m) {
        flushPara(); flushList();
        var t = m[1].trim(), tm = t.match(typeRe);
        html += tm ? '<span class="cl-label cl-label-' + tm[1].toLowerCase() + '">' + tm[1] + "</span>"
                   : '<h3 class="cl-h4">' + esc(t) + "</h3>";
        return;
      }
      m = line.match(/^\s*[-*]\s+(.+)$/);
      if (m) {
        flushPara(); flushItem();
        if (!inList) { html += '<ul class="cl-list">'; inList = true; }
        item = m[1].trim();
        return;
      }
      if (item !== null) { item += " " + line.trim(); return; }
      para = para === null ? line.trim() : para + " " + line.trim();
    });
    flushEntry();
    return html || '<p class="cl-msg">No changelog entries yet.</p>';
  }

  function text(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    });
  }

  var body = document.getElementById("cl-body");
  var badge = document.getElementById("cl-version");
  text(SOURCE.changelog).then(function (md) {
    body.innerHTML = render(md);
  }).catch(function () {
    body.innerHTML = '<p class="cl-msg">Couldn’t load the changelog right now. Read ' +
      '<a href="' + SOURCE.github + '">CHANGELOG.md on GitHub</a> instead.</p>';
  });
  text(SOURCE.version).then(function (v) {
    v = v.trim().replace(/^v/i, "");
    if (/^\d+\.\d+\.\d+/.test(v)) badge.textContent = "v" + v;
  }).catch(function () {});
})();
