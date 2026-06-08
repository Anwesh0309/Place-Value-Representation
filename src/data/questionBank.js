import { shuffleArray } from '../utils/shuffle.js';
import { numberToWords } from '../utils/numberWords.js';

// ─── Helpers ───────────────────────────────────────────────────────────────
function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function pvOf(n) {
  const num = clamp(Math.round(n), 100, 999);
  return {
    hundreds: Math.floor(num / 100),
    tens: Math.floor((num % 100) / 10),
    ones: num % 10,
    standardForm: num,
    expandedForm: `${Math.floor(num / 100) * 100} + ${Math.floor((num % 100) / 10) * 10} + ${num % 10}`,
    wordForm: numberToWords(num),
  };
}

// Returns exactly 4 options including correct — NO while loops
function make4(correct, pool) {
  const filtered = pool.filter(v => v !== correct);
  const picked = shuffleArray(filtered).slice(0, 3);
  // If pool was too small, pad with safe fallbacks
  const fallbacks = [100, 200, 300, 400, 500, 600, 700, 800, 50, 150, 250, 350, 450];
  let i = 0;
  while (picked.length < 3 && i < fallbacks.length) {
    if (fallbacks[i] !== correct && !picked.includes(fallbacks[i])) picked.push(fallbacks[i]);
    i++;
  }
  return shuffleArray([correct, ...picked.slice(0, 3)]);
}

function numPool(correct) {
  const offsets = [1, -1, 10, -10, 100, -100, 11, -11, 99, -99, 200, -200, 50, -50, 20, -20, 150, -150];
  return offsets
    .map(o => correct + o)
    .filter(v => v >= 100 && v <= 999 && v !== correct);
}

function wordPool(n) {
  const offsets = [1, -1, 10, -10, 100, -100, 11, -11, 50, -50];
  return offsets
    .map(o => clamp(n + o, 100, 999))
    .filter(v => v !== n)
    .map(v => numberToWords(v));
}

// ─── World definitions ─────────────────────────────────────────────────────
export const WORLDS = [
  { id: 0, emoji: '🍭', name: 'Candy Kingdom',  range: [100, 299] },
  { id: 1, emoji: '🌴', name: 'Coconut Grove',  range: [200, 399] },
  { id: 2, emoji: '🏝️', name: 'Sandy Beach',    range: [300, 499] },
  { id: 3, emoji: '🚀', name: 'Sky Launch',      range: [400, 599] },
  { id: 4, emoji: '🌊', name: 'Coral Reef',      range: [500, 699] },
  { id: 5, emoji: '🏔️', name: 'Mountain Peak',  range: [600, 799] },
  { id: 6, emoji: '🌌', name: 'Star Galaxy',     range: [700, 899] },
  { id: 7, emoji: '🐉', name: 'Dragon Lair',     range: [800, 999] },
  { id: 8, emoji: '🌈', name: 'Rainbow Falls',   range: [100, 999] },
  { id: 9, emoji: '🏰', name: 'Number Palace',   range: [100, 999] },
];

function worldRange(world) {
  return WORLDS[world]?.range || [100, 999];
}

function randN(world) {
  const [lo, hi] = worldRange(world);
  return rnd(lo, hi);
}

// ─── Singapore names & objects ─────────────────────────────────────────────
const NAMES   = ['Wei Ming','Priya','Raju','Ahmad','Mei Ling','Jun Hao','Siti','Ryan','Xiao Ling','Mrs Tan'];
const OBJECTS = ['stickers','marbles','library books','stamps','seashells','toy cars','postcards','beads','biscuits','trading cards'];

// ─── Q1: Place value digit value ───────────────────────────────────────────
function makeQ1(world) {
  const n = randN(world);
  const pv = pvOf(n);
  const places = ['hundreds', 'tens', 'ones'];
  const place  = pick(places);
  const digit  = place === 'hundreds' ? pv.hundreds : place === 'tens' ? pv.tens : pv.ones;
  const val    = place === 'hundreds' ? pv.hundreds * 100 : place === 'tens' ? pv.tens * 10 : pv.ones;
  const opts   = make4(val, numPool(val));
  return {
    id: `Q1_w${world}_${n}`, type: 'place_value_chart', world,
    ...pv,
    questionText: `Look at the number ${n}. What is the value of the digit ${digit}?`,
    visual: 'chart',
    hint1: `The digit ${digit} is in the ${place} column of the place value chart.`,
    hint2: `${digit} in the ${place} place means ${digit} × ${place === 'hundreds' ? 100 : place === 'tens' ? 10 : 1} = ${val}.`,
    explanation: `In ${n}, the digit ${digit} is in the ${place} place. Its value is ${val}.`,
    options: opts, correctAnswer: val,
  };
}

