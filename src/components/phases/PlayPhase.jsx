import { useState, useEffect, useRef } from 'react';
import { WORLDS } from '../../data/questionBank.js';
import QuestionRenderer from '../quiz/QuestionRenderer.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { calcXP, calcStars, starsDisplay } from '../../utils/scoring.js';
import {
  correctNarration,
  incorrectNarration,
  worldCompleteNarration,
  streakNarration,
  hintIntroNarration,
  explanationIntroNarration,
} from '../../utils/narration.js';

/* ── World Complete Screen — own component so hooks are valid ── */
function WorldCompleteScreen({ w, score, currentWorld, audioEnabled, onRetry, onNext, onComplete }) {
  const stars = calcStars(score);

  useEffect(() => {
    if (audioEnabled) {
      const t = setTimeout(() => narrate(worldCompleteNarration(stars)), 400);
      return () => { clearTimeout(t); stopNarration(); };
    }
  }, []); // eslint-disable-line

  return (
    <div className="play-phase">
      <div className="card world-complete-card">
        <span className="wc-emoji">{w.emoji}</span>
        <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.6rem', fontWeight: 900, marginBottom: 8 }}>
          {w.name} Complete!
        </h2>
        <div className="wc-stars">{starsDisplay(stars)}</div>
        <div style={{ fontFamily: 'var(--font)', fontSize: '1.15rem', fontWeight: 800, marginBottom: 8 }}>
          Score: <span style={{ color: 'var(--yellow)' }}>{score}/10</span>
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 20,
          color: stars > 0 ? 'var(--green-light)' : 'var(--red-light)' }}>
          {stars === 3 ? '🏆 Perfect!' : stars === 2 ? '🎉 Great job!' : stars === 1 ? '👍 Good effort!' : '⚠️ Need 5/10 to unlock next world.'}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {stars === 0 ? (
            <button className="btn btn-yellow" onClick={onRetry}>Retry World 🔄</button>
          ) : currentWorld < 9 ? (
            <button className="btn btn-yellow" onClick={onNext}>
              Next World {WORLDS[currentWorld + 1]?.emoji} →
            </button>
          ) : (
            <button className="btn btn-yellow" onClick={onComplete}>🏆 Complete Challenge!</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Play Phase ── */
export default function PlayPhase({ questions, dispatch, state, onComplete, audioEnabled }) {
  const { currentQuestion, currentWorld, worldScores, xp, streak } = state;

  const [fb, setFb]               = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts]   = useState(0);
  const [showHint, setShowHint]   = useState(false);
  const [worldDone, setWorldDone] = useState(false);
  const [worldScore, setWorldScore] = useState(0);
  const [streakPop, setStreakPop] = useState(false);

  const fbTimer    = useRef(null);
  const prevStreak = useRef(streak);
  const audioRef   = useRef(audioEnabled);
  audioRef.current = audioEnabled;

  const startIdx = currentWorld * 10;
  const localIdx = currentQuestion - startIdx;
  const q = questions[currentQuestion];

  // ── Narrate question on change ──────────────────────────────────────────
  useEffect(() => {
    setFb(null); setHintsUsed(0); setAttempts(0); setShowHint(false);
    if (audioRef.current && q) {
      const t = setTimeout(() => narrate([{ text: q.questionText, style: 'question' }]), 200);
      return () => { clearTimeout(t); stopNarration(); };
    }
    return () => stopNarration();
  }, [currentQuestion]); // eslint-disable-line

  // ── Streak milestone ────────────────────────────────────────────────────
  useEffect(() => {
    if (streak > prevStreak.current && streak >= 5 && streak % 5 === 0) {
      setStreakPop(true);
      setTimeout(() => setStreakPop(false), 2600);
      if (audioRef.current) setTimeout(() => narrate(streakNarration(streak)), 300);
    }
    prevStreak.current = streak;
  }, [streak]);

  if (!q) return null;

  // ── Answer handler ──────────────────────────────────────────────────────
  const handleAnswer = (ans) => {
    if (fb) return;
    clearTimeout(fbTimer.current);
    const newAtt = attempts + 1;
    setAttempts(newAtt);
    const isCorrect = String(ans).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      dispatch({ type: 'ANSWER_CORRECT', payload: { xp: calcXP(newAtt, hintsUsed, streak + 1) } });
      setFb({ correct: true, explanation: q.explanation });
      if (audioRef.current) {
        narrate([
          ...correctNarration(),
          ...(q.explanation ? explanationIntroNarration() : []),
        ]);
      }
      fbTimer.current = setTimeout(() => advance(true), 1800);

    } else if (newAtt >= 2) {
      dispatch({ type: 'ANSWER_INCORRECT' });
      setFb({ correct: false, correctAnswer: q.correctAnswer, explanation: q.explanation });
      if (audioRef.current) {
        narrate([
          ...incorrectNarration(),
          ...(q.explanation ? explanationIntroNarration() : []),
        ]);
      }
      fbTimer.current = setTimeout(() => advance(false), 2400);

    } else {
      dispatch({ type: 'ANSWER_INCORRECT' });
      setFb({ correct: false, firstTry: true });
      if (audioRef.current) narrate(incorrectNarration());
      fbTimer.current = setTimeout(() => setFb(null), 1400);
    }
  };

  // ── Hint click ──────────────────────────────────────────────────────────
  const handleHintClick = () => {
    const wasShowing = showHint;
    const newCount = wasShowing ? hintsUsed : hintsUsed + 1;
    if (!wasShowing) setHintsUsed(newCount);
    setShowHint(v => !v);

    if (!wasShowing && audioRef.current) {
      const hintText = newCount <= 1 ? q.hint1 : q.hint2;
      // Play hint intro (pre-generated) then hint text (may use dynamic fallback)
      narrate([
        ...hintIntroNarration(newCount),
        { text: hintText, style: 'instruction' },
      ]);
    } else if (wasShowing) {
      stopNarration();
    }
  };

  // ── Advance ─────────────────────────────────────────────────────────────
  const advance = (wasCorrect) => {
    clearTimeout(fbTimer.current);
    const newScore = worldScore + (wasCorrect ? 1 : 0);
    setWorldScore(newScore);
    setFb(null);
    stopNarration();

    if (localIdx === 9) {
      dispatch({ type: 'COMPLETE_WORLD', payload: { world: currentWorld, score: newScore } });
      setWorldDone(true);
      setWorldScore(0);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const w     = WORLDS[currentWorld];
  const score = worldScores[currentWorld] ?? 0;

  // ── World complete screen ───────────────────────────────────────────────
  if (worldDone) {
    return (
      <WorldCompleteScreen
        w={w}
        score={score}
        currentWorld={currentWorld}
        audioEnabled={audioRef.current}
        onRetry={() => { stopNarration(); setWorldDone(false); dispatch({ type: 'RETRY_WORLD' }); setWorldScore(0); }}
        onNext={() => { stopNarration(); setWorldDone(false); dispatch({ type: 'ADVANCE_WORLD' }); }}
        onComplete={() => { stopNarration(); onComplete(); }}
      />
    );
  }

  // ── Question screen ─────────────────────────────────────────────────────
  return (
    <div className="play-phase">
      {streakPop && (
        <div className="streak-popup">🔥 {streak} Streak! +5 XP!</div>
      )}

      {/* World badge + stats */}
      <div className="play-top-bar">
        <div className="play-world-badge">
          {w.emoji} World {currentWorld + 1}: {w.name}
        </div>
        <div className="play-stats">
          <span>Q <strong>{localIdx + 1}</strong>/10</span>
          <span style={{ color: 'var(--yellow)' }}>⭐ {xp}</span>
          <span style={{ color: '#fb923c' }}>🔥 {streak}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="prog-wrap" style={{ marginBottom: 14 }}>
        <div className="prog-fill" style={{ width: `${(localIdx / 10) * 100}%` }} />
      </div>

      {/* Question card */}
      <div
        className="card current-question-card"
        style={fb?.firstTry ? { animation: 'shake 0.4s ease' } : {}}
      >
        <div className="q-label">Question {currentQuestion + 1}</div>
        <QuestionRenderer question={q} onAnswer={handleAnswer} disabled={!!fb} />

        {/* Hint — only when no feedback */}
        {!fb && (
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={handleHintClick}>
              💡 {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <div className="hint-box">
                {hintsUsed <= 1 ? q.hint1 : q.hint2}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback popup */}
      {fb && !fb.firstTry && (
        <div className="fb-overlay" onClick={() => advance(fb.correct)}>
          <div
            className={`fb-card ${fb.correct ? 'correct' : 'wrong'}`}
            onClick={e => e.stopPropagation()}
          >
            <span className="fb-big-emoji">{fb.correct ? '🎉' : '😢'}</span>
            <div className="fb-title">{fb.correct ? 'Correct! 🎉' : 'Not quite!'}</div>
            <div className="fb-sub">
              {fb.correct
                ? q.explanation || `${q.correctAnswer} is right!`
                : `Correct answer: ${q.correctAnswer}.`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
