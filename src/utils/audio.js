import { audioMap } from './audioMap.js';

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

// ── Segment helpers ────────────────────────────────────────────────────────
export const say      = (text) => ({ text, style: 'statement' });
export const ask      = (text) => ({ text, style: 'question' });
export const cheer    = (text) => ({ text, style: 'encouragement' });
export const emphasize= (text) => ({ text, style: 'emphasis' });
export const think    = (text) => ({ text, style: 'thinking' });
export const celebrate= (text) => ({ text, style: 'celebration' });
export const instruct = (text) => ({ text, style: 'instruction' });

// ── Global mute state ──────────────────────────────────────────────────────
let _muted = false;
export function setMuted(val) { _muted = val; if (val) stopNarration(); }
export function isMuted() { return _muted; }

// ── Internal queue ─────────────────────────────────────────────────────────
let currentQueueId = null;
let currentAudio   = null;

async function getAudioUrl(text, style) {
  // 1. Pre-generated map — exact match
  if (audioMap[text]) return audioMap[text];

  // 2. ElevenLabs dynamic (only if API key present)
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) return null;
  const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: settings }),
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch { return null; }
}

// Cache for dynamically-fetched URLs (avoids re-fetching same question text)
const _dynamicCache = new Map();

export async function narrate(segments) {
  if (_muted) return;
  if (!segments?.length) return;

  const queueId = Symbol();
  currentQueueId = queueId;
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }

  for (let i = 0; i < segments.length; i++) {
    if (currentQueueId !== queueId) return;
    if (_muted) return;

    const { text, style } = segments[i];

    // Check dynamic cache first to avoid duplicate API calls
    let url = null;
    if (_dynamicCache.has(text)) {
      url = _dynamicCache.get(text);
    } else {
      url = await getAudioUrl(text, style);
      // Cache dynamic (non-pre-generated) URLs
      if (url && !audioMap[text]) {
        _dynamicCache.set(text, url);
      }
    }

    // IMPORTANT: if no URL, stay SILENT — never use Web Speech API
    // Web Speech has a different voice which breaks consistency
    if (!url) continue;

    await new Promise((resolve) => {
      if (currentQueueId !== queueId || _muted) { resolve(); return; }
      const audio = new Audio(url);
      currentAudio = audio;
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(resolve);
    });
  }
}

// Instant narration — interrupts current and plays immediately (for number clicks)
export async function narrateNow(segment) {
  if (_muted) return;
  if (!segment) return;

  // Stop current
  currentQueueId = null;
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch {}

  const { text, style } = segment;

  // Check cache first
  let url = _dynamicCache.get(text) || await getAudioUrl(text, style);
  if (url && !audioMap[text]) _dynamicCache.set(text, url);

  // Stay silent if no URL — never use Web Speech (voice consistency)
  if (!url) return;

  const audio = new Audio(url);
  currentAudio = audio;
  audio.play().catch(() => {});
}

export function stopNarration() {
  currentQueueId = null;
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  // Also cancel any residual Web Speech (may have been triggered externally)
  try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch {}
}
