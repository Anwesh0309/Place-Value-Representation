import { say, ask, emphasize, think, celebrate, instruct, cheer } from './audio.js';

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Every text string here MUST exactly match a key in audioMap.js
// so the pre-generated .mp3 is used. Mismatches fall back to ElevenLabs API.
// ─────────────────────────────────────────────────────────────────────────────

export function introNarration() {
  return [
    say("Welcome to Numbers to 1000! Let's explore hundreds, tens, and ones together."),
    think("Big numbers are everywhere — in libraries, markets, and even MRT stations!"),
    ask("Are you ready to become a place value expert?"),
  ];
}

export function wonderNarration() {
  return [
    ask("If you had 347 marbles, how would you count them all without getting lost?"),
    think("Big numbers can be tricky! But I know a secret..."),
    emphasize("We can break them into hundreds, tens, and ones!"),
    say("Watch what happens when we group the marbles together."),
  ];
}

// Per-slide story narrations (index matches SLIDES array in StoryPhase)
export const STORY_SLIDE_NARRATIONS = [
  say("Mei Ling loves collecting stickers. She has so many, she needs to organise them! Can you help her count?"),
  say("She puts them into albums. Each album holds one hundred stickers. She has three albums — that is 300 stickers!"),
  say("She also has four strips of ten stickers. That is 40 more stickers!"),
  say("And she has 7 single stickers too. These are the ones — the last digits!"),
  emphasize("Three hundreds, four tens, and seven ones. We write this as 347. Look at the place value chart!"),
  emphasize("We say: three hundred and forty-seven. 347 equals 300 plus 40 plus 7. This is called the expanded form!"),
];

export function simulateStationANarration() {
  return [
    instruct("Welcome to the Block Builder! Use the plus and minus buttons to build numbers with place value blocks."),
    say("Remember: a hundred-flat is worth 100, a ten-rod is worth 10, and a one-cube is worth 1."),
    instruct("Try to match the target number by placing the correct number of hundreds, tens, and ones."),
  ];
}

export function simulateStationBNarration() {
  return [
    instruct("Welcome to the Place Value Chart! Use the arrows to fill in the hundreds, tens, and ones."),
    say("Watch the number word appear below as you fill in the chart!"),
    instruct("Be careful with zero! If there are no tens, put a zero in the tens column."),
  ];
}

export function simulateStationCNarration() {
  return [
    instruct("Welcome to Expanded Form! Fill in the blanks to complete the number sentences."),
    ask("Can you break the number into its hundreds, tens, and ones?"),
    say("Use the number pad to type your answer. Press the check button when you are ready."),
  ];
}

// Randomised correct feedback
const CORRECT_MESSAGES = [
  "Brilliant! You know your place values!",
  "Correct! Well done, keep going!",
  "Incredible work! You got it right!",
  "Excellent! That is the right answer!",
  "Fantastic! You are a place value star!",
];

// Randomised incorrect feedback
const INCORRECT_MESSAGES = [
  "Hmm, let's look at the place value chart again!",
  "Not quite, but you can do it! Try again!",
  "Almost there! Give it another try!",
  "Not quite. Let's think about this carefully.",
];

export function correctNarration() {
  const msg = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
  return [celebrate(msg)];
}

export function incorrectNarration() {
  const msg = INCORRECT_MESSAGES[Math.floor(Math.random() * INCORRECT_MESSAGES.length)];
  return [cheer(msg)];
}

export function worldCompleteNarration(stars) {
  if (stars === 3) return [celebrate("You scored three stars! Perfect round!"), celebrate("Well done! You completed this world!")];
  if (stars === 2) return [celebrate("You scored two stars! Great work!"), celebrate("Well done! You completed this world!")];
  if (stars === 1) return [cheer("You scored one star! Good effort, keep practising!"), celebrate("Well done! You completed this world!")];
  return [instruct("You need at least five out of ten to unlock the next world.")];
}

export function streakNarration(streak) {
  if (streak >= 10) return [celebrate("Amazing! Ten in a row! You are unstoppable!")];
  return [celebrate("Fantastic streak! You are on fire!")];
}

// Hint narration — pre-generated intro + dynamic hint text
// hintNum: 1 = first hint, 2 = second hint
export function hintIntroNarration(hintNum) {
  if (hintNum === 1) return [instruct("Here is your hint.")];
  return [instruct("Here is another hint.")];
}

export function explanationIntroNarration() {
  return [instruct("Here is the explanation.")];
}

export function reflectNarration() {
  return [
    ask("What did you learn today about place value?"),
    say("You now know that every 3-digit number is made of hundreds, tens, and ones."),
    ask("How confident do you feel about numbers to 1000?"),
  ];
}

export function reflectQ1Narration() {
  return [ask("In 536, which digit is in the hundreds place?")];
}

export function reflectQ2Narration() {
  return [ask("What is 700 plus 20 plus 4?")];
}

export function reflectQ3Narration() {
  return [ask("Nine hundred and five in numerals — what is this number?")];
}

export function completionNarration() {
  return [
    celebrate("Congratulations! You are now a Place Value Pro!"),
    celebrate("You completed all five phases. Excellent work today!"),
  ];
}

// Number narration — used when user interacts with digit buttons/spinners
// Returns a single segment with the spoken number
export function speakNumber(n) {
  const words = {
    0: 'Zero', 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four',
    5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine',
    10: 'Ten', 20: 'Twenty', 30: 'Thirty', 40: 'Forty', 50: 'Fifty',
    60: 'Sixty', 70: 'Seventy', 80: 'Eighty', 90: 'Ninety',
    100: 'One hundred', 200: 'Two hundred', 300: 'Three hundred',
    400: 'Four hundred', 500: 'Five hundred', 600: 'Six hundred',
    700: 'Seven hundred', 800: 'Eight hundred', 900: 'Nine hundred',
    136: '136', 247: '247', 302: '302', 347: '347', 382: '382',
    456: '456', 509: '509', 640: '640', 715: '715', 718: '718',
  };
  const text = words[n] ?? String(n);
  return say(text);
}
