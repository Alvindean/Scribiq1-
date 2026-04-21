// patch-prod.js — run from C:\Users\alvin\soniq with: node patch-prod.js
// Applies all pending changes to api/_brain.js and public/index.html

const fs = require('fs');
const path = require('path');

let ok = 0, fail = 0;

function patch(file, label, find, replace, allowMultiple) {
  if (!fs.existsSync(file)) { console.error('MISSING FILE: ' + file); fail++; return; }
  const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (!src.includes(find)) {
    console.log('SKIP (already applied or not found): ' + label);
    return;
  }
  const count = src.split(find).length - 1;
  if (count > 1 && !allowMultiple) {
    console.error('AMBIGUOUS (' + count + ' matches): ' + label);
    fail++; return;
  }
  const result = src.split(find).join(replace);
  fs.writeFileSync(file, result, 'utf8');
  console.log('OK [x' + count + ']: ' + label);
  ok++;
}

const BRAIN = 'api/_brain.js';
const HTML  = 'public/index.html';

// ─── api/_brain.js ────────────────────────────────────────────────────────────

// 1. Simplify VISUAL PROMPT (2 occurrences — buildSongPrompt + buildLuckyPrompt)
patch(BRAIN, 'visual prompt simplify', [
  'COVER ART: [Single AI image prompt — dominant mood, color palette, visual metaphor for the song. Under 200 chars. No faces, no text in image.]',
  'STYLE: [art direction: photography / oil painting / digital illustration / cinematic still + key visual texture]',
  'PALETTE: [3-4 dominant colors and their emotional role]',
  'MOOD WORDS: [3 adjectives that describe the visual atmosphere]'
].join('\n'),
'[Write a single ready-to-paste image prompt for Midjourney, DALL-E or Firefly. ONE sentence: visual mood, setting, 2-3 key colors, art style. Under 200 chars. No faces, no text in image.]',
true);

// 2. Simplify VIDEO PROMPT (2 occurrences — stops before ${buildSingerNotesInstruction})
patch(BRAIN, 'video prompt simplify', [
  'CONCEPT: [One-sentence visual concept for the music video — setting, character arc, or abstract visual theme]',
  'MOVEMENT: [How the camera moves: handheld · dolly push · aerial · static locked · whip pan]',
  'ANGLES: [Key shot sequence: wide establishing → medium waist → close-up details → specific money shot]',
  'COLOR GRADE: [Grade/LUT style: warm golden hour · cold blue steel · bleach bypass · neon-saturated · desaturated grit]',
  'SCENES:',
  '1. Verse: [location + action + camera behavior]',
  '2. Chorus: [what happens visually at the emotional peak — the defining image]',
  '3. Bridge/Outro: [contrast scene or final visual statement]'
].join('\n'),
'[Write a single ready-to-paste video concept for Sora, Runway or Kling. ONE sentence: setting, visual action, camera movement, color grade, mood. Under 200 chars.]',
true);

// 3. Add Phonk to hiphop era lineage map
patch(BRAIN, 'phonk era entry',
  "'abstract-lyrical':'Abstract lyrical — experimental wordplay, nonlinear meaning; MF Doom / Earl Sweatshirt / Aesop Rock territory.'",
  "'abstract-lyrical':'Abstract lyrical — experimental wordplay, nonlinear meaning; MF Doom / Earl Sweatshirt / Aesop Rock territory.',\n" +
  "    'phonk':'Phonk — 2020s dark Memphis rap revival; distorted 808 cowbell-kick, lo-fi menace, 85-100 BPM; Ghostemane / NLE Choppa / SXVXEN; aggressive-but-slow delivery over hypnotic minimal loops; TikTok / gaming / gym-culture dominance. Write lyrics that feel like a slow-motion threat — short punchy lines, heavy repetition, relentless energy without rush.'"
);

