import { useEffect } from 'react';
import { narrate, stopNarration } from '../utils/audio.js';
import { introNarration } from '../utils/narration.js';

const PHASES = [
  { emoji: '🔮', name: 'Wonder',   desc: 'Spark your curiosity' },
  { emoji: '📖', name: 'Story',    desc: 'Hear the tale' },
  { emoji: '🧪', name: 'Simulate', desc: 'Explore & discover' },
  { emoji: '🎮', name: 'Play',     desc: 'Test your skills' },
  { emoji: '📓', name: 'Reflect',  desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled }) {
  useEffect(() => {
    let t;
    if (audioEnabled) t = setTimeout(() => narrate(introNarration()), 400);
    return () => { clearTimeout(t); stopNarration(); };
  }, [audioEnabled]);

  return (
    <div className="intro-screen" style={{ animation: 'slideUp 0.5s ease' }}>
      {/* Badge */}
      <div className="chip">✨ Singapore MOE Curriculum · Grade 2</div>

      {/* Mascot + Title */}
      <div className="intro-hero">
        <div className="mascot-avatar" style={{ width: 72, height: 72, fontSize: '2.4rem' }}>🐻</div>
        <div style={{ position: 'relative' }}>
          <div className="mascot-bubble" style={{ borderBottomLeftRadius: 'var(--r-lg)', borderBottomRightRadius: 4 }}>
            Ready for a counting adventure? 🎉
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="intro-title">
          Numbers to <span className="accent">1000</span>
        </h1>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Place Value Representation
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Join Mei Ling on a journey to explore hundreds, tens, and ones through stories, simulations, and fun games!
      </p>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">Your Learning Journey</div>
        <div className="journey-steps">
          {PHASES.map((p, i) => (
            <div key={p.name} className="j-step">
              <div className="j-step-icon">{p.emoji}</div>
              <div className="j-step-text">
                <div className="j-step-name">{p.name}</div>
                <div className="j-step-desc">{p.desc}</div>
              </div>
              {i < PHASES.length - 1 && <div className="j-arrow">›</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className="btn btn-yellow btn-lg"
        onClick={onStart}
        style={{ width: '100%', maxWidth: 360, fontSize: '1.1rem' }}
      >
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-row">
        <div className="feature-card">
          <span className="feature-card-icon">🔢</span>
          <div className="feature-card-name">Place Value</div>
          <div className="feature-card-desc">H, T, O blocks</div>
        </div>
        <div className="feature-card">
          <span className="feature-card-icon">🧩</span>
          <div className="feature-card-name">Simulations</div>
          <div className="feature-card-desc">3 interactive stations</div>
        </div>
        <div className="feature-card">
          <span className="feature-card-icon">🏆</span>
          <div className="feature-card-name">10 Worlds</div>
          <div className="feature-card-desc">100 questions &amp; XP</div>
        </div>
      </div>

      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 4 }}>
        Intellia SG · Grade 2 Math · Singapore MOE Primary 2
      </div>
    </div>
  );
}