// ─── Q2: Block count → number ──────────────────────────────────────────────
function makeQ2(world) {
  const n  = randN(world);
  const pv = pvOf(n);
  const opts = make4(n, numPool(n));
  return {
    id: `Q2_w${world}_${n}`, type: 'block_count', world,
    ...pv,
    questionText: `${pv.hundreds} hundreds, ${pv.tens} tens, and ${pv.ones} ones. What number is this?`,
    visual: 'blocks',
    hint1: `Multiply: ${pv.hundreds} × 100 = ${pv.hundreds * 100}.`,
    hint2: `${pv.hundreds * 100} + ${pv.tens * 10} + ${pv.ones} = ${n}.`,
    explanation: `${pv.hundreds} hundreds + ${pv.tens} tens + ${pv.ones} ones = ${pv.hundreds * 100} + ${pv.tens * 10} + ${pv.ones} = ${n}.`,
    options: opts, correctAnswer: n,
  };
}

// ─── Q3: Expanded form fill-blank ──────────────────────────────────────────
function makeQ3(world) {
  const n  = randN(world);
  const pv = pvOf(n);
  const parts = [
    { label: 'hundreds', val: pv.hundreds * 100, disp: String(pv.hundreds * 100) },
    { label: 'tens',     val: pv.tens * 10,       disp: String(pv.tens * 10) },
    { label: 'ones',     val: pv.ones,             disp: String(pv.ones) },
  ];
  const mIdx   = rnd(0, 2);
  const missing = parts[mIdx];
  const hPart  = mIdx === 0 ? '___' : parts[0].disp;
  const tPart  = mIdx === 1 ? '___' : parts[1].disp;
  const oPart  = mIdx === 2 ? '___' : parts[2].disp;
  const opts   = make4(missing.val, numPool(missing.val));
  return {
    id: `Q3_w${world}_${n}`, type: 'expanded_form', world,
    ...pv,
    questionText: `Fill in the blank: ${n} = ${hPart} + ${tPart} + ${oPart}`,
    visual: 'sentence',
    hint1: `Break ${n} into hundreds, tens, and ones using the place value chart.`,
    hint2: `${n} = ${pv.hundreds * 100} + ${pv.tens * 10} + ${pv.ones}. Missing = ${missing.val}.`,
    explanation: `${n} = ${pv.hundreds * 100} + ${pv.tens * 10} + ${pv.ones}. The missing value is ${missing.val}.`,
    options: opts, correctAnswer: missing.val,
  };
}

// ─── Q4: Numeral → words ───────────────────────────────────────────────────
function makeQ4(world) {
  const n  = randN(world);
  const pv = pvOf(n);
  const opts = make4(pv.wordForm, wordPool(n));
  return {
    id: `Q4_w${world}_${n}`, type: 'word_form', world,
    ...pv,
    questionText: `Write ${n} in words.`,
    visual: 'sentence',
    hint1: `Say the number out loud. How many hundreds, tens, and ones?`,
    hint2: `${n} = ${pv.hundreds} hundreds, ${pv.tens} tens, ${pv.ones} ones.`,
    explanation: `${n} in words is: ${pv.wordForm}.`,
    options: opts, correctAnswer: pv.wordForm,
  };
}

// ─── Q5: Words → numeral ───────────────────────────────────────────────────
function makeQ5(world) {
  const n  = randN(world);
  const pv = pvOf(n);
  const opts = make4(n, numPool(n));
  return {
    id: `Q5_w${world}_${n}`, type: 'standard_form', world,
    ...pv,
    questionText: `"${pv.wordForm}" — what is this number in numerals?`,
    visual: 'sentence',
    hint1: `Listen for hundreds, tens, and ones in the number name.`,
    hint2: `${pv.wordForm} → ${pv.hundreds} hundreds, ${pv.tens} tens, ${pv.ones} ones.`,
    explanation: `"${pv.wordForm}" is ${n}.`,
    options: opts, correctAnswer: n,
  };
}

// ─── Q6: Compare ──────────────────────────────────────────────────────────
function makeQ6(world) {
  const [lo, hi] = worldRange(world);
  const a = rnd(lo, hi);
  // Ensure b differs from a by picking a different value
  let b = rnd(lo, hi);
  if (b === a) b = a < hi ? a + 1 : a - 1;
  const greater = Math.max(a, b);
  const opts = shuffleArray([a, b]);
  return {
    id: `Q6_w${world}_${a}_${b}`, type: 'compare_order', world,
    ...pvOf(a),
    questionText: `Which is greater: ${a} or ${b}?`,
    visual: 'compare',
    hint1: `Compare the hundreds digit first. ${Math.floor(a/100)} vs ${Math.floor(b/100)}.`,
    hint2: `The number with more hundreds (or tens if equal) is greater.`,
    explanation: `${greater} is greater because ${a > b ? `${a} > ${b}` : `${b} > ${a}`}.`,
    options: opts, correctAnswer: greater,
  };
}

// ─── Q7: Number pattern ───────────────────────────────────────────────────
function makeQ7(world) {
  const steps = [10, 20, 50, 100, 200];
  const step  = pick(steps);
  const start = rnd(1, 5) * step + (world > 4 ? 300 : 100);
  const seq   = [start, start + step, start + step * 2, start + step * 3];
  const ans   = seq[3];
  // Cap at 999
  if (ans > 999) seq[3] = seq[3] - 1000;
  const opts = make4(ans, numPool(ans));
  return {
    id: `Q7_w${world}_${start}_${step}`, type: 'number_pattern', world,
    ...pvOf(clamp(ans, 100, 999)),
    questionText: `What comes next? ${seq[0]}, ${seq[1]}, ${seq[2]}, ___`,
    visual: 'pattern',
    hint1: `Find the difference between each pair of numbers.`,
    hint2: `The pattern goes up by ${step}. ${seq[2]} + ${step} = ${ans}.`,
    explanation: `The pattern increases by ${step} each time. ${seq[2]} + ${step} = ${ans}.`,
    options: opts, correctAnswer: ans,
  };
}

