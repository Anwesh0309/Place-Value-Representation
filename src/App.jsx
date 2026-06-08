import { useReducer, useEffect, useRef, useCallback } from 'react';
import FloatingNumbers from './components/FloatingNumbers.jsx';
import IntroScreen from './components/IntroScreen.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import StoryPhase from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PlayPhase from './components/phases/PlayPhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';
import { generateSessionQuestions } from './data/questionBank.js';
import { checkBadges } from './utils/badgeEngine.js';
import { stopNarration, setMuted } from './utils/audio.js';

const PHASES = [
  { id: 'wonder',   label: 'Wonder',   emoji: '🔮' },
  { id: 'story',    label: 'Story',    emoji: '📖' },
  { id: 'simulate', label: 'Simulate', emoji: '🧪' },
  { id: 'play',     label: 'Play',     emoji: '🎮' },
  { id: 'reflect',  label: 'Reflect',  emoji: '📓' },
];

const initialState = {
  phase: 'intro',
  simStationsComplete: [false, false, false],
  questionSet: [],
  currentQuestion: 0,
  currentWorld: 0,
  worldScores: Array(10).fill(null),
  xp: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],
  phaseComplete: { wonder: false, story: false, simulate: false, play: false, reflect: false },
  audioEnabled: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':         return { ...state, phase: action.payload };
    case 'COMPLETE_SIM_STATION': {
      const s = [...state.simStationsComplete]; s[action.payload] = true;
      return { ...state, simStationsComplete: s };
    }
    case 'LOAD_QUESTIONS':    return { ...state, questionSet: action.payload, currentQuestion: 0, currentWorld: 0 };
    case 'ANSWER_CORRECT': {
      const ns = state.streak + 1;
      return { ...state, xp: state.xp + (action.payload.xp || 10), streak: ns, maxStreak: Math.max(state.maxStreak, ns) };
    }
    case 'ANSWER_INCORRECT':  return { ...state, streak: 0 };
    case 'NEXT_QUESTION':     return { ...state, currentQuestion: state.currentQuestion + 1 };
    case 'COMPLETE_WORLD': {
      const sc = [...state.worldScores]; sc[action.payload.world] = action.payload.score;
      return { ...state, worldScores: sc };
    }
    case 'ADVANCE_WORLD': {
      const nw = state.currentWorld + 1;
      return { ...state, currentWorld: nw, currentQuestion: nw * 10 };
    }
    case 'RETRY_WORLD': {
      const sc = [...state.worldScores]; sc[state.currentWorld] = null;
      return { ...state, worldScores: sc, currentQuestion: state.currentWorld * 10 };
    }
    case 'UNLOCK_BADGE':   return state.badges.includes(action.payload) ? state : { ...state, badges: [...state.badges, action.payload] };
    case 'COMPLETE_PHASE': return { ...state, phaseComplete: { ...state.phaseComplete, [action.payload]: true } };
    case 'TOGGLE_AUDIO': {
      const newVal = !state.audioEnabled;
      setMuted(!newVal);            // sync audio engine immediately
      return { ...state, audioEnabled: newVal };
    }
    case 'RESET':          return { ...initialState, audioEnabled: state.audioEnabled };
    default:               return state;
  }
}

// SESSION: only persist audioEnabled preference (mute toggle) — nothing else.
// The app ALWAYS starts from Intro on every load/refresh.
const SESSION_KEY = 'intellia_pv1000_audio_pref';

function loadAudioPref() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return true; // default: audio on
    return JSON.parse(raw)?.audioEnabled !== false;
  } catch { return true; }
}

