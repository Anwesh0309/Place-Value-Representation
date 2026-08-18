import { useEffect } from 'react';
import { stopNarration } from '../utils/audio.js';

const PHASES = [
  { emoji: '🔮', name: 'Wonder', desc: 'Spark your curiosity' },
  { emoji: '📖', name: 'Story', desc: 'Hear the tale' },
  { emoji: '🧪', name: 'Simulate', desc: 'Explore & discover' },
  { emoji: '🎮', name: 'Practice', desc: 'Test your skills' },
  { emoji: '📓', name: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart }) {
  useEffect(() => {
    stopNarration();
    return () => stopNarration();
  }, []);

  return (
    <div className="intro-screen" style={{ animation: 'slideUp 0.5s ease' }}>
      {/* Badge */}
      <div className="chip" style={{ fontSize: '0.85rem', padding: '6px 16px', fontWeight: 900 }}>
        ✨ MOE Curriculum · Grade 2
      </div>

      {/* Mascot + Title */}
      <div className="intro-hero" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="mascot-avatar" style={{ width: 76, height: 76, fontSize: '2.6rem' }}>🐻</div>
        <div style={{ position: 'relative' }}>
          <div className="mascot-bubble" style={{ borderBottomLeftRadius: 'var(--r-lg)', borderBottomRightRadius: 4, fontSize: '1.1rem', fontWeight: 900, padding: '12px 20px' }}>
            Ready for a counting adventure? 🎉
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 className="intro-title" style={{ fontSize: 'clamp(2.6rem, 6vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1 }}>
          Numbers to <span className="accent">1000</span>
        </h1>
        <div className="intro-subtitle" style={{ marginTop: 6, fontSize: '1.25rem', fontWeight: 900, letterSpacing: '2.5px' }}>
          Place Value Representation
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc" style={{ fontSize: '1.2rem', fontWeight: 800, maxWidth: 540, lineHeight: 1.6, color: '#ffffff' }}>
        Join Emma on a journey to explore hundreds, tens, and ones through stories, simulations, and practice challenges!
      </p>

      {/* Journey Card */}
      <div className="journey-card" style={{ padding: '16px 20px', maxWidth: 640 }}>
        <div className="journey-card-title" style={{ fontSize: '0.9rem', letterSpacing: '2.5px', marginBottom: 12 }}>
          Your Learning Journey
        </div>
        <div className="journey-steps">
          {PHASES.map((p, i) => (
            <div key={p.name} className="j-step">
              <div className="j-step-icon" style={{ width: 44, height: 44, fontSize: '1.2rem' }}>{p.emoji}</div>
              <div className="j-step-text">
                <div className="j-step-name" style={{ fontSize: '1rem', fontWeight: 900 }}>{p.name}</div>
                <div className="j-step-desc" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>{p.desc}</div>
              </div>
              {i < PHASES.length - 1 && <div className="j-arrow" style={{ fontSize: '1.2rem' }}>›</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className="btn btn-yellow btn-lg"
        onClick={onStart}
        style={{ width: '100%', maxWidth: 400, fontSize: '1.35rem', fontWeight: 900, padding: '16px 36px', boxShadow: '0 8px 30px rgba(245,197,24,0.45)' }}
      >
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-row" style={{ maxWidth: 640 }}>
        <div className="feature-card" style={{ padding: '14px 12px' }}>
          <span className="feature-card-icon" style={{ fontSize: '2rem' }}>🔢</span>
          <div className="feature-card-name" style={{ fontSize: '1rem', fontWeight: 900 }}>Place Value</div>
          <div className="feature-card-desc" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>H, T, O blocks</div>
        </div>
        <div className="feature-card" style={{ padding: '14px 12px' }}>
          <span className="feature-card-icon" style={{ fontSize: '2rem' }}>🧩</span>
          <div className="feature-card-name" style={{ fontSize: '1rem', fontWeight: 900 }}>Simulations</div>
          <div className="feature-card-desc" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>3 interactive stations</div>
        </div>
        <div className="feature-card" style={{ padding: '14px 12px' }}>
          <span className="feature-card-icon" style={{ fontSize: '2rem' }}>🏆</span>
          <div className="feature-card-name" style={{ fontSize: '1rem', fontWeight: 900 }}>10 Worlds</div>
          <div className="feature-card-desc" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>100 questions &amp; XP</div>
        </div>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 2, fontWeight: 700 }}>
        Intellia SG · Primary Math · Singapore MOE Curriculum
      </div>
    </div>
  );
}
