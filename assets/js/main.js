(function () {
  // Dev-only banners in the shared site-banner component (dev-server.js forces DEV_MODE on);
  // ?banner=soon,maintenance,site previews the other styles.
  if (window.DEV_MODE) {
    var copy = {
      maintenance: ["Maintenance", "Stux.Digital Clients is being updated and will be back shortly."],
      soon: ["Coming soon", "Stux.Digital Clients is launching soon."],
      dev: ["Dev mode", "Local preview of Stux.Digital Clients. Run <code>dev-server.sh --no-dev-mode</code> to see it as production does."],
      site: ["Notice", "A site notice for Stux.Digital Clients appears here."]
    };
    var want = (new URLSearchParams(location.search).get("banner") || "").split(",");
    var box = document.createElement("div");
    box.className = "site-banners";
    box.setAttribute("data-site-banners", "");
    ["maintenance", "soon", "dev", "site"].forEach(function (v) {
      if (v !== "dev" && want.indexOf(v) < 0) return;
      var d = document.createElement("div");
      d.className = "site-banner site-banner--" + v;
      d.setAttribute("role", "note");
      d.innerHTML = '<span class="site-banner-label"></span><span class="site-banner-text">' + copy[v][1] + "</span>";
      d.firstChild.textContent = copy[v][0];
      box.appendChild(d);
    });
    document.body.insertBefore(box, document.body.firstChild);
    document.documentElement.classList.add("has-site-banner");
    var bs = document.createElement("script");
    bs.src = "/assets/js/site-banner.js";
    document.body.appendChild(bs);
  }

  var yearEls = document.querySelectorAll("[data-year]");
  var year = new Date().getFullYear();
  // Copyright ranges: data-year-start is the year of the repo's first commit,
  // rendered as "start–current", or just the year while they're the same.
  yearEls.forEach(function (el) {
    var start = parseInt(el.getAttribute("data-year-start"), 10);
    el.textContent = start && start < year ? start + "–" + year : year;
  });

  // One badge per card, above the description. data-state holds the card's
  // declared state(s); the first that applies wins (discontinued, template,
  // maintenance, soon). The HTML already renders it, so this only re-resolves
  // a card with several states. With no state, the live status from
  // the status pages named by data-monitor="<slug>" or "<source>:<slug>" fill the badge,
  // and nothing is shown if it can't load.
  var STATES = [
    ["discontinued", "archived", "Discontinued"], ["template", "template", "Template"],
    ["maintenance", "maintenance", "Maintenance"], ["soon", "soon", "Coming soon"]
  ];
  function stateOf(card) {
    var have = (card.getAttribute("data-state") || "").split(/\s+/);
    for (var i = 0; i < STATES.length; i++) if (have.indexOf(STATES[i][0]) !== -1) return STATES[i];
    return null;
  }
  function badgeOf(card) {
    var badge = card.querySelector(":scope > .badge-status");
    if (!badge) {
      badge = document.createElement("span");
      badge.hidden = true;
      var desc = card.querySelector(".desc");
      card.insertBefore(badge, desc);
    }
    return badge;
  }
  document.querySelectorAll(".project-card").forEach(function (card) {
    var st = stateOf(card);
    if (!st) return;
    var badge = badgeOf(card);
    badge.className = "badge-status " + st[1];
    badge.textContent = "";
    var ico = document.createElement("i");
    ico.className = "badge-ico";
    ico.setAttribute("aria-hidden", "true");
    badge.appendChild(ico);
    badge.appendChild(document.createTextNode(st[2]));
    badge.hidden = false;
  });
  // Live status sources: data-monitor="<slug>" reads the default source's status page,
  // data-monitor="<source>:<slug>" reads another status page's summary.json.
  var RAW = "https://raw.githubusercontent.com/";
  var SOURCES = {
    "stux-digital": { url: RAW + "StuxDigital/Status/main/data/summary.json", site: "status.stux.digital" }
  };
  var DEFAULT_SOURCE = "stux-digital";
  var PILL = { up: "Online", degraded: "Degraded", down: "Offline" };
  var WHOLE = { up: "All operational", degraded: "Degraded", partial: "Partial outage", down: "Major outage" };
  var OVERALL = {
    up: "All systems operational", degraded: "Degraded performance",
    partial: "Partial outage", down: "Major outage"
  };
  function monitorOf(card) {
    var v = card.getAttribute("data-monitor") || "";
    var i = v.indexOf(":");
    return i < 0 ? { source: DEFAULT_SOURCE, slug: v } : { source: v.slice(0, i), slug: v.slice(i + 1) };
  }
  function loadSummary(source) {
    return fetch(SOURCES[source].url + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  var wanted = {};
  document.querySelectorAll("[data-monitor]").forEach(function (card) {
    var m = monitorOf(card);
    if (SOURCES[m.source]) wanted[m.source] = true;
  });
  wanted[DEFAULT_SOURCE] = true; // the page-wide status band
  Object.keys(wanted).forEach(function (source) {
    loadSummary(source).then(function (summary) {
      var bySlug = {};
      (summary.monitors || []).forEach(function (m) { bySlug[m.slug] = m; });
      document.querySelectorAll("[data-monitor]").forEach(function (card) {
        var want = monitorOf(card);
        if (want.source !== source) return;
        // "<source>:*" is the status page's overall status (used by the Status card).
        var m = want.slug === "*" ? { status: summary.status } : bySlug[want.slug];
        if (stateOf(card) || !m || !(want.slug === "*" ? WHOLE[m.status] : PILL[m.status])) return;
        var badge = badgeOf(card);
        badge.className = "badge-status " + (m.status === "partial" ? "degraded" : m.status);
        badge.textContent = want.slug === "*" ? WHOLE[m.status] : PILL[m.status];
        badge.title = "Live from " + SOURCES[source].site;
        badge.hidden = false;
      });
      var band = document.getElementById("status-band");
      if (source === DEFAULT_SOURCE && band && OVERALL[summary.status]) {
        band.className = "status-band " + summary.status;
        band.querySelector("h2").textContent = OVERALL[summary.status];
        var n = (summary.monitors || []).length;
        band.querySelector("p").textContent = n + " monitors checked every 5 minutes by GitHup.";
      }
    }).catch(function () {});
  });

  // Seasonal overlays: SeasonalOverlaysLibrary (vendored in assets/js) plays today's preset
  // from its seasonal calendar. It plays once per visit on its own (never for
  // people who ask for reduced motion), and the hero button replays it.
  var lib = window.SeasonalOverlaysLibrary;
  if (!lib) return;
  var LABEL = {
    fireworks: "\uD83C\uDF86 Fireworks", hearts: "\u2764\uFE0F Hearts", stpatricks: "\uD83C\uDF40 Shamrocks",
    eastereggs: "\uD83E\uDD5A Easter eggs", rainbows: "\uD83C\uDF08 Pride rainbows", sunny: "\u2600\uFE0F Sunshine",
    pumpkins: "\uD83C\uDF83 Pumpkins", skullsghosts: "\uD83D\uDC7B Spooky season", thanksgiving: "\uD83E\uDD83 Thanksgiving",
    snow: "\u2744\uFE0F Snow", christmas: "\uD83C\uDF84 Christmas", nyeve: "\uD83C\uDF89 New Year's Eve",
    leavesSpring: "\uD83C\uDF31 Spring leaves", leavesSummer: "\uD83C\uDF3F Summer leaves",
    leavesAutumn: "\uD83C\uDF42 Autumn leaves", leavesWinter: "\uD83C\uDF3E Winter leaves"
  };
  var preset = lib.resolveAutoPreset(new Date());
  var btn = document.getElementById("season-btn");
  if (btn && preset) {
    // "Pumpkins?" until the overlay is running, "Pumpkins!" while it runs. The
    // text is the button's accessible name, so it updates for assistive tech too.
    var baseLabel = (LABEL[preset] || "\u2728 Today's overlay");
    var setActive = function (on) { btn.textContent = baseLabel + (on ? "!" : "?"); };
    var running = function () { return !!document.getElementById("seasonal-overlays-container"); };
    setActive(false);
    btn.hidden = false;
    // The library has no "finished" event, so watch its container: it is added
    // when an overlay starts and removed when it ends (or is stopped).
    new MutationObserver(function () { setActive(running()); }).observe(document.body, { childList: true });
    btn.addEventListener("click", function () {
      setActive(true); // immediate, even if the overlay is skipped
      // Safety net: if nothing is running shortly after (e.g. the overlay was
      // suppressed), drop back to "?" once the default duration has passed.
      setTimeout(function () { if (!running()) setActive(false); }, 2600);
    });
  }
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var played = false;
  try { played = sessionStorage.getItem("sg-season-played") === "1"; } catch (e) {}
  if (preset && !reduced && !played) {
    setTimeout(function () { lib.auto(); }, 600);
    try { sessionStorage.setItem("sg-season-played", "1"); } catch (e) {}
  }
})();

// Footer version link: this site's own VERSION.md, published with the site. If it can't be
// read, the link keeps its fallback text ("Changelogs").
(function () {
  var links = document.querySelectorAll("[data-site-version]");
  if (!links.length || !window.fetch) return;
  fetch("/VERSION.md", { cache: "no-cache" }).then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.text();
  }).then(function (v) {
    v = v.trim().replace(/^v/i, "");
    if (!/^\d+\.\d+\.\d+/.test(v)) return;
    Array.prototype.forEach.call(links, function (a) {
      a.textContent = "v" + v;
      a.setAttribute("title", "Version " + v + ": changelogs");
    });
  }).catch(function () {});
})();
