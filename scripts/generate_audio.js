/**
 * Intellia SG — Numbers to 1000
 * Full audio pre-generation — ALL phases + number narration
 * Run: node scripts/generate_audio.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) { console.error('❌ .env.local not found'); process.exit(1); }
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [k, ...rest] = line.split('=');
    if (k && rest.length) process.env[k.trim()] = rest.join('=').trim();
  });
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL    = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  celebration:  { stability:0.12, similarity_boost:0.45, style:0.75, use_speaker_boost:true },
  encouragement:{ stability:0.16, similarity_boost:0.50, style:0.65, use_speaker_boost:true },
  question:     { stability:0.20, similarity_boost:0.55, style:0.55, use_speaker_boost:true },
  emphasis:     { stability:0.16, similarity_boost:0.50, style:0.60, use_speaker_boost:true },
  thinking:     { stability:0.24, similarity_boost:0.60, style:0.35, use_speaker_boost:true },
  statement:    { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
  instruction:  { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
};

// ── COMPLETE phrase list — every narrated text in the app ──────────────────
const phrases = [

  // ── INTRO ──
  { text: "Welcome to Numbers to 1000! Let's explore hundreds, tens, and ones together.", style: 'statement' },
  { text: "Big numbers are everywhere — in libraries, markets, and even MRT stations!", style: 'thinking' },
  { text: "Are you ready to become a place value expert?", style: 'question' },

  // ── WONDER ──
  { text: "If you had 347 marbles, how would you count them all without getting lost?", style: 'thinking' },
  { text: "Big numbers can be tricky! But I know a secret...", style: 'statement' },
  { text: "We can break them into hundreds, tens, and ones!", style: 'emphasis' },
  { text: "Watch what happens when we group the marbles together.", style: 'statement' },

  // ── STORY — one per slide ──
  { text: "Emma loves collecting stickers. She has so many, she needs to organise them! Can you help her count?", style: 'statement' },
  { text: "She puts them into albums. Each album holds one hundred stickers. She has three albums — that is 300 stickers!", style: 'statement' },
  { text: "She also has four strips of ten stickers. That is 40 more stickers!", style: 'statement' },
  { text: "And she has 7 single stickers too. These are the ones — the last digits!", style: 'statement' },
  { text: "Three hundreds, four tens, and seven ones. We write this as 347. Look at the place value chart!", style: 'emphasis' },
  { text: "We say: three hundred and forty-seven. 347 equals 300 plus 40 plus 7. This is called the expanded form!", style: 'emphasis' },

  // ── SIMULATE — Station A: Block Builder ──
  { text: "Welcome to the Block Builder! Use the plus and minus buttons to build numbers with place value blocks.", style: 'instruction' },
  { text: "Remember: a hundred-flat is worth 100, a ten-rod is worth 10, and a one-cube is worth 1.", style: 'statement' },
  { text: "Try to match the target number by placing the correct number of hundreds, tens, and ones.", style: 'instruction' },
  { text: "Brilliant! You built the number correctly using place value blocks!", style: 'celebration' },

  // ── SIMULATE — Station B: Place Value Chart ──
  { text: "Welcome to the Place Value Chart! Use the arrows to fill in the hundreds, tens, and ones.", style: 'instruction' },
  { text: "Watch the number word appear below as you fill in the chart!", style: 'statement' },
  { text: "Be careful with zero! If there are no tens, put a zero in the tens column.", style: 'instruction' },
  { text: "Great work filling in the place value chart!", style: 'encouragement' },

  // ── SIMULATE — Station C: Expanded Form ──
  { text: "Welcome to Expanded Form! Fill in the blanks to complete the number sentences.", style: 'instruction' },
  { text: "Can you break the number into its hundreds, tens, and ones?", style: 'question' },
  { text: "Use the number pad to type your answer. Press the check button when you are ready.", style: 'statement' },
  { text: "Excellent! You completed all three simulation stations!", style: 'celebration' },

  // ── PLAY — feedback (multiple variations, randomised in code) ──
  { text: "Brilliant! You know your place values!", style: 'celebration' },
  { text: "Correct! Well done, keep going!", style: 'celebration' },
  { text: "Incredible work! You got it right!", style: 'celebration' },
  { text: "Excellent! That is the right answer!", style: 'celebration' },
  { text: "Fantastic! You are a place value star!", style: 'celebration' },
  { text: "Hmm, let's look at the place value chart again!", style: 'encouragement' },
  { text: "Not quite, but you can do it! Try again!", style: 'encouragement' },
  { text: "Almost there! Give it another try!", style: 'encouragement' },
  { text: "Not quite. Let's think about this carefully.", style: 'encouragement' },

  // ── PLAY — hint system ──
  { text: "Here is your hint.", style: 'instruction' },
  { text: "Here is another hint.", style: 'instruction' },
  { text: "Use the place value chart to help you.", style: 'instruction' },
  { text: "Think about hundreds, tens, and ones.", style: 'thinking' },
  { text: "Look at the hundreds digit first.", style: 'instruction' },
  { text: "Count the place value blocks carefully.", style: 'instruction' },

  // ── PLAY — world complete narration ──
  { text: "Well done! You completed this world!", style: 'celebration' },
  { text: "You scored three stars! Perfect round!", style: 'celebration' },
  { text: "You scored two stars! Great work!", style: 'celebration' },
  { text: "You scored one star! Good effort, keep practising!", style: 'encouragement' },
  { text: "You need at least five out of ten to unlock the next world.", style: 'instruction' },

  // ── PLAY — streak milestone ──
  { text: "Fantastic streak! You are on fire!", style: 'celebration' },
  { text: "Amazing! Ten in a row! You are unstoppable!", style: 'celebration' },

  // ── PLAY — explanation narration ──
  { text: "Here is the explanation.", style: 'instruction' },

  // ── REFLECT ──
  { text: "What did you learn today about place value?", style: 'question' },
  { text: "You now know that every 3-digit number is made of hundreds, tens, and ones.", style: 'statement' },
  { text: "How confident do you feel about numbers to 1000?", style: 'question' },
  { text: "In 536, which digit is in the hundreds place?", style: 'question' },
  { text: "What is 700 plus 20 plus 4?", style: 'question' },
  { text: "Nine hundred and five in numerals — what is this number?", style: 'question' },
  { text: "Congratulations! You are now a Place Value Pro!", style: 'celebration' },
  { text: "You completed all five phases. Excellent work today!", style: 'celebration' },

  // ── NUMBER NARRATION — digits 0–9 ──
  { text: "Zero",  style: 'statement' },
  { text: "One",   style: 'statement' },
  { text: "Two",   style: 'statement' },
  { text: "Three", style: 'statement' },
  { text: "Four",  style: 'statement' },
  { text: "Five",  style: 'statement' },
  { text: "Six",   style: 'statement' },
  { text: "Seven", style: 'statement' },
  { text: "Eight", style: 'statement' },
  { text: "Nine",  style: 'statement' },

  // ── NUMBER NARRATION — tens ──
  { text: "Ten",     style: 'statement' },
  { text: "Twenty",  style: 'statement' },
  { text: "Thirty",  style: 'statement' },
  { text: "Forty",   style: 'statement' },
  { text: "Fifty",   style: 'statement' },
  { text: "Sixty",   style: 'statement' },
  { text: "Seventy", style: 'statement' },
  { text: "Eighty",  style: 'statement' },
  { text: "Ninety",  style: 'statement' },

  // ── NUMBER NARRATION — hundreds ──
  { text: "One hundred",   style: 'statement' },
  { text: "Two hundred",   style: 'statement' },
  { text: "Three hundred", style: 'statement' },
  { text: "Four hundred",  style: 'statement' },
  { text: "Five hundred",  style: 'statement' },
  { text: "Six hundred",   style: 'statement' },
  { text: "Seven hundred", style: 'statement' },
  { text: "Eight hundred", style: 'statement' },
  { text: "Nine hundred",  style: 'statement' },

  // ── NUMBER NARRATION — simulation target numbers ──
  { text: "247", style: 'statement' },
  { text: "136", style: 'statement' },
  { text: "509", style: 'statement' },
  { text: "382", style: 'statement' },
  { text: "715", style: 'statement' },
  { text: "456", style: 'statement' },
  { text: "302", style: 'statement' },
  { text: "718", style: 'statement' },
  { text: "640", style: 'statement' },
  { text: "347", style: 'statement' },

];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 60);
}

function fetchAudio(text, style, apiKey) {
  return new Promise((resolve, reject) => {
    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
    const body = JSON.stringify({ text, model_id: MODEL, voice_settings: settings });
    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        if (res.statusCode === 200) resolve(Buffer.concat(chunks));
        else reject(new Error(`API ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
      });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  loadEnv();
  const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) { console.error('❌ No API key found in .env.local'); process.exit(1); }

  const audioDir = path.join(ROOT, 'public', 'assets', 'audio');
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

  const audioMap = {};
  let idx = 0;
  let generated = 0;
  let skipped   = 0;

  for (const { text, style } of phrases) {
    const slug     = slugify(text);
    const filename = `audio_${slug}_${idx}.mp3`;
    const filePath = path.join(audioDir, filename);
    const webPath  = `/assets/audio/${filename}`;

    if (fs.existsSync(filePath)) {
      console.log(`⏭  [${idx}] Skipping: ${filename}`);
      audioMap[text] = webPath;
      skipped++;
    } else {
      console.log(`🎙  [${idx}] [${style}] "${text.substring(0, 58)}"`);
      try {
        const buf = await fetchAudio(text, style, apiKey);
        fs.writeFileSync(filePath, buf);
        audioMap[text] = webPath;
        generated++;
        console.log(`   ✅ Saved`);
      } catch (err) {
        console.error(`   ❌ Failed: ${err.message}`);
      }
      await sleep(500);
    }
    idx++;
  }

  const mapContent = `// AUTO-GENERATED by scripts/generate_audio.js — DO NOT EDIT MANUALLY
// Run \`node scripts/generate_audio.js\` to regenerate
export const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;

  fs.writeFileSync(path.join(ROOT, 'src', 'utils', 'audioMap.js'), mapContent);
  console.log(`\n✅ Done! ${Object.keys(audioMap).length} entries | ${generated} new | ${skipped} skipped`);
}

main().catch(e => { console.error(e); process.exit(1); });
