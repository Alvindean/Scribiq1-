// patch-lyric-craft.js — run from C:\Users\alvin\soniq with: node patch-lyric-craft.js
// Adds LYRIC_CRAFT_UNIVERSAL + buildLyricCraftNote to api/_brain.js and wires it into
// buildSongPrompt (all genres) and buildRapLabPrompt (hip-hop specific)

const fs = require('fs');
const BRAIN = 'api/_brain.js';

let ok = 0, skipped = 0, failed = 0;
function good(l)  { console.log('  OK: ' + l); ok++; }
function skip(l)  { console.log('  SKIP (already present): ' + l); skipped++; }
function fail(l,r){ console.log('  FAIL (' + r + '): ' + l); failed++; }

if (!fs.existsSync(BRAIN)) { console.error('MISSING: ' + BRAIN); process.exit(1); }
let brain = fs.readFileSync(BRAIN, 'utf8').replace(/\r\n/g, '\n');

// ─────────────────────────────────────────────────────────────────────────────
// 1. INSERT LYRIC_CRAFT_UNIVERSAL + buildLyricCraftNote before const STRUCTURES=
// ─────────────────────────────────────────────────────────────────────────────

const LYRIC_CRAFT_BLOCK = `// ─────────────────────────────────────────────────────────────────────────────
// LYRIC CRAFT TOOLKIT — universal techniques, genre-filtered per song.
// Each technique has a short-form instruction used in the live prompt.
// buildLyricCraftNote(genre) selects and formats the relevant set.
// applicable. buildLyricCraftNote(genre) selects and formats the relevant set.
// ─────────────────────────────────────────────────────────────────────────────
const LYRIC_CRAFT_UNIVERSAL = {

  // ── FIGURATIVE LANGUAGE ────────────────────────────────────────────────────
  simile: {
    label: 'SIMILE',
    short: \`"X is LIKE Y" or "X is AS [adj] AS Y" — the comparison must be EARNED and non-obvious. Weak: "beautiful like a rose." Strong: "quiet like a house with no furniture in it." The vehicle must reveal something NEW about the subject.\`,
    genres: 'all'
  },

  metaphor: {
    label: 'METAPHOR',
    short: \`Direct substitution — no "like/as." "You ARE the storm." Must be earned — no generic imagery. Use the genre's home vocabulary (blues=crossroads/river, country=road/fire, gospel=light/shepherd, hip-hop=game/throne/block) OR introduce one fresh metaphor per song, never both.\`,
    genres: 'all'
  },

  extendedMetaphor: {
    label: 'EXTENDED METAPHOR',
    short: \`One metaphor sustained for the full verse or whole song. Commit completely — every line deepens the same image without drifting. A storm song stays in weather language start to finish. Abandoning the metaphor mid-verse signals a weak writer.\`,
    genres: ['folk','country','blues','gospel','neosoul','altrock','rnb','pop','tvmusical','jazz']
  },

  // ── DOUBLE / TRIPLE ENTENDRE ───────────────────────────────────────────────
  doubleEntendre: {
    label: 'DOUBLE ENTENDRE',
    short: \`One line, two complete simultaneous meanings — surface and deeper (suggestive, political, or subversive). Both readings must work perfectly from the SAME words. The listener who catches the second is rewarded; the listener who doesn't still enjoys the surface. Blues invented this. Apply freely to: country, R&B, reggae, pop.\`,
    genres: ['hiphop','blues','rnb','reggae','country','pop','jazz','neosoul','rock','altrock']
  },

  tripleEntendre: {
    label: 'TRIPLE ENTENDRE',
    short: \`Three simultaneous readings: (1) obvious surface, (2) deeper meaning, (3) self-referential or meta-political layer. Use once per song maximum at the most important line. Do not announce it — let the listener discover it.\`,
    genres: ['hiphop','rnb','pop','blues','country']
  },

  // ── SONIC DEVICES ──────────────────────────────────────────────────────────
  alliteration: {
    label: 'ALLITERATION',
    short: \`Same consonant SOUND on consecutive stressed syllables ("phone" and "find" alliterate). Max 2-3 pairs per verse — overuse kills momentum. Best placement: hook key phrase, verse opening line, punchline bar.\`,
    genres: 'all'
  },

  assonance: {
    label: 'ASSONANCE',
    short: \`Matching VOWEL sounds within or across lines — the invisible rhyme listeners feel but don't consciously identify. Holds lines together subliminally when end-rhyme would feel forced. Essential in folk, Americana, alternative, and any style prioritising natural speech.\`,
    genres: 'all'
  },

  consonance: {
    label: 'CONSONANCE',
    short: \`Matching CONSONANT sounds at any word position. Hard consonants (K,T,D,G,P,B) create punch and aggression; soft consonants (S,F,SH,L,M,N) create smoothness and intimacy. Match the sonic texture of words to the emotional texture of the meaning.\`,
    genres: 'all'
  },

  // ── STRUCTURAL CRAFT ───────────────────────────────────────────────────────
  setupPunchline: {
    label: 'SETUP / PUNCHLINE',
    short: \`Setup establishes an expectation; punchline fulfills it unexpectedly in ONE line. Blues: 2-line situation + 1-line twist. Hip-hop: bars 1-15 build the premise, bar 16 detonates it. Country: full verse builds toward a final line that recontextualises everything before it. Rule: inevitable in retrospect, surprising in the moment.\`,
    genres: ['hiphop','blues','country','folk','comedy','parody','rnb','jazz','reggae','pop','rock','altrock']
  },

  misdirection: {
    label: 'MISDIRECTION / TWIST',
    short: \`Lead the listener confidently down one interpretation; final word or line pivots completely. Setup language must support BOTH readings — the listener fills in the expected meaning, then the final word flips it. Unexpected reading must be supported by every prior word in retrospect.\`,
    genres: ['country','folk','blues','comedy','parody','pop','hiphop','rnb','altrock','rock','jazz']
  },

  callback: {
    label: 'CALLBACK / BOOKEND',
    short: \`Open with a specific image, phrase, or line. Return the IDENTICAL words at song's end — but accumulated experience transforms what they mean. The ending reframes the beginning. One of the most emotionally powerful tools in songwriting. Works in every genre.\`,
    genres: 'all'
  },

  ruleOfThrees: {
    label: 'RULE OF THREES',
    short: \`Two expected items, one unexpected. Brain anticipates the pattern completion — the subverted third delivers the surprise. "[Expected], [expected], [subversion]." First two must genuinely establish the pattern or the third won't land. Works in every genre.\`,
    genres: 'all'
  },

  anaphora: {
    label: 'ANAPHORA',
    short: \`Same word or phrase opens consecutive lines — cumulative rhetorical power. Each repeat adds weight; the final line must be the most powerful. Limit 3-5 repetitions. Use in gospel declarations, folk protest, hip-hop verse-builds, pop bridge climaxes, R&B vamps.\`,
    genres: ['gospel','folk','hiphop','pop','country','rnb','neosoul','blues','rock','altrock']
  },

  epistrophe: {
    label: 'EPISTROPHE',
    short: \`Same word or phrase ENDS consecutive lines — echo and accumulation. The repeated word must be the most emotionally loaded word in the argument. Inverse of anaphora: creates resolution rather than momentum. Powerful in gospel outros, rap hooks, folk refrains.\`,
    genres: ['gospel','hiphop','folk','rnb','country','neosoul','pop','blues']
  },

  // ── HIP-HOP / RAP CRAFT ────────────────────────────────────────────────────
  multisyllabicScheme: {
    label: 'MULTISYLLABIC (MULTI) SCHEME',
    short: \`Chain 3-5 syllable rhyming clusters across 4-8 bars — not "day/way" but "breaking away / taking the stage / making them pay." Pick a 3-syllable sound cluster; every line's LAST 3 syllables must match it. Must feel natural — filler words to complete the rhyme destroy credibility instantly.\`,
    genres: ['hiphop','reggaeton','kpop','pop']
  },

  schemeExtension: {
    label: 'SCHEME EXTENSION',
    short: \`Extend an established rhyme scheme 2-4 bars past where the listener expects it to end. Feels like bonus craft — unexpected technical generosity. The extension must maintain scheme quality; a weak extension is worse than ending on time.\`,
    genres: ['hiphop','reggaeton','kpop']
  },

  nameFlip: {
    label: 'NAME FLIP / WORD FLIP',
    short: \`Use a word (name, brand, place, phrase) where its literal meaning AND a secondary meaning are simultaneously active. The secondary meaning must be genuinely in the language — not invented for the rhyme. The listener's silent "oh — I see it" is the payoff.\`,
    genres: ['hiphop','blues','country','comedy','parody','pop','rnb']
  },

  wordplayTaxonomy: {
    label: 'WORDPLAY FORMS',
    short: \`Four types: (1) HOMOPHONE — same sound, different word ("reign/rain/rein"); (2) HOMONYM — same word, two meanings ("bat"); (3) PORTMANTEAU — two words fused into one; (4) ACRONYM FLIP — word also reads as meaningful acronym. Rule: must reward the listener without requiring explanation. If it needs a footnote, it failed.\`,
    genres: ['hiphop','pop','comedy','parody','country','blues','rnb','altrock']
  },

  battleRapCraft: {
    label: 'BATTLE RAP CRAFT',
    short: \`Every bar must damage a target. Six laws: (1) PERSONAL — specific and true, not generic insults; (2) REBUTTAL — flip the opponent's own words against them; (3) SCHEME CHAIN — commit to a multi for 4-8 bars, never break it mid-round; (4) THE ANGLE — one conceptual lane per round, stay in it; (5) CROWD MOMENT — one "oh shit" bar engineered per round; (6) CONSISTENCY — every bar supports the angle, no off-topic bars.\`,
    genres: ['hiphop']
  }
};

// Returns a compact lyric craft instruction block for a given genre.
// Uses short-form instructions to stay within prompt size budget (~2000 chars max).
function buildLyricCraftNote(genre) {
  const applicable = Object.values(LYRIC_CRAFT_UNIVERSAL).filter(t =>
    t.genres === 'all' || (Array.isArray(t.genres) && t.genres.includes(genre))
  );
  if (!applicable.length) return '';

  const lines = applicable.map(t => \`• \${t.label}: \${t.short}\`).join('\\n');
  return \`\\n\\nLYRIC CRAFT TOOLKIT — use these where they serve the song, never forced:\\n\${lines}\`;
}

`;