// ─── Q8: Which digit is in the ___ place ──────────────────────────────────
function makeQ8(world) {
  const n  = randN(world);
  const pv = pvOf(n);
  const places = ['hundreds', 'tens', 'ones'];
  const place  = pick(places);
  const digit  = place === 'hundreds' ? pv.hundreds : place === 'tens' ? pv.tens : pv.ones;
  // Options are single digits 0–9
  const allDigits = [0,1,2,3,4,5,6,7,8,9];
  const others = shuffleArray(allDigits.filter(d => d !== digit)).slice(0, 3);
  const opts = shuffleArray([digit, ...others]);
  return {
    id: `Q8_w${world}_${n}_${place}`, type: 'digit_place', world,
    ...pv,
    questionText: `In ${n}, which digit is in the ${place} place?`,
    visual: 'chart',
    hint1: `Look at the place value chart. Find the ${place} column.`,
    hint2: `In ${n}: hundreds=${pv.hundreds}, tens=${pv.tens}, ones=${pv.ones}.`,
    explanation: `In ${n}, the digit in the ${place} place is ${digit}.`,
    options: opts, correctAnswer: digit,
  };
}

// ─── Q9: Word problem ────────────────────────────────────────────────────
function makeQ9(world) {
  const name = pick(NAMES);
  const obj  = pick(OBJECTS);
  const n    = randN(world);
  const pv   = pvOf(n);
  const opts = make4(n, numPool(n));
  return {
    id: `Q9_w${world}_${n}`, type: 'word_problem', world,
    ...pv,
    questionText: `${name} has ${pv.hundreds} boxes of 100 ${obj}, ${pv.tens} packs of 10 ${obj}, and ${pv.ones} single ${obj}. How many ${obj} altogether?`,
    visual: 'blocks',
    hint1: `${pv.hundreds} × 100 = ${pv.hundreds * 100}.`,
    hint2: `${pv.hundreds * 100} + ${pv.tens * 10} + ${pv.ones} = ${n}.`,
    explanation: `${pv.hundreds}×100 + ${pv.tens}×10 + ${pv.ones}×1 = ${pv.hundreds*100} + ${pv.tens*10} + ${pv.ones} = ${n}.`,
    options: opts, correctAnswer: n,
  };
}

// ─── Q10: Zero in place ──────────────────────────────────────────────────
function makeQ10(world) {
  // Force a number with at least one zero digit
  const templates = [
    () => { const h = rnd(1,9); const o = rnd(1,9); return h*100 + o; },        // zero tens: e.g. 307
    () => { const h = rnd(1,9); const t = rnd(1,9); return h*100 + t*10; },     // zero ones: e.g. 420
    () => rnd(1,9) * 100,                                                         // zero tens+ones: e.g. 500
  ];
  const n  = pick(templates)();
  const pv = pvOf(n);
  const correct = `${pv.hundreds*100} + ${pv.tens*10} + ${pv.ones}`;
  const wrong1  = `${pv.hundreds*100} + ${pv.ones}`;
  const wrong2  = `${pv.hundreds*100} + ${(pv.tens+1)*10} + ${pv.ones}`;
  const wrong3  = `${(pv.hundreds+1)*100} + ${pv.tens*10} + ${pv.ones}`;
  const opts    = shuffleArray([correct, wrong1, wrong2, wrong3]);
  return {
    id: `Q10_w${world}_${n}`, type: 'zero_place', world,
    ...pv,
    questionText: `Write ${n} in expanded form.`,
    visual: 'sentence',
    hint1: `Check the tens place. Does ${n} have any tens?`,
    hint2: `${pv.tens === 0 ? `There are 0 tens in ${n}.` : ''} Always write all three places.`,
    explanation: `${n} = ${pv.hundreds*100} + ${pv.tens*10} + ${pv.ones}.${pv.tens===0?' The tens digit is 0 — we still write it!':''}`,
    options: opts, correctAnswer: correct,
  };
}

// ─── Generate 100 questions (10 worlds × 10 types) ───────────────────────
const MAKERS = [makeQ1, makeQ2, makeQ3, makeQ4, makeQ5, makeQ6, makeQ7, makeQ8, makeQ9, makeQ10];

export function generateSessionQuestions() {
  const all = [];
  for (let w = 0; w < 10; w++) {
    const worldQs = [];
    for (let t = 0; t < 10; t++) {
      try {
        worldQs.push(MAKERS[t](w));
      } catch (err) {
        // Safe fallback — never crash
        try { worldQs.push(makeQ1(w)); } catch { /* skip */ }
      }
    }
    all.push(...shuffleArray(worldQs));
  }
  return all;
}