export default function App() {
  // Always start from initialState — no session restore.
  // Only the audio toggle preference is persisted.
  const [state, dispatch] = useReducer(reducer, initialState, (init) => ({
    ...init,
    audioEnabled: loadAudioPref(),
  }));

  const questionsRef = useRef([]);
  const badgeKey     = useRef('');

  // Sync mute state to audio engine on mount
  useEffect(() => {
    setMuted(!state.audioEnabled);
    // Clear any stale old session keys from previous versions
    try {
      localStorage.removeItem('intellia_pv1000_v1');
      localStorage.removeItem('intellia_pv1000_v2');
      localStorage.removeItem('intellia_pv1000_v3');
    } catch {}
  }, []); // eslint-disable-line

  // Persist ONLY the audio preference when it changes
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ audioEnabled: state.audioEnabled }));
    } catch {}
  }, [state.audioEnabled]);

  // Badge check with dirty flag
  useEffect(() => {
    const key = [
      ...Object.values(state.phaseComplete),
      ...state.simStationsComplete,
      state.maxStreak,
      state.worldScores.filter(Boolean).length,
    ].join('|');
    if (key === badgeKey.current) return;
    badgeKey.current = key;
    checkBadges(state).forEach(id => dispatch({ type: 'UNLOCK_BADGE', payload: id }));
  });

  const go = useCallback((phase) => { stopNarration(); dispatch({ type: 'SET_PHASE', payload: phase }); }, []);

  const startJourney = useCallback(() => {
    stopNarration();
    const qs = generateSessionQuestions();
    questionsRef.current = qs;
    dispatch({ type: 'LOAD_QUESTIONS', payload: qs });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }, []);

  const completePhase = useCallback((phase, next) => {
    dispatch({ type: 'COMPLETE_PHASE', payload: phase });
    stopNarration();
    dispatch({ type: 'SET_PHASE', payload: next });
  }, []);

  const handleReset = useCallback(() => {
    stopNarration();
    questionsRef.current = [];
    dispatch({ type: 'RESET' });
  }, []);

  const getQuestions = () => {
    if (state.questionSet?.length > 0) return state.questionSet;
    if (questionsRef.current.length > 0) return questionsRef.current;
    const qs = generateSessionQuestions();
    questionsRef.current = qs;
    return qs;
  };

  const showBar = state.phase !== 'intro';
  const showHud = state.phase === 'play';

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <FloatingNumbers />

      {/* ── Floating header row — Home | Pill Nav | X ── */}
      {showBar && (
        <div className="header-row">
          {/* Home button — left */}
          <button className="home-btn" onClick={() => go('intro')}>
            🏠 Home
          </button>

          {/* Floating pill — phase steps + audio */}
          <div className="phase-pill">
            {PHASES.map((p, idx) => {
              const isActive   = state.phase === p.id;
              const isComplete = state.phaseComplete[p.id];
              return (
                <div key={p.id} className="phase-step">
                  <div className="phase-step-inner">
                    <div className={`phase-step-num${isActive ? ' is-active' : isComplete ? ' is-done' : ''}`}>
                      {isComplete ? '✓' : idx + 1}
                    </div>
                    <span className="phase-step-emoji">{p.emoji}</span>
                    <span className={`phase-step-label${isActive ? ' is-active' : isComplete ? ' is-done' : ''}`}>
                      {p.label}
                    </span>
                  </div>
                  {idx < PHASES.length - 1 && <span className="phase-step-dash" />}
                </div>
              );
            })}

            {/* Audio toggle inside pill */}
            <button
              className={`audio-btn${state.audioEnabled ? ' on' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_AUDIO' })}
              aria-label={state.audioEnabled ? 'Mute' : 'Unmute'}
            >
              {state.audioEnabled ? '🔊' : '🔇'}
            </button>
          </div>

          {/* X button — right */}
          <button className="x-btn" onClick={() => go('intro')} aria-label="Exit to home">✕</button>
        </div>
      )}

      {/* Scrollable content */}
      <div
        className="scroll-area"
        style={{ paddingTop: showBar ? 58 : 0, paddingBottom: showHud ? 52 : 0 }}
      >
        {state.phase === 'intro'    && <IntroScreen    onStart={startJourney}                            audioEnabled={state.audioEnabled} />}
        {state.phase === 'wonder'   && <WonderPhase    onComplete={() => completePhase('wonder','story')} audioEnabled={state.audioEnabled} />}
        {state.phase === 'story'    && <StoryPhase     onComplete={() => completePhase('story','simulate')} audioEnabled={state.audioEnabled} />}
        {state.phase === 'simulate' && <SimulatePhase  onComplete={() => completePhase('simulate','play')} audioEnabled={state.audioEnabled} simStationsComplete={state.simStationsComplete} dispatch={dispatch} />}
        {state.phase === 'play'     && <PlayPhase      questions={getQuestions()} dispatch={dispatch} state={state} onComplete={() => completePhase('play','reflect')} audioEnabled={state.audioEnabled} />}
        {state.phase === 'reflect'  && <ReflectPhase   state={state} onReset={handleReset}              audioEnabled={state.audioEnabled} />}
      </div>

      {/* Bottom HUD */}
      {showHud && (
        <footer className="bottom-hud">
          <div className="hud-stat"><span>⭐</span><span className="value">{state.xp} XP</span></div>
          <div className="hud-stat"><span>🔥</span><span className="value">{state.streak}</span></div>
          <div className="hud-stat"><span>🌍</span><span className="value">World {state.currentWorld + 1}/10</span></div>
          <button className="hud-btn secondary" onClick={() => go('simulate')}>← Simulate</button>
        </footer>
      )}
    </div>
  );
}