const structuresAnchor = 'const STRUCTURES={';

if (brain.includes('LYRIC_CRAFT_UNIVERSAL')) {
  skip('LYRIC_CRAFT_UNIVERSAL constant');
} else if (brain.includes(structuresAnchor)) {
  brain = brain.replace(structuresAnchor, LYRIC_CRAFT_BLOCK + structuresAnchor);
  good('LYRIC_CRAFT_UNIVERSAL + buildLyricCraftNote inserted');
} else {
  fail('LYRIC_CRAFT_UNIVERSAL insert', 'anchor "const STRUCTURES={" not found in _brain.js');
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ADD const lyricCraftNote = buildLyricCraftNote(genre); in buildSongPrompt
// ─────────────────────────────────────────────────────────────────────────────

const specificityDecl = 'const specificityNote = ';
const lyricCraftDecl  = 'const lyricCraftNote = buildLyricCraftNote(genre);';

if (brain.includes(lyricCraftDecl)) {
  skip('lyricCraftNote declaration in buildSongPrompt');
} else if (brain.includes(specificityDecl)) {
  // Find the end of the specificityNote line and insert after it
  const idx = brain.indexOf(specificityDecl);
  const lineEnd = brain.indexOf('\n', idx);
  if (lineEnd === -1) {
    fail('lyricCraftNote declaration', 'could not find end of specificityNote line');
  } else {
    brain = brain.slice(0, lineEnd) + '\n\n  ' + lyricCraftDecl + brain.slice(lineEnd);
    good('lyricCraftNote declaration inserted after specificityNote');
  }
} else {
  fail('lyricCraftNote declaration', 'anchor "const specificityNote = " not found');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. INJECT ${lyricCraftNote} into the buildSongPrompt template string
// ─────────────────────────────────────────────────────────────────────────────

// The template string ends with ${specificityNote} near the SONGWRITING RULES block.
// We need to add ${lyricCraftNote} right after ${specificityNote}.

const sunoRulesAnchor1 = '${specificityNote}${lyricCraftNote}';
const sunoRulesAnchor2 = '${specificityNote}${preChorusNote}';
const sunoRulesAnchor3 = '${specificityNote}${platinumNote}';
const sunoRulesAnchor4 = '${specificityNote}${bridgeNote}';

// Check if already injected
if (brain.includes(sunoRulesAnchor1)) {
  skip('${lyricCraftNote} injection in buildSongPrompt template');
} else if (brain.includes(sunoRulesAnchor2)) {
  brain = brain.replace(sunoRulesAnchor2, '${specificityNote}${lyricCraftNote}${preChorusNote}');
  good('${lyricCraftNote} injected after ${specificityNote} in buildSongPrompt');
} else if (brain.includes(sunoRulesAnchor3)) {
  brain = brain.replace(sunoRulesAnchor3, '${specificityNote}${lyricCraftNote}${platinumNote}');
  good('${lyricCraftNote} injected after ${specificityNote} in buildSongPrompt (platinumNote anchor)');
} else if (brain.includes(sunoRulesAnchor4)) {
  brain = brain.replace(sunoRulesAnchor4, '${specificityNote}${lyricCraftNote}${bridgeNote}');
  good('${lyricCraftNote} injected after ${specificityNote} in buildSongPrompt (bridgeNote anchor)');
} else {
  // Last resort: find ${specificityNote} in the large template string and append
  const specToken = '${specificityNote}';
  const idx = brain.lastIndexOf(specToken); // lastIndexOf to get the one in the template, not declaration
  if (idx !== -1 && idx > brain.indexOf(specificityDecl)) {
    brain = brain.slice(0, idx + specToken.length) + '${lyricCraftNote}' + brain.slice(idx + specToken.length);
    good('${lyricCraftNote} injected after ${specificityNote} (fallback lastIndexOf)');
  } else {
    fail('${lyricCraftNote} template injection', 'could not find ${specificityNote} insertion point');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. INJECT ${buildLyricCraftNote('hiphop')} into buildRapLabPrompt
// ─────────────────────────────────────────────────────────────────────────────

const rapCraftInjected   = "${buildLyricCraftNote('hiphop')}";
const rapRespond         = 'Respond with EXACTLY this format:';

// Possible anchors right before "Respond with EXACTLY this format:" in rap prompt
const rapAnchorAdlib     = "${buildAdlibNote('hiphop')}\n\n" + rapRespond;
const rapAnchorSpecManA  = "with a concrete sensory image.\n\n" + rapRespond;
const rapAnchorSpecManB  = "with a concrete sensory image.${buildAdlibNote('hiphop')}\n" + rapRespond;
const rapAnchorSpecManC  = "with a concrete sensory image.${buildAdlibNote('hiphop')}\n\n" + rapRespond;

function injectBeforeRapRespond(src, anchor) {
  if (!src.includes(anchor)) return null;
  return src.replace(anchor, anchor.replace(rapRespond, rapCraftInjected + '\n\n' + rapRespond));
}

if (brain.includes(rapCraftInjected)) {
  skip("${buildLyricCraftNote('hiphop')} in buildRapLabPrompt");
} else {
  let patched = null;
  const anchorsToTry = [
    { anchor: rapAnchorAdlib,    label: 'adlib anchor' },
    { anchor: rapAnchorSpecManC, label: 'specificity+adlib+\\n\\n anchor' },
    { anchor: rapAnchorSpecManB, label: 'specificity+adlib+\\n anchor' },
    { anchor: rapAnchorSpecManA, label: 'specificity+\\n\\n anchor' },
  ];

  for (const { anchor, label } of anchorsToTry) {
    patched = injectBeforeRapRespond(brain, anchor);
    if (patched) {
      brain = patched;
      good(`\${buildLyricCraftNote('hiphop')} injected in buildRapLabPrompt (${label})`);
      break;
    }
  }

  if (!patched) {
    // Last-resort: find the LAST "Respond with EXACTLY this format:" (which is in the rap prompt)
    const allIdx = [];
    let pos = -1;
    while ((pos = brain.indexOf(rapRespond, pos + 1)) !== -1) allIdx.push(pos);

    if (allIdx.length >= 1) {
      // Use the last occurrence — that's the rap prompt
      const lastIdx = allIdx[allIdx.length - 1];
      brain = brain.slice(0, lastIdx) + rapCraftInjected + '\n\n' + brain.slice(lastIdx);
      good("${buildLyricCraftNote('hiphop')} injected before last 'Respond with EXACTLY' (last-resort)");
    } else {
      fail("${buildLyricCraftNote('hiphop')} injection", '"Respond with EXACTLY this format:" not found in rap template');
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Write the file
// ─────────────────────────────────────────────────────────────────────────────

fs.writeFileSync(BRAIN, brain, 'utf8');

console.log('\n' + ok + ' applied, ' + skipped + ' skipped, ' + failed + ' failed.');
if (failed > 0) {
  console.error('\nFix failures above then re-run.');
  process.exit(1);
} else {
  console.log('\nNext:');
  console.log('  git add api/_brain.js');
  console.log('  git commit -m "feat: lyric craft toolkit — simile/metaphor/entendre/scheme/battle-rap across all genres"');
  console.log('  git push origin main');
}
