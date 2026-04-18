const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'api', '_brain.js');
console.log('Reading: ' + FILE);
let src = fs.readFileSync(FILE, 'utf8');
src = src.replace(/\r\n/g, '\n');

function patch(src, find, repl, label) {
  if (!src.includes(find)) {
    console.error('\nFAIL - string not found: ' + label);
    process.exit(1);
  }
  const count = src.split(find).length - 1;
  if (count > 1) {
    console.error('\nFAIL - ' + count + ' matches (ambiguous): ' + label);
    process.exit(1);
  }
  console.log('OK: ' + label);
  return src.split(find).join(repl);
}

const BLOCK = `const BREATH_TECHNIQUES_10 = [
  {id:'diaphragmatic',name:'Diaphragmatic Breath',cue:'Belly rises on inhale, chest stays still',when:'Before any phrase'},
  {id:'support',name:'Breath Support',cue:'Engage belly outward as you sing or rap',when:'Long notes, power phrases, big chorus lines'},
  {id:'quick_inhale',name:'Quick Catch Breath',cue:'Silent fast inhale through open throat',when:'Short gaps between lyric lines'},
  {id:'phrase_plan',name:'Phrase Planning',cue:'Mark breath spots before recording, never inhale mid-word',when:'Before every take'},
  {id:'release',name:'Controlled Release',cue:'Exhale slow and steady, do not dump air on first word',when:'Opening lines of every verse'},
  {id:'vowel_open',name:'Open Vowel Shaping',cue:'Drop jaw on A E O I U, let the vowel carry the note',when:'Hook phrases, long held notes'},
  {id:'rap_pocket',name:'Rap Pocket Breath',cue:'Inhale every 4th bar end, silent through open mouth',when:'Bars 4 8 12 are your windows in a 16-bar verse'},
  {id:'compression',name:'Compression Technique',cue:'Squeeze core gently during delivery',when:'Gospel shout, metal scream, belted chorus'},
  {id:'recovery',name:'Recovery Breath',cue:'Full slow inhale 4 counts after long or intense phrase',when:'Between takes and between intense sections'},
  {id:'resonance',name:'Resonance Placement',cue:'Feel vibration in chest or face, not your throat',when:'Every phrase, throat vibration means tension'},
];
const BREATH_PROFILES = {
  pop:       {priority:['phrase_plan','support','vowel_open','quick_inhale'],note:'Pop hooks demand breath efficiency. Mark inhales before every chorus line. Open vowels make hooks soar.'},
  hiphop:    {priority:['rap_pocket','quick_inhale','support','recovery'],note:'Rap pocket breathing: inhale every 4 bars. Bars 4, 8, 12, 16 are your windows. Missed breath = rushed delivery.'},
  rnb:       {priority:['support','vowel_open','diaphragmatic','resonance'],note:"R&B runs require full breath support. Never start a melisma on a half-breath, it will crack."},
  neosoul:   {priority:['diaphragmatic','support','recovery','resonance'],note:'Neo-soul breathes with the groove. Inhale off the beat, never on it.'},
  gospel:    {priority:['compression','support','quick_inhale','recovery'],note:'Gospel shouting demands core compression. Recovery breath after every bridge vamp, 4 counts in 4 out.'},
  rock:      {priority:['support','compression','quick_inhale','diaphragmatic'],note:'Rock delivery is physically demanding. Belly support prevents vocal strain.'},
  country:   {priority:['phrase_plan','support','vowel_open','diaphragmatic'],note:'Country storytelling lives in the long vowels. Open vowels, steady support.'},
  metal:     {priority:['compression','support','recovery','diaphragmatic'],note:'Metal screaming without core compression causes vocal damage. Recovery breath is mandatory.'},
  jazz:      {priority:['phrase_plan','diaphragmatic','resonance','release'],note:'Jazz phrasing breathes like conversation. Breath marks are as musical as the notes.'},
  blues:     {priority:['diaphragmatic','support','phrase_plan','resonance'],note:'Blues leaves space. The space after a phrase is a breath invitation, do not rush.'},
  folk:      {priority:['diaphragmatic','phrase_plan','release','resonance'],note:'Folk intimacy requires a relaxed open throat. Breathe from the belly and let go.'},
  ss:        {priority:['diaphragmatic','phrase_plan','resonance','release'],note:'Singer-songwriter delivery lives in the breath. Make it intentional, not desperate.'},
  reggae:    {priority:['diaphragmatic','support','quick_inhale','recovery'],note:'Reggae phrasing is laid-back, breath follows the one-drop, never fights it.'},
  afrobeats: {priority:['quick_inhale','rap_pocket','support','diaphragmatic'],note:'Call-and-response requires quick catch breaths in the response gaps.'},
  reggaeton: {priority:['rap_pocket','quick_inhale','support','release'],note:'Dembow flow requires rapid catch breaths. Breathe in the syncopated gaps.'},
  edm:       {priority:['phrase_plan','quick_inhale','support','release'],note:'EDM hooks are short and punchy. Full support on every drop line.'},
  latin:     {priority:['diaphragmatic','vowel_open','support','quick_inhale'],note:'Latin open vowels demand jaw freedom. Drop the jaw on every A and O.'},
  altrock:   {priority:['support','compression','quick_inhale','recovery'],note:'Alt-rock quiet-loud dynamic means breath must shift with the energy.'},
  punk:      {priority:['compression','support','quick_inhale','recovery'],note:'Punk is fast and aggressive. Core compression protects the voice.'},
  kpop:      {priority:['phrase_plan','support','vowel_open','recovery'],note:'K-pop precision requires pre-planned breath marks for every choreography line.'},
  parody:    {priority:['phrase_plan','support','quick_inhale','release'],note:'Comedy delivery needs steady breath. Breathe before the punchline, not during.'},
  comedy:    {priority:['phrase_plan','support','quick_inhale','release'],note:'Comic timing is breath timing. The pause before the punchline is a breath mark.'},
  children:  {priority:['diaphragmatic','vowel_open','support','release'],note:"Children's singing feels effortless when you breathe from the belly."},
  tvmusical: {priority:['support','compression','vowel_open','phrase_plan'],note:'Theatrical delivery demands full breath support. Mark breaths like an actor marks pauses.'},
};
function buildSingerNotesInstruction(genre, isRap) {
  const profile = BREATH_PROFILES[genre] || BREATH_PROFILES.pop;
  const gl = GENRE_LABELS[genre] || genre || 'this genre';
  const tt = BREATH_TECHNIQUES_10.filter(t => profile.priority.includes(t.id)).slice(0, 4);
  const lines = tt.map(t => '  * ' + t.name + ': ' + t.cue + ' -- ' + t.when).join('\\n');
  const r5 = isRap
    ? 'Rap rule: bars 4, 8, 12, 16 are your breath windows -- use all of them'
    : 'Studio rule: full belly breath before every new take -- reset the instrument';
  return "\\n\\nSINGER'S NOTES -- Breathwork for " + gl + ":\\n" +
    profile.note + "\\n\\nTOP TECHNIQUES FOR THIS SONG:\\n" + lines +
    "\\n\\nQUICK RULES:\\n" +
    "1. Never inhale mid-word -- always at phrase boundaries\\n" +
    "2. Mark breath spots before recording (breath) in the margins\\n" +
    "3. Recovery breath after any long or intense section: 4 counts in, 4 counts out\\n" +
    "4. Throat tension = wrong placement, redirect to chest or head resonance\\n" +
    "5. " + r5;
}

`;

