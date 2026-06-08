import { useState, useEffect } from 'react';
import Confetti from '../shared/Confetti.jsx';
import { WORLDS } from '../../data/questionBank.js';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars, starsDisplay } from '../../utils/scoring.js';
import { narrate, stopNarration } from '../../utils/audio.js';
import { reflectNarration } from '../../utils/narration.js';

const REVIEW_QS = [
  { q: 'In 536, which digit is in the hundreds place?', opts: ['5','3','6','53'], ans: '5' },
  { q: 'What is 700 + 20 + 4?',                         opts: ['724','742','274','7024'], ans: '724' },
  { q: '"Nine hundred and five" in numerals = ?',        opts: ['905','950','915','9005'], ans: '905' },
];

export default function ReflectPhase({ state, onReset, audioEnabled }) {
  const [step, setStep] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    let t;
    if (audioEnabled) t = setTimeout(() => narrate(reflectNarration()), 400);
    return () => { clearTimeout(t); stopNarration(); };
  }, [audioEnabled]);

  useEffect(() => { if (step === 2) setTimeout(() => setConfetti(true), 400); }, [step]);

  const answerQ = (ans) => {
    const ok = ans === REVIEW_QS[qIdx].ans;
    setAnswers(a => [...a, ok]);
    if (qIdx < REVIEW_QS.length - 1) setQIdx(i => i + 1);
    else setTimeout(() => setStep(1), 500);
  };

  const totalXP = state.xp;
  const totalCorrect = state.worldScores.reduce((s, w) => s + (w ?? 0), 0);
  const pct = Math.round((totalCorrect / 100) * 100);
  const earnedBadges = BADGES.filter(b => state.badges.includes(b.id));

  /* ── Step 0: Review quiz ── */
  if (step === 0) {
    const q = REVIEW_QS[qIdx];
    return (
      <div className="reflect-phase" style={{ animation: 'slideUp 0.4s ease' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="mascot-avatar thinking" style={{ width: 64, height: 64, fontSize: '2rem' }}>🐻</div>
          <div className="mascot-bubble">Teach me what you learned! 🤔</div>
        </div>
        <h2 className="title-md text-yellow text-center" style={{ marginBottom: 4 }}>Quick Review</h2>
        <p className="text-muted text-center" style={{ marginBottom: 16, fontWeight: 600, fontSize: '0.85rem' }}>
          {qIdx + 1} of {REVIEW_QS.length}
        </p>
        <div className="prog-wrap" style={{ marginBottom: 16 }}>
          <div className="prog-fill" style={{ width: `${(qIdx / REVIEW_QS.length) * 100}%` }} />
        </div>
        <div className="card" style={{ animation: 'slideUp 0.3s ease' }}>
          <p className="q-text">{q.q}</p>
          <div className="mcq-grid">
            {q.opts.map(opt => (
              <button key={opt} className="mcq-opt" onClick={() => answerQ(opt)} aria-label={opt}>{opt}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 1: Confidence ── */
  if (step === 1) {
    const correct = answers.filter(Boolean).length;
    return (
      <div className="reflect-phase" style={{ animation: 'slideUp 0.4s ease' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="mascot-avatar" style={{ width: 64, height: 64, fontSize: '2rem' }}>🐻</div>
          <div className="mascot-bubble">{correct}/3 correct! 🎉</div>
        </div>
        <h2 className="title-md text-yellow text-center" style={{ marginBottom: 4 }}>How confident do you feel?</h2>
        <p className="text-muted text-center" style={{ marginBottom: 20, fontWeight: 600, fontSize: '0.85rem' }}>
          About place value and numbers to 1000
        </p>
        <div className="confidence-row">
          {[
            { emoji: '😊', label: 'Very confident!', v: 3 },
            { emoji: '🙂', label: 'Getting there!',  v: 2 },
            { emoji: '😐', label: 'Need practice',   v: 1 },
          ].map(c => (
            <button key={c.v} className="conf-btn" onClick={() => setStep(2)} aria-label={c.label}>
              <span className="conf-emoji">{c.emoji}</span>
              <span className="conf-label">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── Step 2: Certificate ── */
  return (
    <div className="reflect-phase" style={{ animation: 'slideUp 0.4s ease' }}>
      <Confetti active={confetti} count={80} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div className="mascot-avatar celebrating" style={{ width: 72, height: 72, fontSize: '2.4rem' }}>🐻</div>
        <div className="mascot-bubble">You are a Place Value Pro! 🌟</div>
      </div>

      <div className="certificate">
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Certificate of Completion
        </div>
        <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--yellow)', marginBottom: 4 }}>
          🌟 Numbers to 1000 🌟
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 16 }}>
          Place Value Representation · Singapore MOE Primary 2
        </p>

        <div className="cert-circle">
          <div className="cert-pct">{pct}%</div>
          <div className="cert-pct-lbl">Score</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { icon: '⭐', val: totalXP,        lbl: 'XP Earned' },
            { icon: '🔥', val: state.maxStreak, lbl: 'Best Streak' },
            { icon: '✅', val: totalCorrect,    lbl: 'Correct' },
          ].map(s => (
            <div key={s.lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: '1.3rem', fontWeight: 900, color: 'var(--yellow)' }}>
                {s.icon} {s.val}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* World grid */}
        <div className="world-grid">
          {WORLDS.map((w, i) => (
            <div key={w.id} className="wg-cell">
              <span className="wg-emoji">{w.emoji}</span>
              <span className="wg-stars">{starsDisplay(calcStars(state.worldScores[i] ?? 0))}</span>
              <span className="wg-score">{state.worldScores[i] ?? 0}/10</span>
            </div>
          ))}
        </div>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, marginTop: 4 }}>
              Badges Earned
            </div>
            <div className="badge-list">
              {earnedBadges.map(b => (
                <div key={b.id} className="badge-pill">
                  <span>{b.label.split(' ')[0]}</span>
                  <span>{b.label.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
          <button className="btn btn-yellow" onClick={onReset}>🎮 Play Again</button>
          <button className="btn btn-outline" onClick={() => window.open('https://intelliasg.com/courses/grade-2-math/', '_blank')}>
            🏠 Course Home
          </button>
        </div>
      </div>
    </div>
  );
}
