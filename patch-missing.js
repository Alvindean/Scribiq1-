// patch-missing.js — run from C:\Users\alvin\soniq with: node patch-missing.js
// Adds Phonk/Anthem/Hustle pills and Aggression toggle to public/index.html
// Uses flexible matching to handle whitespace/quote variations

const fs = require('fs');
const HTML = 'public/index.html';

if (!fs.existsSync(HTML)) { console.error('MISSING: ' + HTML); process.exit(1); }
let src = fs.readFileSync(HTML, 'utf8').replace(/\r\n/g, '\n');
let ok = 0, skipped = 0, failed = 0;

function has(str) { return src.includes(str); }

function skip(label) { console.log('SKIP (already there): ' + label); skipped++; }
function fail(label, reason) { console.log('FAIL (' + reason + '): ' + label); failed++; }
function good(label) { console.log('OK: ' + label); ok++; }

// ─── 1. Phonk era pill ────────────────────────────────────────────────────────
if (has("eraLineage','phonk'") || has('eraLineage","phonk"')) {
  skip('Phonk era pill');
} else {
  const m = src.match(/setCraftDim\(this,'hiphop','eraLineage','abstract-lyrical'\)[^>]*>[^<]*<\/span>/);
  if (m) {
    src = src.replace(m[0], m[0] + "\n            <span class=\"rl-dpill\"    onclick=\"setCraftDim(this,'hiphop','eraLineage','phonk')\">Phonk</span>");
    good('Phonk era pill');
  } else {
    fail('Phonk era pill', 'abstract-lyrical anchor not found');
  }
}

// ─── 2. Anthem/Triumph + Hustle/Grind pills ───────────────────────────────────
if (has("lyricTheme','anthem-triumph'") || has('lyricTheme","anthem-triumph"')) {
  skip('Anthem/Triumph + Hustle/Grind pills');
} else {
  const m = src.match(/setCraftDim\(this,'hiphop','lyricTheme','party'\)[^>]*>[^<]*<\/span>/);
  if (m) {
    src = src.replace(m[0], m[0] +
      "\n            <span class=\"rl-dpill\"    onclick=\"setCraftDim(this,'hiphop','lyricTheme','anthem-triumph')\">Anthem / Triumph</span>" +
      "\n            <span class=\"rl-dpill\"    onclick=\"setCraftDim(this,'hiphop','lyricTheme','hustle-grind')\">Hustle / Grind</span>");
    good('Anthem/Triumph + Hustle/Grind pills');
  } else {
    fail('Anthem/Triumph + Hustle/Grind pills', 'party anchor not found');
  }
}

// ─── 3. selectedAggression in state object ────────────────────────────────────
if (has('selectedAggression')) {
  skip('selectedAggression state');
} else {
  const anchors = ["edgeMode: 'off',", "edgeMode:'off',", 'edgeMode: "off",', 'edgeMode:"off",'];
  const a = anchors.find(x => has(x));
  if (a) {
    src = src.replace(a, "selectedAggression: 'mid',   // 'mellow' | 'mid' | 'heat' | 'rage'\n  " + a);
    good('selectedAggression state');
  } else {
    fail('selectedAggression state', 'edgeMode anchor not found');
  }
}

// ─── 4. Aggression UI block ───────────────────────────────────────────────────
if (has('aggression-pills')) {
  skip('Aggression UI');
} else {
  const aggrUI =
    '<!-- AGGRESSION -->\n' +
    '          <label class="topic-label">Aggression</label>\n' +
    '          <div class="quality-row" id="aggression-pills">\n' +
    "            <span class=\"qpill\" onclick=\"setAggression(this,'mellow')\">🌊 Mellow</span>\n" +
    "            <span class=\"qpill on\" onclick=\"setAggression(this,'mid')\">◼ Mid</span>\n" +
    "            <span class=\"qpill\" onclick=\"setAggression(this,'heat')\">🔥 Heat</span>\n" +
    "            <span class=\"qpill\" onclick=\"setAggression(this,'rage')\">💢 Rage</span>\n" +
    '          </div>\n' +
    '          <div id="aggression-desc" style="font-size:11px;color:var(--tx3);font-style:italic;margin-bottom:12px;min-height:16px"></div>\n\n          ';

  const anchors = ['<!-- BRACKET FORMATTING -->', '<!-- THEORY LEVEL -->', 'class="bracket-label"', 'class="bracket-pills"'];
  const a = anchors.find(x => has(x));
  if (a) {
    src = src.replace(a, aggrUI + a);
    good('Aggression UI');
  } else {
    fail('Aggression UI', 'bracket anchor not found');
  }
}

// ─── 5. setAggression function ────────────────────────────────────────────────
if (has('function setAggression')) {
  skip('setAggression function');
} else {
  const aggrFn =
    "\n\nconst AGGRESSION_DESCS = {\n" +
    "  mellow: 'Laid-back, conversational, introspective — emotion through restraint.',\n" +
    "  mid:    'Balanced energy — default feel for most genres.',\n" +
    "  heat:   'Elevated intensity, confrontational urgency — every bar has a point to prove.',\n" +
    "  rage:   'Maximum force — no softness, no hesitation, pure unfiltered aggression.',\n" +
    "};\n" +
    "function setAggression(el, val) {\n" +
    "  document.querySelectorAll('#aggression-pills .qpill').forEach(p => p.classList.remove('on'));\n" +
    "  el.classList.add('on');\n" +
    "  S.selectedAggression = val;\n" +
    "  const desc = document.getElementById('aggression-desc');\n" +
    "  if (desc) desc.textContent = AGGRESSION_DESCS[val] || '';\n" +
    "}";

  // Match the setEra closing brace via the unique ERA_DESCS textContent line
  const anchor = "if (desc) desc.textContent = ERA_DESCS[val] || '';\n}";
  if (has(anchor)) {
    src = src.replace(anchor, anchor + aggrFn);
    good('setAggression function');
  } else {
    fail('setAggression function', 'setEra end anchor not found');
  }
}

// ─── 6. aggression in songParams payload ──────────────────────────────────────
if (has("aggression: S.selectedAggression")) {
  skip('Aggression payload');
} else {
  const anchors = [
    "edgeTopics: Array.isArray(S.edgeTopics) ? [...S.edgeTopics] : [],",
    "freestyleMode: !!S.freestyleMode,",
  ];
  const a = anchors.find(x => has(x));
  if (a) {
    src = src.replace(a, a + "\n    aggression: S.selectedAggression || 'mid',");
    good('Aggression payload');
  } else {
    fail('Aggression payload', 'payload anchor not found');
  }
}

// ─── Save + summary ───────────────────────────────────────────────────────────
if (ok > 0) fs.writeFileSync(HTML, src, 'utf8');
console.log('\n' + ok + ' applied, ' + skipped + ' skipped, ' + failed + ' failed.');
if (failed > 0) {
  console.error('Fix failures above then re-run.');
  process.exit(1);
} else {
  console.log('Run: git add public/index.html && git commit -m "fix: aggression UI + phonk/anthem/hustle pills" && git push origin main');
}
