import { useState, useEffect } from 'react';
import { numberToWords } from '../../utils/numberWords.js';
import { narrateNow } from '../../utils/audio.js';
import { speakNumber } from '../../utils/narration.js';

const PROBLEMS = [
  { mode: 'fill', number: 456 },
  { mode: 'fill', number: 302 },
  { mode: 'read', chart: { h: 7, t: 1, o: 8 } },
  { mode: 'fill', number: 640 },
  { mode: 'read', chart: { h: 5, t: 0, o: 9 } },
];

export default function PlaceValueChartStation({ onComplete, audioEnabled }) {
  const [idx, setIdx] = useState(0);
  const [cH, setH] = useState(null);
  const [cT, setT] = useState(null);
  const [cO, setO] = useState(null);
  const [typeAns, setTypeAns] = useState('');
  const [fb, setFb] = useState(null);
  const [solved, setSolved] = useState(0);

  const p = PROBLEMS[idx];

  useEffect(() => { setH(null); setT(null); setO(null); setTypeAns(''); setFb(null); }, [idx]);

  // Speak target number when problem changes
  useEffect(() => {
    if (audioEnabled && p.mode === 'fill') {
      const t2 = setTimeout(() => narrateNow(speakNumber(p.number)), 200);
      return () => clearTimeout(t2);
    }
  }, [idx, audioEnabled]); // eslint-disable-line

  const derived = (cH ?? 0) * 100 + (cT ?? 0) * 10 + (cO ?? 0);

  const spin = (setter, val, d, col) => {
    const nv = Math.max(0, Math.min(9, (val ?? 0) + d));
    setter(nv);
    setFb(null);
    // Speak the digit value, not just the raw digit
    if (audioEnabled) {
      const place = col === 'H' ? nv * 100 : col === 'T' ? nv * 10 : nv;
      narrateNow(speakNumber(place));
    }
  };

  const check = () => {
    const ok = p.mode === 'fill'
      ? derived === p.number && cH !== null && cT !== null && cO !== null
      : parseInt(typeAns, 10) === (p.chart.h * 100 + p.chart.t * 10 + p.chart.o);
    if (ok) {
      setFb('correct'); setSolved(s => s + 1);
      setTimeout(() => { if (idx < PROBLEMS.length - 1) setIdx(i => i + 1); else onComplete(); }, 1100);
    } else {
      setFb('wrong'); setTimeout(() => setFb(null), 1200);
    }
  };

  const cells = [
    { lbl: 'H', cls: 'h', val: cH, setter: setH },
    { lbl: 'T', cls: 't', val: cT, setter: setT },
    { lbl: 'O', cls: 'o', val: cO, setter: setO },
  ];

  return (
    <div className="pvc-station">
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
        <span>Problem {idx + 1} / {PROBLEMS.length}</span>
        <span style={{ color: 'var(--green-light)' }}>✅ {solved} correct</span>
      </div>
      <div className="prog-wrap" style={{ width: '100%' }}>
        <div className="prog-fill" style={{ width: `${(idx / PROBLEMS.length) * 100}%` }} />
      </div>

      {p.mode === 'fill' ? (
        <>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Fill the chart for:</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--yellow)' }}>{p.number}</div>
          </div>
          <div className="pvc-grid">
            {cells.map(c => (
              <div key={c.lbl} style={{ textAlign: 'center' }}>
                <div className={`pvc-head ${c.cls}`}>{c.lbl}</div>
                <div className="pvc-cell">
                  <div className="spinner-wrap">
                    <button className="spin-btn" onClick={() => spin(c.setter, c.val, 1, c.lbl)} aria-label={`Increase ${c.lbl}`}>▲</button>
                    <div className="spin-val">{c.val ?? '—'}</div>
                    <button className="spin-btn" onClick={() => spin(c.setter, c.val, -1, c.lbl)} disabled={!c.val} aria-label={`Decrease ${c.lbl}`}>▼</button>
                  </div>
                  {c.val === 0 && <div className="zero-note">No {c.lbl === 'T' ? 'tens' : 'ones'}!</div>}
                </div>
              </div>
            ))}
          </div>
          {cH !== null && cT !== null && cO !== null && (
            <div style={{ textAlign: 'center' }}>
              <div className="pvc-expanded">{derived} = {(cH ?? 0) * 100} + {(cT ?? 0) * 10} + {cO ?? 0}</div>
              <div className="pvc-word" style={{ marginTop: 4 }}>{numberToWords(derived)}</div>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
            Read the chart → type the number:
          </div>
          <div className="pvc-grid" style={{ pointerEvents: 'none' }}>
            {[{ lbl:'H',cls:'h',v:p.chart.h },{ lbl:'T',cls:'t',v:p.chart.t },{ lbl:'O',cls:'o',v:p.chart.o }].map(c => (
              <div key={c.lbl} style={{ textAlign: 'center' }}>
                <div className={`pvc-head ${c.cls}`}>{c.lbl}</div>
                <div className="pvc-cell">
                  <div className="spin-val">{c.v}</div>
                  {c.v === 0 && <div className="zero-note">Zero!</div>}
                </div>
              </div>
            ))}
          </div>
          <input
            className="ans-input"
            type="number"
            value={typeAns}
            onChange={e => { setTypeAns(e.target.value); setFb(null); }}
            placeholder="___"
            aria-label="Type the number"
          />
          {typeAns && <div className="pvc-word">{numberToWords(parseInt(typeAns,10)||0)}</div>}
        </>
      )}

      <button
        className={`btn ${fb==='correct'?'btn-green':fb==='wrong'?'btn-outline':'btn-yellow'}`}
        onClick={check}
        style={fb==='wrong'?{animation:'shake 0.4s ease'}:fb==='correct'?{animation:'bounceIn 0.4s ease'}:{}}
      >
        {fb==='correct'?'✓ Correct! 🎉':fb==='wrong'?'Not quite!':'Check ✓'}
      </button>
    </div>
  );
}
