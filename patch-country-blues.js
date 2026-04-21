// patch-country-blues.js — run from C:\Users\alvin\soniq with: node patch-country-blues.js
// Adds Country Blues (Chris Stapleton DNA) + Country Rap to index.html and api/_brain.js

const fs = require('fs');
const HTML  = 'public/index.html';
const BRAIN = 'api/_brain.js';

let ok = 0, skipped = 0, failed = 0;
function has(src, str) { return src.includes(str); }
function good(l)  { console.log('OK: ' + l); ok++; }
function skip(l)  { console.log('SKIP (already there): ' + l); skipped++; }
function fail(l,r){ console.log('FAIL (' + r + '): ' + l); failed++; }

// ── index.html ──────────────────────────────────────────────────────────────
if (!fs.existsSync(HTML)) { console.error('MISSING: ' + HTML); process.exit(1); }
let html = fs.readFileSync(HTML, 'utf8').replace(/\r\n/g, '\n');

// 1. Add Country Rap + Country Blues to SUBSTYLES.country
const oldCountry = `country:['Outlaw Country','Bakersfield','Nashville Pop','Americana','Bluegrass','Bro-Country','Alt-Country','Texas / Red Dirt','Classic Honky-Tonk','Country Gospel']`;
const newCountry = `country:['Outlaw Country','Bakersfield','Nashville Pop','Americana','Bluegrass','Bro-Country','Alt-Country','Texas / Red Dirt','Classic Honky-Tonk','Country Gospel','Country Rap','Country Blues']`;

if (has(html, "'Country Blues'") || has(html, '"Country Blues"')) {
  skip('Country Blues in SUBSTYLES');
} else if (has(html, oldCountry)) {
  html = html.replace(oldCountry, newCountry);
  good('Country Blues + Country Rap in SUBSTYLES');
} else if (has(html, "'Country Rap'") || has(html, '"Country Rap"')) {
  // Country Rap already there but not Country Blues
  const withRap = `country:['Outlaw Country','Bakersfield','Nashville Pop','Americana','Bluegrass','Bro-Country','Alt-Country','Texas / Red Dirt','Classic Honky-Tonk','Country Gospel','Country Rap']`;
  if (has(html, withRap)) {
    html = html.replace(withRap, newCountry);
    good('Country Blues added to SUBSTYLES');
  } else {
    fail('Country Blues in SUBSTYLES', 'country array anchor not found');
  }
} else {
  fail('Country styles in SUBSTYLES', 'country array not found — check index.html format');
}

fs.writeFileSync(HTML, html, 'utf8');

// ── api/_brain.js ────────────────────────────────────────────────────────────
if (!fs.existsSync(BRAIN)) { console.error('MISSING: ' + BRAIN); process.exit(1); }
let brain = fs.readFileSync(BRAIN, 'utf8').replace(/\r\n/g, '\n');

// 2. SUBSTYLE_NOTES — add Country Blues after Country Rap (or Country Gospel)
const cbNote = `
  'Country Blues':      'Country Blues DNA: Chris Stapleton / Gary Clark Jr. / Keb\\' Mo\\' / John Mayer (country-blues era). The voice IS the instrument — massive, raw, gospel-trained power that bends notes like a blues harp. Heavy blues guitar: Telecaster or Les Paul run through a hot tube amp, string bends that cry longer than any pedal steel. Americana-depth songwriting (specific images, no clichés) carrying blues emotional weight — not sadness as genre convention but sadness as physical fact. Production stays raw: live-sounding room, minimal overdubs, amp noise and pick attack preserved. Song structure may stretch to 5+ minutes to let the guitar breathe. Writing rule: the lyric earns the vocal performance — Stapleton does not hold back, so the words must justify the full-throat delivery. Avoid country pop clichés (trucks/summer/party) entirely. Themes: hard living, addiction and recovery, devotion so deep it breaks you, the specific geography of Tennessee and the South. Bridge or final chorus: the vocal explodes — mark as [Full Voice] or [Gospel Outro]. Suno style: "country blues, heavy blues guitar, raw tube amp, southern soul, powerful vocals, 75-95 BPM, live band feel, Chris Stapleton style, emotional, Americana". Artists: Chris Stapleton, Gary Clark Jr., Keb\\' Mo\\', John Mayer, Derek Trucks Band.',`;