// 4. Add Anthem/Triumph + Hustle/Grind to lyric theme map
patch(BRAIN, 'anthem + hustle theme entries',
  "'party':'Party — club energy, celebration, weekend vibes; accessible universal hip-hop function.'",
  "'party':'Party — club energy, celebration, weekend vibes; accessible universal hip-hop function.',\n" +
  "    'anthem-triumph':'Anthem/Triumph — motivational, overcoming-adversity, collective-victory energy; Eminem \"Lose Yourself\" / Kendrick \"Alright\" / Meek Mill \"Dreams and Nightmares\" / Kanye \"Power\" tradition. Cinematic build-ups, crowd-unifying hooks, first-person triumph that speaks for the collective. Every bar should feel like it belongs on a sports montage or a championship walk-out.',\n" +
  "    'hustle-grind':'Hustle/Grind — work-ethic, come-up-from-nothing, financial ambition; Nipsey Hussle / Rick Ross / Moneybagg Yo / Meek Mill grind mode. The journey IS the content — specifics of sacrifice, late nights, doubters proven wrong. Not bragging about having arrived; documenting the cost of getting there.'"
);

// 5. Add aggression param to buildSongPrompt destructuring
patch(BRAIN, 'aggression param destructuring',
  'craftDimensions = null\n  } = params;',
  'craftDimensions = null, aggression = \'mid\'\n  } = params;'
);

// 6. Add aggressionNote builder + inject into prompt
patch(BRAIN, 'aggressionNote builder + inject',
  "  const platinumNote = platinum ? buildTopTierNote(genre) : '';\n" +
  "  const adlibNote = buildAdlibNote(genre);\n" +
  "  const vocalStackNote = buildVocalStackNote(genre);\n" +
  "\n" +
  "  const prompt = `Write a complete, production-ready ${genreLabel} song",
  "  const platinumNote = platinum ? buildTopTierNote(genre) : '';\n" +
  "  const adlibNote = buildAdlibNote(genre);\n" +
  "  const vocalStackNote = buildVocalStackNote(genre);\n" +
  "\n" +
  "  const _aggrMap = {\n" +
  "    mellow: 'Mellow — laid-back, conversational, introspective energy throughout. No raised voices, no confrontation. Deliver emotion through restraint and precision. Think Chance the Rapper intimate mode, early Drake confessional, Kendrick reflective.',\n" +
  "    heat:   'Heat — elevated intensity, confrontational urgency in every bar. The verse should feel like it is building toward something that could explode. Think Kendrick \"HUMBLE.\" / Future menace / City Girls unapologetic. Every line has a point to prove.',\n" +
  "    rage:   'Rage — maximum aggression throughout. Every line hits like a threat or a demand. No softness, no hesitation — pure unfiltered force. Think Eminem \"Till I Collapse,\" DMX bark, early Chief Keef cold menace, NF uncontained fury.'\n" +
  "  };\n" +
  "  const aggressionNote = _aggrMap[aggression] ? `\\n\\nAGGRESSION LEVEL — ${_aggrMap[aggression]}` : '';\n" +
  "\n" +
  "  const prompt = `Write a complete, production-ready ${genreLabel} song"
);

// 7. Inject aggressionNote into prompt template (after edgeNote)
patch(BRAIN, 'aggressionNote prompt injection',
  '}${edgeNote}${freestyleNote}${genreSpecificNote}',
  '}${edgeNote}${aggressionNote}${freestyleNote}${genreSpecificNote}'
);

// 8. Fix buildRapLabPrompt bracketMode param
patch(BRAIN, 'raplab bracketMode destructure',
  "    hookStyle = 'auto'\n  } = params || {};",
  "    hookStyle = 'auto',\n    bracketMode = 'suno'\n  } = params || {};"
);

patch(BRAIN, 'raplab bracketMode use',
  "bracketInstructionServer('hiphop', 'full', style.label)",
  "bracketInstructionServer('hiphop', bracketMode, style.label)"
);