src = patch(src,
  'module.exports = { buildSongPrompt,',
  BLOCK + '\nmodule.exports = { buildSongPrompt,',
  'insert breathwork block'
);

// Regex-based: works regardless of what the last export is
const origSrc = src;
src = src.replace(
  /(module\.exports\s*=\s*\{[^\n]+?)\s*\};/,
  '$1, BREATH_TECHNIQUES_10, BREATH_PROFILES, buildSingerNotesInstruction };'
);
if (src === origSrc) {
  console.error('\nFAIL - module.exports line not found');
  process.exit(1);
}
console.log('OK: update module.exports');

src = patch(src,
  '3. Bridge/Outro: [contrast scene or final visual statement]`;\n\n  return { system, prompt };\n}\n\nfunction buildLuckyPrompt',
  "3. Bridge/Outro: [contrast scene or final visual statement]${buildSingerNotesInstruction(genre, genre === 'hiphop')}`;\n\n  return { system, prompt };\n}\n\nfunction buildLuckyPrompt",
  'buildSongPrompt inject'
);

src = patch(src,
  '3. Bridge/Outro: [contrast scene or final visual statement]`;\n\n  return {\n    system,\n    prompt,\n    meta:',
  "3. Bridge/Outro: [contrast scene or final visual statement]${buildSingerNotesInstruction(g1, g1 === 'hiphop')}`;\n\n  return {\n    system,\n    prompt,\n    meta:",
  'buildLuckyPrompt inject'
);

src = patch(src,
  "5. [What makes this combination of dimensions unique]${buildVocalStackNote('hiphop')}`;\n\n  return { system, prompt };\n}\n\n// ",
  "5. [What makes this combination of dimensions unique]${buildVocalStackNote('hiphop')}${buildSingerNotesInstruction('hiphop', true)}`;\n\n  return { system, prompt };\n}\n\n// ",
  'buildRapLabPrompt inject'
);

fs.writeFileSync(FILE, src, 'utf8');
console.log('\nDone. All 5 patches applied.');