// Also add Country Rap note if missing
const crNote = `
  'Country Rap':        'Country Rap DNA: Lil Nas X / Blanco Brown / Colt Ford / Nelly + Tim McGraw / Cowboy Troy. Trap or hip-hop drum production (808 bass, trap hi-hats, snare snap) under country lyric tradition: rural imagery, small-town identity, storytelling pride. The genre collision IS the point — do NOT smooth the seams. Banjo over 808s. Twang over trap beat. Bars about pickup trucks and country roads delivered over sub bass. Melody in the hook may carry country phrasing; verses may be rapped with hip-hop cadence. Code-switching between worlds is the artistic statement. Writing rule: honor both genres equally — no winking, no parody. "Old Town Road" works because Lil Nas X committed to both identities simultaneously. Suno style: "country rap, 808 bass, banjo, trap hi-hats, country twang, genre fusion, 120 BPM, storytelling, authentic". Artists: Lil Nas X, Blanco Brown, Colt Ford, Nelly + Tim McGraw, Cowboy Troy.',`;

const gospelNoteAnchor = `'Country Gospel':`;
const childrenAnchor   = `// Children substyles`;

if (has(brain, "'Country Blues'")) {
  skip('Country Blues SUBSTYLE_NOTES');
} else {
  let anchor = null;
  if (has(brain, "'Country Rap':")) {
    anchor = `'Country Rap':`;
    // Find end of Country Rap note line
    const idx = brain.indexOf(anchor);
    const lineEnd = brain.indexOf('\n', brain.indexOf('},', idx) === -1 ? brain.indexOf("',\n", idx) : brain.indexOf("',\n", idx));
    if (lineEnd !== -1) {
      brain = brain.slice(0, lineEnd) + cbNote + brain.slice(lineEnd);
      good('Country Blues SUBSTYLE_NOTES (after Country Rap)');
    } else {
      fail('Country Blues SUBSTYLE_NOTES', 'could not find end of Country Rap line');
    }
  } else if (has(brain, "'Country Gospel':") && has(brain, childrenAnchor)) {
    // Insert both Country Rap and Country Blues before Children anchor
    const idx = brain.indexOf(childrenAnchor);
    brain = brain.slice(0, idx) + crNote + '\n' + cbNote + '\n  ' + brain.slice(idx);
    good('Country Rap + Country Blues SUBSTYLE_NOTES');
  } else {
    fail('Country Blues SUBSTYLE_NOTES', 'no suitable anchor found in _brain.js');
  }
}

// 3. SUBSTYLE_SUNO — add Country Blues after Country Rap Suno tag
const cbSuno = `\n  'Country Blues':      'country blues, heavy blues guitar, raw tube amp, southern soul, powerful vocals, live band, 85 BPM, Chris Stapleton style, emotional, Americana, guitar bends',`;
const crSuno = `  'Country Rap':        'country rap, 808 bass, banjo, trap hi-hats, country twang, genre fusion, 120 BPM, storytelling, authentic, country trap',`;
const gospelSunoAnchor = `'Country Gospel':`;
const neoSoulSunoAnchor = `// Neo-Soul`;

if (has(brain, "'Country Blues':      'country blues")) {
  skip('Country Blues SUBSTYLE_SUNO');
} else if (has(brain, "'Country Rap':        'country rap")) {
  const idx = brain.indexOf(crSuno);
  const lineEnd = brain.indexOf('\n', idx + crSuno.length - 1);
  brain = brain.slice(0, lineEnd) + cbSuno + brain.slice(lineEnd);
  good('Country Blues SUBSTYLE_SUNO');
} else if (has(brain, "'Country Gospel':     'country gospel")) {
  const anchor = `'Country Gospel':     'country gospel`;
  const idx = brain.lastIndexOf(anchor); // SUNO section is after NOTES section
  const lineEnd = brain.indexOf('\n', idx);
  brain = brain.slice(0, lineEnd) +
    `\n  'Country Rap':        'country rap, 808 bass, banjo, trap hi-hats, country twang, genre fusion, 120 BPM, storytelling, authentic, country trap',` +
    cbSuno +
    brain.slice(lineEnd);
  good('Country Rap + Country Blues SUBSTYLE_SUNO');
} else {
  fail('Country Blues SUBSTYLE_SUNO', 'no Suno anchor found');
}

fs.writeFileSync(BRAIN, brain, 'utf8');

console.log('\n' + ok + ' applied, ' + skipped + ' skipped, ' + failed + ' failed.');
if (failed > 0) {
  console.error('Fix failures above then re-run.');
  process.exit(1);
} else {
  console.log('Next: git add public/index.html api/_brain.js && git commit -m "feat: add Country Blues (Stapleton DNA) + Country Rap substyles" && git push origin main');
}
