import { useState, useEffect } from 'react';
import { narrate, stopNarration } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    stopNarration();
    if (audioEnabled && stage === 0) {
      const t = setTimeout(() => narrate(wonderNarration()), 350);
      return () => { clearTimeout(t); stopNarration(); };
    }
    return () => stopNarration();
  }, [stage, audioEnabled]);

  const marbles = Array.from({ length: 18 }, (_, i) => (['h','h','h','t','t','o'])[i % 6]);

  return (
    <div
      className="wonder-phase"
      style={{
        minHeight: 'calc(100vh - 65px)',
        maxHeight: 'calc(100vh - 65px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 20px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* 1. Top Purple Question Orb */}
      <div
        style={{
          width: 86,
          height: 86,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
          boxShadow: '0 0 30px rgba(124, 58, 237, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          color: '#ffffff',
          fontWeight: 900,
          zIndex: 2,
          marginBottom: -12,
        }}
      >
        ?
      </div>

      {/* 2. Bear Mascot Avatar */}
      <div
        className={`mascot-avatar ${stage === 1 ? 'celebrating' : 'thinking'}`}
        style={{
          width: 64,
          height: 64,
          fontSize: '2.3rem',
          boxShadow: '0 0 22px rgba(245, 158, 11, 0.7)',
          border: '3px solid #fbbf24',
          zIndex: 3,
          marginBottom: 6,
        }}
      >
        🐻
      </div>

      {/* 3. Mascot Speech Bubble */}
      <div
        className="mascot-bubble"
        style={{
          fontSize: '0.98rem',
          fontWeight: 900,
          padding: '8px 18px',
          borderRadius: 999,
          background: '#ffffff',
          color: '#0d0620',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          marginBottom: 14,
          zIndex: 3,
        }}
      >
        {stage === 0 ? 'Hmm… I wonder… 🧐' : 'Watch the magic! ✨'}
      </div>

      {/* 4. Central Rounded Glass Card */}
      <div
        className="wonder-tap-card"
        onClick={() => stage === 0 && setStage(1)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && stage === 0 && setStage(1)}
        aria-label="Tap to group marbles"
        style={{
          background: 'rgba(30, 16, 75, 0.82)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 255, 255, 0.16)',
          borderRadius: 26,
          padding: '24px 28px',
          maxWidth: 580,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 16px 44px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          cursor: stage === 0 ? 'pointer' : 'default',
        }}
      >
        {/* Top Emoji */}
        <div style={{ fontSize: '2.4rem', marginBottom: 2 }}>🔮</div>

        {/* Main Question Text */}
        <h2
          style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.3,
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}
        >
          If you had 347 marbles, how would you count them all without getting lost?
        </h2>

        {stage === 0 ? (
          <>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', margin: '4px 0 10px', fontWeight: 800, fontStyle: 'italic' }}>
              Your fingers &amp; groups are the best counting tools ever! Tap to see what happens! 👇
            </p>
            <div className="marble-grid" style={{ justifyContent: 'center' }}>
              {marbles.map((c, i) => (
                <div
                  key={i}
                  className={`marble ${c}`}
                  style={{ animation: `popIn 0.4s ease ${i * 0.04}s both`, width: 22, height: 22 }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.95)', margin: '4px 0 12px', fontWeight: 900 }}>
              The marbles group into hundreds, tens, and ones! ✨
            </p>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                      width: 58, height: 58, fontSize: '1.7rem', fontWeight: 900
                    }}
                  >
                    {g.count}
                  </div>
                  <div className="group-label" style={{ fontSize: '0.85rem', fontWeight: 900 }}>{g.label}</div>
                  <div className="group-value" style={{ color: g.shadow, fontSize: '1.05rem', fontWeight: 900 }}>= {g.val}</div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 10, textAlign: 'center',
              fontFamily: 'var(--font)', fontSize: '1.8rem', fontWeight: 900, color: '#fff',
              letterSpacing: 3,
            }}>
              300 + 40 + 7 = <span style={{ color: 'var(--yellow)' }}>347</span>
            </div>
          </>
        )}
      </div>

      {/* 5. Violet / Purple CTA Button */}
      <button
        className="btn-lg"
        onClick={onComplete}
        style={{
          marginTop: 18,
          padding: '13px 40px',
          borderRadius: 999,
          border: 'none',
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          color: '#ffffff',
          fontFamily: 'var(--font)',
          fontSize: '1.25rem',
          fontWeight: 900,
          cursor: 'pointer',
          boxShadow: '0 8px 28px rgba(139, 92, 246, 0.5)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        ✨ Let's Discover! ✨
      </button>
    </div>
  );
}
