#!/usr/bin/env node
// Runs assets/js/changelogs.js against a sample changelog and checks the rendered page.
// Run with: node tests/changelogs.test.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SAMPLE = [
  "# Changelog", "", "Intro text.", "",
  "## v26.10.24-1", "", "### Deprecated", "", "- d", "", "### Security", "", "- s", "", "### Removed", "", "- r", "",
  "### Fixed", "", "- f", "", "### Changed", "", "- c", "", "### Added", "", "- a", "",
  "## v26.10.23", "", "### Added", "", "- x", "",
  "## [1.2.0] - 2026-10-10", "", "### Added", "", "- old", "",
].join("\n");

const body = { innerHTML: "" };
const badge = { textContent: "" };
const sandbox = {
  document: { getElementById: (id) => (id === "cl-body" ? body : badge) },
  fetch: (url) => Promise.resolve({ ok: true, text: () => Promise.resolve(url.endsWith("VERSION.md") ? "26.10.24-1\n" : SAMPLE) }),
  console,
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "assets", "js", "changelogs.js"), "utf8"), sandbox);

let failed = 0;
function check(name, ok) { console.log((ok ? "ok   - " : "FAIL - ") + name); if (!ok) failed++; }

setTimeout(() => {
  const h = body.innerHTML;
  check("renders '## vYY.MM.DD-N' headings", h.includes("<h2>v26.10.24-1</h2>"));
  check("renders '## vYY.MM.DD' headings", h.includes("<h2>v26.10.23</h2>"));
  check("still renders old '## [x.y.z]' headings", h.includes("<h2>[1.2.0] - 2026-10-10</h2>"));
  const first = h.split("<article")[1];
  const order = [...first.matchAll(/cl-label-(\w+)/g)].map((m) => m[1]);
  check("sections sort Added, Changed, Fixed, Removed, Security, Deprecated", order.join() === "added,changed,fixed,removed,security,deprecated");
  check("version badge shows a Date Version with a suffix", badge.textContent === "v26.10.24-1");
  const css = fs.readFileSync(path.join(__dirname, "..", "assets", "css", "style.css"), "utf8");
  const hex = { added: "#2ecc71", changed: "#3ba7ff", fixed: "#ffa64d", removed: "#ff4d4d", security: "#b06bff", deprecated: "#8a8a94" };
  for (const [k, v] of Object.entries(hex)) {
    check("badge colour for " + k + " is " + v, new RegExp("\\.cl-label-" + k + "\\s*\\{[^}]*--cl:\\s*" + v, "i").test(css));
  }
  console.log(failed ? failed + " failed" : "all passed");
  process.exit(failed ? 1 : 0);
}, 50);
