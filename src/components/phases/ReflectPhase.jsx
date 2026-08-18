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
    stopNarration();
    if (!audioEnabled) return () => stopNarration();

    let textSegments = [];
    if (step === 0) {
      if (qIdx === 0) textSegments = reflectQ1Narration();
      else if (qIdx === 1) textSegments = reflectQ2Narration();
      else if (qIdx === 2) textSegments = reflectQ3Narration();
    } else if (step === 1) {
      textSegments = [{ text: "How confident do you feel about numbers to 1000?", style: 'question' }];
    } else if (step === 2) {
      textSegments = completionNarration();
    }

    if (textSegments.length > 0) {
      const t = setTimeout(() => narrate(textSegments), 350);
      return () => { clearTimeout(t); stopNarration(); };
    }
    return () => stopNarration();
  }, [step, qIdx, audioEnabled]);

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
      <div className="reflect-phase" style={{ animation: 'slideUp 0.4s ease', minHeight: 'calc(100vh - 65px)', maxHeight: 'calc(100vh - 65px)', padding: '16px 20px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div className="mascot-avatar thinking" style={{ width: 72, height: 72, fontSize: '2.4rem' }}>🐻</div>
          <div className="mascot-bubble" style={{ fontSize: '1.15rem', fontWeight: 900, padding: '10px 18px' }}>Teach me what you learned! 🤔</div>
        </div>
        <h2 className="title-md text-yellow text-center" style={{ marginBottom: 4, fontSize: '1.8rem', fontWeight: 900 }}>Quick Review</h2>
        <p className="text-muted text-center" style={{ marginBottom: 14, fontWeight: 900, fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)' }}>
          Question {qIdx + 1} of {REVIEW_QS.length}
        </p>
        <div className="prog-wrap" style={{ marginBottom: 16, maxWidth: 500, margin: '0 auto 16px' }}>
          <div className="prog-fill" style={{ width: `${(qIdx / REVIEW_QS.length) * 100}%` }} />
        </div>
        <div className="card" style={{ animation: 'slideUp 0.3s ease', maxWidth: 540, margin: '0 auto', padding: '20px 24px' }}>
          <p className="q-text" style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 16 }}>{q.q}</p>
          <div className="mcq-grid">
            {q.opts.map(opt => (
              <button key={opt} className="mcq-opt" onClick={() => answerQ(opt)} aria-label={opt} style={{ fontSize: '1.25rem', fontWeight: 900, padding: '12px 18px' }}>
                {opt}
              </button>
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
      <div className="reflect-phase" style={{ animation: 'slideUp 0.4s ease', minHeight: 'calc(100vh - 65px)', maxHeight: 'calc(100vh - 65px)', padding: '16px 20px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="mascot-avatar" style={{ width: 72, height: 72, fontSize: '2.4rem' }}>🐻</div>
          <div className="mascot-bubble" style={{ fontSize: '1.2rem', fontWeight: 900, padding: '10px 20px' }}>{correct}/3 correct! 🎉</div>
        </div>
        <h2 className="title-md text-yellow text-center" style={{ marginBottom: 6, fontSize: '1.8rem', fontWeight: 900 }}>How confident do you feel?</h2>
        <p className="text-muted text-center" style={{ marginBottom: 20, fontWeight: 900, fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)' }}>
          About place value and numbers to 1000
        </p>
        <div className="confidence-row" style={{ gap: 16 }}>
          {[
            { emoji: '😊', label: 'Very confident!', v: 3 },
            { emoji: '🙂', label: 'Getting there!',  v: 2 },
            { emoji: '😐', label: 'Need practice',   v: 1 },
          ].map(c => (
            <button key={c.v} className="conf-btn" onClick={() => setStep(2)} aria-label={c.label} style={{ padding: '16px 24px' }}>
              <span className="conf-emoji" style={{ fontSize: '2.4rem' }}>{c.emoji}</span>
              <span className="conf-label" style={{ fontSize: '1.05rem', fontWeight: 900 }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── Step 2: Certificate ── */
  return (
    <div className="reflect-phase" style={{ animation: 'slideUp 0.4s ease', minHeight: 'calc(100vh - 65px)', maxHeight: 'calc(100vh - 65px)', padding: '10px 20px', justifyContent: 'center' }}>
      <Confetti active={confetti} count={80} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div className="mascot-avatar celebrating" style={{ width: 68, height: 68, fontSize: '2.2rem' }}>🐻</div>
        <div className="mascot-bubble" style={{ fontSize: '1.1rem', fontWeight: 900, padding: '8px 18px' }}>You are a Place Value Pro! 🌟</div>
      </div>

      <div className="certificate" style={{ padding: '18px 24px', maxWidth: 660, width: '100%', margin: '0 auto' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
          Certificate of Completion
        </div>
        <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--yellow)', marginBottom: 4 }}>
          🌟 Numbers to 1000 🌟
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', fontWeight: 800, marginBottom: 14 }}>
          Place Value Representation · Primary Math
        </p>

        <div className="cert-circle" style={{ width: 80, height: 80, margin: '0 auto 12px' }}>
          <div className="cert-pct" style={{ fontSize: '1.5rem', fontWeight: 900 }}>{pct}%</div>
          <div className="cert-pct-lbl" style={{ fontSize: '0.65rem', fontWeight: 800 }}>Score</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
          {[
            { icon: '⭐', val: totalXP,        lbl: 'XP Earned' },
            { icon: '🔥', val: state.maxStreak, lbl: 'Best Streak' },
            { icon: '✅', val: totalCorrect,    lbl: 'Correct' },
          ].map(s => (
            <div key={s.lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--yellow)' }}>
                {s.icon} {s.val}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* World grid */}
        <div className="world-grid" style={{ marginBottom: 12 }}>
          {WORLDS.map((w, i) => (
            <div key={w.id} className="wg-cell" style={{ padding: '4px 6px' }}>
              <span className="wg-emoji" style={{ fontSize: '1rem' }}>{w.emoji}</span>
              <span className="wg-stars">{starsDisplay(calcStars(state.worldScores[i] ?? 0))}</span>
              <span className="wg-score" style={{ fontWeight: 900, fontSize: '0.8rem' }}>{state.worldScores[i] ?? 0}/10</span>
            </div>
          ))}
        </div>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'rgba(255,255,255,0.6)', marginBottom: 6, marginTop: 2 }}>
              Badges Earned
            </div>
            <div className="badge-list" style={{ marginBottom: 12 }}>
              {earnedBadges.map(b => (
                <div key={b.id} className="badge-pill" style={{ fontSize: '0.85rem', fontWeight: 900, padding: '4px 10px' }}>
                  <span>{b.label.split(' ')[0]}</span>
                  <span>{b.label.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
          <button className="btn btn-yellow" onClick={onReset} style={{ fontSize: '1.1rem', fontWeight: 900, padding: '12px 24px' }}>🎮 Practice Again</button>
          <button className="btn btn-outline" onClick={() => window.open('https://intelliasg.com/courses/grade-2-math/', '_blank')} style={{ fontSize: '1rem', fontWeight: 900, padding: '12px 20px' }}>
            🏠 Course Home
          </button>
        </div>
      </div>
    </div>
  );
}
