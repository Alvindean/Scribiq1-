/**
 * SONIQ Brain — Server-side songwriting intelligence
 * Contains all proprietary IP: genre data, music theory, prompt templates
 * NEVER expose this file or its contents to the client.
 */

const GENRE_BIBLE={
  hiphop:{
    dna:'Bars are currency — 1 bar = 1 line. 16-bar verse = 16 lines. Hook = 8 bars = 8 lines (or 4 unique lines repeated). Ad-libs in parentheses: (yeah) (uh) (let\'s go). Internal rhymes every 2-3 syllables create density. Flow variation (normal → double time → triplet) is the surprise weapon.',
    structure:'Classic: [16-bar Verse] × 3 with [8-bar Hook]. Trap: [8-bar Hook] → [12-bar Verse] repeated with hook 4-6×. Beat Switch: two complete song sections at different BPMs joined by [Beat Switch]. Bar 16 of every verse = the punchline. 4-bar groups: bars 1-4 setup, 5-8 develop, 9-12 deepen, 13-16 payoff.',
    suno:'"trap, 808 bass, hard snare, rolling hi-hats, 140 BPM" for trap. "boom bap, vinyl crackle, jazz sample, hard kick, 90 BPM" for classic. "melodic rap, atmospheric, auto-tune, 120 BPM" for melodic. Always specify BPM. Use [Rap Verse] to prevent Suno singing the verse.',
    keys:[
      '1 bar = 1 line — write exactly the bar count specified in the structure. 16-bar verse = 16 lines, no more, no less',
      'Ad-libs belong in parentheses on the same line: "I got it (yeah) from nothing (uh)" — Suno renders these as background interjections',
      '[Triplet Flow] = rolling 3-syllable subdivisions (da-da-DUM). [Double Time] = twice the syllables per bar. Use [Beat Switch] for full BPM/key change',
      'Hook must be melodically singable even in a rap song — it carries the emotional memory. Trap hooks repeat 4-6× total across the song',
      'Verse structure within 16 bars: bars 1-4 establish scene/topic, bars 5-8 develop, bars 9-12 complicate or contrast, bar 16 is always the punchline or emotional peak',
      'Internal rhymes every 2-3 syllables add density beyond end rhymes. Chain rhymes across 4-bar units create momentum'
    ],
    artists:'Kendrick Lamar · Drake · Travis Scott · J. Cole · Eminem · Future · Lil Baby · Tyler the Creator · 21 Savage · Gunna · Nas · Jay-Z',
    counter:{device:'Sample loop / producer melody vs. rap flow',does:'The melodic sample or producer-generated hook plays continuously underneath the rap verses — it becomes the emotional anchor that the bars respond to. Ad-lib voices ("yeah","uh") create a rhythmic counter-voice.',howto:'melodic sample hook, producer melody loop, ad-lib counter-voice',map:'Verse: sample loops under bars / Hook: producer melody IS the hook / Outro: ad-lib voices build over the loop'},
    outliers:[
      {song:'"Lose Yourself" — Eminem',rule:'Rock guitar riff + power ballad structure, no traditional hip-hop drums or samples',result:'Won Oscar for Best Original Song — first rap song ever to receive it'},
      {song:'"HUMBLE." — Kendrick Lamar',rule:'Sparse production with minimal hook variation and zero ad-libs — stripped everything rap conventionally adds',result:'#1 hit that broke streaming records and defined minimalist prestige rap'},
      {song:'"Sicko Mode" — Travis Scott',rule:'Three completely different beat sections mid-song with no warning — breaks the single-groove golden rule',result:'#1 hit that became a cultural moment and turned the "beat switch" into an art form'}
    ],
    vocables:{sounds:'(yeah) (uh) (let\'s go) (ayy)',when:'ad-lib on every 2nd bar, outro crowd chant',suno_tag:'[Outro - crowd chant]',borrowed_from:'gospel affirmation secularized',notes:'Parentheses syntax critical — Suno renders these as background voices'}
  },
  ss:{dna:'Voice, acoustic guitar, emotional truth, first-person narrative, autobiographical imagery. The song is the diary entry.',structure:'Most flexible genre. Verse-only (no chorus), VCVCBC, or through-composed. The STORY determines structure — not a template.',suno:'"fingerpicked acoustic guitar, intimate close-mic vocals, warm room reverb, no drums" for stripped. Add "brushed snare, upright bass" for fuller feel.',keys:['Every line must earn its place — no filler','Specificity creates universality — house numbers, dog names, street names','Second verse must deepen emotionally, not repeat the first','Guitar tuning is a character — mention DADGAD or open G in style'],artists:'Tracy Chapman · Joni Mitchell · Elliott Smith · Bon Iver · Phoebe Bridgers · Paul Simon · Brandi Carlile',counter:{device:'Guitar fingerpicking pattern / second acoustic voice',does:'The fingerpicked guitar part weaves a melodic answer around the vocal — in the gaps between sung phrases, the guitar fills with its own melody, creating a dialogue between voice and instrument. On bigger arrangements, a cello or second acoustic plays a counter-line underneath.',howto:'fingerpicked counter-melody, guitar fills between vocal phrases, cello counter-line',map:'Verse: guitar fills the phrase gaps / Chorus: both voices lock together / Bridge: guitar takes melodic lead while vocal strips back'},outliers:[{song:'"Fast Car" — Tracy Chapman',rule:'One repeating guitar loop with almost no chord changes for 4:59 — broke the variation mandate',result:'Grammy winner and a standard — proved a single hypnotic groove can hold emotional truth forever'},{song:'"Hallelujah" — Leonard Cohen',rule:'No traditional chorus — just verse variations all landing on one repeated word',result:'Most covered song of the 20th century, proves a single emotional truth repeated is more powerful than a hook'},{song:'"Skinny Love" — Bon Iver',rule:'Recorded in a Wisconsin cabin — lo-fi, falsetto, deliberately thin sound against the polished SS tradition',result:'Created an entire aesthetic movement and proved raw emotional honesty beats studio craft every time'}],vocables:{sounds:'mmm, la-la-la, oh',when:'bridge hum before final chorus, quiet outro',suno_tag:'[Outro - hummed melody]',borrowed_from:'folk tradition',notes:'Keep minimal — one vocable moment per song max, intimacy over crowd energy'}},
  altrock:{dna:'Indie ethos + rock power + outsider perspective. Distortion as emotional language. Quiet-loud dynamic is the core structural move.',structure:'VPCVC with massive dynamic variance. Quiet verse (clean guitar, restrained vocal) → explosive chorus (distortion, full drums, pushed vocal).',suno:'Sub-genre specific: "shoegaze, wall of sound" vs "post-punk, angular guitars, Joy Division atmosphere" vs "indie rock, jangly clean guitars".',keys:['Chorus must be earned — verse tension must build to a real release','Distortion is an emotion — use it purposefully','Alt-rock lyrics embrace ambiguity — specific images, opaque meaning','Bridge should recontextualize the chorus, not just repeat it'],artists:'Radiohead · Pixies · Pavement · Modest Mouse · The National · Interpol · Arctic Monkeys · Mitski',counter:{device:'Second guitar counter-riff / bass counter-melody',does:'A second guitar plays a melodic counter-riff against the lead guitar — often a clean line against distortion, or a high-register phrase against a low rhythm part. The bass frequently breaks from the root and plays a counter-melodic line in post-chorus sections, carrying the emotional weight while the guitars settle.',howto:'second guitar counter-riff, bass counter-melody, lead guitar answer phrase',map:'Verse: bass counter-melody under clean guitar / Pre-chorus: second guitar tension / Chorus: bass breaks from root / Bridge: guitar leads melodically'},outliers:[{song:'"Creep" — Radiohead',rule:'Band hated it, considered it derivative and buried it as B-side — the opposite of a deliberate release',result:'Became their signature song and #1 in every market, proof that accidental vulnerability beats calculated cool'},{song:'"Mr. Brightside" — The Killers',rule:'No real dynamic contrast or bridge — same relentless energy the entire song with no release',result:'Never left the UK charts for 16 consecutive years, proving sustained tension can replace tension-release cycles'},{song:'"Smells Like Teen Spirit" — Nirvana',rule:'Deliberately murky production against the polished hair-metal production standard of the era',result:'Killed the dominant genre overnight and reset the entire decade — the anti-production became the new production'}],vocables:{sounds:'woah, hey-hey, oh',when:'pre-chorus lift, post-chorus crowd release',suno_tag:'[Crowd chant]',borrowed_from:'blues rock tradition',notes:'Must feel earned — build verse tension first or the woah lands flat'}},
  reggae:{dna:'Offbeat skank (guitar chop on beats 2&4), one-drop drum (kick on beat 3), bass as melody, spiritual/political consciousness, community and resistance.',structure:'Long meditative verses. Chorus is comforting mantra, not explosive hook. Outro vamps are essential — let the groove breathe and fade slowly.',suno:'"reggae, one-drop rhythm, offbeat skank guitar, melodic bass, roots reggae" for classic. "Dancehall, digital riddim, 90 BPM" for modern.',keys:['Bass is the lead instrument — it carries melody','Chorus is resolution, not climax — reggae builds peace not tension','Outro vamp is non-negotiable','Add [dub break] in Suno for echo/reverb instrumental section'],artists:'Bob Marley · Peter Tosh · Burning Spear · Jimmy Cliff · Toots · Damian Marley · Chronixx',counter:{device:'Rhythm guitar offbeat skank / melodica / horn fills',does:'The rhythm guitar chop on beats 2 and 4 creates a persistent rhythmic counter-melody against the bass — together they form a locked two-voice counterpoint that IS reggae\'s groove. Melodica or horns fill the spaces between vocal phrases with melodic responses.',howto:'offbeat rhythm guitar skank, melodica fills, horn response phrases',map:'Throughout: guitar skank creates rhythmic counter / Verse gaps: melodica or horn fills / Dub break: bass and guitar in pure counterpoint'},outliers:[{song:'"Informer" — Snow',rule:'White Canadian rapper doing reggae-influenced pop in 1992 — the genre\'s cultural gatekeeping was absolute',result:'#1 for 7 consecutive weeks, proved the groove transcends the performer\'s cultural origin'},{song:'"Electric Avenue" — Eddy Grant',rule:'Full electronic synthesizer production in a roots reggae context before that fusion had any precedent',result:'Top 5 globally, proved reggae\'s rhythmic soul survived the digital production shift'},{song:'"Kingston Town" — UB40',rule:'British white band doing Jamaican roots reggae with pop crossover production — double cultural leap',result:'Massive worldwide success for decades, proved authentic reverence for a genre trumps birthright'}],vocables:{sounds:'yeah, jah, one love, irie',when:'outro vamp (non-negotiable), call-response in chorus',suno_tag:'[Outro vamp]',borrowed_from:'gospel and African call-response',notes:'Outro vamp with vocable chant is structurally required in roots reggae'}},
  afrobeats:{dna:'Polyrhythmic percussion, talking drum, high-life guitar, pidgin English/Yoruba, call-response, joy as spiritual practice.',structure:'Hook-driven but loose. Hook repeats 4-6 times. Verses are conversational and ad-libbed in feel.',suno:'"afrobeats, talking drum, shekere, highlife guitar, Lagos pop" for Nigerian. "Amapiano, log drum, piano, South African" for SA. BPM 95-105.',keys:['Hook must be melodically simple but rhythmically interesting','Call-response between lead and backing vocal is structural','The groove should make you move before you process the words'],artists:'Wizkid · Burna Boy · Davido · Tems · CKay · Rema · Ayra Starr · Femi Kuti',counter:{device:'Guitar ostinato / highlife guitar counter-line',does:'The highlife-style guitar plays a repeating melodic ostinato — a short looping phrase — that weaves around the vocal hook. This is the defining counter-melody of Afrobeats: the guitar "sings" its own melodic thread simultaneously with the vocal, creating the characteristic layered groove.',howto:'highlife guitar ostinato, melodic guitar counter-line, guitar riff loop',map:'Throughout all sections: guitar ostinato never stops / Hook: guitar counter-line peaks / Verse: guitar is subtle beneath vocal / Outro: guitar leads the fade'},outliers:[{song:'"One Dance" — Drake',rule:'Canadian rapper crossing fully into Afrobeats without Yoruba roots or prior genre credibility',result:'Broke global streaming records and introduced Afrobeats to audiences who had never heard it'},{song:'"Ye" — Burna Boy',rule:'Vulnerable emotional confession in a genre defined by celebration, energy, and communal joy',result:'Became his international breakthrough, proved vulnerability was the missing ingredient in Afrobeats\' global crossover'},{song:'"Essence" — Wizkid ft. Tems',rule:'Minimal spacious production with a barely-there hook — against the dense polyrhythmic tradition',result:'One of the biggest Afrobeats crossover hits ever, showed the genre\'s power multiplied through restraint'}],vocables:{sounds:'eh, aye, ehn, oh-oh',when:'hook repeat, outro fade, between call-response lines',suno_tag:'[Call and response]',borrowed_from:'Yoruba oral tradition, highlife',notes:'Vocable is rhythmic not melodic — it accents the groove, not the emotion'}},
  blues:{dna:'12-bar AAB lyric form, call-response between voice and guitar, 3 chords (I-IV-V), emotional honesty above all production.',structure:'12-bar progression is the container. AAB: line stated, repeated, then resolved/twisted. Guitar solos ARE verses.',suno:'"Chicago blues, electric guitar, shuffle rhythm, walking bass, harmonica" vs "Delta blues, acoustic slide guitar" vs "Texas blues, electric shuffle".',keys:['AAB form forces economy — every line must be justified','Guitar answers the vocal — it is a conversation','Blues is about transformation not just suffering — resolution matters','Specify shuffle rhythm feel in song production'],artists:'Robert Johnson · Muddy Waters · B.B. King · Howlin Wolf · SRV · John Lee Hooker · Etta James',counter:{device:'Guitar talks back to the vocal (call-and-response)',does:'After every sung phrase, the guitar "answers" with its own melodic response — this call-and-response IS the cornerstone of blues. The guitar is not accompaniment; it is the second voice in a conversation. In slow blues this response is a bending note or lick. In uptempo blues it is a quick turnaround phrase.',howto:'guitar call and response, guitar answers vocal, blues guitar lick fills',map:'Every verse: vocal line then guitar response / Turnaround: guitar leads into next section / Solo sections: guitar takes full melodic lead'},outliers:[{song:'"Seven Nation Army" — White Stripes',rule:'No bass guitar at all — octave pedal on guitar faking bass, just two people with no traditional blues band',result:'Most recognized rock riff of the 21st century, became a global sports chant, proved constraint creates monuments'},{song:'"The Thrill Is Gone" — B.B. King',rule:'Added orchestral strings to raw Chicago blues — blues purists were furious at the pop production',result:'Won Grammy for Best R&B Performance, broke BB King into mainstream audiences who never heard traditional blues'},{song:'"Crossroads" — Cream (Robert Johnson cover)',rule:'3-minute blues standard stretched to 4:13 with a rock guitar solo that had nothing to do with blues tradition',result:'Became one of rock\'s defining moments and introduced Robert Johnson to millions who had never heard the original'}],vocables:{sounds:'oh, lord, mmm, well',when:'between AAB lines as guitar-answering voice, slow blues outro',suno_tag:'[Blues call response]',borrowed_from:'field hollers, work songs',notes:'Vocable fills the silence after the guitar answers — the third voice in the conversation'}},
  kpop:{
    dna:'Precise vocal production, multi-member group dynamics, mandatory pre-chorus tension builder, rap break in most songs, choreography-driven structure (8-count phrasing), key change before final chorus, visual concept driving lyric themes. The most engineered pop format in existence.',
    structure:'Intro → Verse 1 → Pre-Chorus (essential) → Chorus → Verse 2 → Pre-Chorus → Chorus → Rap Break / Bridge → Key Change → Final Chorus (bigger) → Outro. Every section has a job and a predetermined energy level.',
    suno:'"K-pop, synth pop, 808 bass, punchy drums, bright synths, polished production, 120-130 BPM" for standard. "K-pop ballad, piano, strings, emotional, 80 BPM" for ballad. "K-pop dance pop, electronic, hi-hats, energetic" for club-ready.',
    keys:['Pre-chorus is non-negotiable — it is what makes K-pop K-pop. Build tension before every chorus','Rap break must contrast completely with the vocal sections — different flow, different energy','Final chorus MUST be a key change (usually +1 or +2 semitones) — the listener expects it','8-bar phrasing throughout — K-pop is built for choreography, count your bars','Verse lyrics can be abstract/visual — the feeling matters more than literal meaning','Specify "K-pop" first in your style prompt — it is the strongest genre signal for AI platforms'],
    artists:'BTS · BLACKPINK · aespa · NewJeans · TWICE · EXO · IU · Stray Kids · SEVENTEEN · LE SSERAFIM',
    counter:{device:'Rap break rhythmic counter / synth post-chorus line',does:'The rap break section creates a complete rhythmic counterpoint to the melodic hook — different flow, different register, different texture. After the final chorus, a synth or string line plays a counter-melody during the outro that re-harmonizes the hook, giving it new emotional meaning.',howto:'rap break rhythmic contrast, post-chorus synth counter-melody, string answer phrase',map:'Verse: synth arpeggiation counter / Pre-chorus: tension builds, no counter / Rap break: rhythm IS the counter / Post-chorus: synth or string counter-line peaks'},
    outliers:[
      {song:'"Gangnam Style" — PSY',rule:'Solo older male comedian — broke every group-dynamic and youth-idol formula K-pop required',result:'First YouTube video to reach 1 billion views, launched K-pop globally'},
      {song:'"Dynamite" — BTS',rule:'Entirely English lyrics with no Korean, no traditional rap break — broke the genre\'s identity code',result:'#1 in the US, broke global streaming records overnight'},
      {song:'"Attention" — NewJeans',rule:'Retro 2000s R&B with no elaborate pre-chorus or key change — stripped K-pop\'s signature engineering',result:'Redefined the genre toward minimal cool, launched K-pop\'s "anti-idol" era'}
    ],
    vocables:{sounds:'ooh, ah, yeah, na-na',when:'post-chorus (always), outro sweetener, rap break contrast',suno_tag:'[Post-chorus ad-lib]',borrowed_from:'R&B and pop traditions, engineered',notes:'K-pop vocables are precision-engineered — placed at exact bar positions, not improvised'}
  },
  latin:{
    dna:'Rhythmic diversity (salsa, cumbia, bachata, bossa), emotional romanticism, bilingual/Spanish lyrics, family and community themes, dance-floor energy. Many sub-genres under one umbrella.',
    structure:'Varies by sub-genre. Salsa: verse-chorus with horn breaks. Bachata: romantic verse-chorus. Reggaeton/Latin pop: hook-heavy, dembow or Latin rhythm underpins everything.',
    suno:'"Latin pop, acoustic guitar, percussion, romantic, 100 BPM" for pop crossover. "salsa, brass section, piano, congas, 180 BPM" for salsa. "bachata, guitar, romantic vocals, 130 BPM" for bachata.',
    keys:['Rhythm IS the genre — specify the exact dance rhythm in your prompt','Bilingual lyrics (Spanish + English) dramatically increase global reach','Percussion instruments are not optional — they ARE the genre','Romantic/family themes are universal — lean in not away'],
    artists:'Shakira · Marc Anthony · Romeo Santos · Celia Cruz · Juan Luis Guerra · Selena · J Balvin · Bad Bunny',
    counter:{device:'Piano montuno / horn section stabs',does:'The piano montuno — a repeating right-hand rhythmic-melodic figure locked to the clave — creates the defining counter-melody in salsa and Latin jazz. Against the vocal melody, the montuno never stops, providing both harmonic and melodic contrast. Horn section stabs punctuate between vocal phrases as sharp counter-accents.',howto:'piano montuno pattern, horn stab counter-accents, clave rhythmic counter',map:'Throughout: montuno runs under everything / Verse: subtle montuno / Chorus: horns stab between phrases / Brass break: full counter-melody takes over'},
    outliers:[
      {song:'"Despacito" — Luis Fonsi ft. Daddy Yankee',rule:'Slow romantic ballad-reggaeton hybrid that blurred every Latin sub-genre boundary',result:'Broke YouTube streaming records globally, introduced Latin music to audiences worldwide'},
      {song:'"La Bamba" — Ritchie Valens',rule:'Mexican folk song with rock\'n\'roll production and no Spanish-language pop precedent',result:'First rock en español to chart in the US, opened the genre boundary forever'},
      {song:'"Macarena" — Los del Rio',rule:'Minimal repetitive structure with no narrative — just a hook and a dance instruction',result:'Became a global phenomenon, proof that simplicity beats sophistication when the groove is right'}
    ],
    vocables:{sounds:'ay, aye, oye, eh',when:'salsa vamp, cumbia chorus response, outro fade',suno_tag:'[Latin vocal call]',borrowed_from:'Afro-Caribbean oral tradition',notes:'Bilingual vocables work best — Spanish affirmations feel authentic, English ones feel pop-crossover'}
  },
  reggaeton:{
    dna:'Dembow rhythm (syncopated kick-snare pattern), 808 bass, bilingual/Spanish lyrics, perreo culture, street credibility, romance and party energy. Production-first genre — the beat IS the identity.',
    structure:'Hook-first or hook-heavy. Short verses (8-12 bars), enormous hook repeated 4-6 times. Outro vamp is essential. Bridges rare — energy never drops for long.',
    suno:'"reggaeton, dembow rhythm, 808 bass, electronic production, 90-95 BPM, trap hi-hats, Spanish lyrics" for classic. "reggaeton romántico, melodic vocals, smooth 808s" for romantic. "trap latino, dark 808s, aggressive flow" for urban.',
    keys:['Dembow pattern is non-negotiable — it IS reggaeton','Spanish lyrics (or Spanglish) dramatically increase authenticity','Hook must be the catchiest thing in the song by a wide margin','Production energy stays high throughout — no quiet moments','Specify "dembow, 90 BPM" in your style prompt for correct rhythm'],
    artists:'Daddy Yankee · J Balvin · Bad Bunny · Ozuna · Karol G · Maluma · Nicky Jam · Rauw Alejandro',
    counter:{device:'Dembow rhythmic counter / producer synth melody',does:'The dembow kick-snare pattern creates a persistent rhythmic counterpoint against the melodic hook — the syncopated "and" hit is the counter-accent that defines reggaeton\'s groove. A producer synth melody or vocal chop often plays a secondary melodic line under the main hook in the perreo section.',howto:'dembow rhythmic counter, synth melody loop, vocal chop counter-line',map:'Throughout: dembow creates rhythmic counter / Hook: producer melody layers under vocal / Perreo section: synth counter-melody emerges / Outro: counter-melody leads fade'},
    outliers:[
      {song:'"Gasolina" — Daddy Yankee',rule:'Crude unpolished production and explicit content with no romantic veneer — against genre\'s romantic tradition',result:'Launched reggaeton globally, proved the rawer the better when the dembow is undeniable'},
      {song:'"Tití Me Preguntó" — Bad Bunny',rule:'Ironic self-deprecating comedy in a genre known for machismo and seriousness',result:'One of 2022\'s biggest global hits, showed reggaeton could be funny and still dominate'},
      {song:'"Con Calma" — Daddy Yankee ft. Snow',rule:'Recycled Snow\'s 1992 "Informer" hook — broke the originality-first production rule with nostalgia',result:'Topped charts globally, proved strategic nostalgia beats chasing current trends'}
    ],
    vocables:{sounds:'aye, eh, yo, dale',when:'perreo section hook, outro vamp, dembow accent',suno_tag:'[Perreo chant]',borrowed_from:'dancehall, Jamaican patois',notes:'"Dale" (Daddy Yankee signature) is the genre-defining vocable — signals authentic reggaeton culture'}
  },
  punk:{dna:'3 chords, max 3 minutes, political or personal fury, anti-production aesthetic, speed as ideology, DIY ethic.',structure:'Fast VCVCBC or just VCV. No solos usually. Verse = setup. Chorus = explosion. Speed to end is valid.',suno:'"punk rock, distorted guitar, fast drums, raw production, 180 BPM, aggressive vocals" for classic. "Post-punk, angular guitar, bass-forward, 140 BPM" for post-punk.',keys:['Every second wasted is ideologically wrong — cut everything that does not serve the fury','Chorus should be a slogan — 4-8 words, shoutable','Production should sound slightly wrong — too loud, slightly clipping','Personal fury is timeless; political specificity ages'],artists:'Sex Pistols · The Clash · Ramones · Dead Kennedys · Black Flag · Wire · Bikini Kill · Green Day',counter:{device:'Bass counter-melody (only when intentional)',does:'No counter-melody IS the aesthetic statement — punk\'s refusal of ornamentation is ideological. However, the bass can and should diverge from the guitar root occasionally — especially in post-punk (Wire, The Clash) where the bass plays a melodic counter-line that gives the song its intelligence.',howto:'bass counter-melody, post-punk bass independence, melodic bass line',map:'Chorus: bass locks with guitar (no counter — pure power) / Verse: bass may diverge melodically / Bridge: bass can take counter-melodic lead briefly'},outliers:[{song:'"London Calling" — The Clash',rule:'Ska + reggae + rockabilly + jazz within a punk framework — broke the 3-chord 3-minute speed ideology',result:'Named greatest punk album ever despite violating every punk rule, proved punk is an attitude not a template'},{song:'"Good Riddance (Time of Your Life)" — Green Day',rule:'Acoustic guitar ballad with no distortion from a band built entirely on distortion and aggression',result:'Became their biggest commercial hit, played at every graduation and funeral — showed vulnerability was the missing note'},{song:'"Ever Fallen in Love" — Buzzcocks',rule:'Romantic love song themes in punk — the genre demanded political fury, not romantic vulnerability',result:'Considered one of the greatest British songs ever recorded, proved punk could contain the full range of human emotion'}],vocables:{sounds:'hey, oi, yeah, go',when:'chorus shout, outro collective chant',suno_tag:'[Crowd shout]',borrowed_from:'football terrace chant, rock',notes:'Must sound collective — punk vocables are ideological, they erase the individual voice'}},
  parody:{
    dna:'Comedy through musical weaponization. A parody rewrites a recognizable song with absurdist/satirical/comedic lyrics while keeping the melody and structure intact. The humor lives in the gap between the serious original form and the ridiculous subject matter. Commitment to the bit is everything — play it completely straight musically. Specificity is the engine of comedy: "a cat who knocks glasses off tables" beats "a mischievous cat" every time.',
    structure:'Mirror the original song structure exactly — same verse lengths, same chorus, same bridge placement. The comedic contrast between the production seriousness and the lyrical absurdity IS the joke. Use the original song\'s exact section count. Never break the parody frame mid-song.',
    suno:'Match the original song\'s production style exactly. If parodying a power ballad: "dramatic piano, soaring strings, stadium rock, emotional vocal". If parodying trap: "trap beat, 808 bass, auto-tune". The music should sound serious — the comedy is entirely lyrical.',
    keys:[
      'The setup rule: establish the absurd premise clearly in the first 4 lines of verse 1 — never bury the joke',
      'Callback structure: introduce a specific image in verse 1, callback and escalate it in verse 2, payoff in the bridge',
      'Chorus is the punchline delivery system — it must be immediately singable AND the funniest part',
      'Commitment rule: never wink at the camera. Play every line completely straight. The music is always sincere',
      'Rule of threes in comedy: setup, setup, subvert. Two expected things then one unexpected. Works at line level too',
      'Specificity is the engine: "I ate seventeen hot pockets" > "I ate a lot of food". Proper nouns, numbers, brand names'
    ],
    artists:'Weird Al Yankovic · Flight of the Conchords · Lonely Island · Bo Burnham · "Weird Al" · Garfunkel & Oates · Tim Minchin',
    counter:{device:'Mock-serious orchestral counter / ironic instrument response',does:'The counter-melody in parody is deployed for comedic effect: a soaring string line under a lyric about laundry; a triumphant brass response after a trivial punchline. The instrument\'s emotional seriousness vs. the lyric\'s absurdity IS the joke. The counter-melody should be more emotionally committed than the song deserves.',howto:'ironic orchestral counter-melody, serious instrumental response, mock-epic strings',map:'Chorus: most elaborate counter to heighten the absurdity / Bridge: counter-melody at its most earnest under the most ridiculous lyric / Verse: subtle counter as setup'},
    outliers:[
      {song:'"White & Nerdy" — Weird Al Yankovic',rule:'Parody charted higher (#9) than the Chamillionaire original it mocked — the copy beat the source',result:'Proved parody could outperform originals when the execution is sharper than the source material'},
      {song:'"Eat It" — Weird Al Yankovic',rule:'MJ gave permission to parody "Beat It" — commercial competitor territory no one had dared enter',result:'Went platinum, became bigger than many of the originals it mocked, normalized the parody genre'},
      {song:'"Dick in a Box" — Lonely Island ft. Justin Timberlake',rule:'SNL digital short treated with complete sincerity as an R&B song with no wink at the camera',result:'Grammy-nominated, charted on Billboard Hot 100 — proved commitment makes comedy transcend its context'}
    ],
    vocables:{sounds:'(matching the original song\'s vocables)',when:'mirror the original\'s vocable placement for comedic contrast',suno_tag:'match the original',borrowed_from:'whatever song is being parodied',notes:'Rewrite the vocable with an absurd alternative for maximum comedy — "na na na" → "no no no (I forgot)"'}
  },
  comedy:{
    dna:'Original comedic songs — not parody rewrites but purpose-built funny songs. Musical comedy weaponizes genre conventions for laughs: the earnest folk song about mundane frustration, the over-produced ballad about pizza, the gangster rap about doing taxes. Structure serves the joke. The genre itself is the straight man. Comedy comes from subverting expectations, from specificity, from escalation.',
    structure:'Three-act joke structure mapped to verse/chorus/bridge. Verse 1: establish the premise. Verse 2: complications and escalation. Bridge: the twist or darkest point. Final chorus: subverted to reflect the journey. Always end on the biggest laugh.',
    suno:'Intentional genre mismatch amplifies comedy. Use "epic orchestral, dramatic, soaring" for a song about grocery shopping. Use "soft folk ballad, acoustic, intimate" for absurd dark content. The production sincerity is the straight man to the comedy. Specify genre that contrasts the subject.',
    keys:[
      'The comedy premise must be stated or implied in the title and first verse — do not bury the setup',
      'Escalation rule: each verse should raise the stakes of the absurdity. Verse 1 is silly, Verse 2 is committed, Bridge is unhinged',
      'Musical genre should be played completely straight — the comedy is lyrical, not musical',
      'End on the biggest laugh — the final line of the song is the punchline, always',
      'Puns and wordplay: use sparingly — one great pun per song, not wall-to-wall. Subverted clichés hit harder than straight puns',
      'The bridge is the darkest/most absurd escalation — then the final chorus lands with the full weight of the joke'
    ],
    artists:'Bo Burnham · Flight of the Conchords · Lonely Island · "Weird Al" Yankovic · Tim Minchin · Garfunkel & Oates · Stephen Lynch · Tenacious D',
    counter:{device:'Genre-contrast instrument / comedy response voice',does:'The counter-melody carries the punchline in comedy music. The instrument chosen to respond to the vocal creates the comedic contrast — a tuba playing a pompous counter-line after a self-deprecating lyric, or a music-box response after a dark admission. The counter-melody is the straight man.',howto:'comedic instrument counter-response, genre-contrast counter-melody, comic timing instrument fill',map:'End of each verse: instrument responds to the lyric comedically / Chorus: counter-melody amplifies the absurdity / Bridge: counter-melody has its most unhinged moment'},
    outliers:[
      {song:'"I\'m on a Boat" — Lonely Island ft. T-Pain',rule:'Comedy rap performed completely straight with Auto-Tune earnestness, no jokes acknowledged',result:'Charted Top 40, Grammy-nominated — the genre sincerity made the comedy hit harder'},
      {song:'"Always Look on the Bright Side of Life" — Monty Python',rule:'Cheerful ukulele pop in a death scene, total tonal mismatch between music and context',result:'Became UK\'s most-requested funeral song — comedy so committed it became genuinely comforting'},
      {song:'"We Didn\'t Start the Fire" — Billy Joel',rule:'Song is a list of historical events with no narrative arc — broke every storytelling rule',result:'#1 hit globally, proved a hook and momentum can replace conventional lyric structure entirely'}
    ],
    vocables:{sounds:'varies — chosen for comedic contrast with genre',when:'punchline landing pad, verse-end comedic beat',suno_tag:'context-dependent',borrowed_from:'musical theater tradition',notes:'The vocable itself can be the joke — a heartfelt "ooh" after a ridiculous confession hits hard'}
  },
  tvmusical:{
    dna:'Music written for narrative context: TV themes, film scores, Broadway/musical theater, video game OSTs, jingles. Every song has a DRAMATIC FUNCTION — it advances plot, reveals character, creates atmosphere, or sells a product. The lyric is always in service of something beyond itself. Musical theater in particular: characters sing what they cannot say in dialogue — the song is the emotional eruption.',
    structure:'Musical theater: AABA, VCVCBC, or through-composed based on dramatic need. TV theme: 30-90 seconds, premise statement in verse, identity hook in chorus. Jingle: 15-60 seconds, product name in hook 3+ times, problem/solution structure. Film score: follows visual rhythm, no fixed structure.',
    suno:'TV theme: "catchy, memorable, [genre of show] theme song, 90s sitcom" or "dramatic TV theme, orchestral, HBO prestige". Musical theater: "Broadway musical, theatrical vocals, show tune, orchestral pit band". Jingle: "upbeat jingle, major key, catchy, commercial, [brand feeling]". Always specify the exact use case.',
    keys:[
      'TV theme rule: the audience must know what kind of show this is within 5 seconds — genre, tone, era, class',
      'Musical theater: the song must start where spoken dialogue left off emotionally — it is the overflow of feeling',
      'Character voice: every musical theater song must sound like IT COULD ONLY be sung by this character in this moment',
      'Jingle: product name minimum 3 times. Problem in verse, solution/product in chorus. Benefit not feature',
      'The "I want" song (musical theater): character states their deepest desire in the bridge — this is the emotional core',
      'Reprise strategy: the same melody with changed lyrics at the end of Act 2 hits harder than any new song'
    ],
    artists:'Stephen Sondheim · Lin-Manuel Miranda · Andrew Lloyd Webber · Jerry Herman · Joss Whedon · Mark Shaiman · Alan Menken · John Williams · Ennio Morricone',
    counter:{device:'Orchestra underscore / leitmotif counter-line',does:'Musical theater\'s counter-melody is the orchestral underscore — the pit orchestra plays a thematic counter-line beneath the vocal that either supports or dramatically contradicts the lyric (ironic underscore). Leitmotifs return as counter-melodies: a character\'s theme plays under another character\'s song, creating dramatic subtext.',howto:'orchestral underscore counter-melody, leitmotif counter-line, dramatic ironic underscore',map:'Verse: orchestra plays supportive counter-melody / Chorus: full pit counter-melody peaks / Key scenes: ironic underscore contradicts lyric for dramatic effect / Reprise: original melody returns as counter under new lyric'},
    outliers:[
      {song:'"Hamilton" — Lin-Manuel Miranda',rule:'Hip-hop and rap used to tell a story about the Founding Fathers — zero Broadway precedent',result:'Pulitzer Prize winner, cultural phenomenon, reshaped what musicals are allowed to be'},
      {song:'"Once More with Feeling" — Joss Whedon (Buffy the Vampire Slayer)',rule:'TV drama characters forced to sing against their will as a horror plot device — medium-breaking',result:'Emmy-nominated episode, cult classic, proved TV could execute full musical theater without a stage'},
      {song:'"Circle of Life" — Elton John / Hans Zimmer (The Lion King)',rule:'Pop rock anthem structure in an animated children\'s film opening with no dialogue or setup',result:'One of the most recognized film songs ever, launched Elton John\'s animation/film scoring career'}
    ],
    vocables:{sounds:'la-la-la, da-da-da, hmm',when:'theme song hook, character leitmotif, jingle repeat',suno_tag:'[Theme vocal hook]',borrowed_from:'musical theater, vaudeville',notes:'TV theme vocables must be instantly memorable — they become identity markers for the show'}
  },
  neosoul:{
    dna:'D\'Angelo, Erykah Badu, Lauryn Hill, Bilal, Maxwell — the collision of classic soul (raw emotion, live instrumentation, vulnerability) and hip-hop production aesthetics (head-nodding groove, layered samples, lo-fi warmth). Neo-soul is anti-formula: it breathes, it drags beats deliberately, it leaves space. Vocals are instruments — improvised runs, ad-libs that ARE the lyric. Production feels human and imperfect on purpose.',
    structure:'Loose and groove-led. Hook is not always the loudest moment — sometimes the vocal vamp in the outro IS the song. Intros are often long instrumental grooves before the vocal enters (8-16 bars). Bridges frequently go to a half-time feel. Songs end on extended vamps, not hard stops.',
    suno:'"neo-soul, Rhodes piano, Fender bass, warm vinyl warmth, head-nod groove, live drums with swing, 85-95 BPM" for classic. "neo-soul, 90s hip-hop drums, soul vocals, Dilla-style off-beat, warm, soulful" for hip-hop adjacent. "neo-soul ballad, piano, strings, intimate, vulnerability" for slow. Always specify "live feel, swing" — not quantized.',
    keys:[
      'Groove before hook: the beat must make the listener nod before the vocal arrives. Never rush the entrance',
      'Imperfection is the aesthetic: slightly late snares (J Dilla feel), crackle, room sound, breath in the mic',
      'Vocal ad-libs are not decoration — they are parallel lyrics that carry equal emotional weight to the main line',
      'Leave space: the rests ARE the music. Silence between phrases creates tension more powerful than constant vocal',
      'The outro vamp escalates emotionally — it should be the most cathartic part of the song, not a fade-out afterthought',
      'Lyrics avoid cliché with surgical specificity: sensory detail, time-stamped moments, names of places and things'
    ],
    artists:'D\'Angelo · Erykah Badu · Lauryn Hill · Maxwell · Bilal · India.Arie · Musiq Soulchild · Common · Jill Scott · Frank Ocean · H.E.R. · SZA',
    counter:{device:'Rhodes/keyboard ostinato vs. lead vocal',does:'The keyboard or Rhodes piano plays a continuous repeating melodic-rhythmic figure — an ostinato — that is the counter-melody Neo-Soul is built on. D\'Angelo\'s Voodoo is the reference: the Rhodes "talks" alongside the vocal rather than underneath it. The bass walks against both. Three voices in constant melodic conversation: lead vocal, keyboard ostinato, melodic bass.',howto:'Rhodes piano ostinato, keyboard counter-melody, melodic bass walks against vocal',map:'Throughout: Rhodes ostinato never stops / Intro: keyboard establishes counter before vocal enters / Verse: three-voice counterpoint / Outro vamp: keyboard and vocal improvise against each other freely'},
    outliers:[
      {song:'"Redbone" — Childish Gambino',rule:'Slowed 70s funk tempo so extreme (95 BPM) it felt disorienting — modern listeners said it was "weird"',result:'#1 R&B hit, became Donald Glover\'s signature song and sparked a retro neo-soul revival'},
      {song:'"Location" — Khalid',rule:'Stripped minimalism and teenage perspective with barely any arrangement in a genre known for lush production',result:'Multi-platinum debut that launched his career and proved emotional truth beats sonic complexity'},
      {song:'"Didn\'t Cha Know" — Erykah Badu',rule:'Deliberate off-tempo dragging beats (J Dilla feel) that sounded "late" to producers trained in precision',result:'Defined neo-soul\'s aesthetic of intentional imperfection and influenced a generation of producers'}
    ],
    vocables:{sounds:'ooh, ah, mmm, baby, yeah',when:'bridge build, post-chorus run, outro melisma',suno_tag:'[Ad-lib vocal runs]',borrowed_from:'soul, gospel, jazz scatting',notes:'Neo-soul vocables are the most technically demanding — they signal the vocalist\'s range and emotional depth'}
  },
  gospel:{
    dna:'Music as spiritual encounter — not performance but worship, testimony, and collective catharsis. Call-and-response at its DNA core: leader calls, congregation answers. The song builds to a moment of release (the "shout") where emotion overflows technique. Three traditions: Traditional Gospel (Thomas Dorsey, Mahalia Jackson — piano, choir, testimony), Contemporary Gospel (Kirk Franklin — pop production, hip-hop rhythms, mass choir), Worship/CCM (Chris Tomlin, Hillsong — arena rock, CCLI, corporate worship). Each has distinct rules.',
    structure:'Gospel resists fixed structure because it serves the Spirit — the song goes where the moment leads. Typically: Verse (testimony/setup) → Pre-Chorus (tension building) → Chorus (declaration) → Bridge (the highest emotional point — often repeated 4-8x as the choir vamps) → Outro Vamp (where the real church happens — this section can last minutes). Never cut the outro vamp short.',
    suno:'"traditional gospel, Hammond B3 organ, choir, piano, hand claps, call and response, soul" for classic. "contemporary gospel, Kirk Franklin style, hip-hop beat, mass choir, full production, celebratory" for modern. "worship ballad, piano, strings, intimate, congregational, 75 BPM" for CCM/worship. "southern gospel, acoustic, quartet, harmonies" for country gospel.',
    keys:[
      'Call-and-response is structural, not decorative — write the congregation\'s response line as carefully as the lead',
      'The bridge is the climax, not the chorus — in gospel the bridge is repeated and escalated until the room breaks open',
      'Testimony structure: I WAS lost/broken/struggling → God moved/intervened → NOW I am free/healed/changed. The arc is transformation',
      'Dynamics are everything: whisper the verse, speak the pre-chorus, DECLARE the chorus, SHOUT the bridge',
      'The vamp outro MUST be written — this is where 80% of the emotional impact lives. Write 4-8 lines to cycle through',
      'Contemporary gospel: the beat must make you move before the lyric lands. Rhythm serves spirit, spirit serves rhythm'
    ],
    artists:'Mahalia Jackson · Thomas Dorsey · Andraé Crouch · Kirk Franklin · Yolanda Adams · Donnie McClurkin · BeBe & CeCe Winans · Fred Hammond · Tye Tribbett · Maverick City Music · Hillsong · Chris Tomlin',
    counter:{device:'Choir response to lead vocal (call-and-response IS the counter-melody)',does:'Gospel\'s counter-melody IS its structure: the choir\'s response to the lead vocal creates a constant back-and-forth that builds to the bridge vamp. The organ plays fills between every phrase. In the bridge, the choir vamp becomes the primary melody while the lead improvises a counter over them — a complete melodic inversion.',howto:'choir call and response, organ fill counter-melody, choir vamp counter',map:'Verse: organ fills between phrases / Chorus: choir responds to every lead line / Bridge: choir vamp IS the main melody, lead sings counter over / Outro vamp: full call-and-response builds'},
    outliers:[
      {song:'"Jesus Walks" — Kanye West',rule:'Trap production and secular rapper context for gospel themes — radio refused to play it initially',result:'Grammy winner and mainstream #1, opened the door for hip-hop gospel crossover permanently'},
      {song:'"Take Me to Church" — Hozier',rule:'Anti-religion anthem that weaponized gospel\'s emotional architecture against institutional church',result:'Multi-platinum worldwide, proved gospel\'s sonic power transcends its theological content'},
      {song:'"Oh Happy Day" — Edwin Hawkins Singers',rule:'Gospel number that crossed over to secular pop charts in 1969 — culturally forbidden at the time',result:'First gospel song to chart secular, sold over a million copies and opened the crossover door'}
    ],
    vocables:{sounds:'hallelujah, oh Lord, amen, yes Lord, glory',when:'call-response throughout, vamp at song close, bridge climax',suno_tag:'[Congregational response]',borrowed_from:'African oral tradition, spirituals',notes:'Gospel vocables are theological — they are not filler, they are declarations. Use with full commitment'}
  },
  children:{
    dna:'Music for ages 2-10 — but great children\'s music (Raffi, They Might Be Giants, "Mister Rogers") works for adults too because it operates on multiple levels simultaneously. Core rules: simple melodies (5-note range ideal), repetition is a feature not a flaw, every listen rewards a child (singability, motion), vocabulary stays accessible without being condescending. Themes: wonder, kindness, the natural world, belonging, imagination, small everyday adventures. The best children\'s songs teach without ever saying "lesson".',
    structure:'Short (90 seconds - 3 minutes). VCVCBC or VCV. Chorus/hook must be singable after ONE listen — maximum 8 words. Verses teach something new each time. Bridge is an adventure or a question. Outro brings safety/resolution. Physical motion cues embedded in lyrics (clap, stomp, spin, jump) make songs interactive.',
    suno:'"children\'s song, ukulele, hand claps, playful, major key, bright, warm, singalong" for classic. "educational children\'s song, upbeat, acoustic guitar, glockenspiel, 110 BPM, joyful" for school. "lullaby, soft, gentle, acoustic, 60 BPM, warm, soothing" for bedtime. "children\'s pop, modern production, fun, energetic, 120 BPM" for contemporary. Always specify age target.',
    keys:[
      'Singability above everything: if a 5-year-old cannot sing it back after 2 listens, simplify the melody or shorten the line',
      'Repetition rule: the chorus should repeat at least 3-4 times. Children learn through repetition — this is the feature, not a flaw',
      'Every verse should answer a child\'s question or describe something they recognize from their world',
      'Physical movement cues: embed "clap," "stomp," "spin," "shake" as lyric actions — make the song a physical experience',
      'Never condescend — wonder and curiosity are adult emotions too. Write UP to children\'s imagination, not DOWN to their vocabulary',
      'Bedtime songs: descending melody, slowing tempo in each verse, safety and love in every image — the child must feel held'
    ],
    artists:'Raffi · They Might Be Giants · Mister Rogers · Elizabeth Mitchell · Laurie Berkner · Disney songwriters (Sherman Brothers, Alan Menken) · Sesame Street · Jack Johnson (Curious George) · Carly Rae Jepsen',
    counter:{device:'Call-and-response echo / simple instrument answer',does:'Children\'s music\'s counter-melody is the echo and response — the simplest and most instinctive musical dialogue. A phrase sung by the lead is echoed or answered by a simple instrument (xylophone, ukulele, hand claps). The child naturally wants to be the "response" voice, making the counter-melody participatory.',howto:'echo response counter-melody, instrument answers vocal, call and response pattern',map:'Throughout: instrument echoes or answers every vocal phrase / Chorus: hand clap or stomp rhythm creates counter / Bridge: call-and-response between "teacher" voice and "students" / Outro: children complete the melodic phrase'},
    outliers:[
      {song:'"Baby Shark" — Pinkfong',rule:'Ultra-minimal 3-note melody with relentless loop structure — technically poor by every craft standard',result:'Most-viewed YouTube video in history (10+ billion views), proved simplicity and repetition are invincible'},
      {song:'"Let It Go" — Idina Menzel (Frozen)',rule:'Operatic adult complexity with a belt-to-falsetto range that children technically cannot replicate',result:'Grammy winner and adult radio hit that transcended its children\'s film — adults bought it for themselves'},
      {song:'"Won\'t You Be My Neighbor?" — Fred Rogers',rule:'Deliberately lo-fi, no production value, no catchy hook by commercial standards',result:'Created the most trusted children\'s TV brand in American history through pure emotional authenticity'}
    ],
    vocables:{sounds:'la-la-la, na-na-na, do-re-mi, hey',when:'chorus singalong, outro repetition, educational hook',suno_tag:'[Children singalong]',borrowed_from:'nursery rhyme tradition, folk',notes:'Children\'s vocables must be maximally simple — one or two syllable, highly repetitive, wide melodic range'}
  },
  pop:{dna:'Hook-driven, verse-chorus structure, universal emotional themes, radio-ready production, broad demographic appeal.',structure:'Intro → Verse → Pre-Chorus → Chorus → Verse 2 → Pre-Chorus → Chorus → Bridge → Final Chorus → Outro. Pre-chorus is the tension builder. Chorus is the payoff.',suno:'"pop, synth, piano, driving beat, polished production, 120 BPM" for mainstream. "dark pop, atmospheric synth, moody, 105 BPM" for alternative pop.',keys:['Hook within 30 seconds is non-negotiable','Chorus must be singable after one listen — max 10 syllables per line','Pre-chorus tension makes the chorus land harder','Bridge must recontextualize the chorus emotionally'],artists:'Taylor Swift · Billie Eilish · Olivia Rodrigo · Harry Styles · Doja Cat · The Weeknd · Ariana Grande · Justin Bieber',counter:{device:'Strings / synth pad counter-line / backing vocal response',does:'Pop\'s counter-melody typically lives in the strings or synth pad that plays a melodic answer to the chorus hook. Backing vocals sing a counter-phrase against the lead in the post-chorus. The guitar arpeggiation in the verse creates a melodic counter beneath the vocal.',howto:'string counter-melody, synth pad answer phrase, backing vocal counter-harmony',map:'Verse: synth arpeggiation under vocal / Chorus: strings play counter-line in gaps / Post-chorus: backing vocals counter the hook / Bridge: counter-melody takes over as lead strips back'},outliers:[{song:'"Bohemian Rhapsody" — Queen',rule:'6 minutes with no repeating chorus, an opera section mid-song — radio refused to play it',result:'Held the record for best-selling UK single for years, proof that commitment to a vision beats every commercial rule'},{song:'"Rolling in the Deep" — Adele',rule:'Minimal production with no dance beat in the peak EDM era when every pop song needed a four-on-the-floor',result:'Most-downloaded song in history at release, proved voice-first minimalism could dominate the maximalist era'},{song:'"Old Town Road" — Lil Nas X',rule:'Country-trap hybrid that Billboard controversially removed from country charts',result:'Longest #1 run in Billboard Hot 100 history at that point, proved genre-blending beats genre loyalty'}],vocables:{sounds:'na-na-na, woah, hey, ooh, yeah',when:'post-chorus (always), outro singalong, pre-chorus lift',suno_tag:'[Outro - singalong]',borrowed_from:'R&B, soul, rock — pop synthesizes all traditions',notes:'Pop vocables are engineered for maximum crowd participation — the goal is for every listener to sing along by the second chorus'}},
  rnb:{dna:'Rhythm and blues: groove, vocal runs, romance and desire, emotional vulnerability, live instrumentation or sampled soul.',structure:'Verse → Hook → Verse → Hook → Bridge → Final Hook. Hook-centric. Verse sets emotional scene. Hook is the declaration. Bridge is the turn or breakdown.',suno:'"R&B, smooth production, vocal runs, electric piano, 90 BPM" for classic. "Contemporary R&B, 808 bass, trap hi-hats, 75 BPM" for modern.',keys:['Ad-libs and runs are a second vocal melody — write them','Groove must feel inevitable — bass and drums locked','Bridge is the emotional vulnerability peak','Specificity in lyrics: name the street, the hour, the feeling precisely'],artists:'Beyoncé · Usher · Alicia Keys · Frank Ocean · SZA · The Weeknd · Daniel Caesar · Giveon · Jhené Aiko',counter:{device:'Keyboard riff / ad-lib vocal counter-voice',does:'R&B\'s counter-melody lives in two places: the keyboard fills that respond between vocal phrases (a riff answering the lead), and the ad-lib vocal layer that creates an organic second melody running alongside the primary line. Together they create the layered warmth that defines R&B production.',howto:'keyboard fill counter-melody, ad-lib vocal counter-voice, electric piano response phrase',map:'Verse: keyboard fills between phrases / Hook: ad-lib vocal creates counter / Bridge: keyboard counter-line peaks / Outro: ad-lib voice overtakes as lead improvises'},outliers:[{song:'"Crazy in Love" — Beyoncé',rule:'Sampled brass stab creating frenetic aggressive energy instead of smooth groove — the opposite of R&B\'s DNA',result:'Defined 2000s R&B and launched Beyoncé\'s solo era, proved aggression and R&B elegance could fuse'},{song:'"No Scrubs" — TLC',rule:'Rejection and refusal anthem in a genre built on romance, desire, and longing',result:'One of the best-selling singles of 1999, changed what R&B women were allowed to say about men'},{song:'"Redbone" — Childish Gambino',rule:'95 BPM slowed to a crawl — so deliberately slow that radio programmers said it was unplayable',result:'#1 on R&B charts, became a cultural touchstone and spawned an entirely new wave of slow-burn R&B production'}],vocables:{sounds:'ooh, ah, yeah, baby, mmm',when:'everywhere — post-chorus, ad-libs throughout, bridge build, outro runs',suno_tag:'[Ad-lib vocal runs]',borrowed_from:'gospel, soul — direct lineage',notes:'R&B has the highest vocable density of any genre — ad-libs are expected throughout, not just at key moments'}},
  edm:{dna:'Drop-driven structure, electronic production, 4-on-the-floor kick, tension/release arc, euphoric peak moments, anonymous subject.',structure:'Intro (build) → Drop → Break → Drop 2 (bigger) → Outro. The build IS the tension. The drop IS the payoff. Everything serves the drop.',suno:'"EDM, synth lead, 4-on-the-floor kick, 128 BPM, festival drop" for festival. "Deep house, bass-driven, warm, 120 BPM" for underground.',keys:['The drop must be worth the build — if the buildup is epic the drop must be devastating','Vocals are usually hooks — minimal lyrics, maximum repetition','Breakdown creates anticipation — strip everything except a single element','Specify BPM — it is the genre\'s most fundamental parameter'],artists:'Calvin Harris · Martin Garrix · Avicii · Deadmau5 · Daft Punk · Skrillex · Disclosure · Flume',counter:{device:'Drop counter-melody synth / bass synth vs. lead',does:'The drop counter-melody is a secondary synth line that plays simultaneously with the main lead synth during the drop — two melodic voices creating counterpoint at peak energy. Below them, the bass synth plays a third counter-melodic line. The arpeggiated lead in the breakdown provides pre-drop counter-melody, building tension.',howto:'drop counter-melody synth, bass synth counter-line, arpeggio build counter',map:'Build: arpeggiated synth creates anticipatory counter-melody / Drop: two synths in counterpoint / Breakdown: stripped to single counter-melody line / Drop 2: both counter-melodies return louder'},outliers:[{song:'"Levels" — Avicii',rule:'Sampled Etta James gospel vocal ("Something\'s Got a Hold on Me") over an electronic rave drop — grandma\'s church music in the club',result:'Became the anthem of a generation, proved emotional vocal authenticity over a drop hits harder than any synth hook'},{song:'"Get Lucky" — Daft Punk ft. Pharrell',rule:'70s disco funk with live instruments only — no synthesizers in the drop in an era of pure digital production',result:'Fastest-selling UK single in history at release, proved live organic groove beats programmed perfection in EDM context'},{song:'"Titanium" — David Guetta ft. Sia',rule:'Lyrical emotional depth and ballad structure in a genre that avoids narrative and favors anonymous subject matter',result:'Multi-platinum global hit that crossover EDM onto pop radio permanently — emotion won over atmosphere'}],vocables:{sounds:'oh, hey, woo, yeah (often sampled/pitched)',when:'drop build, post-drop release, outro loop',suno_tag:'[Drop vocal chant]',borrowed_from:'house music, rave culture, gospel samples',notes:'EDM vocables are often pitched/processed — the human voice as instrument texture rather than singalong trigger'}},
  country:{dna:'Storytelling over everything, authentic emotion, rural/small-town imagery, guitar as emotional anchor, hook grounded in relatable universal truth.',structure:'Verse (story) → Chorus (universal truth) → Verse 2 (story deepens) → Chorus → Bridge (turn/reveal) → Final Chorus. Second verse MUST deepen the story emotionally.',suno:'"country, acoustic guitar, pedal steel, fiddle, 100 BPM, warm" for classic. "country pop, electric guitar, modern production, 120 BPM" for Nashville pop.',keys:['Second verse must be the emotional payoff — not a repeat of verse 1','Chorus is universal truth extracted from specific verse story','Pedal steel and fiddle are genre signals — specify them','Bridge is the revelation — what the narrator finally understands'],artists:'Dolly Parton · Garth Brooks · Johnny Cash · Kacey Musgraves · Chris Stapleton · Zach Bryan · Luke Combs · Carrie Underwood',counter:{device:'Pedal steel answer-line / fiddle counter-melody',does:'Country\'s definitive counter-melody is the pedal steel guitar — it plays an answering melodic phrase between vocal lines that aches with emotional resonance. In bluegrass, the fiddle plays a counter-melody against the vocal simultaneously. Both voices — vocal and pedal steel — are in constant melodic conversation.',howto:'pedal steel guitar answer fills, fiddle counter-melody, steel guitar response line',map:'Verse: pedal steel answers after each vocal phrase / Chorus: steel or fiddle counter-line under the hook / Bridge: pedal steel takes melodic lead while vocal drops / Outro: steel guitar leads the fade'},outliers:[{song:'"Old Town Road" — Lil Nas X',rule:'Trap 808 beat plus banjo — Billboard controversially removed it from country charts for insufficient genre purity',result:'Longest #1 run in Billboard Hot 100 history at the time — the banjo was country enough for 19 weeks'},{song:'"Before He Cheats" — Carrie Underwood',rule:'Violent revenge fantasy with property destruction — aggressive content far outside mainstream country\'s "accept and endure" tradition',result:'Multiple Grammy winner that became an anthem, proved country women were allowed to be dangerous'},{song:'"Islands in the Stream" — Dolly Parton & Kenny Rogers',rule:'Disco-influenced production with a synthesizer groove in country — absolutely wrong for the genre',result:'#1 country AND pop crossover simultaneously, proved great songwriting (Barry Gibb) transcends production rules'}],vocables:{sounds:'la-la-la, hey, yee-haw, na-na',when:'barn-dance chorus, outro group singalong',suno_tag:'[Group singalong]',borrowed_from:'folk, Appalachian oral tradition',notes:'Country vocables signal community — they invite the audience into the song as participants not observers'}},
  jazz:{dna:'Improvisation over harmony, chord substitution, rhythmic sophistication, the conversation between instruments, space as music.',structure:'Head (melody) → Solos → Head out. Blues form (12-bar) or AABA (32-bar standard). The arrangement is a vehicle for improvisation.',suno:'"jazz, piano trio, upright bass, brushed drums, 120 BPM swing" for classic. "jazz fusion, electric piano, 100 BPM" for fusion.',keys:['The melody (head) is the launching pad — state it cleanly, then destroy it in the solo','Walking bass is always a counter-melody','Chord substitution creates harmonic surprise — ii-V-I can be approached from anywhere','Silence is the most important note in jazz'],artists:'Miles Davis · John Coltrane · Bill Evans · Thelonious Monk · Charlie Parker · Herbie Hancock · Esperanza Spalding · Kamasi Washington',counter:{device:'Walking bass (primary counter) / piano comping / horn counterpoint',does:'Jazz has the richest counter-melody tradition: the walking bass is ALWAYS a counter-melody — it creates an independent melodic line of its own against the soloist. Piano comping creates harmonic counter-commentary. In ensemble sections, horns play genuine counterpoint — multiple independent melodic lines simultaneously, each complete on its own.',howto:'walking bass counter-melody, piano comp counter-voice, horn counterpoint lines',map:'Throughout: walking bass provides constant counter / Head: piano comps creates harmonic counter / Solos: bass and comping in three-voice counterpoint / Ensemble: full horn counterpoint'},outliers:[{song:'"Take Five" — Dave Brubeck Quartet',rule:'5/4 time signature — commercially unthinkable, programmers said listeners couldn\'t feel an odd meter',result:'First jazz instrumental to sell over 1 million copies, proved listeners feel groove not math'},{song:'"Round Midnight" — Thelonious Monk',rule:'Extremely dissonant angular melody that sounded "wrong" to bebop musicians trained in smooth lines',result:'Most recorded jazz standard written by a living composer — the wrongness WAS the emotional truth'},{song:'"A Love Supreme" — John Coltrane',rule:'Four-part spiritual suite with no traditional song structure, no hooks, no commercial concessions',result:'Best-selling jazz album of all time — proved jazz listeners wanted transcendence more than entertainment'}],vocables:{sounds:'scat syllables: doo-wah, bop, skee-dat, ba-da',when:'improvised solo sections, outro scat fade',suno_tag:'[Scat vocal]',borrowed_from:'African American vocal improvisation tradition',notes:'Jazz vocables (scat) are melodically sophisticated — they mimic instrument lines, not crowd participation'}},
  rock:{dna:'Power chords, backbeat (snare on 2&4), guitar-bass-drums locked groove, riff as identity, distortion as emotion, verse-chorus-bridge with guitar solo as emotional peak. Dynamic contrast: quiet verse earning the explosive chorus.',structure:'Intro riff → Verse → Pre-Chorus → Chorus → Verse 2 → Pre-Chorus → Chorus → Guitar Solo / Bridge → Final Chorus → Outro. Intro riff often returns as outro.',suno:'"classic rock, electric guitar, power chords, driven drums, bass, 110 BPM, arena rock" for stadium. "hard rock, heavy riff, distorted guitar, 120 BPM" for modern. "indie rock, jangly guitars, clean tone, driving beat, 105 BPM" for indie. Always specify clean vs distorted guitar.',keys:['The riff IS the song\'s identity — memorable enough to hum, everything else serves it','Dynamic contrast is mandatory: verse must be quieter than chorus — the explosion must feel earned','Guitar solo is the emotional peak, not a technical showcase — it says what lyrics cannot','Chorus must feel like a collective event: written to be shouted by a crowd, not just sung solo','Rock lyrics: concrete images over abstraction. "Sleeping in a Chevy" not "feeling lost". Specificity creates anthems','Backbeat feel must be locked — drums and bass in the same pocket or the song loses its power'],artists:'Led Zeppelin · AC/DC · The Rolling Stones · Queen · Bruce Springsteen · Foo Fighters · Tom Petty · Aerosmith · Guns N\' Roses · Fleetwood Mac · The Eagles · Heart',counter:{device:'Second guitar harmony / keyboard layer / bass counter-line',does:'Rock\'s counter-melody lives in the second guitar track — a harmony guitar a third or fifth above the lead creates the twin-guitar wall of sound (Thin Lizzy, Iron Maiden). The bass frequently breaks from the root to play a counter-melodic line in the verse. A keyboard or organ adds harmonic counter-weight beneath the guitars.',howto:'harmony guitar counter-line, bass counter-melody, keyboard layer under guitars',map:'Verse: bass plays melodic counter beneath clean guitar / Chorus: second guitar harmony creates wall of sound / Bridge/Solo: bass and rhythm guitar create counter-rhythm / Outro: twin guitar harmonies lead the fade'},outliers:[{song:'"Bohemian Rhapsody" — Queen',rule:'6 minutes, opera section mid-song, no repeating chorus — radio refused to play it',result:'Held UK record for best-selling single, most recognizable song ever — commitment to vision beats every commercial formula'},{song:'"Smells Like Teen Spirit" — Nirvana',rule:'Deliberately lo-fi, muddy production against the polished hair-metal standard; Cobain said he was trying to rip off the Pixies',result:'Killed the dominant genre overnight — the anti-production became the definitive production'},{song:'"Mr. Brightside" — The Killers',rule:'No dynamic contrast — same relentless driving energy throughout with no quiet verse',result:'Never left UK charts for 16 consecutive years — sustained tension can replace the tension-release cycle entirely'}],vocables:{sounds:'woah, yeah, hey, come on',when:'pre-chorus lift, post-chorus crowd release, outro collective shout',suno_tag:'[Crowd shout]',borrowed_from:'blues shouting, gospel release',notes:'Rock vocables must be earned — quiet verse first, then the release. A "woah" with no contrast is decoration; with earned contrast, it is transcendence'}},
  folk:{dna:'Voice and acoustic instrument as total truth. Narrative storytelling, first-person perspective, protest tradition, community and oral history. Folk trusts the listener — the story IS the production. Every word must justify its existence.',structure:'Most flexible genre. Verse-only (no chorus) is valid. VCVCBC works. Through-composed follows the story arc. Never impose a template on a narrative — let the story determine the structure.',suno:'"folk, acoustic guitar, fingerpicked, warm, narrative, close-mic vocals, 90 BPM" for classic. "folk rock, acoustic + electric guitar, driving rhythm, 105 BPM" for electrified. "indie folk, atmospheric, layered acoustics, 80 BPM" for modern. Specify: brushed drums or no drums for authenticity. Always include "fingerpicked" for storytelling feel.',keys:['Every line must justify its existence — folk has zero tolerance for filler. If a line isn\'t the best possible line, cut it','Specificity creates universality: a house number, a dog\'s name, a particular street. Concrete details make stories universal','Verse 2 rule: deepen the emotional stakes. Do not repeat verse 1 imagery — move the story forward','Silence between phrases is deliberate — guitar rests carry as much weight as the notes','Protest folk: the argument must live in the specific story of one person, not stated as abstraction','Guitar tuning is a character: open G, DADGAD, open D create distinct emotional textures — specify in prompt'],artists:'Bob Dylan · Joni Mitchell · Neil Young · Simon & Garfunkel · Woody Guthrie · Pete Seeger · Joan Baez · Gillian Welch · Iron & Wine · Fleet Foxes · Sufjan Stevens · Phoebe Bridgers',counter:{device:'Second acoustic guitar / fiddle / cello counter-line',does:'Folk\'s counter-melody is the instrument filling the phrase gaps — the fingerpicked guitar pattern weaves its own melodic thread around the vocal line. On duet recordings, the second acoustic plays a complementary fingerpicking counter-line. Fiddle or cello can take the counter-melodic role in bridge sections.',howto:'fingerpicking counter-melody, fiddle counter-line, second acoustic guitar fills',map:'Throughout: guitar fills phrase gaps with melodic counter / Chorus: second voice or instrument joins / Bridge: counter-melody becomes prominent as vocal strips back / Outro: guitar fingerpicking counter leads the fade'},outliers:[{song:'"Fast Car" — Tracy Chapman',rule:'One repeating guitar loop with almost no chord changes for 4:59 — broke the variation mandate',result:'Grammy winner, UK #1 thirty years later when covered — a single hypnotic groove can hold emotional truth forever'},{song:'"Blowin\' in the Wind" — Bob Dylan',rule:'No answers given — the entire song asks questions without resolution, violating narrative resolution convention',result:'Defining protest anthem of the 20th century — ambiguity lands harder than statements'},{song:'"The Sound of Silence" — Simon & Garfunkel',rule:'Columbia secretly added electric guitar and drums to the original acoustic recording — purists were furious',result:'Became their breakthrough single — the "wrong" production decision became the definitive version'}],vocables:{sounds:'mmm, la-la-la, oh, hey',when:'bridge hum before final verse, quiet outro fade only',suno_tag:'[Hummed outro]',borrowed_from:'Appalachian tradition, Celtic folk',notes:'Folk vocables must feel involuntary — like the singer is moved to hum rather than performing. One moment per song maximum. Intimacy over crowd energy'}},
  metal:{dna:'Distorted guitars (down-tuned, palm-muted), aggressive percussion (double bass kick, blast beats), power and technical virtuosity, verse-chorus with mandatory breakdown, guitar solo as centerpiece. Extreme dynamics: the quiet is genuinely quiet, the loud is devastating.',structure:'Intro riff (identity statement) → Verse → Pre-Chorus → Chorus → Verse 2 → Pre-Chorus → Chorus → Breakdown (tempo shift, half-time or stop-start) → Guitar Solo → Bridge → Final Chorus → Outro. Breakdown and guitar solo are non-negotiable.',suno:'"heavy metal, distorted guitar, double bass drums, palm muting, power chords, 140 BPM" for classic. "thrash metal, fast riff, aggressive, 180 BPM" for thrash. "doom metal, slow, dark, heavy, 60 BPM" for doom. "melodic metal, harmonic guitar leads, clean chorus vocals, 130 BPM" for melodic. Always specify BPM and subgenre — metal sub-genres are sonically distinct.',keys:['The riff must be the most memorable thing — write the riff description first, every element serves it','Breakdown is mandatory: a tempo shift or rhythmic stop-start creates the headbanging moment — the crowd loses their mind here','Guitar solo must be the emotional climax, not a technical warm-up — the best metal solos say what the lyrics cannot','Dynamics: quiet sections must be genuinely quiet — contrast makes the heavy sections hit harder','Metal lyrics: mythology, psychology, existential conflict. Vague evil sounds dated; specific dread sounds timeless','Double bass drum pattern must be specified — it is the genre\'s rhythmic engine, everything rides on top of it'],artists:'Black Sabbath · Metallica · Iron Maiden · Pantera · Tool · Slayer · Ozzy Osbourne · Megadeth · Judas Priest · Lamb of God · System of a Down · Mastodon · Gojira',counter:{device:'Harmony guitar (twin lead) / galloping bass / riff counter-voice',does:'Metal\'s definitive counter-melody is the twin harmony guitar — two guitars playing harmonized lead lines a third or fifth apart (Iron Maiden perfected this). The bass plays a galloping rhythmic counter-line against the guitar riff. In progressive metal, a second voice plays a genuine melodic counter against the main riff.',howto:'twin harmony guitar leads, galloping bass counter-line, second guitar harmony riff',map:'Verse: bass gallops counter to guitar riff / Chorus: second guitar harmony creates wall of sound / Solo: guitar solo is primary melody, rhythm guitar provides counter-riff / Bridge: twin guitar harmonies in full counterpoint'},outliers:[{song:'"Master of Puppets" — Metallica',rule:'8.5 minutes with a complete mid-song tempo shift to a clean guitar ballad section — unexpected vulnerability in thrash metal',result:'Consistently rated the greatest metal song ever — proved complexity and emotional range coexist with brutality'},{song:'"War Pigs" — Black Sabbath',rule:'Anti-war political theme in a genre audiences expected to be about fantasy and escapism',result:'Became an anti-war anthem, proved heavy music could carry serious political weight'},{song:'"Chop Suey!" — System of a Down',rule:'No repeating chorus, shifting time signatures, vocals that alternate whisper and scream — broke every structural rule',result:'Their commercial breakthrough — chaos organized around a strong riff is more powerful than verse-chorus conformity'}],vocables:{sounds:'yeah, go, ahhh, hey',when:'breakdown entrance, chorus aggression peak, outro collective — sparingly',suno_tag:'[Metal shout]',borrowed_from:'hard rock shouting, blues intensity',notes:'Metal vocables must be used with restraint — impact over frequency. One well-placed "YEAH!" at a riff peak hits harder than scattered vocables throughout'}},
  bossa:{
    dna:'Nylon-string guitar as heartbeat and harmonic foundation simultaneously — in bossa nova the guitar does everything at once: bass notes with the thumb, chord voicings with the fingers, and a rhythmic pattern that is neither samba\'s weight nor jazz\'s swing but something between both. João Gilberto invented this approach in 1958 and it changed music permanently. Bossa nova is the sound of intimacy: whispered vocals close to the mic, complex jazz chords (major 7ths, 9ths, 13ths, altered dominants) played at conversational volume, Portuguese lyrics that feel like private thoughts overheard. The "bossa" is lightness itself — samba\'s rhythmic skeleton stripped of its percussive mass, filled instead with harmonic sophistication borrowed from American cool jazz and bebop. Jobim brought the orchestral harmonic architecture; Gilberto brought the guitar touch and the voice; jazz brought the chord vocabulary. The result sounds effortless and is extraordinarily difficult.',
    structure:'Verse-chorus but held loosely — bossa songs often dissolve the distinction between sections, with the harmonic journey doing the structural work that dynamics do elsewhere. No big drops, no explosive choruses, no moment of release in the rock or soul sense: tension and resolution happen at the chord level, not the volume level. The "ride" — an extended instrumental groove section where the guitar and bass lock into the bossa pattern while horns or piano solo — functions as the emotional centrepiece rather than a bridge. Everything is understated: a three-note melodic movement carries the weight a power chorus would elsewhere. Songs end by returning quietly to the opening groove, or by simply stopping mid-breath. Structure: Intro groove (4-8 bars, guitar establishing the rhythm) → Verse A → Verse B (often functions as chorus — bossa rarely has a true repeating chorus) → Instrumental ride/solo → Verse A return → outro vamp or cold stop.',
    suno:'"bossa nova, nylon string guitar, upright bass, brushed drums, intimate vocals, jazz harmony, 95-110 BPM" for classic. "bossa nova, flute, piano, warm, Rio de Janeiro, saudade, 100 BPM" for Jobim orchestral. "bossa nova jazz, Stan Getz saxophone, vibraphone, cool jazz, 105 BPM" for jazz crossover. Always specify "nylon string guitar, understated, close-mic vocal" — bossa collapses without the guitar texture and intimacy of recording.',
    keys:[
      'The guitar is doing three jobs simultaneously: bass (thumb on beats 1 and 3), chord voicings (fingers mid-beat), and rhythmic accent (the syncopated bossa pattern landing on the "and" of beat 2). Write for all three — specify "nylon string guitar, bossa rhythm pattern" in every prompt',
      'Jazz harmony is load-bearing: every chord must be extended or altered — no plain major or minor triads. Use maj7, maj9, m7, m9, 7b9, 7#11, 13 chords. The chord movement IS the emotion in bossa nova — what a vocal climax does in pop, a well-voiced II-V-I does here',
      'Vocal delivery must be intimate and conversational — whispered, never belted. João Gilberto sang as if to one person in a quiet room. Suno prompt must include "intimate, whispered, close-mic, understated vocals" or it will oversing the material',
      'Portuguese lyrics carry the saudade (longing, melancholy, nostalgia) that the music embodies — if writing in English, lean into the same feeling: longing for something you cannot name, beauty tinged with loss, present pleasure shadowed by impermanence',
      'The ride (instrumental section) is not optional filler — it is where the guitar and bass demonstrate the conversation that the song is about. Write [Instrumental - guitar and bass] and let it breathe for 8-16 bars minimum. This is where bossa\'s soul lives',
      'Silence and space are structural elements: a bar where only the guitar pattern continues without melody is as intentional as the sung bars. Never crowd the arrangement — no section needs more than 3-4 simultaneous voices (guitar, bass, voice, and one more at most)'
    ],
    artists:'João Gilberto · Antônio Carlos Jobim · Astrud Gilberto · Stan Getz · Chet Baker · Bebel Gilberto · Caetano Veloso · Baden Powell · Edu Lobo · Sérgio Mendes · Nara Leão',
    counter:{device:'Guitar bass-line and chord voicing vs. melody — the two-voice conversation',does:'The defining counter-melody of bossa nova is built into the guitar\'s technique: the thumb plays a melodic bass line that moves independently from the harmony while the fingers voice chords on the upper strings, and the vocal melody floats above both. Three simultaneous melodic threads from one instrument and one voice. When a second instrument enters — piano, flute, saxophone — it joins this conversation as a fourth voice, responding to the vocal phrase in the gap between lines rather than doubling it. The counter-melody never competes; it answers.',howto:'nylon guitar bass-line counter, guitar chord voicing vs. vocal melody, instrumental fills between vocal phrases',map:'Throughout: guitar thumb bass-line creates independent lower counter-melody / Verse: vocal melody on top, chord fills in middle, bass below / Ride: guitar takes full melodic lead, counter-melody becomes primary / Outro: guitar and voice trade phrases in open dialogue'},
    outliers:[
      {song:'"The Girl from Ipanema" — Astrud Gilberto & Stan Getz',rule:'Sung in accented English with a translation that lost much of the original Portuguese poetry — purists decried it as a commercial betrayal of the form',result:'Won Grammy for Record of the Year 1965, became one of the most played songs in radio history and introduced bossa nova to every corner of the world'},
      {song:'"Waters of March" — Antônio Carlos Jobim',rule:'No traditional verse-chorus structure — an unbroken list of images with no narrative arc, no resolution, and no conventional hook whatsoever',result:'Named the greatest Brazilian song ever recorded by multiple polls, proved bossa nova\'s emotional truth could live entirely in accumulation and texture rather than story'},
      {song:'"Aguas de Marco" with strings — Various orchestral versions',rule:'Adding full orchestral strings to a form defined by the intimacy and austerity of solo guitar and voice — a direct contradiction of bossa\'s founding aesthetic',result:'The orchestral versions became beloved classics alongside the stripped originals, proving the harmonic architecture was strong enough to support any honest instrumentation'}
    ],
    vocables:{sounds:'ah, oh, bom, tchi, hm, oo',when:'between verses as guitar fills in, outro hummed melody, instrumental ride vocal scat',suno_tag:'[Hummed melody] or [Vocal scat - bossa]',borrowed_from:'samba call-response tradition filtered through jazz scat (Ella Fitzgerald, Chet Baker)',notes:'Bossa vocables are never percussive or loud — "bom" and "tchi" are soft onomatopoeic syllables that mimic the guitar rhythm pattern itself. "Ah" and "oh" float above the groove as melodic sighs. The hummed bridge or outro is bossa\'s most intimate moment and should be directed by specifying [Hummed melody, close-mic] in Suno'}
  },
  dancehall:{
    dna:'Digital riddim is the architecture — one instrumental track (the riddim) released to multiple artists who each record a different song over the same beat. The riddim IS the genre\'s unit of culture, not the individual song. Rhythm evolved from reggae\'s one-drop (kick on beat 3) but digitized through Casio keyboards, Roland drum machines, and Jamaican studio innovation in the 1980s. Deejay toasting — rhyming, chanting, and boasting over the riddim in Jamaican patois — replaced the singing-led roots tradition. Sound system culture (massive outdoor speaker rigs, selectors spinning riddims, crowd energy as co-performance) shapes every structural decision: songs must hit immediately, the crowd must feel every drop. Jamaican patois is not accent — it is the lyrical language with its own grammar, vocabulary, and rhythmic logic. Sexuality and spirituality coexist without contradiction: a deejay can reference Jah and slackness in the same verse. Energy, boasting, and hypersexual confidence are the emotional range — vulnerability is rare and shocking when it appears.',
    structure:'Riddim-based: the instrumental riddim loops continuously from first bar to last. Hook comes first (or within 8 bars) — dancehall crowds decide in 4 seconds whether to stay on the dancefloor. Pattern: [Hook] → [Verse] → [Hook] → [Verse] → [Hook] → [Selector Drop]. The Selector Drop is a structural dancehall moment where the riddim pauses or slaps back to zero as the DJ or crowd rewinds to replay the hottest bar — write a bar designed for rewind. No bridge in classic dancehall — the song stays in one energy level and intensifies through the outro. Extended outros are crowd chant zones: the deejay throws simple call-and-response phrases and the crowd completes them. Verses are typically 8-16 bars of toasting — boasting, storyline, or slackness — in rhythmic patois over the unchanging riddim.',
    suno:'"dancehall, digital riddim, one-drop evolved, 75-90 BPM, digital bass, drum machine, synth keyboard stabs, Jamaica" for classic Vybz Kartel era. "dancehall pop, melodic hook, digital riddim, Sean Paul flow, 85 BPM, crossover" for international crossover. Always specify BPM (75-90 is the dancehall pocket — below 75 is roots, above 95 tips into reggaeton). Use "deejay toasting" to prevent Suno singing the verse in a pop style. Add "riddim loop" to keep the beat locked and continuous.',
    keys:[
      'The riddim never changes — one chord pattern or loop runs the entire song. Harmonic variation belongs to pop; dancehall power is in the unbroken groove. Write everything over the same rhythmic-harmonic foundation',
      'Patois is structural, not decorative — "seh" (say), "nuh" (no/isn\'t it), "deh" (there), "wah" (what/want), "pickney" (child), "big up" (respect), "dutty" (dirty/real), "ting" (thing/girl) create authentic rhythmic density that English synonyms destroy',
      'The hook is the riddim\'s crown — it must work as a crowd chant with no instrumental support. Write it so 1,000 people can shout it back in a field at 2am. Short, phonetically punchy, built for repetition',
      'Boasting logic: the deejay\'s credibility is the lyric. Status claims (money, style, women, neighborhood dominance) are not bragging — they are the genre\'s form of testimony. Write with total conviction, zero irony',
      'The rewind bar: engineer at least one bar so devastating — a patois punchline, a rhythm-breaking flow shift, a hypnotic hook callback — that it demands the selector rewind. This is the song\'s highest achievement in dancehall culture',
      'Outro crowd chant: write 4-6 call lines for the deejay to throw at the crowd (short, simple, repeated) — these are the song\'s final form. "Put your hands up / Wave them side to side" — the song becomes collective ritual, not passive listening'
    ],
    artists:'Vybz Kartel · Shabba Ranks · Beenie Man · Buju Banton · Sean Paul · Popcaan · Spice · Koffee · Bounty Killer · Elephant Man · Mavado · Shaggy',
    counter:{device:'The riddim IS the counter-melody — horn samples, digital keyboard stabs, synth bass pattern',does:'Dancehall inverts the counter-melody concept: the riddim itself functions as the counter-melody running beneath the toasting voice. The digital keyboard stab — a sharp, percussive synth hit on the offbeat — is dancehall\'s signature counter-accent, answering every vocal phrase with a rhythmic-melodic jab. Horn samples (sampled brass stabs, not live horns) punch between verse lines like a second voice. The synth bass pattern plays its own melodic contour independently of the deejay\'s flow — three rhythmic-melodic layers in constant counterpoint: bass melody, keyboard stabs, deejay toast.',howto:'digital keyboard stab offbeat counter, horn sample between-phrase answer, synth bass melodic pattern, riddim counter-loop',map:'Throughout entire song: riddim loops as persistent counter-melody / Verse gaps: keyboard stab answers each toast line / Hook: synth bass rises in the mix as counter-voice / Selector Drop: riddim pulls back, then returns as full counter / Outro: horn samples increase frequency over crowd chant'},
    outliers:[
      {song:'"Informer" — Snow',rule:'White Canadian rapper performing Jamaican dancehall patois — cultural gatekeeping was absolute and Snow had zero Jamaican roots',result:'#1 for 7 consecutive weeks globally in 1993, proved the riddim groove transcends the performer\'s cultural origin'},
      {song:'"Temperature" — Sean Paul',rule:'Near-total code-switch to English pop structure with a conventional chorus — abandoned the patois-heavy toasting tradition for global accessibility',result:'#1 in the US for 10 weeks, became the gateway song that introduced dancehall to millions who never heard Vybz Kartel or Bounty Killer'},
      {song:'"Toast" — Koffee',rule:'Gratitude anthem in a genre built entirely on boasting, sexual confidence, and dominance — vulnerability and thankfulness are genre violations',result:'Won Grammy for Best Reggae Album at age 19, proved authentic perspective beats genre convention and opened a new lane for conscious dancehall'}
    ],
    vocables:{sounds:'yo, seh, nuh, bless, skrrr, aye, woi, bloodclaat (energy exclamation — not slur, genre-specific intensifier), big up, massive, jah know, inna di dance, one time, two time',when:'between toast lines as rhythmic filler, hook repetition tag ("say it one time"), selector rewind moment ("pull up, selector!"), outro crowd chant (call thrown by deejay, crowd completes), energy peaks in the verse where the flow accelerates',suno_tag:'[Dancehall crowd chant]',borrowed_from:'Jamaican sound system culture, Rastafari expression, Afro-Jamaican oral tradition, mento and kumina rhythmic calls',notes:'Patois vocables carry rhythmic weight — "nuh true?" at bar end creates call-and-response with the crowd automatically. "Selector!" signals a rewind moment. "Big up di massive" opens the outro chant. These are not decoration — they are genre-required structural cues that instruct the crowd on how to participate. Avoid phonetic approximations of patois; commit fully or use English — half-patois reads as mockery'}
  },
  bollywood:{
    dna:'Hindi film music built on the playback singer tradition — actors lip-sync to studio vocalists, freeing composers to pursue maximum emotional intensity. The genre is an orchestral + electronic hybrid: lush strings and brass from the golden era of Lata Mangeshkar and Kishore Kumar sit alongside contemporary trap hi-hats and EDM drops. Melody is raga-influenced — phrases bend, ornament, and resolve through microtonal gamaks (trills) and meends (glides) that Western pop rarely uses. Structure is driven by the dance sequence on screen: the mukhda (opening hook/refrain) must be immediately singable and emotionally declarative; the antara (verse) deepens the emotional premise before the mukhda returns as catharsis. Song types carry distinct DNA: romantic songs (duets, slow tempos, lush orchestration, longing); item numbers (uptempo, percussive, brass stabs, provocative lyrical content, designed for dance-floor fantasy); devotional songs (raga-strict, harmonium, call-response, communal); and the modern "party song" sub-type (EDM production, bilingual Hindi-English lyrics, 120-130 BPM). Emotional melodrama is not excess — it is the point. Bollywood songs are designed to make you feel everything at once.',
    structure:'Mukhda (opening refrain, 4-8 bars — states the emotional thesis and must be singable on first listen) → Antara 1 (verse, 8-16 bars — deepens the mukhda\'s emotional premise with new imagery and melodic development, often rising in pitch or ornament density) → Mukhda (returns in full — now heard with emotional context, hits harder) → Interlude/Instrumental (orchestral or sitar/flute solo, 8-16 bars — the counter-melody moment, gives the ear a rest and the dancer a transition) → Antara 2 (verse 2, 8-16 bars — escalates further, sometimes modulates up a step) → Mukhda (final return, often with added vocal ad-libs or choir swell) → Optional Sanchari (bridge, 4-8 bars — a melodic departure, sometimes in a contrasting raga phrase, building to the final mukhda). CRITICAL DIFFERENCE from Western pop: there is no "pre-chorus" tension device — the antara itself builds tension through melodic arc, and the mukhda IS the chorus. The mukhda never changes lyrically; its repetition is the genre\'s emotional contract with the listener.',
    suno:'"Bollywood, Hindi film music, orchestral strings, tabla, sitar, melodic vocals, 110 BPM" for classic romantic. "modern Bollywood pop, electronic, item number, dhol, brass stabs, 120 BPM" for contemporary dance. "Bollywood devotional, harmonium, tanpura, raga-influenced, slow" for bhajan-adjacent. Always include "tabla" for rhythmic authenticity and specify "male playback" or "female playback" to signal the vocal tradition. Add "mukhda refrain" or "antara verse" as section tags to guide structure.',
    keys:[
      'The mukhda must be singable in one listen — if a first-time listener cannot hum it back by the second hearing, rewrite it. Bollywood hooks are built for mass audiences who hear a song once on a film; they must stick immediately',
      'The antara must emotionally deepen the mukhda\'s premise — not restate it. If the mukhda says "I am in love," the antara must say "and here is the specific ache, memory, or fear that love contains." The antara is the emotional proof of the mukhda\'s claim',
      'Raga-influenced ornamentation is not decoration — it is structure. A meend (glide between notes) or gamak (rapid trill) at the end of a mukhda phrase signals emotional climax. Specify "ornamental vocals, meend, gamak" in your Suno prompt to activate this',
      'The instrumental interlude is non-negotiable in classic Bollywood — it is where the orchestral counter-melody speaks. A sitar or flute solo of 8-16 bars between antaras gives the song its cinematic identity and provides space for the choreography transition on screen',
      'Separate item numbers from romantic songs at the prompt level — they require completely different DNA. Item numbers need "brass stabs, dhol, 120-130 BPM, energetic female vocal"; romantic songs need "lush strings, slow tabla, emotional male or female playback, 90-110 BPM." Mixing these without intention produces neither',
      'The mukhda\'s return after each antara must feel like emotional relief, not repetition — write the antara so its last line creates a question or tension that only the mukhda\'s return can answer. The return should land like the resolution of a held breath'
    ],
    artists:'A.R. Rahman · Lata Mangeshkar · Kishore Kumar · Shreya Ghoshal · Arijit Singh · Vishal-Shekhar · Pritam · R.D. Burman · Asha Bhosle · Mohammed Rafi · S.D. Burman · Shankar-Ehsaan-Loy',
    counter:{device:'Orchestral interlude / sitar or flute answer phrase',does:'Between each antara, Bollywood inserts a full orchestral counter-melody — typically a sitar, flute, or violin line that plays the emotional subtext of the mukhda in pure instrumental form. This is not an intro or outro; it lives inside the song, mid-structure, as a fully developed counter-voice. The instrument answers each vocal phrase in real time: after the singer completes a mukhda line, the sitar responds with a 2-4 bar melodic reply before the next phrase begins. In modern Bollywood, this role is taken by a synth lead or piano motif, but the structural function is identical — the counter-melody says what the lyric cannot.',howto:'sitar counter-melody, flute answer phrase, orchestral interlude, violin response line, synth lead counter-motif',map:'Mukhda: sitar/flute answers each vocal phrase in the gaps / Antara: strings swell under the vocal arc / Interlude: full instrumental counter-melody takes lead for 8-16 bars / Final Mukhda: counter-melody and vocal layer simultaneously for the emotional peak'},
    outliers:[
      {song:'"Jai Ho" — A.R. Rahman (Slumdog Millionaire)',rule:'Mixed Bollywood raga-melody with Western choral gospel and electronic production — broke the orchestral-only rule of classic film songs',result:'Won the Academy Award for Best Original Score and Best Original Song, introducing global audiences to Rahman\'s Bollywood-fusion aesthetic'},
      {song:'"Chaiyya Chaiyya" — A.R. Rahman (Dil Se)',rule:'Performed entirely on a moving train roof with a percussive sufi qawwali structure instead of the standard mukhda-antara form — no traditional refrain return',result:'Became one of the most iconic Bollywood sequences ever filmed, launched as an opening number in Spike Lee\'s "Inside Man" and proved sufi-devotional structure could replace the pop form entirely'},
      {song:'"Tum Hi Ho" — Arijit Singh (Aashiqui 2)',rule:'Stripped production with almost no orchestration — piano and minimal strings only, against the maximalist production standard of contemporary Bollywood',result:'Broke digital streaming records in India upon release, became Arijit Singh\'s signature song, and launched the "bare acoustic Bollywood" aesthetic that defined the early 2010s'}
    ],
    vocables:{sounds:'wah wah, hai re, aai aai, o re, haye, arre',when:'"Wah wah" appears as an appreciative mid-mukhda affirmation, placed after a particularly ornate melodic phrase — it is the sonic equivalent of applause within the song itself. "Hai re" opens or closes an antara as an expression of longing or grief, functioning as an emotional sigh before the lyric arrives. "Aai aai" and "o re" are rhythmic vocables used in uptempo item numbers and folk-influenced songs, often in the pre-mukhda lead-in or over the instrumental interlude. "Haye" and "arre" are exclamations of emotional intensity dropped at the peak of a mukhda return.',suno_tag:'[Mukhda - wah wah affirmation] [Antara - hai re lament] [Interlude - o re chant]',borrowed_from:'Hindustani classical vocal tradition (bandish affirmations), Sufi qawwali (haye/arre ecstatic call), North Indian folk music (aai aai as rhythmic filler in Bhojpuri and Rajasthani song)',notes:'These vocables are culturally load-bearing — "hai re" signals grief or longing and should never appear in a celebratory item number. "Wah wah" signals admiration and is appropriate only after a virtuosic melodic moment. Misplacing them breaks the emotional contract of the genre. In Suno, place them in the section tag bracket to cue correct emotional register rather than dropping them mid-lyric.'}
  },
  cpop:{
    dna:'Mandopop/Cantopop lineage (Teresa Teng → Jay Chou → streaming-era idols) grafted onto Western pop architecture. Pentatonic melody is the melodic DNA — hooks naturally avoid the 4th and 7th scale degrees, giving C-pop its characteristic sweetness and emotional directness. Mandarin tonal language (4 tones) is the invisible structural force: the melody MUST follow the spoken pitch contour of the lyric or the words become nonsense — a rising tone word demands a rising note, a falling tone word demands a falling note. This constraint is not a limitation; it is a compositional engine that produces melodies unlike anything Western writers can accidentally generate. Emotional delivery is restrained in verses (conversational, understated) then erupts completely in the 副歌 (chorus) — a controlled detonation after careful buildup. The idol system predates K-pop by decades: companies like HIM International Music (Jay Chou\'s label) engineer artists holistically — vocal training, image, lyric concept, choreography. Lyrics draw explicitly from classical Chinese poetry tradition (Tang dynasty imagery, nature metaphors, moon symbolism, ink-brush aesthetics) — a C-pop lyric may contain a 2,000-year-old allusion alongside an 808 bass drop.',
    structure:'Intro (4-8 bars, often solo piano or guzheng motif) → Verse 1 (主歌, 8-16 bars, emotionally restrained, storytelling) → 副歌铺垫 (buildup/pre-chorus, 4-8 bars — tension builder that is specifically named and structurally mandatory, lifts toward the emotional peak) → 副歌 (chorus — the emotional detonation, the payoff, most melodically memorable section, 8-16 bars) → Verse 2 (deepens the story, never repeats Verse 1 imagery) → 副歌铺垫 → 副歌 → Bridge (桥段, often a key change of +2 to +4 semitones, frequently the most poetic or lyrically classical section) → Final 副歌 (bigger, layered harmonies, full orchestration). The 副歌铺垫 is to C-pop what the pre-chorus is to K-pop — non-negotiable, load-bearing. Songs often end with a 尾奏 (outro) that echoes the intro motif, creating a circular poetic structure.',
    suno:'"Mandopop, C-pop, Chinese pop, piano, strings, acoustic guitar, 120 BPM" for classic Jay Chou-style. "modern C-pop, electronic, idol pop, synth, clean vocals, 125 BPM" for contemporary streaming era. Add "guzheng, erhu, Chinese traditional instruments" for cultural texture. Use "Cantopop, Hong Kong pop, piano ballad, 80 BPM" for Cantonese-language material. Always include "Mandopop" or "C-pop" as the first style tag — it is the strongest signal for Chinese pop production aesthetics.',
    keys:[
      'Tonal language melodic constraint: every melodic phrase must respect Mandarin speech tones — a 2nd-tone (rising) syllable cannot sit on a falling melody note or the lyric becomes a different word entirely. Write the lyric first, speak it aloud, feel its pitch contour, then build the melody around that contour — not the reverse',
      'Pentatonic hook architecture: build choruses on the pentatonic scale (1-2-3-5-6) and avoid the 4th and 7th degrees in the peak melodic moments. The pentatonic constraint naturally produces the emotional sweetness and accessibility that defines C-pop hooks globally',
      'The 副歌铺垫 (buildup) is structurally required: it is not an optional pre-chorus but a distinct named section that assembles emotional and harmonic pressure before the 副歌 detonates. Without it, the chorus has no height — it needs the ramp. Minimum 4 bars, ends on the V chord or a suspension',
      'Key change at the bridge or final chorus is a genre convention so strong it is virtually a rule: +2 semitones for emotional lift, +4 for maximum catharsis. The key change signals to the listener that the emotional truth of the song is being revealed — it is a structural promise that must be kept',
      'Idol-system vocal phrasing: C-pop vocals are precision-trained and emotionally controlled until the 副歌, where they are allowed to open completely. Verses use head voice and conversational delivery. The chorus uses chest-to-mixed-voice transitions that feel like emotional release. Never open the full vocal before the 副歌 — save the biggest notes for the biggest moment',
      'Classical poetry imagery in lyrics: use moon (月), wind (风), rain (雨), ink (墨), distance (遠方), time (時光) as lyrical anchors — these connect to 2,000 years of Chinese literary tradition and give C-pop lyrics their characteristic emotional weight. Abstract feeling through concrete natural imagery, never explicit emotional statement'
    ],
    artists:'Jay Chou (周杰倫) · Teresa Teng (鄧麗君) · Faye Wong (王菲) · G.E.M. (鄧紫棋) · Eason Chan (陳奕迅) · TF Boys · Jackson Wang (王嘉爾) · JJ Lin (林俊傑) · Mayday (五月天)',
    counter:{device:'Guzheng or erhu counter-line / piano arpeggios as counter-voice',does:'The guzheng (plucked zither) or erhu (two-string fiddle) plays a winding melodic counter-line against the vocal — it fills the spaces between vocal phrases with melodic statements that feel like an ancient voice commenting on the modern lyric. This is C-pop\'s signature sound: Western pop structure inhabited by Chinese timbres. In piano-led arrangements, the right-hand piano arpeggiation plays a continuous melodic counter-voice that weaves around the vocal, answering each phrase with a harmonic echo that keeps the texture rich during the verse\'s emotional restraint.',howto:'guzheng counter-melody, erhu melodic fill, piano arpeggiation counter-voice, Chinese instrument counter-line',map:'Intro: guzheng or piano plays the counter-melody alone, establishing it before vocal enters / Verse: erhu or piano arpeggiation fills phrase gaps with melodic responses / 副歌铺垫: counter-line builds alongside vocal, increasing density / 副歌: counter-melody rises to meet the vocal peak — both voices at full intensity / Bridge: erhu takes counter-melodic lead, most lyrical moment for the instrument'},
    outliers:[
      {song:'"以父之名" (In the Name of the Father) — Jay Chou',rule:'Gregorian chant intro in Latin, Western orchestral production, near-operatic arrangement — no pentatonic hooks and no idol-system accessibility',result:'Became one of Jay Chou\'s defining artistic statements, proved C-pop could carry cinematic ambition and Western classical architecture without losing its identity'},
      {song:'"容易受傷的女人" (A Woman Easily Hurt) — Faye Wong',rule:'Cantonese cover of Cocteau Twins\' "Rilkean Heart" — dreampop shoegaze textures, English post-rock origin, deliberate lyrical opacity against C-pop\'s clarity tradition',result:'Launched Faye Wong\'s career as C-pop\'s most iconoclastic voice and opened the genre to Western alternative aesthetics'},
      {song:'"倒數" (Countdown) — G.E.M.',rule:'Full EDM drop structure with no traditional 副歌 buildup and no guzheng or Chinese instrumental element — pure Western electronic pop production',result:'Broke G.E.M. internationally and demonstrated that C-pop artists could compete in Western electronic production spaces without cultural compromise'}
    ],
    vocables:{sounds:'ai ya (哎呀), wah, oh oh, na na na, hmm',when:'post-chorus emotional release, verse-gap fills, outro fade vamp, bridge emotional peak',suno_tag:'[Mandopop vocal ad-lib]',borrowed_from:'Cantonese opera exclamatory tradition, Taiwanese folk song, idol-pop production engineering',notes:'Tonal language fundamentally alters how vocables function in C-pop: pure non-lexical sounds like "oh" and "ah" are safer than syllables that carry Mandarin tonal meaning, because a sung syllable on the wrong pitch can accidentally mean something unintended. "Ai ya" (哎呀) is a culturally embedded exclamation of emotion — surprise, aching longing, regret — used at moments of peak feeling. Vocables in C-pop are placed AFTER the emotional moment (post-chorus release) not before it, because the restraint-then-explosion structure requires the lyric to carry the buildup and the vocable to exhale it'}
  },
  amapiano:{
    dna:'Born in Soweto\'s townships around 2012-2016, amapiano is South African house music rebuilt around one defining invention: the log drum. The log drum bass line — a deep, woody, rolling percussive sub-bass sound, 808-adjacent but organic in texture — is not the beat and not the bass line; it is both simultaneously, and it is the hook. Piano melodies (often jazzy, pentatonic-rooted, sometimes gospel-adjacent) float above a 4/4 house kick-pattern, while the log drum rolls and tumbles through the low end like a drum solo happening inside the bass register. DNA is South African deep house + kwaito rhythmic feel + jazz piano improvisation + African jazz chord vocabulary. "Yanos" culture is township-born, joyful, and communal — the music is made to be played loud in taxis, at braais, and in clubs. BPM is 110-115, slower and heavier than UK house, giving the log drum room to breathe and roll. Vocals in amapiano are largely secondary and functional — a vocal hook exists to give the groove a shape, not to carry the emotional weight. The log drum IS the emotional weight. It is the chorus, the drop, and the reason people scream when it returns.',
    structure:'Intro groove (piano + hi-hats + shakers establish feel, log drum absent or low in mix, 60-90 seconds) → Log Drum Drop (the log drum enters fully — this IS the chorus equivalent, the moment the song delivers its payload, 2-4 minutes) → Vocal Section (vocal hook enters over the groove, log drum pulls back slightly to give vocals space) → Log Drum Return (log drum comes back full — second chorus equivalent, the crowd reacts again) → Build (layers add: stabs, flute counter-voice, hi-hat rush, percussion density increases) → Outro (groove thins, piano takes over, log drum fades last). Songs run 6-10 minutes because the groove MUST breathe — no genre rushes less than amapiano. The Log Drum Section is the structural chorus: it is where the song peaks, where the crowd responds, and where the producer\'s identity lives. A short amapiano track is an incomplete amapiano track.',
    suno:'"amapiano, log drum bass, South African house, jazz piano, 112 BPM" for classic township feel. "amapiano, log drum, piano riffs, flute, deep bass, South African" for textured arrangements. Always specify log drum explicitly — without it Suno defaults to generic house. Add "piano stabs, shakers, 4/4 house kick" for rhythmic detail. Use [Log Drum Drop] as a section tag for the main groove payoff. "amapiano vocals, Zulu, call-response" for vocal sections.',
    keys:[
      'The log drum IS the hook — treat it the way you would treat a chorus melody. It must be memorable, rhythmically distinct, and worth waiting for. If the log drum does not hit when it drops, the song has no chorus',
      'Piano plays around the log drum, not under it — the piano\'s job is to comp, riff, and decorate the space the log drum defines. Jazzy upper-register runs, pentatonic fills, gospel chord stabs: all of these float above and beside the log drum, never competing with it in the low-mid frequency register',
      'The groove must breathe — amapiano runs at 110-115 BPM deliberately. Do not compress the arrangement. Space between elements (a gap before the log drum rolls in, a bar of sparse hi-hat before the piano re-enters) is where the tension lives. Silence IS production in amapiano',
      'The intro earns the drop — spend 60-90 seconds establishing the groove without the full log drum. Let the piano, shakers, and kick build the listener\'s anticipation. The log drum drop only hits if the intro creates a genuine absence',
      'Vocal hooks are groove-riders, not leads — write vocals that sit inside the rhythmic pocket rather than over it. Repeated syllable-patterns (call-response, chant, short Zulu/Sotho phrases) work better than complex melodic lines. The groove must be able to exist without the vocal and lose nothing',
      'Layer from sparse to dense and back — amapiano arrangements build by adding elements (log drum layers, flute counter-voice, piano stabs) and strip back just as intentionally. A second log drum pattern entering a half-step below the first, or a flute melody appearing in the final build, creates the sense of a living composition evolving in real time'
    ],
    artists:'Kabza De Small · DJ Maphorisa · Focalistic · Samthing Soweto · MaWhoo · Mnisi · Young Stunna · Kelvin Momo · Mas Musiq · Lady Du · DBN Gogo',
    counter:{device:'Piano riffs + flute samples as counter-voices against the log drum',does:'The piano plays short rhythmic-melodic riffs — often pentatonic or blues-inflected — that weave between the log drum\'s rolling subdivisions. These riffs are not the melody; they are the answer to the log drum\'s call. When flute samples appear (a hallmark of the genre\'s progression post-2020), the flute takes the counter-voice role: it plays a sustained melodic phrase above the log drum while the piano comps below, creating a three-layer counterpoint of log drum (bottom) + piano riff (middle) + flute melody (top). This stacked counter-voice architecture is what separates a crafted amapiano production from a basic one.',howto:'piano counter-riff between log drum hits, flute counter-melody above groove, piano stab syncopation',map:'Intro: piano riffs establish counter-voice pattern alone / Log Drum Drop: piano pulls back to stabs, log drum dominates / Vocal section: piano comps minimally beneath vocal / Final build: flute enters as third counter-voice above piano and log drum, all three play simultaneously'},
    outliers:[
      {song:'"Ke Star" — Focalistic ft. Davido',rule:'Added Nigerian Afrobeats star Davido and pidgin English hooks to a genre defined by its Soweto cultural specificity — broke the township-exclusivity code',result:'First amapiano track to chart internationally at scale, crossed the genre from South African cultural export to Pan-African pop and opened the Lagos-Joburg production pipeline'},
      {song:'"Akulaleki" — Samthing Soweto, Kabza De Small & DJ Maphorisa',rule:'Led with the vocal melody and soulful singing as the primary hook rather than the log drum — reversed the vocal-secondary founding principle',result:'Became one of the most emotionally resonant amapiano recordings, proved the genre could carry genuine melodic songcraft without losing its identity and expanded the emotional register beyond groove-as-feeling'},
      {song:'"John Vuli Gate" — Mapara A Jazz ft. Ntosh Gaz & Calona',rule:'Built around a street-chant vocal hook so simple it became a TikTok dance meme — the opposite of the genre\'s traditionally long-form groove architecture, running under 5 minutes with a compressed pop structure',result:'Went globally viral on TikTok in 2020, introduced millions of international listeners to amapiano through a 60-second dance clip and proved the genre\'s groove could survive radical compression when the hook was strong enough'}
    ],
    vocables:{sounds:'woza, siyabonga, aibo, e-e-e, haibo, yebo, eish',when:'"woza" (come/let\'s go in Zulu) as call-to-the-floor shout at the log drum drop and outro; "siyabonga" (we are grateful in Zulu) in outro vamp as communal affirmation; "aibo/haibo" (expression of surprise or disbelief in Zulu/Sotho) as a mid-song exclamation when the log drum re-enters; "e-e-e" as a rhythmic, wordless crowd-chant between log drum phrases and in the build section; "yebo" (yes in Zulu) as call-response affirmation; "eish" (exclamation of intensity or frustration, universal South African) dropped by a vocalist reacting to a particularly hard log drum roll',suno_tag:'[Log Drum Drop] for the log drum arrival section; [Outro vamp] for the communal vocable fade; use "Zulu vocals, call-response, township chant" in style prompt to cue the vocable language register',borrowed_from:'Zulu and Sotho everyday speech and oral tradition — these are township vernacular expressions, not formal language. They are borrowed from the street, the taxi rank, the braai. The "e-e-e" chant has roots in African communal song going back centuries.',notes:'Vocables in amapiano are participatory — they are crowd-call words, not singer-showcase moments. "Woza" works best right at the log drum drop as a shout that cues the crowd. "Siyabonga" in the outro signals gratitude and community, matching the joyful-spiritual ethos of yanos culture. Avoid over-specifying in lyrics — one or two placed vocables per song land harder than a barrage. In Suno, placing "woza!" in parentheses on the log drum drop line treats it as an ad-lib shout, which is the correct rendering'}
  },
};

// ═══════════════════════════════════════════════════════
// VOCABLE THEORY — Cross-genre hook filler intelligence
// ═══════════════════════════════════════════════════════
const VOCABLE_THEORY = {
  definition: 'Vocables are melodic non-lexical syllables (na-na, ooh, yeah, hey) used to create singalong moments. Open vowels (A, E, O) resonate naturally — the brain responds emotionally before processing meaning.',
  why_they_work: 'Phonetic resonance of open vowels, emotional bypass of semantic processing, crowd participation trigger, rhythmic padding without forced word stress, hypnotic repetition effect.',
  when_to_use: 'post-chorus (landing pad after peak), outro (fade singalong), pre-chorus lift (build energy before hook), transitions between sections, anywhere the hook needs to become crowd property.',
  suno_tags: {
    singalong: '[Outro - singalong]',
    chant: '[Crowd chant]',
    call_response: '[Call and response]',
    congregational: '[Congregational response]',
    ad_lib: '[Ad-lib vocal runs]',
    vamp: '[Outro vamp]',
    group: '[Group vocal]'
  },
  phonetic_classes: {
    resonant: ['na','la','da','ba'],
    open: ['oh','ooh','ah','aah'],
    affirmative: ['yeah','yea','hey','aye'],
    tonal: ['mmm','hmm','woo','whoa'],
    rhythmic: ['uh','huh','go','up']
  }
};

// VOCABLE CROSSWALK — same sound, different meaning per genre
const VOCABLE_CROSSWALK = {
  'yeah': {
    hiphop:   'ad-lib punctuation — background energy filler between bars',
    rnb:      'affirmation in call-response — answers the lead vocal',
    country:  'communal warmth — affirms shared feeling with audience',
    rock:     'anthem crowd moment — audience ownership of the song',
    pop:      'hook filler singalong — keeps the crowd engaged post-chorus',
    gospel:   'congregational response to preacher — collective affirmation',
    afrobeats:'rhythmic accent — punctuates the groove, not the lyric'
  },
  'ooh': {
    rnb:      'melismatic run — emotional peak, vocal acrobatics',
    pop:      'post-chorus crowd hook — soft landing after the peak',
    gospel:   'spiritual overwhelm — beyond words, pure feeling',
    soul:     'bridge build — accumulates before the final chorus release',
    kpop:     'idol vocal texture — adds sweetness to the hook layer',
    blues:    'guitar-answering voice — fills the call-response gap when words run out'
  },
  'hey': {
    afrobeats:'call-and-response trigger — leader calls, crowd responds',
    pop:      'section opener — signals the hook is arriving',
    punk:     'crowd shout — collective fury, no individual voice',
    country:  'barn-dance energy — communal, physical, joyful',
    rock:     'pre-chorus lift — primes the audience for the explosion'
  },
  'na-na-na': {
    pop:      'ultimate singalong — crowd takes over when they forget words',
    punk:     'nihilist placeholder — words are beside the point',
    ss:       'gentle humming texture — intimacy, not crowd energy',
    reggae:   'meditative mantra — part of the spiritual groove'
  },
  'ah': {
    gospel:   'overwhelm response — too moved for words',
    rnb:      'vocal run launch — starting note of a melismatic phrase',
    soul:     'ache expression — the breath before an emotional line',
    opera_influenced_pop: 'dramatic peak marker'
  },
  'uh': {
    hiphop:   'rhythmic placeholder — keeps the flow while thought arrives',
    trap:     'filler accent — standard trap ad-lib vocabulary',
    rnb:      'lazy cool — understated affirmation'
  }
};

// VOCABLE LINEAGE — cultural borrowing chains (who learned from who)
const VOCABLE_LINEAGE = [
  {
    chain: 'Gospel → Soul → R&B → Pop → Hip-hop → Afrobeats',
    sound: 'ooh/ah/yeah',
    story: 'Open vowel emotional release born in the Black church, secularized through Soul, commercialized through R&B, repackaged in Pop hooks, repurposed as ad-libs in Hip-hop, recontextualized as rhythmic accents in Afrobeats'
  },
  {
    chain: 'Folk → Country → Americana → Pop',
    sound: 'na-na-na / la-la-la / hey',
    story: 'Work song and folk tradition of communal humming when lyrics were unknown — Country preserved it as barn-dance energy, Pop weaponized it as the deliberate singalong hook'
  },
  {
    chain: 'Blues → Rock → Punk → Alt-rock',
    sound: 'hey/woo/yeah',
    story: 'Blues call-response shout became rock anthem crowd moment, punk stripped it to pure collective fury, alt-rock reintroduced it as self-aware ironic crowd participation'
  },
  {
    chain: 'Reggae → Dancehall → Reggaeton → Latin Pop',
    sound: 'aye/eh/yo',
    story: 'Jamaican patois affirmation vocables traveled through dancehall production into reggaeton dembow culture, landing in Latin pop as rhythmic accent hooks'
  }
];

// FUSION VOCABLE RESOLVER — when two genres blend, which vocable wins
function resolveFusionVocables(genre1, genre2) {
  const bible = GENRE_BIBLE;
  const v1 = bible[genre1]?.vocables;
  const v2 = bible[genre2]?.vocables;
  if (!v1 && !v2) return null;
  if (!v2) return v1;
  if (!v1) return v2;

  // Check lineage — the more ancestral genre leads
  const lineageOrder = ['gospel','blues','soul','rnb','ss','folk','country','reggae','rock','altrock','pop','hiphop','kpop','afrobeats','reggaeton','punk','latin'];
  const rank1 = lineageOrder.indexOf(genre1);
  const rank2 = lineageOrder.indexOf(genre2);
  const lead = rank1 <= rank2 ? v1 : v2;
  const layer = rank1 <= rank2 ? v2 : v1;

  return {
    lead_sounds: lead.sounds,
    layer_sounds: layer.sounds,
    blend_note: `Lead with ${genre1 < genre2 ? genre1 : genre2} vocable tradition, layer ${genre1 < genre2 ? genre2 : genre1} textures underneath`,
    suno_tag: lead.suno_tag || VOCABLE_THEORY.suno_tags.singalong
  };
}

const FORMULA_LAWS=[
  {n:'Hook within 30 seconds',d:'Streaming platforms punish late hooks. Listeners decide in 15–30s. The dopamine reward must land early.',v:10},
  {n:'Tension → Release cycle',d:'Every section builds pressure then releases it. This mirrors the brain\'s dopamine anticipation/reward loop exactly.',v:10},
  {n:'Repetition with variation',d:'Mere-exposure effect: repeated hooks feel better each time. But pure repetition = boredom. Each repeat needs 1 new element.',v:9},
  {n:'Predictability + one surprise',d:'Brain predicts patterns and gets dopamine for being right. One unexpected element creates the "positive prediction error" — the chills.',v:10},
  {n:'Dynamic contrast',d:'Quiet verse → explosive chorus is the oldest trick. Greater contrast = more powerful dopamine release at the transition.',v:9},
  {n:'Zeigarnik effect',d:'Unfinished lyric phrases force the brain to complete them, creating earworms. Leave one chorus phrase slightly open-ended.',v:8},
  {n:'Specific imagery = universal feeling',d:'Songs using concrete specific images to express universal emotions outlive vague ones. Specificity creates empathy.',v:9},
  {n:'Identity & belonging signal',d:'Viral songs make the listener feel seen or part of a tribe. The chorus is the group identity moment.',v:9},
  {n:'Singability threshold',d:'If a person can\'t hum the chorus after 2 listens, it won\'t hit. Melody range ≤ 1.5 octaves. Max 12 syllables per chorus line.',v:10},
  {n:'BPM groove lock',d:'120–130 BPM = walking cadence (pop/dance). 60–70 BPM = resting heartbeat (ballads). Matching tempo to physiology creates embodied engagement.',v:8},
];

const MUSIC_THEORY_BIBLE={
  modes:{
    ionian:    {name:'Major (Ionian)',      feel:'Bright, happy, triumphant, resolved — the "default" Western scale',          genres:['pop','country','children','gospel','kpop'],    steps:'W-W-H-W-W-W-H'},
    dorian:    {name:'Dorian',              feel:'Minor but hopeful — bluesy cool, mysterious funk, bittersweet groove',       genres:['jazz','rnb','neosoul','blues','afrobeats'],    steps:'W-H-W-W-W-H-W'},
    phrygian:  {name:'Phrygian',            feel:'Dark, Spanish, tense, threatening — the "danger" mode',                      genres:['latin','altrock','edm'],                       steps:'H-W-W-W-H-W-W'},
    lydian:    {name:'Lydian',              feel:'Dreamy, floating, magical, film-score wonder — the "#4 shimmer"',            genres:['edm','tvmusical','pop'],                       steps:'W-W-W-H-W-W-H'},
    mixolydian:{name:'Mixolydian',          feel:'Rock swagger, bluesy, unresolved pull — major with a flat-7',               genres:['blues','country','altrock','reggae','afrobeats'],steps:'W-W-H-W-W-H-W'},
    aeolian:   {name:'Natural Minor (Aeolian)',feel:'Sad, introspective, dark, melancholic — the most emotional minor mode',  genres:['pop','hiphop','altrock','rnb','reggaeton'],    steps:'W-H-W-W-H-W-W'},
    locrian:   {name:'Locrian',             feel:'Unstable, dissonant — tension with no promise of release',                  genres:['altrock','experimental'],                      steps:'H-W-W-H-W-W-W'},
    pent_maj:  {name:'Major Pentatonic',    feel:'Open, pastoral, folk — simple joy, bluegrass, sunrise',                    genres:['country','ss','children','gospel','reggae'],   steps:'W-W-W+H-W-W+H'},
    pent_min:  {name:'Minor Pentatonic',    feel:'Blues, rock, raw emotion — the soulful cry. 5 notes that say everything',  genres:['blues','rnb','altrock','hiphop','neosoul'],    steps:'W+H-W-W-W+H-W'},
    blues_sc:  {name:'Blues Scale',         feel:'Minor pentatonic + blue note — the soul of American music, tension baked in',genres:['blues','jazz','rnb','neosoul'],               steps:'W+H-W-H-H-W+H-W'},
    wholetone: {name:'Whole Tone',          feel:'Dreamlike, floating, unresolved — Debussy impressionism, jazz shimmer',    genres:['jazz','edm'],                                  steps:'W-W-W-W-W-W'},
    chromatic: {name:'Chromatic',           feel:'Maximum tension, bebop density — all 12 tones, no tonal center to rest in',genres:['jazz','experimental'],                         steps:'H×12'},
  },

  outlierChords:{
    neapolitan:  {name:'Neapolitan (♭II)',         short:'♭II',  feel:'Profound sadness before resolution — the heartbreak chord. ♭II→V→I. Classical tragedy weaponized.',       howto:'Insert ♭II major chord before the final V→I cadence',                            genres:['pop','tvmusical','gospel','ss'],     tension:9},
    tritone_sub: {name:'Tritone Substitution',     short:'♭II7', feel:'Maximum chromatic pull — replaces V7 with a chord a tritone away, creating a chromatic bass descent to I.',howto:'Replace V7 with ♭II7 for a sliding bass-line resolution',                         genres:['jazz','neosoul','rnb'],              tension:10},
    borrowed_bVII:{name:'Borrowed ♭VII',           short:'♭VII', feel:'The "Hollywood chord" — unexpected grandeur and warmth from the parallel minor. Sounds huge every time.',  howto:'Insert ♭VII major chord before the final chorus or key moment',                   genres:['pop','altrock','country','tvmusical'],tension:5},
    borrowed_bVI: {name:'Borrowed ♭VI',            short:'♭VI',  feel:'Bittersweet, nostalgic — dark beauty in a major key song. The moment everything gets complicated.',        howto:'Use ♭VI as the bridge chord or emotional pivot',                                  genres:['pop','rnb','gospel','country'],       tension:6},
    borrowed_iv:  {name:'Borrowed iv (minor 4)',   short:'iv',   feel:'The most-used outlier in pop — adds instant melancholy to a major key song without fully darkening it.',  howto:'Use minor iv chord instead of major IV for one progression',                      genres:['pop','rnb','altrock','country','ss'], tension:4},
    secondary_dom:{name:'Secondary Dominant',      short:'V/V',  feel:'"Double drive" to the chord of resolution — creates far more momentum than a plain V→I.',                howto:'Insert V/V (e.g. A7 in key of C) before the V chord',                            genres:['jazz','gospel','latin','pop'],        tension:7},
    chromatic_med:{name:'Chromatic Mediant',       short:'±III', feel:'Magical non-functional move — a third up/down with a mode change. Film score wonder/revelation chord.',   howto:'Jump a major third up or down with opposite mode for the bridge key change',      genres:['edm','altrock','tvmusical','pop'],    tension:6},
    pedal_point:  {name:'Pedal Point',             short:'Pedal',feel:'Bass holds one note while chords move above — dominant pedal = massive tension; tonic pedal = spiritual.',howto:'Hold bass on V or I while chord progression continues above it',                  genres:['gospel','edm','blues','jazz'],        tension:8},
    deceptive_cad:{name:'Deceptive Cadence',       short:'V→vi', feel:'The false ending — listener expects V→I but gets V→vi. Creates surprise, yearning, prolonged emotion.',  howto:'Replace the final I chord with vi to delay resolution',                           genres:['pop','tvmusical','gospel','country'], tension:7},
    augmented_6th:{name:'Augmented 6th Chord',    short:'+6',   feel:'Classical maximum tension — chromatic half-step approach to V from both sides. Devastating in context.',  howto:'Use Ger+6 or It+6 before the dominant cadence for dramatic effect',               genres:['tvmusical','jazz','classical'],       tension:10},
    modal_mixture:{name:'Modal Mixture',           short:'Mix',  feel:'Borrowing across parallel modes for color — the palette of film scores and sophisticated pop.',           howto:'Freely borrow chords from the parallel major or minor key',                       genres:['pop','rnb','country','altrock','jazz'],tension:5},
    andalusian:   {name:'Andalusian Cadence',      short:'i-♭VII-♭VI-V',feel:'Descending bass line generating harmonic inevitability — Spanish, flamenco, cinematic, visceral.',howto:'Use descending chromatic bass: i → ♭VII → ♭VI → V for verse or bridge',          genres:['latin','altrock','edm','blues'],      tension:8},
    suspension:   {name:'Suspended Chord (sus2/4)', short:'sus', feel:'Tension without commitment — the sus4 creates yearning, the sus2 creates openness. Resolution = payoff.',howto:'Replace tonic or dominant with sus4 before resolving to create emotional breath',  genres:['pop','ss','gospel','edm'],            tension:6},
  },

  keyPsychology:{
    'C major': {feel:'Clean, neutral, transparent — no sharps/flats, no color bias. The blank canvas.',tension:'Low',bright:7},
    'G major': {feel:'Warm, pastoral, hopeful. Country\'s home. Guitar open strings = natural resonance.',tension:'Low',bright:8},
    'D major': {feel:'Triumphant, bright, grand. Orchestral victory. Beethoven\'s key of glory.',tension:'Low',bright:9},
    'A major': {feel:'Confident, joyful, clean. Pop and rock workhorse. Bright without harshness.',tension:'Low',bright:8},
    'E major': {feel:'Razor-sharp, almost harsh. Electric guitar\'s natural home. Raw energy.',tension:'Medium',bright:9},
    'B major': {feel:'Tense brightness. Rarely used for a reason — unstable, searching, restless.',tension:'Medium-High',bright:7},
    'F# major':{feel:'Extremely tense brightness. Enharmonic of G♭ — jazz\'s far-sharp territory.',tension:'High',bright:6},
    'F major': {feel:'Pastoral, warm, slightly melancholic. Mozart\'s "key of love". Folk comfort.',tension:'Low',bright:6},
    'B♭ major':{feel:'Noble, warm, full. Jazz and gospel staple. Natural brass key — resonant.',tension:'Low-Med',bright:7},
    'E♭ major':{feel:'Heroic, bold, grand. Classical "heroic key". Gospel and jazz ballad natural home.',tension:'Medium',bright:7},
    'A♭ major':{feel:'Warm and lush. Romantic ballad key. Rich, slightly mysterious.',tension:'Medium',bright:6},
    'D♭ major':{feel:'Gorgeous and remote. Jazz ballad key of distance and longing.',tension:'Medium',bright:6},
    'A minor': {feel:'Melancholic, introspective, natural sadness. Most-used minor in pop and rock.',tension:'Medium',bright:3},
    'E minor': {feel:'Dark, pensive, longing. "Hotel California" key. Guitar\'s most emotional.',tension:'Med-High',bright:3},
    'D minor': {feel:'"The saddest of all keys." Deep tragedy, classical devastation. Beethoven\'s 9th.',tension:'High',bright:2},
    'B minor': {feel:'Cold, isolated, reserved sorrow. Bach\'s most heartbreaking works.',tension:'High',bright:2},
    'F# minor':{feel:'Anguished, desperate, raw grief. Schubert\'s key of torment.',tension:'Very High',bright:1},
    'G minor': {feel:'Dramatic, earnest, serious. More urgent than D minor. Mozart\'s tragic mode.',tension:'High',bright:3},
    'C minor': {feel:'Fate, destiny, darkness with power. Beethoven\'s 5th. Determined suffering.',tension:'Very High',bright:2},
    'F minor': {feel:'Profound, funereal, deep grief. Chopin\'s darkest. Rarely used, always devastating.',tension:'Very High',bright:1},
  },

  genreScales:{
    pop:      ['Major (Ionian)','Natural Minor (Aeolian)','Major Pentatonic'],
    hiphop:   ['Minor Pentatonic','Natural Minor (Aeolian)','Dorian'],
    rnb:      ['Dorian','Minor Pentatonic','Major (Ionian)','Blues Scale'],
    neosoul:  ['Dorian','Mixolydian','Minor Pentatonic','Blues Scale'],
    gospel:   ['Major (Ionian)','Major Pentatonic','Minor Pentatonic','Natural Minor (Aeolian)'],
    jazz:     ['Dorian','Mixolydian','Lydian','Whole Tone','Chromatic','Blues Scale'],
    blues:    ['Blues Scale','Minor Pentatonic','Mixolydian'],
    country:  ['Major Pentatonic','Major (Ionian)','Mixolydian'],
    ss:       ['Major (Ionian)','Natural Minor (Aeolian)','Major Pentatonic'],
    edm:      ['Natural Minor (Aeolian)','Phrygian','Lydian','Major (Ionian)'],
    latin:    ['Phrygian','Dorian','Major (Ionian)','Mixolydian'],
    reggae:   ['Mixolydian','Major Pentatonic','Dorian'],
    reggaeton:['Natural Minor (Aeolian)','Minor Pentatonic','Dorian'],
    altrock:  ['Natural Minor (Aeolian)','Phrygian','Minor Pentatonic','Dorian'],
    afrobeats:['Dorian','Major Pentatonic','Mixolydian'],
    punk:     ['Major (Ionian)','Natural Minor (Aeolian)','Major Pentatonic'],
    kpop:     ['Major (Ionian)','Natural Minor (Aeolian)','Dorian'],
    neosoul:  ['Dorian','Mixolydian','Minor Pentatonic','Blues Scale'],
  },

  progressions:{
    'The Canon':       {prog:'I–V–vi–IV',          feel:'Triumphant, anthemic, universal — the #1 pop progression',         genres:['pop','gospel'],       tension:'Low',  outlier:false},
    'The Minor Wheel': {prog:'i–VII–VI–VII',        feel:'Dark, driving, cyclical — Russian sadness, hip-hop backbone',      genres:['hiphop','altrock'],   tension:'Med',  outlier:false},
    'The Blues 12-Bar':{prog:'I7–IV7–I7–V7–IV7–I7',feel:'Raw, American, inevitable — the founding form of popular music',  genres:['blues','jazz'],       tension:'Med',  outlier:false},
    'The ii–V–I':      {prog:'ii7–V7–Imaj7',        feel:'Jazz resolution — the most sophisticated "going home" in music',  genres:['jazz','neosoul'],     tension:'High→Low',outlier:false},
    'The Andalusian':  {prog:'i–♭VII–♭VI–V',        feel:'Descending Spanish drama — chromatic bass inevitability',         genres:['latin','altrock'],    tension:'High', outlier:true},
    'The Axis':        {prog:'I–V–vi–iii–IV',       feel:'Emotional complexity — common in K-pop and cinematic pop',        genres:['pop','kpop'],         tension:'Med',  outlier:false},
    'Borrowed ♭VII':   {prog:'I–♭VII–IV–I',         feel:'Rock anthem grandeur — unexpected warmth from parallel minor',    genres:['altrock','country'],  tension:'Med',  outlier:true},
    'The Neapolitan':  {prog:'i–iv–♭II–V–i',        feel:'Classical heartbreak — the most devastating cadence sequence',    genres:['tvmusical','pop'],    tension:'V.High',outlier:true},
    'Tritone Slide':   {prog:'ii7–♭II7–Imaj7',      feel:'Jazz chromatic pull — bass descends by half-step twice to home', genres:['jazz','neosoul'],     tension:'High', outlier:true},
    'The Modal Vamp':  {prog:'i–VII (looped)',       feel:'Groove-first hypnosis — neo-soul and Afrobeats foundation',      genres:['neosoul','afrobeats'],tension:'Low',  outlier:false},
    'The Deceptive':   {prog:'I–IV–V–vi',           feel:'False ending — denied resolution creates yearning',              genres:['pop','gospel'],       tension:'High', outlier:true},
    'Gospel Shout':    {prog:'I–IV–I–V–IV–I',       feel:'Church jubilation — call-and-response harmonic structure',       genres:['gospel'],             tension:'Low→High',outlier:false},
    'Chromatic Med':   {prog:'I–♭III–IV',            feel:'Film score wonder — magical non-functional chord jump',          genres:['edm','tvmusical'],    tension:'Med',  outlier:true},
    'The Lydian Float':{prog:'I–II (in Lydian)',     feel:'The #4 shimmer — dreamy, weightless, film-score levitation',    genres:['edm','tvmusical'],    tension:'Low',  outlier:true},
  },

  theoryLevels:{
    standard:    {label:'Standard',     desc:'Diatonic, genre-typical progressions — the proven formulas that work',                  outliers:0},
    adventurous: {label:'Adventurous',  desc:'One strategic harmonic outlier — a borrowed chord or secondary dominant that surprises', outliers:1},
    avantgarde:  {label:'Avant-garde',  desc:'Bold harmonic choices — tritone subs, Neapolitan, chromatic mediants, pedal points',    outliers:3},
  },
};

const SUBSTYLE_NOTES={
  // Hip-Hop regional/era deep notes injected alongside substyleNote
  'G-Funk':      'G-Funk DNA: 90-100 BPM, slow rolling groove. Synthesizer whine (Moog/Roland), P-Funk bass samples (Parliament-Funkadelic). Laid-back West Coast flow — lines stretch over the beat, never rushed. Imagery: Lowriders, sunshine, Crenshaw, Pacific Coast. Nate Dogg-style melodic sung hooks. Suno style: "g-funk, moog synth whine, west coast hip-hop, slow rolling 808, 95 BPM, smooth melodic hook". Artists: Dr. Dre, Snoop Dogg, Warren G, Nate Dogg, Tha Dogg Pound.',
  'Bay Area':    'Bay Area DNA: Hyphy movement — E-40, Mac Dre, Too Short, Mistah F.A.B. High-energy, frenetic delivery contrasted with laid-back Oakland drawl. Slang: hella, thizz, yadadamean, stunna, turf, ghost ride. Ghost riding the whip references. Screwed/chopped variants for slower tracks. Trunk-rattling bass. Suno style: "bay area hip-hop, hyphy, trunk music, 808 bass, hi-energy, Oakland rap". Older Bay flavor: Too Short pimp talk, Digital Underground funk-rap.',
  'Down South':  'Down South / Dirty South DNA: Trunk-rattling slow 808s, Southern drawl, elongated vowels on stressed syllables. Sub-genres: Atlanta (OutKast psychedelic, Goodie Mob soul), Houston (UGK country-rap, Scarface cinematic, DJ Screw chopped), Memphis (Three 6 Mafia dark horror, lo-fi cassette), New Orleans (Cash Money bounce, Master P No Limit tank). Themes: Southern heat, street survival, pride, codeine lean. Suno style varies — "dirty south, 808 bass, southern rap, slow tempo" for Houston; "atlanta rap, psychedelic, live band, funk" for ATL.',
  'Crunk':       'Crunk DNA: Lil Jon / Three 6 Mafia era. Call-and-response crowd shouts. Extremely high energy, short punchy lines. Repetitive hypnotic hooks meant for clubs. Distorted synth stabs. 140-150 BPM. Screamed adlibs throughout. Suno style: "crunk, distorted synth, 808, 145 BPM, club energy, call and response, eastern Kentucky". Artists: Lil Jon, Ying Yang Twins, Three 6 Mafia.',
  'Chopped & Screwed': 'Chopped & Screwed DNA: DJ Screw Houston style. Slowed tempo 60-70 BPM. Pitch-lowered vocals (baritone, syrupy). Repeated bars and phrases ("chopped"). Codeine/lean references. Hypnotic repetition creates trance state. Suno style: "chopped and screwed, slowed houston rap, syrupy 65 BPM, baritone, deep 808, houston texas". Artists: DJ Screw, Z-Ro, Slim Thug, Paul Wall.',
  'East Coast':  'East Coast DNA: New York lyricism tradition. Complex internal rhyme schemes, dense wordplay, cultural references. Jazz/soul samples (Pete Rock, Large Professor, RZA). Boom bap drums, minimal production. 85-95 BPM. Verses carry the song — hooks are functional not melodic. Suno style: "east coast hip-hop, boom bap, jazz sample, vinyl, 90 BPM, new york". Artists: Nas, Jay-Z, Biggie, Rakim, Big L, Mobb Deep, Wu-Tang.',
  'Midwest':     'Midwest DNA: Chicago soul samples (Kanye era), Twista hyperspeed flow, Detroit grit (Big Sean, Royce da 5\'9"), St. Louis bounce. Emotional vulnerability alongside street realism. Chipmunk soul samples. Suno style: "midwest rap, soul sample, chicago, 95 BPM, emotional, chipmunk soul". Artists: Kanye West, Twista, Common, Lupe Fiasco, Chance the Rapper, Big Sean.',
  'Cloud Rap':   'Cloud Rap DNA: Ethereal, atmospheric, lo-fi production. Hazy drum machines, woozy synth pads, reverb-drenched vocals. Existential/introspective themes, often melancholic. Very slow BPM 70-90. Mumbled delivery. Suno style: "cloud rap, ethereal, lo-fi, reverb, atmospheric synths, 80 BPM, dreamy". Artists: Lil B, Bladee, Yung Lean, Carti (early), Bones.',
  // Neo-Soul substyles
  'Classic Neo-Soul':    'Classic Neo-Soul DNA: D\'Angelo / Erykah Badu era. Warm Rhodes piano, upright or Fender bass, live drums with swing (slightly behind the beat). Head-nod groove mandatory. Vocals are conversational and improvised-feeling. Suno style: "neo-soul, Rhodes piano, live drums, swing, 90 BPM, warm vinyl, head-nod groove". Artists: D\'Angelo, Erykah Badu, Maxwell.',
  'Hip-Hop Neo-Soul':    'Hip-Hop Neo-Soul DNA: The Lauryn Hill / Common / J Dilla intersection. Boom bap or Dilla-off-beat drum programming under soulful vocal delivery. Rapped bridges or verses inside a sung structure. Sample-flipped soul. Suno style: "neo-soul, hip-hop drums, J Dilla beat, soul vocal, 85 BPM, vinyl warmth". Artists: Lauryn Hill, Common, Bilal, H.E.R.',
  'Neo-Soul Ballad':     'Neo-Soul Ballad DNA: Slow, intimate, emotionally devastating. Piano-led or sparse Rhodes. Vocal runs that say more than the words. Space between phrases. Minor key tension. Suno style: "neo-soul ballad, piano, 70 BPM, intimate, vulnerable, warm, soul". Artists: Maxwell, Jill Scott, India.Arie.',
  'Afro-Soul':           'Afro-Soul DNA: West African or Afrobeats rhythm underneath neo-soul warmth. Talking drum or shekere percussive bed with Rhodes or kalimba. Spiritual/ancestral themes. Suno style: "afro-soul, talking drum, Rhodes, warm, 95 BPM, Lagos, spiritual, soulful". Artists: Asa, Simi, Tems (ballad side), Erykah Badu (African-influenced).',
  'Lo-Fi Soul':          'Lo-Fi Soul DNA: Vinyl crackle, dusty drum loops, muffled warmth. Chopped soul samples. Bedroom production aesthetic. Introspective and intimate. Suno style: "lo-fi soul, vinyl crackle, dusty drums, muffled, warm, 80 BPM, bedroom production, introspective".',
  'Psychedelic Soul':    'Psychedelic Soul DNA: Sly Stone, early Stevie Wonder, D\'Angelo "Voodoo" — soul meets psychedelia. Layered textures, pitch effects, deep reverb, spiritual/cosmic themes. Exploratory structure. Suno style: "psychedelic soul, funky bass, cosmic, reverb, layers, 95 BPM, voodoo, Sly Stone". Artists: Sly & the Family Stone, early Stevie, D\'Angelo (Voodoo era).',
  // Gospel substyles
  'Traditional Gospel':  'Traditional Gospel DNA: Thomas Dorsey / Mahalia Jackson tradition. Hammond B3 organ is the anchor. Call-and-response between lead and choir. Testimony lyrics (I was broken → God moved → I am free). Building to a shout. Suno style: "traditional gospel, Hammond B3, mass choir, hand claps, call and response, soul, powerful".',
  'Contemporary Gospel': 'Contemporary Gospel DNA: Kirk Franklin, Fred Hammond, Tye Tribbett. Pop and hip-hop production underneath gospel content. 808 bass, modern drums, mass choir stacked harmonies. Celebration energy. Suno style: "contemporary gospel, Kirk Franklin style, 808 bass, mass choir, celebratory, hip-hop gospel, full production".',
  'Worship / CCM':       'Worship/CCM DNA: Hillsong, Chris Tomlin, Bethel Music. Arena rock meets hymn. Corporate worship — songs designed for congregations to sing together. Simple melody, repetitive chorus designed for crowds. Suno style: "worship music, piano, electric guitar, congregational, 75 BPM, soaring, emotional, Hillsong style".',
  'Southern Gospel':     'Southern Gospel DNA: Acoustic quartet harmonies, banjo or acoustic guitar, country-gospel intersection. Shaped-note singing tradition. Narrative testimony. Suno style: "southern gospel, acoustic guitar, four-part harmony, country gospel, warm, testimony".',
  'Gospel Hip-Hop':      'Gospel Hip-Hop DNA: Lecrae, Andy Mineo, KB. Rap flow with gospel message. Trap/boom bap production under spiritual content. Street credibility meets faith testimony. Suno style: "gospel rap, trap beat, 808 bass, conscious lyrics, faith, hip-hop gospel".',
  // Children substyles
  'Singalong / Playful': 'Children\'s Singalong DNA: Maximum participation. Simple repeating phrase as chorus hook. Motion cues embedded (clap, stomp, jump). Major key, bright, 100-120 BPM. The melody must be singable by a 4-year-old in 2 listens. Suno style: "children\'s singalong, ukulele, clapping, bright, joyful, 110 BPM, playful".',
  'Educational':         'Educational Children\'s DNA: The lesson is hidden inside the fun. Count, alphabet, animals, colors, shapes — but approached with wonder not drill. Repetition that teaches. Suno style: "educational children\'s song, acoustic guitar, glockenspiel, clear vocals, 105 BPM, friendly, warm".',
  'Lullaby / Bedtime':   'Lullaby DNA: Descending melody (literally descending — falling intervals calm the nervous system). Slowing tempo verse to verse. Safety and love in every image. Minimal instrumentation. Suno style: "lullaby, soft acoustic guitar, gentle, 60 BPM, warm, soothing, hushed vocals, night, stars".',
  'Silly / Nonsense':    'Silly/Nonsense Children\'s DNA: Pure absurdist fun. Made-up words, tongue twisters, impossible scenarios played completely straight. The laugh IS the lesson — joy is educational. Suno style: "silly children\'s song, bouncy, 115 BPM, playful, bright, ukulele, fun".',
  // Parody substyles
  'Genre Parody':   'Genre Parody DNA: Rewrite a specific song in a specific genre with absurdist/comedic new lyrics. The production must sound 100% authentic to the source genre — the comedy is purely in the lyrical content. Suno style: mirror the original genre exactly. Key rule: commit fully to the genre performance while the lyrics are completely ridiculous.',
  'Pop Parody':     'Pop Parody DNA: Rewrite a mainstream pop song with mundane or absurdist subject matter. Use the original song\'s structure, melody cues, and production style. Subject could be: grocery shopping, Wi-Fi passwords, IKEA assembly. Suno style: "upbeat pop, polished production, major key, 120 BPM" — same as a real pop song.',
  'Rap Parody':     'Rap Parody DNA: Rap verse structure with comedic/absurdist bars. Can parody a specific rap song or rap in general about a non-rap subject. Use real rap flow patterns (16-bar verse, 8-bar hook) with completely deflating subject matter. Suno style: match specific rap era/substyle being parodied.',
  'Ballad Parody':  'Ballad Parody DNA: Soaring dramatic ballad delivery applied to something trivial. The bigger the emotional production, the funnier the trivial subject. Verse builds with restraint, pre-chorus adds tension, chorus erupts in full dramatic glory — all about something like losing your phone charger. Suno style: "epic power ballad, piano, strings, dramatic, emotional, stadium".',
  // Comedy substyles
  'Absurdist':      'Absurdist Comedy DNA: Internal dream-logic. The premise is established early and followed to its extreme conclusion without apology. The world of the song has rules, and those rules are insane. Suno style: match the emotional sincerity of the genre — the music never acknowledges the absurdity.',
  'Dark Comedy':    'Dark Comedy DNA: Finding humor in genuinely dark or uncomfortable situations. The delivery is always casual and upbeat — the contrast between tone and content IS the comedy. Tim Minchin territory. Suno style: "upbeat, cheerful, major key" applied to dark subject matter for maximum tonal contrast.',
  'Satirical':      'Satirical Comedy DNA: Exaggerated social/political commentary through music. The target (institution, behavior, attitude) must be crystal clear. Satire punches at power, not down. Uses genre conventions of the target demographic to increase impact. Suno style: mirror the genre of the demographic being satirized.',
  'Observational':  'Observational Comedy DNA: The universal shared experience of mundane modern life — the frustration of tech support, the anxiety of small talk, the tragedy of dying phone batteries. Relatable specificity is everything. Suno style: "singer-songwriter, acoustic, intimate, conversational" — feels like a friend venting.',
  'Musical Roast':  'Musical Roast DNA: A song specifically aimed at a target (person, brand, idea) written to roast them. Format: verse 1 establishes the target\'s positive self-image, verse 2 demolishes it, bridge is the killing blow, chorus is the repeated accusation. Never cruel — always funny.',
  // TV/Musical substyles
  'TV Theme':       'TV Theme DNA: 30-90 seconds to establish the show\'s entire world — genre, tone, era, class level, emotional register. The hook IS the show title or a defining phrase. Suno style: "catchy TV theme, [show genre tone], memorable, [era]". The audience knows what they\'re watching within 5 seconds.',
  'Broadway / Show Tune': 'Broadway DNA: Character sings what cannot be said in dialogue — the emotional eruption. Clear dramatic objective ("I want" / "I need" / "I feel"). Musical theater diction: precise consonants, open vowels, projected. Suno style: "Broadway musical, show tune, theatrical, orchestral pit band, belting vocals".',
  'Disney-Style':   'Disney DNA: The "I want" song. Character expresses their deepest wish in verse, the world responds in chorus. Magical orchestration. Pure emotional sincerity — no irony. Suno style: "Disney animated film song, orchestral, magical, warm, major key, soaring melody, 120 BPM".',
  'Jingle / Ad':    'Jingle DNA: Product name minimum 3× in 30-60 seconds. Problem in verse (pain point), product = solution in chorus. Benefit not feature. Melody sticky enough to remember after one listen. Suno style: "upbeat commercial jingle, major key, catchy, corporate, polished, radio-ready".',
  'Sitcom Theme':   'Sitcom Theme DNA: 30-60 seconds. Warm, inviting, tells you this is a safe fun place. Often summarizes the show\'s premise. Major key, upbeat tempo, memorable chorus. Era-appropriate production. Suno style: "sitcom theme, warm, upbeat, [era: 90s/2000s/modern], feel-good, catchy melody".',
  'Prestige Drama Theme': 'Prestige Drama Theme DNA: Atmospheric, sparse, foreboding or melancholic. Establishes stakes and tone. Minor key or modal. Often instrumental or near-instrumental. Suno style: "prestige TV theme, cinematic, atmospheric, [mood: dark/cold/intense], strings, piano, sparse, HBO-style".',
};

// Substyle-specific Suno production tags — injected as a hard constraint into SONG PROMPT
// to prevent genre drift (e.g. G-Funk defaulting to dark trap)
const SUBSTYLE_SUNO = {
  // Hip-Hop regional/era
  'G-Funk':             'g-funk, moog synth whine, west coast hip-hop, slow rolling 808, 95 BPM, smooth melodic hook',
  'Bay Area':           'bay area hip-hop, hyphy, trunk music, 808 bass, hi-energy, Oakland rap, 100 BPM',
  'Down South':         'dirty south, slow rolling 808 bass, southern rap, deep drawl, 85 BPM',
  'Crunk':              'crunk, distorted synth stabs, 808 bass, 145 BPM, club energy, screamed call and response',
  'Chopped & Screwed':  'chopped and screwed, slowed houston rap, syrupy 65 BPM, pitch-lowered baritone, deep 808',
  'Trap':               'trap, 808 bass, hard snare, rolling hi-hats, 140 BPM, dark atmospheric',
  'Boom Bap':           'boom bap, vinyl crackle, jazz sample, hard kick, 90 BPM, new york classic',
  'Melodic Rap':        'melodic rap, lush atmospheric production, auto-tune vocals, 120 BPM, emotional',
  'Drill':              'uk drill, sliding 808 bass, off-beat hi-hats, dark minimal production, 140 BPM, menacing',
  'East Coast':         'east coast hip-hop, boom bap, jazz sample, vinyl crackle, 90 BPM, new york lyrical',
  'Midwest':            'midwest rap, chipmunk soul sample, chicago hip-hop, 95 BPM, emotional vulnerability',
  'Cloud Rap':          'cloud rap, ethereal haze, lo-fi drum machine, deep reverb, atmospheric synth pads, 80 BPM',
  'Lyrical/Conscious':  'conscious hip-hop, boom bap, jazz-inflected sample, cerebral, 90 BPM, lyrical density',
  'Old School':         'old school hip-hop, boom bap, scratch DJ, vinyl sample loop, 95 BPM, classic 90s',
  // Neo-Soul
  'Classic Neo-Soul':   'neo-soul, Rhodes electric piano, live drums with swing, upright bass, warm vinyl warmth, head-nod groove, 90 BPM',
  'Hip-Hop Neo-Soul':   'neo-soul, J Dilla off-beat hip-hop drums, soul vocals, vinyl warmth, 85 BPM',
  'Neo-Soul Ballad':    'neo-soul ballad, piano, intimate close-mic vocal, vulnerable, warm, 70 BPM',
  'Afro-Soul':          'afro-soul, talking drum, Rhodes piano, kalimba, West African rhythm, spiritual, 95 BPM',
  'Lo-Fi Soul':         'lo-fi soul, vinyl crackle, dusty drum loop, muffled warmth, chopped soul sample, 80 BPM',
  'Psychedelic Soul':   'psychedelic soul, funky bass, cosmic reverb, layered textures, pitch effects, 95 BPM',
  // Gospel
  'Traditional Gospel': 'traditional gospel, Hammond B3 organ, mass choir, hand claps, call and response, powerful soul',
  'Contemporary Gospel':'contemporary gospel, Kirk Franklin style, 808 bass, mass choir, celebratory, hip-hop gospel production',
  'Worship / CCM':      'worship music, piano, electric guitar, congregational singalong, soaring emotional, 75 BPM',
  'Southern Gospel':    'southern gospel, acoustic guitar, four-part close harmony, country gospel warmth, testimony',
  'Gospel Hip-Hop':     'gospel rap, trap beat, 808 bass, conscious faith lyrics, hip-hop gospel, street credibility',
  // Bossa Nova substyles
  'Classic Bossa':      'bossa nova, nylon string guitar, upright bass, brushed drums, intimate vocal, jazz harmony, 100 BPM',
  'Jazz Bossa':         'bossa nova jazz, Stan Getz saxophone, vibraphone, cool jazz, nylon guitar, 105 BPM',
  // Dancehall
  'Classic Dancehall':  'dancehall, digital riddim, reggae, patois vocals, 90 BPM, Kingston Jamaica',
  'Modern Dancehall':   'modern dancehall, trap hi-hats, 808 bass, dancehall riddim, 95 BPM, Caribbean',
  // Bollywood
  'Romantic Bollywood': 'bollywood romantic, lush orchestral strings, melodic vocals with ornaments, 75 BPM, cinematic',
  'Item Number':        'bollywood item number, brass stabs, uptempo percussion, 125 BPM, dance floor, bold',
  // C-Pop
  'Mandopop':           'mandopop, pentatonic melody, piano, soft production, 95 BPM, Mandarin pop, sweet',
  'Modern C-Pop':       'c-pop, pentatonic hook, modern production, 808 bass, 110 BPM, idol pop',
  // Amapiano
  'Classic Amapiano':   'amapiano, log drum bass, piano keys, South African house, 110 BPM, Johannesburg',
  'Vocal Amapiano':     'amapiano, log drum, vocal chant, piano riff, South African, 112 BPM, soulful',
};

const STRUCTURES={
  // ── General ──────────────────────────────────────────────────────────────
  standard:     '[Verse 1] → [Pre-Chorus] → [Chorus] → [Verse 2] → [Pre-Chorus] → [Chorus] → [Bridge] → [Chorus] → [Outro]',
  hookfirst:    '[Hook] → [Verse 1] → [Hook] → [Verse 2] → [Bridge] → [Hook] → [Outro]',
  chorusfirst:  '[Chorus] → [Verse 1] → [Pre-Chorus] → [Chorus] → [Verse 2] → [Pre-Chorus] → [Chorus] → [Bridge] → [Final Chorus]',
  storytelling: '[Intro] → [Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Verse 3] → [Chorus] → [Outro]',
  minimal:      '[Intro] → [Verse] → [Hook] → [Verse] → [Hook] → [Hook] → [Outro]',
  epic:         '[Intro] → [Verse 1] → [Pre-Chorus] → [Chorus] → [Verse 2] → [Pre-Chorus] → [Chorus] → [Bridge] → [Break] → [Chorus] → [Outro]',
  doublechorus: '[Verse 1] → [Pre-Chorus] → [Chorus] → [Chorus] → [Verse 2] → [Pre-Chorus] → [Chorus] → [Chorus] → [Bridge] → [Final Chorus] → [Final Chorus]',
  verseonly:    '[Intro] → [Verse 1] → [Verse 2] → [Verse 3] → [Verse 4] → [Outro]',
  aaba:         '[A Section] → [A Section] → [B Bridge] → [A Section]',
  ballad:       '[Intro] → [Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Breakdown] → [Key Change] → [Final Chorus]',
  edm:          '[Intro] → [Build] → [Drop] → [Breakdown] → [Build] → [Drop] → [Outro]',
  viral:        '[Hook (0:00)] → [Verse] → [Pre-Chorus] → [Hook] → [Bridge] → [Final Hook]',
  // ── Genre-specific ───────────────────────────────────────────────────────
  hiphop_classic:      '[4-bar Intro | Beat Only] → [16-bar Verse 1 | Rap Verse] → [8-bar Hook] → [16-bar Verse 2 | Rap Verse] → [8-bar Hook] → [16-bar Verse 3 | Rap Verse] → [8-bar Hook] → [4-bar Outro]',
  hiphop_trap:         '[4-bar Intro | Beat Only] → [8-bar Hook] → [12-bar Verse 1 | Rap Verse] → [8-bar Hook] → [12-bar Verse 2 | Rap Verse] → [8-bar Hook] → [8-bar Hook] → [4-bar Outro | Ad-libs]',
  hiphop_beatswitch:   '[4-bar Intro | Beat Only] → [8-bar Hook] → [16-bar Verse 1 | Rap Verse] → [8-bar Hook] → [16-bar Verse 2 | Rap Verse] → [Beat Switch] → [16-bar Verse 3 | Triplet Flow] → [8-bar Final Hook] → [Outro | Fade-Out]',
  hiphop_storytelling: '[8-bar Intro | Spoken Word] → [24-bar Verse 1 | Rap Verse] → [24-bar Verse 2 | Rap Verse] → [24-bar Verse 3 | Rap Verse] → [8-bar Outro]',
  hiphop_melodic:      '[4-bar Intro] → [8-bar Hook | Melodic | Sung] → [16-bar Verse 1 | Rap Verse] → [8-bar Hook | Sung] → [16-bar Verse 2 | Rap Verse] → [8-bar Bridge | Sung] → [8-bar Final Hook | Sung | stacked harmonies] → [Outro | Fade-Out]',
  riddim:       '[Intro] → [Verse 1] → [Hook] → [Verse 2] → [Hook] → [Dub Break] → [Verse 3] → [Hook] → [Outro Vamp]',
  afrobeats:    '[Intro] → [Verse 1] → [Hook] → [Verse 2] → [Hook] → [Ad-lib Break] → [Hook] → [Outro Vamp]',
  gospel:       '[Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Bridge] → [Vamp] → [Outro Ad-lib]',
  kpop:         '[Intro] → [Verse 1] → [Pre-Chorus] → [Chorus] → [Verse 2] → [Pre-Chorus] → [Chorus] → [Rap Break] → [Bridge] → [Key Change +1] → [Final Chorus] → [Outro]',
};

const FUSION_DATA={
  'Pop+Hip-Hop':{name:'Pop-Rap',tip:'Never rap the chorus. Contrast between rapped verse and sung hook IS the formula.',q:{overall:95,compat:95,structural:90,commercial:96}},
  'Pop+R&B':{name:'Neo-Soul Pop',tip:'Add ad-libs under chorus and melismatic bridge.',q:{overall:93,compat:92,structural:88,commercial:94}},
  'Pop+Rock':{name:'Arena Pop',tip:'Guitar solo as bridge. Keep verse pop, let chorus explode.',q:{overall:90,compat:88,structural:85,commercial:92}},
  'Pop+Country':{name:'Country Pop',tip:'Story matters as much as hook. 2nd verse must deepen, not repeat.',q:{overall:91,compat:89,structural:86,commercial:93}},
  'Pop+EDM':{name:'Dance Pop',tip:'Drop should remove all verse instruments — create empty space before the hit.',q:{overall:94,compat:93,structural:92,commercial:95}},
  'Pop+Alt-Rock':{name:'Alternative Pop',tip:'Minimal production in verse, maximalist bass on chorus.',q:{overall:92,compat:90,structural:88,commercial:93}},
  'Pop+Reggae':{name:'Reggae Pop',tip:'Keep the offbeat skank — it is the genre identifier. Everything else can flex.',q:{overall:85,compat:82,structural:80,commercial:88}},
  'Pop+Afrobeats':{name:'Afropop Crossover',tip:'The groove IS the hook. Repeat more than feels comfortable.',q:{overall:93,compat:91,structural:89,commercial:94}},
  'Pop+Singer-Songwriter':{name:'Confessional Pop',tip:'Let the lyric carry weight. Keep production intimate even on chorus.',q:{overall:89,compat:87,structural:84,commercial:90}},
  'Hip-Hop+R&B':{name:'Melodic Rap',tip:'Hook must feel completely different from verse — contrast is the entire point.',q:{overall:97,compat:97,structural:95,commercial:97}},
  'Hip-Hop+Rock':{name:'Rap-Rock',tip:'Verse should feel aggressive even before chorus. Staccato flow works best.',q:{overall:82,compat:78,structural:80,commercial:83}},
  'Hip-Hop+Country':{name:'Country Trap',tip:'The cultural tension IS the appeal. Lean into the seams.',q:{overall:80,compat:72,structural:75,commercial:88}},
  'Hip-Hop+Reggae':{name:'Reggae Rap',tip:'Decide: roots one-drop (spiritual) or dancehall riddim (modern energy).',q:{overall:84,compat:82,structural:80,commercial:82}},
  'Hip-Hop+Singer-Songwriter':{name:'Folk Rap',tip:'Lyric has to be elite to hold attention without a big production hook.',q:{overall:86,compat:80,structural:82,commercial:82}},
  'Hip-Hop+Blues':{name:'Blues Rap',tip:'AAB lyric form maps directly to rap bar structure.',q:{overall:82,compat:78,structural:82,commercial:78}},
  'Hip-Hop+Alt-Rock':{name:'Alt Hip-Hop',tip:'Production is the art — be as adventurous with the beat as with the bars.',q:{overall:85,compat:80,structural:82,commercial:80}},
  'R&B+Rock':{name:'Soul-Rock',tip:'Live drum feel essential. Guitar should respond to vocalist conversationally.',q:{overall:84,compat:82,structural:80,commercial:82}},
  'R&B+Reggae':{name:'Lovers Rock',tip:'Lovers rock is the gentlest reggae — no politics, pure romance.',q:{overall:80,compat:80,structural:78,commercial:78}},
  'R&B+Singer-Songwriter':{name:'Neo-Soul',tip:'Let silence be an instrument. Neo-soul breathes — never fill every space.',q:{overall:86,compat:84,structural:82,commercial:80}},
  'R&B+Blues':{name:'Soul-Blues',tip:'Go for emotional nakedness above polish. This IS the origin of soul.',q:{overall:88,compat:88,structural:84,commercial:82}},
  'R&B+Afrobeats':{name:'Afro-R&B',tip:'Let the groove dictate vocal phrasing — never fight the rhythm.',q:{overall:90,compat:89,structural:86,commercial:90}},
  'Rock+Singer-Songwriter':{name:'Confessional Rock',tip:'The guitar solo should feel like a confession, not a display.',q:{overall:84,compat:82,structural:80,commercial:83}},
  'Rock+Reggae':{name:'Reggae Rock',tip:'Sublime formula: ska/reggae feel + punk directness + melodic chorus.',q:{overall:82,compat:78,structural:76,commercial:82}},
  'Rock+Blues':{name:'Blues-Rock',tip:'The guitar solo is a verse here, not decoration — write it as a narrative.',q:{overall:90,compat:92,structural:88,commercial:86}},
  'Rock+Punk':{name:'Pop-Punk',tip:'Sweet spot: melodic enough for radio, fast enough for mosh pit.',q:{overall:86,compat:84,structural:82,commercial:88}},
  'Rock+Alt-Rock':{name:'Post-Rock',tip:'Build for 4-6 minutes. The payoff must be worth the journey.',q:{overall:84,compat:88,structural:80,commercial:76}},
  'Country+Singer-Songwriter':{name:'Americana',tip:'Americana prizes authenticity. Let uncomfortable truths stay uncomfortable.',q:{overall:88,compat:90,structural:85,commercial:82}},
  'Country+Blues':{name:'Country Blues',tip:'This IS the origin of country music. Strip back to voice and guitar.',q:{overall:86,compat:88,structural:84,commercial:80}},
  'Singer-Songwriter+Alt-Rock':{name:'Indie Folk',tip:'Bon Iver: falsetto + layered instruments + cryptic lyric = cult classic.',q:{overall:88,compat:86,structural:84,commercial:80}},
  'Singer-Songwriter+Reggae':{name:'Acoustic Reggae',tip:'Jack Johnson sits exactly here. Warm, organic, unhurried.',q:{overall:80,compat:78,structural:76,commercial:80}},
  'Singer-Songwriter+Blues':{name:'Delta Soul',tip:'Nick Drake lives here. Fingerpicked guitar, no drums, vocal in the room.',q:{overall:82,compat:84,structural:80,commercial:74}},
  'Alt-Rock+Blues':{name:'Indie Blues',tip:'Jack White: 2 instruments max, maximum emotion from minimum tools.',q:{overall:88,compat:86,structural:84,commercial:82}},
  'Alt-Rock+Punk':{name:'Post-Punk',tip:'Joy Division: slow punk + bass as lead + desperation = most influential post-punk.',q:{overall:86,compat:88,structural:82,commercial:78}},
  'Reggae+Blues':{name:'Roots Reggae Soul',tip:'Burning Spear sits here. Historical consciousness, groove as prayer.',q:{overall:80,compat:78,structural:78,commercial:72}},
  'Reggae+Punk':{name:'Ska-Punk',tip:'Horn section is non-negotiable. Specify "ska horns, trumpet, trombone" in Suno.',q:{overall:82,compat:80,structural:78,commercial:80}},
  'Pop+K-Pop':{name:'Global Pop',tip:'Pre-chorus is what separates K-pop-influenced pop from standard pop. Never skip it.',q:{overall:95,compat:94,structural:92,commercial:96}},
  'K-Pop+R&B':{name:'K-R&B',tip:'The contrast between crisp K-pop production and warm R&B chords is the entire appeal.',q:{overall:91,compat:89,structural:88,commercial:90}},
  'K-Pop+Hip-Hop':{name:'K-Hip-Hop',tip:'The rap break must be in Korean or Konglish to land authentically. It earns the chorus payoff.',q:{overall:93,compat:91,structural:90,commercial:92}},
  'K-Pop+EDM':{name:'K-Pop Dance',tip:'The chorus IS the drop. Remove everything on the pre-chorus last bar — silence before the hit.',q:{overall:94,compat:92,structural:91,commercial:94}},
  'K-Pop+Latin':{name:'K-Latin',tip:'BTS "Butter" sits here. Brass stabs + K-pop structure + Latin-adjacent groove = pure crossover.',q:{overall:90,compat:87,structural:86,commercial:92}},
  'K-Pop+Reggaeton':{name:'K-Reggaeton',tip:'Multilingual (Korean + Spanish) is increasingly common and commercially explosive. Lean in.',q:{overall:89,compat:86,structural:84,commercial:91}},
  'K-Pop+Alt-Rock':{name:'K-Rock',tip:'The pre-chorus still matters — just use guitars to build it instead of synths.',q:{overall:86,compat:84,structural:83,commercial:85}},
  'K-Pop+Afrobeats':{name:'K-Afro',tip:'Two of the most global genres combining. Groove-first production, precision chorus.',q:{overall:88,compat:85,structural:83,commercial:89}},
  'Blues+Punk':{name:'Garage Rock',tip:'White Stripes: two instruments, blues structures + punk spirit.',q:{overall:84,compat:82,structural:80,commercial:76}},
  'Hip-Hop+Latin':{name:'Latin Rap',tip:'Language switching mid-line is a superpower — use it. The beat carries the crossover.',q:{overall:92,compat:90,structural:88,commercial:93}},
  'Hip-Hop+Reggaeton':{name:'Trap Latino',tip:'Bad Bunny owns this — moody, minimal, 808s huge, lyrics raw. Dembow AND trap rhythms layered.',q:{overall:96,compat:94,structural:92,commercial:96}},
  'Pop+Latin':{name:'Latin Pop',tip:'Bilingual chorus outperforms monolingual on streaming globally. Spanish hook + English verse is the …',q:{overall:90,compat:88,structural:86,commercial:92}},
  'Pop+Reggaeton':{name:'Reggaeton Pop',tip:'"Despacito" is the masterclass: pop accessibility + reggaeton groove + bilingual hook = 8 billion st…',q:{overall:95,compat:93,structural:90,commercial:96}},
  'R&B+Latin':{name:'Latin R&B',tip:'Bachata guitar + R&B chord progressions = Romeo Santos. The smoothest crossover in Latin music.',q:{overall:88,compat:87,structural:84,commercial:89}},
  'R&B+Reggaeton':{name:'Reggaeton Romántico',tip:'Let the vocals be melodic and tender — the dembow handles all the aggression.',q:{overall:91,compat:90,structural:87,commercial:92}},
  'Latin+Reggaeton':{name:'Urban Latino',tip:'This IS modern latin music. 90 BPM, dembow, melodic hook, Spanish lyrics = streaming gold.',q:{overall:94,compat:95,structural:90,commercial:95}},
  'Latin+Pop':{name:'Latin Pop Crossover',tip:'Never apologise for the accent or the language. The otherness IS the appeal.',q:{overall:90,compat:89,structural:86,commercial:92}},
  'Reggaeton+Afrobeats':{name:'Afro-Reggaeton',tip:'Both genres are groove-first. Let the rhythm lead — lyrics are secondary to the feel.',q:{overall:88,compat:85,structural:83,commercial:88}},
  'Reggaeton+R&B':{name:'Urbano Romántico',tip:'The most commercially successful reggaeton of the 2020s lives here. Smooth, melodic, modern.',q:{overall:92,compat:91,structural:88,commercial:93}},
  // Neo-Soul fusions
  'Neo-Soul+Pop':{name:'Soul Pop',tip:'The groove must breathe — never quantize the drums fully. Let imperfection create intimacy.',q:{overall:91,compat:89,structural:87,commercial:91},artists:'H.E.R., SZA, Jorja Smith, Frank Ocean',formula:'Neo-soul warmth + pop hooks = the smoothest lane in modern music. Rhodes piano under a singable chorus.'},
  'Neo-Soul+Hip-Hop':{name:'Hip-Hop Soul',tip:'J Dilla beat + neo-soul vocal = the blueprint. Let the drums swing behind the beat, never on it.',q:{overall:96,compat:95,structural:92,commercial:93},artists:'Lauryn Hill, Common, D\'Angelo, Frank Ocean, Bilal',formula:'Hip-hop production values meet neo-soul vocal vulnerability. Head-nod drums + Rhodes + sung hook.'},
  'Neo-Soul+R&B':{name:'Contemporary R&B',tip:'This IS what modern R&B is. Space, ad-libs, imperfection. Never fill every bar.',q:{overall:94,compat:95,structural:90,commercial:92},artists:'SZA, Frank Ocean, H.E.R., Daniel Caesar, Jhené Aiko',formula:'The most natural fusion in music. Neo-soul\'s groove-first DNA meets R&B\'s melody and emotion.'},
  'Neo-Soul+Jazz':{name:'Jazz Soul',tip:'Let the chord extensions breathe — neo-soul harmony is jazz made accessible. Don\'t resolve everything.',q:{overall:88,compat:90,structural:84,commercial:80},artists:'Erykah Badu, Esperanza Spalding, Robert Glasper, Ambrose Akinmusire',formula:'Jazz sophistication — extended chords, improvisation — filtered through neo-soul\'s warmth and groove.'},
  'Neo-Soul+Gospel':{name:'Gospel Soul',tip:'The testimony verse + neo-soul groove + gospel bridge vamp = the most emotionally devastating structure.',q:{overall:92,compat:93,structural:88,commercial:86},artists:'Tems, Kirk Franklin, India.Arie, Jill Scott, Marvin Gaye',formula:'Gospel\'s emotional architecture (testimony → declaration → vamp) fused with neo-soul\'s groove and intimacy.'},
  'Neo-Soul+Afrobeats':{name:'Afro-Soul',tip:'Two groove-first genres. Let the rhythm hold everything — melody is secondary to feel.',q:{overall:90,compat:88,structural:86,commercial:89},artists:'Tems, Asa, Simi, Burna Boy, Adekunle Gold',formula:'West African polyrhythm meets neo-soul warmth. The talking drum and Rhodes piano is the formula.'},
  // Gospel fusions
  'Gospel+Pop':{name:'Inspirational Pop',tip:'The testimony arc (I was → now I am) works in any key. Keep the production pop, let the message be gospel.',q:{overall:89,compat:87,structural:85,commercial:91},artists:'Lauren Daigle, For King & Country, Tasha Cobbs, Tauren Wells',formula:'Pop production accessibility with gospel emotional architecture. Commercial without compromising the message.'},
  'Gospel+R&B':{name:'Gospel R&B',tip:'The melismatic run must feel earned — deploy it at the bridge payoff, not throughout.',q:{overall:90,compat:91,structural:87,commercial:88},artists:'Mary J. Blige, BeBe Winans, Beyoncé, Fantasia, Yolanda Adams',formula:'R&B smoothness carrying gospel emotional weight. The bridge vamp is where both genres peak simultaneously.'},
  'Gospel+Hip-Hop':{name:'Gospel Rap',tip:'The 16-bar testimony verse leads into an 8-bar gospel chorus. Contrast is everything.',q:{overall:88,compat:85,structural:84,commercial:87},artists:'Lecrae, Kanye West, Andy Mineo, Chance the Rapper, KB',formula:'Hip-hop\'s street credibility carries gospel\'s testimony. The beat makes you move, the message makes you feel.'},
  'Gospel+Country':{name:'Southern Gospel',tip:'The acoustic quartet tradition is ancient and powerful. Four-part harmony over simple guitar is timeless.',q:{overall:84,compat:86,structural:82,commercial:80},artists:'Alan Jackson, Dolly Parton (gospel), Gaither Vocal Band',formula:'Country storytelling + gospel testimony arc = Americana spiritual. Simple, honest, devastating.'},
  'Gospel+Soul':{name:'Classic Soul Gospel',tip:'This is where soul music was born — Aretha Franklin\'s church training became popular music. Never separate them.',q:{overall:93,compat:96,structural:90,commercial:87},artists:'Aretha Franklin, Sam Cooke, Stevie Wonder, Al Green',formula:'The origin point of all Black American music. Soul IS gospel made secular. The vamp outro is mandatory.'},
  // Country fusions
  'Country+Pop':{name:'Country Pop',tip:'Story matters as much as hook. The 2nd verse must deepen emotionally, not repeat the first.',q:{overall:92,compat:90,structural:87,commercial:94},artists:'Taylor Swift, Kacey Musgraves, Carrie Underwood, Sam Hunt'},
  'Country+Hip-Hop':{name:'Country Trap',tip:'The cultural tension IS the appeal. Lean into the seams — don\'t smooth them out.',q:{overall:82,compat:74,structural:76,commercial:88},artists:'Lil Nas X, Blanco Brown, Colt Ford, Nelly + Tim McGraw'},
  'Country+R&B':{name:'Country Soul',tip:'The rawness of country storytelling + the emotional depth of R&B = completely underexplored territory.',q:{overall:84,compat:80,structural:82,commercial:82},artists:'Darius Rucker, Mickey Guyton, Brittney Spencer, Beyoncé (Cowboy Carter)'},
  'Country+Folk':{name:'Americana',tip:'Americana prizes authenticity above all. Let uncomfortable truths stay uncomfortable.',q:{overall:89,compat:92,structural:86,commercial:83},artists:'Sturgill Simpson, Americana · Chris Stapleton, Brandi Carlile, Jason Isbell'},
  // Jazz fusions
  'Jazz+Pop':{name:'Jazz Pop',tip:'The jazz harmony is the texture, not the structure. Keep the pop song intact — enrich the chords.',q:{overall:84,compat:80,structural:82,commercial:83},artists:'Diana Krall, Jamie Cullum, Norah Jones, Michael Bublé'},
  'Jazz+R&B':{name:'Jazz R&B',tip:'Robert Glasper blueprint: jazz musician plays R&B groove = smoothest crossover in modern music.',q:{overall:88,compat:87,structural:85,commercial:82},artists:'Robert Glasper, Thundercat, Kendrick Lamar (To Pimp A Butterfly), Kamasi Washington'},
  'Jazz+Hip-Hop':{name:'Jazz Rap',tip:'The jazz sample is not decoration — it IS the beat. Build the track around one perfectly chosen moment.',q:{overall:90,compat:86,structural:88,commercial:82},artists:'A Tribe Called Quest, Kendrick Lamar, Robert Glasper, Flying Lotus, Madlib'},
  'Jazz+Soul':{name:'Soul Jazz',tip:'Jimmy Smith, Ray Charles, Stevie Wonder — the organ is the bridge between jazz and soul.',q:{overall:87,compat:88,structural:84,commercial:78},artists:'Jimmy Smith, Ray Charles, Stevie Wonder, Charles Brown'},
  'Jazz+Blues':{name:'Blues Jazz',tip:'The 12-bar and the ii-V-I are cousins. The bebop solo over a shuffle groove is the formula.',q:{overall:85,compat:88,structural:83,commercial:72},artists:'Cannonball Adderley, Mose Allison, Ray Charles, B.B. King + jazz'},
  'Pop+Jazz':{name:'Jazz Pop',tip:'The jazz chord under a pop melody creates instant sophistication. One unexpected substitution per chorus.',q:{overall:84,compat:80,structural:82,commercial:83},artists:'Norah Jones, Diana Krall, Amy Winehouse, Harry Connick Jr.'},
  // Pop missing
  'Pop+Blues':{name:'Blues Pop',tip:'Amy Winehouse owned this — raw blues emotion under a radio-ready hook. Never sand down the grit.',q:{overall:85,compat:83,structural:82,commercial:86},artists:'Amy Winehouse, Gary Clark Jr., Gary Jules, Duffy'},
  'Pop+Punk':{name:'Pop-Punk',tip:'Sweet spot: melodic enough to sing along, fast enough to mosh. Chorus must be the release after verse tension.',q:{overall:88,compat:86,structural:84,commercial:90},artists:'Green Day, Paramore, Fall Out Boy, Olivia Rodrigo, blink-182'},
  // Hip-Hop missing
  'Hip-Hop+EDM':{name:'Trap EDM',tip:'The 808 bass and the EDM drop are the same energy. Let them collide at the chorus, not compete.',q:{overall:86,compat:84,structural:83,commercial:89},artists:'The Chainsmokers, Travis Scott, DJ Snake, Future'},
  'Hip-Hop+Afrobeats':{name:'Afro-Trap',tip:'Two of the highest-streaming genres on the planet. The groove leads — bars ride on top of it, never fight it.',q:{overall:91,compat:90,structural:87,commercial:93},artists:'WizKid, Drake, Burna Boy, Davido, Popcaan'},
  'Hip-Hop+Punk':{name:'Rap-Punk',tip:'Rage is the shared language. The punk energy goes in the production; the bars carry the complexity.',q:{overall:74,compat:70,structural:72,commercial:76},artists:'Death Grips, Ho99o9, Ghostemane, $uicideboy$'},
  // R&B missing
  'R&B+EDM':{name:'Electronic R&B',tip:'The Weeknd blueprint: atmospheric synths + R&B vocal vulnerability = the biggest sound of the 2010s.',q:{overall:88,compat:86,structural:84,commercial:90},artists:'The Weeknd, Doja Cat, FKA Twigs, Miguel, Tinashe'},
  'R&B+Alt-Rock':{name:'Alt R&B',tip:'FKA Twigs territory — the guitar is dissonant, the vocal is smooth. Tension between production and voice IS the art.',q:{overall:84,compat:80,structural:82,commercial:82},artists:'FKA Twigs, Frank Ocean, Blood Orange, Steve Lacy, Solange'},
  'R&B+Punk':{name:'Post-R&B Punk',tip:'Extremely experimental — use the punk tempo and attitude, keep R&B vocal smoothness. Jarring contrast is the point.',q:{overall:70,compat:65,structural:68,commercial:70},artists:'Blood Orange, Standing On The Corner, serpentwithfeet'},
  // Neo-Soul missing
  'Neo-Soul+Blues':{name:'Soul Blues',tip:'Both genres live in the space between notes. Play the rests. The groove IS the silence.',q:{overall:90,compat:92,structural:87,commercial:80},artists:'Gary Clark Jr., Robert Glasper, Raphael Saadiq, Janelle Monáe'},
  'Neo-Soul+Singer-Songwriter':{name:'Acoustic Soul',tip:'Phoebe Bridgers with a Rhodes piano. Intimate, vulnerable, unhurried. Never rush a phrase.',q:{overall:85,compat:84,structural:82,commercial:80},artists:'India.Arie, Ben Harper, José James, Eric Benet'},
  'Neo-Soul+Alt-Rock':{name:'Indie Soul',tip:'Jeff Buckley lives here. Falsetto over dissonant guitar chords = the most devastatingly emotional fusion.',q:{overall:82,compat:78,structural:80,commercial:78},artists:'Jeff Buckley, TV on the Radio, Lianne La Havas, Moses Sumney'},
  'Neo-Soul+Reggae':{name:'Roots Soul',tip:'Both genres share the one-drop groove. The offbeat bass guitar and the Rhodes piano are natural siblings.',q:{overall:82,compat:80,structural:78,commercial:76},artists:'Sade, Erykah Badu, Floetry, Corinne Bailey Rae'},
  'Neo-Soul+Latin':{name:'Latin Soul',tip:'Bossa nova + neo-soul = the warmest sound imaginable. Let the nylon guitar and the Rhodes share the melody.',q:{overall:82,compat:80,structural:78,commercial:80},artists:'Bebel Gilberto, Corinne Bailey Rae, José James, Esperanza Spalding'},
  'Neo-Soul+Reggaeton':{name:'Urban Soul',tip:'Let the dembow rhythm run underneath a completely smooth neo-soul vocal. The contrast is the entire appeal.',q:{overall:76,compat:72,structural:74,commercial:78},artists:'Jhené Aiko, PARTYNEXTDOOR, Teyana Taylor'},
  'Neo-Soul+Country':{name:'Country Soul',tip:'Both genres prize emotional honesty above production polish. The slide guitar and the Rhodes speak the same language.',q:{overall:74,compat:70,structural:72,commercial:72},artists:'Gary Clark Jr., Valerie June, Brittney Spencer, Leon Bridges'},
  'Neo-Soul+K-Pop':{name:'K-Soul',tip:'K-pop precision + neo-soul imperfection = a fascinating tension. The pre-chorus is where neo-soul breathes into K-pop structure.',q:{overall:80,compat:76,structural:78,commercial:84},artists:'BTS (soul-influenced tracks), IU, MAMAMOO, Dean'},
  'Neo-Soul+EDM':{name:'Future Soul',tip:'Chopped soul samples + electronic production = the J Dilla → James Blake continuum. Leave space in the beat.',q:{overall:80,compat:76,structural:78,commercial:80},artists:'James Blake, Kaytranada, Disclosure, FKA Twigs'},
  'Neo-Soul+Punk':{name:'Soul Punk',tip:'Extremely experimental. The neo-soul restraint and punk fury cancel each other into something genuinely strange.',q:{overall:66,compat:60,structural:64,commercial:64},artists:'TV on the Radio, Bloc Party (early), Santigold'},
  // Gospel missing
  'Gospel+Jazz':{name:'Sacred Jazz',tip:'Both genres reach for transcendence through improvisation. The vamp IS the jazz solo is the church shout.',q:{overall:90,compat:92,structural:86,commercial:76},artists:'Wynton Marsalis, Coltrane (A Love Supreme), Alice Coltrane, Kirk Franklin'},
  'Gospel+Blues':{name:'Gospel Blues',tip:'These are the same music. The delta blues IS the slave spiritual made secular. Strip it back and let the voice carry everything.',q:{overall:92,compat:95,structural:88,commercial:78},artists:'Thomas Dorsey, Sister Rosetta Tharpe, Mavis Staples, Al Green'},
  'Gospel+Afrobeats':{name:'Afro-Gospel',tip:'West African praise tradition meets American gospel testimony. Polyrhythm under the call-and-response = pure spiritual joy.',q:{overall:88,compat:87,structural:84,commercial:84},artists:'Sinach, Nathaniel Bassey, Joe Mettle, Dunsin Oyekan'},
  'Gospel+Reggae':{name:'Roots Gospel',tip:'Reggae\'s one-drop rhythm under a gospel testimony lyric. Bob Marley\'s Rastafari spirituality lives exactly here.',q:{overall:82,compat:82,structural:79,commercial:76},artists:'Bob Marley, Third Day, Israel Houghton, Kirk Franklin'},
  'Gospel+Singer-Songwriter':{name:'Worship Folk',tip:'The acoustic worship song is the most intimate gospel form. One voice, one guitar, total emotional exposure.',q:{overall:84,compat:84,structural:82,commercial:82},artists:'Chris Tomlin (acoustic), Audrey Assad, Sandra McCracken, Josh Garrels'},
  'Gospel+Alt-Rock':{name:'Christian Rock',tip:'The sonic volume of rock carrying the spiritual weight of gospel. The chorus must feel like the release of a prayer.',q:{overall:82,compat:80,structural:80,commercial:84},artists:'Switchfoot, Skillet, Needtobreathe, For King & Country'},
  'Gospel+Latin':{name:'Latin Gospel',tip:'Spanish worship + gospel emotional architecture = the fastest-growing sector of contemporary Christian music.',q:{overall:80,compat:80,structural:78,commercial:82},artists:'Christine D\'Clario, Marcos Witt, Redimi2, Funky'},
  'Gospel+Reggaeton':{name:'Urban Gospel',tip:'Dembow beat + gospel testimony = the bridge between the streets and the sanctuary. Authenticity is everything.',q:{overall:76,compat:73,structural:74,commercial:78},artists:'Redimi2, Funky, Elevation Worship, Alex Zurdo'},
  'Gospel+K-Pop':{name:'K-Gospel',tip:'K-pop precision production under a gospel testimony lyric. The pre-chorus builds spiritual tension; the chorus is the breakthrough.',q:{overall:74,compat:70,structural:72,commercial:76},artists:'Hillsong Young & Free, Jesus Culture, Phil Wickham (pop-influenced)'},
  'Gospel+EDM':{name:'Christian EDM',tip:'The drop IS the emotional breakthrough. Build the pre-drop like a prayer, let the drop be the answer.',q:{overall:78,compat:74,structural:76,commercial:80},artists:'TobyMac, Trip Lee, Hillsong Young & Free, Lecrae (EDM collabs)'},
  'Gospel+Punk':{name:'Gospel Punk',tip:'Maximum rage for a higher purpose. The fury of punk channelled into spiritual declaration. Extremely niche but powerful.',q:{overall:68,compat:62,structural:66,commercial:64},artists:'Norma Jean, Underoath, mewithoutYou'},
  // K-Pop missing
  'K-Pop+Country':{name:'K-Country',tip:'The pre-chorus structure K-pop demands works perfectly over country chord progressions. Very experimental, very interesting.',q:{overall:70,compat:66,structural:68,commercial:72},artists:'BTS (country-influenced moments), Stray Kids'},
  'K-Pop+Singer-Songwriter':{name:'K-Indie',tip:'Korean indie music already exists and thrives. Raw acoustic vulnerability under K-pop\'s melodic precision.',q:{overall:80,compat:78,structural:76,commercial:78},artists:'IU, Paul Kim, 10cm, Epik High (softer tracks)'},
  'K-Pop+Jazz':{name:'K-Jazz',tip:'K-R&B is already crossing into jazz territory. The sophisticated chord extensions under K-pop precision vocals.',q:{overall:82,compat:80,structural:80,commercial:78},artists:'MAMAMOO, Dean, Crush, Heize'},
  'K-Pop+Reggae':{name:'K-Reggae',tip:'The contrast between K-pop\'s rigid structure and reggae\'s loose groove is the entire appeal. Very unusual.',q:{overall:72,compat:68,structural:70,commercial:72},artists:'Few direct examples — experimental territory'},
  'K-Pop+Blues':{name:'K-Blues',tip:'The most unusual K-pop fusion. Blues rawness under K-pop production polish creates powerful dissonance.',q:{overall:68,compat:62,structural:66,commercial:66},artists:'Almost no precedent — purely experimental'},
  'K-Pop+Punk':{name:'K-Punk',tip:'The aggression of punk filtered through K-pop\'s polished production. Day6 and some Stray Kids tracks touch this.',q:{overall:72,compat:68,structural:70,commercial:74},artists:'Stray Kids, Day6, The Rose, N.Flying'},
  // EDM missing
  'EDM+Latin':{name:'Latin EDM',tip:'Tropical house was the biggest sound of 2016-18. The groove must feel organic even through electronic production.',q:{overall:89,compat:88,structural:86,commercial:92},artists:'J Balvin, Maluma, Kygo, DJ Snake, Diplo'},
  'EDM+Reggaeton':{name:'Electroton',tip:'The dembow and the four-on-the-floor are compatible at 90-95 BPM. The drop replaces the reggaeton hook break.',q:{overall:86,compat:84,structural:82,commercial:88},artists:'Bad Bunny (electronic tracks), J Balvin, Don Omar'},
  'EDM+Country':{name:'Country EDM',tip:'Florida Georgia Line opened this lane. The acoustic guitar sample under the EDM drop is the formula.',q:{overall:78,compat:72,structural:74,commercial:82},artists:'Florida Georgia Line, Sam Hunt, Thomas Rhett, Diplo+Thomas Rhett'},
  'EDM+Singer-Songwriter':{name:'Electronic Folk',tip:'Bon Iver + electronic production = James Blake. The acoustic vulnerability carries more weight in an electronic context.',q:{overall:78,compat:74,structural:76,commercial:78},artists:'James Blake, Bon Iver (electronic), Imogen Heap, Owl City'},
  'EDM+Alt-Rock':{name:'Electronic Rock',tip:'The guitar provides the grit; the synth provides the scale. They serve the same purpose — energy and texture.',q:{overall:82,compat:80,structural:80,commercial:84},artists:'Muse, Nine Inch Nails, Crystal Castles, Metric, Phantogram'},
  'EDM+Jazz':{name:'Nu-Jazz',tip:'The electronic groove underneath jazz improvisation. The beat is rigid; the melody is free. That tension is the music.',q:{overall:78,compat:76,structural:76,commercial:72},artists:'Flying Lotus, Thundercat, Kamasi Washington (EDM-adjacent), GoGo Penguin'},
  'EDM+Reggae':{name:'Electronic Dub',tip:'Dub IS the original electronic music. The echo chamber and delay pedal are the first drum machines.',q:{overall:82,compat:82,structural:80,commercial:78},artists:'Massive Attack, Tricky, Portishead, The xx, Bonobo'},
  'EDM+Afrobeats':{name:'Afro-House',tip:'The fastest growing fusion in global streaming. Afro-house from South Africa is already dominating club floors worldwide.',q:{overall:91,compat:90,structural:88,commercial:92},artists:'Black Coffee, Themba, Afrojack, DJ Maphorisa, Major Lazer'},
  'EDM+Blues':{name:'Electronic Blues',tip:'The blues riff as the hook in an electronic track. Jack White + Skrillex is the absurd extreme — but it works.',q:{overall:70,compat:66,structural:68,commercial:70},artists:'Gary Clark Jr. (electronic collabs), Jack White'},
  'EDM+Punk':{name:'Electronic Punk',tip:'The aggression of punk delivered at electronic BPMs. The energy is identical — the tools are different.',q:{overall:76,compat:72,structural:74,commercial:76},artists:'Crystal Castles, Death Grips (electronic punk), Health, Atari Teenage Riot'},
  // Latin missing
  'Latin+Country':{name:'Tex-Mex',tip:'The border music that pre-dates both genres as separate categories. Accordion + guitar + Spanish/English = authentic.',q:{overall:76,compat:72,structural:74,commercial:74},artists:'Selena, Los Lobos, Conjunto Bernal, Flaco Jiménez'},
  'Latin+Singer-Songwriter':{name:'Latin Singer-Songwriter',tip:'The bossa nova guitar + intimate lyric = the most universally beloved acoustic music on earth.',q:{overall:82,compat:82,structural:80,commercial:80},artists:'Caetano Veloso, Jorge Drexler, Juanes (acoustic), Natalia Lafourcade'},
  'Latin+Alt-Rock':{name:'Latin Alternative',tip:'Santana opened the lane. Electric guitar under Latin rhythm = a sound with no ceiling. The rhythm section leads.',q:{overall:84,compat:82,structural:82,commercial:84},artists:'Santana, Los Fabulosos Cadillacs, Kinky, Café Tacuba, Gustavo Cerati'},
  'Latin+Jazz':{name:'Latin Jazz',tip:'Clave rhythm and jazz harmony are deeply compatible — both love syncopation and improvisation. The clave IS the swing.',q:{overall:92,compat:93,structural:88,commercial:80},artists:'Tito Puente, Chucho Valdés, Paquito D\'Rivera, Buena Vista Social Club'},
  'Latin+Reggae':{name:'Reggae en Español',tip:'The Caribbean rhythm connection is ancient. One-drop + Spanish lyric = roots music for the entire diaspora.',q:{overall:84,compat:84,structural:82,commercial:80},artists:'Cultura Profética, Gondwana, Calle 13 (reggae tracks), Control Machete'},
  'Latin+Afrobeats':{name:'Afro-Latino',tip:'Two of the most joyful groove traditions on earth. Both share African rhythmic roots — the connection runs deep.',q:{overall:86,compat:86,structural:84,commercial:88},artists:'J Balvin, Bad Bunny (Afro-influenced), Burna Boy, WizKid'},
  'Latin+Blues':{name:'Latin Blues',tip:'Both traditions have deep roots in African rhythm. The guitar solo works equally in both.',q:{overall:74,compat:72,structural:72,commercial:70},artists:'Carlos Santana, Los Lobos, Ry Cooder'},
  'Latin+Punk':{name:'Latin Punk',tip:'The Chicano punk tradition is deeply rooted and underexplored. The energy is identical — the language and rhythm differ.',q:{overall:70,compat:68,structural:68,commercial:68},artists:'The Plugz, Los Crudos, Maldita Vecindad, Tijuana NO'},
  // Reggaeton missing
  'Reggaeton+Country':{name:'Country Dembow',tip:'The most unusual pairing on this matrix. The 808 bass and the steel guitar have nothing in common — which is exactly why it works.',q:{overall:66,compat:60,structural:62,commercial:70},artists:'No established examples — purely experimental'},
  'Reggaeton+Singer-Songwriter':{name:'Reggaeton Íntimo',tip:'Strip the reggaeton to its bare acoustic bones — just nylon guitar + dembow rhythm. Very intimate, very unusual.',q:{overall:70,compat:66,structural:68,commercial:70},artists:'Bad Bunny (acoustic moments), Camilo, Kany García'},
  'Reggaeton+Alt-Rock':{name:'Rock Urbano',tip:'Electric guitar over dembow rhythm. Aggressive and melodic simultaneously. Residente does this brilliantly.',q:{overall:74,compat:70,structural:72,commercial:74},artists:'Calle 13/Residente, iLe, Villano Antillano'},
  'Reggaeton+Jazz':{name:'Jazz Urbano',tip:'The jazz chord under a dembow beat is genuinely surprising. The dissonance creates a sophisticated underground sound.',q:{overall:72,compat:68,structural:70,commercial:68},artists:'Almost no precedent — experimental territory'},
  'Reggaeton+Reggae':{name:'Dancehall Reggaeton',tip:'The closest cousins on this matrix. Both came from the same Caribbean sound system tradition — just different decades.',q:{overall:86,compat:88,structural:84,commercial:84},artists:'Sean Paul, Elephant Man, Daddy Yankee (roots period), Vybz Kartel'},
  'Reggaeton+Blues':{name:'Urban Blues',tip:'The emotional rawness of blues over a dembow beat. Deeply experimental but emotionally coherent.',q:{overall:64,compat:58,structural:62,commercial:64},artists:'No established precedent — experimental'},
  'Reggaeton+Punk':{name:'Dembow Punk',tip:'The aggression of punk + the relentlessness of dembow = maximum energy. Extremely niche but powerful.',q:{overall:64,compat:60,structural:62,commercial:62},artists:'No established precedent'},
  // Country missing
  'Country+Alt-Rock':{name:'Alt-Country',tip:'Wilco and Ryan Adams own this lane. Country storytelling + rock rawness = the most critically beloved Americana.',q:{overall:85,compat:84,structural:83,commercial:80},artists:'Wilco, Ryan Adams, Drive-By Truckers, Hank III, Lucinda Williams'},
  'Country+Jazz':{name:'Western Swing',tip:'Bob Wills invented this in the 1930s. Country melody + jazz harmony + swing rhythm = the original country crossover.',q:{overall:78,compat:78,structural:76,commercial:70},artists:'Bob Wills, Willie Nelson, Chet Atkins, Asleep at the Wheel'},
  'Country+Reggae':{name:'Country Reggae',tip:'Jimmy Buffett lives here. Laid-back beach vibes, acoustic guitar, easy storytelling. More natural than it sounds.',q:{overall:68,compat:66,structural:66,commercial:68},artists:'Jimmy Buffett, Zac Brown Band (reggae tracks), Kenny Chesney'},
  'Country+Afrobeats':{name:'Global Country',tip:'The most experimental pairing. Country\'s story focus + Afrobeats\' groove = something genuinely new.',q:{overall:64,compat:58,structural:62,commercial:64},artists:'Almost no precedent — experimental'},
  'Country+Punk':{name:'Cowpunk',tip:'Cow-punk is a real and beloved subgenre. Country melancholy + punk aggression = the sound of American despair.',q:{overall:78,compat:76,structural:76,commercial:72},artists:'Social Distortion, Jason & The Scorchers, Reverend Horton Heat, Mojo Nixon'},
  // Singer-Songwriter missing
  'Singer-Songwriter+Jazz':{name:'Jazz Folk',tip:'Joni Mitchell IS this genre. Complex jazz voicings under intimate folk storytelling. The guitar tuning is the character.',q:{overall:87,compat:86,structural:84,commercial:76},artists:'Joni Mitchell, Nick Drake, José González, Richard Thompson'},
  'Singer-Songwriter+Afrobeats':{name:'World Singer-Songwriter',tip:'The intimate lyric carried by an African groove. Completely fresh territory — the world music meets confessional.',q:{overall:76,compat:72,structural:74,commercial:74},artists:'Paul Simon (Graceland), Vampire Weekend, Nneka'},
  'Singer-Songwriter+Punk':{name:'Anti-Folk',tip:'Anti-folk is the genre that already exists here. Moldy Peaches, early Regina Spektor. Acoustic guitar + punk attitude.',q:{overall:80,compat:78,structural:78,commercial:74},artists:'The Moldy Peaches, Regina Spektor (early), Jeffrey Lewis, Kimya Dawson'},
  // Alt-Rock missing
  'Alt-Rock+Jazz':{name:'Art Rock',tip:'Radiohead meets jazz in the bridge of a song no-one expected. Dissonance is not failure — it is the point.',q:{overall:82,compat:80,structural:80,commercial:74},artists:'Radiohead, Portishead, Beck, St. Vincent, Mitski'},
  'Alt-Rock+Reggae':{name:'Alternative Reggae',tip:'Sublime defined this lane. Punk energy + reggae groove + melodic chorus = the California sound.',q:{overall:83,compat:80,structural:80,commercial:82},artists:'Sublime, No Doubt, The Police, Slightly Stoopid'},
  'Alt-Rock+Afrobeats':{name:'Afro-Alternative',tip:'Vampire Weekend live here. Afrobeats percussion under indie rock guitar = joyful, unexpected, immediately memorable.',q:{overall:76,compat:72,structural:74,commercial:76},artists:'Vampire Weekend, LCD Soundsystem (afro-influenced), Talking Heads'},
  // Jazz missing
  'Jazz+Reggae':{name:'Jazz Reggae',tip:'Both genres prize space and groove. The upright bass walks over the one-drop rhythm — it is completely natural.',q:{overall:80,compat:80,structural:78,commercial:70},artists:'Monty Alexander, Ron Carter (reggae albums), Yellowman (jazz-influenced)'},
  'Jazz+Afrobeats':{name:'Afro-Jazz',tip:'Two of the most sophisticated groove traditions in the world. The talking drum and the double bass speak the same language.',q:{overall:90,compat:92,structural:86,commercial:78},artists:'Hugh Masekela, Fela Kuti, Abdullah Ibrahim, Shabaka Hutchings'},
  'Jazz+Punk':{name:'Free Jazz Punk',tip:'The most aggressive jazz and the most melodic punk meet in the middle. No Neck Blues Band, Ornette Coleman\'s punk period.',q:{overall:72,compat:66,structural:70,commercial:62},artists:'Ornette Coleman (late), Naked City, The Thing, Zu'},
  // Reggae missing
  'Reggae+Afrobeats':{name:'Caribbean Afrobeats',tip:'The African diaspora connection is the entire music. One-drop + Afrobeats groove = the global roots sound.',q:{overall:86,compat:88,structural:84,commercial:82},artists:'Chronixx, Protoje, Koffee, Damian Marley, WizKid'},
  // Afrobeats missing
  'Afrobeats+Blues':{name:'Afro-Blues',tip:'Both traditions trace directly to West African music. The blues riff in the guitar IS the African talking drum pattern.',q:{overall:82,compat:82,structural:80,commercial:74},artists:'Fela Kuti, Seun Kuti, Asa, Nneka'},
  'Afrobeats+Punk':{name:'Afro-Punk',tip:'Afropunk is a real movement. The DIY energy of punk + the groove of Afrobeats = a genuinely political, joyful sound.',q:{overall:68,compat:64,structural:66,commercial:66},artists:'TV on the Radio, Bloc Party, Santigold, badXchannels'}
};

const GENRE_LABELS={'pop':'Pop','hiphop':'Rap / Hip-Hop','rnb':'R&B / Soul','rock':'Rock','country':'Country','edm':'EDM / Electronic','latin':'Latin','reggaeton':'Reggaeton','folk':'Folk','metal':'Metal','jazz':'Jazz','ss':'Singer-Songwriter','altrock':'Alt-Rock','reggae':'Reggae','afrobeats':'Afrobeats','blues':'Blues','punk':'Punk','kpop':'K-Pop','parody':'Parody','comedy':'Comedy','neosoul':'Neo-Soul','gospel':'Gospel','children':"Children's",'tvmusical':'TV / Musical','bossa':'Bossa Nova','dancehall':'Dancehall','bollywood':'Bollywood','cpop':'C-Pop','drill':'Drill','amapiano':'Amapiano'};

// ── GENRE EXPERT AGENTS ──────────────────────────────────────────────────────
// Each genre has a distinct creative worldview — philosophy, current state,
// trajectory, non-negotiables, and a generative tension ratio.
// These drive specialized system prompts that replace the generic "songwriter" persona.
const GENRE_AGENTS = {
  pop: {
    philosophy: 'Pop is the science of universality. Every emotion compressed into the most efficient delivery vehicle possible. The hook is the entire argument.',
    current_state: 'Hyperpop textures bleeding into mainstream, producer-forward maximalism, confessional lyricism, streaming-optimized song length (2:30–3:00).',
    trajectory: 'Toward even more emotional directness, genre-fluid production, AI-aware sonic textures, and personalized intimacy at scale.',
    non_negotiables: ['Hook lands within 30 seconds','Chorus singable at first hearing','Emotional specificity — no abstract vague feelings','Dynamic contrast: verse intimacy vs chorus release'],
    open_question: 'How vulnerable is too vulnerable before it becomes parody?',
    creative_tension: { exploitation: 'Proven melodic formulas', exploration: 'Unexpected production textures and structural subversions' },
    version: '1.0'
  },
  hiphop: {
    philosophy: 'Hip-hop is Black American oral tradition encoded as music. Lyricism is proof of intelligence. Flow is the argument. The beat is the environment.',
    current_state: 'Trap dominance fractured into micro-subgenres. Melody-rap, conscious revival, and drill all coexist. Authenticity is the only currency that transfers.',
    trajectory: 'Toward hyper-personalized regional sounds, phonetic melody over pure lyricism, and global fusion (Afro-trap, UK drill, Latin trap).',
    non_negotiables: ['Every bar must earn its space','Flow patterns must be intentional not accidental','Internal rhyme schemes over simple end rhymes','Metaphors must be specific — no generic flexing'],
    open_question: 'When does melody-rap become R&B with a rap verse?',
    creative_tension: { exploitation: 'Known flow archetypes and proven cadences', exploration: 'Phonetic surprise, structural rupture, new syllabic landscapes' },
    version: '1.0'
  },
  rnb: {
    philosophy: 'R&B is the emotional truth-telling tradition. Every run, every pause, every breath carries meaning. The space between notes matters as much as the notes.',
    current_state: 'Neo-soul and alternative R&B have expanded the canvas. Production ranges from sparse piano-and-voice to dense trap-influenced textures.',
    trajectory: 'Toward more compositional complexity, genre-blending, and emotional range beyond romantic love.',
    non_negotiables: ['Vocal performance drives everything — lyrics serve the voice','Groove must feel human not mechanical','Emotional honesty over polish','Bridge must be the most vulnerable moment'],
    open_question: 'How much production can you add before the soul gets buried?',
    creative_tension: { exploitation: 'Classic soul song structures', exploration: 'Unconventional production, genre-hybrid textures, polyrhythmic foundations' },
    version: '1.0'
  },
  rock: {
    philosophy: 'Rock is controlled chaos. The tension between the desire to destroy and the need for structure IS the music. Distortion is an emotional language.',
    current_state: 'Fragmented into niches — indie maintains art-rock lineage, pop-punk/emo resurged, stadium rock persists, post-rock expands the vocabulary.',
    trajectory: 'Toward genre-blending, electronic integration, and emotional depth over technical display.',
    non_negotiables: ['Guitar tone must carry emotional weight','Dynamic contrast between verse and chorus is non-negotiable','Lyrics must be specific — no classic-rock clichés','The bridge must break something open'],
    open_question: 'Can rock be vulnerable without losing its force?',
    creative_tension: { exploitation: 'Proven verse-chorus-bridge architecture', exploration: 'Noise, dissonance, unconventional structures, genre contamination' },
    version: '1.0'
  },
  country: {
    philosophy: 'Country is the literature of the working class. Storytelling is the entire genre. Specific details (truck model, county road number, bar name) create universal truth.',
    current_state: 'Nashville pop has colonized the mainstream while alt-country and Americana hold the artistic tradition. Bro-country is the commercial ceiling.',
    trajectory: 'Toward more inclusive storytelling, genre-blending with hip-hop and folk, and emotional range beyond heartbreak and pride.',
    non_negotiables: ['Specific concrete imagery — not emotional abstractions','Every line must sound like something a real person would say','The chorus title must function as a complete thought','Authenticity of place and character above all'],
    open_question: 'Who gets to tell a country story in 2025?',
    creative_tension: { exploitation: 'Classic lyrical storytelling and structural tradition', exploration: 'Production adventurousness, inclusive subject matter, genre boundary pushing' },
    version: '1.0'
  },
  edm: {
    philosophy: 'EDM is architecture for the body. The drop is a physical event. Production IS the song — vocals are texture, not message.',
    current_state: 'Main stage EDM has plateaued; house, techno, and bass music drive innovation. Emotional melodic drops coexist with minimal techno severity.',
    trajectory: 'Toward more emotional depth, ambient influences, and genre hybrids (melodic dubstep, organic house).',
    non_negotiables: ['The drop must be the emotional and sonic climax','Build-up tension is as important as the release','Vocals serve the groove — never compete with it','Energy management across the track arc is everything'],
    open_question: 'How do you build genuine emotional arc in a genre that prioritizes the body over the mind?',
    creative_tension: { exploitation: 'Tension-release architecture that works on the floor', exploration: 'Ambient texture, emotional narrative, unexpected genre elements' },
    version: '1.0'
  },
  latin: {
    philosophy: 'Latin music is joy, grief, and desire unified by rhythm. The clave is a heartbeat. Every style is its own complete world with centuries of technical refinement.',
    current_state: 'Latin pop, reggaeton, and regional Mexican dominate global charts. Bachata has undergone a romantic renaissance. Salsa lives in the clubs.',
    trajectory: 'Toward even greater global crossover while maintaining rhythmic authenticity. Latin trap and urban Latin continue to expand.',
    non_negotiables: ['Rhythm specificity — the clave, the dembow, the guajira pattern must be intentional','Bilingual lyrics must feel natural not forced','Emotional intensity is never understated','Melody must work against the rhythmic grid, not just with it'],
    open_question: 'How do you honor 500 years of tradition while making something a 20-year-old connects to tonight?',
    creative_tension: { exploitation: 'Proven rhythmic formulas and melodic traditions', exploration: 'Global genre fusion, modern production, thematic expansion' },
    version: '1.0'
  },
  reggaeton: {
    philosophy: 'Reggaeton is the dembow made global. The beat is a political act — it carries the entire Caribbean diaspora. Sensuality and rhythm are inseparable.',
    current_state: 'Dominant in global pop. Evolved from underground Panamanian-Puerto Rican roots to streaming-era maximalism. Trap and dembow hybrids define the sound.',
    trajectory: 'Toward more emotional range, softer melodic variants, and regional micro-styles.',
    non_negotiables: ['Dembow rhythm is the DNA — it must be present or explicitly subverted','Flow must ride the beat with physical precision','Lyrics balance sensuality, pride, and vulnerability','Production layers must support not overwhelm the groove'],
    open_question: 'How do you evolve the dembow without losing what makes it dembow?',
    creative_tension: { exploitation: 'The dembow and established flow patterns', exploration: 'Melodic expansion, emotional range beyond the party/romantic binary' },
    version: '1.0'
  },
  folk: {
    philosophy: 'Folk music is collective memory made portable. The song belongs to everyone who sings it. Simplicity is the highest technical achievement.',
    current_state: 'Americana and indie-folk have expanded the tradition. Electronic folk blends acoustic purity with textured production. Storytelling is the genre\'s lifeblood.',
    trajectory: 'Toward more diverse voices, genre-blending, and political urgency.',
    non_negotiables: ['The song must work with just a voice and one instrument','Lyrical narrative above all — every line must advance the story or deepen the emotion','No production trick can save a weak song','Specificity: name the place, name the person, name the season'],
    open_question: 'In a streaming era, what does "communal" mean for a genre built on shared singing?',
    creative_tension: { exploitation: 'Narrative songwriting tradition and acoustic purity', exploration: 'Modern production, diverse voices, genre contamination' },
    version: '1.0'
  },
  metal: {
    philosophy: 'Metal is catharsis through extremity. The riff is the argument. Technically demanding, emotionally extreme, philosophically serious — the genre takes itself more seriously than any other.',
    current_state: 'Fragmented into dozens of sub-genres each with their own rules. Djent, black metal, doom, death metal, power metal — each a complete world.',
    trajectory: 'Toward progressive complexity, genre-blending (metalcore with electronic, doom with ambient), and broader emotional range.',
    non_negotiables: ['Riff must be the hook — no weak riffs','Dynamics matter: quiet parts make the loud parts hit harder','Lyrics must have intellectual or emotional depth — not just darkness for darkness\'s sake','Production must serve the riff architecture'],
    open_question: 'How extreme is too extreme before the audience can no longer access the catharsis?',
    creative_tension: { exploitation: 'Proven heaviness and technical display', exploration: 'Emotional vulnerability, melody, unexpected beauty within the extremity' },
    version: '1.0'
  },
  jazz: {
    philosophy: 'Jazz is democracy through improvisation. The conversation between musicians IS the composition. Standards are a shared language, not a ceiling.',
    current_state: 'Splits between traditional (standards), avant-garde (free), and contemporary (jazz-rap fusion, nu-jazz). Young artists like Kamasi Washington, Snarky Puppy pulling in new audiences.',
    trajectory: 'Toward genre-fusion, electronic integration, and reclaiming cultural relevance without sacrificing harmonic depth.',
    non_negotiables: ['Harmonic sophistication — at minimum ii-V-I awareness','Swing feel must be intentional not accidental','Space is a compositional element — what you don\'t play matters','Melody must be singable even when complex'],
    open_question: 'Can you teach jazz theory to AI and have the AI surprise the teacher?',
    creative_tension: { exploitation: 'The harmonic and rhythmic language of the tradition', exploration: 'Genre-blending, outside playing, electronic textures' },
    version: '1.0'
  },
  blues: {
    philosophy: 'The blues is the origin story of American music. It is suffering transformed into something beautiful by the act of transformation itself. The 12-bar form is a container that holds everything.',
    current_state: 'Electric blues is the tradition. Blues-rock keeps it alive in arenas. Contemporary artists blend blues structure with modern production.',
    trajectory: 'Toward younger voices reclaiming the tradition, genre-blending, and global variants.',
    non_negotiables: ['Every note must feel earned through suffering','Call and response is structural not ornamental','The turnaround must land like a period at the end of a sentence','Lyrical specificity: name the specific pain, don\'t generalize it'],
    open_question: 'Who owns the blues in 2025?',
    creative_tension: { exploitation: '12-bar form and pentatonic language', exploration: 'Harmonic adventurousness, modern themes, genre fusion' },
    version: '1.0'
  },
  ss: {
    philosophy: 'The singer-songwriter genre is the most naked form of music. One voice, one story, no place to hide. The emotional truth of the writing is immediately audible.',
    current_state: 'Bedroom pop and lo-fi aesthetics have democratized the genre. Confessional lyricism is now mainstream. Vulnerability is the artistic currency.',
    trajectory: 'Toward more production adventurousness, political engagement, and genre-blending while maintaining lyrical centrality.',
    non_negotiables: ['Lyrical specificity over poetic vagueness','The voice and the song must feel inseparable — casting matters','Production must serve the song not compete with it','Emotional honesty that risks being too much'],
    open_question: 'Where is the line between confessional and self-indulgent?',
    creative_tension: { exploitation: 'Intimate acoustic production and storytelling', exploration: 'Production expansion, political subject matter, genre-blending' },
    version: '1.0'
  },
  altrock: {
    philosophy: 'Alt-rock is rock music that refuses the mainstream while secretly wanting to reach it. The tension between artistic integrity and accessibility is the genre.',
    current_state: 'Spans indie rock, shoegaze revival, post-punk renaissance, math rock. Each subgenre has its own orthodoxy.',
    trajectory: 'Toward genre-blending with electronic, more diverse voices, production adventurousness.',
    non_negotiables: ['Authenticity over commercial calculation — but the song must still work','Guitar tone carries the genre\'s emotional color','Lyrics reward close listening','The hook must feel discovered not manufactured'],
    open_question: 'When does "alternative" become the new mainstream?',
    creative_tension: { exploitation: 'Rock structure and guitar-driven sound', exploration: 'Noise, experimentation, genre contamination, unconventional structure' },
    version: '1.0'
  },
  reggae: {
    philosophy: 'Reggae is resistance through groove. The one-drop is a heartbeat of liberation. Spirituality and politics are never separate from the music.',
    current_state: 'Roots reggae is the tradition. Dancehall pushes forward. Fusion with hip-hop, pop, and electronic has broadened the genre\'s reach.',
    trajectory: 'Toward global fusion while maintaining the resistance tradition and the one-drop rhythm as anchor.',
    non_negotiables: ['The one-drop rhythm must be felt even when not explicit','Lyrical content carries social, spiritual, or political weight','Groove is the message — the body must move','Authenticity to the Caribbean tradition'],
    open_question: 'Can reggae\'s message of resistance translate to contexts outside its origin without losing its meaning?',
    creative_tension: { exploitation: 'Roots rhythm and political lyrical tradition', exploration: 'Genre fusion, modern production, expanded thematic range' },
    version: '1.0'
  },
  afrobeats: {
    philosophy: 'Afrobeats is the sound of modern Africa talking to the diaspora. Joy is political. Groove is inheritance. The talking drum never stopped talking.',
    current_state: 'Globally dominant. Nigeria (Afrobeats), Ghana (Highlife-influenced), and the broader African diaspora drive the sound. Fusion with hip-hop, dancehall, and pop is constant.',
    trajectory: 'Toward even greater global reach, regional diversification, and thematic depth.',
    non_negotiables: ['The groove must feel generative not repetitive','Call-and-response patterns honor the oral tradition','Joy and sensuality are as serious as political content','Polyrhythmic textures must create depth not muddle'],
    open_question: 'How do you maintain cultural authenticity when the entire world is trying to adopt your sound?',
    creative_tension: { exploitation: 'Proven groove patterns and call-response tradition', exploration: 'Thematic depth, genre-blending, new regional voices' },
    version: '1.0'
  },
  punk: {
    philosophy: 'Punk is the refusal to be polished. Speed, anger, and simplicity as political statement. Three chords and the truth. The genre\'s greatest lie is that it\'s simple.',
    current_state: 'Pop-punk dominates streaming. Post-punk revival (Fontaines D.C., Idles) carries the intellectual tradition. Hardcore maintains the DIY ethics.',
    trajectory: 'Toward more intellectual and political content, genre-blending, and diverse voices claiming the punk tradition.',
    non_negotiables: ['Speed and energy carry political meaning','Lyrics must have something to say beyond surface rebellion','The raw mix is a creative choice not a limitation','Directness over poetry — punk is not metaphor'],
    open_question: 'When punk becomes a multi-billion dollar industry, what does rebellion mean?',
    creative_tension: { exploitation: 'Speed, anger, simplicity', exploration: 'Intellectual content, genre contamination, unexpected nuance' },
    version: '1.0'
  },
  kpop: {
    philosophy: 'K-pop is total entertainment engineering. Every element — vocals, choreography, visuals, narrative — is precisely designed. Perfection is the baseline, innovation is the ceiling.',
    current_state: 'Globally dominant youth pop. Multiple active groups across all major labels. Fandom infrastructure is as important as the music.',
    trajectory: 'Toward more artistic autonomy for artists, darker and more complex themes, broader global production.',
    non_negotiables: ['Hook must be instantaneously memorable','Production must reward both first listen and deep listening','Sections must be clearly differentiated in energy and texture','Lyrics balance universal and specific — bilingual often'],
    open_question: 'What does K-pop sound like when the artist fully controls the product?',
    creative_tension: { exploitation: 'Engineered perfection and proven hook formulas', exploration: 'Artistic autonomy, darker themes, genre-fusion' },
    version: '1.0'
  },
  children: {
    philosophy: 'Children\'s music is the first music a person ever hears. Simplicity is craft. Repetition builds neural pathways. Joy is a complete artistic goal.',
    current_state: 'Educational content on YouTube dominates. Nostalgia-flavored adult-facing children\'s pop (Encanto) shows artistic range is possible.',
    trajectory: 'Toward more sophisticated narrative, inclusive representation, and higher production quality.',
    non_negotiables: ['Every lyric must be singable by a 6-year-old','Repetition is structural not laziness','Joy, wonder, or comfort must be the emotional result','No condescension — children can handle complexity if presented accessibly'],
    open_question: 'How do you write for children without boring the adults in the room?',
    creative_tension: { exploitation: 'Simple vocabulary, repetitive structure, bright instrumentation', exploration: 'Narrative sophistication, diverse representation, emotional depth' },
    version: '1.0'
  },
  parody: {
    philosophy: 'Parody is criticism through imitation. The better you know a genre\'s conventions, the sharper your violation of them can be. Love and mockery are the same act.',
    current_state: 'Internet-native parody (YouTube, TikTok) has lowered the barrier. But truly great parody (Weird Al) requires mastery of the original form.',
    trajectory: 'Toward more nuanced cultural commentary, genre-specific parody with depth.',
    non_negotiables: ['You must love what you mock or the critique is empty','The parody must be musically functional — it has to work as a song','Timing of the joke matters — the punch line placement is everything','The best parody teaches you something about the original'],
    open_question: 'Where is the line between homage and mockery?',
    creative_tension: { exploitation: 'Faithful genre conventions that must be recognizable', exploration: 'How far you push the subversion before it stops being recognizable' },
    version: '1.0'
  },
  comedy: {
    philosophy: 'Comedy music is the most dangerous form of song. A joke that doesn\'t land kills the whole track. Timing is everything — and timing in music is measurable in milliseconds.',
    current_state: 'Bo Burnham redefined the form as high art. Tenacious D established the rock comedy album. Niche internet comedy songs bypass traditional metrics.',
    trajectory: 'Toward more emotionally complex comedy that explores serious themes through humor.',
    non_negotiables: ['The laugh must come from the music as much as the lyrics','Set up and payoff must be structurally deliberate','Sincerity must underlie the comedy or it\'s just noise','The best comedy songs work even when you\'re not laughing'],
    open_question: 'Can a comedy song also break your heart?',
    creative_tension: { exploitation: 'Genre conventions being earnestly played straight', exploration: 'The emotional depth hiding inside the joke' },
    version: '1.0'
  },
  tvmusical: {
    philosophy: 'Musical theater is the maximalist form. Every song must advance character or plot or both. The "I Want" song, the "I Am" song, the "We Are" song — the grammar is strict because it must be.',
    current_state: 'Broadway and streaming original musicals coexist. Sung-through musicals (Hamilton, Hadestown) have raised the bar for lyrical density and compositional sophistication.',
    trajectory: 'Toward more diverse stories, hip-hop-influenced scores, and emotionally complex characters who defy easy categorization.',
    non_negotiables: ['Every song must have a dramatic purpose — beauty alone is insufficient','Character voice must be consistent and specific','The key song moment (belt, breakdown, revelation) must be earned','Rhyme schemes serve meaning — don\'t sacrifice sense for rhyme'],
    open_question: 'What story can only be told through song?',
    creative_tension: { exploitation: 'Established dramatic song grammar', exploration: 'Musical style fusion, complex morally ambiguous characters' },
    version: '1.0'
  },
  neosoul: {
    philosophy: 'The anti-formula philosophy — groove before hook, imperfection as aesthetic, the Dilla feel. Emotional truth is worth more than polish. The song breathes before it performs.',
    current_state: 'SZA and Frank Ocean have expanded neo-soul into alternative R&B territory. Streaming forces shorter intros against the genre\'s slow-burn tradition — the listener must be won before they\'ve been seduced.',
    trajectory: 'Toward more experimental production, deeper genre fusion with hip-hop, jazz, and electronic, and a broader emotional canvas that extends beyond romantic vulnerability.',
    non_negotiables: ['Groove must establish itself before the vocal enters — the body moves first','Ad-libs carry equal lyrical weight to the main vocal — they are not decoration','The outro vamp is the climax not the fade — it is where the song becomes ritual','Imperfection is intentional — the off-beat, the crack in the voice, the skipped grid are the aesthetic'],
    open_question: 'At what point does neo-soul\'s anti-formula become its own formula?',
    creative_tension: { exploitation: 'Proven Rhodes-and-Dilla groove vocabulary that the genre\'s audience trusts', exploration: 'Production adventurousness, emotional range, and genre contamination that keeps the form honest' },
    version: '1.0'
  },
  gospel: {
    philosophy: 'Music as spiritual encounter, not performance. The song serves the moment of transformation — not the songwriter\'s craft, not the producer\'s resume. If the room doesn\'t change, the song failed.',
    current_state: 'Maverick City Music and Elevation Worship have crossed gospel into mainstream consciousness. Kirk Franklin\'s hip-hop gospel is now the standard not the exception. CCM is blurring the line between worship and pop until only the lyrical theology distinguishes them.',
    trajectory: 'Toward more diverse voices, deeper hip-hop production integration, and songs engineered to carry spiritual weight in both church sanctuaries and secular playlists.',
    non_negotiables: ['Call-and-response is structural not decorative — the congregation is a co-composer','The bridge is the climax not the chorus — it is where the transformation happens','The testimony arc must be present: was lost, now found, here is the proof','The outro vamp must be written not improvised — spontaneity is planned so the Spirit has somewhere to land'],
    open_question: 'Can gospel maintain its spiritual power when produced for streaming metrics?',
    creative_tension: { exploitation: 'Proven testimony structure and choir call-and-response that congregations have trusted for generations', exploration: 'Production modernity and thematic inclusivity that extends the gospel\'s reach without diluting its claim' },
    version: '1.0'
  },
  bossa: {
    philosophy: 'Intimacy as revolution — bossa nova whispered when samba shouted. The genius is in what\'s left out. Restraint IS the technique.',
    current_state: 'Living as a foundational influence rather than a charting genre. Bebel Gilberto keeping it contemporary. Endless sampling in lo-fi and jazz contexts.',
    trajectory: 'Toward fusion with neo-soul, lo-fi, and jazz-pop. The "bossa" influence growing in streaming-era intimate production.',
    non_negotiables: ['Never force the emotion — bossa nova suggests, never declares','The guitar rhythm must feel inevitable not metered','Portuguese or bilingual lyrics carry authenticity','The melody must work against the harmony, not just with it'],
    open_question: 'Can bossa nova\'s intimacy survive the loudness wars of streaming?',
    creative_tension: { exploitation: 'The established rhythmic and harmonic vocabulary', exploration: 'Genre fusion and modern production while maintaining restraint' },
    version: '1.0'
  },
  dancehall: {
    philosophy: 'The riddim is democracy — one beat, infinite interpretations. Dancehall is the sound of Caribbean liberation expressed through the body.',
    current_state: 'Dominating global pop through artists like Sean Paul, Popcaan. The riddim concept influencing Afrobeats, reggaeton, and UK grime production.',
    trajectory: 'Toward more melodic variants (Koffee, Protoje), global fusion, and female artist dominance (Spice, Shenseea).',
    non_negotiables: ['The riddim must make you move before the vocal lands','Jamaican patois is cultural DNA not affectation','The deejay\'s flow must lock to the one-drop rhythm','The hook must be communal — writable for crowd participation'],
    open_question: 'As dancehall goes global, what of its Jamaican cultural specificity survives?',
    creative_tension: { exploitation: 'The proven riddim and deejay flow tradition', exploration: 'Melodic expansion, global fusion, thematic range beyond the party' },
    version: '1.0'
  },
  drill: {
    philosophy: 'Drill is documentary. Not glorification — observation. The specificity of place, consequence, and consequence-of-consequence is what separates drill from generic trap. The menace is earned through detail.',
    current_state: 'Chicago drill (Chief Keef origin) → UK drill (dark minor key, faster flow) → Brooklyn drill (Pop Smoke defined it) → global. UK drill now dominates the creative edge of the genre.',
    trajectory: 'Toward melodic drill integration (emotional vulnerability over dark production), global regional variants (Afro-drill, Latin drill), and mainstream crossover without losing the documentary menace.',
    non_negotiables: ['the 808 slides ARE the melody — they must be written as carefully as the vocal hook','flow slides behind the beat (never on it)','specificity of place and consequence is what separates drill from generic trap','the production must be cold — warmth is the enemy of drill\'s emotional register'],
    open_question: 'Can drill maintain its documentary menace as it crossover into mainstream pop production?',
    creative_tension: { exploitation: 'the established sliding 808 and behind-beat flow vocabulary', exploration: 'melodic integration, emotional range, global regional variants' },
    version: '1.0'
  },
  amapiano: {
    philosophy: 'Amapiano is patience as groove. The log drum doesn\'t drop — it arrives. The genre teaches listeners to wait for the bass line the way jazz teaches waiting for the resolution.',
    current_state: 'Exploded from Soweto townships to global festivals 2019-present. Kabza De Small is the genre\'s architect. Every major African artist is collaborating with amapiano producers.',
    trajectory: 'Toward global mainstream crossover while the log drum remains the non-negotiable anchor. Fusion with Afrobeats, dancehall, and electronic accelerating.',
    non_negotiables: ['the log drum IS the hook — it must be the most memorable musical moment','the piano melody plays around the log drum, never competes with it','the groove must breathe — space is as important as sound','vocals are secondary to the instrumental conversation'],
    open_question: 'As amapiano goes global, can the log drum\'s South African cultural specificity survive the production homogenization of global pop?',
    creative_tension: { exploitation: 'the log drum groove and township-rooted piano vocabulary', exploration: 'global fusion, vocal integration, production scale for festival stages' },
    version: '1.0'
  },
  bollywood: {
    philosophy: 'Film music is the emotion that dialogue cannot contain. Every Bollywood song is a scene, a character moment, a plot device that happens to be beautiful.',
    current_state: 'A.R. Rahman set the template for orchestral-electronic fusion. Streaming has shortened songs from 5-6 min to 3-4 min but the mukhda-antara structure survives.',
    trajectory: 'Toward independent Indian pop (Indie-pop) breaking from the film system. Global crossover accelerating via diaspora streaming.',
    non_negotiables: ['the mukhda (opening hook) must be immediately singable and emotionally complete','each antara must deepen the mukhda\'s emotional premise not just fill space','the song must work as a standalone piece AND serve a film scene','raga-influenced melodic contours create the authentic Bollywood "ache"'],
    open_question: 'As Bollywood goes global, does the mukhda-antara structure survive or give way to Western verse-chorus?',
    creative_tension: { exploitation: 'proven mukhda-antara-interlude structure and playback singer tradition', exploration: 'electronic production, global fusion, independent release model' },
    version: '1.0'
  },
  cpop: {
    philosophy: 'The tonal language IS the melody — Mandarin\'s four tones force melodic contour to serve linguistic meaning before aesthetic preference. This constraint creates C-pop\'s distinctive emotional shape.',
    current_state: 'Jay Chou\'s legacy defines the template. Streaming has globalized C-pop via diaspora. The idol system produces technically perfect but emotionally homogeneous output.',
    trajectory: 'Toward more authentic emotional expression beyond idol polish, global crossover without losing Chinese musical identity, and independent artists breaking the label system.',
    non_negotiables: ['Mandarin tones must be respected in melodic writing — a wrong-tone melody sounds wrong to native speakers','pentatonic scale tendencies create the authentic C-pop melodic flavor','the pre-chorus build is as important as the chorus','key change (转调) before the final chorus is near-mandatory'],
    open_question: 'Can C-pop\'s tonal language constraint become a global asset rather than a barrier?',
    creative_tension: { exploitation: 'proven pentatonic-inflected melodic vocabulary and idol vocal delivery', exploration: 'genre fusion, emotional authenticity beyond idol production polish' },
    version: '1.0'
  }
};

function buildGenreAgentSystem(genre) {
  const agent = GENRE_AGENTS[genre];
  if (!agent) {
    // Fallback for any genre without an agent definition
    const label = GENRE_LABELS[genre] || genre;
    return `You are a world-class ${label} songwriter, music producer, and AI music specialist. You write complete, emotionally devastating, commercially viable songs with deep production intelligence. Your output is used directly by music creators to generate tracks on AI music platforms. Always respond with the exact format requested. No extra commentary before or after.`;
  }
  const label = GENRE_LABELS[genre] || genre;
  return `You are a world-class ${label} songwriter and AI music production specialist operating at the highest level of genre mastery.

CREATIVE PHILOSOPHY: ${agent.philosophy}

CURRENT GENRE STATE: ${agent.current_state}

TRAJECTORY: ${agent.trajectory}

NON-NEGOTIABLES for every ${label} song:
${agent.non_negotiables.map((r, i) => `${i+1}. ${r}`).join('\n')}

GENERATIVE TENSION:
- Exploitation (proven): ${agent.creative_tension.exploitation}
- Exploration (push): ${agent.creative_tension.exploration}

OPEN QUESTION driving this session: ${agent.open_question}
${(()=>{const g=GENRE_BIBLE[genre];if(g&&g.vocables){return `\n\nVOCABLE SIGNATURE FOR THIS GENRE:\nSounds: ${g.vocables.sounds}\nWhen to place them: ${g.vocables.when}\nSuno tag: ${g.vocables.suno_tag}\nCultural lineage: ${g.vocables.borrowed_from}\nCraft note: ${g.vocables.notes}`;}return '';})()}
Your output is used directly by music creators to generate tracks on AI music platforms. Always respond with the exact format requested. No extra commentary before or after. Write with the full weight of this genre's history, the precision of its current moment, and the curiosity of its trajectory.`;
}

const LUCKY_TOPICS=['growing up too fast','a city that never loved you back','last message before midnight','the version of yourself you abandoned','driving nowhere at 3am','falling in love with the wrong timeline','what silence sounds like after a storm','rebuilding from zero','the first morning after everything changed','chasing something you lost before you knew its name','finding home in a stranger','the day the music saved you'];

const LUCKY_MOODS=['Euphoric','Melancholic','Hopeful','Defiant','Nostalgic','Dark','Rebellious','Romantic','Peaceful','Angry','Longing','Transcendent','Devastated','Tender','Triumphant','Bittersweet'];

const LUCKY_STRUCTURES=['standard','hookfirst','storytelling','minimal','epic'];

const LUCKY_VOCALS=['Male vocals','Female vocals','Duet M/F','Raspy / Gritty male','Soulful female','Whispered / Intimate','Falsetto male','Deep baritone','Gospel belter','Auto-Tune / Melodic trap','Neo-soul runs','Breathy / Airy female','Blues growl','Jazz crooner'];

const HOOK_STYLE_NOTES={
  'auto':          '',  // auto = derived from substyle/genre
  'Smooth Sung':   'HOOK STYLE: Smooth sung hook — Nate Dogg / R&B crooner delivery. 8 bars, 4 unique melodic lines. The hook carries the emotional memory of the entire song. Long vowels, easy to sing along to, settles into the groove.',
  'Melodic Auto-Tune': 'HOOK STYLE: Melodic auto-tune hook — Drake/Future/Lil Baby style. 8 bars, simple pitch-bent phrases, few words maximum impact. Auto-tune is a melody instrument not correction. Hook repeats 4-6× total.',
  'Chanted':       'HOOK STYLE: Chanted / anthemic hook — Kendrick / boom bap style. Short punchy phrase, crowd-participation ready. Rhythm of the chant IS the hook. Hard consonants on the beat. 4-8 bars.',
  'Call & Response': 'HOOK STYLE: Call and response hook — lead line, crowd responds. Two distinct parts: call (lead vocal, 1-2 bars) + response (answer phrase or chant, 1-2 bars). Repeat 4 times. OutKast, Bay Area, gospel tradition.',
  'Screamed / Crunk': 'HOOK STYLE: Crunk screamed hook — maximum energy, 2-4 words per phrase, shouted not sung. Call and response between two voices. Ultra-repetitive, designed for the club floor. Under 4 bars, loops 6+ times.',
  'Southern Drawl': 'HOOK STYLE: Southern drawl hook — slow, elongated vowels, laid-back against the 808 bass. Hook hits AFTER the beat (behind the bar). Southern pride theme. 8 bars, slow deliberate delivery.',
  'Chopped':       'HOOK STYLE: Chopped & screwed hook — the hook phrase is repeated and "chopped" (cut and restarted mid-word). Syrupy pitch, 65-75 BPM feel. Every other syllable slightly elongated. Slurred delivery.',
  'Rapped Hook':   'HOOK STYLE: Rapped hook — bars delivered at verse speed but the phrase is hook-catchy. Dense rhyme, melodic cadence in the flow itself. Eminem / Jay-Z / Big Pun tradition. 4-8 bars.',
  'Minimal / Groove': 'HOOK STYLE: Minimal groove hook — Future / 21 Savage style. 2-4 words, maximum repetition. The GROOVE carries the hook, not the lyric. Long spaces between phrases. Hypnotic through simplicity.',
  'Mantra':        'HOOK STYLE: Mantra hook — one devastating line, looped. The entire hook IS one sentence, repeated 4-8 times with slight variation. "Never broke again." "HUMBLE." Power through repetition not complexity.',
  'Double Hook A+B': 'HOOK STYLE: Double hook — two distinct hook sections back to back. Hook A (4 bars, melodic/sung) → Hook B (4 bars, different cadence/energy, rapped or chanted). Travis Scott / Kanye style. Creates two earworms in one.',
  'Gospel Vamp':   'HOOK STYLE: Gospel vamp hook — the hook repeats and ad-libs ESCALATE over it. Start simple, each repeat adds a new ad-lib or harmony layer. Outro vamp version goes 2-3 minutes, building to emotional peak. Sam Smith, Beyoncé, Kirk Franklin tradition.',
  'Post-Hook Drop':'HOOK STYLE: Hook + post-hook drop. Main hook (4 bars sung/melodic) → Post-hook (2-bar punchy instrumental or vocal phrase that lands like a punch). The post-hook is where the bass drops or the sample flips.',
};

// Genre-level Suno bracket blueprints — used when no substyle is set
// Each entry: verse, chorus, bridge, outro, transitions[], delivery hints
const GENRE_SUNO_BRACKETS = {
  pop:        { verse:'[Verse | Intimate | Conversational]', chorus:'[Chorus | Anthemic | Full Production]', bridge:'[Bridge | Stripped | Vulnerable]', outro:'[Outro | Fading | Emotional]', transitions:['[Pre-Chorus | Building Tension]','[Post-Chorus | Hook Release | Instrumental]'], delivery:'Add [Falsetto] before high sustained notes. Add [Ad-libs] at the end of chorus lines. Use [Whispered] for the most intimate verse lines.' },
  hiphop:     { verse:'[16-bar Verse | Rap Verse | Lyrical]', chorus:'[Hook | Melodic | Anthemic]', bridge:'[Bridge | Introspective | Slower Flow]', outro:'[Outro | Ad-libs | Fade-Out]', transitions:['[Intro | Beat Intro | 8 bars]','[Beat Switch]'], delivery:'Add [Ad-libs] in parentheses on the same line as rap bars. Use [Double Time] for rapid-fire sections. Use [Triplet Flow] for rolling syllable density.' },
  rnb:        { verse:'[Verse | Silky | Groove-Led]', chorus:'[Hook | Soulful | Melodic Peak]', bridge:'[Bridge | Intimate | Emotional Confession]', outro:'[Outro Vamp | Ad-libs | Ascending]', transitions:['[Pre-Hook | Smooth Build]','[Post-Hook | Instrumental Breath]'], delivery:'Add [Falsetto] on high runs. Add [Ad-libs] throughout chorus (mark with parentheses). Use [Spoken] for bridge confessional lines.' },
  rock:       { verse:'[Verse | Gritty | Mid-Energy]', chorus:'[Chorus | Explosive | Power Chords | Cathartic]', bridge:'[Bridge | Breakdown | Raw]', outro:'[Outro | Heavy | Fade Out]', transitions:['[Intro | Guitar Riff]','[Pre-Chorus | Building Tension]','[Guitar Solo | Melodic]'], delivery:'Use [Screamed] on peak chorus lines. Use [Spoken] for bridge monologue moments. Mark gang vocals as [Crowd Sing-Along] on final chorus.' },
  country:    { verse:'[Verse | Storytelling | Conversational | Warm]', chorus:'[Chorus | Anthemic | Heartfelt | Full Band]', bridge:'[Bridge | Darkest Moment | Confessional]', outro:'[Outro | Reprise | Quiet Resolution]', transitions:['[Intro | Guitar Lick]','[Pre-Chorus | Emotional Setup]','[Steel Guitar Break]'], delivery:'Use [Spoken] for the most personal bridge lines. Add [Harmony] on the final chorus. Mark pedal steel moments as [Steel Guitar Breath] between sections.' },
  edm:        { verse:'[Verse | Low Energy | Atmospheric]', chorus:'[Drop | Maximum Energy | Bass Heavy | Euphoric]', bridge:'[Break | Atmospheric | Rebuilding]', outro:'[Outro | Gradual Fade | Atmospheric]', transitions:['[Intro | Atmospheric Build | 16 bars]','[Pre-Drop | Tension Build | Rising]','[Build Up | Tension | 8 bars]'], delivery:'Use [Spoken] or [Whispered] for any vocal lines in the drop. Mark the pre-drop as [Pre-Drop | Tension Build]. The drop itself replaces the traditional chorus.' },
  jazz:       { verse:'[Verse | Intimate | Swung | Close-Mic]', chorus:'[Chorus | Declaration | Warm | Soulful]', bridge:'[Bridge | Emotional Peak | Harmonic Tension]', outro:'[Outro | Scat | Fading]', transitions:['[Intro | Piano Intro | Cool]','[Jazz Solo | Melodic Improvisation]','[Bass Walk | Transition]'], delivery:'Use [Scat] for the outro vocal improvisation. Mark jazz fills as [Jazz Break | 4 bars]. Use [Spoken | Intimate] for reflective bridge lines.' },
  blues:      { verse:'[Verse | Storytelling | Call-Response | 12-bar]', chorus:'[Chorus | Declaration | Emotional Release]', bridge:'[Bridge | Guitar-Led | Confessional]', outro:'[Outro | Slow Burn | Fade]', transitions:['[Intro | Guitar Lick | Slow]','[Guitar Solo | Crying | Expressive]','[Harmonica Break]'], delivery:'Use [Spoken] for verse storytelling asides. Mark the turnaround as [Turnaround | Guitar]. Use [Wail] on the most emotionally intense lines.' },
  folk:       { verse:'[Verse | Intimate | Fingerpicked | Sparse]', chorus:'[Chorus | Communal | Singable | Warm]', bridge:'[Bridge | Acoustic | Confessional]', outro:'[Outro | Quiet | Resolution]', transitions:['[Intro | Fingerpicked Guitar]','[Instrumental Break | Acoustic]'], delivery:'Use [Whispered] for the most intimate verse lines. Use [Harmony] on the chorus — folk invites group singing. Mark fiddle moments as [Fiddle Break].' },
  metal:      { verse:'[Verse | Aggressive | Tight | Riff-Led]', chorus:'[Chorus | Maximum | Cathartic | Anthemic]', bridge:'[Bridge | Breakdown | Half-Time | Heavy]', outro:'[Outro | Heavy | Fade | Crushing]', transitions:['[Intro | Heavy Riff | Drop-Tuned]','[Pre-Chorus | Building Chaos]','[Guitar Solo | Shredding | Technical]','[Breakdown | Mosh Pit | Half-Time]'], delivery:'Use [Screamed] for verse lines. Use [Clean Vocals] for chorus contrast. Mark breakdowns explicitly as [Breakdown | Half-Time Feel | 8 bars].' },
  reggae:     { verse:'[Verse | Conscious | Laid-Back | One-Drop]', chorus:'[Chorus | Anthemic | Uplifting | Singable]', bridge:'[Bridge | Dub | Atmospheric | Floating]', outro:'[Outro | Dub Vamp | Fading | Echo]', transitions:['[Intro | Riddim | One-Drop]','[Dub Break | Echo | Atmospheric]','[Bass Drop | Riddim]'], delivery:'Use [Spoken | Conscious] for spoken-word bridge lines. Mark the dub section as [Dub Break | Echoing | 8 bars]. Chorus should feel communal — add [Group Vocals].' },
  funk:       { verse:'[Verse | Groove-Led | Pocket | Syncopated]', chorus:'[Chorus | Euphoric | Full-Band | Tight]', bridge:'[Bridge | Breakdown | Bass-Heavy]', outro:'[Outro Vamp | Groove | Ad-libs | Fading]', transitions:['[Intro | Funk Groove | 8 bars]','[Horn Break | Punchy]','[Bass Solo | Funky]'], delivery:'Add [Ad-libs] throughout. Use [Falsetto] on funk screams and fills. Mark horn stabs in brackets: [Horn Stab | Accent]. The outro vamp is essential — mark it [Outro Vamp | Repeat and Fade].' },
  soul:       { verse:'[Verse | Testimony | Intimate | Gospel-Inflected]', chorus:'[Chorus | Declaration | Emotional Peak | Full]', bridge:'[Bridge | Darkest Moment | Raw | Confessional]', outro:'[Outro Vamp | Ascending | Ad-libs]', transitions:['[Pre-Chorus | Building]','[Instrumental Break | Soulful]'], delivery:'Use [Falsetto] on soaring lines. Use [Spoken] for bridge confessionals. Mark call-and-response in the outro: [Call] line then [Response] line.' },
  latin:      { verse:'[Verse | Narrative | Rhythmic | Conversational]', chorus:'[Chorus | Celebratory | Dance | Anthemic]', bridge:'[Bridge | Romantic | Intense | Passionate]', outro:'[Outro | Montuno | Fading | Dance]', transitions:['[Intro | Percussion Intro]','[Coro | Call and Response | Repeated]','[Instrumental Solo | Latin]'], delivery:'Mark the coro (chorus hook) as [Coro | Singable | Repeated]. Use [Percussion Break] between sections. Add [Spoken | Passionate] for bridge lines.' },
  electronic: { verse:'[Verse | Low Energy | Atmospheric | Melodic]', chorus:'[Chorus | Electronic | Synth-Led | Euphoric]', bridge:'[Bridge | Deconstructed | Minimal | Floating]', outro:'[Outro | Fading | Atmospheric]', transitions:['[Intro | Synth Pad | Evolving]','[Pre-Chorus | Rising | Filter Sweep]','[Synth Drop | Textural]'], delivery:'Use [Whispered] or [Vocoded] for processed vocal moments. Mark synth solos as [Synth Solo | Melodic]. Use [Atmospheric Break] for textural interludes.' },
  indie:      { verse:'[Verse | Intimate | Lo-Fi | Conversational]', chorus:'[Chorus | Anthemic | Jangly | Cathartic]', bridge:'[Bridge | Quiet | Reflective | Unexpected]', outro:'[Outro | Fading | Bittersweet]', transitions:['[Intro | Guitar Intro | Textured]','[Pre-Chorus | Building]','[Instrumental Break | Lo-Fi]'], delivery:'Use [Spoken] for the most confessional bridge lines. Use [Falsetto] on emotional peaks. Mark lo-fi texture moments as [Texture | Atmospheric].' },
  classical:  { verse:'[Movement I | Exposition | Thematic]', chorus:'[Refrain | Orchestral | Climactic]', bridge:'[Development | Tension | Harmonic Exploration]', outro:'[Coda | Resolution | Fading]', transitions:['[Intro | Orchestral | Stately]','[Interlude | Chamber | Intimate]'], delivery:'Use [Solo | Melodic] for lead instrument passages. Mark dynamic shifts: [Fortissimo] for climax, [Pianissimo] for intimate moments. Use [Fermata] on held resolution notes.' },
  neosoul:    { verse:'[Verse | Groove-Led | Conversational | Space]', chorus:'[Chorus | Soulful | Declaration | Full]', bridge:'[Bridge | Half-Time | Darkest Moment | Confessional]', outro:'[Outro Vamp | Escalating | Ad-libs | Free]', transitions:['[Intro | Instrumental | Groove Sets First]','[Instrumental Break | Dilla Feel]'], delivery:'Use [Falsetto] on high runs. Add [Ad-libs] with (parentheses) throughout chorus. Use [Spoken | Intimate] for bridge. The outro vamp must be marked [Outro Vamp | Escalating] — it is the most important section.' },
  gospel:     { verse:'[Verse | Testimony | Lead Vocal | Intimate]', chorus:'[Chorus | Declaration | Call and Response | Mass Choir]', bridge:'[Bridge | Shout Moment | Vamp | Climax]', outro:'[Outro Vamp | Praise | Ascending | Full Choir]', transitions:['[Pre-Chorus | Testimony Rising]','[Vamp | Repeat and Escalate]'], delivery:'Mark call-and-response: Lead line then [Response | Congregation]. Use [Shout] for the most explosive bridge moments. The outro vamp is sacred — mark every escalating line [Escalating Vamp].' },
  reggaeton:  { verse:'[Verse | Dembow | Narrative | Rhythmic]', chorus:'[Chorus | Perreo | Anthemic | Dance]', bridge:'[Bridge | Romantic | Intense | Trap-Influenced]', outro:'[Outro | Dembow Vamp | Fading]', transitions:['[Intro | Dembow Beat | 8 bars]','[Pre-Chorus | Rising | Anticipation]','[Breakdown | Dembow | Half-Time]'], delivery:'Use [Spoken | Seductive] for intimate bridge lines. Mark the dembow rhythm sections as [Dembow | High Energy]. Use [Ad-libs] in parentheses throughout. The chorus should feel like a dance floor moment — mark it [Perreo | Maximum Energy].' },
  ss:         { verse:'[Verse | Fingerpicked | Intimate | Diary-Entry]', chorus:'[Chorus | Emotional Release | Singable | Warm]', bridge:'[Bridge | Confessional | Sparse | Just Guitar]', outro:'[Outro | Quiet Resolution | Fingerpicked]', transitions:['[Intro | Fingerpicked Guitar | Solo]','[Instrumental Break | Intimate | Acoustic]'], delivery:'Use [Whispered] on the most confessional lines — the ones that feel almost too personal to sing. Use [Spoken] for bridge monologue moments. Silence between phrases is as important as the notes — mark space with [Breath | Pause]. Outro should dissolve naturally.' },
  altrock:    { verse:'[Verse | Jangly | Textured | Introspective]', chorus:'[Chorus | Cathartic | Anthemic | Distorted]', bridge:'[Bridge | Quiet | Unexpected Turn | Lo-Fi]', outro:'[Outro | Noise | Fading | Feedback]', transitions:['[Intro | Guitar Texture | Evolving]','[Pre-Chorus | Building Unease]','[Guitar Solo | Melodic | Expressive]','[Breakdown | Sparse | Quiet]'], delivery:'Use [Spoken] for the most vulnerable bridge lines. Use [Shouted] for the emotional peak of the final chorus. Mark feedback and noise moments as [Feedback | Atmospheric]. The outro should feel unresolved and fading — mark it [Outro | Noise Fading].' },
  afrobeats:  { verse:'[Verse | Narrative | Afro-Rhythmic | Conversational]', chorus:'[Chorus | Celebratory | Dance | Call and Response]', bridge:'[Bridge | Romantic | Highlife Influence | Melodic]', outro:'[Outro | Groove Vamp | Ad-libs | Fading]', transitions:['[Intro | Percussion Intro | Afro Groove]','[Pre-Chorus | Rising | Anticipation]','[Afrobeats Break | Percussion | 8 bars]'], delivery:'Use [Ad-libs] throughout — Afrobeats thrives on vocal improvisation. Mark call-and-response sections: [Call] then [Response]. Use [Spoken | Conversational] for narrative asides. The groove never stops — mark transitions as [Groove Continues | Percussion].' },
  kpop:       { verse:'[Verse | Sleek | Choreography-Ready | Cool]', chorus:'[Chorus | Massive | Melodic Peak | Anthemic]', bridge:'[Bridge | Rap Section | Intense | Shift]', outro:'[Outro | Cool Down | Melodic | Fade]', transitions:['[Intro | Instrumental Hook | 8 bars]','[Pre-Chorus | Rising | Filter Build]','[Post-Chorus | Hook Reinforcement | Dance Break]','[Rap Verse | Punchy | High Energy]'], delivery:'K-Pop uses layered delivery — mark the main vocal as [Lead Vocal] and harmonies as [Vocal Stack | Layered]. Use [Rap | Punchy] for rap sections. The post-chorus dance break is essential — mark it [Dance Break | Instrumental | 8 bars]. Use [Falsetto] on high melodic peaks.' },
  punk:       { verse:'[Verse | Aggressive | Fast | Raw]', chorus:'[Chorus | Maximum | Anthemic | Gang Vocals]', bridge:'[Bridge | Breakdown | Half-Time | Spoken]', outro:'[Outro | Feedback | Abrupt End]', transitions:['[Intro | Power Chords | Fast | 4 bars]','[Pre-Chorus | Building Aggression]','[Breakdown | Slow | Heavy | 4 bars]'], delivery:'Use [Shouted] on all verse lines — punk is yelled, not sung. Use [Gang Vocals] on the chorus — everyone sings together. Use [Spoken | Angry] for bridge monologue. Mark the ending as [Abrupt End] — punk songs often cut off hard. No fade outs.' },
  children:   { verse:'[Verse | Teaching | Playful | Singable]', chorus:'[Chorus | Singalong | Motion Cues | Joyful]', bridge:'[Bridge | Ask a Question | Wonder | Interactive]', outro:'[Outro | Repeat Together | Gentle | Resolution]', transitions:['[Intro | Playful Instrumental]','[Clap Break | Rhythmic | Fun]','[Call and Response | Simple]'], delivery:'Use [All Together] to signal group participation moments. Mark motion cues inline: [Clap Here], [Stomp Here], [Jump Here]. Use [Whispered | Gentle] for lullaby sections. Keep delivery tags simple — children respond to clear, consistent signals.' },
  parody:     { verse:'[Verse | Sincere Delivery | Absurd Content | Straight-Faced]', chorus:'[Chorus | Comedic Payoff | Maximum Commitment | Catchy]', bridge:'[Bridge | Escalation | Most Unhinged Moment]', outro:'[Outro | Callback | Final Punchline]', transitions:['[Pre-Chorus | Tension Build | Serious Face]','[Instrumental Break | Genre-Authentic]'], delivery:'The music must be COMPLETELY sincere — [Sincere | No Winking]. Comedy lives in lyrics only. Use [Spoken | Deadpan] for the most absurd bridge lines. The final line of the song is the biggest punchline — mark it [Punchline | Final Line].' },
  comedy:     { verse:'[Verse | Setup | Premise Established | Conversational]', chorus:'[Chorus | Comedic Hook | Maximum Funny | Catchy]', bridge:'[Bridge | Darkest Point | Most Unhinged | Escalation]', outro:'[Outro | Final Punchline | Payoff | Callback]', transitions:['[Pre-Chorus | Tension | Stakes Rising]','[Instrumental Break | Comedic Timing]'], delivery:'Use [Spoken | Deadpan] for setup lines. Use [Shouted | Committed] for the chorus punchlines. Mark the callback in the outro as [Callback | Punchline Payoff]. The final line of the entire song is THE punchline — mark it [Final Punchline | Song Ends Here].' },
  tvmusical:  { verse:'[Verse | Character Voice | Dramatic | Scene-Setting]', chorus:'[Chorus | Belted | Emotional Peak | Theatrical]', bridge:'[Bridge | Darkest Moment | Turning Point | Intimate]', outro:'[Outro | Resolution | Reprise Melody | Curtain]', transitions:['[Intro | Orchestral Swell | Cinematic]','[Pre-Chorus | Tension Build | Dramatic]','[Underscore | Dialogue Ready]'], delivery:'Use [Belted] for the biggest theatrical moments. Use [Spoken | In Character] for dialogue-adjacent lines. Mark the dramatic turning point as [Turning Point | Key Change | Climax]. TV themes get [Theme Sting] at the end. Jingles get [Product Name | Sung | Catchy] on every chorus.' },
};

const SUBSTYLE_BRACKETS={
  'G-Funk':            { verse:'[16-bar Verse | Laid-Back | West Coast]', hook:'[Hook | Sung | Smooth | Nate Dogg style]', extra:['[Synth Whine Break]','[Outro Vamp]'] },
  'Bay Area':          { verse:'[16-bar Verse | Hyphy | High Energy]',   hook:'[Hook | Hyphy | Call and Response | Crowd]', extra:['[Ghost Ride Break]','[Outro | Ad-libs]'] },
  'Down South':        { verse:'[16-bar Verse | Southern Drawl]',         hook:'[Hook | Southern | Chant | Slow]',           extra:['[Trunk Music Break]','[Outro Vamp]'] },
  'Crunk':             { verse:'[8-bar Verse | Rapid | Punchy]',          hook:'[Hook | Screamed | Call and Response | Crunk]', extra:['[Crunk Break]','[Crowd Chant]'] },
  'Chopped & Screwed': { verse:'[16-bar Verse | Chopped | Slowed]',       hook:'[Hook | Chopped | Syrupy | Slow]',            extra:['[Screwed Break]','[Chopped Ad-libs]'] },
  'Trap':              { verse:'[12-bar Verse | Trap | Rap Verse]',        hook:'[Hook | Melodic | Auto-Tune]',               extra:['[Trap Break]','[Outro | Fade-Out]'] },
  'Boom Bap':          { verse:'[16-bar Verse | Boom Bap | Dense]',       hook:'[Hook | Rapped | Chanted]',                  extra:['[Boom Bap Break]','[Outro]'] },
  'Melodic Rap':       { verse:'[16-bar Verse | Rap Verse | Melodic]',    hook:'[Hook | Sung | Melodic | Auto-Tune]',        extra:['[Bridge | Sung]','[Outro | Fade-Out]'] },
  'Drill':             { verse:'[16-bar Verse | Drill | Dark]',            hook:'[Hook | Melodic | Dark | Drill]',            extra:['[Drill Break]','[Outro]'] },
  'East Coast':        { verse:'[16-bar Verse | Boom Bap | Lyrical]',     hook:'[Hook | Chanted | Anthemic]',                extra:['[Boom Bap Break]','[Outro]'] },
  'Midwest':           { verse:'[16-bar Verse | Soulful | Rap Verse]',    hook:'[Hook | Sung | Soul | Chipmunk]',            extra:['[Soul Break]','[Outro Vamp]'] },
  'Cloud Rap':         { verse:'[16-bar Verse | Hazy | Slow Flow]',       hook:'[Hook | Ethereal | Whispered | Melodic]',    extra:['[Ambient Break]','[Outro | Fade-Out]'] },
  'Lyrical/Conscious': { verse:'[16-bar Verse | Lyrical | Dense]',        hook:'[Hook | Chanted | Anthemic | Conscious]',    extra:['[Spoken Word Bridge]','[Outro]'] },
  'Old School':        { verse:'[16-bar Verse | Old School | Boom Bap]',  hook:'[Hook | Rapped | Classic]',                  extra:['[Scratch Break]','[Outro]'] },
  // Neo-Soul
  'Classic Neo-Soul':  { verse:'[Verse | Groove-Led | Conversational]',     hook:'[Chorus | Soulful | Declaration]',          extra:['[Outro Vamp | Escalating Ad-libs]','[Bridge | Half-Time Feel]'] },
  'Hip-Hop Neo-Soul':  { verse:'[Verse | Rap-Soul | Dilla Feel]',            hook:'[Chorus | Sung | Soul]',                    extra:['[Rap Bridge | Bars]','[Outro Vamp]'] },
  'Neo-Soul Ballad':   { verse:'[Verse | Intimate | Space-Between-Lines]',   hook:'[Chorus | Emotional Peak | Runs]',          extra:['[Bridge | Darkest Point]','[Outro Vamp | Vocal Improvisation]'] },
  'Psychedelic Soul':  { verse:'[Verse | Cosmic | Layered]',                 hook:'[Chorus | Transcendent | Soulful]',         extra:['[Psychedelic Break | Textures]','[Outro Vamp | Hypnotic]'] },
  // Gospel
  'Traditional Gospel':{ verse:'[Verse | Testimony | Lead Vocal]',           hook:'[Chorus | Declaration | Call and Response]',extra:['[Bridge | Shout Moment | Vamp]','[Outro Vamp | Choir]'] },
  'Contemporary Gospel':{ verse:'[Verse | Testimony | Modern]',              hook:'[Chorus | Celebratory | Mass Choir]',       extra:['[Bridge | Vamp | Repeat and Escalate]','[Outro | Full Choir]'] },
  'Worship / CCM':     { verse:'[Verse | Intimate | Setup]',                 hook:'[Chorus | Congregational | Singable]',      extra:['[Bridge | Highest Moment | Repeat]','[Outro | Worship Vamp]'] },
  'Gospel Hip-Hop':    { verse:'[16-bar Verse | Rap | Testimony]',           hook:'[Hook | Gospel | Celebratory]',             extra:['[Bridge | Spiritual Peak]','[Outro | Praise Vamp]'] },
  // Children
  'Singalong / Playful':{ verse:'[Verse | Teaching | Playful]',              hook:'[Chorus | Singalong | Motion Cues]',        extra:['[Clap Break]','[Outro | Repeat Chorus Together]'] },
  'Educational':       { verse:'[Verse | Discovery | Wonder]',               hook:'[Chorus | Remember This | Simple]',         extra:['[Bridge | Ask a Question]','[Outro | Recap]'] },
  'Lullaby / Bedtime': { verse:'[Verse | Soft | Safe | Descending Melody]',  hook:'[Chorus | Gentle | Soothing | Love]',       extra:['[Bridge | Quieter]','[Outro | Drift | Fade]'] },
  'Silly / Nonsense':  { verse:'[Verse | Absurd | Committed | Straight-Face]',hook:'[Chorus | Maximum Silly | Repeat]',        extra:['[Bridge | Even Sillier]','[Outro | Nonsense Vamp]'] },
  // Parody
  'Genre Parody':      { verse:'[Verse | Mirror Original Genre]',          hook:'[Chorus | Comedic Payoff | Sincere Delivery]', extra:['[Bridge | Escalation]','[Outro | Callback]'] },
  'Pop Parody':        { verse:'[Verse | Upbeat | Absurd Subject]',         hook:'[Chorus | Catchy | Ridiculous]',              extra:['[Pre-Chorus | Tension Build]','[Bridge | Subvert]'] },
  'Rap Parody':        { verse:'[16-bar Verse | Rap Flow | Deflating Topic]', hook:'[Hook | Rapped | Anti-Climactic]',          extra:['[Rap Break | Commitment Bit]','[Outro | Punchline]'] },
  'Ballad Parody':     { verse:'[Verse | Restrained | Setup Trivial Topic]', hook:'[Chorus | Epic | Overdramatic | Trivial]',  extra:['[Pre-Chorus | Tension]','[Bridge | Darkest Version | Climax]'] },
  // Comedy
  'Absurdist':         { verse:'[Verse | Straight-Faced | Absurd Logic]',   hook:'[Chorus | Committed | Ridiculous Premise]',  extra:['[Bridge | Escalation | Unhinged]','[Outro | Dream Logic]'] },
  'Dark Comedy':       { verse:'[Verse | Upbeat | Dark Subject]',           hook:'[Chorus | Cheerful | Uncomfortable Truth]',  extra:['[Bridge | Darkest Point]','[Outro | Casual Resolution]'] },
  'Satirical':         { verse:'[Verse | Exaggerated | Target Established]', hook:'[Chorus | Satirical | Repeated Accusation]',extra:['[Bridge | Killing Blow]','[Outro | Ironic]'] },
  'Observational':     { verse:'[Verse | Conversational | Relatable]',      hook:'[Chorus | Universal Frustration | Catchy]',  extra:['[Bridge | Specific Detail]','[Outro | Acceptance]'] },
  'Musical Roast':     { verse:'[Verse | Setup Target]',                    hook:'[Chorus | Roast | Repeated Charge]',         extra:['[Bridge | Killing Blow]','[Outro | Final Joke]'] },
  // TV / Musical
  'TV Theme':          { verse:'[Intro | Premise Setup]',                   hook:'[Theme Hook | Show Title | Catchy]',         extra:['[Instrumental Tag]','[Outro Sting]'] },
  'Broadway / Show Tune': { verse:'[Verse | Character Voice | Dramatic]',  hook:'[Chorus | Belted | Emotional Peak]',         extra:['[Pre-Chorus | Tension Build]','[Bridge | Darkest Moment | Turning Point]'] },
  'Disney-Style':      { verse:'[Verse | Wonder | I Want Song]',            hook:'[Chorus | Magical | Soaring | Big Dream]',   extra:['[Pre-Chorus | World Responds]','[Bridge | Dark Moment | Hope]'] },
  'Jingle / Ad':       { verse:'[Verse | Problem | Pain Point]',            hook:'[Chorus | Product Name | Benefit | Catchy]', extra:['[Instrumental Tag]','[Outro | Call to Action]'] },
  'Sitcom Theme':      { verse:'[Intro | Premise | Warm]',                  hook:'[Theme Hook | Show World | Inviting]',       extra:['[Instrumental Break]','[Tag | Laugh Track Ready]'] },
  'Prestige Drama Theme': { verse:'[Intro | Atmosphere | Stakes]',          hook:'[Theme | Melancholic | Foreboding]',         extra:['[Instrumental Swell]','[Outro | Fade]'] },
};


// ═══════════════════════════════════════════════════════
// PROMPT BUILDERS
// ═══════════════════════════════════════════════════════

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function bracketInstructionServer(genre, mode, substyle) {
  mode = mode || 'suno';
  const sb = SUBSTYLE_BRACKETS[substyle];   // substyle-specific (hiphop substyles, etc.)
  const gb = GENRE_SUNO_BRACKETS[genre];    // genre-level blueprint

  if (mode === 'none') {
    return 'SECTION TAGS: Write the lyrics with absolutely NO section labels, headers, or brackets of any kind. Pure lyric lines only.';
  }

  if (mode === 'basic') {
    if (sb) return `SECTION TAGS: Use these brackets for sections. Verse: ${sb.verse}. Hook/Chorus: ${sb.hook}. Include bridge and outro.`;
    if (gb) return `SECTION TAGS: Use these exact brackets. Verse: ${gb.verse}. Chorus: ${gb.chorus}. Bridge: ${gb.bridge}. Outro: ${gb.outro}. Every section MUST start with its bracket tag on its own line.`;
    return 'SECTION TAGS: Every section MUST start with its bracket tag on its own line — e.g. [Verse 1] then the lines, [Chorus] then the lines, [Bridge] then the lines.';
  }

  if (mode === 'enhanced') {
    if (sb) return `SECTION TAGS: Enhanced brackets. Verse: ${sb.verse}. Hook: ${sb.hook}. Extra transitions: ${sb.extra ? sb.extra.join(', ') : ''}. Add energy/mood markers to each bracket.`;
    if (gb) return `SECTION TAGS: Enhanced brackets with mood/energy markers. Verse: ${gb.verse}. Chorus: ${gb.chorus}. Bridge: ${gb.bridge}. Outro: ${gb.outro}. Include these transitions between sections: ${gb.transitions.join(', ')}. Add energy levels to each section bracket.`;
    return 'SECTION TAGS: Use enhanced brackets with mood/energy markers: [Verse 1 | Intimate], [Pre-Chorus | Building], [Chorus | Explosive], [Bridge | Reflective], [Outro | Resolving].';
  }

  if (mode === 'suno') {
    // The optimal Suno mode — genre blueprints + inline vocal delivery tags + transitions
    if (sb) {
      return `SUNO-OPTIMIZED BRACKETS: Use these section brackets. Verse: ${sb.verse}. Hook/Chorus: ${sb.hook}. Include transitions: ${sb.extra ? sb.extra.join(', ') : ''}. INLINE DELIVERY TAGS: Place [Whispered], [Falsetto], [Screamed], [Spoken], [Ad-libs], or [Rap] on their own line immediately before any lyric line that requires that delivery. These tell Suno exactly how to perform that specific line. Every section MUST open with its bracket tag on its own line.`;
    }
    if (gb) {
      return `SUNO-OPTIMIZED BRACKETS — apply all of these to maximize Suno's output quality:

SECTION BRACKETS (every section opens with one of these on its own line):
• Verse: ${gb.verse}
• Chorus: ${gb.chorus}
• Bridge: ${gb.bridge}
• Outro: ${gb.outro}
• Transitions to place between sections: ${gb.transitions.join(' | ')}

INLINE DELIVERY TAGS (place on their own line immediately before any lyric line needing special delivery):
[Whispered] — intimate, close-mic, breath-heavy lines
[Falsetto] — high sustained or soaring notes
[Spoken] — spoken word, confessional, or monologue lines
[Ad-libs] — free vocal riffs and fills (mark with parentheses inline too)
[Screamed] — maximum intensity lines (rock/metal/gospel)
[Harmony] — layered vocal harmony section

${gb.delivery}

ENERGY ARC: The verse should feel noticeably lower energy than the chorus. The bridge should feel like a completely different world — more vulnerable or more intense. The outro should feel like release after the final chorus peak.`;
    }
    return `SUNO-OPTIMIZED BRACKETS: Use section brackets with mood markers on every section: [Verse 1 | Intimate | 4/10], [Pre-Chorus | Building | 6/10], [Chorus | Full Production | 9/10], [Bridge | Stripped | 5/10], [Final Chorus | Maximum | 10/10]. Add inline delivery tags [Whispered], [Falsetto], [Spoken] on their own line before any line requiring special vocal delivery.`;
  }

  if (mode === 'experimental') {
    if (sb) return `SECTION TAGS: Full meta-brackets. Verse: ${sb.verse}. Hook: ${sb.hook}. Extra: ${sb.extra ? sb.extra.join(', ') : ''}. Add production, energy, mood meta-tags to every section.`;
    if (gb) return `META-BRACKETS — full production direction baked into every bracket. Verse: ${gb.verse} | energy 3-4/10. Chorus: ${gb.chorus} | energy 8-10/10. Bridge: ${gb.bridge} | energy 5/10. Outro: ${gb.outro}. Transitions: ${gb.transitions.join(', ')}. Inline tags: ${gb.delivery}. Add BPM feel, instrument cues, and energy level to EVERY bracket.`;
    return 'SECTION TAGS: Meta-brackets with full production direction: [Verse 1 | Sparse | Intimate | 4/10 energy], [Pre-Chorus | Building | Tension | 6/10], [Chorus | Full Production | Euphoric | 9/10], [Bridge | Stripped | Raw | 5/10], [Final Chorus | Maximum | 10/10].';
  }

  return 'SECTION TAGS: Every section MUST start with its bracket tag on its own line.';
}

function sanitizeInput(str, maxLen = 300) {
  if (typeof str !== 'string') return '';
  return str.slice(0, maxLen).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

// ─── AGE GROUPS ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// EDGE MODE — Lyrical permission system for adult audiences
// ─────────────────────────────────────────────────────────────────────────
// Off by default. When enabled, unlocks genre-authentic profanity, raw
// imagery, and edge-topic permission so the AI stops self-sanitizing.
// Always gated by ageGroup: any non-adult audience force-disables all
// edge flags regardless of toggle state.
//
// HARD SAFETY FLOORS (never crossed, regardless of mode):
//  • No sexual content involving minors
//  • No actionable instructions for real-world harm (weapons, synthesis,
//    self-harm methods, attacks on specific people/places)
//  • No hate speech endorsing violence against protected classes
//  • No doxxing or real-person defamation
//
// EDGE_TOPICS — individual permission flags (multi-select). User toggles
// only the territories they want; unselected stay off even in raw mode.
// ═══════════════════════════════════════════════════════════════════════════
const EDGE_TOPICS = {
  profanity: {
    label: 'Profanity',
    short: 'fuck/shit/damn/bitch — where genre-authentic',
    permission: 'Profanity is ALLOWED where it serves the emotional truth of the song. Use curse words as emotional amplifiers not decoration: "fuck" for rage/release, "shit" for dismissal/weight, "damn" for exasperation, "bitch" only in genre-authentic context (drill, trap, punk protest). NEVER force profanity into a song where the genre does not naturally carry it (folk ballads, children-adjacent pop, devotional gospel). The rule: every curse must earn its bar — if removing it leaves the line just as powerful, remove it. Preferred placements: punchline bar, chorus release beat, bridge emotional peak.',
    lexicon: ['fuck','fucking','shit','damn','hell','bitch','ass','goddamn','bullshit','motherfucker'],
    bans: ['slurs targeting race, ethnicity, sexuality, gender, disability — not negotiable even in genre context']
  },
  sex_explicit: {
    label: 'Sex & Desire',
    short: 'raw sensuality / bedroom / slack territory',
    permission: 'Explicit adult sexuality is ALLOWED. Write desire with physical specificity: body parts named, tactile detail (skin, sweat, breath, teeth, grip), the rhythm of the encounter mapped to the groove. Dancehall slack, reggaeton perreo, R&B bedroom, country outlaw — lean into the genre\'s tradition. Avoid Hallmark euphemism ("made love under stars") — replace with concrete specificity. Power dynamics and consent are adult subjects; honor complexity. Hard floor: every participant is unmistakably an adult; no ambiguous age framing.',
    registers: ['tactile-specific','power-play','aftermath-intimate','public-flirt','slack-explicit'],
    bans: ['any sexual content involving anyone under 18 — absolute floor, no exceptions, no ambiguity']
  },
  violence_street: {
    label: 'Street / Violence',
    short: 'drill, gangster rap, punk rage — lived experience',
    permission: 'Street-level violence imagery is ALLOWED as lived experience and social documentation. Drill, gangster rap, punk, murder ballads, narcocorridos — these genres process real violence through art. Write the aftermath, the grief, the complicity, the adrenaline — not an instruction manual. Rule: describe the world, do not choreograph a crime. No weapon-build instructions, no tactical advice, no named targets for real people or locations. The strongest street writing is unflinching about cost (Nas "One Mic", Scarface "I Seen a Man Die") — violence without consequence is juvenile.',
    territories: ['block-life-observation','survivor-guilt','revenge-imagined','inherited-trauma','adrenaline-aftermath'],
    bans: ['operational detail (how to build, where to strike, how to evade) — artistic, not instructional','named living targets or specific real locations as targets']
  },
  substance: {
    label: 'Substances',
    short: 'weed / alcohol / pharma — culture, not endorsement',
    permission: 'Substance references are ALLOWED. Weed in hip-hop/reggae, whiskey in country/blues, pharma in emo/trap, cocaine in 80s-coded disco — these are genre vocabulary. Write the ritual, the come-up, the comedown, the cost. Nuance beats glamour: the best substance writing (Amy Winehouse "Rehab", Juice WRLD "Lucid Dreams", Kendrick "Swimming Pools") names the ambivalence. Avoid "party drug checklist" without context — specificity of experience beats product placement.',
    territories: ['ritual-wind-down','addiction-honest','social-lubricant','escape-from-pain','comedown-wreckage'],
    bans: ['specific sourcing, dosing, or synthesis info — lyrics, not harm-reduction pamphlet']
  },
  political_rage: {
    label: 'Political / Protest',
    short: 'rage against systems — punk, rap, roots, folk',
    permission: 'Political anger and systemic critique are ALLOWED and HONORED. Punk anti-establishment, conscious rap, roots reggae Babylon critique, protest folk — these are cornerstones of popular music. Name the system, name the harm, name the cost to a specific body. Rule: punch up (at institutions, power structures, corporations, complicit governments) never down (at individuals of less power). Avoid vague "system bad" sloganeering — the best protest writing (Rage Against the Machine, Kendrick, Peter Tosh, Woody Guthrie) grounds rage in one specific injustice seen through one specific witness.',
    territories: ['institutional-critique','labor-exploitation','police-state','colonial-memory','climate-grief','gender-structural']
  },
  grief_raw: {
    label: 'Raw Grief',
    short: 'blues, country, emo — unflinching loss',
    permission: 'Unflinching grief is ALLOWED and often required by genre. Blues, country, emo, Americana, torch ballads — these are built on loss written without redemptive arc. Write the mundane texture of grief: the empty side of the bed, the voicemail unchanged, the laundry that still smells, the dog who waits at the door. Avoid "they\'re in a better place" sanitization. The craft (Springsteen "Streets of Philadelphia", Mount Eerie "A Crow Looked at Me", Tracy Chapman "Fast Car") stays in the present tense of the wound.',
    territories: ['object-permanence','ritual-broken','survivor-guilt','unresolved-last-words','absence-specific']
  },
  mental_health: {
    label: 'Mental Health',
    short: 'anxiety / depression / suicidal ideation — with care',
    permission: 'Mental health territory including depression, anxiety, and suicidal ideation is ALLOWED when the song treats it as lived interior experience, not spectacle. Elliott Smith, Phoebe Bridgers, Linkin Park, Logic "1-800-273-8255" — these songs saved lives by naming the interior honestly. Rules: write the feeling (not the method), honor complexity (not everyone recovers cleanly, but hope belongs in the room somewhere — even as ambivalence), include a grounding image (specific sensory anchor that keeps the song human not abstract). Hard floor: no actionable self-harm methods or step-by-step ideation.',
    territories: ['fog-depression','spiral-anxiety','dissociation-detached','rumination-loop','return-to-light','ambivalent-survival'],
    bans: ['specific self-harm methods, medication details for overdose, or "how-to" framing']
  },
  body_raw: {
    label: 'Body / Taboo',
    short: 'bodily reality — sweat, blood, piss, shit, vomit, scars',
    permission: 'Taboo bodily imagery is ALLOWED when it serves emotional truth. Sweat on a dance floor, blood on the sheets (menstruation, injury, intimacy), vomit after the breakdown, scars as topography — the body is a legitimate lyric instrument. Genres that lean here: blues, country, punk, Americana confessional, hip-hop street, emo. Rule: embodied specificity beats poetic abstraction. "I threw up in the kitchen sink at 3am" has more weight than "I felt sick".',
    territories: ['sweat-labor','blood-intimate','scars-earned','body-horror-grief','illness-chronic','appetite-honest']
  },
  class_money: {
    label: 'Class & Money Honest',
    short: 'broke / overdraft / eviction — not aspirational',
    permission: 'Specific working-class and poverty realism is ALLOWED. Rent-due Friday, pawn-shop receipts, overdraft fees, shoplifting groceries, eviction notices, payday-loan math, hand-me-down everything. Country, blues, folk, conscious rap, emo, Americana — these genres are BUILT on economic specificity. Avoid generic "struggle" signaling without material detail — the best class writing (Dolly "Coat of Many Colors", Kendrick, Tracy Chapman, Fiona Apple) names exact dollar amounts, brand names of cheap goods, the geography of scarcity.',
    territories: ['rent-math','food-scarcity','inheritance-none','work-body-breaking','wealth-contact-shame','debt-generational']
  }
};

// ─────────────────────────────────────────────────────────────────────────
// EDGE MODE profiles — meta-toggle on top of per-topic flags
//  off       = current behavior; nothing unlocked
//  authentic = unlock the genre's own native edge; respect craft limits
//  raw       = maximum authenticity; every selected topic at full weight
// ─────────────────────────────────────────────────────────────────────────
const EDGE_MODES = {
  off: {
    label: 'Clean',
    weight: 0,
    headerNote: ''
  },
  authentic: {
    label: 'Authentic',
    weight: 1,
    headerNote: 'EDGE MODE: AUTHENTIC — You have explicit permission to write at the genre\'s native edge. Match the register of the real canonical artists in this genre: if the best songs in this tradition use profanity, raw imagery, and adult territory, you SHOULD use them where they serve the craft. Do not self-sanitize below the genre\'s real floor. Still honor the song\'s emotional truth — edge without purpose is juvenile.'
  },
  raw: {
    label: 'Raw',
    weight: 2,
    headerNote: 'EDGE MODE: RAW — Maximum authenticity. Every selected permission is at full weight. Write as the most uncompromising artist in this tradition would. Do NOT add moral framing, disclaimer language, or redemptive arcs unless the song itself organically arrives there. The adult listener is an intelligent participant, not a vulnerable audience requiring protection. Still observe the absolute floors below.'
  }
};

const EDGE_HARD_FLOORS = `\n
ABSOLUTE FLOORS — never crossed regardless of edge mode:
- No sexual content involving anyone under 18, no ambiguous age framing
- No actionable instructions for real-world harm (weapon construction, drug synthesis, attack planning, suicide methods)
- No hate speech endorsing violence against protected classes (race, ethnicity, religion, sexuality, gender, disability)
- No doxxing, no targeting real living individuals with defamation or calls to harm
- No glorification of sexual violence, child abuse, or genocide
These floors apply inside every mode. They do not restrict craft — the greatest artists in every tradition honor them.`;

function buildEdgeNote({ edgeMode = 'off', edgeTopics = [], ageGroup = '' } = {}) {
  // Hard gate: any non-adult audience disables edge entirely
  const adultAudiences = new Set(['', 'young-adult', 'adult']);
  if (!adultAudiences.has(ageGroup)) return '';

  const mode = EDGE_MODES[edgeMode] || EDGE_MODES.off;
  if (mode.weight === 0) return '';

  const topics = Array.isArray(edgeTopics) ? edgeTopics : [];
  const activeTopics = topics.filter(t => EDGE_TOPICS[t]);
  if (!activeTopics.length) {
    // Mode on but no topics selected → just the permission banner, no specifics
    return `\n\n${mode.headerNote}${EDGE_HARD_FLOORS}`;
  }

  const topicBlocks = activeTopics.map(t => {
    const cfg = EDGE_TOPICS[t];
    let block = `• ${cfg.label.toUpperCase()} — ${cfg.permission}`;
    if (cfg.lexicon && mode.weight >= 1) {
      block += `\n  Lexicon available: ${cfg.lexicon.join(', ')}.`;
    }
    if (cfg.territories) {
      block += `\n  Territories: ${cfg.territories.join(' · ')}.`;
    }
    if (cfg.registers) {
      block += `\n  Registers: ${cfg.registers.join(' · ')}.`;
    }
    if (cfg.bans) {
      block += `\n  Still off-limits in this topic: ${cfg.bans.join(' | ')}.`;
    }
    return block;
  }).join('\n\n');

  return `\n\n${mode.headerNote}\n\nEDGE PERMISSIONS ACTIVE (${activeTopics.length} ${activeTopics.length === 1 ? 'territory' : 'territories'}):\n${topicBlocks}${EDGE_HARD_FLOORS}`;
}

const AGE_GROUPS = {
  'toddler': {
    label: 'Toddlers (1–4)',
    vocab: 'Extremely simple 1–2 syllable words only. Single-concept sentences. Colors, animals, body parts, family members.',
    themes: 'Colors, animals, simple objects, family love, bedtime, bath time, peek-a-boo, clapping games.',
    structure: 'Ultra-short sections (4–8 lines max). Heavy repetition — repeat the hook 4–6 times. Call-and-response encouraged.',
    rules: 'No complex narrative. Pure sensory and physical experience. Motion cues (clap, stomp, spin) are essential. Melody range max 5 notes.',
    genreMap: 'children',
    sunoHint: 'children\'s song, ukulele, hand claps, xylophone, playful, major key, bright, 110 BPM, joyful, singalong'
  },
  'kids': {
    label: 'Kids (5–8)',
    vocab: 'Simple clear vocabulary, max 2–3 syllable words. Short sentences. Rhymes are fun, not forced.',
    themes: 'School, friendship, animals, adventures, imagination, nature, kindness, family, being brave, small everyday discoveries.',
    structure: 'Short verse-chorus. Chorus 3–4× minimum. Bridge optional. Total length 2–3 min.',
    rules: 'Teach without preaching. Humor and wordplay welcome. Motion cues (clap, jump, spin). Avoid scary or adult themes.',
    genreMap: 'children',
    sunoHint: 'children\'s pop, upbeat, acoustic guitar, glockenspiel, hand claps, singalong, educational, joyful, 115 BPM'
  },
  'tween': {
    label: 'Tweens (9–12)',
    vocab: 'Age-appropriate modern vocabulary. Relatable school/social themes. Avoid adult sexuality or violence.',
    themes: 'School, friends, fitting in, first crushes (innocent), sports, games, family, pets, growing up, being yourself.',
    structure: 'Standard pop structure. V-PC-C × 2 with bridge. 2.5–3.5 min.',
    rules: 'Emotionally relatable without being adult. Aspirational. Fun over edgy. No explicit content.',
    genreMap: null,
    sunoHint: 'kids pop, bright, energetic, modern production, fun, relatable, school-age themes'
  },
  'teen': {
    label: 'Teens (13–17)',
    vocab: 'Contemporary teen language, current slang (but not over-dated). Emotionally direct.',
    themes: 'Identity, social pressure, first love, heartbreak (non-explicit), friendship loyalty, dreams, self-expression, social media, school stress.',
    structure: 'Modern pop/hip-hop structure. Short punchy verses. Hooky chorus. May include pre-chorus.',
    rules: 'Authentic emotional truth without explicit content. Self-empowerment themes resonate. Avoid condescension.',
    genreMap: null,
    sunoHint: null
  },
  'young-adult': {
    label: 'Young Adults (18–24)',
    vocab: 'No restrictions. Contemporary, culturally current.',
    themes: 'Independence, career beginnings, new relationships, heartbreak, late nights, finding yourself, FOMO, ambition.',
    structure: 'Any modern structure. Standard adult song conventions.',
    rules: 'Adult themes acceptable. Authentic to the experience of early independence and self-discovery.',
    genreMap: null,
    sunoHint: null
  },
  'adult': {
    label: 'Adults (25+)',
    vocab: 'No restrictions. Mature, emotionally nuanced.',
    themes: 'Long-term relationships, career, family, nostalgia, loss, legacy, identity, life\'s complexity.',
    structure: 'Any structure. Can be more complex and emotionally layered.',
    rules: 'Adult themes acceptable. Values depth and authenticity over novelty.',
    genreMap: null,
    sunoHint: null
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// BRIDGE ARCHETYPES — Randomised per generation to prevent the same
// 2-4 bar quiet/whisper bridge appearing by default every time.
// Each archetype specifies structure, energy, delivery and lyric approach.
// ═══════════════════════════════════════════════════════════════════════════

const BRIDGE_ARCHETYPES = [
  {
    name: 'Confessional Drop',
    energy: 'low → slow build',
    bars: '4–6',
    delivery: 'Almost spoken — conversational, not sung. No melody, just cadence. Like the artist stopped performing and started talking.',
    lyric: 'One hard truth the song has been circling around but never said. Single sentence per line. No rhyme required — the honesty IS the structure.',
    production: 'Pull everything back: just one instrument (piano, guitar, or sparse pad). Vocal dry with no reverb or delay. Space between lines.',
    rule: 'BRIDGE MUST be the moment the mask comes off. Unpolished. Real. Then the final chorus returns with the full weight of what was just admitted.',
  },
  {
    name: 'Escalation Climb',
    energy: 'mid → peak intensity',
    bars: '8',
    delivery: 'Starts at verse energy, builds line by line to the most intense vocal moment in the song. The bridge IS the climax, not the chorus.',
    lyric: 'Each line raises the stakes of the conflict or emotion. Last 2 lines hit hardest — these are the lines people screenshot. Stack imagery, not narrative.',
    production: 'Drums build every 2 bars. Instrumentation layers in. Final 2 bars: full band, pushed vocal, reverb tail. Explode into final chorus.',
    rule: 'BRIDGE MUST end louder and more urgent than it started. It earns the final chorus release.',
  },
  {
    name: 'Left-Turn Narrative',
    energy: 'different texture — sideways move',
    bars: '6–8',
    delivery: 'Different vocal register or approach than any other section. If verses were sung, bridge could be half-rapped or spoken. Change the instrument.',
    lyric: 'New POV, new timeline, or new character. The bridge is a cut to a scene from the past, a letter, a conversation, or a future projection. Not a continuation — a reframe.',
    production: 'Instrument swap or featured instrument solo takes the melodic lead. Drums might drop completely or switch to half-time. Unexpected key area.',
    rule: 'BRIDGE MUST feel like a different song that makes you understand the original song better when it ends.',
  },
  {
    name: 'Rhythmic Breakdown',
    energy: 'high — groove-locked',
    bars: '4–8',
    delivery: 'Rhythmic, chant-like, almost percussive. Words land on the beat like kicks and snares. Call-and-response optional. Could be a single repeated phrase evolving.',
    lyric: 'Short, punchy lines. 2-5 syllables each. Works on repetition and slight variation — same phrase with one word changed each time. The meaning shifts through the changes.',
    production: 'Drums and bass only, or a single hypnotic instrument loop. Everything else stripped. Let the groove breathe and build tension through rhythm alone.',
    rule: 'BRIDGE MUST be physically infectious — the listener\'s head should nod before their brain processes the words.',
  },
  {
    name: 'Emotional Reversal',
    energy: 'mirror opposite of the chorus',
    bars: '4–6',
    delivery: 'If chorus is soaring and anthemic, bridge is quiet and close. If chorus is dark, bridge finds a thread of hope. The contrast IS the point.',
    lyric: 'Reframe the central metaphor of the song from the opposite direction. If the song is about loss, find what was gained. If it\'s about love, acknowledge the cost. Dual truth.',
    production: 'Harmonic shift — bridge often borrows from the relative major/minor or lands on an unexpected chord that makes the return to chorus feel like resolution.',
    rule: 'BRIDGE MUST make the final chorus sound like it means something different than it did the first time.',
  },
  {
    name: 'Pre-Outro Vamp Build',
    energy: 'medium → cascading',
    bars: '6–8 with repeating tag',
    delivery: 'Last 2 bars of the bridge repeat 2-3 times with slight melodic variation each time. The repetition creates tension that the final chorus releases.',
    lyric: 'Write the bridge as a complete thought, then isolate the last line as the repeating tag. The tag should work both as a question and an answer depending on inflection.',
    production: 'Background vocals enter on repeating tag. Layered harmonies build. Slight BPM push (feels faster without changing tempo) through drum pattern tightening.',
    rule: 'BRIDGE MUST set up the final chorus as the only possible resolution to the tension it builds.',
  },
  {
    name: 'Lyric Callback / Recontextualise',
    energy: 'same energy as verse 1, but heavier',
    bars: '4–6',
    delivery: 'Callbacks land differently once context has built. Deliver familiar lines with new emotional weight — slower, or more fragile, or harder.',
    lyric: 'Take an image or line from verse 1 and return to it — but now the circumstances have changed. Same words, entirely different meaning. The listener should feel the shift.',
    production: 'Mirror the production of verse 1 but stripped down. The familiarity of the instrumentation makes the shifted meaning land harder.',
    rule: 'BRIDGE MUST prove the song was planning this moment from the first bar. Callback creates inevitability.',
  },
  {
    name: 'Spoken Interlude / Monologue',
    energy: 'ambient — static tension',
    bars: '4–8 (flexible)',
    delivery: 'Not sung at all. Spoken directly. Could be a voicemail, a memory, an argument, an internal monologue. Raw voice, minimal or no music under it.',
    lyric: 'Write as prose, not poetry. Irregular line lengths. Real speech rhythms — sentence fragments, self-corrections, trailing thoughts. The only rule: it must be true to the character.',
    production: 'Music fades to near-silence or single sustained note/pad. Possible: ambient sound texture under the voice (rain, static, room tone). Returns with full force on final chorus.',
    rule: 'BRIDGE MUST sound like it was captured, not composed. The listener should lean in.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// OUTRO ARCHETYPES — Prevents the default "fade out over repeating chorus"
// ═══════════════════════════════════════════════════════════════════════════

const OUTRO_ARCHETYPES = [
  { name: 'Cold Stop', rule: 'Song ends on a single word, note, or silence mid-phrase. Abrupt. The absence of resolution IS the ending. No fade — a hard cut that leaves the listener mid-breath.' },
  { name: 'Spiral Vamp', rule: 'Outro takes the hook and slowly deconstructs it — strip instruments one by one, change one word in the hook each repeat, until only voice and one note remain. The song unravels deliberately.' },
  { name: 'Callback Resolution', rule: 'Outro returns to the opening line or image from Verse 1, but now it lands completely differently. The song ends where it began — the journey changed the meaning. No new material.' },
  { name: 'Crowd Takeover', rule: 'Final section hands the song to the audience — melody simplified to its most singable core, lyrics pared to 4-6 words max, energy rises instead of fading. Song ends at its loudest.' },
  { name: 'Dialogue / Spoken Coda', rule: 'After the final chorus, a brief spoken moment (2-4 lines) that steps outside the song — a thought, a question, a confession. Music drops completely or holds one note under it.' },
  { name: 'Harmonic Drift', rule: 'Outro lands on an unresolved chord or half-cadence and holds. Music fades slowly without resolving. The tension is intentional — the story is unresolved and the listener knows it.' },
  { name: 'Counter-Melody Ascent', rule: 'Outro strips the lead vocal and lets the counter-melody (instrument or backing voice) carry the song to its end — it was there all along, now it leads. Main vocal drops to harmonies only.' },
];

// ═══════════════════════════════════════════════════════════════════════════
// VERSE 2 ESCALATION ARCHETYPES — Verse 2 must do more than repeat Verse 1
// ═══════════════════════════════════════════════════════════════════════════

const VERSE2_ARCHETYPES = [
  { name: 'Consequence', rule: 'Verse 2 shows what happened AFTER Verse 1. Same character, later in time, changed circumstances. The hook now means something different because of what verse 2 revealed.' },
  { name: 'The Other Side', rule: 'Verse 2 gives the opposing perspective — different character, contradicting version of events, or the same person arguing against themselves. Creates productive tension.' },
  { name: 'Zoom Out', rule: 'Verse 1 was intimate and personal. Verse 2 zooms out — the personal story becomes universal. Connect the specific situation to something larger: culture, history, the human condition.' },
  { name: 'Deeper Specific', rule: 'Verse 2 goes more specific, not more general. New proper nouns, new sensory details, new micro-moments. The theme is the same but the evidence is richer and more precise.' },
  { name: 'Time Jump', rule: 'Verse 2 is set years earlier or later than Verse 1. The emotional context shifts completely. What the chorus meant before now has a completely different backstory.' },
  { name: 'Antagonist Voice', rule: 'Verse 2 is written from the POV of whoever or whatever is on the other side of the conflict. Not sympathetic — just truthful. The listener has to hold both truths.' },
];

// ═══════════════════════════════════════════════════════════════════════════
// PRE-CHORUS ARCHETYPES — The tension builder before the chorus drop
// Each archetype defines HOW to build anticipation differently
// ═══════════════════════════════════════════════════════════════════════════

const PRE_CHORUS_ARCHETYPES = [
  {
    name: 'Tension Ramp',
    energy: 'low → high (linear climb)',
    bars: '2–4',
    delivery: 'Start at verse energy. Each line slightly louder, slightly more urgent. The final line lands on the most unresolved note of the song — V7 or ♭VII held open. The listener leans forward.',
    lyric: 'Short lines, rising specificity. Each line narrows the focus until the last line is so precise and so loaded that the chorus is the only possible response. No resolution — the pre-chorus is a question.',
    production: 'Drums tighten (ride → hi-hat → open hi-hat). A synth swell or string swell begins at bar 2 and peaks at the last pre-chorus beat. Bass locks with the kick.',
    rule: 'PRE-CHORUS MUST end on maximum unresolved tension. The chorus is not a release — it is an inevitability. The listener should feel pulled forward, not surprised.',
  },
  {
    name: 'Question Drop',
    energy: 'building → hanging open',
    bars: '2–4',
    delivery: 'The entire pre-chorus builds toward a single question — spoken, sung, or left hanging. Delivery rises through the section. The final line rises in pitch (question inflection). Then silence. Then chorus answers.',
    lyric: 'Set up the central unresolved tension of the song as a question. The most specific version of the conflict. Not rhetorical — genuinely unanswered. The chorus IS the answer, whether lyrically explicit or emotional.',
    production: 'Everything pulls back on the final question. One held chord. The silence before the chorus is as loud as the chorus itself. Often: kick drops out on the final question bar.',
    rule: 'PRE-CHORUS MUST make the chorus feel like the answer to a real question. If the chorus does not resolve the pre-chorus question emotionally, rewrite one of them.',
  },
  {
    name: 'Lyric Elevator',
    energy: 'mid → peak (step-by-step)',
    bars: '4',
    delivery: 'Four lines, each more emotionally loaded than the last. Line 1 = observation. Line 2 = feeling. Line 3 = realization. Line 4 = the most exposed line — almost too honest to sing. Then the chorus.',
    lyric: 'Four-rung ladder of emotional escalation. Each line reveals one more layer. By line 4, the emotional core of the song is completely exposed — the chorus is the response to that exposure. Specificity increases every line.',
    production: 'Instrumentation adds one element per rung: guitar → bass → drums → strings. By line 4, the full band is in except the final element that drops on the chorus.',
    rule: 'PRE-CHORUS MUST feel like a controlled emotional unraveling. By the last line the listener knows the most important thing about the character — even if the character hasn\'t said it explicitly yet.',
  },
  {
    name: 'Harmonic Pivot',
    energy: 'tense — unexpected sidestep',
    bars: '2–4',
    delivery: 'Melodic line that moves to a chord or tonal center not heard anywhere else in the song. The harmonic surprise is the tension. Delivery can be restrained — the harmony does the emotional work.',
    lyric: 'The lyric at the moment of the harmonic pivot should match the unexpected turn — the most unusual image in the song, or the most honest admission. The harmony and lyric arrive together as a single surprising move.',
    production: 'The "pivot chord" — ♭VI, iv, or borrowed parallel-key chord — appears here and only here. It makes the V7→I resolution into the chorus feel like coming home from somewhere unexpected.',
    rule: 'PRE-CHORUS MUST contain at least one harmonic element not heard in the verse or chorus. This chord is the emotional fingerprint of the song — the moment the listener\'s ear shifts from expectation to discovery.',
  },
  {
    name: 'Velocity Surge',
    energy: 'same energy as verse → rhythmic acceleration',
    bars: '2–4',
    delivery: 'Lyric density doubles. More syllables per bar. Faster, tighter delivery — as if the thought is outrunning the singer\'s ability to contain it. Triplet feel or double-time approach. The rush IS the emotion.',
    lyric: 'Pack maximum information into minimum space. Short rhymes, internal rhymes, chain-rhyme. The pre-chorus says more per bar than anything else in the song. The urgency is in the compression of language, not the volume.',
    production: 'The rhythm section plays in the pockets — slightly ahead of the beat, pushing forward. Hi-hats open. Bass moves faster. The tempo hasn\'t changed but it FEELS like it has.',
    rule: 'PRE-CHORUS MUST create the sensation that the song is accelerating into the chorus. The listener\'s pulse should quicken from the rhythmic compression alone, before the chorus arrives.',
  },
  {
    name: 'Whisper to Roar',
    energy: 'near-silent → full force (extreme arc)',
    bars: '4',
    delivery: 'Start at the absolute quietest dynamic in the song — whispered, barely audible. Build through the pre-chorus to the biggest single moment before the chorus. The dynamic arc IS the pre-chorus. The contrast makes the chorus explode.',
    lyric: 'Begin with the most private thought in the song — something barely spoken. By the last pre-chorus line, that private thought has become a statement. Same emotional truth, different volume.',
    production: 'Bar 1: voice alone or with single instrument at low volume. Bar 2: add one element. Bar 3: add percussion. Bar 4: full band minus one element that drops on the chorus. The swell must be earned — no cheating by faking it.',
    rule: 'PRE-CHORUS MUST establish the quietest point in the entire song (bar 1) before the song explodes. The contrast multiplies the chorus impact. Do not skip the quiet — it is doing half the work.',
  },
  {
    name: 'Call-Setup',
    energy: 'groove-locked — anticipatory',
    bars: '2–4',
    delivery: 'The pre-chorus is a call waiting for a response. Vocals land on the downbeats, leaving space on the upbeats for an imagined answer. The phrasing is open-ended. The chorus is the response that fills the silence.',
    lyric: 'Write the pre-chorus as a declaration waiting for confirmation, or a plea waiting for permission. Short lines with deliberate spaces between them. The unsaid words in the gaps are as important as the spoken ones.',
    production: 'Rhythm guitar or synth plays the "response" part in the gaps — answers the vocal phrases instrumentally. This creates the call-and-response dynamic before the chorus gives the full vocal answer.',
    rule: 'PRE-CHORUS MUST feel like the first half of a conversation. The chorus completes the conversation. If the chorus could exist without the pre-chorus setup, the pre-chorus isn\'t specific enough.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// POST-CHORUS ARCHETYPES — What happens after the chorus hits
// The "power part" — where the hook lands and breathes
// ═══════════════════════════════════════════════════════════════════════════

const POST_CHORUS_ARCHETYPES = [
  {
    name: 'Breath and Reset',
    energy: 'drops sharply → groove settles',
    bars: '2–4',
    delivery: 'After the chorus explosion, pull almost everything back. Just kick, bass, and maybe a single guitar or synth. Give the listener a second to process what they just heard. Then the verse rebuilds from this stripped foundation.',
    lyric: 'No lyric — or a single ad-lib phrase (one word, one breath, one syllable). The space IS the post-chorus. The silence after a peak is as intentional as the peak itself.',
    production: 'Drop to percussion + bass only, or vocal ad-lib over minimal instrumentation. 2-4 bars. The contrast with the chorus makes the next verse feel deliberate and focused. Drum fill into the verse.',
    rule: 'POST-CHORUS MUST create a real dynamic drop — not a pretend one. The listener should feel the pressure release. This makes the second verse land with new context instead of feeling like repetition.',
  },
  {
    name: 'Hook Echo',
    energy: 'same as chorus but instrumental',
    bars: '2–4',
    delivery: 'The chorus lyric ends but its melody continues — played by an instrument (guitar lead, synth, sax, strings) without words. The melody hangs in the air. The listener is mentally singing the words that aren\'t there.',
    lyric: 'No lyric, or a single hummed or "la la la" repetition of the hook melody. The instrument carries the emotional memory of the chorus lyric without needing words. The listener completes it themselves.',
    production: 'Lead guitar, piano, synth, or melodica plays the exact hook melody at chorus volume, then fades or transitions into the next section. Often harmonized (3rd or 5th) for richness.',
    rule: 'POST-CHORUS MUST be the hook melody without words — proving the melody is powerful enough to carry meaning alone. If the listener doesn\'t hum along during this section, the hook needs more work.',
  },
  {
    name: 'Ad-Lib Showcase',
    energy: 'same groove — vocal peak',
    bars: '2–4',
    delivery: 'Vocalist improvises over the same chord loop as the chorus. Runs, riffs, scatting, emotional sighs, falsetto peaks. The production stays but the vocalist reveals everything they held back in the composed chorus. This is the moment of raw expression.',
    lyric: 'Ad-lib phrases: fragments, emotional exclamations, repeated single syllables. Write them in parentheses: (yeah), (oh lord), (come on). Suggest 2-3 specific ad-lib moments — these are as composed as the lyrics, even if they sound spontaneous.',
    production: 'Background vocals join for harmonies. The main chord loop of the chorus continues unchanged. Just add space and permission for the lead vocal to breathe and explore.',
    rule: 'POST-CHORUS MUST feel like the vocalist just exhaled everything they had been holding back. It is the most emotionally honest moment in the song because it appears unscripted — even when it is carefully composed.',
  },
  {
    name: 'Punchy Counter-Statement',
    energy: 'sharp — single knockout hit',
    bars: '1–2',
    delivery: 'One devastating line or phrase — the comment on everything the chorus just said. Often the most quotable line in the entire song. Delivered with maximum clarity and minimum production behind it. Then the track continues.',
    lyric: 'One line. The post-hook line that makes people rewind. It subverts, confirms, or deepens what the chorus just declared. The chorus makes the statement — the post-hook is the coda that makes it unforgettable. Often a contrast: if the chorus is big, the post-hook is quiet.',
    production: 'Everything drops out except one element for the 1-2 bar line. Then full band resumes. The emptiness makes the single line hit twice as hard. Like a spotlight on one phrase.',
    rule: 'POST-CHORUS MUST land the single most quotable phrase in the song. If the chorus is the argument, the post-hook is the closing line that wins it. If you can\'t identify this line, the section isn\'t specific enough.',
  },
  {
    name: 'Drop Groove',
    energy: 'no harmony — pure rhythm',
    bars: '2–4',
    delivery: 'All chord instruments drop out. Bass + drums only (or percussion only). The groove is exposed — just the rhythm, no harmony hiding it. Then the next section re-enters over this stripped rhythmic foundation.',
    lyric: 'No lyric — or a rhythmic chant (2-3 syllables, percussion-like). The groove is the content. The listener\'s body takes over from their brain. This is the most physical moment in the song.',
    production: 'Hard cut from full chorus to bass + drums only. No guitar, no synth, no keys. Just the pocket. After 2-4 bars, the instrumentation re-enters. Works in every genre: EDM drop, funk breakdown, trap bass drop, reggae riddim strip.',
    rule: 'POST-CHORUS MUST strip all harmony for at least 2 full bars. The rawness of the exposed rhythm makes everything that follows it feel more powerful. The groove is the hook.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HOOK STRUCTURE NOTES — Structural hook archetypes (separate from delivery)
// These define HOW the hook is shaped, not how it is delivered
// ═══════════════════════════════════════════════════════════════════════════

const HOOK_STRUCTURE_NOTES = {
  'auto': '',
  'Ladder Hook':     'HOOK STRUCTURE — Ladder: Hook builds line by line toward the payoff. Each line is one rung higher emotionally. The final line is the thesis — the most memorable phrase in the song. Setup → escalation → landing. The listener climbs with you. Tennessee Whiskey model: each verse/chorus line escalates the central simile.',
  'Mantra Hook':     'HOOK STRUCTURE — Mantra: The entire hook is ONE sentence, repeated 3-6 times with slight melodic variation each time. Power through repetition — not complexity. The meaning deepens with each repeat. The hook is also the title. "HUMBLE." / "Never broke again" / "Thank U, Next" — single devastating phrase.',
  'Question+Answer': 'HOOK STRUCTURE — Question + Answer: Hook divided into two equal halves. First half: a question or incomplete thought. Second half: the answer or completion. The listener is pulled through the gap between them. Creates internal tension and resolution inside the hook itself. The chorus contains a complete micro-argument.',
  'A/B Double':      'HOOK STRUCTURE — A/B Double: Two distinct melodic phrases back to back. Hook A (4 bars, establishes central image, usually sung) → Hook B (4 bars, escalates or reframes it, often different cadence/energy). Together more powerful than either alone. Creates two earworms in one. Travis Scott / OutKast model.',
  'Anti-Hook':       'HOOK STRUCTURE — Anti-Hook: Deliberately refuses the expected melodic or dynamic peak. Chorus lands quiet or mid-energy when the production promises an explosion. The absence IS the hook — the gap where the peak was supposed to be is more memorable than the peak would have been. Kendrick Lamar / Radiohead tradition. Creep drops quiet exactly when it should go loud.',
  'Chant Hook':      'HOOK STRUCTURE — Chant: 2-5 words, rhythmically locked to the beat, crowd-participatory from first listen. Not primarily melodic — rhythmic. The words are a percussion instrument. The hook is what every person in the crowd chants back before they know the lyrics. "Hey Ya!" / "Jump Around" / "Seven Nation Army" riff model.',
  'Narrative Hook':  'HOOK STRUCTURE — Narrative Micro-Story: The hook tells a complete mini-story in 8 bars — setup, complication, resolution. The verse provides context; the chorus delivers a complete emotional journey every time it repeats. Not a statement but an event. The listener re-experiences something each time the chorus returns.',
  'Confession Hook': 'HOOK STRUCTURE — Direct Address Confession: Hook speaks directly to one specific person or breaks the fourth wall to speak to the listener. "You" or implied direct address. Breaks theatrical distance. The listener feels personally implicated — called out or called to. The most intimate hook structure: one person to one person, even in a stadium.',
};

// ═══════════════════════════════════════════════════════════════════════════
// RHYME SCHEMES — injected randomly per generation
// ═══════════════════════════════════════════════════════════════════════════

const RHYME_SCHEMES = {
  'AABB': 'Couplet rhyme (AABB): lines 1+2 rhyme, lines 3+4 rhyme. Creates momentum and satisfaction — folk, country, and pop default. Feels conversational and propulsive.',
  'ABAB': 'Alternating rhyme (ABAB): lines 1+3 rhyme, lines 2+4 rhyme. Creates tension and pull — listener is always waiting for the resolution. Classic ballad and anthem structure.',
  'ABCB': 'Ballad form (ABCB): only lines 2 and 4 rhyme. Feels natural, almost spoken — like someone telling you something true. Less forced than full rhyme, harder to write well.',
  'AABA': 'Anchor rhyme (AABA): three lines rhyme, one breaks free. The free line (line 3) is always the most emotionally revealing line — it carries the weight because it stands apart.',
  'Internal': 'Internal rhyme density: words within the same line rhyme with each other, not just end-words. Creates rapid momentum and flow density — hip-hop and slam poetry technique. Use at least 2 internal rhymes per 4-line unit.',
  'Slant':   'Slant rhyme scheme: near-rhymes, assonance, and consonance instead of perfect rhymes. Creates organic, non-sing-songy feel — indie, alt-country, literary SS. Examples: "moon/room", "fire/liar", "time/mine".',
  'Chain':   'Chain rhyme: the final word of each line rhymes with a word in the MIDDLE of the next line, creating a cascading effect. Pulls the listener forward relentlessly. Advanced technique — Eminem and Hamilton model.',
};

const GENRE_RHYME_PREF = {
  pop:       ['AABB', 'ABAB', 'ABCB'],
  hiphop:    ['Internal', 'Chain', 'AABB'],
  rnb:       ['ABCB', 'ABAB', 'Slant'],
  neosoul:   ['Slant', 'ABCB', 'Internal'],
  country:   ['AABB', 'ABCB', 'ABAB'],
  ss:        ['Slant', 'ABCB', 'AABA'],
  jazz:      ['AABA', 'Slant', 'ABCB'],
  gospel:    ['AABB', 'ABAB', 'Internal'],
  altrock:   ['Slant', 'ABCB', 'ABAB'],
  blues:     ['AABB', 'ABCB', 'Slant'],
  edm:       ['AABB', 'ABAB', 'Internal'],
  kpop:      ['ABAB', 'AABB', 'Internal'],
  punk:      ['AABB', 'Internal', 'ABAB'],
  reggae:    ['AABB', 'ABCB', 'Slant'],
  latin:     ['ABAB', 'AABB', 'ABCB'],
  reggaeton: ['AABB', 'Internal', 'Chain'],
  afrobeats: ['AABB', 'ABCB', 'Internal'],
};

// ═══════════════════════════════════════════════════════════════════════════
// ERA VOCABULARY — era-specific anchor words/phrases injected per generation
// ═══════════════════════════════════════════════════════════════════════════

const ERA_VOCABULARY = {
  classic: {
    label: 'Classic (pre-1980)',
    anchors: ['switchboard','eight-track','dime store','Western Union','operator','party line','drive-in','nickel jukebox','AM radio','vinyl single','five and dime','telegram'],
    forbidden: ['scroll','swipe','stream','DM','download','playlist','algorithm','viral'],
  },
  vintage: {
    label: 'Vintage (1980–1999)',
    anchors: ['answering machine','mixtape','pay phone','cassette','pager','beeper','VCR','boom box','fax machine','dial-up','MTV','cellular'],
    forbidden: ['stream','DM','TikTok','Instagram','algorithm','playlist','Spotify'],
  },
  modern: {
    label: 'Modern (2000–2015)',
    anchors: ['ringtone','MySpace','text me','download','iPod','YouTube','BlackBerry','going viral','Facebook','tweet','selfie','Wi-Fi'],
    forbidden: ['TikTok','Reels','algorithm','For You Page','story post','NFT'],
  },
  contemporary: {
    label: 'Contemporary (2016–2022)',
    anchors: ['stories','scroll','playlist','stream','Spotify','DM slide','gram','dropped','viral','fire emoji','ghost','left on read'],
    forbidden: ['eight-track','cassette','pager','telegram','party line'],
  },
  current: {
    label: 'Current (2023–Now)',
    anchors: ['algorithm','For You Page','AI-generated','hyperpop','ambient','lo-fi','parasocial','main character','rent-free','brain rot','delulu','understood the assignment'],
    forbidden: ['eight-track','cassette','pager','telegram','MySpace','BlackBerry'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// EMOTIONAL ARCS — user-selectable journey templates
// ═══════════════════════════════════════════════════════════════════════════

const EMOTIONAL_ARCS = {
  'none': null,
  'devastation-acceptance': {
    name: 'Devastation → Acceptance',
    arc: 'Verse 1: raw devastation — the wound is fresh. Chorus 1: denial or bargaining. Verse 2: deeper reckoning — understanding the why. Bridge: turning point — not fixed but not broken. Final Chorus: acceptance — same words, different meaning. The listener should feel relief, not joy.',
    genre_fit: ['ss','rnb','country','neosoul','altrock','blues'],
  },
  'joy-nostalgia-gratitude': {
    name: 'Joy → Nostalgia → Gratitude',
    arc: 'Verse 1: a joyful memory in present tense — re-living it. Chorus: the pure feeling before context. Verse 2: realizing that time has passed, the moment is gone. Bridge: the bittersweet recognition that it was perfect. Final Chorus: gratitude for having had it — joy becomes thanksgiving.',
    genre_fit: ['pop','country','ss','rnb','gospel'],
  },
  'anger-clarity-resolve': {
    name: 'Anger → Clarity → Resolve',
    arc: 'Verse 1: the grievance — specific, present tense, raw. Chorus: the explosion of anger. Verse 2: pulling back — understanding who you actually are and what you want. Bridge: the moment anger transforms into vision. Final Chorus: same words, now a war cry instead of a wound cry.',
    genre_fit: ['hiphop','punk','altrock','blues','rock'],
  },
  'longing-action-arrival': {
    name: 'Longing → Action → Arrival',
    arc: 'Verse 1: longing — specific about what is missing or wanted. Pre-chorus: the decision forming. Chorus: the declaration of intent — not arrival yet, but commitment. Verse 2: the journey — obstacles, doubts. Bridge: the darkest moment before arrival. Final Chorus: arrival — same words, earned.',
    genre_fit: ['pop','country','gospel','kpop','edm'],
  },
  'innocence-loss-wisdom': {
    name: 'Innocence → Loss → Wisdom',
    arc: 'Verse 1: innocence — the world as it was believed to be. Chorus: the collision with reality. Verse 2: aftermath — what is lost. Bridge: the question of what to do with the loss. Final Chorus/Outro: wisdom — not restored innocence but something better. The song is a coming-of-age in 3 minutes.',
    genre_fit: ['ss','altrock','country','rnb','neosoul'],
  },
  'isolation-connection-belonging': {
    name: 'Isolation → Connection → Belonging',
    arc: 'Verse 1: alone — specific about the isolation, not generic. Chorus: the reaching out or discovery of another. Verse 2: the risk of connection — vulnerability. Bridge: the moment the walls come down. Final Chorus: belonging — the chorus lands the same but the isolation has been replaced.',
    genre_fit: ['pop','kpop','edm','gospel','rnb'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// GENRE SYLLABLE BUDGETS — default syllable constraints per section
// ═══════════════════════════════════════════════════════════════════════════

// hook = the single most repeated phrase (title line / refrain). Tighter than chorus.
const GENRE_SYLLABLE_BUDGETS = {
  pop:       { verse: '8–12', chorus: '6–10', hook: '4–7',  bridge: '6–10', prechorus: '6–9' },
  hiphop:    { verse: '12–20', chorus: '8–12', hook: '5–9', bridge: '10–16', prechorus: '8–12' },
  rnb:       { verse: '8–13', chorus: '6–10', hook: '4–7',  bridge: '6–10', prechorus: '6–9' },
  neosoul:   { verse: '8–14', chorus: '6–10', hook: '4–8',  bridge: '6–12', prechorus: '6–9' },
  country:   { verse: '8–12', chorus: '6–10', hook: '4–7',  bridge: '6–10', prechorus: '6–8' },
  ss:        { verse: '7–14', chorus: '5–10', hook: '3–7',  bridge: '5–10', prechorus: '5–9' },
  jazz:      { verse: '6–12', chorus: '5–9',  hook: '3–6',  bridge: '5–9',  prechorus: '5–8' },
  gospel:    { verse: '8–13', chorus: '6–10', hook: '4–8',  bridge: '6–12', prechorus: '6–9' },
  altrock:   { verse: '8–13', chorus: '5–9',  hook: '3–6',  bridge: '5–9',  prechorus: '5–8' },
  blues:     { verse: '8–14', chorus: '6–10', hook: '4–7',  bridge: '6–12', prechorus: '6–9' },
  edm:       { verse: '6–10', chorus: '4–8',  hook: '2–5',  bridge: '4–8',  prechorus: '4–7' },
  kpop:      { verse: '8–12', chorus: '6–10', hook: '4–7',  bridge: '6–10', prechorus: '6–9' },
  punk:      { verse: '8–14', chorus: '4–8',  hook: '2–5',  bridge: '4–8',  prechorus: '4–7' },
  reggae:    { verse: '8–12', chorus: '6–10', hook: '4–7',  bridge: '6–10', prechorus: '5–8' },
  latin:     { verse: '8–13', chorus: '6–10', hook: '4–7',  bridge: '6–10', prechorus: '6–9' },
  reggaeton: { verse: '8–14', chorus: '6–10', hook: '4–7',  bridge: '6–10', prechorus: '6–9' },
  afrobeats: { verse: '6–12', chorus: '4–8',  hook: '2–5',  bridge: '4–8',  prechorus: '4–7' },
  rock:      { verse: '8–13', chorus: '5–10', hook: '3–7',  bridge: '5–9',  prechorus: '5–8' },
  folk:      { verse: '7–13', chorus: '5–9',  hook: '3–6',  bridge: '5–9',  prechorus: '5–8' },
  metal:     { verse: '8–16', chorus: '4–9',  hook: '3–6',  bridge: '4–8',  prechorus: '4–8' },
  reggae:    { verse: '8–12', chorus: '6–10', hook: '4–7',  bridge: '6–10', prechorus: '5–8' },
  parody:    { verse: '8–14', chorus: '6–10', hook: '4–8',  bridge: '6–10', prechorus: '6–9' },
  comedy:    { verse: '6–14', chorus: '4–10', hook: '3–8',  bridge: '4–10', prechorus: '4–9' },
  children:  { verse: '4–8',  chorus: '3–6',  hook: '2–5',  bridge: '3–6',  prechorus: '3–5' },
  tvmusical: { verse: '8–14', chorus: '6–11', hook: '4–8',  bridge: '6–12', prechorus: '6–9' },
};

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION KNOWLEDGE BASE
// Per-genre FX profiles, plugin chains, mastering targets, and production
// archetypes used to generate the PRODUCTION BRIEF output section.
// ═══════════════════════════════════════════════════════════════════════════

const GENRE_FX_PROFILES = {
  pop:       { reverb: 'Medium hall (1.5–2.2s) on vocals, short room (0.4s) on snare', delay: '1/8 note ping-pong on vocal tails, 1/4 dotted on guitar', compression: 'VCA bus glue (2–4 dB GR), optical on lead vocal', eq: 'Air shelf +2 dB @ 16 kHz, low-cut @ 80 Hz on all but kick+bass', width: 'Stereo widener on synth pads, mono centre for kick/bass/lead vocal', sidechain: 'Kick ducking bass 4–6 dB, subtle pump on pads' },
  hiphop:    { reverb: 'Dark plate (0.8–1.2s) on snare, short room on 808 tail, large verb on adlibs', delay: 'Triplet 1/8 slap on vocal doubles, subtle 1/4 on main vocal', compression: 'Hard limiting on 808 (Waves SSL), parallel NY compression on drums', eq: 'Heavy sub boost 50–80 Hz on 808, scooped mids on snare, air on vocal', width: 'Wide sample layer, mono 808 and kick', sidechain: 'Aggressive kick→808 sidechain for pump' },
  rnb:       { reverb: 'Lush chamber (2–3s) on vocals, spring on keys', delay: '1/4 dotted on vocal harmonies, analog tape slap on lead', compression: 'Vintage LA-2A on lead vocal, bus glue on mix', eq: 'Low-mid warmth 200–400 Hz on voice, rolled-off highs for analog warmth', width: 'Stereo choir spread, mono bass and kick', sidechain: 'Light kick→bass pump (2–3 dB)' },
  rock:      { reverb: 'Large ambience (2–4s) on snare, room mic blend on kit', delay: '1/4 ping-pong on guitar lead, slapback on vocals', compression: 'FET 1176 on snare/overheads, bus chain (SSL → limiting)', eq: 'HPF @ 100 Hz on guitars, presence boost 3–5 kHz on leads, air on overheads', width: 'Hard pan guitars L/R, mono kick/snare/bass', sidechain: 'Minimal — let the room breathe' },
  country:   { reverb: 'Bright hall on vocals (1.8s), spring reverb on guitar/pedal steel', delay: 'Tape echo (1/4 + 3/8) on guitar fills, slap on lead vocal', compression: 'Optical on vocal, VCA on bus', eq: 'Warmth at 200 Hz on acoustic, sparkle at 8 kHz, cut mud at 300 Hz', width: 'Banjo/fiddle wide, steel guitar center-right', sidechain: 'Very light kick ducking' },
  edm:       { reverb: 'Gated hall on snare, long pad verb (3–6s) on synths', delay: '1/8 ping-pong on arps, 1/4 dotted on leads, reverse reverb pre-hit', compression: 'Sidechain pumping (4/4 kick→pads 8–12 dB), peak limiting on master', eq: 'Deep bass scoop at 200–400 Hz, aggressive high-pass on pads, air at 14 kHz', width: 'Max stereo on synths/pads, mono kick/bass', sidechain: 'Heavy 4/4 sidechain pump is the signature effect' },
  altrock:   { reverb: 'Grungy plate on snare, room ambience on kit', delay: 'Feedback-rich 1/4 delay on guitar, modulated delay on solos', compression: 'Hard FET on drums, fuzz/saturation on guitar bus', eq: 'Mid-forward 800 Hz–2 kHz crunch, rolled highs for grit', width: 'Guitars wide, fuzz guitar center', sidechain: 'Occasional pump for effect only' },
  metal:     { reverb: 'Short room on snare (0.3s) for tightness, gated plate', delay: 'Very short slap (40ms) on rhythm guitars, lead 1/8 dotted', compression: 'Fast attack FET on kick/snare, parallel for punch, hard bus limiting', eq: 'Deep mid scoop on rhythm guitar (500 Hz), boost 3–4 kHz for presence, heavy HPF', width: 'Rhythm guitars hard-panned L/R (double-tracked)', sidechain: 'Kick→bass moderate pump' },
  punk:      { reverb: 'Minimal — tight room only (0.2s)', delay: 'Slapback only on lead vocal', compression: 'Fast, raw 1176 — let it clip slightly for attitude', eq: 'Bright, mid-forward, almost no sub — cut below 80 Hz on everything', width: 'Slightly narrow — live room feel', sidechain: 'None — let it be raw' },
  folk:      { reverb: 'Small room (0.6–1s) or live hall (2s) on acoustic/vocal', delay: 'Tape echo on guitar fingerpicking, room echo on vocals', compression: 'Gentle optical on vocal (2–3 dB), minimal bus compression', eq: 'Natural — boost 200 Hz warmth, cut 400 Hz mud, slight air at 10 kHz', width: 'Centered vocal, slight width on strumming', sidechain: 'None' },
  jazz:      { reverb: 'Plate (1.5–2.5s) on brass/sax, room on piano', delay: 'Analog tape delay on trumpet/vocal', compression: 'Gentle RMS limiter — preserve dynamics', eq: 'Warm and full 200–400 Hz, bright at 8–10 kHz on piano', width: 'Traditional stereo mix — wide ensemble', sidechain: 'None' },
  blues:     { reverb: 'Spring reverb on guitar amp, room on vocal', delay: 'Tape slap on guitar and vocal', compression: 'Tube-style optical on vocal, light bus glue', eq: 'Gritty low-mid push 300–500 Hz on guitar, warmth on vocal', width: 'Mono-ish guitar, slight spread on rhythm section', sidechain: 'None' },
  latin:     { reverb: 'Bright hall (2s) on percussion, plate on vocal', delay: '1/8 dotted on guitar fills', compression: 'Optical on vocal, bus glue — keep it punchy', eq: 'Bright attack on percussion 6–8 kHz, warmth on guitar body', width: 'Percussion wide, bass and clave center', sidechain: 'Light kick→bass' },
  reggaeton: { reverb: 'Dark chamber (1s) on dembow, plate on vocal', delay: '1/4 on vocal doubles, triplet on hooks', compression: 'Hard bus compression for loudness, sidechain pump', eq: 'Heavy sub 50–80 Hz on 808/bass, air on vocal', width: 'Wide synths, mono bass and kick', sidechain: 'Moderate dembow→synth pump' },
  reggae:    { reverb: 'Large spring reverb on guitar (3s), plate on snare', delay: '1/4 dotted echoes everywhere — this is core to the sound', compression: 'Gentle optical on vocal, low bus compression for dynamics', eq: 'Bass-forward 80–120 Hz, scooped mids on guitar, warm on vocal', width: 'Rhythm guitar wide, roots bass center', sidechain: 'Light kick→bass' },
  afrobeats: { reverb: 'Short verb on snare, airy plate on vocal', delay: '1/8 ping-pong on synth/guitar, 1/4 dotted on vocal', compression: 'Heavy bus limiting for loudness and density', eq: 'Sub boost 50–80 Hz, mid-cut 400 Hz, air at 12 kHz on vocal', width: 'Max stereo on bells/guitar, mono kick/bass', sidechain: 'Kick→synth moderate pump' },
  kpop:      { reverb: 'Polished chamber (1.5s) on vocal, bright hall on synth', delay: '1/8 ping-pong on synth stabs, reverb tail delay on vocal', compression: 'Tight VCA on drums, optical on vocal, master limiting for loudness', eq: 'Air shelf at 14 kHz, cut 200–300 Hz mud, presence 4–5 kHz on vocal', width: 'Very wide synths and pads, mono kick/bass', sidechain: 'Kick→synth moderate pump' },
  neosoul:   { reverb: 'Warm plate on vocal (2s), room on live drums', delay: 'Analog echo on guitar/keys, subtle on vocal', compression: 'LA-2A optical on vocal, parallel compression on drums', eq: 'Warm 200–400 Hz on keys and vocal, air at 10 kHz', width: 'Live band stereo spread', sidechain: 'Very light' },
  gospel:    { reverb: 'Large hall (3–5s) on choir and lead vocal', delay: 'Long feedback echo on vocal runs', compression: 'Gentle optical on lead, dynamic choir mix', eq: 'Full and rich 100–400 Hz, presence on lead vocal 3–5 kHz', width: 'Wide choir, center lead vocal', sidechain: 'None' },
  ss:        { reverb: 'Small room or hall depending on feel (0.8–2.5s)', delay: 'Tape slap on vocal and guitar', compression: 'Gentle 2–3 dB on vocal, minimal bus', eq: 'Natural — subtle warmth and air only', width: 'Slightly narrow for intimacy', sidechain: 'None' },
};

const GENRE_PLUGIN_CHAINS = {
  pop:       { free: ['TDR Nova (EQ)', 'Valhalla Supermassive (reverb)', 'TAL-Reverb-4', 'OTT (multiband comp)'], paid: ['FabFilter Pro-Q 3', 'Waves SSL E-Channel', 'UAD 1176 LN', 'Soundtoys EchoBoy', 'Valhalla Room'] },
  hiphop:    { free: ['Izotope Ozone Imager (width)', 'Valhalla Supermassive', 'OTT', 'Camel Crusher'], paid: ['Waves SSL G-Bus', 'FabFilter Pro-L 2', 'Slate VCC', 'Soundtoys Devil-Loc', 'UAD Neve 1073'] },
  rnb:       { free: ['Analog Obsession LALA (optical)', 'Valhalla Supermassive', 'TAL-Chorus-LX'], paid: ['UAD LA-2A', 'FabFilter Pro-Q 3', 'Waves J37 Tape', 'Soundtoys Radiator', 'iZotope Nectar'] },
  rock:      { free: ['GVST GClip (saturation)', 'Valhalla Supermassive', 'TDR Nova'], paid: ['UAD 1176 AE', 'Waves SSL G-Bus', 'FabFilter Saturn 2', 'Soundtoys Decapitator', 'Empirical Labs Distressor'] },
  country:   { free: ['Valhalla Supermassive', 'TAL-Reverb-4', 'CHOW Tape'], paid: ['UAD Ocean Way Studios', 'Waves H-Delay', 'Soundtoys EchoBoy', 'FabFilter Pro-Q 3'] },
  edm:       { free: ['Valhalla Supermassive', 'OTT', 'LFO Tool (sidechain)'], paid: ['FabFilter Pro-Q 3', 'Xfer LFO Tool', 'Waves SSL G-Bus', 'FabFilter Pro-L 2', 'iZotope Insight 2'] },
  altrock:   { free: ['GVST GClip', 'Valhalla Supermassive', 'TDR Nova'], paid: ['UAD Marshall Plexi', 'FabFilter Saturn 2', 'Soundtoys Decapitator', 'Waves SSL 4000'] },
  metal:     { free: ['GVST GClip', 'TDR Nova', 'Limiter No6'], paid: ['FabFilter Pro-Q 3', 'Waves SSL G-Bus', 'UAD Neve 1073', 'FabFilter Pro-L 2', 'Soundtoys Decapitator'] },
  punk:      { free: ['GVST GClip', 'TDR Nova', 'Valhalla Supermassive (minimal use)'], paid: ['Waves SSL Channel', 'UAD 1176 LN', 'FabFilter Pro-L 2'] },
  folk:      { free: ['Valhalla Supermassive', 'CHOW Tape', 'TDR Nova'], paid: ['UAD Studer A800', 'Soundtoys EchoBoy', 'Waves Renaissance Compressor'] },
  jazz:      { free: ['Valhalla Supermassive', 'CHOW Tape', 'TDR Nova'], paid: ['UAD Fairchild 670', 'Waves Kramer Master Tape', 'Soundtoys EchoBoy'] },
  blues:     { free: ['CHOW Tape', 'GVST GClip', 'Valhalla Supermassive'], paid: ['UAD Ampex ATR-102', 'Waves J37 Tape', 'Soundtoys Radiator'] },
  latin:     { free: ['Valhalla Supermassive', 'TDR Nova', 'OTT'], paid: ['UAD Neve 1073', 'Waves CLA-76', 'Soundtoys EchoBoy', 'FabFilter Pro-Q 3'] },
  reggaeton: { free: ['OTT', 'Valhalla Supermassive', 'LFO Tool'], paid: ['FabFilter Pro-L 2', 'Waves SSL G-Bus', 'Xfer LFO Tool'] },
  reggae:    { free: ['Valhalla Supermassive (heavy)', 'CHOW Tape', 'TDR Nova'], paid: ['UAD Roland RE-201 Space Echo', 'Soundtoys EchoBoy', 'Waves H-Delay'] },
  afrobeats: { free: ['OTT', 'Valhalla Supermassive', 'TDR Nova'], paid: ['FabFilter Pro-L 2', 'Waves SSL G-Bus', 'iZotope Ozone 10'] },
  kpop:      { free: ['OTT', 'Valhalla Supermassive', 'TDR Nova'], paid: ['FabFilter Pro-Q 3', 'Waves SSL G-Bus', 'FabFilter Pro-L 2', 'iZotope Nectar 3'] },
  neosoul:   { free: ['Valhalla Supermassive', 'CHOW Tape', 'TDR Nova'], paid: ['UAD LA-2A', 'Waves J37 Tape', 'Soundtoys EchoBoy', 'FabFilter Pro-Q 3'] },
  gospel:    { free: ['Valhalla Supermassive', 'TAL-Reverb-4', 'TDR Nova'], paid: ['UAD Ocean Way Studios', 'Waves SSL G-Bus', 'FabFilter Pro-Q 3'] },
  ss:        { free: ['Valhalla Supermassive', 'CHOW Tape', 'TDR Nova'], paid: ['UAD Studer A800', 'Waves Renaissance Compressor', 'Soundtoys EchoBoy'] },
};

const MASTERING_TARGETS = {
  pop:       { lufs: '-14 LUFS (streaming)', dynamicRange: 'DR 7–9', brightness: 'Bright (8–14 kHz shelf +1.5 dB)', stereoWidth: 'Wide (>0.85)', notes: 'Max loudness within streaming normalization. Punchy, clean, competitive.' },
  hiphop:    { lufs: '-9 to -12 LUFS', dynamicRange: 'DR 5–7', brightness: 'Warm-bright (air at 12 kHz)', stereoWidth: 'Moderate-wide', notes: '808 sub must translate on laptop speakers — check mono. Heavy limiting expected.' },
  rnb:       { lufs: '-12 to -14 LUFS', dynamicRange: 'DR 8–10', brightness: 'Warm (subtle air only)', stereoWidth: 'Moderate', notes: 'Preserve vocal dynamics. Warmth and intimacy over loudness.' },
  rock:      { lufs: '-11 to -13 LUFS', dynamicRange: 'DR 8–11', brightness: 'Bright with mid presence', stereoWidth: 'Wide guitars', notes: 'Energy and punch. Allow more dynamics than pop.' },
  country:   { lufs: '-13 to -14 LUFS', dynamicRange: 'DR 9–11', brightness: 'Bright and clear', stereoWidth: 'Natural', notes: 'Preserve acoustic guitar transients. Warm but clear.' },
  edm:       { lufs: '-7 to -9 LUFS (club)', dynamicRange: 'DR 4–6', brightness: 'Air heavy (14 kHz +2 dB)', stereoWidth: 'Maximum', notes: 'Loudest genre. Club systems expect extreme loudness. Check mono compatibility.' },
  altrock:   { lufs: '-11 to -13 LUFS', dynamicRange: 'DR 8–10', brightness: 'Mid-forward', stereoWidth: 'Wide', notes: 'Grit and energy. Allow some clipping for character.' },
  metal:     { lufs: '-9 to -11 LUFS', dynamicRange: 'DR 6–8', brightness: 'Bright high-mid (4–6 kHz)', stereoWidth: 'Wide (guitars)', notes: 'Tight and crushing. Kick and guitar must cut without muddiness.' },
  punk:      { lufs: '-12 to -14 LUFS', dynamicRange: 'DR 7–9', brightness: 'Mid-bright', stereoWidth: 'Narrow-moderate', notes: 'Raw energy over polish. Slight edge/distortion acceptable.' },
  folk:      { lufs: '-14 to -16 LUFS', dynamicRange: 'DR 11–14', brightness: 'Natural', stereoWidth: 'Moderate', notes: 'Most dynamic genre. Preserve performance nuance. No heavy limiting.' },
  jazz:      { lufs: '-16 to -18 LUFS', dynamicRange: 'DR 12–16', brightness: 'Warm-natural', stereoWidth: 'Wide ensemble', notes: 'Preserve full dynamic range. No brickwall limiting.' },
  blues:     { lufs: '-14 to -16 LUFS', dynamicRange: 'DR 10–13', brightness: 'Warm', stereoWidth: 'Moderate', notes: 'Analog warmth. Tape saturation before limiting.' },
  latin:     { lufs: '-13 to -14 LUFS', dynamicRange: 'DR 8–10', brightness: 'Bright and punchy', stereoWidth: 'Wide percussion', notes: 'Percussive transients must punch through. Bright and energetic.' },
  reggaeton: { lufs: '-9 to -11 LUFS', dynamicRange: 'DR 5–7', brightness: 'Bright (vocal clarity)', stereoWidth: 'Wide', notes: 'Loud and punchy. Dembow kick+snare must drive through everything.' },
  reggae:    { lufs: '-13 to -15 LUFS', dynamicRange: 'DR 9–12', brightness: 'Warm-dark', stereoWidth: 'Moderate', notes: 'Preserve bass weight. Echo tails need headroom.' },
  afrobeats: { lufs: '-10 to -12 LUFS', dynamicRange: 'DR 6–8', brightness: 'Bright and airy', stereoWidth: 'Wide', notes: 'Competitive loudness. Percussion and vocal must pop.' },
  kpop:      { lufs: '-8 to -10 LUFS', dynamicRange: 'DR 5–7', brightness: 'Very bright (K-pop signature)', stereoWidth: 'Maximum', notes: 'Extremely loud and polished. Every element must sparkle.' },
  neosoul:   { lufs: '-13 to -15 LUFS', dynamicRange: 'DR 9–12', brightness: 'Warm with air', stereoWidth: 'Moderate', notes: 'Groove and warmth. Preserve dynamics and musical feel.' },
  gospel:    { lufs: '-12 to -14 LUFS', dynamicRange: 'DR 9–12', brightness: 'Full and rich', stereoWidth: 'Wide choir', notes: 'Room to breathe. Choir dynamics and lead vocal must coexist.' },
  ss:        { lufs: '-14 to -16 LUFS', dynamicRange: 'DR 11–14', brightness: 'Natural', stereoWidth: 'Intimate', notes: 'Preserve performance vulnerability. No over-compression.' },
};

// ═══════════════════════════════════════════════════════════════════════════
// AD-LIB BIBLE + VOCAL STACK PROFILES
// Ad-lib guide for all 24 genres: signature sounds, placement, density, Suno
// parentheses syntax. Vocal stack profiles: how many layers per section.
// Injected into song prompts via buildAdlibNote() and buildVocalStackNote().
// ═══════════════════════════════════════════════════════════════════════════

const ADLIB_BIBLE = {
  pop: {
    sounds: ['na-na-na', 'woah', 'hey', 'ooh', 'yeah'],
    placement: 'post-chorus (mandatory), outro singalong, pre-chorus lift (hey!)',
    density: 'medium',
    example: '(na-na-na) (woah-woah) after the main hook; (yeah) on peaks',
    outro: 'na-na-na singalong vamp',
  },
  hiphop: {
    sounds: ['yeah', 'uh', 'ayy', "let's go", 'woo'],
    placement: 'every 2nd bar inline, bar-end punctuation, outro crowd chant',
    density: 'high',
    example: '"I run this (yeah) city (uh)" — inline on every 2nd bar',
    outro: '(yeah, yeah, yeah!) crowd chant builds and repeats',
  },
  rnb: {
    sounds: ['ooh', 'ah', 'yeah', 'baby', 'mmm'],
    placement: 'post-chorus runs, bridge build, end of phrases, outro vamp',
    density: 'high',
    example: '"You know I love you (ooh) forever (mmm)"; bridge: (ooh-ah-yeah!) vocal run',
    outro: 'melismatic vocal run vamp — (ooh-ooh-ah-yeah!) escalating',
  },
  rock: {
    sounds: ['woah', 'hey', 'yeah', 'woo', 'come on'],
    placement: 'pre-chorus lift, post-chorus crowd release, outro collective',
    density: 'medium',
    example: '"Don\'t you cry (hey!) There\'s a heaven (yeah!)"',
    outro: '(yeah! yeah! yeah!) collective shout, fades',
  },
  country: {
    sounds: ['yeah', 'mmm', 'woah', 'hey', 'la-la-la'],
    placement: 'verse story turns, final chorus group singalong, outro',
    density: 'low-medium',
    example: '"She walked out (yeah) door slammin\' (mm-mm)"',
    outro: '(la-la-la) (woah-oh) group barn-dance singalong',
  },
  edm: {
    sounds: ['oh-oh-oh', 'hey', 'yeah', 'woo'],
    placement: 'pre-drop cue, drop entrance, post-drop groove, outro loop',
    density: 'medium — processed/pitched',
    example: '"[Build] (oh!) (yeah!) [Drop] (oh-oh-oh!) looped"',
    outro: 'looped (oh-oh-oh) processed texture fades',
  },
  latin: {
    sounds: ['ay', 'aye', 'oye', 'eh', 'olé', 'dale'],
    placement: 'salsa montuno vamp, cumbia chorus response, outro coro fade',
    density: 'high — bilingual call-and-response',
    example: '"Te quiero (ay!) con toda mi alma (aye!)"',
    outro: '(ay ay ay!) (dale, dale!) over montuno piano, 8–16 bars',
  },
  reggaeton: {
    sounds: ['aye', 'eh', 'yo', 'dale', 'mira'],
    placement: 'dembow accent beat, perreo section, outro vamp',
    density: 'medium — rhythm-aligned',
    example: '"Muévelo (aye) dale (eh)" — on dembow syncopation',
    outro: '(dale, dale, dale!) over dembow groove, fades',
  },
  folk: {
    sounds: ['mmm', 'oh', 'la-la-la'],
    placement: 'bridge hum before final chorus, quiet outro only',
    density: 'minimal — one moment max per song',
    example: '"[Bridge] (mmm, oh...) [Final Chorus] (la-la-la)"',
    outro: 'hummed melody (mmm) fades to silence',
  },
  metal: {
    sounds: ['yeah', 'go', 'ahhh', 'hey'],
    placement: 'breakdown entrance, chorus aggression peak, outro collective',
    density: 'low — impact over frequency',
    example: '"Master of puppets! (YEAH! YEAH!)" — at riff peaks',
    outro: '(yeah! yeah! yeah!) or feedback noise — abrupt end',
  },
  jazz: {
    sounds: ['doo-wah', 'bop', 'skee-dat', 'ba-da', 'shoo-bee'],
    placement: 'solo section scat, outro improvisation, responsorial moments',
    density: 'high — during solos only',
    example: '"[Solo] (bop-ba-doo-wah, skee-dat-da-ba!)"',
    outro: 'scat improvisation fades: (doo-wah... skee-dat... ba-da-bop...)',
  },
  ss: {
    sounds: ['mmm', 'oh', 'la-la'],
    placement: 'bridge confessional only, whispered outro',
    density: 'minimal — 1–2 moments per song',
    example: '"[Bridge] (whispered: I\'m sorry...) (oh...)"',
    outro: 'whispered (mmm) or sighed (oh) fades to silence',
  },
  altrock: {
    sounds: ['woah', 'oh-oh', 'yeah', 'woo'],
    placement: 'pre-chorus earned tension, post-chorus self-aware release',
    density: 'low-medium — must feel earned not manufactured',
    example: '"Can you feel it? (woah...) [Post-chorus] (oh-oh-oh, yeah!)"',
    outro: '(woah-woah-woah...) fading with feedback',
  },
  reggae: {
    sounds: ['yeah', 'jah', 'one love', 'irie', 'bless'],
    placement: 'call-and-response chorus, outro vamp (MANDATORY 8–16 bars)',
    density: 'medium — spiritual affirmations',
    example: '"Living in Babylon (yeah!) But I\'m rising (jah!)"',
    outro: '(one love!) (yeah, jah!) 8–16 bar vamp — NEVER skip the outro vamp',
  },
  afrobeats: {
    sounds: ['eh', 'aye', 'ehn', 'oh-oh', 'ye'],
    placement: 'hook repeat, between call-and-response lines, outro fade',
    density: 'medium — rhythmic accent not emotional',
    example: '"Body move (eh!) soul on fire (aye!)" — on percussion accents',
    outro: '(aye, aye, aye!) (eh, eh!) accenting percussion grid, fades',
  },
  blues: {
    sounds: ['oh', 'lord', 'mmm', 'well'],
    placement: 'between AAB lines as guitar-answering voice, turnaround marker',
    density: 'low-medium — fills the guitar conversation gaps',
    example: '"I\'ve been waiting so long (oh!) [guitar answers] (Lord have mercy!)"',
    outro: '(boom... boom... boom...) hypnotic slow burn vamp',
  },
  punk: {
    sounds: ['hey', 'oi', 'yeah', 'go'],
    placement: 'chorus shout only, outro collective gang chant',
    density: 'low — intentional anti-production. Gang vocals not individual',
    example: '"[Chorus - shout] (HEY! OI! YEAH!)" — everyone shouts together',
    outro: '(oi! oi! oi!) abrupt end — NO fade',
  },
  kpop: {
    sounds: ['ooh', 'ah', 'yeah', 'na-na'],
    placement: 'post-chorus (ALWAYS), outro sweetener, before key change countdown',
    density: 'high — precision-engineered at exact bar positions',
    example: '"[Post-Chorus] (ooh-ah, na-na-na)" — timed to choreography counts',
    outro: '(yeah! ooh! ah!) (na-na-na, woah!) ad-lib driven singalong',
  },
  neosoul: {
    sounds: ['ooh', 'ah', 'mmm', 'baby', 'yeah'],
    placement: 'throughout chorus, bridge emotional build, outro melisma vamp',
    density: 'high — parallel emotional text alongside main vocal',
    example: '"Come to me (ah, yeah) be with me (ooh, ooh)"; bridge: (ooh-ooh-ah!) run',
    outro: '(ooh-ooh-ooh!) escalating melismatic run vamps and fades',
  },
  gospel: {
    sounds: ['hallelujah', 'oh Lord', 'amen', 'yes Lord', 'glory'],
    placement: 'call-and-response THROUGHOUT, bridge vamp climax, outro vamp sacred',
    density: 'maximum — ad-libs ARE the structure',
    example: '"He lifted me up! [Response: (hallelujah!) (amen!)]"',
    outro: '(hallelujah!) (yes Lord!) (glory!) EXTENDED vamp — NEVER cut short',
  },
  parody: {
    sounds: ['(matching original genre ad-libs)', '(what?!)', '(seriously)', '(really?)'],
    placement: 'mirror original song placement exactly — subvert content only',
    density: 'match source genre density',
    example: '"I put ketchup on my steak (what?!)" — sincere delivery + absurd content',
    outro: 'callback to absurd premise with sincere ad-lib delivery',
  },
  comedy: {
    sounds: ['(right?)', '(I mean)', '(yeah)', '(...pause)'],
    placement: 'AFTER the punchline lands — never before. Timing is the joke.',
    density: 'sparse — only where it amplifies comedy',
    example: '"My dog judged me (I mean, he\'s right)"',
    outro: 'final comedic payoff with sincere ad-lib',
  },
  children: {
    sounds: ['la-la-la', 'na-na-na', 'do-do-do', 'yay', 'woohoo'],
    placement: 'every chorus repeat (kids join by the 2nd time), outro singalong',
    density: 'high — maximum simplicity, 1–2 syllables only',
    example: '"Baby shark (do-do-do-do!) every day (yay!)"',
    outro: '(do-do-do-do!) (la-la-la-la!) full group singalong fades',
  },
  tvmusical: {
    sounds: ['la-la-la', 'da-da-da', 'hmm', '(character leitmotif)'],
    placement: 'TV theme: 3-sec identity hook; musical: I-want song emotional eruption',
    density: 'varies — TV theme: instant; musical: sparingly but powerfully',
    example: 'Theme: "(Da-da-da!) [show name]"; Musical: "(Yes!) I want it! (I want it!)"',
    outro: 'character leitmotif returns; theme is instantly singable on exit',
  },
};

// Vocal stacking per genre: how many layers in each section
// doubling = 2 takes (presence) | tripling = 3 takes (choir threshold) | stacked = 4-8 (gospel/transcendence)
const VOCAL_STACK_PROFILES = {
  pop:       { verse: 'single or subtle double', chorus: 'double-tracked lead', finalChorus: 'triple-tracked + harmony layer', method: 'ADT doubling on choruses, stacked harmony in final' },
  hiphop:    { verse: 'single (confident)', chorus: 'double for presence', finalChorus: 'triple + layered ad-libs', method: 'Minimal doubling in verse; ad-lib layers create depth not stacking' },
  rnb:       { verse: 'single + breathy double', chorus: 'doubled + harmony', finalChorus: '4–6 layer vocal stack', method: 'Build from intimate (verse) to transcendent (final chorus)' },
  rock:      { verse: 'single or double', chorus: 'double-tracked', finalChorus: 'triple + gang vocal layer', method: 'Gang vocals on final chorus for communal energy' },
  country:   { verse: 'single', chorus: 'double', finalChorus: 'double + group vocal', method: 'Group harmony on final chorus; barn-dance communal feel' },
  edm:       { verse: 'heavily processed single', chorus: 'doubled + reverb', finalChorus: 'stacked + pitch-shifted layers', method: 'Processing over raw layers; wide stereo spread on drop' },
  latin:     { verse: 'single lead', chorus: 'double + backing harmonies', finalChorus: 'double + call-response layer', method: 'Call-and-response adds natural second voice throughout' },
  reggaeton: { verse: 'single', chorus: 'double', finalChorus: 'double + ad-lib layer', method: 'Minimal stacking; groove > vocal complexity' },
  folk:      { verse: 'single (raw)', chorus: 'subtle double (barely audible)', finalChorus: 'gentle double', method: 'Resist stacking; imperfection is authenticity' },
  metal:     { verse: 'single (aggressive)', chorus: 'double + screamed layer', finalChorus: 'triple + all-band shout', method: 'Contrast clean verse single vs stacked chorus power' },
  jazz:      { verse: 'single', chorus: 'single (space is sacred)', finalChorus: 'single + scat countermelody', method: 'Never stack — jazz values space and single voice' },
  ss:        { verse: 'single (intimate)', chorus: 'single or subtle double', finalChorus: 'gentle double', method: 'Preserve vulnerability; no obvious stacking' },
  altrock:   { verse: 'single', chorus: 'double', finalChorus: 'triple (earned)', method: 'The triple stacking must feel discovered, not engineered' },
  reggae:    { verse: 'single', chorus: 'double + backing singers', finalChorus: 'double + backing vamp stack', method: 'Backing vocalists add the communal layer naturally' },
  afrobeats: { verse: 'single', chorus: 'double + rhythmic ad-libs', finalChorus: 'double + call-response layer', method: 'Ad-libs and call-response do the stacking work' },
  blues:     { verse: 'single (raw)', chorus: 'single (guitar answers)', finalChorus: 'single + voice breaks', method: 'Never stack; the guitar IS the second voice' },
  punk:      { verse: 'single', chorus: 'gang vocal stack (all members)', finalChorus: 'full gang shout', method: 'Stacking erases individual identity — that\'s the point' },
  kpop:      { verse: 'double', chorus: 'triple + harmony', finalChorus: '4-layer precision stack', method: 'Engineered precision; each layer placed at exact beat divisions' },
  neosoul:   { verse: 'single + whisper double', chorus: 'double + runs', finalChorus: '4–6 layer + melismatic runs', method: 'Builds from intimate (verse) to spiritual (final chorus)' },
  gospel:    { verse: 'single lead', chorus: 'double + choir response', finalChorus: '6–8 layer choir stack', method: 'Maximum stacking signals maximum spiritual intensity' },
  parody:    { verse: 'match source genre', chorus: 'match source genre', finalChorus: 'match source genre', method: 'Mimic source genre stacking exactly; content creates the comedy not production' },
  comedy:    { verse: 'single (sincere)', chorus: 'single (commitment)', finalChorus: 'single (straight-faced)', method: 'Sincere production makes the joke land harder' },
  children:  { verse: 'single (warm)', chorus: 'double (big and friendly)', finalChorus: 'group stack (everyone joins)', method: 'Final chorus group sound models communal participation for children' },
  tvmusical: { verse: 'single (character voice)', chorus: 'character + harmony', finalChorus: 'company stack (cast joins)', method: 'Stack builds as more characters join; climax is everyone together' },
};

// Maps FUSION_DATA capitalized/hyphenated genre tokens → ADLIB_BIBLE keys
const _FUSION_KEY_MAP = {
  'Afrobeats': 'afrobeats', 'Alt-Rock': 'altrock', 'Blues': 'blues',
  'Country': 'country', 'EDM': 'edm', 'Folk': 'folk', 'Gospel': 'gospel',
  'Hip-Hop': 'hiphop', 'Jazz': 'jazz', 'K-Pop': 'kpop', 'Latin': 'latin',
  'Neo-Soul': 'neosoul', 'Pop': 'pop', 'Punk': 'punk', 'R&B': 'rnb',
  'Reggae': 'reggae', 'Reggaeton': 'reggaeton', 'Rock': 'rock',
  'Singer-Songwriter': 'ss', 'Soul': 'neosoul'
};
function _normalizeGenreKey(genre) {
  return _FUSION_KEY_MAP[genre] || genre;
}

function buildAdlibNote(genre) {
  const a = ADLIB_BIBLE[_normalizeGenreKey(genre)];
  if (!a) return '';
  const sounds = a.sounds.slice(0, 4).map(s => `(${s})`).join(' ');
  return `\n\nAD-LIBS (Suno parentheses syntax — use throughout):
Sounds: ${sounds} — ${a.placement}
Density: ${a.density}
Example: ${a.example}
Outro: ${a.outro}
Rule: Parentheses = background layer. Same line = rhythmic pocket. Separate line = spotlight moment.`;
}

function buildVocalStackNote(genre) {
  const v = VOCAL_STACK_PROFILES[_normalizeGenreKey(genre)];
  if (!v) return '';
  return `\n\nVOCAL STACKING (DIRECTOR NOTE):
Verse: ${v.verse} | Chorus: ${v.chorus} | Final Chorus: ${v.finalChorus}
Method: ${v.method}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// PLATINUM MODE — TOP 5% HIT REFERENCES
// Per-genre: top defining tracks + the single technique that separates top 5%
// from average. Used by buildTopTierNote() to inject a tight reference block
// into prompts when platinum:true. Cross-training borrows the best technique
// from a complementary genre to elevate the output further.
// ═══════════════════════════════════════════════════════════════════════════

const GENRE_HIT_REFERENCES = {
  pop: {
    hits: [
      { title: 'Anti-Hero', artist: 'Taylor Swift', technique: 'Self-aware narrator owns the flaw completely — disarming honesty lands harder than any defense' },
      { title: 'Blinding Lights', artist: 'The Weeknd', technique: 'Nostalgic production + modern vulnerability — sonic past carries emotional present' },
      { title: 'As It Was', artist: 'Harry Styles', technique: 'Verse emotional restraint explodes at chorus — hold back until the exact right moment' },
    ],
    defining: 'Hook singable after one listen. Verse builds tension; chorus releases it completely. Specificity over abstraction.',
    crossFrom: 'country', crossTechnique: 'Concrete sensory detail — name the object, the place, the moment. "Cheap perfume" beats "her memory" every time.',
  },
  hiphop: {
    hits: [
      { title: 'HUMBLE.', artist: 'Kendrick Lamar', technique: 'Minimalist beat forces lyrical density to carry everything — no melodic crutch, pure word craft' },
      { title: 'God\'s Plan', artist: 'Drake', technique: 'Hook repetition as hypnosis — say it simply, say it again, mean it more each time' },
      { title: 'DNA.', artist: 'Kendrick Lamar', technique: 'Aggressive self-assertion as armor — identity as defiance, every bar a thesis statement' },
    ],
    defining: 'Every bar earns its place. Internal rhymes > end rhymes. The hook is a mantra. Flow variation signals emotional shift.',
    crossFrom: 'blues', crossTechnique: 'AAB problem-state structure — state the problem, deepen it, then resolve (or refuse to).',
  },
  rnb: {
    hits: [
      { title: 'Kill Bill', artist: 'SZA', technique: 'Casual delivery of extreme emotion creates unsettling intimacy — mundane framing amplifies the feeling' },
      { title: 'Leave The Door Open', artist: 'Silk Sonic', technique: 'Vintage production as sincerity signal — classic arrangement says "this emotion is timeless"' },
      { title: 'Best Part', artist: 'Daniel Caesar', technique: 'Harmonic simplicity amplifies vocal vulnerability — fewer chords, more feeling' },
    ],
    defining: 'Groove is the emotional argument. Melody and rhythm must feel inevitable. Vulnerability is the superpower.',
    crossFrom: 'neosoul', crossTechnique: 'Jazz chord extensions (maj7, 9ths) under the hook — harmony does emotional work the lyric doesn\'t have to.',
  },
  rock: {
    hits: [
      { title: 'Mr. Brightside', artist: 'The Killers', technique: 'No intro — drop straight into the emotional state. Opening riff IS the hook.' },
      { title: 'Seven Nation Army', artist: 'The White Stripes', technique: '5-note bass riff becomes global anthem — rhythm carries the identity before words do' },
      { title: 'Fix You', artist: 'Coldplay', technique: 'Quiet verse to anthemic chorus — dynamic contrast makes the release feel earned and overwhelming' },
    ],
    defining: 'Riff supremacy. Dynamic contrast between verse and chorus. Chorus must feel like a physical release.',
    crossFrom: 'blues', crossTechnique: 'Pentatonic riff as emotional vocabulary — the bend, the slide, the note held just past comfortable.',
  },
  country: {
    hits: [
      { title: 'Before He Cheats', artist: 'Carrie Underwood', technique: 'Specific destructive detail — "Louisville Slugger to both headlights" > "I was so angry"' },
      { title: 'Fast Car', artist: 'Tracy Chapman', technique: 'Accumulating concrete detail builds an entire life — the car, the job, the plan, the hope' },
      { title: 'Jolene', artist: 'Dolly Parton', technique: 'Direct address to antagonist — intimacy and vulnerability through second-person pleading' },
    ],
    defining: 'Specificity is everything. Name the town, the truck, the bar, the feeling. Chorus is the emotional verdict on the verse\'s story.',
    crossFrom: 'folk', crossTechnique: 'Confessional first-person truth — no metaphor barrier between singer and emotion. The lyric IS the diary entry.',
  },
  edm: {
    hits: [
      { title: 'Levels', artist: 'Avicii', technique: 'The drop IS the hook — melody lives in the synth. Build tension until the release is physical.' },
      { title: 'Wake Me Up', artist: 'Avicii', technique: 'Live instruments under electronic production — human warmth amplifies synthetic power' },
      { title: 'Titanium', artist: 'David Guetta ft. Sia', technique: 'Human voice as emotional anchor in a synthetic world — the contrast makes both land harder' },
    ],
    defining: 'The drop is the payoff. Every element before it is tension. Melody simple enough to feel in a crowd. Groove > complexity.',
    crossFrom: 'pop', crossTechnique: 'Singable hook with emotional specificity — not just a vibe, an actual feeling with words.',
  },
  latin: {
    hits: [
      { title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', technique: 'Rhythmic hook lands before the melody registers — groove creates double impact' },
      { title: 'La Bamba', artist: 'Ritchie Valens', technique: 'Call-and-response hook builds communal energy — crowd becomes part of the performance' },
      { title: 'Malamente', artist: 'Rosalía', technique: 'Genre authenticity as emotional texture — flamenco DNA inside modern production creates depth pastiche cannot' },
    ],
    defining: 'Rhythm is the primary language. Clave pattern locks the groove. Melody responds to rhythm, not the other way around.',
    crossFrom: 'afrobeats', crossTechnique: 'Polyrhythmic percussion layers — stack rhythms that each work alone but create something larger together.',
  },
  reggaeton: {
    hits: [
      { title: 'Gasolina', artist: 'Daddy Yankee', technique: 'Dembow as identity — the rhythm IS the genre signature, hook rides it rather than fighting it' },
      { title: 'Con Calma', artist: 'Daddy Yankee & Snow', technique: 'Sample as cultural memory — familiar rhythm triggers nostalgia while new hook feels immediate' },
      { title: 'Hawái', artist: 'Maluma', technique: 'Romantic vulnerability over hard beat — soft words on a hard rhythm amplifies both' },
    ],
    defining: 'Dembow rhythm is non-negotiable. Hook simplicity is a feature. Repetition is hypnosis.',
    crossFrom: 'hiphop', crossTechnique: 'Lyrical density in verses — pack bars with internal rhyme while letting the hook breathe.',
  },
  folk: {
    hits: [
      { title: 'The Sound of Silence', artist: 'Simon & Garfunkel', technique: 'Sparse arrangement forces lyric to carry everything — no production safety net' },
      { title: 'Skinny Love', artist: 'Bon Iver', technique: 'Emotional ambiguity in concrete images — listener\'s experience fills the meaning' },
      { title: 'Fast Car', artist: 'Tracy Chapman', technique: 'Accumulating specific detail builds an entire emotional world — every object is a feeling' },
    ],
    defining: 'The lyric IS the song. Sparse arrangement. First-person confession. Nature imagery as emotional mirror.',
    crossFrom: 'ss', crossTechnique: 'Confessional directness — the singer is not performing, they are telling the truth.',
  },
  metal: {
    hits: [
      { title: 'Master of Puppets', artist: 'Metallica', technique: 'Opening riff contains the entire emotional argument of the song' },
      { title: 'Paranoid', artist: 'Black Sabbath', technique: 'Tempo as aggression — speed and distortion carry emotion before the first lyric' },
      { title: 'Duality', artist: 'Slipknot', technique: 'Quiet verse / crushing chorus — contrast amplifies both vulnerability and power' },
    ],
    defining: 'Riff supremacy. Dynamics between vulnerability (verse) and power (chorus). Virtuosity must serve emotion, not replace it.',
    crossFrom: 'punk', crossTechnique: 'Urgency over polish — raw energy and directness. The feeling should feel dangerous, not rehearsed.',
  },
  jazz: {
    hits: [
      { title: 'Take Five', artist: 'Dave Brubeck', technique: 'Odd time signature as identity — the "wrong" rhythm becomes the most natural thing after 4 bars' },
      { title: 'So What', artist: 'Miles Davis', technique: 'Space as expression — silence has emotional weight equal to sound' },
      { title: 'Autumn Leaves', artist: 'Standard / Chet Baker', technique: 'Chord substitution creates surprise and longing — the "wrong" note is the most right' },
    ],
    defining: 'Space between notes is the emotion. Harmonic sophistication as vocabulary. What you leave out is the art.',
    crossFrom: 'blues', crossTechnique: 'Blues scale as emotional anchor — underneath harmonic complexity, the pentatonic root keeps the listener feeling.',
  },
  ss: {
    hits: [
      { title: 'Hallelujah', artist: 'Leonard Cohen', technique: 'Sacred language applied to secular pain — collision of registers creates transcendence' },
      { title: 'Gravity', artist: 'John Mayer', technique: 'Chord progression carries more emotion than the lyric — harmony does the heavy lifting' },
      { title: 'The Story', artist: 'Brandi Carlile', technique: 'Quiet confessional explodes — restraint earns the release' },
    ],
    defining: 'Confessional directness. Chord progression as emotional arc. Every word earned. Bridge reframes everything before it.',
    crossFrom: 'folk', crossTechnique: 'Natural imagery as emotional parallel — weather, seasons, water. Let the external mirror the internal without saying so.',
  },
  altrock: {
    hits: [
      { title: 'Creep', artist: 'Radiohead', technique: 'Specific weakness becomes universal anthem — everyone secretly feels the outsider feeling' },
      { title: 'Yellow', artist: 'Coldplay', technique: 'Abstracted emotion in concrete image — "I drew a line for you" is specific, visual, and completely open' },
      { title: 'Mr. Brightside', artist: 'The Killers', technique: 'No intro — drop straight into the emotional state, trust the listener to catch up' },
    ],
    defining: 'Emotional honesty over polish. Quiet-loud dynamic as the central move. Chorus is where the held-back thing finally comes out.',
    crossFrom: 'rock', crossTechnique: 'Riff as emotional identity — the guitar hook tells you the feeling before any lyrics do.',
  },
  reggae: {
    hits: [
      { title: 'No Woman No Cry', artist: 'Bob Marley', technique: 'Anthemic simplicity — the hook is so simple it becomes a prayer through repetition' },
      { title: 'Redemption Song', artist: 'Bob Marley', technique: 'Message over groove — when the lyric matters enough, strip the production to nothing' },
      { title: 'Rivers of Babylon', artist: 'The Melodians', technique: 'Ancient words in new emotional context — the depth of source material resonates even without recognition' },
    ],
    defining: 'Offbeat skank creates space. Message-driven lyric. Repetition as ritual. Hook should feel like a community chant.',
    crossFrom: 'folk', crossTechnique: 'Protest through simplicity — the most powerful political statements are the most direct.',
  },
  afrobeats: {
    hits: [
      { title: 'Essence', artist: 'Wizkid ft. Tems', technique: 'Groove as intimacy — the beat is seductive before a word is sung; melody floats over it like conversation' },
      { title: 'Ye', artist: 'Burna Boy', technique: 'Cultural specificity as universal appeal — deeply specific references translate globally because emotion is universal' },
      { title: 'Calm Down', artist: 'Rema', technique: 'Percussive vocal rhythm — voice becomes part of the rhythm section, syllables land like hi-hat hits' },
    ],
    defining: 'Percussion is the primary language. Vocal melody as counterpoint to groove. Cultural authenticity. Joy as resistance.',
    crossFrom: 'rnb', crossTechnique: 'Melodic vulnerability in the hook — underneath groove confidence, the emotional reveal of needing someone.',
  },
  blues: {
    hits: [
      { title: 'The Thrill Is Gone', artist: 'B.B. King', technique: 'AAB lyric structure — state the pain, deepen it, then the guitar answers what words cannot say' },
      { title: 'Pride and Joy', artist: 'Stevie Ray Vaughan', technique: 'Riff as emotional argument — guitar lick tells you the feeling before the lyric confirms it' },
      { title: 'Cross Road Blues', artist: 'Robert Johnson', technique: 'Mythic imagery in physical detail — the crossroads is both real and symbolic simultaneously' },
    ],
    defining: 'AAB lyric structure. Guitar answers what voice cannot. Suffering as craft. Emotional truth over lyrical complexity.',
    crossFrom: 'gospel', crossTechnique: 'Spiritual intensity in secular pain — let emotional intensity reach toward transcendence even in heartbreak.',
  },
  punk: {
    hits: [
      { title: 'London Calling', artist: 'The Clash', technique: 'Apocalyptic imagery as political urgency — the stakes are everything, delivery is immediate' },
      { title: 'Basket Case', artist: 'Green Day', technique: 'Self-diagnosis as anthem — confessing the anxiety makes everyone else feel less alone' },
      { title: 'Blitzkrieg Bop', artist: 'Ramones', technique: 'Maximum impact in minimum time — 2 minutes, 4 chords, one feeling. Nothing wasted.' },
    ],
    defining: 'Urgency over polish. Direct message. Short, fast, loud. Say the thing — no metaphor shield.',
    crossFrom: 'folk', crossTechnique: 'Protest directness — folk\'s plainspoken truth delivered at punk speed and volume.',
  },
  kpop: {
    hits: [
      { title: 'Dynamite', artist: 'BTS', technique: 'English hook on Korean song — global accessibility sits on top of cultural identity, not instead of it' },
      { title: 'Kill This Love', artist: 'BLACKPINK', technique: 'Pre-chorus is the real payoff — the drop hits harder because the build was perfectly constructed' },
      { title: 'Feel Special', artist: 'TWICE', technique: 'Direct emotional address at maximum vulnerability — "you make me feel special" is the whole thesis' },
    ],
    defining: 'Pre-chorus tension architecture. Hook accessibility over lyrical complexity. Production must sparkle.',
    crossFrom: 'edm', crossTechnique: 'Drop architecture — the silence before the drop is part of the drop. Build then release everything at once.',
  },
  neosoul: {
    hits: [
      { title: 'On & On', artist: 'Erykah Badu', technique: 'Jazz harmony under R&B groove — chord extensions do emotional work the lyric only hints at' },
      { title: 'Bag Lady', artist: 'Erykah Badu', technique: 'Single metaphor sustained through the entire song — one image carries all the meaning' },
      { title: 'Best Part', artist: 'Daniel Caesar ft. H.E.R.', technique: 'Harmonic space amplifies vocal — fewer chords creates room for the voice to breathe and mean everything' },
    ],
    defining: 'Jazz harmony meets R&B groove. The song breathes. Confessional lyric under musical sophistication. Space is as important as sound.',
    crossFrom: 'jazz', crossTechnique: 'Unexpected chord substitution at emotional peak — the "wrong" chord that is most right creates surprise and longing.',
  },
  gospel: {
    hits: [
      { title: 'Total Praise', artist: 'Richard Smallwood', technique: 'Choir crescendo as spiritual escalation — sound of community believing amplifies individual conviction' },
      { title: 'Goodness of God', artist: 'CeCe Winans', technique: 'Testimony structure — verse is the before, chorus is the after; the contrast IS the emotional argument' },
      { title: 'I Can Only Imagine', artist: 'MercyMe', technique: 'Wonder as lyric strategy — asking the question creates more emotion than asserting the answer' },
    ],
    defining: 'Community call-and-response. Testimony structure. Vocal crescendo as spiritual argument. Repetition as conviction.',
    crossFrom: 'rnb', crossTechnique: 'Contemporary arrangement under spiritual message — modern groove makes the message land in the present moment.',
  },
  parody: {
    hits: [
      { title: 'Word Crimes', artist: 'Weird Al Yankovic', technique: 'Maintain original song structure exactly — subvert only the subject matter, let collision create the comedy' },
      { title: 'White & Nerdy', artist: 'Weird Al Yankovic', technique: 'Specific cultural references > generic jokes — exact detail is always funnier than vague category' },
      { title: 'Amish Paradise', artist: 'Weird Al Yankovic', technique: 'Commit to the premise completely — play it straight, never wink. The bit lands harder when you believe it.' },
    ],
    defining: 'Preserve original song structure. Subvert only the subject. Specificity is the punchline. Full commitment to the premise.',
    crossFrom: 'tvmusical', crossTechnique: 'Theatrical commitment — play it completely straight, never wink. The joke lands harder when the performer believes it.',
  },
  comedy: {
    hits: [
      { title: 'That Funny Feeling', artist: 'Bo Burnham', technique: 'Specificity is the punchline — exact cultural reference creates recognition that lands like a gut punch' },
      { title: 'Hiphopopotamus vs. Rhymenoceros', artist: 'Flight of the Conchords', technique: 'Earnestness as comedy — the gap between sincerity and absurdity IS the joke' },
      { title: 'I\'m On A Boat', artist: 'The Lonely Island', technique: 'Full commitment to a ridiculous premise — comedy is in how seriously everyone takes it' },
    ],
    defining: 'The unexpected word in the expected slot is the entire joke. Specific > general always. Commit to the premise completely.',
    crossFrom: 'pop', crossTechnique: 'Genuine hook — the song must also work musically; the comedy needs contrast to land against.',
  },
  children: {
    hits: [
      { title: 'You\'ve Got a Friend in Me', artist: 'Randy Newman', technique: 'Adult emotion in simple language — warmth is real and unsentimental. Kids feel sincerity.' },
      { title: 'Let It Go', artist: 'Idina Menzel / Frozen', technique: 'Empowerment arc in 3 minutes — verse establishes constraint, chorus breaks it, bridge commits to freedom' },
      { title: 'The Bare Necessities', artist: 'Phil Harris / Jungle Book', technique: 'Rhythm as invitation — groove makes a child want to move before they understand the words' },
    ],
    defining: 'Simple vocabulary, genuine emotion. Hook invites movement. Clear narrative arc with resolution. Never condescending.',
    crossFrom: 'folk', crossTechnique: 'Repetition as ritual — the hook must be instantly joinable so the child learns it by singing along.',
  },
  tvmusical: {
    hits: [
      { title: 'My Shot (Hamilton)', artist: 'Lin-Manuel Miranda', technique: 'Form matches character — rap form carries a founding father\'s ambition and urgency simultaneously' },
      { title: 'Defying Gravity (Wicked)', artist: 'Idina Menzel', technique: 'Song replaces dialogue — this moment can ONLY be sung; music carries what words alone cannot' },
      { title: 'On My Own (Les Misérables)', artist: 'Schönberg / Boublil', technique: 'Unreliable narrator in song — the gap between what she sings and what is true IS the tragedy' },
    ],
    defining: 'Song replaces what dialogue cannot express. Character is revealed, not described. Rhyme scheme IS personality. Lyric must advance the story.',
    crossFrom: 'pop', crossTechnique: 'Hook accessibility — the tune must outlive the show. Singable leaving the venue.',
  },
};

function buildTopTierNote(genre, crossGenre) {
  const ref = GENRE_HIT_REFERENCES[genre];
  if (!ref) return '';
  const picks = ref.hits.slice(0, 2);
  const refLines = picks.map(h => `  • "${h.title}" (${h.artist}): ${h.technique}`).join('\n');
  const xKey    = crossGenre || ref.crossFrom;
  const xLabel  = GENRE_LABELS[xKey] || xKey;
  const xNote   = ref.crossTechnique ? `\nCROSS-TRAIN from ${xLabel}: ${ref.crossTechnique}` : '';
  return `\n\nPLATINUM MODE — TOP 5% TARGET:\nWrite at the level of the best ${GENRE_LABELS[genre] || genre} songs ever made.\nReference:\n${refLines}\nDEFINING TECHNIQUE: ${ref.defining}${xNote}\nEvery line must justify its existence. The hook must be undeniable.`;
}

const PRODUCTION_ARCHETYPES = {
  'trap-808':        { label: 'Trap / 808', genres: ['hiphop','reggaeton'], kit: 'TR-808 or Plug-In snare, hard 808 bass, hi-hat rolls (1/16–1/32)', tempo: '130–145 BPM', signature: 'Sliding 808 glide, snare choke, hi-hat velocity variation, dark minor keys' },
  'live-band':       { label: 'Live Band', genres: ['rock','country','blues','folk','jazz','neosoul','gospel'], kit: 'Acoustic kit, bass guitar, real instruments', tempo: '70–140 BPM', signature: 'Room bleed, human timing fluctuation, chord stabs, real amp tone' },
  'orchestral-pop':  { label: 'Orchestral Pop', genres: ['pop','rnb','ss'], kit: 'Strings, piano, light drums, orchestral hits', tempo: '70–100 BPM', signature: 'String swells into chorus, piano counter-melody, dynamic orchestra builds' },
  'bedroom-pop':     { label: 'Bedroom Pop', genres: ['pop','folk','ss','altrock'], kit: 'Lo-fi samples, MIDI keys, soft drums, field recordings', tempo: '75–110 BPM', signature: 'Cassette warmth, intimate reverb, imperfect vocal takes kept, soft clipping' },
  'electronic-atm':  { label: 'Electronic / Atmospheric', genres: ['edm','kpop','afrobeats','altrock'], kit: 'Synthesizers, drum machine, arpeggiators, granular pads', tempo: '110–145 BPM', signature: 'Sidechain pumping, filter sweeps, epic drop, evolving pad textures' },
  'acoustic-roots':  { label: 'Acoustic / Roots', genres: ['folk','country','blues','reggae'], kit: 'Acoustic guitar, upright bass, brushed drums, harmonica', tempo: '65–110 BPM', signature: 'Natural reverb, tape warmth, chord voicing on acoustic, no samples' },
  'club-dance':      { label: 'Club / Dance', genres: ['edm','latin','reggaeton','afrobeats','kpop'], kit: 'Kick-dominant, synth bass, stabs, high percussion', tempo: '120–135 BPM', signature: 'Four-on-the-floor kick, percussive groove, breakdown/drop structure' },
  'gospel-choir':    { label: 'Gospel / Choir', genres: ['gospel','rnb','neosoul'], kit: 'Hammond organ, choir, live piano, gospel drums', tempo: '70–100 BPM', signature: 'Call-and-response, organ swells, choir harmonics, building intensity' },
  'punk-garage':     { label: 'Punk / Garage', genres: ['punk','metal','rock'], kit: 'Distorted guitar, raw drums, bass overdrive', tempo: '140–200 BPM', signature: 'Raw recording, minimal production, energy over perfection' },
  'latin-urban':     { label: 'Latin Urban', genres: ['latin','reggaeton'], kit: 'Dembow rhythm, brass, synth bass, clave percussion', tempo: '95–105 BPM', signature: 'Clave pattern, brass hits, rhythmic syncopation, urban production meets live instruments' },
};

// ═══════════════════════════════════════════════════════════════════════════
// GENRE SECTION DNA
// Per-genre data for bridge harmony, weighted archetype preferences,
// counter-melody role, real song references, outro + verse-2 tendencies.
//
// Selection logic (pickWeightedArchetype):
//   70% chance → pick from genre's preferred list (weighted toward first)
//   30% chance → pick from full pool (true surprise)
// ═══════════════════════════════════════════════════════════════════════════

const GENRE_SECTION_DNA = {
  pop: {
    bridge: {
      harmonic: '♭VI → ♭VII → I (borrowed minor lift) or iv → ♭VII for tension. Often +2 semitone key change before final chorus — the "pop uplift." Adds 1-2 chords not heard in verse or chorus.',
      counter: 'Strings or synth pad takes the melodic lead while the vocal strips back to its most vulnerable register.',
      preferred_bridge: ['Emotional Reversal', 'Confessional Drop', 'Escalation Climb', 'Lyric Callback / Recontextualise'],
      preferred_outro: ['Crowd Takeover', 'Spiral Vamp', 'Callback Resolution'],
      preferred_verse2: ['Deeper Specific', 'Consequence', 'Zoom Out'],
      preferred_prechorus: ['Tension Ramp', 'Lyric Elevator', 'Whisper to Roar', 'Question Drop'],
      preferred_postchorus: ['Ad-Lib Showcase', 'Hook Echo', 'Breath and Reset'],
      examples: '"Someone Like You" (Adele) — bridge strips to voice + piano, deceptive cadence V→vi, most vulnerable moment. "Rolling in the Deep" — bridge builds over ♭VI→♭VII then modulates up. "Bad Guy" (Billie Eilish) — bridge near-silence then explosion back.',
    },
  },
  hiphop: {
    bridge: {
      harmonic: 'Melodic bridge over i minor or ♭VII for emotional lift. Sung bridge: maj7 or 9 extensions contrast the harder verse chords. Rapped bridge: strip to kick+808 only, same loop. Beat switch = move to a completely new key/tempo area.',
      counter: 'Producer melody or vocal sample carries the bridge — the MC steps back. The beat IS the bridge instrument.',
      preferred_bridge: ['Rhythmic Breakdown', 'Left-Turn Narrative', 'Confessional Drop', 'Spoken Interlude / Monologue'],
      preferred_outro: ['Cold Stop', 'Counter-Melody Ascent', 'Crowd Takeover'],
      preferred_verse2: ['Antagonist Voice', 'Time Jump', 'Deeper Specific', 'Consequence'],
      preferred_prechorus: ['Velocity Surge', 'Tension Ramp', 'Call-Setup'],
      preferred_postchorus: ['Drop Groove', 'Punchy Counter-Statement', 'Ad-Lib Showcase'],
      examples: '"All Falls Down" (Kanye) — sung emotional bridge over soft piano completely contrasts rapped verses. "HUMBLE." (Kendrick) — bridge strips to near-silence before final verse explosion. "DNA." (Kendrick) — bridge is a full beat switch into different key area.',
    },
  },
  rnb: {
    bridge: {
      harmonic: 'Half-time feel: drums drop to half-time, harmony gets extended (maj9, min11). ♭VII → IV → I or sustained vamp on IV. Modulate up 2-3 semitones for the falsetto peak.',
      counter: 'Background vocal harmonies thicken during the bridge — they become the texture, not the lead.',
      preferred_bridge: ['Pre-Outro Vamp Build', 'Confessional Drop', 'Emotional Reversal', 'Escalation Climb'],
      preferred_outro: ['Spiral Vamp', 'Crowd Takeover', 'Counter-Melody Ascent'],
      preferred_verse2: ['Consequence', 'Zoom Out', 'Deeper Specific'],
      preferred_prechorus: ['Lyric Elevator', 'Harmonic Pivot', 'Whisper to Roar'],
      preferred_postchorus: ['Ad-Lib Showcase', 'Hook Echo', 'Punchy Counter-Statement'],
      examples: '"Untitled (How Does It Feel)" (D\'Angelo) — bridge is pure vocal improv over minimal chord. "The Weekend" (SZA) — bridge modulates up + falsetto peak. "Crazy in Love" — bridge strips to bass + vocal, then explodes.',
    },
  },
  neosoul: {
    bridge: {
      harmonic: 'Most harmonically adventurous section: mode mixture (Dorian ↔ Aeolian), borrowed ♭III or ♭VI chords. Half-time Dilla drag. Chord voicings add 9ths and 11ths not used elsewhere. Stays rhythmically behind the beat.',
      counter: 'Rhodes or guitar plays a new melodic counter-line during the bridge — this is the moment the instrumental voice takes over.',
      preferred_bridge: ['Spoken Interlude / Monologue', 'Pre-Outro Vamp Build', 'Lyric Callback / Recontextualise', 'Confessional Drop'],
      preferred_outro: ['Spiral Vamp', 'Counter-Melody Ascent', 'Harmonic Drift'],
      preferred_verse2: ['Deeper Specific', 'The Other Side', 'Consequence'],
      preferred_prechorus: ['Harmonic Pivot', 'Lyric Elevator', 'Whisper to Roar'],
      preferred_postchorus: ['Ad-Lib Showcase', 'Hook Echo', 'Drop Groove'],
      examples: '"On & On" (Erykah Badu) — bridge is a spoken meditation over a single chord vamp. "Brown Skin" (India.Arie) — bridge deconstructs the groove to voice + guitar. Common "The Light" — bridge is the most vulnerable emotional turn.',
    },
  },
  jazz: {
    bridge: {
      harmonic: 'AABA B-section: III7 → VI7 → II7 → V7 (cycle of 5ths into new key center). Tritone subs common: ♭II7 replaces V7. Modulates to a new tonal area and returns via ii-V-I. This is the harmonic adventure — not a rest, a journey.',
      counter: 'The comping instrument (piano or guitar) breaks from accompaniment and plays a counter-melodic response during the bridge B-section.',
      preferred_bridge: ['Left-Turn Narrative', 'Lyric Callback / Recontextualise', 'Emotional Reversal'],
      preferred_outro: ['Harmonic Drift', 'Dialogue / Spoken Coda', 'Counter-Melody Ascent'],
      preferred_verse2: ['The Other Side', 'Deeper Specific', 'Time Jump'],
      preferred_prechorus: ['Harmonic Pivot', 'Question Drop', 'Tension Ramp'],
      preferred_postchorus: ['Hook Echo', 'Ad-Lib Showcase', 'Breath and Reset'],
      examples: '"In a Sentimental Mood" — B-section modulates from Dm to F major and back via cycle of 5ths. "All the Things You Are" — bridge cycles through 4 key areas in 8 bars. "Autumn Leaves" — B-section lands on unexpected ♭VII before resolving home.',
    },
  },
  blues: {
    bridge: {
      harmonic: 'Turnaround (bars 11-12 of the 12-bar): I → ♭VII → ♭VI → V7 (descending bass line) OR I → VI7 → ii7 → V7. Guitar solo IS the bridge. The turnaround creates tension that pulls into the next verse.',
      counter: 'Guitar answers the vocal in the turnaround — this call-and-response IS blues structure. The guitar is the bridge instrument.',
      preferred_bridge: ['Rhythmic Breakdown', 'Lyric Callback / Recontextualise', 'Escalation Climb'],
      preferred_outro: ['Counter-Melody Ascent', 'Harmonic Drift', 'Spiral Vamp'],
      preferred_verse2: ['Deeper Specific', 'Antagonist Voice', 'Consequence'],
      preferred_prechorus: ['Call-Setup', 'Tension Ramp', 'Lyric Elevator'],
      preferred_postchorus: ['Drop Groove', 'Hook Echo', 'Punchy Counter-Statement'],
      examples: '"The Thrill Is Gone" (B.B. King) — turnaround lands on VI7 minor creating maximum tension. "Hoochie Coochie Man" — stop-time bridge before the last verse. "Sweet Home Chicago" — turnaround accelerates the groove into final verse.',
    },
  },
  gospel: {
    bridge: {
      harmonic: 'CLIMAX — modulate up a whole step (Nashville move: I → II major with iii-vi-ii-V7 approach). Vamp on IV chord. Choir enters or doubles in octaves. The harmonic lift IS the spiritual lift — the modulation is the message.',
      counter: 'Choir sings counter-melody AGAINST the lead — lead goes up, choir goes down. Call-and-response intensifies during the vamp.',
      preferred_bridge: ['Escalation Climb', 'Pre-Outro Vamp Build', 'Rhythmic Breakdown'],
      preferred_outro: ['Crowd Takeover', 'Spiral Vamp', 'Pre-Outro Vamp Build'],
      preferred_verse2: ['Consequence', 'Zoom Out', 'Deeper Specific'],
      preferred_prechorus: ['Lyric Elevator', 'Whisper to Roar', 'Call-Setup'],
      preferred_postchorus: ['Ad-Lib Showcase', 'Breath and Reset', 'Drop Groove'],
      examples: '"Oh Happy Day" — bridge modulates up and vamps endlessly, choir takeover. "I Never Loved a Man" (Aretha) — bridge is rhythmic percussion build that lifts the whole congregation. "Break Every Chain" — bridge is sustained single-chord vamp that builds for 2+ minutes.',
    },
  },
  country: {
    bridge: {
      harmonic: '"The Turn" — stays on V7 for maximum unresolved tension, then releases to I for the final chorus. Or: moves to IV and stays, then V7 → I return. No key change. The harmony is simple — the emotional weight comes from the lyrics revealing something new.',
      counter: 'Pedal steel or fiddle plays a counter-melody under the bridge vocal — the most emotional instrument in country leads here.',
      preferred_bridge: ['Confessional Drop', 'Left-Turn Narrative', 'Lyric Callback / Recontextualise'],
      preferred_outro: ['Callback Resolution', 'Cold Stop', 'Spiral Vamp'],
      preferred_verse2: ['Time Jump', 'Antagonist Voice', 'Consequence'],
      preferred_prechorus: ['Lyric Elevator', 'Tension Ramp', 'Question Drop'],
      preferred_postchorus: ['Hook Echo', 'Breath and Reset', 'Punchy Counter-Statement'],
      examples: '"The Dance" (Garth Brooks) — bridge reveals the philosophical turn that reframes the whole song. "Before He Cheats" — bridge is the most specific, most violent verse. "Whiskey Glasses" — bridge doubles down on the emotional denial.',
    },
  },
  rock: {
    bridge: {
      harmonic: '♭VI → ♭VII → I power move (the "Stadium Rock" chord sequence). Or: drop to I minor for darkness before returning to major. Half-step key modulation for the final chorus. The bridge earns the final chorus explosion.',
      counter: 'Second guitar plays a contrasting melodic line — clean against distortion, or a sustained note while the rhythm guitar drives.',
      preferred_bridge: ['Escalation Climb', 'Rhythmic Breakdown', 'Confessional Drop'],
      preferred_outro: ['Cold Stop', 'Counter-Melody Ascent', 'Crowd Takeover'],
      preferred_verse2: ['Consequence', 'Zoom Out', 'Deeper Specific'],
      preferred_prechorus: ['Tension Ramp', 'Velocity Surge', 'Whisper to Roar'],
      preferred_postchorus: ['Drop Groove', 'Hook Echo', 'Breath and Reset'],
      examples: '"Under the Bridge" (RHCP) — bridge key shift into unexpected harmonic area. "Everlong" (Foo Fighters) — quiet bridge then full-band explosion back. "Don\'t Look Back in Anger" (Oasis) — bridge strips to piano then rebuilds.',
    },
  },
  altrock: {
    bridge: {
      harmonic: 'Quiet-LOUD: strip to clean guitar + whispered vocal, then full distortion wall. ♭VI chord adds unexpected darkness. Or: drone on one chord and let the dynamics do the work. The bridge IS the contrast.',
      counter: 'Bass takes a counter-melodic role when guitars go quiet — then falls back into the root when full band returns.',
      preferred_bridge: ['Rhythmic Breakdown', 'Confessional Drop', 'Spoken Interlude / Monologue'],
      preferred_outro: ['Cold Stop', 'Harmonic Drift', 'Counter-Melody Ascent'],
      preferred_verse2: ['The Other Side', 'Consequence', 'Deeper Specific'],
      preferred_prechorus: ['Whisper to Roar', 'Tension Ramp', 'Question Drop'],
      preferred_postchorus: ['Drop Groove', 'Punchy Counter-Statement', 'Breath and Reset'],
      examples: '"Smells Like Teen Spirit" — quiet bridge, then full-band explosion that redefined a decade. "Mr. Brightside" — no bridge, sustained tension instead. "Fake Plastic Trees" — bridge is the most sparse, most devastating.',
    },
  },
  edm: {
    bridge: {
      harmonic: 'Pre-drop breakdown: strip ALL harmonic content except one sustained synth note or pad on I. The absence of harmony IS the tension. Then the drop restores full harmonic power — the resolution after 32 bars of suspended silence.',
      counter: 'A single melodic motif — the hook reduced to its simplest form — plays alone during the breakdown before the drop.',
      preferred_bridge: ['Rhythmic Breakdown', 'Emotional Reversal', 'Pre-Outro Vamp Build'],
      preferred_outro: ['Cold Stop', 'Crowd Takeover', 'Spiral Vamp'],
      preferred_verse2: ['Zoom Out', 'Deeper Specific', 'Consequence'],
      preferred_prechorus: ['Velocity Surge', 'Tension Ramp', 'Harmonic Pivot'],
      preferred_postchorus: ['Drop Groove', 'Hook Echo', 'Breath and Reset'],
      examples: '"Levels" (Avicii) — 32-bar breakdown to a single melody, then drop. "Ghosts \'n\' Stuff" (Deadmau5) — filter sweep from silence into full-power drop. "One More Time" (Daft Punk) — bridge strips the groove to a single repeating phrase.',
    },
  },
  funk: {
    bridge: {
      harmonic: 'Funk break / synth or guitar solo: tight groove on I or vi with chromatic approach chords (♭III→II→I passing motion). The harmony barely moves — the RHYTHM changes. Bridge is a rhythmic contrast, not a harmonic journey.',
      counter: 'Horn section (brass) plays the bridge counter-melody — the rhythm section locks tighter while brass takes the melodic lead.',
      preferred_bridge: ['Rhythmic Breakdown', 'Pre-Outro Vamp Build', 'Escalation Climb'],
      preferred_outro: ['Crowd Takeover', 'Spiral Vamp', 'Counter-Melody Ascent'],
      preferred_verse2: ['Deeper Specific', 'Consequence', 'Zoom Out'],
      preferred_prechorus: ['Velocity Surge', 'Call-Setup', 'Tension Ramp'],
      preferred_postchorus: ['Drop Groove', 'Ad-Lib Showcase', 'Punchy Counter-Statement'],
      examples: '"Give Up the Funk" (Parliament) — bridge is pure call-and-response, horn section drives. "Super Freak" (Rick James) — bridge locks into a tighter syncopated figure. "September" (EW&F) — bridge is horn-section showcase over the same groove.',
    },
  },
  soul: {
    bridge: {
      harmonic: 'Organ swell moment: ii7 → V7 → I with extra 7th extensions. Gospel turnaround (vi → ii → V7) adds depth. The bridge is the most emotionally saturated chord — add 9ths and 13ths here that weren\'t in the verse.',
      counter: 'Background vocalists take over the response role — they stop being background and become equal voices in the bridge.',
      preferred_bridge: ['Escalation Climb', 'Pre-Outro Vamp Build', 'Confessional Drop'],
      preferred_outro: ['Spiral Vamp', 'Crowd Takeover', 'Counter-Melody Ascent'],
      preferred_verse2: ['Consequence', 'Deeper Specific', 'Zoom Out'],
      preferred_prechorus: ['Lyric Elevator', 'Whisper to Roar', 'Call-Setup'],
      preferred_postchorus: ['Ad-Lib Showcase', 'Hook Echo', 'Punchy Counter-Statement'],
      examples: '"Respect" (Aretha) — bridge is vocal ad-lib showcase, most technically demanding. "Ain\'t No Sunshine" — bridge single-phrase repetition that becomes a chant. "A Change Is Gonna Come" — bridge is the theological centre of the song.',
    },
  },
  reggae: {
    bridge: {
      harmonic: 'Dub break: same chord (I or i → ♭VII alternation), but production transforms. Guitar drops out, bass locks with drums, heavy reverb/delay echoes the last phrase. The bridge is a texture change, not a harmonic one.',
      counter: 'Melodica or flute carries the melodic line during the dub break — the rhythm instruments retreat and the melodic instrument leads.',
      preferred_bridge: ['Rhythmic Breakdown', 'Left-Turn Narrative', 'Lyric Callback / Recontextualise'],
      preferred_outro: ['Spiral Vamp', 'Harmonic Drift', 'Crowd Takeover'],
      preferred_verse2: ['Deeper Specific', 'Zoom Out', 'Consequence'],
      preferred_prechorus: ['Call-Setup', 'Tension Ramp', 'Question Drop'],
      preferred_postchorus: ['Drop Groove', 'Breath and Reset', 'Hook Echo'],
      examples: '"No Woman No Cry" — bridge is dub echo vamp, bass and drums carry. "Many Rivers to Cross" — bridge is a piano-led confessional. "Rivers of Babylon" — bridge is a pure melodic counter-statement.',
    },
  },
  afrobeats: {
    bridge: {
      harmonic: 'I → IV → V → IV loop with intensified percussion — no modulation, the groove IS the harmony. Bridge adds talking drum, shekere, and more vocal texture. The polyrhythm gets more complex, not simpler.',
      counter: 'Highlife guitar plays a more elaborate ostinato during the bridge — the repeating pattern becomes the emotional carrier.',
      preferred_bridge: ['Rhythmic Breakdown', 'Left-Turn Narrative', 'Pre-Outro Vamp Build'],
      preferred_outro: ['Crowd Takeover', 'Spiral Vamp', 'Counter-Melody Ascent'],
      preferred_verse2: ['Deeper Specific', 'Consequence', 'Zoom Out'],
      preferred_prechorus: ['Velocity Surge', 'Call-Setup', 'Tension Ramp'],
      preferred_postchorus: ['Ad-Lib Showcase', 'Drop Groove', 'Breath and Reset'],
      examples: '"Essence" (Wizkid) — bridge is pure percussion build then release. "Last Last" (Burna Boy) — bridge strips to drums and bass, then rebuilds with layers. "Ye" (Burna Boy) — bridge is the most vulnerable vocal moment in the song.',
    },
  },
  latin: {
    bridge: {
      harmonic: 'Clave continues through bridge but harmony shifts to relative major/minor. Montuno section: repeated 2-chord vamp (I–V or i–♭VII) where the clave and piano lock. Modulate up 2-3 semitones via chromatic bass approach: IV→V→I in new key.',
      counter: 'Brass section (trumpets, trombones) takes the melodic counter during the bridge — the montuno piano answers them.',
      preferred_bridge: ['Rhythmic Breakdown', 'Pre-Outro Vamp Build', 'Escalation Climb'],
      preferred_outro: ['Crowd Takeover', 'Spiral Vamp', 'Callback Resolution'],
      preferred_verse2: ['Deeper Specific', 'Consequence', 'The Other Side'],
      preferred_prechorus: ['Velocity Surge', 'Tension Ramp', 'Call-Setup'],
      preferred_postchorus: ['Ad-Lib Showcase', 'Drop Groove', 'Punchy Counter-Statement'],
      examples: '"Vivir Mi Vida" (Marc Anthony) — bridge is pure salsa brass + clave break. "Bailando" — bridge adds timbales/congas complexity, rhythm IS the transition. "Bésame Mucho" — bridge returns to tonic via chromatic descent.',
    },
  },
  kpop: {
    bridge: {
      harmonic: 'Rap break over relative minor or borrowed parallel-key chords. Key change UP +1 or +2 semitones before final chorus — this is the K-pop non-negotiable. The harmonic lift coincides with the emotional peak and choreography climax.',
      counter: 'Synth or string post-bridge line plays a counter-melody that re-harmonises the hook in the new key, preparing the final chorus.',
      preferred_bridge: ['Rhythmic Breakdown', 'Left-Turn Narrative', 'Escalation Climb'],
      preferred_outro: ['Cold Stop', 'Crowd Takeover', 'Callback Resolution'],
      preferred_verse2: ['Deeper Specific', 'Consequence', 'The Other Side'],
      preferred_prechorus: ['Tension Ramp', 'Velocity Surge', 'Harmonic Pivot'],
      preferred_postchorus: ['Hook Echo', 'Ad-Lib Showcase', 'Punchy Counter-Statement'],
      examples: '"Dynamite" (BTS) — bridge is rap break then key change up before final chorus. "Pink Venom" (BLACKPINK) — bridge adds a contrasting melodic section. "Attention" (NewJeans) — bridge strips the K-pop formula, minimal and unexpected.',
    },
  },
  ss: {
    bridge: {
      harmonic: 'Relative minor shift (I→vi) or unexpected deceptive cadence (V→vi instead of V→I). Often a capo change for tonal shift. The harmony is the simplest in the song — the lyric revelation carries all the weight.',
      counter: 'Acoustic guitar fingerpicking pattern changes for the bridge — a new pattern becomes the emotional signal. Cello or second acoustic voice enters only here.',
      preferred_bridge: ['Confessional Drop', 'Spoken Interlude / Monologue', 'Lyric Callback / Recontextualise'],
      preferred_outro: ['Dialogue / Spoken Coda', 'Callback Resolution', 'Harmonic Drift'],
      preferred_verse2: ['Deeper Specific', 'The Other Side', 'Time Jump'],
      preferred_prechorus: ['Question Drop', 'Lyric Elevator', 'Whisper to Roar'],
      preferred_postchorus: ['Breath and Reset', 'Hook Echo', 'Punchy Counter-Statement'],
      examples: '"Fast Car" (Tracy Chapman) — bridge is a lyrical revelation over the same harmonic loop. "The Night Will Always Win" (Manchester Orchestra) — bridge is a whispered confession. "The Blower\'s Daughter" — bridge strips to a single note held.',
    },
  },
  punk: {
    bridge: {
      harmonic: 'I → I → I → I (pure power chord drive) or sudden IV→V→I crash. Bridge may drop to silence for 1 bar then explode back. The "anti-bridge" — no harmonic complexity, just maximum energy disruption.',
      counter: 'There is no counter-melody. The bridge IS the disruption. Drums and bass lock harder as guitars stop.',
      preferred_bridge: ['Escalation Climb', 'Rhythmic Breakdown', 'Spoken Interlude / Monologue'],
      preferred_outro: ['Cold Stop', 'Crowd Takeover', 'Callback Resolution'],
      preferred_verse2: ['Consequence', 'Antagonist Voice', 'Zoom Out'],
      preferred_prechorus: ['Velocity Surge', 'Tension Ramp', 'Call-Setup'],
      preferred_postchorus: ['Drop Groove', 'Punchy Counter-Statement', 'Breath and Reset'],
      examples: '"God Save the Queen" (Sex Pistols) — bridge is the loudest, most hostile moment. "Basket Case" (Green Day) — bridge drops to clean guitar then explodes back. "I Wanna Be Sedated" — no bridge, one constant assault.',
    },
  },
  tvmusical: {
    bridge: {
      harmonic: 'Dramatic modulation up 1-3 semitones for the climax — usually the "+3 semitone theatrical key change." Unexpected borrowed chords for emotional revelation. The bridge is where the CHARACTER changes — the harmony mirrors their internal shift.',
      counter: 'Full orchestral counter-melody during the bridge — strings or brass plays a dramatic answer to the vocal.',
      preferred_bridge: ['Escalation Climb', 'Left-Turn Narrative', 'Emotional Reversal'],
      preferred_outro: ['Callback Resolution', 'Dialogue / Spoken Coda', 'Cold Stop'],
      preferred_verse2: ['Consequence', 'The Other Side', 'Time Jump'],
      preferred_prechorus: ['Lyric Elevator', 'Whisper to Roar', 'Harmonic Pivot'],
      preferred_postchorus: ['Ad-Lib Showcase', 'Hook Echo', 'Punchy Counter-Statement'],
      examples: '"Defying Gravity" (Wicked) — bridge modulates up 3 semitones to the climax that changes the character. "Being Alive" (Company) — bridge is the emotional core of the entire show. "Seasons of Love" (RENT) — bridge adds new melodic counter-line over the whole cast.',
    },
  },
};

// Weighted archetype picker:
// 70% → one of the genre's preferred list (slight bias toward first = most canonical)
// 30% → fully random from entire pool (surprise / rule-break)
function pickWeightedArchetype(fullPool, preferredNames) {
  if (!preferredNames || !preferredNames.length) return pickRandom(fullPool);
  const usePref = Math.random() < 0.70;
  if (usePref) {
    // Weight toward earlier items: index 0 gets weight 4, index 1 → 3, etc.
    const weights = preferredNames.map((_, i) => Math.max(4 - i, 1));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < preferredNames.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        const found = fullPool.find(a => a.name === preferredNames[i]);
        if (found) return found;
      }
    }
    return pickRandom(fullPool.filter(a => preferredNames.includes(a.name)) || fullPool);
  }
  return pickRandom(fullPool);
}

function buildSongPrompt(params) {
  const {
    genre = 'pop', topic: rawTopic = '', mood: rawMood = 'Emotional', vocal: rawVocal = 'any',
    structure = 'standard', era = 'modern', length = 'medium',
    quality = 'high', theoryLevel = 'standard', mode = 'auto',
    substyle = '', hookStyle = 'auto', voice = {}, albumTrack = null,
    blend = {}, bracketMode = 'suno', ageGroup = '',
    emotionalArc = 'none', seedLine = '', syllableCap = 0,
    platform = 'suno', avoidPatterns = [], dualPerspective = false, platinum = false,
    edgeMode = 'off', edgeTopics = [], freestyleMode = false,
    craftDimensions = null
  } = params;

  // Per-genre Craft Dimensions note — routed to the right builder.
  // Each builder returns '' if dims are null/missing, so this is safe for any genre.
  let craftDimNote = '';
  if (craftDimensions && typeof craftDimensions === 'object') {
    if      (genre === 'blues')     craftDimNote = buildBluesDimBlock(craftDimensions);
    else if (genre === 'bossa')     craftDimNote = buildBossaDimBlock(craftDimensions);
    else if (genre === 'ss')        craftDimNote = buildSSDimBlock(craftDimensions);
    else if (genre === 'kpop')      craftDimNote = buildKpopDimBlock(craftDimensions);
    else if (genre === 'altrock')   craftDimNote = buildAltrockDimBlock(craftDimensions);
    else if (genre === 'afrobeats') craftDimNote = buildAfrobeatsDimBlock(craftDimensions);
    else if (genre === 'reggae')    craftDimNote = buildReggaeDimBlock(craftDimensions);
    else if (genre === 'neosoul')   craftDimNote = buildNeosoulDimBlock(craftDimensions);
    else if (genre === 'reggaeton') craftDimNote = buildReggaetonDimBlock(craftDimensions);
    else if (genre === 'latin')     craftDimNote = buildLatinDimBlock(craftDimensions);
    else if (genre === 'dancehall') craftDimNote = buildDancehallDimBlock(craftDimensions);
    else if (genre === 'gospel')    craftDimNote = buildGospelDimBlock(craftDimensions);
    else if (genre === 'parody')    craftDimNote = buildParodyDimBlock(craftDimensions);
    else if (genre === 'comedy')    craftDimNote = buildComedyDimBlock(craftDimensions);
    else if (genre === 'children')  craftDimNote = buildChildrenDimBlock(craftDimensions);
    else if (genre === 'pop')       craftDimNote = buildPopDimBlock(craftDimensions);
    else if (genre === 'rnb')       craftDimNote = buildRnbDimBlock(craftDimensions);
    else if (genre === 'rock')      craftDimNote = buildRockDimBlock(craftDimensions);
    else if (genre === 'country')   craftDimNote = buildCountryDimBlock(craftDimensions);
    else if (genre === 'edm')       craftDimNote = buildEdmDimBlock(craftDimensions);
    else if (genre === 'folk')      craftDimNote = buildFolkDimBlock(craftDimensions);
    else if (genre === 'metal')     craftDimNote = buildMetalDimBlock(craftDimensions);
    else if (genre === 'jazz')      craftDimNote = buildJazzDimBlock(craftDimensions);
    else if (genre === 'punk')      craftDimNote = buildPunkDimBlock(craftDimensions);
    else if (genre === 'bollywood') craftDimNote = buildBollywoodDimBlock(craftDimensions);
    else if (genre === 'cpop')      craftDimNote = buildCpopDimBlock(craftDimensions);
    else if (genre === 'amapiano')  craftDimNote = buildAmapianoDimBlock(craftDimensions);
    else if (genre === 'tvmusical') craftDimNote = buildTvmusicalDimBlock(craftDimensions);
    else if (genre === 'hiphop')    craftDimNote = buildHiphopDimBlock(craftDimensions);
    else if (genre === 'drill')     craftDimNote = buildDrillDimBlock(craftDimensions);
  }

  // EDGE MODE — lyrical permission system (gated by adult audience)
  const edgeNote = buildEdgeNote({ edgeMode, edgeTopics, ageGroup });

  // FREESTYLE MODE — verse/bar-only mode (no hook, no chorus)
  const freestyleNote = freestyleMode
    ? `\n\nFREESTYLE MODE ACTIVE — NO HOOK, NO CHORUS:
- Write verses/bars ONLY — NO [Chorus], NO [Hook], NO [Pre-Chorus], NO repeated refrain section
- Structure: [Intro Bars] → [Verse 1] → [Verse 2] → [Verse 3] → [Outro Bars] (or cypher-style stacked verses)
- Each verse is a self-contained bar-run that develops the topic without returning to a hook refrain
- Punchlines land on bar 4, bar 8, bar 12, bar 16 of each verse — internal structure carries the dopamine, not a chorus
- No refrain, no singalong moment — this is pure lyrical display / bar-for-bar craft
- For hip-hop/rap: treat as a freestyle cypher — each verse escalates in density, rhyme complexity, or subject matter
- For rock/punk/altrock: treat as a through-composed rant with no returning section
- The SONG PROMPT should still describe the beat/production — "beats and bars" means the track still has a beat, just no sung hook
- Do NOT write a TITLE hook — the title can be a thematic phrase or a punchline from one of the verses`
    : '';

  const topic = sanitizeInput(rawTopic);
  const mood = sanitizeInput(rawMood);
  const vocal = sanitizeInput(rawVocal);

  const genreLabel = GENRE_LABELS[genre] || genre;
  const structStr = STRUCTURES[structure] || STRUCTURES.standard;

  // Bible notes
  const bibleNote = GENRE_BIBLE[genre] ? `\nGenre DNA: ${GENRE_BIBLE[genre].dna}` : '';
  const counterNote = GENRE_BIBLE[genre]?.counter
    ? `\nCounter-melody device for this genre: ${GENRE_BIBLE[genre].counter.device} — ${GENRE_BIBLE[genre].counter.does} Include this in the COUNTERMELODY section and embed it in the SONG PROMPT.`
    : '';

  // Outlier songs
  const genreOutliers = GENRE_BIBLE[genre]?.outliers;
  const outlierSongsNote = genreOutliers?.length
    ? `\n\nRULE-BREAKING PERMISSION — Famous ${genreLabel} songs that broke the rules and still hit:\n${genreOutliers.map(o => `• ${o.song}: broke "${o.rule}" → ${o.result}`).join('\n')}\nThese prove: genre rules are starting points, not ceilings. If the emotional truth demands it, break a rule.`
    : '';

  // Music theory
  const modeDef = mode !== 'auto' ? MUSIC_THEORY_BIBLE.modes[mode] : null;
  const genreScales = MUSIC_THEORY_BIBLE.genreScales[genre] || [];
  const eligibleOutliers = Object.values(MUSIC_THEORY_BIBLE.outlierChords)
    .filter(o => o.genres.includes(genre))
    .sort((a, b) => b.tension - a.tension);
  const outlierCount = theoryLevel === 'avantgarde' ? 2 : theoryLevel === 'adventurous' ? 1 : 0;
  const chosenOutliers = eligibleOutliers.slice(0, outlierCount);
  const theoryNote = `
MUSIC THEORY CONTEXT (apply to CHORD PROGRESSION and THEORY ANALYSIS sections):
- Scale palette for ${genreLabel}: ${genreScales.join(', ') || 'Major / Minor diatonic'}
${modeDef ? `- Specified mode override: ${modeDef.name} — ${modeDef.feel}` : '- Mode: Use genre-appropriate default'}
- Harmony level: ${MUSIC_THEORY_BIBLE.theoryLevels[theoryLevel]?.label || 'Standard'} — ${MUSIC_THEORY_BIBLE.theoryLevels[theoryLevel]?.desc || 'Diatonic harmony'}
${chosenOutliers.length ? `- Include these harmonic outliers:\n${chosenOutliers.map(o => `  • ${o.name} (${o.short}): ${o.feel} — HOW: ${o.howto}`).join('\n')}` : '- Use standard diatonic harmony — no outlier chords required'}
- THEORY ANALYSIS section is REQUIRED: identify the scale/mode used, flag any outlier chords with explanation, describe the most interesting voice-leading move, and rate overall harmonic tension (1-10).`;

  // Substyle
  const substyleDetail = substyle && SUBSTYLE_NOTES[substyle] ? `\n${SUBSTYLE_NOTES[substyle]}` : '';
  const substyleNote = substyle ? `\nSub-style: ${substyle} — write flow, density, and aesthetic accordingly.${substyleDetail}` : '';
  const substyleSunoTag = substyle && SUBSTYLE_SUNO[substyle] ? SUBSTYLE_SUNO[substyle] : null;
  const substyleSunoLock = substyleSunoTag
    ? `\n\n⚠️ PRODUCTION LOCK — ${substyle}: The SONG PROMPT Full prompt MUST contain these exact production tags: "${substyleSunoTag}" — do NOT substitute generic ${genre} production tags. This substyle overrides the default genre production.`
    : '';

  // Voice profile
  const voiceNote = (voice.name || voice.influences || voice.forbidden)
    ? `\n\nARTIST VOICE: ${voice.name ? `Write as ${voice.name}.` : ''} ${voice.influences ? `Lyric influences: ${voice.influences}.` : ''} ${voice.forbidden ? `NEVER use these phrases: ${voice.forbidden}.` : ''}`
    : '';

  // Album context
  const albumNote = albumTrack
    ? `\n\nALBUM CONTEXT: This song is the "${albumTrack.type}" on the album "${albumTrack.album}". Its role: ${albumTrack.role}. The album's emotional arc: ${albumTrack.arc}. Write it so it fits cohesively within that album story.`
    : '';

  // Age group note
  let ageNote = '';
  if (ageGroup && AGE_GROUPS[ageGroup]) {
    const ag = AGE_GROUPS[ageGroup];
    // If toddler/kids, override to children's rules regardless of genre selected
    const isChildAudience = (ageGroup === 'toddler' || ageGroup === 'kids');
    ageNote = `\n\nAGE TARGET — Writing for ${ag.label}:
- Vocabulary: ${ag.vocab}
- Themes: ${ag.themes}
- Structure: ${ag.structure}
- Rules: ${ag.rules}${isChildAudience ? `\n- Production style: ${ag.sunoHint}` : ''}
IMPORTANT: Tailor ALL lyrics, vocabulary, themes, and emotional content to be age-appropriate for ${ag.label}. Override any adult themes from the topic with age-appropriate equivalents.`;
  }

  // Genre-specific notes
  let genreSpecificNote = '';
  if (genre === 'hiphop') genreSpecificNote = `\n\nHIP-HOP VERSE RULES (non-negotiable):\n- 1 bar = 1 line. Write EXACTLY the bar count in the structure.\n- 4-bar internal structure per verse: bars 1-4 establish scene, bars 5-8 develop, bars 9-12 complicate, bar 16 = punchline/payoff.\n- Ad-libs in parentheses on the same line.\n- [Triplet Flow] = rapid 3-syllable groups. [Double Time] = twice the syllables per bar.\n- Internal rhymes every 2-3 syllables add density on top of end rhymes.`;
  else if (genre === 'parody') genreSpecificNote = `\n\nPARODY RULES (non-negotiable):\n- Music must be 100% sincere. Comedy lives ENTIRELY in lyrics.\n- Establish absurd premise in first 4 lines of verse 1.\n- Rule of threes: setup, setup, subvert.\n- Specificity is the engine: proper nouns, numbers, brand names.\n- Chorus must be funniest part AND most singable.`;
  else if (genre === 'comedy') genreSpecificNote = `\n\nCOMEDY RULES (non-negotiable):\n- Three-act joke arc: V1=premise, V2=escalation, Bridge=most unhinged, Final Chorus=payoff.\n- Final line of entire song is THE punchline.\n- Escalation: each verse funnier than the last.\n- Genre plays completely straight — comedy is lyrical only.`;
  else if (genre === 'neosoul') genreSpecificNote = `\n\nNEO-SOUL RULES:\n- Groove arrives BEFORE the vocal — 8-bar intro feel.\n- Leave space: rests between phrases ARE the music.\n- Ad-libs carry equal emotional weight. Mark with (ad-lib).\n- Outro vamp MUST escalate — minimum 4 cycling lines.`;
  else if (genre === 'gospel') genreSpecificNote = `\n\nGOSPEL RULES:\n- Call-and-response: write Lead and Response. Format: "Lead line — (Response)".\n- Testimony arc: I WAS → God MOVED → NOW I AM.\n- Bridge is CLIMAX, not chorus. Write 4-8 vamp lines.\n- Outro vamp is 80% of emotional impact — never cut short.`;
  else if (genre === 'children') genreSpecificNote = `\n\nCHILDREN'S RULES:\n- Singability above all: max 8 words in hook, melody under 1 octave.\n- Repetition is a feature — chorus 3-4x minimum.\n- Embed motion cues: clap, stomp, jump, spin.\n- Never condescend — write UP to imagination.`;
  else if (genre === 'tvmusical') genreSpecificNote = `\n\nTV/MUSICAL RULES:\n- Every song has a DRAMATIC FUNCTION.\n- Characters sing because dialogue is insufficient.\n- "I want" structure in verse 1/chorus 1.\n- Reprise principle: same melody, changed lyrics = devastating.`;

  // Hook style
  // Freestyle mode overrides hook style entirely — no hook at all
  const resolvedHookStyle = freestyleMode ? null : ((hookStyle && hookStyle !== 'auto') ? hookStyle : null);
  const hookNote = resolvedHookStyle && HOOK_STYLE_NOTES[resolvedHookStyle] ? `\n\n${HOOK_STYLE_NOTES[resolvedHookStyle]}` : '';

  // Blend
  let blendNote = '';
  if (blend.genre2 || blend.style2) {
    const g2Label = GENRE_LABELS[blend.genre2] || blend.genre2;
    const parts = [];
    if (blend.genre2) parts.push(g2Label + ' genre elements');
    if (blend.style2) parts.push(blend.style2 + ' writing style');
    const ratio = blend.ratio || 70;
    blendNote = `\n\nSECONDARY STYLE BLEND (${100-ratio}% influence):\nApply ${parts.join(' and ')} as a secondary layer.\nPrimary genre (${ratio}%): core structure, rhythm, production.\nSecondary (${100-ratio}%): lyric approach, vocal delivery, thematic texture.`;
  }

  // Era map
  const eraMap = {
    classic: 'Classic (pre-1980) — analog warmth, live band, raw delivery',
    vintage: 'Vintage (1980–1999) — synth pads, drum machines, MTV-era hooks',
    modern: 'Modern (2000–2015) — polished, digital sheen, chart-ready',
    contemporary: 'Contemporary (2016–2022) — lo-fi textures, trap hi-hats, streaming dynamics',
    current: 'Current (2023–Now) — hyperpop edges, AI-era production, ultra-compressed'
  };
  const lengthMap = {
    short: 'Short (~2 min, ~2 verses + chorus)',
    medium: 'Medium (~3 min, standard structure)',
    long: 'Long (~4 min, full structure with bridge)',
    extended: 'Extended (~5+ min, full epic structure)'
  };

  const system = buildGenreAgentSystem(genre);

  // Section archetypes — genre-weighted + randomised every generation.
  // Each uses the genre's preferred list 70% of the time (biased toward most
  // canonical choice); 30% fully random for surprise / rule-breaking.
  const _gsd = GENRE_SECTION_DNA[genre] || {};
  const _ba  = pickWeightedArchetype(BRIDGE_ARCHETYPES,     _gsd.bridge?.preferred_bridge);
  const _oa  = pickWeightedArchetype(OUTRO_ARCHETYPES,      _gsd.bridge?.preferred_outro);
  const _v2a = pickWeightedArchetype(VERSE2_ARCHETYPES,     _gsd.bridge?.preferred_verse2);
  const _pca = pickWeightedArchetype(PRE_CHORUS_ARCHETYPES, _gsd.bridge?.preferred_prechorus);
  const _poa = pickWeightedArchetype(POST_CHORUS_ARCHETYPES,_gsd.bridge?.preferred_postchorus);

  // Hook structural variation (separate from delivery style — picked randomly)
  const _hookStructKeys = Object.keys(HOOK_STRUCTURE_NOTES).filter(k => k !== 'auto');
  const _hookStructKey  = _hookStructKeys[Math.floor(Math.random() * _hookStructKeys.length)];
  const _hookStructNote = HOOK_STRUCTURE_NOTES[_hookStructKey] || '';

  const _harmonicLine  = _gsd.bridge?.harmonic  ? `\nHarmonic approach: ${_gsd.bridge.harmonic}`  : '';
  const _counterLine   = _gsd.bridge?.counter   ? `\nCounter-melody role: ${_gsd.bridge.counter}` : '';
  const _examplesLine  = _gsd.bridge?.examples  ? `\nReal-world models: ${_gsd.bridge.examples}`  : '';

  const bridgeNote = `\n\nBRIDGE ARCHITECTURE — "${_ba.name}" [${genreLabel}]:${_harmonicLine}${_counterLine}
Energy arc: ${_ba.energy} · Bars: ${_ba.bars}
Delivery: ${_ba.delivery}
Lyric approach: ${_ba.lyric}
Production: ${_ba.production}
Rule: ${_ba.rule}${_examplesLine}`;

  const outroNote = `\n\nOUTRO APPROACH — "${_oa.name}":
${_oa.rule}`;

  const verse2Note = `\n\nVERSE 2 STRATEGY — "${_v2a.name}":
${_v2a.rule}`;

  const preChorusNote = `\n\nPRE-CHORUS ARCHITECTURE — "${_pca.name}" [${genreLabel}]:
Energy arc: ${_pca.energy} · Bars: ${_pca.bars}
Delivery: ${_pca.delivery}
Lyric approach: ${_pca.lyric}
Production: ${_pca.production}
Rule: ${_pca.rule}`;

  const postChorusNote = `\n\nPOST-CHORUS / POWER PART — "${_poa.name}" [${genreLabel}]:
Energy arc: ${_poa.energy} · Bars: ${_poa.bars}
Delivery: ${_poa.delivery}
Lyric approach: ${_poa.lyric}
Production: ${_poa.production}
Rule: ${_poa.rule}`;

  const hookStructNote = _hookStructNote ? `\n\n${_hookStructNote}` : '';

  // ── Rhyme scheme injection ──────────────────────────────────────────────
  const _rhymePref = GENRE_RHYME_PREF[genre] || ['AABB','ABAB','Slant'];
  const _rhemeKey  = Math.random() < 0.7
    ? _rhymePref[Math.floor(Math.random() * _rhymePref.length)]
    : Object.keys(RHYME_SCHEMES)[Math.floor(Math.random() * Object.keys(RHYME_SCHEMES).length)];
  const rhymeNote  = `\n\nRHYME SCHEME: ${_rhemeKey}\n${RHYME_SCHEMES[_rhemeKey] || ''}`;

  // ── Era vocabulary injection ────────────────────────────────────────────
  const _eraVoc = ERA_VOCABULARY[era];
  const eraVocNote = _eraVoc
    ? `\n\nERA ANCHORS (${_eraVoc.label}): Weave 2-3 of these into the lyrics to lock the song in its era: ${_eraVoc.anchors.slice(0,8).join(', ')}. Forbidden anachronisms: ${_eraVoc.forbidden.slice(0,5).join(', ')}.`
    : '';

  // ── Key psychology injection ────────────────────────────────────────────
  const _keyPsych = MUSIC_THEORY_BIBLE.keyPsychology;
  const _keyPool  = Object.keys(_keyPsych);
  const _chosenKey = _keyPool[Math.floor(Math.random() * _keyPool.length)];
  const _kp = _keyPsych[_chosenKey];
  const keyPsychNote = `\n\nSUGGESTED KEY PSYCHOLOGY: ${_chosenKey} — ${_kp.feel} Tension: ${_kp.tension}, Brightness: ${_kp.bright}/10. Use this key's emotional character to shape the production brief.`;

  // ── Emotional arc injection ─────────────────────────────────────────────
  const _arcData = EMOTIONAL_ARCS[emotionalArc];
  const emotionalArcNote = _arcData
    ? `\n\nEMOTIONAL ARC — "${_arcData.name}":\n${_arcData.arc}`
    : '';

  // ── Seed line injection ─────────────────────────────────────────────────
  const _cleanSeed = seedLine ? sanitizeInput(seedLine, 120) : '';
  const seedLineNote = _cleanSeed
    ? `\n\nSEED LINE (build the entire song around this line): "${_cleanSeed}" — This is the anchor. Every chorus, every verse must orbit this line. It MUST appear verbatim, word-for-word, unedited, as the opening or closing line of the chorus. This is non-negotiable. Do not paraphrase, do not alter a single word.`
    : '';

  // ── Syllable budget ─────────────────────────────────────────────────────
  const _sylBudget  = GENRE_SYLLABLE_BUDGETS[genre] || { verse:'8–13', chorus:'6–10', hook:'4–7', bridge:'6–10', prechorus:'6–9' };
  const _capNote    = syllableCap > 0 ? ` HARD CAP: no line may exceed ${syllableCap} syllables — enforce strictly.` : '';
  const syllableNote = `\n\nSYLLABLE BUDGET:\n- Hook (title/refrain line): ${_sylBudget.hook || '4–7'} syllables — keep it singable and memorable\n- Verse lines: ${_sylBudget.verse} syllables\n- Chorus lines: ${_sylBudget.chorus} syllables\n- Pre-chorus lines: ${_sylBudget.prechorus} syllables\n- Bridge lines: ${_sylBudget.bridge} syllables${_capNote}`;

  // ── Production brief data ───────────────────────────────────────────────
  const _fxProfile  = GENRE_FX_PROFILES[genre]  || {};
  const _plugins    = GENRE_PLUGIN_CHAINS[genre] || {};
  const _mastering  = MASTERING_TARGETS[genre]   || {};
  const productionContextNote = (_fxProfile.reverb || _mastering.lufs) ? `\n\nPRODUCTION REFERENCE DATA (use this to populate the PRODUCTION BRIEF sections below):
FX: Reverb — ${_fxProfile.reverb||'medium hall'}; Delay — ${_fxProfile.delay||'1/4 note'}; Compression — ${_fxProfile.compression||'standard VCA'}; EQ — ${_fxProfile.eq||'high-pass + air shelf'}; Sidechain — ${_fxProfile.sidechain||'light kick ducking'}
PLUGINS (free): ${(_plugins.free||[]).slice(0,3).join(', ')}
PLUGINS (paid): ${(_plugins.paid||[]).slice(0,3).join(', ')}
MASTERING: ${_mastering.lufs||'-14 LUFS'} · ${_mastering.dynamicRange||'DR 8–10'} · ${_mastering.brightness||'natural'} · ${_mastering.notes||''}` : '';

  // ── Dual perspective (antagonist POV in Verse 2) ────────────────────────
  const dualPerspNote = dualPerspective
    ? `\n\nDUAL PERSPECTIVE RULE: Verse 2 MUST be written from the antagonist's or opposite perspective. If Verse 1 is the protagonist's longing, Verse 2 is the other person's detachment. If Verse 1 is anger, Verse 2 is the accused person's justification. This creates dramatic tension and forces the listener to hold two truths simultaneously.`
    : '';

  // ── Pattern avoidance ───────────────────────────────────────────────────
  const avoidNote = avoidPatterns && avoidPatterns.length > 0
    ? `\n\nPATTERN AVOIDANCE: These opening lines were used recently — do NOT start any verse with similar phrasing or imagery: ${avoidPatterns.map(p => `"${p}"`).join(', ')}. Find a completely fresh entry point.`
    : '';

  // ── Platform-specific instructions ─────────────────────────────────────
  const platformNotes = {
    suno:   'PLATFORM: Suno — Use bracket tags precisely: [Verse 1], [Chorus], [Bridge], [Pre-Chorus], [Outro]. Keep SONG PROMPT under 200 characters for best results. Use [Instrumental] for gaps. Suno reads bracket tags as structural cues.',
    udio:   'PLATFORM: Udio — Section tags work differently: Udio responds well to emotional descriptors in brackets, e.g. [Verse - melancholic], [Chorus - anthemic]. Keep SONG PROMPT under 300 characters. Udio prefers genre descriptors over instrument lists.',
    stable: 'PLATFORM: Stable Audio — Optimise the SONG PROMPT as a single dense style description (no brackets needed in lyrics for Stable Audio). Focus the style prompt on texture, mood, and instrumentation — it processes audio descriptions, not musical structure tags.',
  };
  const platformNote = platformNotes[platform] || platformNotes.suno;

  // ── Specificity self-check instruction ─────────────────────────────────
  const specificityNote = `\n\nSPECIFICITY MANDATE: After writing the lyrics, review every abstract or vague word. Replace "feel," "love," "pain," "heart," "tears" with concrete sensory images. "My heart aches" → "I'm pressing your old sweater to my face." "I feel lost" → "I've been driving the same block for an hour." Abstract words are placeholders — replace every one.`;

  const platinumNote = platinum ? buildTopTierNote(genre) : '';
  const adlibNote = buildAdlibNote(genre);
  const vocalStackNote = buildVocalStackNote(genre);

  const prompt = `Write a complete, production-ready ${genreLabel} song at the highest possible level of craft.

Genre: ${genreLabel}
Topic: ${topic}
Mood: ${mood}
Vocal style: ${vocal}
Structure: ${structStr}
Quality target: ${quality}
Era: ${eraMap[era] || eraMap.modern}
Song length: ${lengthMap[length] || lengthMap.medium}${substyleNote}${substyleSunoLock}${bibleNote}${counterNote}${outlierSongsNote}${theoryNote}${blendNote}${albumNote}${ageNote}${edgeNote}${freestyleNote}${genreSpecificNote}${craftDimNote}${hookNote}${hookStructNote}${voiceNote}${emotionalArcNote}${seedLineNote}

SONGWRITING RULES:
- FIRST LINE RULE: The very first line of Verse 1 must drop immediately into a specific sensory image, action, or confession. No scene-setting, no "I remember when", no establishing shots. Earn attention in line 1.
- Hook must arrive within 30 seconds
- Chorus lines: maximum 10 syllables each for singability
- Verse lines: 8-13 syllables, consistent within each verse
- Every line must be specific — no vague emotions, no clichés
- Use the Zeigarnik effect: leave one phrase slightly open-ended per chorus
- Dynamic contrast: verse energy should be noticeably lower than chorus
- The last chorus must feel bigger than the first
- GENRE PURITY: Every chorus MUST include at least one genre-specific production tag in brackets (e.g. [Build], [Drop], [Trap Hi-Hat], [Steel Guitar], [Choir], [808 Bass]) — this signals genre DNA to the AI platform
- LYRICS LENGTH RULE: Total lyrics (all sections combined) must stay under 5000 characters — this is the maximum the Suno lyrics field accepts. Count every character including section tags like [Verse 1]. Write a complete, high-quality song within this limit.
- NO EM DASHES: Never use em dashes (—) anywhere in the lyrics. End lines with a word, not a dash. For pauses use a comma or ellipsis (...). For connective phrasing use a comma. Em dashes break Suno's text parsing.${syllableNote}${rhymeNote}${eraVocNote}${keyPsychNote}${dualPerspNote}${avoidNote}${specificityNote}${preChorusNote}${bridgeNote}${verse2Note}${postChorusNote}${outroNote}${platinumNote}${adlibNote}
- ${bracketInstructionServer(genre, bracketMode, substyle)}
- ${platformNote}

HOOK SELF-CHECK: After writing the chorus, verify: (1) Is the title or central phrase present? (2) Could a stranger hum this after one listen? (3) Does it say something specific, not generic? If any answer is no — rewrite the chorus before proceeding.

Respond with EXACTLY this format — use these exact headers, nothing else:

TITLE: [song title]

VERDICT: [one sentence on why this song will connect with listeners]

HOOK ISOLATION:
[Copy the chorus lyrics here ONLY — nothing else. This is the hook in isolation for quick review.]

LYRICS:
${_cleanSeed ? '\nSEED LINE REMINDER -- this exact line MUST appear verbatim as the opening or closing line of your chorus, word-for-word, do not change any word: ' + _cleanSeed + '\n' : ''}[Write the complete song lyrics below. EACH SECTION MUST START WITH ITS BRACKET TAG ON ITS OWN LINE — e.g. [Verse 1] then the lines, [Chorus] then the lines, [Bridge] then the lines. No bracket tag = section does not exist. Every word must earn its place.]

SONG PROMPT:
Genre: [core genre + sub-genre]
Instruments: [4-5 key instruments, comma-separated]
BPM: [range, e.g. 95-100]
Vocal: [vocal descriptor]
Texture: [production texture in 5-8 words]
Counter-melody: [counter-melody device]
Full prompt: [${substyleSunoTag ? `MUST lead with these locked production tags: "${substyleSunoTag}" — then add vocal and texture descriptors. ` : ''}Assemble into one ready-to-paste string under 440 characters — NO artist names]

PRODUCTION BRIEF:
CORE PROMPT:
[Exact copy of the Full prompt line above — ready to paste]

TEMPO & KEY:
[BPM range · Suggested key · Time signature · Feel]

ARRANGEMENT BLUEPRINT:
[Section by section: what instruments enter/drop, energy shifts]

VOCAL DIRECTION:
[Delivery style per section]

SONIC REFERENCES:
[3 production reference points — no artist names, describe the sonic feel]

PLATFORM TIPS:
[3 specific actionable tips for ${platform === 'udio' ? 'Udio' : platform === 'stable' ? 'Stable Audio' : 'Suno'}]

STRUCTURE MAP:
[Each section: bar count · energy level 1-10 · emotional job]

DOPAMINE MAP:
1. [Moment · What happens · Why the brain rewards it]
2. [Second peak]
3. [Third peak]

CHORD PROGRESSION:
BPM: [exact BPM]
Key: [e.g. A minor — reason in 5 words]
Time Signature: [e.g. 4/4]
[Each section: Section name → Roman numerals (letter names) · rhythm feel]

THEORY ANALYSIS:
SCALE: [specific scale or mode used]
KEY FEEL: [2 sentences on emotional intention]
OUTLIER CHORDS: [any non-diatonic chords and function]
VOICE LEADING: [most interesting voice-leading move]
TENSION RATING: [X/10 with description]
PROGRESSION ARCHETYPE: [which archetype and why]

DIRECTOR NOTES:
1. [Production decision specific to THIS song]
2. [tip 2]
3. [tip 3]
4. [tip 4]
5. [tip 5]${vocalStackNote}

COUNTERMELODY:
DEVICE: [specific counter-melodic instrument/voice]
WHAT IT DOES: [one sentence]
HOW TO PROMPT: [exact Suno/Udio phrase, under 60 chars]
SECTION MAP: [which sections and how it evolves]

VISUAL PROMPT:
[Write a single ready-to-paste image prompt for Midjourney, DALL-E or Firefly. ONE sentence: visual mood, setting, 2-3 key colors, art style. Under 200 chars. No faces, no text in image.]

VIDEO PROMPT:
[Write a single ready-to-paste video concept for Sora, Runway or Kling. ONE sentence: setting, visual action, camera movement, color grade, mood. Under 200 chars.]`;

  return { system, prompt };
}

function buildLuckyPrompt(params) {
  const keys = Object.keys(FUSION_DATA);
  const rawG1 = params && params.g1 ? sanitizeInput(params.g1, 50) : null;
  const rawG2 = params && params.g2 ? sanitizeInput(params.g2, 50) : null;
  // Try exact key first, then reverse order (handles either direction client may send)
  let key = null;
  if (rawG1 && rawG2) {
    const fwd = rawG1 + '+' + rawG2;
    const rev = rawG2 + '+' + rawG1;
    key = FUSION_DATA[fwd] ? fwd : FUSION_DATA[rev] ? rev : fwd; // fwd fallback still uses those genres
  }
  if (!key) key = pickRandom(keys);
  const [g1, g2] = key.split('+');
  const fd = FUSION_DATA[key];
  // Honour client-picked values so reveal UI matches generated song exactly
  const topic     = (params && params.topic)     ? sanitizeInput(params.topic, 100)     : pickRandom(LUCKY_TOPICS);
  const mood      = (params && params.mood)      ? sanitizeInput(params.mood, 100)      : pickRandom(LUCKY_MOODS);
  const structure = (params && params.structure) ? sanitizeInput(params.structure, 50)  : pickRandom(LUCKY_STRUCTURES);
  const vocal     = (params && params.vocal)     ? sanitizeInput(params.vocal, 100)     : pickRandom(LUCKY_VOCALS);
  const platinum  = !!(params && params.platinum);
  const structStr = STRUCTURES[structure] || STRUCTURES.standard;
  const adlibNote = buildAdlibNote(g1);
  const vocalStackNote = buildVocalStackNote(g1);

  // Outlier injection
  const o1 = GENRE_BIBLE[g1]?.outliers;
  const o2 = GENRE_BIBLE[g2]?.outliers;
  const outlierNote = [
    o1?.length ? `Rule-breakers in ${g1}: ${o1.map(o => `${o.song} (${o.rule})`).join(' | ')}` : null,
    o2?.length ? `Rule-breakers in ${g2}: ${o2.map(o => `${o.song} (${o.rule})`).join(' | ')}` : null
  ].filter(Boolean).join('\n');

  // For fusion, use the primary genre's agent as base if available, else fallback
  const system = GENRE_AGENTS[g1]
    ? buildGenreAgentSystem(g1).replace(
        /^You are a world-class .+ songwriter/,
        `You are a world-class ${(GENRE_LABELS[g1]||g1)} × ${(GENRE_LABELS[g2]||g2)} fusion songwriter`
      )
    : 'You are an expert songwriter, neuroscientist of music, and AI music production specialist. Write complete, emotionally authentic, production-ready songs. Respond with the exact format requested. No extra commentary.';

  // ── Production brief data for Lucky (primary genre) ────────────────────
  const _fxPL  = GENRE_FX_PROFILES[g1]  || GENRE_FX_PROFILES[g2]  || {};
  const _plPL  = GENRE_PLUGIN_CHAINS[g1] || GENRE_PLUGIN_CHAINS[g2] || {};
  const _mstPL = MASTERING_TARGETS[g1]  || MASTERING_TARGETS[g2]  || {};
  const luckyProductionNote = (_fxPL.reverb || _mstPL.lufs) ? `\n\nPRODUCTION REFERENCE DATA (use to populate PRODUCTION BRIEF sections):
FX: Reverb — ${_fxPL.reverb||'medium hall'}; Delay — ${_fxPL.delay||'1/4 note'}; Compression — ${_fxPL.compression||'standard VCA'}; EQ — ${_fxPL.eq||'high-pass + air shelf'}; Sidechain — ${_fxPL.sidechain||'light kick ducking'}
PLUGINS (free): ${(_plPL.free||[]).slice(0,3).join(', ')}
PLUGINS (paid): ${(_plPL.paid||[]).slice(0,3).join(', ')}
MASTERING: ${_mstPL.lufs||'-14 LUFS'} · ${_mstPL.dynamicRange||'DR 8–10'} · ${_mstPL.brightness||'natural'} · ${_mstPL.notes||''}` : '';

  const prompt = `Write a complete ${g1} × ${g2} fusion song at the highest possible level of craft.

Fusion style: ${fd?.name || g1 + ' × ' + g2}
${fd?.name ? 'Fusion style: ' + fd.name : 'Blend both genres authentically.'}
Topic: ${topic}
Mood: ${mood}
Vocal style: ${vocal}
Structure: ${structStr}${outlierNote ? `\n\nRULE-BREAKING INSPIRATION:\n${outlierNote}\nUse these as permission: if the emotional truth demands it, break a rule.` : ''}

SONGWRITING RULES:
- Hook within 30 seconds · Chorus max 10 syllables · Verse 8-13 syllables
- Specific imagery only — no clichés · Zeigarnik effect in chorus
- Dynamic contrast: verse lower energy than chorus
- Bridge must be a new perspective · Last chorus bigger than first
- Every section MUST start with its bracket tag on its own line.
- LYRICS LENGTH RULE: Total lyrics under 5000 characters — Suno's maximum. Includes all section tags. Complete song, within the limit.
- NO EM DASHES: Never use em dashes (—) in lyrics. Use commas or ellipsis instead.${platinum ? buildTopTierNote(g1, g2) : ''}${adlibNote}

Respond with EXACTLY this format:

TITLE: [song title]

VERDICT: [one sentence on why this song will connect]

HOOK ISOLATION:
[Copy the chorus lyrics here ONLY — nothing else. This is the hook in isolation for quick review.]

LYRICS:
[Write the complete song lyrics. EVERY SECTION MUST START WITH ITS BRACKET TAG ON ITS OWN LINE.]

SONG PROMPT:
[Under 440 chars. Core genre + sub-genre feel, key instruments (4-5), BPM range, tempo feel, vocal descriptor, production texture, counter-melody device. NO artist names.]

PRODUCTION BRIEF:
CORE PROMPT:
[Exact copy of SONG PROMPT]

TEMPO & KEY:
[BPM range · Key · Time sig · Feel]

ARRANGEMENT BLUEPRINT:
[Section by section instrument/energy breakdown]

VOCAL DIRECTION:
[Delivery style per section]

SONIC REFERENCES:
[3 sonic reference points — no artist names]

PLATFORM TIPS:
[3 actionable tips for AI music platforms]

STRUCTURE MAP:
[Each section: bar count · energy 1-10 · emotional job]

DOPAMINE MAP:
1. [First peak · what happens · why it works]
2. [Second peak]
3. [Third peak]

DIRECTOR NOTES:
1. [Production decision specific to THIS song]
2. [tip 2]
3. [tip 3]
4. [tip 4]
5. [tip 5]${vocalStackNote}

COUNTERMELODY:
DEVICE: [specific counter-melodic instrument/voice]
WHAT IT DOES: [one sentence]
HOW TO PROMPT: [exact Suno/Udio phrase, under 60 chars]
SECTION MAP: [which sections and how it evolves]

VISUAL PROMPT:
[Write a single ready-to-paste image prompt for Midjourney, DALL-E or Firefly. ONE sentence: visual mood, setting, 2-3 key colors, art style. Under 200 chars. No faces, no text in image.]

VIDEO PROMPT:
[Write a single ready-to-paste video concept for Sora, Runway or Kling. ONE sentence: setting, visual action, camera movement, color grade, mood. Under 200 chars.]`;

  return {
    system,
    prompt,
    meta: { g1, g2, topic, mood, vocal, structure, fd, fusionName: fd?.name || g1 + ' × ' + g2 }
  };
}

// ── RAP STYLES ───────────────────────────────────────────────────────────────
// 24 styles: 14 established + 5 forward-looking + 5 revisionist
// Each style has a specialist agent persona and default dimension values
const RAP_STYLES = {
  // ─ Established ─────────────────────────────────────────────────────────────
  trap: {
    label: 'Trap', category: 'established', era: '2010s–Now',
    agent: 'You are a trap music architect. You understand that the 808 bass IS the melody. Flow rides the hi-hat subdivisions. Lyrics prioritize atmosphere and feeling over narrative density. You use space deliberately — silence is as weighted as sound.',
    defaults: { flow: 'syncopated', rhymeArch: 'end-only', density: 'medium', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  'boom-bap': {
    label: 'Boom Bap', category: 'established', era: '1990s–Present',
    agent: 'You are a boom bap purist and lyrical architect. The 90/70 BPM boom-bap loop is a stage for wordcraft. You write bars that work at multiple levels — the surface meaning and the deeper reading. Every metaphor must be earned. The beat is the canvas, the lyric is the painting.',
    defaults: { flow: 'on-beat', rhymeArch: 'multi-syllabic', density: 'dense', vocabRegister: 'conscious-literary', persona: 'first-person-raw' }
  },
  conscious: {
    label: 'Conscious Rap', category: 'established', era: '1990s–Present',
    agent: 'You are a conscious rap philosopher-poet. Every bar serves a larger argument. You use hip-hop\'s full rhetorical toolkit — extended metaphor, irony, intertextual reference, call-and-response. Your job is to make the listener think harder than they expected to.',
    defaults: { flow: 'on-beat', rhymeArch: 'internal', density: 'dense', vocabRegister: 'conscious-literary', persona: 'omniscient' }
  },
  mumble: {
    label: 'Mumble Rap', category: 'established', era: '2015–Present',
    agent: 'You are a mumble rap melody architect. Understand that "mumble" is a misnomer — this is melodic phonetic rap where the sound and rhythm of words matter more than dictionary meaning. You compose with syllables as notes. The vocal texture is the hook.',
    defaults: { flow: 'syncopated', rhymeArch: 'end-only', density: 'sparse', vocabRegister: 'minimal-phonetic', persona: 'first-person-raw' }
  },
  drill: {
    label: 'Drill', category: 'established', era: '2010s–Present',
    agent: 'You are a drill music specialist. Sliding 808s, dark sliding melodies, and a cold unflinching delivery are the genre\'s DNA. Flow slides behind the beat. Lyrics carry a documentary menace — specificity of place, consequence, and reality. No sentimentality.',
    defaults: { flow: 'behind-beat', rhymeArch: 'end-only', density: 'medium', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  'cloud-rap': {
    label: 'Cloud Rap', category: 'established', era: '2010s–Present',
    agent: 'You are a cloud rap atmosphere designer. Hazy production, introspective vulnerability, and a dreamlike delivery. Flow is loose, conversational, unhurried. The goal is emotional texture — not narrative density. You write feelings not facts.',
    defaults: { flow: 'conversational', rhymeArch: 'slant', density: 'sparse', vocabRegister: 'abstract-surreal', persona: 'first-person-raw' }
  },
  crunk: {
    label: 'Crunk', category: 'established', era: '2000s',
    agent: 'You are a crunk energy architect. Maximum kinetic energy. Chanted hooks. Call and response. Four-on-the-floor feels. The entire track is designed to make a room lose its mind. You write for the crowd not the headphones.',
    defaults: { flow: 'on-beat', rhymeArch: 'end-only', density: 'medium', vocabRegister: 'street-coded', persona: 'collective-we' }
  },
  'g-funk': {
    label: 'G-Funk', category: 'established', era: '1990s',
    agent: 'You are a G-funk master. P-Funk samples slowed to a west coast crawl. Whiny synthesizer melodies over laid-back grooves. Lyrics are narrative — you tell stories from the block with cinematic detail. Flow is relaxed, deliberate, confident.',
    defaults: { flow: 'behind-beat', rhymeArch: 'end-only', density: 'medium', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  gangsta: {
    label: 'Gangsta Rap', category: 'established', era: '1990s–Present',
    agent: 'You are a gangsta rap chronicler. Documentary lyricism — the specificity of the report, the weight of the witness. You write with the emotional truth of lived experience translated into bars. The violence is consequence not spectacle. The story is the morality.',
    defaults: { flow: 'on-beat', rhymeArch: 'end-only', density: 'dense', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  'east-coast': {
    label: 'East Coast', category: 'established', era: '1990s–Present',
    agent: 'You are an East Coast rap lyricist trained in the New York tradition. Jazzy samples, complex internal rhyme schemes, wordplay as intellectual sport. The city is a character. Every metaphor earns its placement. You build verses that reveal new layers on each listen.',
    defaults: { flow: 'on-beat', rhymeArch: 'internal', density: 'dense', vocabRegister: 'conscious-literary', persona: 'first-person-raw' }
  },
  'west-coast': {
    label: 'West Coast', category: 'established', era: '1990s–Present',
    agent: 'You are a West Coast rap stylist. Laid-back grooves, extended narratives, sun-soaked production. You write with cinematic vision — verses that play like movie scenes. Confidence and ease are the emotional baseline. The storytelling is the flex.',
    defaults: { flow: 'behind-beat', rhymeArch: 'end-only', density: 'medium', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  southern: {
    label: 'Southern Rap', category: 'established', era: '1990s–Present',
    agent: 'You are a Southern rap flow master. The drawl IS the music. Cadence stretches vowels across bars. Trunk-rattling 808s, slow double-time flows, and regional pride. You write with the full breadth of the South — Atlanta, Houston, New Orleans, Miami — each with its own sonic identity.',
    defaults: { flow: 'syncopated', rhymeArch: 'end-only', density: 'medium', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  horrorcore: {
    label: 'Horrorcore', category: 'established', era: '1990s–Present',
    agent: 'You are a horrorcore conceptualist. Dark surrealism, psychological horror, and extreme imagery used as metaphor for internal states. The horror is a container for genuine emotion — fear, self-destruction, social alienation. Every disturbing image should have an emotional truth beneath it.',
    defaults: { flow: 'on-beat', rhymeArch: 'multi-syllabic', density: 'dense', vocabRegister: 'abstract-surreal', persona: 'character' }
  },
  'alt-rap': {
    label: 'Alternative Rap', category: 'established', era: '1990s–Present',
    agent: 'You are an alternative rap experimentalist. You refuse the genre\'s own conventions while remaining fully inside its tradition. Unusual samples, unconventional structures, genre contamination, and lyrical surrealism. The mainstream is a map you deliberately fold in unexpected ways.',
    defaults: { flow: 'conversational', rhymeArch: 'mosaic', density: 'medium', vocabRegister: 'abstract-surreal', persona: 'omniscient' }
  },
  // ─ Forward-Looking ──────────────────────────────────────────────────────────
  'hyper-trap': {
    label: 'Hyper-Trap', category: 'forward', era: '2023–Future',
    agent: 'You are a hyper-trap speed architect. Hyperpop production meets trap infrastructure — everything is accelerated, glitched, and distorted beyond genre comfort zones. Vocals pitch-shift mid-bar. The 808 competes with synthesizer chaos. You write for a generation that experiences music at 2x speed.',
    defaults: { flow: 'double-time', rhymeArch: 'chain', density: 'ultra-dense', vocabRegister: 'minimal-phonetic', persona: 'first-person-raw' }
  },
  'phonk-rap': {
    label: 'Phonk Rap', category: 'forward', era: '2020s–Future',
    agent: 'You are a phonk-rap atmosphere engineer. Memphis rap\'s dark dusty samples accelerated for TikTok-era adrenaline. Cowbells. Distorted 808s. A cinematic menace that plays behind drift videos. Your bars are short, phonetically satisfying, and feel dangerous at any speed.',
    defaults: { flow: 'behind-beat', rhymeArch: 'end-only', density: 'sparse', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  'afro-trap': {
    label: 'Afro-Trap', category: 'forward', era: '2020s–Future',
    agent: 'You are an Afro-trap cultural bridge builder. West African rhythmic traditions meeting Atlanta trap production architecture. The dembow and the 808 speak the same language. You write globally, think locally, flow in multiple languages within the same bar.',
    defaults: { flow: 'syncopated', rhymeArch: 'end-only', density: 'medium', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  'emo-drill': {
    label: 'Emo Drill', category: 'forward', era: '2022–Future',
    agent: 'You are an emo-drill emotional extremist. UK drill\'s dark sliding production meets confessional Gen-Z emotional rawness. The coldness of drill and the vulnerability of emo are not opposites — they are the same wound from different angles. You write the songs that make people cry in the club.',
    defaults: { flow: 'behind-beat', rhymeArch: 'slant', density: 'medium', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  'cyber-rap': {
    label: 'Cyber Rap', category: 'forward', era: '2024–Future',
    agent: 'You are a cyber-rap futurist poet. AI-era metaphors, digital identity, simulation anxiety — these are your native subjects. Production is maximally synthetic, texturally alien, deliberately post-human. You write from inside the machine looking out at the people looking in.',
    defaults: { flow: 'double-time', rhymeArch: 'chain', density: 'ultra-dense', vocabRegister: 'academic', persona: 'second-person' }
  },
  // ─ Revisionist ──────────────────────────────────────────────────────────────
  'neo-boom-bap': {
    label: 'Neo Boom Bap', category: 'revisionist', era: 'Reimagined Classic',
    agent: 'You are a neo-boom-bap reconstructionist. You take the 90s template and run modern lyrical complexity and contemporary production through it. The sample chops are fresh, the wordplay is current, but the foundation philosophy — lyricism as the highest value — is unchanged.',
    defaults: { flow: 'on-beat', rhymeArch: 'internal', density: 'dense', vocabRegister: 'conscious-literary', persona: 'first-person-raw' }
  },
  'jazz-rap': {
    label: 'Jazz-Rap Revival', category: 'revisionist', era: 'Reimagined Classic',
    agent: 'You are a jazz-rap synthesist. The bebop vocabulary lives inside hip-hop cadences. You write bars that swing. Your vocabulary comes from both the jazz tradition and the streets. Unexpected chord samples, polyrhythmic flow patterns that feel improvised but are precisely calculated.',
    defaults: { flow: 'syncopated', rhymeArch: 'internal', density: 'dense', vocabRegister: 'conscious-literary', persona: 'first-person-raw' }
  },
  'trap-soul': {
    label: 'Trap Soul', category: 'revisionist', era: 'Reimagined Classic',
    agent: 'You are a trap soul emotionalist. R&B melodies float over trap infrastructure — the 808 and hi-hat as emotional landscape rather than just rhythm. Vulnerability and confessional lyricism inside a production framework that was built for bravado. The contrast IS the art.',
    defaults: { flow: 'syncopated', rhymeArch: 'slant', density: 'sparse', vocabRegister: 'street-coded', persona: 'first-person-raw' }
  },
  'lo-fi-rap': {
    label: 'Lo-Fi Rap', category: 'revisionist', era: 'Reimagined Classic',
    agent: 'You are a lo-fi rap intimist. Dusty samples, compressed dynamics, bedroom energy. You write with the vulnerability that only happens when the recording feels private. Every imperfection is intentional. The warmth of the tape hiss is part of the lyrical message.',
    defaults: { flow: 'conversational', rhymeArch: 'slant', density: 'sparse', vocabRegister: 'conscious-literary', persona: 'first-person-raw' }
  },
  'conscious-2': {
    label: 'Conscious 2.0', category: 'revisionist', era: 'Reimagined Classic',
    agent: 'You are a conscious rap 2.0 intellectual. The original conscious rap tradition meets 2020s urgency — climate, digital identity, algorithmic reality, mental health as political subject. You write with the urgency of someone who has studied the tradition and has something new to say inside it.',
    defaults: { flow: 'on-beat', rhymeArch: 'internal', density: 'dense', vocabRegister: 'academic', persona: 'omniscient' }
  }
};

// Flow dimension descriptions for the prompt
const FLOW_NOTES = {
  'on-beat':      'Flow lands precisely on the beat — every syllable is intentionally placed on the grid. Think declarative, assertive, boom-bap tradition.',
  'syncopated':   'Flow syncopates around the beat — accents land between the beats creating forward momentum. The rhythm breathes.',
  'triplet':      'Flow uses triplet subdivisions — three syllables per beat creating a rolling, tumbling sensation. Drake, Future, and the modern trap tradition.',
  'double-time':  'Flow doubles the perceived tempo — twice as many syllables per bar as the beat implies. Technical display, urgency, compression.',
  'conversational':'Flow is natural speech rhythm dropped over the beat — unhurried, intimate, as if thinking out loud.',
  'behind-beat':  'Flow drags slightly behind the grid — creating a heavy, weighted, languid feel. Southern rap, drill, certain trap styles.'
};
const RHYME_NOTES = {
  'end-only':       'End rhyme only — the last word of each bar rhymes. Clean, accessible, singable.',
  'internal':       'Internal rhyme scheme — rhymes occur within bars not just at the end. Creates density and momentum.',
  'multi-syllabic': 'Multi-syllabic rhymes — multiple syllables rhyme simultaneously (e.g., "motivate" / "innovate"). Technical showcase.',
  'chain':          'Chain rhyming — each bar\'s last word or sound becomes the first sound of the next internal rhyme. Continuous forward pull.',
  'mosaic':         'Mosaic rhyme — complex interlocking rhyme scheme where multiple words throughout the verse form a web. Every word load-bearing.',
  'slant':          'Slant rhyme — near-rhymes and approximate rhymes preferred over exact. More natural speech feel, less sing-song.'
};
const DENSITY_NOTES = {
  'sparse':      'Sparse delivery — few syllables per bar, heavy use of space and silence. Each word carries more weight.',
  'medium':      'Medium syllabic density — balanced between space and content. The current mainstream standard.',
  'dense':       'Dense delivery — many syllables per bar, minimal space. Information-rich, technically demanding.',
  'ultra-dense': 'Ultra-dense — maximum syllable compression, every subdivision filled. Technical extremity, requires precise enunciation.'
};
const VOCAB_NOTES = {
  'street-coded':       'Vocabulary is street-coded — slang, regional vernacular, community-specific language. Authenticity through specificity.',
  'conscious-literary': 'Vocabulary is conscious and literary — elevated diction, intertextual references, poetic technique applied to hip-hop.',
  'abstract-surreal':   'Vocabulary is abstract and surreal — unexpected metaphor combinations, dream logic, non-linear imagery.',
  'minimal-phonetic':   'Vocabulary is minimal and phonetic — chosen for sound quality over semantic meaning. The word sounds are the message.',
  'academic':           'Vocabulary is academic and analytical — precise terminology, intellectual frameworks, argumentative structure.'
};
const PERSONA_NOTES = {
  'first-person-raw':  'First person, confessional and raw — "I" as the direct speaker. Immediate, vulnerable, authentic.',
  'character':         'Character voice — the narrator inhabits a specific persona distinct from the artist. Dramatic, cinematic.',
  'omniscient':        'Omniscient narrator — the speaker observes and comments from outside. More analytical, less personal.',
  'second-person':     'Second person — "you" as the subject. Directly addresses the listener, creating uncomfortable intimacy.',
  'collective-we':     'Collective we — "we" as the subject. Community voice, anthemic, represents a group not an individual.'
};

function buildRapLabPrompt(params) {
  const {
    genre = 'hiphop',
    topic: rawTopic = 'the streets',
    mood: rawMood = 'Defiant',
    vocal: rawVocal = 'Auto-Tune / Melodic trap',
    structure = 'standard',
    quality = 'radio-ready',
    era = 'current',
    rapStyle = 'trap',
    rapDimensions = {},
    hookStyle = 'auto'
  } = params || {};

  const topic = sanitizeInput(rawTopic);
  const mood = sanitizeInput(rawMood);
  const vocal = sanitizeInput(rawVocal);

  // Frontend sends underscore keys (g_funk, boom_bap); backend uses hyphen keys (g-funk, boom-bap).
  // Normalize + map special cases where names differ between client and server.
  const RAP_STYLE_MAP = {
    'lyrical-conscious': 'conscious',
    'melodic-rap':       'mumble',
    'old-school':        'boom-bap',
    'midwest':           'conscious',
    'drill-uk':          'drill',
    'afro-rap':          'afro-trap',
    'post-algorithm':    'cyber-rap',
    'neo-phonetic':      'mumble',
    'climate-rap':       'conscious',
    'ai-native':         'cyber-rap',
    'mosaic-flow':       'alt-rap',
    'golden-era-2':      'neo-boom-bap',
    'analog-melodic':    'trap-soul',
    'conscious-trap':    'trap-soul',
    'afro-boom-bap':     'neo-boom-bap',
    'jazz-rap-revival':  'jazz-rap'
  };
  const normalizedId = (rapStyle || 'trap').replace(/_/g, '-');
  const backendId    = RAP_STYLE_MAP[normalizedId] || normalizedId;
  const style = RAP_STYLES[backendId] || RAP_STYLES.trap;

  const flowArr = Array.isArray(rapDimensions.flow)
    ? rapDimensions.flow
    : [rapDimensions.flow || style.defaults.flow];
  const rhymeArr = Array.isArray(rapDimensions.rhymeArch)
    ? rapDimensions.rhymeArch
    : [rapDimensions.rhymeArch || style.defaults.rhymeArch];
  const densityArr = Array.isArray(rapDimensions.density)
    ? rapDimensions.density
    : [rapDimensions.density || style.defaults.density];

  const dims = {
    flow:          flowArr,
    rhymeArch:     rhymeArr,
    density:       densityArr,
    vocabRegister: rapDimensions.vocabRegister || style.defaults.vocabRegister,
    persona:       rapDimensions.persona       || style.defaults.persona
  };

  const rapSubSunoTag = SUBSTYLE_SUNO[style.label] || null;
  const rapSubSunoLock = rapSubSunoTag
    ? `\n\n⚠️ PRODUCTION LOCK — ${style.label}: SONG PROMPT MUST contain: "${rapSubSunoTag}" — do NOT use generic trap production tags.`
    : '';

  const structStr = STRUCTURES[structure] || STRUCTURES.standard;
  const hookNote = HOOK_STYLE_NOTES[hookStyle] || '';
  const brackets = GENRE_SUNO_BRACKETS.hiphop;

  const system = `${style.agent}

RAP LAB ACTIVE: You are operating in precision rap construction mode. Every dimension below is a hard constraint — not a suggestion. Your craft must honor the specific combination of dimensions requested.`;

  const prompt = `Write a complete, production-ready Rap / Hip-Hop song in the ${style.label} style at the highest possible level of craft.

Style: ${style.label} (${style.era})
Topic: ${topic}
Mood: ${mood}
Vocal style: ${vocal}
Structure: ${structStr}
Quality target: ${quality}

RAP LAB DIMENSIONS — HARD CONSTRAINTS:
• FLOW STYLE: ${dims.flow.join(' + ')} — ${dims.flow.map(f => FLOW_NOTES[f]).filter(Boolean).join(' / ')}${dims.flow.length > 1 ? `\n  ↳ FLOW BLEND: Primary flow [${dims.flow[0]}] drives VERSE bars — this is the workhorse delivery. Secondary flow [${dims.flow.slice(1).join(' + ')}] enters in HOOK and/or BRIDGE. The contrast between them creates the dynamic arc: verse attacks differently than hook. Do NOT alternate flows randomly bar-by-bar — assign them structurally by section.` : ''}
• RHYME ARCHITECTURE: ${dims.rhymeArch.join(' + ')} — ${dims.rhymeArch.map(r => RHYME_NOTES[r]).filter(Boolean).join(' / ')}${dims.rhymeArch.length > 1 ? `\n  ↳ RHYME BLEND: [${dims.rhymeArch[0]}] anchors the HOOK — accessible, memorable, easy to catch on repeat listens. [${dims.rhymeArch.slice(1).join(' + ')}] deepens the VERSE — where craft and complexity live. Don't mix schemes randomly within a section; assign them intentionally by function.` : ''}
• SYLLABIC DENSITY: ${dims.density.join(' + ')} — ${dims.density.map(d => DENSITY_NOTES[d]).filter(Boolean).join(' / ')}${dims.density.length > 1 ? `\n  ↳ DENSITY BLEND: Primary density [${dims.density[0]}] drives VERSE — controls space, breath, and weight per word. Secondary density [${dims.density.slice(1).join(' + ')}] activates in HOOK/CHORUS — delivering syllabic compression or technical showcase. Verse breathes; hook unleashes.` : ''}
• VOCABULARY REGISTER: ${dims.vocabRegister} — ${VOCAB_NOTES[dims.vocabRegister]}
• PERSONA: ${dims.persona} — ${PERSONA_NOTES[dims.persona]}
${hookNote ? '\n' + hookNote : ''}${rapSubSunoLock}

BRACKET REQUIREMENTS:
${bracketInstructionServer('hiphop', 'full', style.label)}

SONGWRITING RULES:
- Every bar must earn its space — no filler lines
- Flow patterns must be intentional, matching the specified FLOW dimension
- Internal rhyme schemes preferred over simple end rhymes (unless 'end-only' specified)
- Metaphors must be specific — no generic imagery
- Hook within 30 seconds
- Last chorus must feel bigger than the first
- LYRICS LENGTH RULE: Total lyrics under 5000 characters — Suno's maximum. Includes all section tags.
- NO EM DASHES: Never use em dashes (—) in lyrics. Use commas or ellipsis instead.${buildAdlibNote('hiphop')}

Respond with EXACTLY this format:

TITLE: [song title]

VERDICT: [one sentence on why this song will connect]

LYRICS:
[Complete song lyrics only. EVERY SECTION starts with its bracket tag. Clean lyrics — no annotations, no notes, no commentary embedded in the lyrics.]

SONG PROMPT:
[${rapSubSunoTag ? `MUST lead with: "${rapSubSunoTag}" — ` : ''}Under 440 chars. ${style.label} style, specific production elements, BPM range, vocal texture, key sonic signatures. NO artist names.]

PRODUCTION BRIEF:
CORE PROMPT:
[Exact copy of SONG PROMPT]

TEMPO & KEY:
[BPM · Key · Time sig · Feel]

FLOW BREAKDOWN:
[3-5 lines: bar-by-bar flow pattern guide for the main verse. Where accents land, syllable density, rhythmic signature.]

RAP LAB SETTINGS USED:
Style: ${style.label} | Flow: ${dims.flow.join('+')} | Rhyme: ${dims.rhymeArch.join('+')} | Density: ${dims.density} | Vocab: ${dims.vocabRegister} | Persona: ${dims.persona}

DIRECTOR NOTES:
1. [Production decision specific to THIS song and style]
2. [Mixing note for this specific style]
3. [Vocal direction note]
4. [Suno/AI platform specific tip]
5. [What makes this combination of dimensions unique]${buildVocalStackNote('hiphop')}`;

  return { system, prompt };
}

// ═══════════════════════════════════════════════════════
// SYNC BIBLE — Sync licensing + cinematic placement intelligence
// ═══════════════════════════════════════════════════════
const SYNC_BIBLE = {
  what_is_sync: 'Sync licensing is placing music in film, TV, ads, trailers, games, or documentaries. A music supervisor pitches songs to directors/brands. The song must serve the visual — emotion first, lyrics second.',
  placement_types: {
    trailer: { tone:'Epic, building tension, emotional release at drop. Hybrid orchestral + electronic. No verses — pure arc from quiet to massive. Lyrics optional, often wordless or single repeated phrase.', suno:'"trailer music, hybrid orchestral, epic, tension build, Hans Zimmer influenced, percussion, 130 BPM"', structure:'Quiet intro (0:00-0:20) → build (0:20-0:50) → drop/peak (0:50-1:00) → resolve' },
    tv_drama: { tone:'Emotionally honest, understated, supports not competes with dialogue. Often singer-songwriter or indie pop. Lyrics must be universally relatable — no specific names/places.', suno:'"indie folk, sparse production, emotional, close-mic vocal, fingerpicked guitar"', structure:'Standard VCVC — placed under scene, often fades as dialogue resumes' },
    advertisement: { tone:'Upbeat, positive, brand-aligned emotion. 15-30-60 second versions. Hook in first 5 seconds. Product-neutral lyrics — joy, possibility, movement.', suno:'"upbeat pop, bright production, optimistic, commercial feel, memorable hook"', structure:'Hook-first, no intro, 30-60 seconds max' },
    documentary: { tone:'Contemplative, minimal, serves the story. Acoustic or ambient. Lyrics can be more poetic/abstract.', suno:'"ambient folk, minimal, contemplative, acoustic, warm, 70 BPM"', structure:'Through-composed or loop-friendly, no hard drop' },
    game_ost: { tone:'Loop-friendly, no obvious ending. Atmospheric, genre matches game world. Can be instrumental or vocal.', suno:'"game OST, atmospheric, loop-friendly, cinematic, [genre of game world]"', structure:'8 or 16 bar loop with natural join point — no obvious intro/outro' },
    indie_film: { tone:'Raw, authentic, emotionally specific. Indie rock, folk, or lo-fi. Lyrics can be more literary and complex.', suno:'"indie rock, lo-fi, authentic, emotional, intimate production"', structure:'Standard song structure, placed at emotional scene peaks' }
  },
  lyric_rules: [
    'No brand names, product names, or trademarks — supervisors cannot clear them',
    'No specific dates, years, or time references that will date the placement',
    'No character names or proper nouns unless the brief specifically calls for them',
    'No profanity for network TV, ads, or family films — keep a clean version always',
    'Universal emotional language — "you" not a specific person\'s name, "this city" not "New York"',
    'Ambiguity is an asset — a lyric that could mean 10 things fits 10 different scenes',
    'Avoid irony for ads and trailers — sincerity places better'
  ],
  emotional_cues: {
    tension:    { desc:'Unresolved, building dread or anticipation', suno:'"dissonant strings, low drones, minor key, building percussion"' },
    release:    { desc:'Resolution after tension, catharsis, relief', suno:'"major key shift, swelling strings, bright percussion hit"' },
    yearning:   { desc:'Longing, nostalgia, bittersweet', suno:'"fingerpicked guitar, soft piano, minor to major, gentle strings"' },
    triumph:    { desc:'Victory, achievement, earned joy', suno:'"full orchestra, snare march, brass, building to climax"' },
    melancholy: { desc:'Quiet sadness, reflection, loss', suno:'"sparse piano, minimal production, slow tempo, minor key"' },
    wonder:     { desc:'Awe, discovery, hope, expansiveness', suno:'"ambient pads, gentle piano, gradual orchestral build, major key"' },
    urgency:    { desc:'Action, chase, countdown, stakes', suno:'"driving rhythm, staccato strings, tempo 140+ BPM, no pause"' },
    intimacy:   { desc:'Connection, vulnerability, quiet truth', suno:'"close-mic vocal, single instrument, room sound, no reverb"' }
  },
  suno_cinematic_tags: [
    '[Orchestral]','[Cinematic]','[No drums]','[Strings only]',
    '[Trailer music]','[Emotional build]','[Score]','[Underscore]'
  ],
  strip_for_sync(lyrics) {
    // Guidance: rewrite these patterns out of lyrics before sync placement
    return [
      'Replace all proper nouns (people, places, brands) with universal equivalents',
      'Replace specific dates/years with "that night", "those days", "back then"',
      'Replace city/location names with "this city", "back home", "somewhere new"',
      'Replace any brand or product names with descriptive equivalents',
      'Review for profanity — offer clean alternative lines'
    ];
  }
};

// ═══════════════════════════════════════════════════════
// SONG VARIANT PROMPT BUILDERS
// ═══════════════════════════════════════════════════════
const VARIANT_PROMPTS = {

  dj_remix: (song) => `You are a world-class DJ and electronic music producer reworking "${song.title}" for club play.

ORIGINAL LYRICS:
${song.lyrics}

ORIGINAL GENRE: ${song.genre || 'pop'}

YOUR TASK — Create a DJ Remix version:
1. STRUCTURE REWRITE: Add a 16-bar intro build (filter sweep, percussion only, no full arrangement). Identify the drop point (where the full track hits — usually where the chorus was). Add a 8-bar breakdown (strip to kick + bass + vocal chop). Extend the outro to 16+ bars for DJ mixing out.
2. LYRIC ADAPTATION: Lyrics stay mostly the same but the chorus hook gets repeated more (4-6x). Add [Build] [Drop] [Breakdown] [Outro - extended] section tags.
3. SUNO STYLE: Rewrite the production style as: "club remix, electronic production, 4-on-the-floor kick, side-chain compression, filter sweep intro, [original genre] influences, DJ edit, 128 BPM"
4. OUTPUT FORMAT:
   REMIX TITLE: [title] (Club Remix)
   SUNO STYLE: [production description]
   STRUCTURE NOTE: [brief description of the structural changes]
   [Full rewritten lyrics with DJ structure tags]`,

  acoustic: (song) => `You are a master arranger stripping "${song.title}" down to its raw acoustic form.

ORIGINAL LYRICS:
${song.lyrics}

ORIGINAL GENRE: ${song.genre || 'pop'}

YOUR TASK — Create an Acoustic Version:
1. ARRANGEMENT: Remove all electronic production, drums, bass synths. Rewrite for fingerpicked acoustic guitar and voice (add piano or cello as a second instrument only if it serves the song). The production becomes intimate — close-mic, room sound, human feel.
2. STRUCTURE: Simplify if needed. Can remove a repeat chorus. Can add a new quiet bridge moment that the original production buried. Dynamics are created by adding/removing the second instrument, not volume.
3. LYRICS: Keep original lyrics exactly. You may add a single new quiet bridge if the stripped arrangement creates space for one.
4. SUNO STYLE: "acoustic, fingerpicked guitar, close-mic vocals, intimate, no drums, warm room reverb, [original genre] acoustic version"
5. OUTPUT FORMAT:
   ACOUSTIC TITLE: [title] (Acoustic)
   SUNO STYLE: [production description]
   ARRANGEMENT NOTE: [what was stripped, what was kept]
   [Full lyrics with acoustic section tags]`,

  radio_edit: (song) => `You are a professional radio editor cutting "${song.title}" to radio format.

ORIGINAL LYRICS:
${song.lyrics}

YOUR TASK — Create a Radio Edit (target: 3:00-3:30):
1. CUT STRATEGY: Remove the intro if it's more than 4 bars before the first vocal. Cut one full verse if there are 3 verses. Remove or shorten the bridge. Bring the hook forward — it should hit within the first 45 seconds.
2. STRUCTURE TARGET: Verse 1 → Pre-Chorus → Chorus → Verse 2 → Chorus → Bridge (shortened) → Final Chorus → Quick Outro (4 bars max).
3. EDITS: Mark your cuts clearly with [CUT] annotations. The song must feel complete — no abrupt endings.
4. HOOK: The strongest hook line must appear in the first 30 seconds. If it doesn't in the original, restructure so it does.
5. OUTPUT FORMAT:
   RADIO TITLE: [title] (Radio Edit)
   RUNTIME NOTE: Estimated [X:XX] — cuts [describe what was removed]
   [Full edited lyrics with structure tags and [CUT] annotations where applicable]`,

  lofi: (song) => `You are a lo-fi producer creating a bedroom version of "${song.title}".

ORIGINAL LYRICS:
${song.lyrics}

ORIGINAL GENRE: ${song.genre || 'pop'}

YOUR TASK — Create a Lo-fi Version:
1. PRODUCTION REWRITE: The sound becomes: vinyl crackle, slightly off-tempo drums (human feel, not quantized), warm tape saturation, detuned slightly flat, reverb-heavy vocals pulled back in the mix, jazz-influenced chord voicings underneath.
2. TEMPO: Slow down 10-15 BPM from the original feel. Lo-fi breathes slower.
3. LYRICS: Keep original lyrics. Add intimate, introspective feel — remove any big anthem moments. If there's a big chorus shout, rewrite it as a quieter confession.
4. STRUCTURE: Can cut repeats. Lo-fi songs often feel unfinished on purpose — 2:00-2:30 is ideal.
5. SUNO STYLE: "lo-fi hip hop, vinyl crackle, warm tape, jazzy chords, slow tempo, bedroom pop, nostalgic, [original genre] lo-fi"
6. OUTPUT FORMAT:
   LO-FI TITLE: [title] (Lo-fi)
   SUNO STYLE: [production description]
   VIBE NOTE: [emotional shift from original]
   [Full lyrics adapted for lo-fi feel]`,

  slowed_reverb: (song) => `You are creating a slowed + reverb version of "${song.title}" for emotional/TikTok aesthetic.

ORIGINAL LYRICS:
${song.lyrics}

YOUR TASK — Create a Slowed + Reverb Version:
1. CONCEPT: Slowed + reverb is about emotional magnification. The slower tempo makes every word hit harder. The reverb creates spaciousness — like the song is happening in a cathedral or an empty stadium at 3am.
2. PRODUCTION NOTE: BPM reduced 15-20%. Heavy cathedral or hall reverb on everything. Vocals pitch-shifted slightly down with the tempo. No compression — let the dynamics breathe.
3. LYRICS: Keep exactly. But add [Echo] tags where specific lines should have audible echo repeats of the last word or phrase. Identify the 2-3 most emotionally heavy lines — these are where the reverb effect will be most powerful.
4. SUNO STYLE: "slowed, reverb, dreamy, emotional, [original genre], slow tempo, spacious, melancholic, atmospheric"
5. OUTPUT FORMAT:
   SLOWED TITLE: [title] (Slowed + Reverb)
   SUNO STYLE: [production description]
   KEY LINES: [list the 2-3 lines that hit hardest slowed down]
   [Full lyrics with [Echo] annotations on key phrases]`,

  live_version: (song) => `You are a live performance director staging "${song.title}" as a live concert version.

ORIGINAL LYRICS:
${song.lyrics}

YOUR TASK — Create a Live Version:
1. INTRO: Add a spoken or sung performance intro — the artist addressing the crowd before the song starts. Keep it short (2-4 lines). Example: "This next song is about..." or a hummed intro that builds.
2. EXTENDED OUTRO: Add a live outro — the crowd singalong moment, the artist calling back to the crowd, the final repeat of the hook with crowd energy. This is where the song becomes communal.
3. DYNAMIC MOMENTS: Mark where the band would drop out for an acoustic moment ([Band drops], [Crowd sings]), where the energy peaks ([Full band in]), where a solo would go ([Guitar solo] or [Piano break]).
4. LYRICS: Keep original but add these performance annotations. You may add 1-2 ad-lib lines that feel improvised/authentic.
5. SUNO STYLE: "live recording, concert atmosphere, crowd noise, warm live sound, [original genre] live performance"
6. OUTPUT FORMAT:
   LIVE TITLE: [title] (Live)
   VENUE NOTE: [describe the ideal venue for this song — intimate club, festival, arena]
   [Full lyrics with live performance annotations]`,

  trap_remix: (song) => `You are a trap producer flipping "${song.title}" into a trap banger.

ORIGINAL LYRICS:
${song.lyrics}

ORIGINAL GENRE: ${song.genre || 'pop'}

YOUR TASK — Create a Trap Remix:
1. STRUCTURE: Add a trap intro (8 bars, beat only with ad-libs). The chorus becomes the trap hook — melodic but with 808 underpinning. Add a rap verse (8-16 bars) that reinterprets the song's theme in rap form. The rap verse sits between chorus repetitions.
2. NEW RAP VERSE: Write 8-16 bars of original trap rap that speaks to the song's theme. Bar = 1 line. Internal rhymes. Ad-libs in parentheses. Bar 8 or 16 = the punchline.
3. PRODUCTION: 808 bass, rolling hi-hats, trap snare on 2+4, melodic hook sampled/chopped from the original chorus.
4. SUNO STYLE: "trap remix, 808 bass, rolling hi-hats, trap drums, melodic hook, [original genre] trap flip, auto-tune, 140 BPM"
5. OUTPUT FORMAT:
   TRAP TITLE: [title] (Trap Remix)
   SUNO STYLE: [production description]
   [Full lyrics with trap structure — include the new rap verse clearly marked [Rap Verse]]`,

  gospel_version: (song) => `You are a gospel arranger transforming "${song.title}" into a gospel/choir version.

ORIGINAL LYRICS:
${song.lyrics}

YOUR TASK — Create a Gospel/Choir Version:
1. LYRIC TRANSFORMATION: Rewrite the lyrics to elevate the theme spiritually. If the song is about love, it becomes divine love or community love. If it's about struggle, it becomes faith through struggle. Keep the emotional core — shift the frame to the spiritual/communal.
2. STRUCTURE ADDITIONS: Add a call-and-response section (lead vocal line / choir response). Add a vamp at the end that builds and builds (the choir takes over, the lead ad-libs over the top). Add a [Testimony] section if a bridge exists.
3. CHOIR ARRANGEMENT: Mark [Lead], [Choir], [Call], [Response], [Vamp] sections. The choir should first echo then harmonize then overtake the lead.
4. SUNO STYLE: "gospel, choir, organ, clapping, soul, call and response, spiritual, uplifting, live church feel"
5. OUTPUT FORMAT:
   GOSPEL TITLE: [title] (Gospel Version)
   SUNO STYLE: [production description]
   THEME NOTE: [how the lyric theme was spiritually reframed]
   [Full rewritten lyrics with choir annotations]`,

  cinematic: (song) => `You are a composer and sync licensing specialist creating a cinematic/orchestral version of "${song.title}" for film/TV placement.

ORIGINAL LYRICS:
${song.lyrics}

ORIGINAL GENRE: ${song.genre || 'pop'}

SYNC LICENSING RULES YOU MUST FOLLOW:
${SYNC_BIBLE.lyric_rules.map((r,i) => `${i+1}. ${r}`).join('\n')}

YOUR TASK — Create a Cinematic/Sync-Ready Version:
1. LYRIC AUDIT: First, identify any lyrics that violate sync rules (proper nouns, brand names, dates, explicit content). Rewrite those lines with universal equivalents.
2. ARRANGEMENT: Rewrite for orchestral/cinematic production. Remove modern production elements. Add strings, piano, light percussion or no drums. The arrangement should support a visual scene, not compete with it.
3. EMOTIONAL CUE: Identify the primary emotional cue of this song (tension / release / yearning / triumph / melancholy / wonder / intimacy). The arrangement should intensify that single emotion.
4. PLACEMENT SUGGESTIONS: Based on the lyrics and emotion, suggest 2-3 ideal placement types (trailer / TV drama / ad / documentary / indie film) and why this song fits.
5. SUNO STYLE: "cinematic, orchestral, strings, piano, emotional, [primary emotion], sync-ready, no drums, film score, [original genre] acoustic"
6. OUTPUT FORMAT:
   CINEMATIC TITLE: [title] (Cinematic)
   SUNO STYLE: [production description]
   SYNC AUDIT: [list any lyric changes made for sync + why]
   PLACEMENT FIT: [2-3 ideal placements with brief reason each]
   PRIMARY EMOTION: [the single emotional cue]
   [Full sync-safe rewritten lyrics with orchestral section tags]`
};

// Main variant prompt assembler
function buildVariantPrompt(variant, song) {
  const builder = VARIANT_PROMPTS[variant];
  if (!builder) throw new Error(`Unknown variant: ${variant}`);
  const safeSong = {
    title: sanitizeInput(song.title || 'Untitled', 200),
    lyrics: sanitizeInput(song.lyrics || '', 8000),
    genre: sanitizeInput(song.genre || '', 50),
    genre2: sanitizeInput(song.genre2 || '', 50),
    topic: sanitizeInput(song.topic || '', 300)
  };
  return builder(safeSong);
}

// ═══════════════════════════════════════════════════════
// AI FEEDBACK COACH
// ═══════════════════════════════════════════════════════
const FEEDBACK_DIMENSIONS = {
  hook_strength:    { label: 'Hook Strength',    desc: 'Is the hook instantly memorable? Does it carry the emotional core? Would a stranger sing it back after one listen?' },
  emotional_arc:    { label: 'Emotional Arc',    desc: 'Does the song travel emotionally? Verse 1 → Verse 2 → Bridge should escalate, not repeat the same emotional level.' },
  specificity:      { label: 'Specificity',      desc: 'Are images concrete and specific (house number, dog name, exact feeling) or vague and generic? Specificity creates universality.' },
  rhyme_scheme:     { label: 'Rhyme & Flow',     desc: 'Are rhymes forced or natural? Do they land on stressed syllables? Are there internal rhymes adding density?' },
  structure:        { label: 'Structure',        desc: 'Does the section order serve the song? Is anything missing (pre-chorus tension, bridge reframe)? Does anything overstay its welcome?' },
  genre_authenticity: { label: 'Genre Authenticity', desc: 'Does it sound like it belongs in this genre? Does it use the genre\'s conventions or fight them?' },
  opening_line:     { label: 'Opening Line',     desc: 'The first line is the handshake. Is it strong enough to make someone stop scrolling? Does it establish world, character, or conflict immediately?' },
  bridge:           { label: 'Bridge / Turn',    desc: 'Does the bridge offer a new perspective, reframe the chorus, or take the song somewhere unexpected? Or does it just repeat?' },
  suno_readiness:   { label: 'Suno Readiness',   desc: 'Are section tags correct? Are any lines too long for natural delivery? Is the style prompt optimized for this genre?' }
};

function buildFeedbackPrompt(lyrics, genre, topic) {
  lyrics = sanitizeInput(lyrics || '', 8000);
  genre = sanitizeInput(genre || '', 50);
  topic = sanitizeInput(topic || '', 300);
  const genreData = GENRE_BIBLE[genre] || {};
  const genreDNA = genreData.dna || 'No genre-specific rules available.';
  const genreKeys = genreData.keys ? genreData.keys.join('\n- ') : 'None';
  const genreStructure = genreData.structure || 'Standard song structure.';
  const genreVocables = genreData.vocables ? `Vocable signature: ${genreData.vocables.sounds} — ${genreData.vocables.notes}` : '';
  const genreLabel = GENRE_LABELS[genre] || genre;

  const system = 'You are Soniq\'s AI Feedback Coach — a world-class music producer, songwriter, and A&R consultant. Give honest, specific, actionable feedback. Name actual lines. Be direct. Do not flatter. A songwriter must be able to act on every note.';

  const prompt = `You are analyzing ${genreLabel} song lyrics${topic ? ` about "${topic}"` : ''}. Use your full knowledge of this genre's rules to give expert feedback.

You are Soniq's AI Feedback Coach — a world-class music producer, songwriter, and A&R consultant who has worked across every genre. You give honest, specific, actionable feedback. You do not flatter. You identify what is working, what is not, and exactly how to fix it.

GENRE: ${genre || 'unknown'}
TOPIC/CONCEPT: ${topic || 'not specified'}

GENRE RULES FOR ${(genre || '').toUpperCase()}:
DNA: ${genreDNA}
Structure: ${genreStructure}
Key rules:
- ${genreKeys}
${genreVocables}

LYRICS TO ANALYZE:
${lyrics}

YOUR TASK — Analyze these lyrics across 9 dimensions. For each dimension give:
1. A score: ⭐⭐⭐⭐⭐ (5 = exceptional) — be honest, most songs score 2-3 on most dimensions
2. One sentence on what is working
3. One concrete, specific fix if score is under 4 — not vague advice, an actual rewrite suggestion or specific technique

DIMENSIONS TO COVER:
${Object.entries(FEEDBACK_DIMENSIONS).map(([k,v]) => `**${v.label}**: ${v.desc}`).join('\n')}

OVERALL VERDICT:
After the 9 dimensions, give:
- STRONGEST MOMENT: The single best line or section in the song, and why it works
- WEAKEST MOMENT: The single weakest line or section, with a specific rewrite
- ONE PRIORITY FIX: If the writer could only fix one thing before recording this song, what is it?
- GENRE VERDICT: Does this song belong in ${genre || 'its genre'}? What one production note would make it land harder?

FORMAT: Use the exact dimension labels above as headers. Be direct. Be specific. Name the actual lines. A songwriter should be able to act on every note you give.`;

  return { prompt, system };
}

// ═══════════════════════════════════════════════════════════════════════════
// CRAFT DIMENSIONS — per-genre builders
// Called from buildSongPrompt() with dims = params.craftDimensions[genre]
// Each builder returns a string (prefixed with \n\n) or '' if no dims.
// ═══════════════════════════════════════════════════════════════════════════

function buildBluesDimBlock(dims) {
  if (!dims) return '';
  const subMap = {
    'delta':       'Delta Blues — acoustic slide, open D/G tuning, dry room sound (Robert Johnson / Son House lineage).',
    'chicago':     'Chicago Blues — electric band, shuffle snare, harp fills, Chess Records sound (Muddy Waters / Howlin\' Wolf).',
    'texas':       'Texas Blues — Stratocaster into clean-to-crunch amp, swing-sixteenth groove (SRV / Jimmie Vaughan).',
    'soul-blues':  'Soul Blues — horns, Hammond B3, vocal-forward urban feel (Bobby Bland / Little Milton).',
    'piedmont':    'Piedmont — fingerpicked thumb-bass + melody, light swing, Carolinas warmth (Blind Blake).',
    'blues-rock':  'Blues-Rock — overdriven electric, arena dynamics, modern production (Gary Clark Jr. / Bonamassa).'
  };
  const tempoMap = {
    'slow-drag':         '45–55 BPM slow drag — near-dirge weight; the tempo creates dread and reverence.',
    'slow-blues':        '55–70 BPM with 12/8 triplet feel — every note has room to breathe.',
    'medium-shuffle':    '90–108 BPM swung eighths — classic Chicago/Texas shuffle groove.',
    'texas-shuffle':     '108–120 BPM SRV swing-sixteenth — urgent but elastic.',
    'uptempo-boogaloo':  '130–145 BPM jump blues — lyrics punch shorter and harder.'
  };
  const guitarMap = {
    'lead-call-response': 'Guitar answers every vocal phrase with a melodic lick — the core blues conversation.',
    'slide-lead':         'Bottleneck/dobro slide in open tuning — mournful, vocal-like fills.',
    'rhythm-dominant':    'Guitar locks into groove riff; vocal carries the melodic weight.',
    'harmonica-feature':  'Harmonica takes the call-response role; guitar comps rhythm — Chicago two-piece voicing.',
    'horn-feature':       'Brass section answers the vocal; guitar comps — soul-blues arrangement.'
  };
  const lyricMap = {
    'strict-aab':           'Classic AAB: state line, repeat with variation, resolve.',
    'loose-blues-verse':    'AAB skeleton preserved but the repeat is embellished — singer works the line.',
    'aab-plus-turnaround':  'AAB + 2-bar guitar turnaround (bars 11–12) before next verse cycle.',
    'call-response-lyric':  'Lyric built around the gaps: vocal phrase / silence / guitar answer / continue.',
    'modern-structured':    'Verse-chorus architecture over blues harmonic bed — AAB discipline held inside verses.'
  };
  const emotionMap = {
    'lament-loss':          'Grief with dignity — present tense, specific detail; the guitar carries what the voice cannot.',
    'defiant-survival':     'Stubborn exhausted survival — the B-line delivers refusal to fold, not a victory.',
    'romantic':             'Desire and its complications — want, loss, jealousy; never pure sweetness.',
    'spiritual-redemption': 'Suffering that points somewhere higher — religious language earned, not decorative.',
    'celebratory':          'Joy that has scar tissue — the party was survived to; blues joy, not pop joy.'
  };

  const guitarArr  = Array.isArray(dims.guitarRole)         ? dims.guitarRole         : [dims.guitarRole].filter(Boolean);
  const emotionArr = Array.isArray(dims.emotionalTerritory) ? dims.emotionalTerritory : [dims.emotionalTerritory].filter(Boolean);

  const parts = [];
  if (subMap[dims.subStyle])       parts.push(`• SUB-STYLE: ${subMap[dims.subStyle]}`);
  if (tempoMap[dims.tempoFeel])    parts.push(`• TEMPO / FEEL: ${tempoMap[dims.tempoFeel]}`);
  if (guitarArr.length)            parts.push(`• GUITAR ROLE: ${guitarArr.map(v => guitarMap[v]).filter(Boolean).join(' / ')}`);
  if (lyricMap[dims.lyricStructure]) parts.push(`• LYRIC STRUCTURE: ${lyricMap[dims.lyricStructure]}`);
  if (emotionArr.length)           parts.push(`• EMOTIONAL TERRITORY: ${emotionArr.map(v => emotionMap[v]).filter(Boolean).join(' / ')}`);

  return parts.length ? `\n\nBLUES CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildBossaDimBlock(dims) {
  if (!dims) return '';
  const feelMap = {
    'classic-intimate':  'Classic intimate bossa — soft brushed kit, single nylon-string guitar, close-mic vocal whisper.',
    'jazz-swung':        'Jazz-swung bossa — slight triplet lean on the syncopation; more saxophone/piano comping room.',
    'samba-pulse':       'Samba pulse underneath — stronger surdo bass, more dance-floor propulsion than café bossa.',
    'lounge-slow':       'Lounge slow — extreme restraint, wide space between notes, Astrud Gilberto-era cool detachment.',
    'nu-bossa-float':    'Nu-bossa float — electronic percussion, vinyl-dust texture, modern downtempo bossa fusion.'
  };
  const harmonyMap = {
    'classic-bossa-ii-v':  'Classic bossa ii–V–I voice-leading — Jobim harmonic fingerprint, chromatic inner-voice motion.',
    'jazz-extended':       'Jazz-extended chords — maj7#11, min9, alt dominants; harmony is its own narrative layer.',
    'modal-color':         'Modal vamps — Dorian or Phrygian static harmony as a mood-color field, not functional progression.',
    'samba-root':          'Samba-root harmony — I–IV–V and minor blues lineage; simpler than classic bossa, more carnival.'
  };
  const langMap = {
    'portuguese':  'Lyrics in Brazilian Portuguese — honor the softness of Portuguese vowels; no forced English phrasing.',
    'bilingual':   'Bilingual — Portuguese verse, English chorus (or vice versa). The language shift IS a melodic event.',
    'english':     'English lyrics — write with Portuguese phrasing sensibility: open vowels, trailing syllables, soft consonants.'
  };
  const moodMap = {
    'saudade-longing':     'Saudade — the untranslatable Brazilian longing; presence of what is absent. The song mourns without bitterness.',
    'romantic-tender':     'Tender romance — quiet gratitude and specific adoration; no grand declarations.',
    'nostalgic-memory':    'Nostalgic memory — a specific café, a specific beach, a specific year; the song is already in past tense.',
    'sensual-present':     'Sensual present — body-aware, low-stakes eroticism; the heat lives in restraint, not display.',
    'bittersweet-irony':   'Bittersweet irony — Vinícius-style literary wit; smile through the hurt, shrug at the gods.'
  };
  const instMap = {
    'solo-guitar-voice':      'Solo nylon guitar + voice only — the entire record is two instruments. Maximum intimacy.',
    'guitar-bass-percussion': 'Guitar + upright bass + brushed kit/shaker — the canonical small-combo bossa trio.',
    'jobim-ensemble':         'Jobim ensemble — piano, guitar, upright bass, brushed drums, optional string pad; full Rio sophistication.',
    'sax-crossover':          'Sax crossover — Stan Getz / cool-jazz flavor; the sax counter-line answers the vocal in every verse.',
    'nu-bossa-electronic':    'Nu-bossa electronic — programmed percussion, synth pads, sampled Rhodes; bossa DNA over downtempo beats.'
  };

  const feelArr    = Array.isArray(dims.feel)    ? dims.feel    : [dims.feel].filter(Boolean);
  const harmonyArr = Array.isArray(dims.harmony) ? dims.harmony : [dims.harmony].filter(Boolean);

  const parts = [];
  if (feelArr.length)                parts.push(`• FEEL: ${feelArr.map(v => feelMap[v]).filter(Boolean).join(' / ')}`);
  if (harmonyArr.length)             parts.push(`• HARMONY: ${harmonyArr.map(v => harmonyMap[v]).filter(Boolean).join(' / ')}`);
  if (langMap[dims.language])        parts.push(`• LANGUAGE: ${langMap[dims.language]}`);
  if (moodMap[dims.emotionalTone])   parts.push(`• MOOD: ${moodMap[dims.emotionalTone]}`);
  if (instMap[dims.instrumentation]) parts.push(`• ENSEMBLE: ${instMap[dims.instrumentation]}`);

  return parts.length ? `\n\nBOSSA NOVA CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildSSDimBlock(dims) {
  if (!dims) return '';
  const arrangeMap = {
    'solo-acoustic':    'Solo acoustic — one voice, one acoustic guitar. Every imperfection audible. The room is the production.',
    'voice-piano':      'Voice + piano — intimate, close-mic; piano carries both harmony and counter-melody.',
    'sparse-band':      'Sparse band — acoustic guitar, brushed drums, upright bass, occasional pedal steel or fiddle.',
    'layered-folk':     'Layered folk — stacked harmonies, banjo/mandolin/fiddle textures, large room ambience.',
    'chamber-strings':  'Chamber strings — string quartet integrated with voice/guitar; Sufjan/Nick Drake textural world.',
    'bedroom-lo-fi':    'Bedroom lo-fi — tape hiss, mic bleed, performance imperfection left in; the fragility IS the sound.'
  };
  const modeMap = {
    'confessional':     'Confessional — first-person, diary voice. Name specific shames, specific tenderness; reader feels intruding and welcome at once.',
    'cinematic-scene':  'Cinematic scene — every verse opens in a specific room, a specific hour; the song is shot-listed, not felt.',
    'abstract-image':   'Abstract imagery — surreal juxtapositions (Joanna Newsom / Elliott Smith). Meaning is felt before it is parsed.',
    'character-study':  'Character study — the narrator is NOT the songwriter; a specific invented person tells their own story in their own voice.',
    'observational':    'Observational — narrator reports without editorializing; the restraint is the emotion (Joni Mitchell cool-eye mode).'
  };
  const formMap = {
    'verse-chorus':     'Verse-chorus with a single bridge — conventional pop architecture served at singer-songwriter depth.',
    'vcvcbc':           'VCVCBC — two verse/chorus cycles, a bridge, a final chorus; classic craft-first SS structure.',
    'verse-only':       'Verse-only — no chorus returns; the song advances linearly. Each verse must earn its place (Dylan / Tracy Chapman "Fast Car").',
    'through-composed': 'Through-composed — no repeating sections; the song is a melodic narrative that never returns home.',
    'circular':         'Circular — the song ends where it began, but the meaning has changed; the repetition IS the revelation.'
  };
  const melMap = {
    'speech-melody':    'Speech-melody — pitch follows natural speech inflection; minimal melodic range, maximum textual clarity.',
    'stepwise-lyric':   'Stepwise lyric — melody moves by small intervals, mostly scalar; emphasis lives in rhythm not leap.',
    'leap-driven':      'Leap-driven — wide octave/sixth leaps as emotional punctuation; Joni / Joan Baez / Jeff Buckley territory.',
    'melismatic':       'Melismatic — emotional words stretch across multiple notes; ornamental runs carry what the word alone cannot.',
    'monotone-drone':   'Monotone/drone — repeated single-pitch delivery against shifting harmony; the stillness IS the voice.',
    'call-response':    'Call-and-response — the vocal trades with a second voice or instrumental answer; dialogue structure.'
  };
  const texMap = {
    'tender-fragile':   'Tender/fragile — soft dynamic, breath audible, consonants light; every line about to break.',
    'burning-ache':     'Burning ache — slow-simmering undercurrent of grief or want that never resolves; controlled intensity.',
    'wry-ironic':       'Wry/ironic — Fiona Apple / Father John Misty tone; humor as survival, self-aware without cynicism.',
    'defiant-resolve':  'Defiant resolve — quiet refusal; lines land like a door closing gently but permanently.',
    'quiet-wonder':     'Quiet wonder — Sufjan Stevens / Nick Drake mode; attention as prayer, small things rendered sacred.',
    'numb-distance':    'Numb/distance — emotional flatness as the real subject; the listener fills in what the narrator cannot feel.'
  };

  const melArr = Array.isArray(dims.melodicDelivery)  ? dims.melodicDelivery  : [dims.melodicDelivery].filter(Boolean);
  const texArr = Array.isArray(dims.emotionalTexture) ? dims.emotionalTexture : [dims.emotionalTexture].filter(Boolean);

  const parts = [];
  if (arrangeMap[dims.arrangement]) parts.push(`• ARRANGEMENT: ${arrangeMap[dims.arrangement]}`);
  if (modeMap[dims.lyricMode])      parts.push(`• LYRIC MODE: ${modeMap[dims.lyricMode]}`);
  if (formMap[dims.songForm])       parts.push(`• SONG FORM: ${formMap[dims.songForm]}`);
  if (melArr.length)                parts.push(`• MELODIC DELIVERY: ${melArr.map(v => melMap[v]).filter(Boolean).join(' / ')}`);
  if (texArr.length)                parts.push(`• EMOTIONAL TEXTURE: ${texArr.map(v => texMap[v]).filter(Boolean).join(' / ')}`);

  return parts.length ? `\n\nSINGER-SONGWRITER CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildKpopDimBlock(dims) {
  if (!dims) return '';
  const energyMap = {
    'ballad':'Ballad energy — slow, sweeping, vocal-showcase; minimal percussion, lush strings or piano.',
    'mid-tempo':'Mid-tempo — grooved clean production; room for synchronized moves and melodic breathing.',
    'dance-ready':'Dance-ready — precise BPM-locked groove, choreography-anchored structure, punchy drops.',
    'banger':'Banger — high-intensity, compressed dynamics, aggressive bass; peak crowd energy in every section.',
    'neo-retro':'Neo-retro — Y2K/00s idol aesthetic re-filtered through current production; nostalgic + crisp.'
  };
  const rapMap = {
    'none':'No rap — pure vocal performance; all sections sung.',
    'light':'Light rap — short 4–8 bar rap bridge or pre-chorus break; primarily vocal song.',
    'rap-break':'Rap break — full dedicated rap verse (usually V2 or bridge); switches flow then returns to melody.',
    'rap-heavy':'Rap-heavy — more than 40% of bars rapped; hybrid idol-rapper framing.'
  };
  const conceptMap = {
    'cute-youthful':'Cute/Youthful — bright colors, innocent longing, playful wordplay, bubblegum sonic palette.',
    'dark-intense':'Dark/Intense — minor tonality, powerful choreography moments, heavier production drops.',
    'powerful-confident':'Powerful/Confident — assertive delivery, strong rhythmic hooks, self-declaration lyrics.',
    'romantic-tender':'Romantic/Tender — soft dynamics, sincere affection, emotional lyric directness.',
    'quirky-playful':'Quirky/Playful — off-beat hooks, character-driven wordplay, unpredictable sonic moments.',
    'cool-detached':'Cool/Detached — minimal expression, understated delivery, stylized distance from emotion.'
  };
  const groupMap = {
    'solo':'Solo — single vocal identity; personal and direct address.',
    'duo-harmony':'Duo harmony — two vocal textures in dialogue; harmonies are the emotional center.',
    'unit-3-4':'Unit of 3–4 — call-and-response section splits; each member carries a distinct verse moment.',
    'full-group':'Full group — 5+ member energy, staggered entries, unison choruses, member-spotlight verses.'
  };
  const eraMap = {
    'classic-idol':'Classic idol (1st–2nd gen) — melodic, commercial, choreography-light; Seo Taiji / H.O.T. era DNA.',
    'gen-3-peak':'Gen-3 peak (2012–2019) — polished performance, synchronized dance, dual-concept trend; BTS/TWICE sound.',
    'gen-4-current':'Gen-4 current (2020–present) — darker aesthetics, global-first lyrics, multi-language mixing.',
    'neo-retro':'Neo-retro — intentional Y2K callback with modern mastering; IVE/NMIXX throwback mode.',
    'post-idol':'Post-idol — deconstructed group format, artist-led creative, genre hybridity beyond conventional K-Pop.'
  };
  const vocalMap = {
    'aegyo-soft':'Aegyo-soft — wide vowels, slight breathy onset, cute tonal color (higher register preferred).',
    'precision-clean':'Precision-clean — metronomically exact phrasing, controlled vibrato, studio-perfect intonation.',
    'powerful-belt':'Powerful belt — belted high notes, emotional climax on chorus peak, full chest-mix voice.',
    'english-forward':'English-forward — English lyrics prioritized; Korean phrases minimal and phonetically shaped for global ear.',
    'konglish-mix':'Konglish mix — natural bilingual switching; English hooks, Korean verses; the blend is the identity.'
  };
  const conceptArr = Array.isArray(dims.conceptTheme) ? dims.conceptTheme : [dims.conceptTheme].filter(Boolean);
  const parts = [];
  if (energyMap[dims.energyTier])   parts.push(`• ENERGY: ${energyMap[dims.energyTier]}`);
  if (rapMap[dims.rapPresence])     parts.push(`• RAP: ${rapMap[dims.rapPresence]}`);
  if (conceptArr.length)            parts.push(`• CONCEPT: ${conceptArr.map(v => conceptMap[v]).filter(Boolean).join(' / ')}`);
  if (groupMap[dims.groupDynamic])  parts.push(`• GROUP: ${groupMap[dims.groupDynamic]}`);
  if (eraMap[dims.eraStyle])        parts.push(`• ERA: ${eraMap[dims.eraStyle]}`);
  if (vocalMap[dims.vocalDelivery]) parts.push(`• VOCAL: ${vocalMap[dims.vocalDelivery]}`);
  return parts.length ? `\n\nK-POP CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildAltrockDimBlock(dims) {
  if (!dims) return '';
  const dynMap = {
    'quiet-loud':'Quiet-loud architecture — verse simmers at low volume, chorus erupts (Pixies / Nirvana model).',
    'sustained-tension':'Sustained tension — song builds without releasing; compression stays high start to finish.',
    'explosive-start':'Explosive start — opens at maximum intensity; nowhere to go but hold or descend.',
    'slow-burn':'Slow burn — gradual accretion of instruments and volume; payoff lives in the final 90 seconds.',
    'peaks-valleys':'Peaks & valleys — multiple dynamic swings; the song breathes in and out more than once.'
  };
  const gtMap = {
    'clean-jangly':'Clean-jangly — Rickenbacker bright attack, chorus pedal shimmer; jangly 80s indie (Smiths/REM).',
    'distorted-crunch':'Distorted crunch — amp saturation, dropped-D power chords, scooped mids; wall of sound.',
    'shoegaze-wall':'Shoegaze wall — multiple layered guitar tracks, heavy reverb, pitch-shifting; MBV density.',
    'angular-postpunk':'Angular post-punk — staccato rhythmic patterns, dissonant voicings, nervous energy.',
    'arpeggiated-atm':'Arpeggiated atmosphere — delay-soaked picked arpeggios, wide stereo, hymnal quality.',
    'math-rock-riff':'Math-rock riff — polyrhythmic count, odd-time signatures, interlocking parts (Slint).'
  };
  const lyMap = {
    'opaque-imagery':'Opaque imagery — non-linear metaphor, private references, resistant to single interpretation.',
    'direct-emotion':'Direct emotion — declarative vulnerability, no protective irony; feeling stated plainly.',
    'narrative-scene':'Narrative scene — story in present tense from specific POV; cinematic, character-driven.',
    'literary-abstract':'Literary/Abstract — allusions to literature or art, syntactically fragmented, elevated diction.',
    'outsider-irony':'Outsider irony — detached self-aware narrator; sardonic distance from mainstream sincerity.'
  };
  const stMap = {
    'vcpcvc-classic':'VCPCVC classic — verse / chorus / pre-chorus / verse / chorus / bridge / chorus; alt template.',
    'no-intro-drop-in':'No-intro drop-in — song begins mid-groove or mid-vocal phrase; no establishment period.',
    'extended-build':'Extended build — long intro (60–90s), gradual element addition, chorus withheld until 2/3 mark.',
    'two-part-arc':'Two-part arc — first half is one mood/tempo, second half ruptures into different energy entirely.',
    'no-chorus-tension':'No-chorus tension — no repeated hook section; verses accumulate, outro releases or refuses.'
  };
  const subMap = {
    'indie-rock':'Indie rock voice — melodic hooks over mid-fi production, lo-fi warmth, emotionally open.',
    'shoegaze':'Shoegaze — vocals buried in reverb, guitar as texture not riff, dreamlike lyric dissociation.',
    'post-punk':'Post-punk — angular rhythms, bass-forward, agitated political or existential lyric tone.',
    'grunge':'Grunge — flannel-era nihilism, down-tuned guitars, melodic verse / aggressive chorus contrast.',
    'emo':'Emo — emotional directness, confessional lyric, clean-to-distorted dynamic, minor key earnestness.',
    'dream-pop':'Dream-pop — lush reverb, soft vocal float, hazy melody lines, sensory imagery over narrative.'
  };
  const gtArr = Array.isArray(dims.guitarTexture) ? dims.guitarTexture : [dims.guitarTexture].filter(Boolean);
  const lyArr = Array.isArray(dims.lyricMode)     ? dims.lyricMode     : [dims.lyricMode].filter(Boolean);
  const parts = [];
  if (dynMap[dims.dynamicArc])              parts.push(`• DYNAMIC ARC: ${dynMap[dims.dynamicArc]}`);
  if (gtArr.length)                         parts.push(`• GUITAR: ${gtArr.map(v => gtMap[v]).filter(Boolean).join(' / ')}`);
  if (lyArr.length)                         parts.push(`• LYRIC: ${lyArr.map(v => lyMap[v]).filter(Boolean).join(' / ')}`);
  if (stMap[dims.songStructureApproach])    parts.push(`• STRUCTURE: ${stMap[dims.songStructureApproach]}`);
  if (subMap[dims.subgenreVoice])           parts.push(`• SUBGENRE: ${subMap[dims.subgenreVoice]}`);
  return parts.length ? `\n\nALT-ROCK CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildAfrobeatsDimBlock(dims) {
  if (!dims) return '';
  const regMap = {
    'nigerian-lagos':'Nigerian/Lagos — Afrobeats heartland; Burna Boy / Wizkid / Davido sound; percussive highlife DNA.',
    'afrofusion':'Afrofusion — border-crossing blend of Afrobeats with R&B, dancehall, rap, or electronic influences.',
    'sa-amapiano':'South African/Amapiano — log drum bass, piano house loops, cabasa rhythm, Johannesburg scene.',
    'uk-afroswing':'UK Afroswing — grime-meets-afrobeats; Afrobeats cadence with UK urban production and patois bars.',
    'ghanaian-highlife':'Ghanaian Highlife — older traditional foundations, guitar-prominent, community-celebratory energy.'
  };
  const grvMap = {
    'chill-wave':'Chill wave — relaxed dembow-adjacent groove; late-night, introspective, midtempo smooth feel.',
    'vibing-medium':'Vibing medium — steady two-step energy; dancefloor ready but not peaked; the main Afrobeats zone.',
    'dancefloor':'Dancefloor — extended percussion breaks, call-out sections, built for sweaty club momentum.',
    'club-banger':'Club banger — aggressive hi-hat work, sub-bass punch, fast BPM for the peak-hour set.'
  };
  const lgMap = {
    'english-clean':'English clean — fully English lyrics with Afrobeats cadence and phrasing (global market targeting).',
    'pidgin-english':'Pidgin English — Nigerian Creole mixed naturally; vibrant, culturally rooted, street-authentic.',
    'yoruba-heavy':'Yoruba heavy — significant Yoruba phrases and cultural references; language as identity statement.',
    'multilingual':'Multilingual — English + Pidgin + Yoruba (or other local) switching freely within one song.',
    'zulu-sotho':'Zulu/Sotho — South African language integration; works with amapiano or township influences.'
  };
  const vcMap = {
    'melodic-lead':'Melodic lead — primary vocal delivers hooky melodic lines; the groove serves the vocal.',
    'call-response':'Call-response — lead vocal sets phrase, secondary voice or ad-libs complete it; African vocal tradition.',
    'rap-feature':'Rap feature — half sung, half rapped; bilingual flow switching, bars braided into melodic sections.',
    'groove-rider':'Groove rider — vocal rides the rhythm rather than fighting it; percussive delivery.',
    'group-harmonies':'Group harmonies — stacked background parts, gospel-influenced choir energy under the lead.'
  };
  const erMap = {
    'highlife-roots':'Highlife roots — 1960s–80s West African highlife DNA; acoustic guitar, brass, community spirit.',
    'contemporary-afropop':'Contemporary Afropop — 2010s–present commercial afrobeats; crossed with trap/R&B production.',
    'future-afro':'Future Afro — futuristic production, electronic elements, forward-looking sound with African rhythm core.',
    'amapiano-piano':'Amapiano piano — log-drum bass, jazzy chord runs, 2020s SA sound.',
    'afroswing-uk':'Afroswing UK — 2017–2022 era Afrobeats/dancehall/grime hybrid; J Hus / Not3s lineage.'
  };
  const lgArr = Array.isArray(dims.afroLang)  ? dims.afroLang  : [dims.afroLang].filter(Boolean);
  const vcArr = Array.isArray(dims.afroVocal) ? dims.afroVocal : [dims.afroVocal].filter(Boolean);
  const parts = [];
  if (regMap[dims.afroRegion]) parts.push(`• REGION: ${regMap[dims.afroRegion]}`);
  if (grvMap[dims.afroGroove]) parts.push(`• GROOVE: ${grvMap[dims.afroGroove]}`);
  if (lgArr.length)            parts.push(`• LANGUAGE: ${lgArr.map(v => lgMap[v]).filter(Boolean).join(' / ')}`);
  if (vcArr.length)            parts.push(`• VOCALS: ${vcArr.map(v => vcMap[v]).filter(Boolean).join(' / ')}`);
  if (erMap[dims.afroEra])     parts.push(`• ERA: ${erMap[dims.afroEra]}`);
  return parts.length ? `\n\nAFROBEATS CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildReggaeDimBlock(dims) {
  if (!dims) return '';
  const eraMap = {
    'roots':'Roots reggae — 70s Kingston; Marley/Tosh/Burning Spear lineage; live horns, Hammond organ, conscious lyrics.',
    'dancehall-80s':'Dancehall 80s — digital riddims start here; sing-jay vocals, proto-digital drum machines (Sleng Teng era).',
    'digital-90s':'Digital 90s — fully electronic riddims, computerized bass, Buju/Beenie/Shabba era production.',
    'contemporary':'Contemporary reggae — modern production values, cleaner mixing, global-ear mastering; keeps roots DNA.',
    'rootscore':'Rootscore — modern roots revival; Chronixx/Protoje generation; analog warmth + modern clarity.'
  };
  const csMap = {
    'spiritual-rastafari':'Rastafari consciousness — Jah, Zion, Babylon, H.I.M. Selassie; spiritual framework is explicit.',
    'social-justice':'Social justice — system critique, poverty, inequality, police state; direct protest voice.',
    'love-devotion':'Love/Devotion — lovers rock tradition; tender romantic address, devotional lyric intimacy.',
    'nature-ital':'Nature/Ital — earth reverence, plant/herb references, natural living; anti-industrial framing.',
    'pan-african':'Pan-African — Africa as home/root, diaspora longing, Marcus Garvey / Black liberation themes.',
    'personal-reflection':'Personal reflection — interior life, doubts, growth, autobiographical honesty.'
  };
  const rhMap = {
    'one-drop':'One-drop — emphasis on beat 3; kick+snare together on 3, bass leaves beat 1 silent. The canonical roots feel.',
    'rockers':'Rockers — emphasis on all four beats; driving, forward-leaning; Sly Dunbar era innovation.',
    'steppers':'Steppers — four-on-the-floor kick; militant, marching energy; dub poets and later roots.',
    'nyahbinghi':'Nyahbinghi — Rastafari hand drums (bass/funde/repeater); ceremonial, sacred, pre-reggae rhythm source.',
    'skanking-offbeat':'Skanking offbeat — guitar/organ chop emphasizing the upbeat (the "and" of each beat); the sonic skank itself.'
  };
  const vcMap = {
    'melodic-lead':'Melodic lead — sung throughout, clear melody lines; Dennis Brown / Gregory Isaacs tradition.',
    'toasting-deejay':'Toasting/DJ — rhythmic speech over riddim; U-Roy / Big Youth / dancehall DJ lineage.',
    'harmonies':'Harmonies — stacked three-part harmonies; Wailers / Mighty Diamonds / Israel Vibration.',
    'chanting':'Chanting — Rastafari chant delivery; repetitive spiritual phrases over nyahbinghi rhythm.',
    'talking-blues':'Talking blues — spoken-word verse with sung chorus; dub poetry influence (Linton Kwesi Johnson).'
  };
  const otMap = {
    'extended-vamp':'Extended vamp outro — song continues 30–60s past final chorus; solo instruments trade over riddim.',
    'dub-breakdown':'Dub breakdown — elements strip away, reverb/delay on remaining parts; the mixing desk as instrument.',
    'fade-traditional':'Fade traditional — standard gradual volume fade; the song trails off into silence.',
    'reprise-acapella':'Reprise a cappella — final chorus stripped to voices only; congregational energy.'
  };
  const csArr = Array.isArray(dims.consciousness)  ? dims.consciousness  : [dims.consciousness].filter(Boolean);
  const vcArr = Array.isArray(dims.vocalApproach)  ? dims.vocalApproach  : [dims.vocalApproach].filter(Boolean);
  const parts = [];
  if (eraMap[dims.eraStyle])           parts.push(`• ERA: ${eraMap[dims.eraStyle]}`);
  if (csArr.length)                    parts.push(`• CONSCIOUSNESS: ${csArr.map(v => csMap[v]).filter(Boolean).join(' / ')}`);
  if (rhMap[dims.rhythmPattern])       parts.push(`• RHYTHM: ${rhMap[dims.rhythmPattern]}`);
  if (vcArr.length)                    parts.push(`• VOCAL: ${vcArr.map(v => vcMap[v]).filter(Boolean).join(' / ')}`);
  if (otMap[dims.outroTreatment])      parts.push(`• OUTRO: ${otMap[dims.outroTreatment]}`);
  return parts.length ? `\n\nREGGAE CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildNeosoulDimBlock(dims) {
  if (!dims) return '';
  const grMap = {
    'deep-pocket':'Deep pocket — drums sit slightly behind the beat; the space creates the groove (D\'Angelo / Voodoo).',
    'on-the-one':'On the one — funk accents on beat 1; crisp, disciplined pocket; Prince / Roots-era rhythm.',
    'hip-hop-influenced':'Hip-hop influenced — sampled-loop feel, boom-bap drum programming under live instrumentation.',
    'jazz-shuffled':'Jazz-shuffled — swung eighths, brushed snare, upright bass walking lines; Roy Ayers territory.',
    'afrobeat-locked':'Afrobeat-locked — polyrhythmic percussion, interlocking guitar patterns; Fela-influenced.',
    'organic-imperfect':'Organic/Imperfect — live room feel, tempo drift allowed, human timing over quantized precision.'
  };
  const vcMap = {
    'understated':'Understated vocal — restrained, conversational; the power lives in what\'s withheld (Erykah / early D\'Angelo).',
    'raw-gritty':'Raw/Gritty vocal — textured, imperfect, emotionally charged; Bilal / Jaguar Wright range.',
    'smooth-controlled':'Smooth/Controlled — silk-textured delivery, precise pitch, studio polish; Maxwell territory.',
    'falsetto-run':'Falsetto runs — upper register as primary voice; melisma as expressive vocabulary.',
    'spoken-whisper':'Spoken/Whisper — half-sung intimacy; seductive proximity, ASMR-adjacent.'
  };
  const hrMap = {
    'simple-soul':'Simple soul harmony — diatonic chords, classic I–IV–V–vi; the groove carries the sophistication.',
    'jazz-extended':'Jazz-extended — min9, maj9, 11ths and 13ths; sophisticated color tones over R&B foundation.',
    'gospel-borrowed':'Gospel-borrowed — passing dominants, plagal cadences, church harmony vocabulary.',
    'neo-blues':'Neo-blues — minor pentatonic melodies over soul chords; blues scale tension baked into hooks.',
    'chromatic-color':'Chromatic color — modulating chord qualities, passing tones, cinematic harmonic movement.'
  };
  const trMap = {
    'romantic-sensual':'Romantic/Sensual — adult intimacy, grown-folks love; sophisticated desire, not teen infatuation.',
    'self-empowerment':'Self-empowerment — interior affirmation, growth, reclaiming power; India.Arie territory.',
    'spiritual-reflective':'Spiritual/Reflective — prayer-adjacent, meditation on meaning; sacred energy in secular form.',
    'social-commentary':'Social commentary — race, justice, culture; Common/Erykah conscious strain.',
    'nostalgic-longing':'Nostalgic longing — memory as subject; specific places, specific eras, warm retrospection.',
    'vulnerable-confession':'Vulnerable confession — unguarded interior admission; letting listener see what\'s usually hidden.'
  };
  const arMap = {
    'bare-bones':'Bare-bones — voice + one instrument (guitar or Rhodes); minimal arrangement, maximum intimacy.',
    'full-band':'Full band — drums, bass, keys, guitar, horns; classic neo-soul ensemble texture.',
    'sample-chopped':'Sample-chopped — dusty loop layered under live instrumentation; Dilla-adjacent feel.',
    'strings-elevated':'Strings elevated — quartet or larger string arrangement over rhythm section; cinematic scope.',
    'electronic-layered':'Electronic layered — analog synths, drum machine layers, electronic textures woven with organic instruments.'
  };
  const grArr = Array.isArray(dims.groove)    ? dims.groove    : [dims.groove].filter(Boolean);
  const trArr = Array.isArray(dims.territory) ? dims.territory : [dims.territory].filter(Boolean);
  const parts = [];
  if (grArr.length)             parts.push(`• GROOVE: ${grArr.map(v => grMap[v]).filter(Boolean).join(' / ')}`);
  if (vcMap[dims.vocal])        parts.push(`• VOCAL: ${vcMap[dims.vocal]}`);
  if (hrMap[dims.harmony])      parts.push(`• HARMONY: ${hrMap[dims.harmony]}`);
  if (trArr.length)             parts.push(`• TERRITORY: ${trArr.map(v => trMap[v]).filter(Boolean).join(' / ')}`);
  if (arMap[dims.arrange])      parts.push(`• ARRANGEMENT: ${arMap[dims.arrange]}`);
  return parts.length ? `\n\nNEO-SOUL CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildReggaetonDimBlock(dims) {
  if (!dims) return '';
  const dwMap = {
    'raw-underground':'Raw underground — El General / Panama roots; distorted low-fi dembow, street aggression.',
    'polished-pop':'Polished pop — clean modern mix, crossover-ready; Daddy Yankee / Wisin era gloss.',
    'trap-hybrid':'Trap hybrid — dembow bones under trap hi-hat patterns; Bad Bunny / Anuel axis.',
    'electro-digital':'Electro-digital — EDM-leaning production, synth leads, festival energy; J Balvin pop-electronic mode.',
    'perreo-intense':'Perreo intense — heavy dembow, club-dominant low-end, sexual intensity turned up.'
  };
  const tfMap = {
    'classic-90':'Classic 90 BPM — original reggaeton tempo; Daddy Yankee / Don Omar golden-era pocket.',
    'modern-96':'Modern 96 BPM — current commercial reggaeton tempo sweet spot; urbano mainstream.',
    'slowed-88':'Slowed 88 BPM — relaxed perreo tempo, sensual emphasis over party momentum.',
    'fast-100':'Fast 100 BPM — higher-energy reggaeton, pushing toward merengue/urban fusion speeds.',
    'bounce-vibes':'Bounce vibes — buoyant, swinging pocket; the rhythm smiles rather than stomps.'
  };
  const vbMap = {
    'party':'Party vibe — club celebration, weekend energy, collective euphoria focus.',
    'sensual-perreo':'Sensual/Perreo — dance-floor intimacy, body-forward lyric, heat in the hook.',
    'street-real':'Street/Real — barrio authenticity, hustle narrative, urban grit.',
    'romantic':'Romantic — sincere love songs over reggaeton rhythm; tender address over dembow.',
    'trap-aggressive':'Trap-aggressive — flex energy, menace, confidence as threat; Anuel AA territory.',
    'summer-vibes':'Summer vibes — beach/tropical imagery, vacation euphoria, bright sunny production.'
  };
  const fsMap = {
    'conversational':'Conversational flow — natural speech cadence in rhyme; lyric feels like talk not rap.',
    'trap-staccato':'Trap-staccato — short punched syllables, triplet hi-hat flow, trap rhythmic DNA.',
    'melodic-sung':'Melodic-sung — hook-led, sung refrains over rapped verses; modern pop-reggaeton.',
    'rapid-fire':'Rapid-fire — high syllable density, tongue-twister sections, bar-heavy verses.',
    'bounce-flow':'Bounce flow — flow rides the dembow bounce; rhythm and rhyme lock into the riddim elastically.'
  };
  const lgMap = {
    'pure-spanish':'Pure Spanish — 100% Spanish lyrics; no English intrusions; authentic urbano identity.',
    'spanglish':'Spanglish — natural code-switching between Spanish and English; diaspora identity.',
    'english-forward':'English-forward — English primary, Spanish phrases for flavor; crossover targeting.',
    'regional-slang':'Regional slang — heavy PR / DR / Colombian / Mexican slang; local identity markers embedded.'
  };
  const arMap = {
    'solo':'Solo — single-artist performance throughout; no featured voices.',
    'duo-feature':'Duo feature — main artist + one guest feature; classic reggaeton collab format.',
    'female-lead':'Female lead — reggaetonera takes primary voice; Karol G / Ivy Queen energy.',
    'collab-ensemble':'Collab ensemble — 3+ artists trading verses; posse cut format, radio-hit ensemble.'
  };
  const vbArr = Array.isArray(dims.vibe) ? dims.vibe : [dims.vibe].filter(Boolean);
  const parts = [];
  if (dwMap[dims.dembowWeight])   parts.push(`• DEMBOW: ${dwMap[dims.dembowWeight]}`);
  if (tfMap[dims.tempoFeel])      parts.push(`• TEMPO: ${tfMap[dims.tempoFeel]}`);
  if (vbArr.length)               parts.push(`• VIBE: ${vbArr.map(v => vbMap[v]).filter(Boolean).join(' / ')}`);
  if (fsMap[dims.flowStyle])      parts.push(`• FLOW: ${fsMap[dims.flowStyle]}`);
  if (lgMap[dims.language])       parts.push(`• LANGUAGE: ${lgMap[dims.language]}`);
  if (arMap[dims.arrangement])    parts.push(`• ARRANGEMENT: ${arMap[dims.arrangement]}`);
  return parts.length ? `\n\nREGGAETON CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildLatinDimBlock(dims) {
  if (!dims) return '';
  const rsMap = {
    'salsa':'Salsa — Afro-Cuban clave foundation; piano montuno, horn stabs, congas/timbales; NY/PR/Cuban tradition.',
    'merengue':'Merengue — Dominican 2/4 tambora rhythm; accordion/brass lead; fast, celebratory, dance-forward.',
    'cumbia':'Cumbia — Colombian origin, accordion-led; slower gait, hip-sway tempo, universal across Latin America.',
    'bachata':'Bachata — Dominican guitar-led; romantic, melancholic; Aventura/Romeo Santos modern crossover.',
    'bossa-fusion':'Bossa fusion — Brazilian bossa nova DNA blended with Latin; nylon guitar, soft percussion, cool lyric.',
    'mariachi':'Mariachi — Mexican traditional ensemble; vihuela, guitarrón, trumpets, violin; declarative romantic song.',
    'bolero':'Bolero — slow romantic ballad tradition; Cuban/Mexican origins; lush orchestration, declarative love lyric.',
    'ranchera':'Ranchera — Mexican rural tradition; 3/4 waltz or 4/4 polka feel; heartbreak, pride, tequila narratives.'
  };
  const riMap = {
    'declarative-passionate':'Declarative passionate — grand romantic declarations, high-stakes emotional address.',
    'tender-nostalgic':'Tender nostalgic — soft affection remembered; past-tense love with present-tense tenderness.',
    'playful-teasing':'Playful teasing — flirtatious banter, chasing energy, light erotic humor.',
    'bittersweet-longing':'Bittersweet longing — love lost or unattained; aching without bitterness, dignified sorrow.',
    'hot-seductive':'Hot/Seductive — intimate heat, physical desire foregrounded; sensual directness.'
  };
  const laMap = {
    'spanish-only':'Spanish only — 100% Spanish lyric; traditional Latin authenticity.',
    'bilingual':'Bilingual — natural English/Spanish verse alternation; crossover balance.',
    'english-spanish-mix':'English/Spanish mix — English primary with Spanish phrases for flavor; US crossover targeting.',
    'formal-castilian':'Formal Castilian — literary Spanish register; sophisticated vocabulary, elevated diction.',
    'regional-dialect':'Regional dialect — country-specific Spanish (Mexican / Cuban / Argentine / Colombian); identity-rooted.'
  };
  const iMap = {
    'piano-montuno':'Piano montuno — syncopated two-handed piano pattern; salsa engine-room sound.',
    'brass-section':'Brass section — trumpets/trombones with horn stabs and mambo breaks; Latin big-band texture.',
    'guitar-riff':'Guitar — nylon or requinto lead; bachata-style arpeggios or mariachi strumming.',
    'accordion':'Accordion lead — Tex-Mex / cumbia / merengue melodic signature.',
    'violin-charanga':'Violin/Charanga — charanga ensemble texture; violins as melodic lead over rhythm section.',
    'congas-rhythm':'Congas-rhythm forward — percussion as melodic voice; tumbao patterns drive the song.'
  };
  const deMap = {
    'low-romantic':'Low romantic energy — slow bolero/bachata intimacy; close-couple dancing, ballad mode.',
    'medium-sensual':'Medium sensual — mid-tempo groove; hip-movement dancing, subtle seduction.',
    'high-salsa':'High salsa energy — fast breakdown sections, mambo bridges, dancer-focused intensity.',
    'full-party':'Full party — peak-hour celebration, all-hands dancing, uninterrupted energy.',
    'ballroom-formal':'Ballroom formal — structured dance-form (tango-adjacent discipline), formal pacing.'
  };
  const iArr = Array.isArray(dims.instrumentation_lead) ? dims.instrumentation_lead : [dims.instrumentation_lead].filter(Boolean);
  const parts = [];
  if (rsMap[dims.rhythm_style])         parts.push(`• RHYTHM: ${rsMap[dims.rhythm_style]}`);
  if (riMap[dims.romantic_intensity])   parts.push(`• ROMANTIC INTENSITY: ${riMap[dims.romantic_intensity]}`);
  if (laMap[dims.language_approach])    parts.push(`• LANGUAGE: ${laMap[dims.language_approach]}`);
  if (iArr.length)                      parts.push(`• INSTRUMENT LEAD: ${iArr.map(v => iMap[v]).filter(Boolean).join(' / ')}`);
  if (deMap[dims.dance_energy])         parts.push(`• DANCE ENERGY: ${deMap[dims.dance_energy]}`);
  return parts.length ? `\n\nLATIN CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildDancehallDimBlock(dims) {
  if (!dims) return '';
  const vsMap = {
    'singjay':'Singjay — half-sung half-rapped; melodic sections drop into toast patterns; Buju Banton / Cutty Ranks lineage.',
    'deejay-toasting':'Deejay toasting — pure rhythmic chat over riddim; Shabba Ranks / Yellowman classic toasting.',
    'singing-melodic':'Singing melodic — fully sung over dancehall riddim; Beres Hammond / Jah Cure modern lovers-rock.',
    'chat-style':'Chat style — rapid-fire spoken delivery, syllable-forward; tongue-twister bar-heavy patois.',
    'hyper-vocoder':'Hyper/Vocoder — auto-tuned modern delivery; Vybz Kartel post-2010 processed vocal aesthetic.'
  };
  const elMap = {
    'bashment-intense':'Bashment intense — aggressive clash energy; Sting stage-show territory; dangerous-kinetic mood.',
    'party-hype':'Party hype — dancehall session energy; lively crowd-response lyric, weekend celebration.',
    'cool-and-deadly':'Cool and deadly — controlled menace; smooth flow with threat in the subtext; don-dada composure.',
    'slack-sensual':'Slack/Sensual — explicit dancefloor lyric; body-forward, dance-move instruction, adult territory.',
    'spiritual-conscious':'Spiritual conscious — Rasta-adjacent message over dancehall riddim; Sizzla / Capleton energy.'
  };
  const peMap = {
    'roots-digital-80s':'Roots-digital 80s — Sleng Teng era; first digital riddims, Casio-style synth lines.',
    'golden-90s':'Golden 90s — Steely & Clevie era; peak dancehall riddim craft; Bogle dance culture.',
    'modern-2010s':'Modern 2010s — contemporary dancehall production; cleaner mix, pop-crossover polish.',
    'trap-fusion-2020s':'Trap-fusion 2020s — trap drum programming under dancehall rhythmic DNA; global modern sound.',
    'vintage-dancehall':'Vintage dancehall — 70s–early 80s pre-digital; King Tubby era live-riddim dub roots.'
  };
  const pdMap = {
    'pure-patois':'Pure patois — 100% Jamaican Creole; authentic linguistic identity, no translation accommodation.',
    'mixed-patois-english':'Mixed patois-English — natural code-switching; patois verses, English hooks; crossover balance.',
    'light-patois':'Light patois — English primary with patois phrases and accent markers; accessibility forward.',
    'english-heavy':'English heavy — mostly Standard Jamaican English; dancehall rhythm without heavy patois.',
    'jamaican-accent':'Jamaican accent only — English lyric with pronunciation shaped by JA phonology; no patois grammar.'
  };
  const rtMap = {
    'classic-riddim':'Classic riddim — song uses a named traditional riddim (Sleng Teng / Answer / Diwali) — same riddim as other songs.',
    'original-riddim':'Original riddim — custom riddim built for this song; modern single-song production approach.',
    'trap-riddim':'Trap riddim — 808-heavy trap beat structure under dancehall vocal style.',
    'foreign-collab':'Foreign collab — riddim blending dancehall with Afrobeats / UK garage / Latin production.',
    'one-drop-dancehall':'One-drop dancehall — reggae-derived one-drop rhythm programmed at dancehall tempo.'
  };
  const peArr = Array.isArray(dims.productionEra)   ? dims.productionEra   : [dims.productionEra].filter(Boolean);
  const rtArr = Array.isArray(dims.riddimTreatment) ? dims.riddimTreatment : [dims.riddimTreatment].filter(Boolean);
  const parts = [];
  if (vsMap[dims.vocalStyle])     parts.push(`• VOCAL STYLE: ${vsMap[dims.vocalStyle]}`);
  if (elMap[dims.energyLevel])    parts.push(`• ENERGY: ${elMap[dims.energyLevel]}`);
  if (peArr.length)               parts.push(`• ERA: ${peArr.map(v => peMap[v]).filter(Boolean).join(' / ')}`);
  if (pdMap[dims.patoisDensity])  parts.push(`• PATOIS: ${pdMap[dims.patoisDensity]}`);
  if (rtArr.length)               parts.push(`• RIDDIM: ${rtArr.map(v => rtMap[v]).filter(Boolean).join(' / ')}`);
  return parts.length ? `\n\nDANCEHALL CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildGospelDimBlock(dims) {
  if (!dims) return '';
  const eaMap = {
    'devotional':'Devotional arc — intimate personal worship; whispered/conversational address to God; Sunday-morning reverence.',
    'celebratory':'Celebratory arc — victory energy; clapping, shouting, testimony-after-breakthrough mood.',
    'altar-call':'Altar-call arc — final invitation mode; slow build asking for surrender/commitment; long sustained chords.',
    'mid-service':'Mid-service arc — praise break energy; tempo up, full congregation engaged, dancing in the aisles.',
    'praise-worship':'Praise & worship — contemporary P&W ballad structure; verse intimate → chorus anthemic lift.'
  };
  const chMap = {
    'solo-lead':'Solo lead — single lead voice carries the song; minimal background support.',
    'choir-response':'Choir response — lead voice + choir answering in call-and-response patterns; AME tradition.',
    'full-mass-choir':'Full mass choir — 30+ voice choir as primary texture; Kirk Franklin / Hezekiah Walker scale.',
    'contemporary-worship-band':'Contemporary worship band — lead vocalist + backing vocalists + full band; Hillsong / Bethel model.',
    'a-cappella-group':'A cappella group — voices only, no instrumentation; Take 6 / gospel quartet tradition.'
  };
  const prMap = {
    'traditional':'Traditional gospel — B3 organ, piano, live drums; James Cleveland / Walter Hawkins sonic DNA.',
    'contemporary-praise':'Contemporary praise — modern P&W production; pad-forward mix, pop-polished worship.',
    'hip-hop-gospel':'Hip-hop gospel — rap elements, trap drums, contemporary urban production; Lecrae / Kirk Franklin collabs.',
    'neo-soul-gospel':'Neo-soul gospel — Rhodes/Wurlitzer warmth, jazz-extended harmony; Lalah Hathaway / gospel+neo-soul fusion.',
    'acoustic-raw':'Acoustic raw — piano+voice or guitar+voice; stripped worship, unvarnished vulnerability.'
  };
  const lfMap = {
    'testimony':'Testimony — personal story of what God has done; specific narrative, autobiographical detail.',
    'praise-worship':'Praise/Worship — direct address to God; declaring attributes, honoring, adoring.',
    'prophetic-declaration':'Prophetic declaration — speaking forward, claiming promises, faith-declaration lyric.',
    'hope-breakthrough':'Hope/Breakthrough — encouragement for struggle; "keep going" theology, endurance lyric.',
    'lamentation-prayer':'Lamentation/Prayer — honest grief before God; psalm-style honesty, not forced triumph.',
    'social-gospel':'Social gospel — justice and community uplift; Civil Rights lineage of Mahalia / Sam Cooke prophetic voice.'
  };
  const viMap = {
    'whisper-intimate':'Whisper/Intimate — soft private delivery; close-mic devotional hush.',
    'full-voice':'Full voice — confident sustained delivery; congregational singability.',
    'sanctified-runs':'Sanctified runs — melismatic virtuosity; gospel run vocabulary as expressive language.',
    'choir-swell':'Choir swell — lead + choir building together toward climax shouts; traditional Sunday peak.',
    'quiet-storm':'Quiet storm — contemporary gospel mellow mode; smooth, adult-contemporary sacred delivery.'
  };
  const chArr = Array.isArray(dims.choir)      ? dims.choir      : [dims.choir].filter(Boolean);
  const lfArr = Array.isArray(dims.lyricFocus) ? dims.lyricFocus : [dims.lyricFocus].filter(Boolean);
  const parts = [];
  if (eaMap[dims.energyArc])       parts.push(`• ARC: ${eaMap[dims.energyArc]}`);
  if (chArr.length)                parts.push(`• CHOIR: ${chArr.map(v => chMap[v]).filter(Boolean).join(' / ')}`);
  if (prMap[dims.production])      parts.push(`• PRODUCTION: ${prMap[dims.production]}`);
  if (lfArr.length)                parts.push(`• LYRIC FOCUS: ${lfArr.map(v => lfMap[v]).filter(Boolean).join(' / ')}`);
  if (viMap[dims.vocalIntensity])  parts.push(`• INTENSITY: ${viMap[dims.vocalIntensity]}`);
  return parts.length ? `\n\nGOSPEL CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildParodyDimBlock(dims) {
  if (!dims) return '';
  const targetMap = {
    'specific-hit-song':    'Target a specific well-known hit — match its song structure, melodic contour, cadence, and signature hook shape closely enough that listeners recognize it instantly.',
    'genre-parody':         'Parody an entire genre, not one song — lampoon the genre\'s clichés, production tropes, and lyrical conventions in aggregate.',
    'artist-style-parody':  'Parody a specific artist\'s stylistic fingerprint — their vocal quirks, phrasing, pet topics, production signatures — without copying any single song verbatim.',
    'cultural-trend':       'Parody a current cultural trend, fad, or moment — the song is an affectionate/mocking time capsule of a thing everyone is doing right now.',
    'movie-tv-franchise':   'Parody a movie/TV franchise — lean on characters, catchphrases, and iconography; music cues the source but the lyric is the joke.'
  };
  const modeMap = {
    'style-match-subvert-lyric': 'Weird Al mode: match the original\'s musical style faithfully while replacing the lyric with the comedic premise — sonic respect, lyrical mischief.',
    'change-both':               'Change both music and lyric — use the reference only as comedic springboard; the final song stands alone musically from its target.',
    'close-homage':              'Close homage — affectionate parody that celebrates the target; jokes land softly, the source gets a wink, not a kick.',
    'outright-mockery':          'Outright mockery — the target is the butt of the joke; exaggerate and deflate the source\'s self-seriousness or pretension.'
  };
  const humorMap = {
    'absurdist':         'Absurdist — non-sequitur logic, escalating nonsense, images that don\'t follow (Tim & Eric / Lonely Island weird mode).',
    'deadpan':           'Deadpan — deliver comedic content in a flat, earnest register; the gap between tone and content is the joke (Flight of the Conchords mode).',
    'crude':             'Crude — body humor, bathroom jokes, shock laughs; leaning into taboo for punchline force.',
    'witty-wordplay':    'Witty wordplay — puns, double meanings, clever rhyme switchbacks, and setup/reversal craftsmanship (Weird Al / Stephen Lynch).',
    'referential-nerdy': 'Referential/nerdy — jokes that reward pop-culture literacy; in-jokes, Easter eggs, fandom callouts.'
  };
  const topicMap = {
    'current-events':        'Topic territory: current events / news cycle — the song is legible today and may not be next year.',
    'food-consumer':         'Topic territory: food, brands, consumer products — snack-specific comedy with brand-name specificity.',
    'tech-internet':         'Topic territory: tech, apps, internet habits, AI — the comedy of being very online.',
    'relationships-dating':  'Topic territory: dating, relationships, apps, modern romance — awkward, rueful, specific to now.',
    'work-adulting':         'Topic territory: jobs, bills, adulting, domestic failure — the comedy of mundane obligation.',
    'pop-culture-meta':      'Topic territory: pop culture meta — songs about songs, celebrities, the music industry itself.'
  };
  const prodMap = {
    'exact-sonic-clone':    'Production faithfulness: exact sonic clone — instrumentation, mix, arrangement match target so tightly the joke hits on pure lyric.',
    'approximation':        'Production faithfulness: approximation — evoke the target style with clear fingerprints but don\'t imitate note-for-note.',
    'loose-gesture':        'Production faithfulness: loose gesture — genre signals present but production stands on its own; comedy leads, mimicry follows.',
    'cheap-parody-obvious': 'Production faithfulness: cheap/obvious — intentionally cheesy karaoke/MIDI vibe; the lo-fi is part of the joke.'
  };
  const humorArr = Array.isArray(dims.humorRegister) ? dims.humorRegister : [dims.humorRegister].filter(Boolean);
  const parts = [];
  if (targetMap[dims.targetType])              parts.push(`• TARGET TYPE: ${targetMap[dims.targetType]}`);
  if (modeMap[dims.parodyMode])                parts.push(`• PARODY MODE: ${modeMap[dims.parodyMode]}`);
  if (humorArr.length)                         parts.push(`• HUMOR REGISTER: ${humorArr.map(v => humorMap[v]).filter(Boolean).join(' / ')}`);
  if (topicMap[dims.topicTerritory])           parts.push(`• TOPIC: ${topicMap[dims.topicTerritory]}`);
  if (prodMap[dims.productionFaithfulness])    parts.push(`• PRODUCTION FAITHFULNESS: ${prodMap[dims.productionFaithfulness]}`);
  return parts.length ? `\n\nPARODY CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildComedyDimBlock(dims) {
  if (!dims) return '';
  const styleMap = {
    'stand-up-musical':        'Stand-up musical — one comedian at a piano/guitar; the song is an extended bit with musical punctuation (Bo Burnham / Tim Minchin).',
    'character-bit':           'Character bit — narrator is a distinct comedic persona whose voice/worldview drives the song (Flight of the Conchords characters).',
    'parody-adjacent-original':'Parody-adjacent but original — genre-savvy original song whose comedy comes from knowing the tropes it plays in.',
    'musical-theatre-comedy':  'Musical theatre comedy — Broadway-leaning structure with comedic patter songs, list songs, and theatrical vocal delivery.',
    'novelty-song':            'Novelty song — a one-concept song built around a catchy premise; radio-friendly earworm with a wink.',
    'internet-meme-song':      'Internet/meme song — short, repeatable, loopable; designed for TikTok/YouTube spread; hook is the entire product.'
  };
  const densityMap = {
    'setup-punchline-structure': 'Joke density: setup/punchline structure — most lines build to a turn; verses establish, choruses or line-ends land.',
    'running-gag':               'Joke density: running gag — one recurring bit returns and escalates; each return earns bigger laugh through repetition.',
    'one-big-absurd-premise':    'Joke density: one big absurd premise — commit hard to a single ridiculous world/scenario and explore it earnestly.',
    'callback-heavy':            'Joke density: callback-heavy — setup early jokes whose payoff lands 2-3 sections later; reward attentive listening.',
    'joke-per-line':             'Joke density: joke-per-line — every line is a punchline; rapid-fire density (Lonely Island / Bo Burnham verse mode).'
  };
  const regMap = {
    'family-safe':    'Language register: family-safe — no profanity, no adult content; works across all ages.',
    'adult-clever':   'Language register: adult-clever — grown-up references and innuendo, minimal profanity; clever-not-crude.',
    'crude-raunchy':  'Language register: crude/raunchy — explicit language, sex/body jokes, shock welcome; adult audience only.',
    'clean-cerebral': 'Language register: clean cerebral — intellectual humor; no profanity but references assume educated listener.'
  };
  const subjMap = {
    'everyday-absurdity':         'Subject: everyday absurdity — finding the comedy in banal routines, objects, and interactions.',
    'relationships-dating':       'Subject: relationships/dating — the comedy of romance, texts, apps, exes, misunderstandings.',
    'workplace-modern-life':      'Subject: workplace / modern life — meetings, bosses, rent, commutes, bureaucratic absurdity.',
    'food-obsessions':            'Subject: food obsessions — specific food items elevated to devotional / comedic object status.',
    'tech-internet-culture':      'Subject: tech / internet culture — apps, algorithms, being online, AI, digital identity.',
    'observational-human-nature': 'Subject: observational human nature — the universal small hypocrisies people do and deny.'
  };
  const musMap = {
    'polished-musical':    'Musicality: polished — the arrangement is tight, melodic, radio-viable; comedy sits on legitimately good songcraft.',
    'intentionally-bad':   'Musicality: intentionally bad — cheesy keyboard presets, flat mix, exaggerated amateurishness as the joke.',
    'earnest-underneath':  'Musicality: earnest underneath — the music is genuinely moving; laughs come from the lyric gap against sincere sonics.',
    'deadpan-melodic':     'Musicality: deadpan melodic — pretty, calm melody delivered with flat affect; tonal contrast powers the comedy.'
  };
  const subjArr = Array.isArray(dims.subjectMatter) ? dims.subjectMatter : [dims.subjectMatter].filter(Boolean);
  const parts = [];
  if (styleMap[dims.comedicStyle])       parts.push(`• COMEDIC STYLE: ${styleMap[dims.comedicStyle]}`);
  if (densityMap[dims.jokeDensity])      parts.push(`• JOKE DENSITY: ${densityMap[dims.jokeDensity]}`);
  if (regMap[dims.languageRegister])     parts.push(`• LANGUAGE REGISTER: ${regMap[dims.languageRegister]}`);
  if (subjArr.length)                    parts.push(`• SUBJECT: ${subjArr.map(v => subjMap[v]).filter(Boolean).join(' / ')}`);
  if (musMap[dims.musicality])           parts.push(`• MUSICALITY: ${musMap[dims.musicality]}`);
  return parts.length ? `\n\nCOMEDY CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildChildrenDimBlock(dims) {
  if (!dims) return '';
  const ageMap = {
    'toddler-2-4':      'Age target: toddlers 2-4 — simple one-syllable words, extreme repetition, short lines, concrete objects; no abstract concepts, no scary content.',
    'pre-k-4-6':        'Age target: pre-K 4-6 — short sentences, simple rhymes, familiar everyday vocabulary; fun sounds, animals, counting, colors welcome.',
    'elementary-6-10':  'Age target: elementary 6-10 — more vocabulary range, narrative arcs with beginning/middle/end, light humor and playful wordplay.',
    'tween-10-13':      'Age target: tween 10-13 — real feelings, friendship complexity, mild self-awareness; never adult themes, profanity, or romantic content.'
  };
  const eduMap = {
    'pure-fun':                   'Educational intent: pure fun — no curriculum; joy, silliness, and imagination are the entire goal.',
    'counting-alphabet-basics':   'Educational intent: counting / alphabet / basics — teach numbers, letters, shapes, colors through catchy repetition.',
    'social-emotional-learning':  'Educational intent: social-emotional learning — naming feelings, kindness, sharing, bravery, handling big emotions with gentle framing.',
    'science-nature':             'Educational intent: science/nature — animals, weather, space, ecosystems explained accurately at the target age level.',
    'life-skills':                'Educational intent: life skills — brushing teeth, tying shoes, bedtime routines, safety, manners presented as fun rituals.'
  };
  const melMap = {
    'singsong-nursery':     'Melody style: singsong nursery — simple stepwise pentatonic/major melody; "Twinkle Twinkle" / "Wheels on the Bus" shape.',
    'folk-simple':          'Melody style: folk simple — acoustic-guitar-friendly, 3-4 chord melody with story arc; Raffi / Pete Seeger lineage.',
    'modern-pop-catchy':    'Melody style: modern pop-catchy — bright contemporary pop hook shape at kid-friendly tempo and range.',
    'movement-song-action': 'Movement/action song — melody supports physical actions (clap, jump, spin); built for call-and-do participation.',
    'lullaby-quiet':        'Melody style: lullaby — slow, soothing, low-dynamic; descending phrases designed to settle a child toward sleep.'
  };
  const prodMap = {
    'acoustic-bright':       'Production: acoustic bright — acoustic guitar, light shaker, hand percussion, warm friendly mix; no harsh sounds.',
    'synth-friendly':        'Production: synth-friendly — playful toy-keyboard/synth bleeps, bright major-key patches; bubbly modern kids-TV palette.',
    'orchestral-full':       'Production: orchestral full — Disney/Pixar-style arrangement with strings, woodwinds, light brass; cinematic and warm.',
    'stripped-voice-guitar': 'Production: stripped voice + guitar — single voice with acoustic guitar; intimate campfire/bedtime feel.'
  };
  const lyrMap = {
    'storytelling':        'Lyric approach: storytelling — a narrative with characters, a problem, and a resolution; clear beginning/middle/end.',
    'repetition-chant':    'Lyric approach: repetition/chant — core phrase repeats heavily so kids learn it fast and sing along immediately.',
    'question-answer':     'Lyric approach: question/answer — lead asks, children answer back; structured for classroom/group participation.',
    'list-song':           'Lyric approach: list song — cataloging items (animals, colors, foods); cumulative structure with each verse adding one.',
    'direct-instruction':  'Lyric approach: direct instruction — lyrics explicitly teach the target concept step-by-step in friendly tone.'
  };
  const eduArr = Array.isArray(dims.educationalIntent) ? dims.educationalIntent : [dims.educationalIntent].filter(Boolean);
  const parts = [];
  if (ageMap[dims.ageTarget])       parts.push(`• AGE TARGET: ${ageMap[dims.ageTarget]}`);
  if (eduArr.length)                parts.push(`• EDUCATIONAL INTENT: ${eduArr.map(v => eduMap[v]).filter(Boolean).join(' / ')}`);
  if (melMap[dims.melodyStyle])     parts.push(`• MELODY STYLE: ${melMap[dims.melodyStyle]}`);
  if (prodMap[dims.production])     parts.push(`• PRODUCTION: ${prodMap[dims.production]}`);
  if (lyrMap[dims.lyricApproach])   parts.push(`• LYRIC APPROACH: ${lyrMap[dims.lyricApproach]}`);
  const safetyClause = '\n• SAFETY CLAUSE: Lyrics must be age-appropriate — no profanity, no violence, no romantic/sexual content, no scary or distressing imagery, no substance references. Keep language gentle, inclusive, and kind.';
  return parts.length ? `\n\nCHILDREN CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}${safetyClause}` : '';
}

function buildPopDimBlock(dims) {
  if (!dims) return '';
  const eraMap = {
    'y2k-bubblegum':'Y2K bubblegum pop — Britney/Xtina era; gated snares, layered vocal stacks, sugar-bright production.',
    'early-00s-teen-pop':'Early 00s teen pop — crisp 4-on-floor, pop-punk adjacent, Disney Radio polish; Kelly Clarkson/early Pink.',
    '2010s-edm-pop':'2010s EDM-pop — big drops, supersaw leads, chorus-as-beat; Calvin Harris crossover template.',
    '2020s-bedroom-pop':'2020s bedroom pop — close-mic whisper vocals, lo-fi warmth, diaristic intimacy; Billie Eilish/Clairo.',
    'timeless-classic':'Timeless classic pop — 60s-70s melodic sensibility, Beatles/Carole King DNA; songwriter-forward.'
  };
  const hkMap = {
    'title-in-first-line':'Title-in-first-line — hook stated immediately, no slow burn; Max Martin melodic math.',
    'pre-chorus-lift':'Pre-chorus lift — climbing melody and harmony pushing into chorus; the lift IS the hook.',
    'post-chorus-earworm':'Post-chorus earworm — wordless or short-phrase repeat after chorus; the part you hum leaving the club.',
    'melodic-ad-lib-tag':'Melodic ad-lib tag — signature vocal motif (Mariah whistle, Rihanna "ay"); artist identity as hook.',
    'repetition-mantra':'Repetition mantra — same phrase repeated 8+ times with subtle variation; hypnotic hook.'
  };
  const vpMap = {
    'stadium-belter':'Stadium belter — sustained high notes, chest voice power, arena-ready projection.',
    'intimate-diary':'Intimate diary — conversational, whispered at times, close-mic presence; confession to one listener.',
    'playful-flirt':'Playful flirt — smirking delivery, head voice bounce, charm over power.',
    'cool-detached':'Cool detached — monotone-adjacent, emotional remove, stylized apathy; Lorde/Lana aesthetic.',
    'theatrical-diva':'Theatrical diva — operatic phrasing, character-driven, showstopping peaks; Gaga/Adele range.'
  };
  const prMap = {
    'maximalist-wall':'Maximalist wall of sound — dense layers, every frequency filled, Max Martin/Dr Luke density.',
    'polished-radio':'Polished radio — cleanly mixed, everything in its place, optimized for broadcast compression.',
    'minimal-vocal-forward':'Minimal vocal-forward — sparse arrangement, vocal dominant, space around every element.',
    'lofi-bedroom':'Lo-fi bedroom — tape hiss, slight distortion, imperfection preserved; DIY aesthetic.',
    'hyperpop-glitch':'Hyperpop glitch — pitch-shifted vocals, digital artifacts, PC Music/100 gecs aggressive maximalism.'
  };
  const ltMap = {
    'heart-relational':'Heart/Relational — love, heartbreak, relationships; the core pop lyrical territory.',
    'party-liberation':'Party/Liberation — weekend freedom, dance-floor catharsis, hedonic celebration.',
    'empowerment-self':'Self-empowerment — reclaiming power, bouncing back, self-worth affirmation.',
    'coming-of-age':'Coming-of-age — adolescent becoming, identity formation, first experiences.',
    'melancholy-nostalgia':'Melancholy nostalgia — beautiful sadness, longing for past, bittersweet memory.'
  };
  const hkArr = Array.isArray(dims.hookStrategy)   ? dims.hookStrategy   : [dims.hookStrategy].filter(Boolean);
  const ltArr = Array.isArray(dims.lyricTerritory) ? dims.lyricTerritory : [dims.lyricTerritory].filter(Boolean);
  const parts = [];
  if (eraMap[dims.eraAesthetic])    parts.push(`• ERA: ${eraMap[dims.eraAesthetic]}`);
  if (hkArr.length)                 parts.push(`• HOOK: ${hkArr.map(v => hkMap[v]).filter(Boolean).join(' / ')}`);
  if (vpMap[dims.vocalPersona])     parts.push(`• VOCAL: ${vpMap[dims.vocalPersona]}`);
  if (prMap[dims.productionPolish]) parts.push(`• PRODUCTION: ${prMap[dims.productionPolish]}`);
  if (ltArr.length)                 parts.push(`• TERRITORY: ${ltArr.map(v => ltMap[v]).filter(Boolean).join(' / ')}`);
  return parts.length ? `\n\nPOP CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildRnbDimBlock(dims) {
  if (!dims) return '';
  const eMap = {
    'classic-60s-soul':'Classic 60s soul — Motown/Stax era; horn sections, live band, gospel-adjacent vocal; Otis/Aretha DNA.',
    '80s-quiet-storm':'80s Quiet Storm — lush synth pads, sax solos, slow-jam ballad territory; Luther/Anita Baker.',
    '90s-new-jack-swing':'90s New Jack Swing — hip-hop swing beat + R&B melody; Teddy Riley production; Bobby Brown/Guy era.',
    '2000s-neo-rnb':'2000s Neo-R&B — Timbaland/Neptunes production, Aaliyah/Usher/Beyoncé golden era.',
    'modern-alt-rnb':'Modern alt-R&B — atmospheric, introspective; Frank Ocean/Solange/SZA; reverb-soaked, genre-blurred.'
  };
  const vdMap = {
    'melismatic-runs':'Melismatic runs — virtuosic vocal ornamentation, multi-note syllables; gospel-derived R&B vocabulary.',
    'falsetto-feature':'Falsetto feature — upper register as primary voice; Maxwell/Miguel/The-Dream territory.',
    'spoken-word-bridge':'Spoken-word bridge — half-sung conversational address, intimate breaks; Erykah/D\'Angelo moments.',
    'layered-harmonies':'Layered harmonies — stacked 3+ vocal parts; Destiny\'s Child/Boyz II Men choir density.',
    'breathy-close-mic':'Breathy close-mic — whisper-adjacent proximity, ASMR intimacy; bedroom R&B vocal intimacy.'
  };
  const gfMap = {
    'laid-back-pocket':'Laid-back pocket — drums slightly behind beat, relaxed swing; the groove creates space to sing.',
    'on-top-bounce':'On-top bounce — drums slightly ahead, forward propulsion; new jack swing energy.',
    'half-time-sway':'Half-time sway — drums feel half as fast as bpm; slow-jam hip-sway weight.',
    'swing-16ths':'Swing 16ths — triplet feel on 16th notes; neo-soul pocket (D\'Angelo Voodoo era).',
    'trap-soul-808':'Trap-soul 808 — trap drum programming under R&B vocal; Bryson Tiller/PartyNextDoor territory.'
  };
  const liMap = {
    'explicit-body':'Explicit body — frank sexuality, physical desire foregrounded; adult R&B directness.',
    'sensual-devotional':'Sensual devotional — romantic worship; sacred treatment of the beloved, adoration without objectification.',
    'heartbreak-confession':'Heartbreak confession — vulnerable admission of hurt; begging, apologizing, mourning love lost.',
    'slow-burn-tension':'Slow-burn tension — anticipation, restraint, will-we-won\'t-we charge; the heat of the hold.',
    'grown-sophisticate':'Grown & sophisticate — adult experienced love; mature desire, complex feelings, quiet confidence.'
  };
  const adMap = {
    'sparse-rhodes-voice':'Sparse Rhodes-voice — electric piano + voice + minimal drums; classic neo-soul intimate texture.',
    'live-band-warm':'Live band warm — full rhythm section recorded together, ensemble chemistry; Philly soul warmth.',
    'lush-layered':'Lush layered — strings, horns, multiple keys, stacked vocals; Babyface/LA Reid Motown-modern production.',
    'programmed-synth-bed':'Programmed synth bed — pad-dominant, electronic warmth, minimal acoustic instrumentation.',
    'horn-string-full':'Horns & strings — full orchestration, cinematic R&B; classic Quincy Jones production scope.'
  };
  const vdArr = Array.isArray(dims.vocalDelivery) ? dims.vocalDelivery : [dims.vocalDelivery].filter(Boolean);
  const parts = [];
  if (eMap[dims.eraSound])              parts.push(`• ERA: ${eMap[dims.eraSound]}`);
  if (vdArr.length)                     parts.push(`• VOCAL: ${vdArr.map(v => vdMap[v]).filter(Boolean).join(' / ')}`);
  if (gfMap[dims.grooveFeel])           parts.push(`• GROOVE: ${gfMap[dims.grooveFeel]}`);
  if (liMap[dims.lyricIntimacy])        parts.push(`• LYRIC: ${liMap[dims.lyricIntimacy]}`);
  if (adMap[dims.arrangementDensity])   parts.push(`• ARRANGEMENT: ${adMap[dims.arrangementDensity]}`);
  return parts.length ? `\n\nR&B CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildRockDimBlock(dims) {
  if (!dims) return '';
  const sgMap = {
    'classic-rock':'Classic rock — 60s-70s canon; Zeppelin/Stones/Who lineage; blues-derived riffs, analog warmth.',
    'arena-rock':'Arena rock — 80s stadium-ready; Def Leppard/Journey/Bon Jovi; big choruses for crowd singalongs.',
    'garage-rock':'Garage rock — raw DIY energy; White Stripes/Strokes lineage; simple chords, lo-fi aesthetic.',
    'heartland-rock':'Heartland rock — Springsteen/Mellencamp/Petty; American working-class lyric, rootsy production.',
    'punk-rock-adjacent':'Punk-rock-adjacent — Clash/Replacements; melodic sensibility with punk attitude, rougher edges.',
    'hard-rock':'Hard rock — heavier than classic, lighter than metal; AC/DC/GnR; riff-centric, blues roots, swagger.'
  };
  const gaMap = {
    'riff-driven':'Riff-driven guitar — memorable instrumental hook carries the song; the riff IS the song.',
    'power-chord-wall':'Power-chord wall — open 5th chord texture, distorted density, fills harmonic space.',
    'arpeggio-jangle':'Arpeggio jangle — picked patterns, cleaner tones, melodic individual notes over chords.',
    'solo-showcase':'Solo showcase — dedicated instrumental break where guitar leads; virtuosity as song feature.',
    'dual-guitar-harmony':'Dual-guitar harmony — two guitars playing harmonized lines (3rds/6ths); Allman/Thin Lizzy lineage.'
  };
  const rfMap = {
    'straight-4-on-floor':'Straight 4-on-floor — kick on every beat, rock-steady momentum, pub-rock reliability.',
    'shuffled-swing':'Shuffled swing — triplet feel under the rock beat; Stones-style blues shuffle groove.',
    'half-time-heavy':'Half-time heavy — snare on 3 instead of 2&4; slower apparent tempo, crushing weight.',
    'driving-8ths':'Driving 8ths — bass/rhythm guitar pumping 8th notes; punk/new wave urgency engine.',
    'odd-meter-prog':'Odd-meter prog — 5/4, 7/8, or shifting time signatures; King Crimson/Rush territory.'
  };
  const lsMap = {
    'anthem-unifying':'Anthem unifying — we/us lyric, collective identity, crowd singalong; arena-built meaning.',
    'rebel-defiant':'Rebel defiant — against the system, the machine, authority; rock\'s foundational posture.',
    'road-storytelling':'Road storytelling — narrative lyric, characters, place names; Springsteen specificity.',
    'confessional-outsider':'Confessional outsider — alienation, personal pain, misfit identity; emotional honesty.',
    'mythic-poetic':'Mythic poetic — elevated imagery, fantasy/classical references, Dylan-esque literary ambition.'
  };
  const peMap = {
    '70s-analog-warm':'70s analog-warm — tape saturation, room mics, compressed drums; Zeppelin/Fleetwood Mac sound.',
    '80s-big-reverb':'80s big reverb — gated snare, reverb on everything, exaggerated scale; Def Leppard production era.',
    '90s-raw-dry':'90s raw-dry — reaction to 80s; close-mic\'d, dry, in-your-face; grunge-era flat mix.',
    '00s-compressed-loud':'00s compressed-loud — loudness war production, brickwall mastering, dense but tiring mix.',
    'modern-hybrid-digital':'Modern hybrid-digital — clean edits, amp sims, pristine mix; Greta Van Fleet retro-with-modern-tools.'
  };
  const gaArr = Array.isArray(dims.guitarApproach) ? dims.guitarApproach : [dims.guitarApproach].filter(Boolean);
  const parts = [];
  if (sgMap[dims.subgenre])      parts.push(`• SUBGENRE: ${sgMap[dims.subgenre]}`);
  if (gaArr.length)              parts.push(`• GUITAR: ${gaArr.map(v => gaMap[v]).filter(Boolean).join(' / ')}`);
  if (rfMap[dims.rhythmicFeel])  parts.push(`• RHYTHM: ${rfMap[dims.rhythmicFeel]}`);
  if (lsMap[dims.lyricStance])   parts.push(`• LYRIC: ${lsMap[dims.lyricStance]}`);
  if (peMap[dims.productionEra]) parts.push(`• PRODUCTION: ${peMap[dims.productionEra]}`);
  return parts.length ? `\n\nROCK CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildCountryDimBlock(dims) {
  if (!dims) return '';
  const elMap = {
    'outlaw-70s':'Outlaw 70s — Waylon/Willie/Merle lineage; honky-tonk defiance, rough-edged production, rebellion against Nashville polish.',
    'bakersfield':'Bakersfield — Buck Owens/Merle Haggard; Fender Telecaster twang, shuffled beat, California working-class roots.',
    'nashville-polish':'Nashville polish — modern country radio sound; polished mix, pop-leaning choruses, stadium-ready anthems.',
    'bro-country-2010s':'Bro-country 2010s — Florida Georgia Line/Luke Bryan; trucks/girls/beer party lyric, pop-country production density.',
    'americana-folk-country':'Americana — folk-country hybrid; Jason Isbell/Gillian Welch; literary lyrics, acoustic-band textures, adult-album audience.',
    'modern-alt-country':'Modern alt-country — Sturgill Simpson/Tyler Childers; psychedelic/rock-inflected, outlaw-revival attitude.'
  };
  const laMap = {
    'truck-and-beer':'Truck & beer — Friday-night escape lyric; specific objects (Chevy/tailgate/cooler); bro-country territory.',
    'heartbreak-ballad':'Heartbreak ballad — classic country longing; tears in beer, she-left-me, honky-tonk sorrow tradition.',
    'story-song':'Story song — narrative from start to finish; characters/setting/ending; Johnny Cash "Fulsom Prison" lineage.',
    'rural-roots':'Rural roots — farm/hometown specificity; dirt roads, red clay, small-town landmarks as lyric anchors.',
    'small-town-memoir':'Small-town memoir — autobiographical look back; where I\'m from, who raised me, what I carry.'
  };
  const inMap = {
    'acoustic-stripped':'Acoustic stripped — voice + guitar; no band, close-mic\'d, songwriter-round intimacy.',
    'full-band-modern':'Full band modern — drums, bass, electric guitar, keys, pedal steel; contemporary country ensemble.',
    'pedal-steel-fiddle':'Pedal steel + fiddle — traditional country textures dominant; crying steel, lonesome fiddle lead lines.',
    'bluegrass-acoustic':'Bluegrass acoustic — banjo/mandolin/fiddle/upright bass; no drums; tight harmonies and fast picking.',
    'country-pop-synths':'Country-pop synths — modern hybrid; pads, programmed claps, pedal steel dressing pop structure.'
  };
  const vcMap = {
    'twang-earnest':'Twang earnest — pronounced country accent, sincere delivery; authenticity through vowel shape.',
    'smooth-crooner':'Smooth crooner — less twang, more pop polish; George Strait / Keith Urban crossover voice.',
    'gritty-outlaw':'Gritty outlaw — weathered texture, cigarette-scarred; Waylon/Johnny Cash authoritative depth.',
    'bright-pop':'Bright pop — clean pop-country delivery; Kelsea Ballerini / Dan+Shay radio-ready.',
    'weathered-storyteller':'Weathered storyteller — voice carries history; John Prine / Guy Clark conversational wisdom.'
  };
  const tfMap = {
    'slow-ballad':'Slow ballad — rubato phrasing, tear-in-beer tempo; 60–70 BPM; every word has weight.',
    'mid-tempo-two-step':'Mid-tempo two-step — danceable country groove; 90–110 BPM; classic honky-tonk pocket.',
    'uptempo-honky-tonk':'Uptempo honky-tonk — 120+ BPM barn-burner; shuffle groove, lead-guitar breaks.',
    'driving-anthem':'Driving anthem — mid-fast rock-country tempo; radio-ready chorus lift, stadium singalong.',
    'waltz-3-4':'Waltz 3/4 — country waltz tradition; "Tennessee Waltz" feel; slow-dance lilt.'
  };
  const laArr = Array.isArray(dims.lyricArchetype) ? dims.lyricArchetype : [dims.lyricArchetype].filter(Boolean);
  const parts = [];
  if (elMap[dims.eraLineage])       parts.push(`• ERA: ${elMap[dims.eraLineage]}`);
  if (laArr.length)                 parts.push(`• LYRIC: ${laArr.map(v => laMap[v]).filter(Boolean).join(' / ')}`);
  if (inMap[dims.instrumentation])  parts.push(`• INSTRUMENTATION: ${inMap[dims.instrumentation]}`);
  if (vcMap[dims.vocalCharacter])   parts.push(`• VOCAL: ${vcMap[dims.vocalCharacter]}`);
  if (tfMap[dims.tempoFeel])        parts.push(`• TEMPO: ${tfMap[dims.tempoFeel]}`);
  return parts.length ? `\n\nCOUNTRY CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildEdmDimBlock(dims) {
  if (!dims) return '';
  const sgMap = {
    'house':'House — four-on-floor kick, hi-hats on offbeat, soulful vocal chops; Chicago/Deep/French house lineage.',
    'trance':'Trance — 138 BPM, supersaw leads, extended builds, euphoric climaxes; Armin/Above&Beyond emotional uplift.',
    'dubstep':'Dubstep — half-time wobble bass, syncopated drums, 140 BPM; Skrillex/Excision bass-forward aggression.',
    'techno':'Techno — minimal/driving, 128–135 BPM, hypnotic repetition; Berlin/Detroit club-focused subculture.',
    'drum-n-bass':'Drum & bass — 170+ BPM, Amen break-derived, heavy sub-bass; jungle/DnB UK rave tradition.',
    'future-bass':'Future bass — 140-ish BPM, wobble/saw chord stabs, trap-influenced drums; Flume/Illenium emotional territory.',
    'progressive':'Progressive — long builds, melodic layering, 128 BPM; Deadmau5/Eric Prydz extended-mix tradition.',
    'big-room':'Big room — 130 BPM festival-stage; simple chord stabs, huge drops, Tomorrowland anthem factory.'
  };
  const dsMap = {
    'melodic-release':'Melodic release drop — full synth lead plays the hook melody; the drop IS the song, euphoric and singable.',
    'bass-heavy-growl':'Bass-heavy growl — drop dominated by bass timbre (wobble/Reese/growl); aggressive and movement-focused.',
    'vocal-chop-lead':'Vocal chop lead drop — chopped pitched vocal sample carries melody; Chainsmokers/Marshmello template.',
    'build-no-drop':'Build / No drop — climax happens in build, drop is minimal or absent; deconstructed anticipation.',
    'hard-kick-jackin':'Hard kick jackin — distorted 4-on-floor kick dominates; bigroom/hardstyle aggression.'
  };
  const vtMap = {
    'female-topline':'Female topline — female vocalist sings verse/chorus over EDM track; classic crossover collaboration format.',
    'male-topline':'Male topline — male vocalist feature; indie-crossover / chainsmokers male-vocal era.',
    'chopped-pitched':'Chopped + pitched vocals — vocal sample chopped, pitched, treated as melodic synth instrument.',
    'spoken-hook':'Spoken hook — spoken phrase repeats as hook; no sung melody, rhythmic chant.',
    'instrumental-only':'Instrumental only — no vocals; pure synth-driven composition.'
  };
  const eaMap = {
    'peak-chorus-drop':'Peak chorus-drop arc — verse / build / drop = chorus; standard EDM architecture with verse-chorus song shape.',
    'slow-build-single-peak':'Slow build single peak — 60+ second build, one climactic release; prog-trance extended form.',
    'double-drop':'Double drop — two separate drops with different textures; more song-like multi-peak structure.',
    'sustained-groove':'Sustained groove — song stays at one intensity; house/techno long-form energy maintenance.',
    'switch-up-midway':'Switch-up midway — song shifts tempo/subgenre at bridge; two-part EDM hybrid.'
  };
  const fvMap = {
    'festival-main':'Festival main-stage — 60,000-person energy; anthem-built, simple melodic hooks for crowd unity.',
    'club-peak-hour':'Club peak-hour — 1–3am dancefloor; grittier mix, extended intro/outro for DJ transitions.',
    'radio-crossover':'Radio crossover — pop-friendly 3:30 edit; verse/chorus structure, vocal-forward; Avicii/Chainsmokers territory.',
    'headphones-album':'Headphones / album — listening experience, not dance; texture and composition over functional BPM.',
    'underground-warehouse':'Underground warehouse — 4am Berghain aesthetic; minimal, hypnotic, unrelenting; no radio concessions.'
  };
  const vtArr = Array.isArray(dims.vocalTreatment) ? dims.vocalTreatment : [dims.vocalTreatment].filter(Boolean);
  const parts = [];
  if (sgMap[dims.subgenre])             parts.push(`• SUBGENRE: ${sgMap[dims.subgenre]}`);
  if (dsMap[dims.dropStyle])            parts.push(`• DROP: ${dsMap[dims.dropStyle]}`);
  if (vtArr.length)                     parts.push(`• VOCAL: ${vtArr.map(v => vtMap[v]).filter(Boolean).join(' / ')}`);
  if (eaMap[dims.energyArc])            parts.push(`• ENERGY ARC: ${eaMap[dims.energyArc]}`);
  if (fvMap[dims.festivalVsListening])  parts.push(`• FORMAT: ${fvMap[dims.festivalVsListening]}`);
  return parts.length ? `\n\nEDM CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildFolkDimBlock(dims) {
  if (!dims) return '';
  const esMap = {
    'old-timey-americana':'Old-timey Americana — pre-war rural string-band tradition; Carter Family / Harry Smith Anthology lineage.',
    '60s-revival':'60s folk revival — Greenwich Village era; Dylan/Baez/Ochs; protest consciousness with acoustic guitar.',
    'british-isles-traditional':'British Isles traditional — modal ballads, Child-ballad narratives; Fairport Convention / Pentangle DNA.',
    'contemporary-indie-folk':'Contemporary indie folk — Bon Iver/Sufjan/Fleet Foxes; layered textures, reverb, modern production sensibility.',
    'freak-folk':'Freak folk — Joanna Newsom/Devendra Banhart; eccentric instrumentation, surreal lyric, folk tradition subverted.',
    'anti-folk':'Anti-folk — Jeffrey Lewis/Kimya Dawson; irony-inflected, lo-fi, intentionally amateur aesthetic.'
  };
  const inMap = {
    'acoustic-guitar-voice':'Acoustic guitar + voice — the core folk texture; fingerpicked or strummed, vocal-forward mix.',
    'banjo-mandolin':'Banjo / mandolin — Appalachian string instruments; bluegrass adjacent, fast-picking tradition.',
    'fiddle-lead':'Fiddle lead — Celtic/Appalachian fiddle carries melodic weight; instrumental breaks between verses.',
    'harmonium-drone':'Harmonium / drone — Indian or shruti-style sustained tone under voice; folk-meets-raga aesthetic.',
    'full-band-chamber':'Full band chamber — acoustic band with strings/horns; Sufjan-style orchestrated folk.'
  };
  const ltMap = {
    'ballad-narrative':'Ballad narrative — multi-verse story told in strict meter; Child-ballad tradition of story-song.',
    'protest-political':'Protest political — Guthrie/Seeger lineage; direct address to injustice, movement-anthem potential.',
    'confessional-modern':'Confessional modern — first-person interior life; Nick Drake / Elliott Smith diaristic lyric tradition.',
    'mythic-archetypal':'Mythic archetypal — folklore figures, universal symbols; folk as collective unconscious access.',
    'nature-landscape':'Nature landscape — specific places as lyric focus; mountains/rivers/seasons as emotional correlatives.'
  };
  const vdMap = {
    'understated-earnest':'Understated earnest — natural speaking-voice delivery; no vibrato theatrics, truth-telling tone.',
    'weathered-grit':'Weathered grit — lived-in vocal texture; Guy Clark / Townes Van Zandt seasoned roughness.',
    'pure-choirboy':'Pure / choirboy — clear tone, minimal vibrato, Sufjan Stevens / Iron & Wine fragile clarity.',
    'keening-high':'Keening high — high-pitched plaintive quality; Appalachian lament tradition, Sarah Jarosz register.',
    'spoken-recitation':'Spoken recitation — half-sung, half-spoken delivery; Leonard Cohen late-career conversational intimacy.'
  };
  const ecMap = {
    'solo-sparse':'Solo sparse — single instrument + voice; no ensemble, maximum intimacy.',
    'duo-harmony':'Duo harmony — two voices in close-interval harmony; Simon & Garfunkel / Indigo Girls tradition.',
    'string-band-quartet':'String-band quartet — 3–5 acoustic players; bluegrass or old-time ensemble scale.',
    'full-orchestral-folk':'Full orchestral folk — chamber orchestra meets folk song; baroque-folk lineage (Nick Drake Bryter Layter).',
    'communal-chorus':'Communal chorus — group/choir backing vocals on choruses; protest-song sing-along spirit.'
  };
  const inArr = Array.isArray(dims.instrumentation) ? dims.instrumentation : [dims.instrumentation].filter(Boolean);
  const parts = [];
  if (esMap[dims.eraStrain])        parts.push(`• STRAIN: ${esMap[dims.eraStrain]}`);
  if (inArr.length)                 parts.push(`• INSTRUMENTATION: ${inArr.map(v => inMap[v]).filter(Boolean).join(' / ')}`);
  if (ltMap[dims.lyricTradition])   parts.push(`• LYRIC: ${ltMap[dims.lyricTradition]}`);
  if (vdMap[dims.vocalDelivery])    parts.push(`• VOCAL: ${vdMap[dims.vocalDelivery]}`);
  if (ecMap[dims.ensembleScale])    parts.push(`• SCALE: ${ecMap[dims.ensembleScale]}`);
  return parts.length ? `\n\nFOLK CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildMetalDimBlock(dims) {
  if (!dims) return '';
  const sgMap = {
    'thrash':'Thrash — Bay Area speed/aggression; palm-muted tremolo, fast double-kick, political/nihilist lyric; Metallica/Slayer/Megadeth DNA.',
    'death':'Death metal — growled vocals, drop-tuned, blast beats, horror/mortality lyric; Cannibal Corpse/Death/Morbid Angel.',
    'black':'Black metal — tremolo-picked walls, shrieked vocals, raw lo-fi production, occult/nature lyric; Mayhem/Burzum/Emperor.',
    'doom':'Doom — slow crushing tempo, down-tuned detuned guitars, funeral pace; Black Sabbath lineage; Electric Wizard / Sleep.',
    'power':'Power metal — clean operatic vocals, fast tempos, fantasy/sword-and-sorcery lyrics; Helloween/Blind Guardian/Dragonforce.',
    'metalcore':'Metalcore — hardcore-influenced breakdowns, harsh/clean vocal trade, melodic choruses; Killswitch Engage/Parkway Drive.',
    'progressive':'Progressive metal — complex time signatures, extended songs, technical musicianship; Dream Theater/Tool/Opeth.',
    'nu-metal':'Nu-metal — 7-string guitars, hip-hop influence, rap-metal hybrid, 90s–00s aesthetic; Korn/Slipknot/Linkin Park.'
  };
  const vaMap = {
    'clean':'Clean vocals — sung melodic delivery; power metal / progressive / metalcore chorus tradition.',
    'growl':'Growl vocals — guttural low-register death growl; Cookie Monster register, chest-cavity resonance.',
    'scream':'Scream vocals — high-pitched shriek/banshee; black metal / hardcore emotional extremity.',
    'harsh-clean-mix':'Harsh/clean mix — harsh verses + clean choruses or vice versa; metalcore dual-vocalist tradition.',
    'operatic':'Operatic vocals — trained classical technique over metal; symphonic metal / Nightwish / power metal lineage.'
  };
  const gtMap = {
    'palm-mute-tremolo':'Palm-mute tremolo — thrash-style rhythmic palm-muted chugging with tremolo-picked sections; speed and precision focus.',
    'drop-tuned-chug':'Drop-tuned chug — heavy detuned (drop D, B, A) chugging riffs; nu-metal/djent low-end heaviness.',
    'shred-solo':'Shred solo — virtuosic lead guitar breaks; sweep picking, tapping, modal runs; guitar-hero foreground moments.',
    'sludgy-doom-riff':'Sludgy doom riff — slow heavy detuned riffs with distortion and feedback; doom/sludge weight.',
    'djent-polyrhythm':'Djent polyrhythm — 7/8-string guitars playing polyrhythmic palm-muted patterns; Meshuggah/Periphery modern precision.',
    'black-tremolo-wall':'Black tremolo wall — single-note tremolo picking creating a wall of texture; black metal atmospheric approach.'
  };
  const ltMap = {
    'rage-aggression':'Rage/Aggression — direct anger, violence, confrontation; core metal emotional vocabulary.',
    'mythology-fantasy':'Mythology/Fantasy — dragons, warriors, gods, fictional worlds; power/black metal epic narrative.',
    'nihilism-void':'Nihilism/Void — meaninglessness, nothingness, existential horror; black metal / doom philosophical territory.',
    'politics-war':'Politics/War — system critique, war horror, government corruption; thrash/crust tradition.',
    'personal-pain':'Personal pain — depression, self-loathing, interior suffering; post-hardcore / emo-metal vulnerability.',
    'occult-darkness':'Occult/Darkness — ritual, satanic imagery, gothic horror; black/death metal aesthetic language.'
  };
  const tfMap = {
    'slow-crushing':'Slow crushing — 40–70 BPM; every beat weighted; doom/sludge crawling tempo.',
    'mid-heavy-groove':'Mid heavy-groove — 90–110 BPM; headbanging pocket; Pantera/Lamb of God groove metal zone.',
    'fast-aggressive':'Fast aggressive — 140–180 BPM; thrash/death standard; double-kick supported.',
    'blast-beat-extreme':'Blast-beat extreme — 200+ BPM with blast-beat drum pattern; extreme metal velocity.',
    'shifting-prog':'Shifting prog — multiple tempos in one song; progressive metal through-composed structure.'
  };
  const gtArr = Array.isArray(dims.guitarTechnique) ? dims.guitarTechnique : [dims.guitarTechnique].filter(Boolean);
  const ltArr = Array.isArray(dims.lyricTerritory)  ? dims.lyricTerritory  : [dims.lyricTerritory].filter(Boolean);
  const parts = [];
  if (sgMap[dims.subgenre])        parts.push(`• SUBGENRE: ${sgMap[dims.subgenre]}`);
  if (vaMap[dims.vocalApproach])   parts.push(`• VOCAL: ${vaMap[dims.vocalApproach]}`);
  if (gtArr.length)                parts.push(`• GUITAR: ${gtArr.map(v => gtMap[v]).filter(Boolean).join(' / ')}`);
  if (ltArr.length)                parts.push(`• LYRIC: ${ltArr.map(v => ltMap[v]).filter(Boolean).join(' / ')}`);
  if (tfMap[dims.tempoFeel])       parts.push(`• TEMPO: ${tfMap[dims.tempoFeel]}`);
  return parts.length ? `\n\nMETAL CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildJazzDimBlock(dims) {
  if (!dims) return '';
  const esMap = {
    'swing-era':'Swing era — 1930s-40s big-band tradition; Ellington/Basie/Armstrong; 4-to-the-bar rhythm section, riff-based arrangements.',
    'bebop':'Bebop — 1940s Parker/Gillespie revolution; fast tempo, complex chromatic melodies, head-solo-head form.',
    'cool-jazz':'Cool jazz — 1950s Miles/Mulligan/MJQ; relaxed tempos, lyrical restraint, West Coast understatement.',
    'hard-bop':'Hard bop — 1950s Art Blakey/Horace Silver; blues + gospel injected back into bebop; visceral and sophisticated.',
    'modal':'Modal — post-Kind-of-Blue; static modal vamps instead of changes; Coltrane "My Favorite Things" territory.',
    'free-jazz':'Free jazz — Ornette/late Coltrane/Ayler; no fixed meter/key/changes; improvisational liberation.',
    'fusion':'Fusion — 1970s Miles Electric/Weather Report/Mahavishnu; jazz + rock + electric instruments.',
    'contemporary':'Contemporary — modern jazz idiom; Snarky Puppy/Kamasi/Robert Glasper; genre-crossing, hip-hop aware.'
  };
  const emMap = {
    'solo':'Solo jazz — single instrument; pianist or guitarist playing full harmonic and melodic statement alone.',
    'duo':'Duo — two instruments; maximum intimacy, often voice+piano or piano+bass conversations.',
    'trio':'Trio — piano/bass/drums standard; Oscar Peterson / Bill Evans / Keith Jarrett trio formats.',
    'quartet':'Quartet — classic jazz unit; horn + rhythm section (piano/bass/drums); Coltrane Classic Quartet scale.',
    'big-band':'Big band — 15+ piece ensemble; brass/reed sections with rhythm; arranged charts dominate improvisation.'
  };
  const iaMap = {
    'standard-changes':'Standard changes — improvising over written chord progression; bebop tradition; melodic invention within constraint.',
    'modal-vamp':'Modal vamp — extended improvisation over single mode/chord; Coltrane "Impressions" territory.',
    'free-open':'Free open — no pre-determined harmonic/rhythmic structure; pure collective improvisation.',
    'outside-chromatic':'Outside chromatic — deliberate dissonance against changes; playing outside the key as expressive choice.',
    'head-only-minimal':'Head-only minimal — play the melody, minimal improvisation; composition-forward jazz.'
  };
  const soMap = {
    'great-american-standard':'Great American Standard — pre-1960 pop song tradition (Gershwin/Porter/Kern); the canonical jazz repertoire.',
    'original-composition':'Original composition — band-authored piece; modern jazz norm; not a cover of a standard.',
    'blues-form':'Blues form — 12-bar blues structure; shared vocabulary across eras; Duke Ellington to Charlie Parker to Miles Davis.',
    'rhythm-changes':'Rhythm changes — 32-bar AABA form from Gershwin\'s "I Got Rhythm"; second-most-used jazz structure after blues.',
    'jazz-samba':'Jazz samba — bossa/samba Brazilian tradition integrated into jazz (Getz/Gilberto / Jobim collaborations).'
  };
  const vtMap = {
    'instrumental-only':'Instrumental only — no vocal; pure jazz-instrumental tradition.',
    'crooner-ballad':'Crooner ballad — Sinatra/Bennett/Fitzgerald ballad delivery; rubato phrasing, lyric as primary focus.',
    'bebop-scat':'Bebop/scat — improvised vocal lines using syllables as instrumental substitute; Fitzgerald/Vaughan bebop phrasing.',
    'vocalese-storytell':'Vocalese — lyrics written to instrumental solos; Lambert/Hendricks/Ross / Jon Hendricks lineage.',
    'modern-hybrid':'Modern hybrid — contemporary jazz vocal; Cécile McLorin Salvant / Gregory Porter / Kurt Elling.'
  };
  const iaArr = Array.isArray(dims.improvisationApproach) ? dims.improvisationApproach : [dims.improvisationApproach].filter(Boolean);
  const parts = [];
  if (esMap[dims.eraSchool])            parts.push(`• SCHOOL: ${esMap[dims.eraSchool]}`);
  if (emMap[dims.ensembleSize])         parts.push(`• ENSEMBLE: ${emMap[dims.ensembleSize]}`);
  if (iaArr.length)                     parts.push(`• IMPROV: ${iaArr.map(v => iaMap[v]).filter(Boolean).join(' / ')}`);
  if (soMap[dims.standardOrOriginal])   parts.push(`• REPERTOIRE: ${soMap[dims.standardOrOriginal]}`);
  if (vtMap[dims.vocalTradition])       parts.push(`• VOCAL: ${vtMap[dims.vocalTradition]}`);
  return parts.length ? `\n\nJAZZ CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildPunkDimBlock(dims) {
  if (!dims) return '';
  const ewMap = {
    '77-uk-punk':'77 UK Punk — Sex Pistols/Clash/Buzzcocks; political anger + catchy hooks; snotty British accent tradition.',
    '77-us-punk':'77 US Punk — Ramones/Television/Richard Hell; CBGBs NY scene; shorter songs, art-punk intellectualism.',
    '80s-hardcore':'80s hardcore — Black Flag/Minor Threat/Bad Brains; faster/angrier than 77 punk; DIY ethic, scene-built.',
    'pop-punk-90s':'Pop-punk 90s — Green Day/Offspring/Blink; major-key melodic sensibility, teenage-angst lyric, skate-scene aesthetic.',
    'riot-grrrl':'Riot Grrrl — Bikini Kill/Bratmobile/Sleater-Kinney; feminist hardcore; female fury; 90s Olympia WA scene.',
    'post-hardcore':'Post-hardcore — Fugazi/At the Drive-In/Jawbox; melodic and dynamic hardcore evolution; art-punk ambition.',
    'modern-dance-punk':'Modern dance-punk — LCD Soundsystem/!!!/Rapture; 00s NYC dance-rock; punk ethos + disco groove.'
  };
  const lsMap = {
    'political-protest':'Political protest — direct confrontation with systems, government, capitalism; Clash / Dead Kennedys tradition.',
    'personal-outsider':'Personal outsider — alienation, social awkwardness, misfit identity; pop-punk core lyrical register.',
    'nihilist-refuse':'Nihilist refuse — "no future" / "nothing matters" / rejection of meaning; UK 77 nihilistic posture.',
    'joyful-sarcasm':'Joyful sarcasm — ironic detachment, wit as armor; Dead Milkmen / Descendents humorous punk tradition.',
    'fuck-authority':'Fuck authority — direct oppositional lyric; cops, teachers, parents, bosses as named enemies.'
  };
  const taMap = {
    'fast-two-minute':'Fast two-minute — 180+ BPM; under 2:30 song length; Ramones template; get in, explode, get out.',
    'hardcore-blistering':'Hardcore blistering — 220+ BPM; blast-tempo; under 2 minutes; Minor Threat / Black Flag velocity.',
    'midtempo-anthem':'Midtempo anthem — 140–160 BPM; sing-along sustainable energy; pop-punk chorus tradition.',
    'surf-punk-bounce':'Surf-punk bounce — shuffle-feel 150-ish BPM; Dead Kennedys / Reverend Horton Heat groove.',
    'slow-sludge':'Slow sludge — against punk orthodoxy; slow doom-adjacent punk tempo; Flipper / early Melvins.'
  };
  const pfMap = {
    'raw-lo-fi':'Raw lo-fi — single-mic recording, tape hiss, amplifier bleed; Guided By Voices / cassette-demo aesthetic.',
    'garage-demo':'Garage demo — basement recording, amateur performance, no overdubs; Jay Reatard / garage-punk authenticity.',
    'punchy-mid-fi':'Punchy mid-fi — clean but not polished; early-90s indie; recorded-in-a-week punk album norm.',
    'radio-ready':'Radio ready — pop-punk crossover polish; Green Day Dookie / Blink-182 Enema-era commercial mix.',
    'modern-clean':'Modern clean — contemporary pro production; drum replacement, pitch correction; 00s+ mainstream punk sound.'
  };
  const vdMap = {
    'shouted-sneer':'Shouted sneer — Rotten-style snotty delivery; vowels distorted with attitude, lyric spat not sung.',
    'melodic-pop-punk':'Melodic pop-punk — sung melodic lines with punk attitude; Blink/Sum 41 chorus-forward singing.',
    'screamed-hardcore':'Screamed hardcore — throat-damaged shout; Minor Threat / black Flag Henry Rollins intensity.',
    'conversational-deadpan':'Conversational deadpan — spoken-adjacent delivery, flat affect; Lou Reed / Modest Mouse lineage.',
    'female-fierce':'Female fierce — Kathleen Hanna / Corin Tucker register; scream-adjacent feminine rage.'
  };
  const lsArr = Array.isArray(dims.lyricStance) ? dims.lyricStance : [dims.lyricStance].filter(Boolean);
  const parts = [];
  if (ewMap[dims.eraWave])              parts.push(`• WAVE: ${ewMap[dims.eraWave]}`);
  if (lsArr.length)                     parts.push(`• STANCE: ${lsArr.map(v => lsMap[v]).filter(Boolean).join(' / ')}`);
  if (taMap[dims.tempoAggression])      parts.push(`• TEMPO: ${taMap[dims.tempoAggression]}`);
  if (pfMap[dims.productionFidelity])   parts.push(`• PRODUCTION: ${pfMap[dims.productionFidelity]}`);
  if (vdMap[dims.vocalDelivery])        parts.push(`• VOCAL: ${vdMap[dims.vocalDelivery]}`);
  return parts.length ? `\n\nPUNK CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildBollywoodDimBlock(dims) {
  if (!dims) return '';
  const esMap = {
    'classic-golden-50s60s':'Classic Golden 50s-60s — Lata/Rafi/Kishore era; orchestral arrangements, sitar/flute/tabla, Urdu-Hindi poetic lyric.',
    'disco-bollywood-70s80s':'Disco Bollywood 70s-80s — Bappi Lahiri/RD Burman; dance-floor grooves with Indian flavor, synth-heavy arrangements.',
    '90s-melodic':'90s Melodic — Nadeem-Shravan / Jatin-Lalit era; romantic melody-forward ballads, Shah Rukh Khan film-song prime.',
    '2000s-item-song':'2000s Item Song — high-energy dance numbers; choreography-centered, fast bhangra/hip-hop fusion production.',
    'modern-indie-pop-hindi':'Modern Indie-Pop Hindi — Prateek Kuhad/Ritviz; indie sensibility with Hindi lyric; non-film independent artist aesthetic.'
  };
  const laMap = {
    'pure-hindi':'Pure Hindi — straightforward Hindi vernacular; colloquial accessibility.',
    'hindi-urdu-poetic':'Hindi-Urdu poetic — literary Urdu-inflected Hindi; shayari tradition; ghazal-adjacent lyricism.',
    'hinglish':'Hinglish — natural Hindi-English code-switching; urban Indian bilingual reality.',
    'multi-regional':'Multi-regional — Hindi + Punjabi/Tamil/Gujarati phrases; pan-Indian linguistic texture.'
  };
  const inMap = {
    'classical-sitar-tabla':'Classical sitar + tabla — Indian classical instruments foregrounded; raga-aware melodic choices.',
    'orchestral-lush':'Orchestral lush — large string sections, brass, flutes; classic film score ensemble scale.',
    'modern-electronic':'Modern electronic — programmed drums, synth leads, EDM drops adapted to Hindi vocal tradition.',
    'fusion-western-indian':'Fusion Western-Indian — Western drum kit / bass / guitar + Indian classical instruments; hybrid contemporary sound.',
    'qawwali-devotional':'Qawwali devotional — harmonium, tabla, handclaps; Sufi spiritual music tradition.'
  };
  const erMap = {
    'romantic-classical':'Romantic classical — film-love-song tradition; tender, longing, devoted; classical Indian poetry of love.',
    'patriotic':'Patriotic — national pride, freedom struggle themes; motherland devotion; Republic Day anthem register.',
    'item-celebration':'Item celebration — dance-floor anthem; seductive energy, party celebration, wedding sangeet.',
    'devotional-sacred':'Devotional sacred — bhajan/kirtan register; addressing deity; religious/spiritual intimacy.',
    'heartbreak':'Heartbreak — separation-song tradition (viraha); longing for absent beloved, dignified sorrow.'
  };
  const vtMap = {
    'classical-playback':'Classical playback — Lata-Rafi trained classical technique; pure vowels, ornamented phrasing.',
    'modern-playback':'Modern playback — contemporary film singers (Arijit Singh/Shreya Ghoshal); clear polished delivery.',
    'indie-singer-songwriter':'Indie singer-songwriter — non-film independent voice; less ornate, more conversational.',
    'qawwali-trained':'Qawwali trained — Nusrat-influenced; melismatic virtuosity, spiritual ecstasy in delivery.',
    'sufi-mystic':'Sufi mystic — transcendent spiritual voice; A.R. Rahman Sufi-fusion / Rabbi Shergill register.'
  };
  const inArr = Array.isArray(dims.instrumentation) ? dims.instrumentation : [dims.instrumentation].filter(Boolean);
  const parts = [];
  if (esMap[dims.eraStrain])           parts.push(`• ERA: ${esMap[dims.eraStrain]}`);
  if (laMap[dims.languageApproach])    parts.push(`• LANGUAGE: ${laMap[dims.languageApproach]}`);
  if (inArr.length)                    parts.push(`• INSTRUMENTATION: ${inArr.map(v => inMap[v]).filter(Boolean).join(' / ')}`);
  if (erMap[dims.emotionalRegister])   parts.push(`• EMOTIONAL: ${erMap[dims.emotionalRegister]}`);
  if (vtMap[dims.vocalTradition])      parts.push(`• VOCAL: ${vtMap[dims.vocalTradition]}`);
  return parts.length ? `\n\nBOLLYWOOD CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildCpopDimBlock(dims) {
  if (!dims) return '';
  const erMap = {
    '80s-hk-cantopop':'80s HK Cantopop — Anita Mui/Leslie Cheung/Alan Tam; Cantonese language; glamorous ballads, disco-inflected production.',
    'mandopop-ballad-era':'Mandopop Ballad Era — 90s/00s Jay Chou/Jolin Tsai lineage; orchestral romantic ballads, Taiwan-centered.',
    '2010s-edm-cpop':'2010s EDM-CPop — Western EDM templates with Mandarin vocals; festival drops, polished Western producers.',
    'modern-mandopop':'Modern Mandopop — contemporary Chinese pop; clean production, emotional vocals, multi-genre openness.',
    'rap-mandopop':'Rap Mandopop — hip-hop + Mandarin pop hybrid; Rap of China show era; trap influence on mainland production.'
  };
  const vdMap = {
    'classical-trained-belt':'Classical-trained belt — operatic Chinese voice tradition; Peking opera-adjacent technique, powerful high register.',
    'polished-pop':'Polished pop — contemporary mandopop clean delivery; precise intonation, studio-perfect tuning.',
    'soft-intimate':'Soft intimate — whisper-adjacent close-mic; bedroom-pop Mandarin equivalent; Chenyu Hua territory.',
    'edm-processed':'EDM processed — autotuned/vocoded treatment; global EDM aesthetic applied to Mandarin vowels.',
    'rap-melodic-hybrid':'Rap-melodic hybrid — switching between rap verses and sung hooks; modern Chinese hip-hop vocal norm.'
  };
  const lrMap = {
    'poetic-literary':'Poetic literary — classical Chinese poetry influence; literary Mandarin, elevated diction, metaphor-rich.',
    'colloquial-direct':'Colloquial direct — everyday Mandarin speech patterns; accessibility, emotional plainness.',
    'nostalgic-memory':'Nostalgic memory — remembering past / hometown / first love; Chinese culture\'s deep nostalgia vocabulary.',
    'romantic-idealized':'Romantic idealized — pure devoted love; traditional Chinese romantic song register.',
    'social-contemporary':'Social contemporary — urban life, work stress, modern identity; post-millennial Chinese youth experience.'
  };
  const psMap = {
    'lush-orchestral':'Lush orchestral — full string sections, brass swells; cinematic mandopop ballad production.',
    'clean-pop-ballad':'Clean pop ballad — piano + strings + drums; radio-mandopop production norm.',
    'edm-festival':'EDM festival — Western EDM drop structure; big-room chorus, festival-ready.',
    'trap-influence':'Trap influence — 808s, hi-hats, trap drum programming; Chinese hip-hop crossover sound.',
    'indie-acoustic':'Indie acoustic — guitar + vocal + light production; independent Chinese singer-songwriter aesthetic.'
  };
  const ctMap = {
    'romantic-longing':'Romantic longing — unrequited love, distance, waiting; core mandopop emotional territory.',
    'youth-aspiration':'Youth aspiration — chasing dreams, college life, coming-of-age; youth-demographic messaging.',
    'urban-modern':'Urban modern — Shanghai/Taipei/Hong Kong city life; fast-paced contemporary experience.',
    'traditional-respect':'Traditional respect — family, heritage, filial devotion; Confucian values foregrounded.',
    'cool-detached':'Cool detached — indie-aesthetic emotional remove; irony, ennui, millennial sophistication.'
  };
  const lrArr = Array.isArray(dims.lyricRegister) ? dims.lyricRegister : [dims.lyricRegister].filter(Boolean);
  const parts = [];
  if (erMap[dims.eraRegion])        parts.push(`• ERA: ${erMap[dims.eraRegion]}`);
  if (vdMap[dims.vocalDelivery])    parts.push(`• VOCAL: ${vdMap[dims.vocalDelivery]}`);
  if (lrArr.length)                 parts.push(`• LYRIC: ${lrArr.map(v => lrMap[v]).filter(Boolean).join(' / ')}`);
  if (psMap[dims.productionStyle])  parts.push(`• PRODUCTION: ${psMap[dims.productionStyle]}`);
  if (ctMap[dims.conceptTheme])     parts.push(`• CONCEPT: ${ctMap[dims.conceptTheme]}`);
  return parts.length ? `\n\nC-POP CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildAmapianoDimBlock(dims) {
  if (!dims) return '';
  const rcMap = {
    'log-drum-foundation':'Log-drum foundation — deep distinctive log-drum bass pattern defines the track; amapiano signature bass sound.',
    'piano-loop-driven':'Piano loop driven — jazzy piano loop as melodic anchor; piano chord progression is the hook.',
    'jazz-piano-fusion':'Jazz piano fusion — extended jazz chords, improvised-sounding runs; sophisticated harmonic palette.',
    'vocal-forward':'Vocal forward — amapiano track built around singing lead; vocal melody as primary element over rhythm.'
  };
  const tpMap = {
    'strict-113bpm':'Strict 113 BPM — canonical amapiano tempo; classic dancefloor pocket; Kabza De Small / DJ Maphorisa production norm.',
    'relaxed-110':'Relaxed 110 — slightly slower than canonical; more relaxed groove; soulful amapiano mode.',
    'uptempo-117':'Uptempo 117 — pushed tempo for dance-floor peak; higher-energy amapiano subvariant.',
    'hybrid-tempo':'Hybrid tempo — tempo shifts within track; experimental amapiano composition.'
  };
  const vtMap = {
    'lead-singer':'Lead singer — single vocalist carrying melodic hook; Sha Sha / Daliwonga lead-vocal tradition.',
    'chant-groups':'Chant groups — group call-response chants; collective vocal energy; township communal spirit.',
    'spoken-adlib':'Spoken adlib — DJ shouts, adlibs over groove; Kabza/Maphorisa producer-tag identity markers.',
    'rapped-verse':'Rapped verse — amapiano with hip-hop verses; Cassper Nyovest / Focalistic rap-piano hybrid.',
    'no-vocal-instrumental':'Instrumental only — pure instrumental amapiano; DJ-focused track, no vocal carrying hook.'
  };
  const mrMap = {
    'private-school-posh':'Private school posh — upscale smooth amapiano; Johannesburg affluent aesthetic; lounge-jazz sophistication.',
    'township-raw':'Township raw — Soweto/KwaZulu street energy; grittier, more aggressive production; authenticity-forward.',
    'church-gospel-infusion':'Church/gospel infusion — gospel chord changes and choir elements; spiritual amapiano crossover.',
    'dance-floor-peak':'Dance floor peak — maximum club energy; log drum hits harder; peak-hour amapiano.'
  };
  const lgMap = {
    'zulu-dominant':'Zulu dominant — lyrics primarily in isiZulu; Johannesburg-area linguistic default.',
    'xhosa-sotho-mix':'Xhosa/Sotho mix — isiXhosa or Sesotho as primary; regional SA linguistic variation.',
    'english-heavy':'English heavy — English as main lyric language; crossover/international-targeted amapiano.',
    'multilingual':'Multilingual — Zulu + English + other SA languages switching freely; pan-South African.'
  };
  const vtArr = Array.isArray(dims.vocalTreatment) ? dims.vocalTreatment : [dims.vocalTreatment].filter(Boolean);
  const parts = [];
  if (rcMap[dims.rhythmCore])    parts.push(`• RHYTHM CORE: ${rcMap[dims.rhythmCore]}`);
  if (tpMap[dims.tempoPocket])   parts.push(`• TEMPO: ${tpMap[dims.tempoPocket]}`);
  if (vtArr.length)              parts.push(`• VOCAL: ${vtArr.map(v => vtMap[v]).filter(Boolean).join(' / ')}`);
  if (mrMap[dims.moodRegister])  parts.push(`• MOOD: ${mrMap[dims.moodRegister]}`);
  if (lgMap[dims.language])      parts.push(`• LANGUAGE: ${lgMap[dims.language]}`);
  return parts.length ? `\n\nAMAPIANO CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildTvmusicalDimBlock(dims) {
  if (!dims) return '';
  const ftMap = {
    'tv-theme-song':'TV theme song — 30-60 second format establishing show premise; memorable hook, singalong quality.',
    'musical-theatre-ballad':'Musical theatre ballad — emotional showstopper, rubato phrasing, character-reveals-inner-self function.',
    'musical-theatre-uptempo':'Musical theatre uptempo — ensemble number or comedic patter; driving rhythm, wit-forward lyric.',
    'cabaret-showtune':'Cabaret showtune — intimate club-performance register; direct audience address, piano/jazz-combo backing.',
    'film-score-song':'Film score song — dramatic cinematic setting; thematic weight, orchestral arrangement, emotional climax.',
    'animated-show-opening':'Animated show opening — children\'s or adult cartoon intro; catchy singalong, world-building lyric.'
  };
  const sfMap = {
    'i-want-song':'I-Want song — protagonist states their yearning/goal; Act 1 numbers like "Part of Your World" / "Wouldn\'t It Be Loverly".',
    '11-oclock-number':'11 o\'clock number — late-Act-2 showstopper; emotional climax before finale; "Defying Gravity" / "Rose\'s Turn".',
    'opening-number':'Opening number — establishes world, tone, character ensemble; "Tradition" / "Belle" / "Another Day of Sun".',
    'character-intro':'Character intro — specific character introduced through their song; Sondheim "The Witch\'s Rap" tradition.',
    'reprise-emotional':'Reprise emotional — earlier song returns transformed; deepened meaning through narrative arc progress.'
  };
  const miMap = {
    'broadway-classical':'Broadway classical — Rodgers & Hammerstein / Lerner & Loewe; formal harmonic structure, elevated melodic line.',
    'contemporary-pop-theatre':'Contemporary pop theatre — post-2000 musical theatre with pop sensibility; Hamilton / Dear Evan Hansen / Waitress.',
    'jazz-standard-influenced':'Jazz standard influenced — Kander & Ebb / Jason Robert Brown; jazz harmony, swing feel, sophisticated chromaticism.',
    'folk-musical-influenced':'Folk musical influenced — Spring Awakening / Once / Hadestown; acoustic textures, folk/indie-rock palette.',
    'rock-opera':'Rock opera — Hair / Jesus Christ Superstar / American Idiot; rock instrumentation as primary musical language.'
  };
  const lcMap = {
    'rhyme-scheme-tight':'Rhyme-scheme tight — strict AABB/ABAB with internal rhymes; Sondheim craftsman discipline.',
    'conversational-sondheim':'Conversational Sondheim — lyric mimics natural speech rhythm; narrative-forward, character-revealing.',
    'list-song':'List song — enumeration structure; "I\'m the Very Model" / "Popular" / "Tonight Tonight"; catalog as craft.',
    'patter-song':'Patter song — rapid-fire verbal cascade; G&S tradition; "Not Getting Married Today" / "Guns and Ships".',
    'emotional-release':'Emotional release — build toward vocal/emotional climax; restraint gives way to full-voice declaration.'
  };
  const erMap = {
    'golden-age-rh':'Golden Age (R&H) — 1940s-50s Rodgers & Hammerstein era; Oklahoma / South Pacific / Sound of Music aesthetic.',
    'sondheim-era':'Sondheim era — 1970s-80s concept musicals; complex harmonies, ambivalent characters, adult themes.',
    'contemporary-broadway':'Contemporary Broadway — 2000s+ commercial Broadway; Hamilton / Book of Mormon / Wicked ambition.',
    'disney-animated-90s':'Disney Animated 90s — Menken/Ashman/Rice era; Little Mermaid / Beauty and the Beast / Aladdin template.',
    'modern-pop-musical':'Modern pop musical — Dear Evan Hansen / Waitress / Mean Girls; radio-pop sensibility in theatre context.'
  };
  const miArr = Array.isArray(dims.melodicIdiom) ? dims.melodicIdiom : [dims.melodicIdiom].filter(Boolean);
  const parts = [];
  if (ftMap[dims.formatType])     parts.push(`• FORMAT: ${ftMap[dims.formatType]}`);
  if (sfMap[dims.storyFunction])  parts.push(`• FUNCTION: ${sfMap[dims.storyFunction]}`);
  if (miArr.length)               parts.push(`• IDIOM: ${miArr.map(v => miMap[v]).filter(Boolean).join(' / ')}`);
  if (lcMap[dims.lyricCraft])     parts.push(`• LYRIC CRAFT: ${lcMap[dims.lyricCraft]}`);
  if (erMap[dims.era])            parts.push(`• ERA: ${erMap[dims.era]}`);
  return parts.length ? `\n\nTV / MUSICAL CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildHiphopDimBlock(dims) {
  if (!dims) return '';
  const elMap = {
    'golden-age-90s':'Golden Age 90s — 1988-1996 hip-hop canon; Tribe/De La/Wu-Tang/Nas; sample-based boom-bap with lyrical sophistication.',
    'boom-bap':'Boom-bap — classic New York drum pattern (boom = kick, bap = snare); dusty jazz/soul samples, underground aesthetic.',
    'southern-trap':'Southern trap — Atlanta-originated; 808 sub-bass, tripled hi-hats, half-time snares; Future / Young Thug / Migos.',
    'west-coast-g-funk':'West-Coast G-Funk — Dr Dre / Snoop Dogg era; synth leads, P-Funk samples, slow-riding LA funk groove.',
    'east-coast-modern':'East-Coast modern — contemporary NYC hip-hop; Jay-Z / Pusha T / Joey Bada$$; lyric-forward with modern production.',
    'mumble-rap-2010s':'Mumble rap 2010s — melodic mumbled delivery, repetitive hooks, trap beats; Lil Uzi / Future / 21 Savage aesthetic.',
    'conscious-rap':'Conscious rap — socially aware lyricism; Mos Def / Talib Kweli / Kendrick Lamar political-philosophical depth.',
    'abstract-lyrical':'Abstract lyrical — experimental wordplay, nonlinear meaning; MF Doom / Earl Sweatshirt / Aesop Rock territory.',
    'phonk':'Phonk — 2020s dark Memphis rap revival; distorted 808 cowbell-kick, lo-fi menace, 85-100 BPM; Ghostemane / NLE Choppa / SXVXEN; aggressive-but-slow delivery over hypnotic minimal loops; TikTok / gaming / gym-culture dominance. Write lyrics that feel like a slow-motion threat — short punchy lines, heavy repetition, relentless energy without rush.'
  };
  const fsMap = {
    'aggressive-punchline':'Aggressive punchline — hard-hitting bar-ending lines; each line lands with impact; Eminem / Joe Budden tradition.',
    'laid-back-pocket':'Laid-back pocket — relaxed flow sitting behind beat; Snoop / Nas smooth conversational delivery.',
    'melodic-sung-rap':'Melodic sung-rap — hybrid rap/sing delivery; Drake / Lil Wayne melodic rap innovation.',
    'triplet-flow':'Triplet flow — 3-beats-per-word rapid cadence; Migos popularized but rooted in earlier Southern styles.',
    'rapid-fire':'Rapid-fire — high syllable density; tongue-twister sections; Busta Rhymes / Twista / Eminem technical velocity.',
    'narrative-storytelling':'Narrative storytelling — verse tells complete story with characters/arc; Slick Rick / Nas / Kendrick tradition.'
  };
  const bsMap = {
    'classic-sample-based':'Classic sample-based — chopped soul/jazz/funk samples as primary texture; DJ Premier / Pete Rock lineage.',
    'trap-808':'Trap 808 — sub-bass 808 kicks, programmed hats, minor-key synth leads; Atlanta-originated modern production norm.',
    'live-instrumentation':'Live instrumentation — live-band hip-hop; Roots / Anderson .Paak approach; organic played-in elements.',
    'cloud-ambient':'Cloud ambient — atmospheric reverb-heavy production; minimal drums, synth pads; Clams Casino / Burial-adjacent aesthetic.',
    'jazz-rap-loops':'Jazz-rap loops — jazz samples as primary harmonic source; Tribe / Digable Planets / Robert Glasper era.'
  };
  const ltMap = {
    'street-narrative':'Street narrative — urban life, hustle, neighborhood specifics; classic hip-hop territory rooted in authentic geography.',
    'self-mythology':'Self-mythology — building artist persona/legend; flex energy, origin story, superhero-scale self-reference.',
    'social-commentary':'Social commentary — systemic racism, inequality, political analysis; conscious rap ethical foundation.',
    'love-romance':'Love/Romance — relationships, attraction, heartbreak; Method Man/Mary "All I Need" lineage of rap love songs.',
    'abstract-cosmic':'Abstract cosmic — surreal wordplay, existential musing; MF Doom / Earl Sweatshirt non-literal territory.',
    'party':'Party — club energy, celebration, weekend vibes; accessible universal hip-hop function.'
  };
  const vtMap = {
    'dry-classic':'Dry classic — minimal vocal processing; natural voice, close-mic\'d; 90s production norm for vocal clarity.',
    'heavily-processed':'Heavily processed — pitch-correction, effects, layering; modern trap / pop-rap vocal treatment.',
    'autotune-melodic':'Autotune melodic — deliberate autotune as aesthetic; T-Pain / Lil Wayne / Travis Scott melodic rap signature.',
    'double-tracked':'Double-tracked — vocals recorded twice layered; thickening technique, hip-hop radio-ready sound.',
    'ad-lib-heavy':'Ad-lib heavy — frequent background vocals punctuating main verse; Atlanta trap tradition (Future / Gucci / Thug).'
  };
  const fsArr = Array.isArray(dims.flowStrategy) ? dims.flowStrategy : [dims.flowStrategy].filter(Boolean);
  const parts = [];
  if (elMap[dims.eraLineage])       parts.push(`• ERA: ${elMap[dims.eraLineage]}`);
  if (fsArr.length)                 parts.push(`• FLOW: ${fsArr.map(v => fsMap[v]).filter(Boolean).join(' / ')}`);
  if (bsMap[dims.beatStyle])        parts.push(`• BEAT: ${bsMap[dims.beatStyle]}`);
  if (ltMap[dims.lyricTheme])       parts.push(`• THEME: ${ltMap[dims.lyricTheme]}`);
  if (vtMap[dims.vocalTreatment])   parts.push(`• VOCAL: ${vtMap[dims.vocalTreatment]}`);
  return parts.length ? `\n\nHIP-HOP CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

function buildDrillDimBlock(dims) {
  if (!dims) return '';
  const rsMap = {
    'chicago-original':'Chicago original drill — Chief Keef / Lil Durk / King Louie; 2012 South Side origin; dark menacing production, Young Chop sound.',
    'uk-drill':'UK drill — London-originated; offbeat flow, sliding 808s, half-time snares; 67 / Headie One / Digga D sound.',
    'brooklyn-drill':'Brooklyn drill — NY adaptation of UK drill; Pop Smoke / Fivio Foreign; faster tempo, menacing delivery, UK-producer crossover.',
    'french-drill':'French drill — Paris scene; French-language drill; Gazo / Freeze Corleone / ZKR; European drill variant.',
    'afro-drill':'Afro-drill — UK drill meets Afrobeats / amapiano; Black Sherif / Shallipopi hybrid territory.'
  };
  const lcMap = {
    'street-life-gritty':'Street-life gritty — raw neighborhood narrative; specifics of block life, hustle, danger; authenticity-forward.',
    'opps-diss':'Opps/Diss — naming rivals, confrontational lyric; drill\'s foundational oppositional energy.',
    'drill-melodic-sung':'Drill melodic-sung — sung choruses over drill beats; Brooklyn-era crossover innovation.',
    'conscious-drill':'Conscious drill — drill production + socially aware lyric; Nines / Headie One political-reflective mode.',
    'party-drill':'Party drill — drill beat used for club/celebration lyric rather than menace; genre-as-vehicle approach.'
  };
  const fcMap = {
    'uk-offbeat':'UK offbeat cadence — flow rides off the downbeat, syncopated with sliding 808s; signature UK drill rhythm.',
    'chicago-original':'Chicago original cadence — on-beat, more aggressive direct flow; earlier drill standard.',
    'slide-flow':'Slide flow — vocal glides matching 808 slides; modern drill rhythmic-melodic integration.',
    'triplet-aggressive':'Triplet aggressive — triplet-based fast flow over drill beat; modern hybrid with trap-style triplet delivery.'
  };
  const bfMap = {
    'sliding-808s':'Sliding 808s — bass notes glide between pitches; UK drill signature sonic element.',
    'glide-bass':'Glide bass — similar to sliding 808s but smoother glissando; atmospheric drill variant.',
    'melodic-dark-sample':'Melodic dark sample — minor-key sample (often classical/orchestral) as melodic hook; Pop Smoke era production.',
    'minimal-menace':'Minimal menace — sparse beat, space around elements, ominous atmosphere; tension through restraint.'
  };
  const viMap = {
    'menacing-low':'Menacing-low intensity — deep-chested threatening delivery; low register, measured pacing; Pop Smoke vocal DNA.',
    'aggressive-loud':'Aggressive loud — high-energy shouting delivery; peak intensity, adrenaline-forward; Chief Keef early era.',
    'monotone-detached':'Monotone detached — flat affect, emotionally distant delivery; UK drill cool-menace register.',
    'melodic-autotuned':'Melodic autotuned — sung drill with heavy autotune processing; modern hybrid pop-drill crossover.'
  };
  const lcArr = Array.isArray(dims.lyricContent) ? dims.lyricContent : [dims.lyricContent].filter(Boolean);
  const parts = [];
  if (rsMap[dims.regionStyle])      parts.push(`• REGION: ${rsMap[dims.regionStyle]}`);
  if (lcArr.length)                 parts.push(`• CONTENT: ${lcArr.map(v => lcMap[v]).filter(Boolean).join(' / ')}`);
  if (fcMap[dims.flowCadence])      parts.push(`• FLOW: ${fcMap[dims.flowCadence]}`);
  if (bfMap[dims.beatFeature])      parts.push(`• BEAT: ${bfMap[dims.beatFeature]}`);
  if (viMap[dims.vocalIntensity])   parts.push(`• VOCAL: ${viMap[dims.vocalIntensity]}`);
  return parts.length ? `\n\nDRILL CRAFT DIMENSIONS — HARD CONSTRAINTS:\n${parts.join('\n')}` : '';
}

// ── Editor Prompt Builder ─────────────────────────────────────────────────────
// Builds a context-rich edit prompt using GENRE_BIBLE DNA + full song metadata.
// Called by stream.js action='edit' — gives the editor access to the full bible.
function buildEditPrompt(p) {
  const genre  = p.genre  || 'pop';
  const gb     = GENRE_BIBLE[genre] || GENRE_BIBLE.pop || {};
  const mtb    = MUSIC_THEORY_BIBLE || {};

  // Genre-specific scales
  const scales = (mtb.genreScales || {})[genre] || [];

  // Genre-relevant progressions
  const allProgs = mtb.progressions || {};
  const genreProgs = Object.entries(allProgs)
    .filter(([, v]) => (v.genres || []).includes(genre))
    .map(([name, v]) => `${name}: ${v.prog} — ${v.feel}`)
    .join('\n  ');

  // Genre keys / rules
  const genreKeys = (gb.keys || []).map(k => `• ${k}`).join('\n');

  // Outliers — songs that broke the rules in this genre
  const outliers = (gb.outliers || [])
    .map(o => `• ${o.song}: ${o.rule} → ${o.result}`)
    .join('\n');

  // Song context block
  const ctx = [
    p.title          && `Title: "${p.title}"`,
    `Genre: ${genre}`,
    p.topic          && `Topic: ${p.topic}`,
    p.mood           && `Mood: ${p.mood}`,
    p.style          && `Production Style: ${p.style}`,
    p.brief          && `Song Brief: ${p.brief}`,
    p.chords         && `Chord Progression: ${p.chords}`,
    p.theoryAnalysis && `Theory Notes: ${p.theoryAnalysis}`,
    p.verdict        && `Current Quality Assessment: ${p.verdict}`,
  ].filter(Boolean).join('\n');

  const system = `You are SONIQ's master lyric editor — a world-class songwriter, music producer, and A&R consultant.

═══ GENRE DNA: ${genre.toUpperCase()} ═══
${gb.dna || ''}

STRUCTURE GUIDE:
${gb.structure || ''}

GENRE RULES:
${genreKeys}

SCALES FOR THIS GENRE: ${scales.join(', ')}

CHORD PROGRESSIONS THAT WORK:
  ${genreProgs || 'Standard I-IV-V-I'}

NORM-BREAKERS (songs that broke the rules and won):
${outliers || 'None documented'}

YOUR JOB: Apply ONLY the requested edit. Honor the genre DNA above. Preserve the song's voice, theme, and emotional arc. Return ONLY the complete revised lyrics with [Section] tags — no commentary, no explanation.`;

  const prompt = `SONG CONTEXT:
${ctx}

EDIT INSTRUCTION: "${p.instruction}"

CURRENT LYRICS:
${p.lyrics}`;

  return { prompt, system };
}

// ═══════════════════════════════════════════════════════════════════════════
// PROMPT INTELLIGENCE — Analyzes a generated song + score and returns
// specific, actionable suggestions to improve the NEXT generation.
// Baked into the server — returns structured advice the client can display.
// ═══════════════════════════════════════════════════════════════════════════

function buildPromptIntelligence(params) {
  const {
    genre = 'pop',
    topic = '',
    mood = '',
    hookScore = 0,
    scoreBreakdown = {},
    title = '',
    verdict = '',
    structure = 'standard',
    lyrics = '',
  } = params || {};

  const genreLabel = GENRE_LABELS[genre] || genre;
  const gb = GENRE_BIBLE[genre] || GENRE_BIBLE.pop || {};
  const outliers = (gb.outliers || []);

  // Score dimension analysis
  // If no breakdown sent (client sends only hookScore), derive approximate dims
  // so suggestions are calibrated to quality rather than always firing all four.
  const hasDims = scoreBreakdown && (scoreBreakdown.lyricCraft || scoreBreakdown.hookStrength || scoreBreakdown.genreDNA || scoreBreakdown.structure);
  let lyricCraft, structScore, genreDNA, hookStrength;
  if (hasDims) {
    ({ lyricCraft = 0, structure: structScore = 0, genreDNA = 0, hookStrength = 0 } = scoreBreakdown);
  } else {
    // Derive from overall hookScore (0-100 scale) with slight per-dimension jitter
    // so different tip types are suggested on different generations
    const base = Math.max(0, Math.min(100, hookScore));
    const jitter = () => (Math.random() - 0.5) * 20; // ±10 points of noise
    lyricCraft   = Math.round((base + jitter()) * 0.30); // max 30
    structScore  = Math.round((base + jitter()) * 0.25); // max 25
    genreDNA     = Math.round((base + jitter()) * 0.25); // max 25
    hookStrength = Math.round((base + jitter()) * 0.20); // max 20
  }
  const weakest = [
    { dim: 'Lyric Craft', score: lyricCraft, max: 30 },
    { dim: 'Structure', score: structScore, max: 25 },
    { dim: 'Genre DNA', score: genreDNA, max: 25 },
    { dim: 'Hook Strength', score: hookStrength, max: 20 },
  ].sort((a, b) => (a.score / a.max) - (b.score / b.max));

  const suggestions = [];

  // --- LYRIC CRAFT suggestions ---
  if (lyricCraft < 22) {
    const lyricTips = [
      `Make the ${genreLabel} verse more specific — add a proper noun, a street address, a brand name, a clock time. Specificity creates universality.`,
      `Replace the weakest line in the chorus with an extended simile: "as [adjective] as [unexpected noun]" — the more surprising the comparison, the harder it lands.`,
      `Try writing verse 2 from the opposite point of view — the antagonist's perspective reveals what verse 1 couldn't say about the situation.`,
      `Use a callback structure: plant one specific image in verse 1, pay it off in the bridge with the same words but opposite meaning.`,
    ];
    suggestions.push({ type: 'lyric', priority: 1, tip: lyricTips[Math.floor(Math.random() * lyricTips.length)] });
  }

  // --- HOOK STRENGTH suggestions ---
  if (hookStrength < 16) {
    const hookStructKeys = Object.keys(HOOK_STRUCTURE_NOTES).filter(k => k !== 'auto');
    const randomHookStruct = hookStructKeys[Math.floor(Math.random() * hookStructKeys.length)];
    suggestions.push({
      type: 'hook',
      priority: hookStrength < 12 ? 1 : 2,
      tip: `Your hook needs more structural punch. Try the "${randomHookStruct}" approach: ${HOOK_STRUCTURE_NOTES[randomHookStruct]}`,
    });
  }

  // --- STRUCTURE suggestions ---
  if (structScore < 18) {
    const gsd = GENRE_SECTION_DNA[genre] || {};
    const preRef = (gsd.bridge?.preferred_prechorus || [])[0];
    const postRef = (gsd.bridge?.preferred_postchorus || [])[0];
    const structTips = [
      preRef && `Add a [Pre-Chorus] section using the "${preRef}" technique to build maximum tension before the hook drops.`,
      postRef && `Add a [Post-Chorus] "power part" using the "${postRef}" technique — this is where listeners replay the song.`,
      `Try the "${(gsd.bridge?.preferred_bridge || ['Confessional Drop'])[0]}" bridge archetype — it's the most resonant structural choice for ${genreLabel}.`,
      `Your verse 2 should use the "${(gsd.bridge?.preferred_verse2 || ['Deeper Specific'])[0]}" escalation strategy to avoid feeling like a copy of verse 1.`,
    ].filter(Boolean);
    if (structTips.length) suggestions.push({ type: 'structure', priority: structScore < 15 ? 1 : 2, tip: structTips[Math.floor(Math.random() * structTips.length)] });
  }

  // --- GENRE DNA suggestions ---
  if (genreDNA < 18) {
    const genreKeys = gb.keys || [];
    const randomKey = genreKeys[Math.floor(Math.random() * genreKeys.length)];
    const outlierRef = outliers.length ? outliers[Math.floor(Math.random() * outliers.length)] : null;
    const dnaTips = [
      randomKey && `Apply this ${genreLabel} DNA rule: "${randomKey}"`,
      outlierRef && `Study how "${outlierRef.song}" broke the ${genreLabel} rule (${outlierRef.rule}) and got the result: ${outlierRef.result}. Consider a deliberate rule-break in your next version.`,
      `Your production prompt needs stronger ${genreLabel} genre signals. Add the genre-specific instruments, BPM range, and production texture that Suno needs to place this correctly.`,
    ].filter(Boolean);
    if (dnaTips.length) suggestions.push({ type: 'genre', priority: genreDNA < 15 ? 1 : 3, tip: dnaTips[Math.floor(Math.random() * dnaTips.length)] });
  }

  // --- TOPIC/MOOD suggestions based on score level ---
  if (hookScore < 70) {
    const topicSuggestions = [
      topic && `Narrow the topic further. Instead of "${topic}", try the most specific 5-minute moment within that experience — the phone call, the exact thing that was said, the last thing you saw before it changed.`,
      `Add a specific constraint to force creativity: write the song from inside a car, or set it at 3:47am, or limit the chorus to a single repeated metaphor.`,
      mood && `Push the mood to its extremes — if the mood is "${mood}", find the version that tips into its opposite in the bridge. Emotional complexity outperforms single-mood songs.`,
    ].filter(Boolean);
    if (topicSuggestions.length) suggestions.push({ type: 'topic', priority: 3, tip: topicSuggestions[Math.floor(Math.random() * topicSuggestions.length)] });
  }

  // Sort by priority, return top 3
  suggestions.sort((a, b) => a.priority - b.priority);
  const top3 = suggestions.slice(0, 3);

  return {
    score: hookScore,
    weakestDimension: weakest[0]?.dim || null,
    suggestions: top3.map(s => ({ type: s.type, tip: s.tip })),
    genreLabel,
  };
}

function buildProductionData(genre) {
  const fx  = GENRE_FX_PROFILES[genre]  || {};
  const pl  = GENRE_PLUGIN_CHAINS[genre] || {};
  const mst = MASTERING_TARGETS[genre]  || {};
  return {
    fxChain: Object.keys(fx).length ? [
      fx.reverb        ? `REVERB: ${fx.reverb}`             : '',
      fx.delay         ? `DELAY: ${fx.delay}`               : '',
      fx.compression   ? `COMPRESSION: ${fx.compression}`   : '',
      fx.eq            ? `EQ: ${fx.eq}`                     : '',
      fx.sidechain     ? `SIDECHAIN: ${fx.sidechain}`       : '',
      fx.width         ? `SIGNATURE EFFECT: ${fx.width}`    : '',
    ].filter(Boolean).join('\n') : '',
    pluginToolkit: (pl.free || pl.paid) ? [
      pl.free ? `FREE: ${pl.free.join(', ')}` : '',
      pl.paid ? `PAID: ${pl.paid.join(', ')}` : '',
      `DAW TIP: Use the free alternatives first — master your signal chain before adding paid color.`,
    ].filter(Boolean).join('\n') : '',
    mixBlueprint: fx.width ? [
      `STEREO FIELD: ${fx.width}`,
      fx.sidechain ? `LEVEL HIERARCHY: Kick and bass centered and dominant; ${fx.sidechain}` : '',
      `BUS STRUCTURE: Drums bus → Vocal bus → Instrument bus → Master bus with gentle glue compression`,
      `SPECIAL TECHNIQUE: ${fx.compression || 'Standard VCA bus glue at 2-4 dB GR'}`,
    ].filter(Boolean).join('\n') : '',
    masteringTarget: mst.lufs ? [
      `LUFS: ${mst.lufs}`,
      `DYNAMIC RANGE: ${mst.dynamicRange || 'DR 8-10'}`,
      `BRIGHTNESS: ${mst.brightness || 'Natural'}`,
      `STEREO WIDTH: ${mst.stereoWidth || 'Moderate'}`,
      `NOTES: ${mst.notes || ''}`,
    ].filter(Boolean).join('\n') : '',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// URL ANALYZER — Breaks down any song, freestyle, or performance from a URL
// Supports: YouTube, SoundCloud, Spotify, TikTok, Instagram, any link
// Returns structured JSON breakdown + repurpose parameters for Soniq
// ═══════════════════════════════════════════════════════════════════════════

function buildAnalyzePrompt({ title = '', author = '', platform = '', transcript = '', url = '', userContext = '' }) {
  const system = `You are SONIQ ANALYZER — an elite music intelligence system that breaks down songs, freestyles, live performances, and musical content from any genre for repurposing in AI music creation. You have mastered: rap freestyle analysis (NY cipher, West Coast, UK grime, battle rap, melodic drill, Southern trap), jazz improvisation (free jazz, bebop, fusion, scat), spoken word and slam poetry, Afrobeats, dancehall, folk, blues, gospel, soul, neo-soul, pop, rock, country, EDM, Bollywood, K-pop, C-pop, bossa nova, amapiano, and all world music forms. Your analysis is precise, technical, and immediately actionable for a songwriter. Always respond with ONLY a valid JSON object — no markdown fences, no prose, no explanation outside the JSON.`;

  const transcriptSection = transcript
    ? `\n\nTRANSCRIPT / LYRICS (use this as primary source for analysis):\n${transcript.slice(0, 4000)}`
    : `\n\n(No transcript available — analyze from metadata, title, artist, and your deep knowledge of this content and artist's catalog)`;

  const prompt = `Analyze this musical content and return a complete JSON breakdown.

SOURCE PLATFORM: ${platform || 'Unknown'}
URL: ${url || 'N/A'}
TITLE: ${title || 'Unknown'}
ARTIST / CHANNEL: ${author || 'Unknown'}
USER NOTES: ${userContext || 'None'}${transcriptSection}

Return ONLY this JSON structure (fill every field — use "unknown" only if truly unclear, never leave blank):
{
  "title": "confirmed or best-inferred title",
  "artist": "artist, rapper, musician, or channel name",
  "genre": "primary genre (one of: hiphop, jazz, pop, rnb, rock, country, edm, folk, latin, afrobeats, reggae, blues, soul, gospel, spoken_word, dancehall, bossa, bollywood, cpop, drill, amapiano, neosoul, metal, other)",
  "subgenre": "specific subgenre or style flavor (e.g. 'NY cipher freestyle', 'West Coast G-funk storytelling', 'UK grime battle', 'free jazz improvisation', 'trap melodic freestyle', 'qawwali', 'Afrobeats highlife')",
  "era": "decade or era as string (e.g. '1990s', '2000s', '2010s', 'Contemporary 2020s')",
  "tempo_feel": "slow / mid / fast / variable / rubato",
  "bpm_estimate": "estimated BPM or range (e.g. '85-95 BPM', '140 BPM', 'variable')",
  "key_techniques": ["list 5-7 specific technical craft elements used — be specific: 'multisyllabic internal rhyme scheme', 'AABB couplets with punchline pivot', 'pentatonic riff over blues changes', 'stream of consciousness associative flow', 'call-and-response structure', 'scat improvisation over chord changes', 'spoken word anaphora', 'riddim chant hook'"],
  "flow_or_delivery": "description of vocal delivery, rap flow, or performance style (e.g. 'rapid-fire triplet flow with pocket displacement', 'laid-back conversational half-time delivery', 'melodic sung verses with rhythmic spoken breaks', 'jazz scat mimicking trumpet lines')",
  "rhyme_scheme": "rhyme pattern if applicable (e.g. 'AABB couplets', 'ABAB alternating', 'multisyllabic internal rhymes every 4th beat', 'free verse — no consistent scheme', 'n/a — instrumental')",
  "structure": "performance/song structure (e.g. 'verse-only open freestyle — no hook', 'AABA jazz standard head-solo-head', 'verse-chorus-verse-chorus-bridge-chorus', 'cipher round — 16 bars per MC', 'through-composed', 'mukhda-antara-mukhda')",
  "bar_count": "approximate bar or verse count, or 'variable / open-ended', or 'n/a'",
  "themes": ["list 3-5 core themes, subjects, or topics"],
  "emotional_register": "the dominant emotional tone (e.g. 'aggressive / confrontational', 'melancholic / introspective', 'joyful / celebratory', 'raw / vulnerable', 'boastful / confident', 'spiritual / devotional', 'political / protest')",
  "production_signature": "key production elements detectable from context (e.g. 'sparse 808 bass + hi-hat triplets over dark minor piano loop', 'live jazz trio — upright bass, brushed drums, piano', 'nylon guitar bossa pattern close-mic', 'a cappella — no production')",
  "standout_moments": "2-3 sentences describing the most technically impressive, emotionally powerful, or genre-defining moments",
  "what_makes_it_great": "1-2 sentences on the core quality that makes this content worth studying and repurposing — be specific about craft",
  "soniq_repurpose": {
    "genre": "Soniq genre key (one of: hiphop / jazz / pop / rnb / rock / country / edm / folk / latin / afrobeats / reggae / blues / soul / gospel / dancehall / bossa / bollywood / cpop / drill / amapiano / neosoul / metal)",
    "mood": "mood string for Soniq (e.g. 'intense, raw, street energy', 'cool, intimate, bittersweet', 'joyful, celebratory, high energy')",
    "topic": "best topic or theme seed for Soniq to generate something inspired by this (2-6 words)",
    "style_instruction": "one precise sentence telling the Soniq AI how to match this style — the single most important technical or creative direction",
    "suno_tags": "comma-separated production tags for Suno/Udio (e.g. 'hip-hop, boom bap, sparse 808, dark minor, 92 BPM, freestyle flow, raw')"
  }
}`;

  return { system, prompt };
}

module.exports = { buildSongPrompt, buildLuckyPrompt, buildRapLabPrompt, buildEditPrompt, buildPromptIntelligence, buildAnalyzePrompt, GENRE_LABELS, GENRE_BIBLE, MUSIC_THEORY_BIBLE, SYNC_BIBLE, VARIANT_PROMPTS, buildVariantPrompt, FEEDBACK_DIMENSIONS, buildFeedbackPrompt, RHYME_SCHEMES, GENRE_RHYME_PREF, ERA_VOCABULARY, EMOTIONAL_ARCS, GENRE_SYLLABLE_BUDGETS, GENRE_FX_PROFILES, GENRE_PLUGIN_CHAINS, MASTERING_TARGETS, PRODUCTION_ARCHETYPES, buildProductionData, GENRE_HIT_REFERENCES, buildTopTierNote, ADLIB_BIBLE, VOCAL_STACK_PROFILES, buildAdlibNote, buildVocalStackNote, EDGE_TOPICS, EDGE_MODES, buildEdgeNote };
