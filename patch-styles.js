// patch-styles.js — run from C:\Users\alvin\soniq with: node patch-styles.js
// Adds Phonk, Anthem Rap, Hustle/Grind styles + fixes aggression state/payload

const fs = require('fs');
const HTML = 'public/index.html';

if (!fs.existsSync(HTML)) { console.error('MISSING: ' + HTML); process.exit(1); }
let src = fs.readFileSync(HTML, 'utf8').replace(/\r\n/g, '\n');
let ok = 0, skipped = 0, failed = 0;

function has(str) { return src.includes(str); }
function good(label) { console.log('OK: ' + label); ok++; }
function skip(label) { console.log('SKIP (already there): ' + label); skipped++; }
function fail(label, tried) { console.log('FAIL: ' + label + ' | tried: ' + tried.join(', ')); failed++; }

// ─── 1. Add Phonk to RAP_STYLES_CLIENT ───────────────────────────────────────
if (has("phonk:") || has("phonk :")) {
  skip('Phonk style entry');
} else {
  const anchors = [
    "hyphy_rap:",
    "jazz_rap_revival:",
    "afro_boom_bap:",
    "mosaic_flow:",
  ];
  const a = anchors.find(x => has(x));
  if (a) {
    // Find the full line for this anchor entry and insert after its closing },
    const idx = src.indexOf(a);
    const lineEnd = src.indexOf('\n', src.indexOf('},', idx));
    src = src.slice(0, lineEnd) +
      "\n  phonk:         { label:'Phonk', category:'established', era:'2020–present', teaser:'Slow-motion threat. Dark Memphis revival. Every bar a cowbell-kick warning.' }," +
      src.slice(lineEnd);
    good('Phonk style entry');
  } else {
    fail('Phonk style entry', anchors);
  }
}

// ─── 2. Add Anthem Rap to RAP_STYLES_CLIENT ───────────────────────────────────
if (has("anthem_rap:") || has("anthem_triumph:")) {
  skip('Anthem Rap style entry');
} else {
  const anchors = ["phonk:", "hyphy_rap:", "jazz_rap_revival:", "afro_boom_bap:"];
  const a = anchors.find(x => has(x));
  if (a) {
    const idx = src.indexOf(a);
    const lineEnd = src.indexOf('\n', src.indexOf('},', idx));
    src = src.slice(0, lineEnd) +
      "\n  anthem_rap:    { label:'Anthem Rap', category:'established', era:'1990s–present', teaser:'First-person triumph that speaks for the collective. Every bar belongs on a walk-out.' }," +
      src.slice(lineEnd);
    good('Anthem Rap style entry');
  } else {
    fail('Anthem Rap style entry', anchors);
  }
}

// ─── 3. Add Hustle/Grind to RAP_STYLES_CLIENT ────────────────────────────────
if (has("hustle_grind:") || has("hustle_rap:")) {
  skip('Hustle/Grind style entry');
} else {
  const anchors = ["anthem_rap:", "phonk:", "hyphy_rap:", "jazz_rap_revival:"];
  const a = anchors.find(x => has(x));
  if (a) {
    const idx = src.indexOf(a);
    const lineEnd = src.indexOf('\n', src.indexOf('},', idx));
    src = src.slice(0, lineEnd) +
      "\n  hustle_grind:  { label:'Hustle / Grind', category:'established', era:'1990s–present', teaser:'The come-up documented. Sacrifice, late nights, doubters proven wrong.' }," +
      src.slice(lineEnd);
    good('Hustle/Grind style entry');
  } else {
    fail('Hustle/Grind style entry', anchors);
  }
}

// ─── 4. Add dim defaults for new styles ──────────────────────────────────────
if (has("phonk:") && !has("phonk:         { flow:") && !has("phonk:  { flow:") && !has("phonk: { flow:")) {
  // Add to RAP_DIM_DEFAULTS — find the last entry in that object
  const anchors = [
    "jazz_rap_revival: { flow:",
    "afro_boom_bap:    { flow:",
    "mosaic_flow:      { flow:",
  ];
  const a = anchors.find(x => has(x));
  if (a) {
    const idx = src.indexOf(a);
    const lineEnd = src.indexOf('\n', src.indexOf('},', idx));
    src = src.slice(0, lineEnd) +
      "\n  phonk:         { flow:'behind-beat',   rhymeArch:'end-only',    density:'medium',      vocabRegister:'street-coded',      persona:'first-person-raw' }," +
      "\n  anthem_rap:    { flow:'on-beat',        rhymeArch:'chain',       density:'medium',      vocabRegister:'conscious-literary', persona:'collective-we' }," +
      "\n  hustle_grind:  { flow:'conversational', rhymeArch:'internal',    density:'dense',       vocabRegister:'street-coded',      persona:'first-person-raw' }," +
      src.slice(lineEnd);
    good('Dim defaults for Phonk / Anthem / Hustle');
  } else {
    fail('Dim defaults', anchors);
  }
}

// ─── 5. Fix selectedAggression state ─────────────────────────────────────────
if (has('selectedAggression')) {
  skip('selectedAggression state');
} else {
  // Try various state anchors — production may not have edgeMode at all
  const anchors = [
    "freestyleMode: false,",
    "freestyleMode:false,",
    "freestyleMode: S.freestyleMode",
    "selectedQuality:",
    "selectedGenre:",
  ];
  const a = anchors.find(x => has(x));
  if (a) {
    src = src.replace(a, "selectedAggression: 'mid',\n  " + a);
    good('selectedAggression state');
  } else {
    fail('selectedAggression state', anchors);
  }
}

// ─── 6. Fix aggression payload ────────────────────────────────────────────────
if (has("aggression: S.selectedAggression")) {
  skip('Aggression payload');
} else {
  // Production uses "S.freestyleMode === true" not "!!S.freestyleMode"
  const anchors = [
    "freestyleMode: S.freestyleMode === true,",
    "freestyleMode: !!S.freestyleMode,",
    "freestyleMode:S.freestyleMode",
  ];
  const a = anchors.find(x => has(x));
  if (a) {
    src = src.replace(a, "aggression: S.selectedAggression || 'mid',\n    " + a);
    good('Aggression payload');
  } else {
    fail('Aggression payload', anchors);
  }
}

// ─── Save + summary ───────────────────────────────────────────────────────────
if (ok > 0) fs.writeFileSync(HTML, src, 'utf8');
console.log('\n' + ok + ' applied, ' + skipped + ' skipped, ' + failed + ' failed.');
if (failed > 0) {
  console.error('Fix failures above then re-run.');
  process.exit(1);
} else {
  console.log('Run: git add public/index.html; git commit -m "feat: add Phonk/Anthem/Hustle styles + fix aggression state"; git push origin main');
}
