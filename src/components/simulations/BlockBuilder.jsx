import { useState, useEffect } from 'react';
import { numberToWords } from '../../utils/numberWords.js';
import { narrateNow, stopNarration } from '../../utils/audio.js';
import { speakNumber } from '../../utils/narration.js';

const PROBLEMS = [247, 136, 509, 382, 715];

export default function BlockBuilder({ onComplete, audioEnabled }) {
  const [probIdx, setProbIdx] = useState(0);
  const [h, setH] = useState(0);
  const [t, setT] = useState(0);
  const [o, setO] = useState(0);
  const [fb, setFb] = useState(null);
  const [solved, setSolved] = useState(0);

  const target = PROBLEMS[probIdx];
  const tH = Math.floor(target / 100);
  const tT = Math.floor((target % 100) / 10);
  const tO = target % 10;
  const current = h * 100 + t * 10 + o;

  // Narrate the target number when problem changes
  useEffect(() => {
    if (audioEnabled) {
      const t2 = setTimeout(() => narrateNow(speakNumber(target)), 200);
      return () => clearTimeout(t2);
    }
  }, [probIdx, audioEnabled]); // eslint-disable-line

  const changeH = (delta) => {
    const nv = Math.max(0, Math.min(9, h + delta));
    setH(nv); setFb(null);
    if (audioEnabled) narrateNow(speakNumber(nv));
  };
  const changeT = (delta) => {
    const nv = Math.max(0, Math.min(9, t + delta));
    setT(nv); setFb(null);
    if (audioEnabled) narrateNow(speakNumber(nv));
  };
  const changeO = (delta) => {
    const nv = Math.max(0, Math.min(9, o + delta));
    setO(nv); setFb(null);
    if (audioEnabled) narrateNow(speakNumber(nv));
  };

  const check = () => {
    if (current === target) {
      setFb('correct');
      setSolved(s => s + 1);
      setTimeout(() => {
        if (probIdx < PROBLEMS.length - 1) {
          setProbIdx(i => i + 1);
          setH(0); setT(0); setO(0); setFb(null);
        } else { onComplete(); }
      }, 1100);
    } else {
      setFb('wrong');
      setTimeout(() => setFb(null), 1200);
    }
  };

  const zones = [
    { label: 'Hundreds', count: h, change: changeH, need: tH, cls: 'hz' },
    { label: 'Tens',     count: t, change: changeT, need: tT, cls: 'tz' },
    { label: 'Ones',     count: o, change: changeO, need: tO, cls: 'oz' },
  ];

  return (
    <div className="block-builder">
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
        <span>Problem {probIdx + 1} / {PROBLEMS.length}</span>
        <span style={{ color: 'var(--green-light)' }}>✅ {solved} correct</span>
      </div>
      <div className="prog-wrap">
        <div className="prog-fill" style={{ width: `${(probIdx / PROBLEMS.length) * 100}%` }} />
      </div>

      <div className="target-display">
        <div className="target-label">Build this number</div>
        <div className="target-num">{target}</div>
        <div className="target-word">{numberToWords(target)}</div>
      </div>

      <div className="block-zones">
        {zones.map(z => (
          <div key={z.label} className={`block-zone ${z.cls}`}>
            <div className="bz-label">{z.label}</div>
            <div className="bz-count" style={{ color: current === target && z.count === z.need ? 'var(--green-light)' : '#fff' }}>
              {z.count}
            </div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>need {z.need}</div>
            <div className="bz-controls">
              <button
                className="bz-btn minus"
                onClick={() => z.change(-1)}
                disabled={z.count === 0}
                aria-label={`Remove ${z.label}`}
              >−</button>
              <button
                className="bz-btn plus"
                onClick={() => z.change(1)}
                disabled={z.count === 9}
                aria-label={`Add ${z.label}`}
              >+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="live-readout">
        {h}H + {t}T + {o}O = <span className={`big-num ${current === target ? 'match' : ''}`}>{current}</span>
        {current === target && <span style={{ color: 'var(--green-light)', marginLeft: 10, fontSize: '0.9rem' }}>✓ Match!</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          className={`btn ${fb === 'correct' ? 'btn-green' : fb === 'wrong' ? 'btn-outline' : 'btn-yellow'}`}
          onClick={check}
          style={fb === 'wrong' ? { animation: 'shake 0.4s ease' } : fb === 'correct' ? { animation: 'bounceIn 0.4s ease' } : {}}
        >
          {fb === 'correct' ? '✓ Correct! 🎉' : fb === 'wrong' ? 'Not quite — try again!' : 'Check Answer ✓'}
        </button>
      </div>
    </div>
  );
}