// 9. Update LYRICS section with three-type bracket hierarchy
patch(BRAIN, 'lyrics bracket hierarchy',
  '[Write the complete song lyrics below. EACH SECTION MUST START WITH ITS BRACKET TAG ON ITS OWN LINE — e.g. [Verse 1] then the lines, [Chorus] then the lines, [Bridge] then the lines. No bracket tag = section does not exist. Every word must earn its place.]',
  '[Write the complete song lyrics using this exact bracket system — three types, each with a distinct job:\n\n' +
  'TYPE 1 — STRUCTURE (own line, opens every section — required):\n' +
  '[Intro] · [Verse 1] · [Pre-Chorus] · [Chorus] · [Bridge] · [Hook] · [Breakdown] · [Outro]\n\n' +
  'TYPE 2 — DELIVERY (own line immediately BEFORE the specific lyric line it affects):\n' +
  '[Whispered] · [Spoken] · [Falsetto] · [Screamed] · [Harmony] · [Ad-libs]\n\n' +
  'TYPE 3 — PRODUCTION DNA (placed inline inside the section body, ≥1 required per Chorus):\n' +
  '[808 Bass] · [Build] · [Drop] · [Trap Hi-Hat] · [Steel Guitar] · [Choir] · [Beat Switch] · [Breakdown]\n\n' +
  'PARENTHESES () = ad-libs and background vocal layers ONLY — never use () for structural or delivery purposes.\n' +
  '  Same line as a lyric = rhythmic pocket filler. Standalone line = spotlight ad-lib moment.\n\n' +
  'Every word must earn its place. No bracket tag = that section does not exist.]'
);

// 10. Update SONG PROMPT Full prompt to mirror TYPE 3 tags
patch(BRAIN, 'song prompt TYPE3 alignment',
  'Assemble into one ready-to-paste string under 440 characters — NO artist names]',
  'Assemble into one ready-to-paste Suno string under 440 characters — NO artist names. This string MUST reflect the same production vocabulary as the TYPE 3 production bracket tags used in the lyrics (e.g. if the chorus uses [808 Bass] the prompt must include 808 bass; if [Falsetto] appears in delivery tags note it in the vocal descriptor).]'
);

// 11. Update GENRE PURITY rule
patch(BRAIN, 'genre purity TYPE3 reference',
  'GENRE PURITY: Every chorus MUST include at least one genre-specific production tag in brackets (e.g. [Build], [Drop], [Trap Hi-Hat], [Steel Guitar], [Choir], [808 Bass]) — this signals genre DNA to the AI platform',
  'GENRE PURITY: Every chorus MUST include at least one TYPE 3 production tag inline (e.g. [Build], [Drop], [Trap Hi-Hat], [Steel Guitar], [Choir], [808 Bass]) — these are NOT section headers, they are sonic DNA signals placed inside the lyric body to guide the AI platform\'s production. The SONG PROMPT Full prompt must use the same production vocabulary as these tags.'
);

// ─── public/index.html ────────────────────────────────────────────────────────

// 12. Fix image prompt parsing (2 occurrences)
patch(HTML, 'image prompt parsing fix',
  "const _vb=parseSection(raw,'VISUAL PROMPT','VIDEO PROMPT');const visualPrompt=_vb?(_vb.match(/COVER ART:\\s*(.+)/)||['',_vb])[1].trim():'';",
  "const visualPrompt=parseSection(raw,'VISUAL PROMPT','VIDEO PROMPT')||'';",
  true
);

// 13. Fix video prompt parsing (2 occurrences)
patch(HTML, 'video prompt parsing fix',
  "let _vpb=parseSection(raw,'VIDEO PROMPT',null);const _si=_vpb.indexOf('SINGER');if(_si>0)_vpb=_vpb.slice(0,_si).trim();const videoPrompt=_vpb?(_vpb.match(/CONCEPT:\\s*(.+)/)||['',_vpb])[1].trim():'';",
  "let _vpb=parseSection(raw,'VIDEO PROMPT',null);const _si=_vpb?_vpb.indexOf('SINGER'):-1;if(_si>0)_vpb=_vpb.slice(0,_si).trim();const videoPrompt=_vpb||'';",
  true
);

// 14. Add Phonk pill to hiphop Era row
patch(HTML, 'phonk era pill',
  "onclick=\"setCraftDim(this,'hiphop','eraLineage','abstract-lyrical')\">Abstract Lyrical</span>",
  "onclick=\"setCraftDim(this,'hiphop','eraLineage','abstract-lyrical')\">Abstract Lyrical</span>\n            <span class=\"rl-dpill\"    onclick=\"setCraftDim(this,'hiphop','eraLineage','phonk')\">Phonk</span>"
);

