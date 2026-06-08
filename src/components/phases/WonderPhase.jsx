import { useState, useEffect } from 'react';
import { narrate, stopNarration } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let t;
    if (audioEnabled) t = setTimeout(() => narrate(wonderNarration()), 400);
    return () => { clearTimeout(t); stopNarration(); };
  }, [audioEnabled]);

  const marbles = Array.from({ length: 18 }, (_, i) => (['h','h','h','t','t','o'])[i % 6]);

  return (
    <div className="wonder-phase">
      {/* Orb */}
      <div className="wonder-orb">🔮</div>

      {/* Question */}
      <p className="wonder-question">
        If you had 347 marbles, how would you count them all without getting lost? 🔮
      </p>

      {/* Mascot */}
      <div className="mascot-wrap">
        <div className="mascot-bubble">
          {stage === 0 ? 'Hmm… I wonder… 🤔' : 'Watch the magic! ✨'}
        </div>
        <div className={`mascot-avatar ${stage === 1 ? 'celebrating' : 'thinking'}`}
          style={{ width: 68, height: 68, fontSize: '2.2rem' }}>
          🐻
        </div>
      </div>

      {/* Interactive card */}
      <div
        className={`card card-purple wonder-tap-card`}
        onClick={() => stage === 0 && setStage(1)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && stage === 0 && setStage(1)}
        aria-label="Tap to group marbles"
        style={{ maxWidth: 480, width: '100%' }}
      >
        {stage === 0 ? (
          <>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', marginBottom: 12, textAlign: 'center', fontWeight: 800 }}>
              Tap to see what happens! 👇
            </p>
            <div className="marble-grid">
              {marbles.map((c, i) => (
                <div
                  key={i}
                  className={`marble ${c}`}
                  style={{ animation: `popIn 0.4s ease ${i * 0.04}s both` }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', marginBottom: 16, textAlign: 'center', fontWeight: 800 }}>
              The marbles group into hundreds, tens, and ones! ✨
            </p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { count: 3, label: 'Hundreds', val: 300, bg: '#1d4ed8', shadow: '#3b82f6' },
                { count: 4, label: 'Tens',     val: 40,  bg: '#16a34a', shadow: '#22c55e' },
                { count: 7, label: 'Ones',     val: 7,   bg: '#d4a800', shadow: '#f5c518' },
              ].map((g, i) => (
                <div key={g.label} className="group-pill">
                  <div
                    className="group-circle"
                    style={{
                      background: g.bg,
                      boxShadow: `0 0 16px ${g.shadow}66`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  >
                    {g.count}
                  </div>
                  <div className="group-label">{g.label}</div>
                  <div className="group-value" style={{ color: g.shadow }}>= {g.val}</div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 18, textAlign: 'center',
              fontFamily: 'var(--font)', fontSize: '1.8rem', fontWeight: 900, color: '#fff',
              letterSpacing: 4,
            }}>
              300 + 40 + 7 = <span style={{ color: 'var(--yellow)' }}>347</span>
            </div>
          </>
        )}
      </div>

      <button className="btn btn-yellow" onClick={onComplete} style={{ marginTop: 4 }}>
        ✨ Let's Discover!
      </button>
    </div>
  );
}