// 15. Add Anthem/Triumph + Hustle/Grind pills to hiphop Theme row
patch(HTML, 'anthem + hustle theme pills',
  "onclick=\"setCraftDim(this,'hiphop','lyricTheme','party')\">Party</span>",
  "onclick=\"setCraftDim(this,'hiphop','lyricTheme','party')\">Party</span>\n            <span class=\"rl-dpill\"    onclick=\"setCraftDim(this,'hiphop','lyricTheme','anthem-triumph')\">Anthem / Triumph</span>\n            <span class=\"rl-dpill\"    onclick=\"setCraftDim(this,'hiphop','lyricTheme','hustle-grind')\">Hustle / Grind</span>"
);

// 16. Add selectedAggression to S state
patch(HTML, 'selectedAggression state',
  "  edgeMode: 'off',             // 'off' | 'authentic' | 'raw'",
  "  selectedAggression: 'mid',   // 'mellow' | 'mid' | 'heat' | 'rage'\n  edgeMode: 'off',             // 'off' | 'authentic' | 'raw'"
);

// 17. Add Aggression UI after era-desc
patch(HTML, 'aggression UI pills',
  '          <div id="era-desc" style="font-size:11px;color:var(--tx3);font-style:italic;margin-bottom:12px;min-height:16px"></div>\n\n          <!-- BRACKET FORMATTING -->',
  '          <div id="era-desc" style="font-size:11px;color:var(--tx3);font-style:italic;margin-bottom:12px;min-height:16px"></div>\n\n          <!-- AGGRESSION -->\n          <label class="topic-label">Aggression</label>\n          <div class="quality-row" id="aggression-pills">\n            <span class="qpill" onclick="setAggression(this,\'mellow\')">🌊 Mellow</span>\n            <span class="qpill on" onclick="setAggression(this,\'mid\')">◼ Mid</span>\n            <span class="qpill" onclick="setAggression(this,\'heat\')">🔥 Heat</span>\n            <span class="qpill" onclick="setAggression(this,\'rage\')">💢 Rage</span>\n          </div>\n          <div id="aggression-desc" style="font-size:11px;color:var(--tx3);font-style:italic;margin-bottom:12px;min-height:16px"></div>\n\n          <!-- BRACKET FORMATTING -->'
);

// 18. Add setAggression function + AGGRESSION_DESCS after setEra
patch(HTML, 'setAggression function',
  "function setEra(el, val) {\n  document.querySelectorAll('#era-pills .qpill').forEach(p => p.classList.remove('on'));\n  el.classList.add('on');\n  S.selectedEra = val;\n  const desc = document.getElementById('era-desc');\n  if (desc) desc.textContent = ERA_DESCS[val] || '';\n}",
  "function setEra(el, val) {\n  document.querySelectorAll('#era-pills .qpill').forEach(p => p.classList.remove('on'));\n  el.classList.add('on');\n  S.selectedEra = val;\n  const desc = document.getElementById('era-desc');\n  if (desc) desc.textContent = ERA_DESCS[val] || '';\n}\n\nconst AGGRESSION_DESCS = {\n  mellow: 'Laid-back, conversational, introspective — emotion through restraint.',\n  mid:    'Balanced energy — default feel for most genres.',\n  heat:   'Elevated intensity, confrontational urgency — every bar has a point to prove.',\n  rage:   'Maximum force — no softness, no hesitation, pure unfiltered aggression.',\n};\nfunction setAggression(el, val) {\n  document.querySelectorAll('#aggression-pills .qpill').forEach(p => p.classList.remove('on'));\n  el.classList.add('on');\n  S.selectedAggression = val;\n  const desc = document.getElementById('aggression-desc');\n  if (desc) desc.textContent = AGGRESSION_DESCS[val] || '';\n}"
);

// 19. Add aggression to songParams payload
patch(HTML, 'aggression payload',
  "    edgeTopics: Array.isArray(S.edgeTopics) ? [...S.edgeTopics] : [],\n    freestyleMode: !!S.freestyleMode,",
  "    edgeTopics: Array.isArray(S.edgeTopics) ? [...S.edgeTopics] : [],\n    aggression: S.selectedAggression || 'mid',\n    freestyleMode: !!S.freestyleMode,"
);

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log('\n' + (fail ? '⚠️  ' + fail + ' failed, ' : '') + ok + ' patches applied.');
if (fail) { console.error('Fix failures above then re-run.'); process.exit(1); }
else console.log('Run: git add api/_brain.js public/index.html && git commit -m "prod: apply all pending patches" && git push origin main');
