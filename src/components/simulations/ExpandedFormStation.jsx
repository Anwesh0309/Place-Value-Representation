import { useState } from 'react';
import { numberToWords } from '../../utils/numberWords.js';
import { shuffleArray } from '../../utils/shuffle.js';

function makeProblems() {
  return [
    { type: 'exp_std',    label: 'Write in standard form:', q: '400 + 30 + 8 = ___', answer: 438, input: 'number' },
    { type: 'std_exp',    label: 'Write in expanded form:', q: '572 = ?',
      answer: '500 + 70 + 2',
      opts: shuffleArray(['500 + 70 + 2','500 + 7 + 2','50 + 70 + 2','500 + 70 + 20']) },
    { type: 'digit_val',  label: 'What is the value of the digit 6 in 634?', q: '634 → value of 6 = ?', answer: 600,
      opts: shuffleArray([600, 6, 60, 6000]) },
    { type: 'word_num',   label: 'Write in numerals:', q: '"Five hundred and nine"', answer: 509,
      opts: shuffleArray([509, 590, 519, 500]) },
    { type: 'num_word',   label: 'Write in words:', q: '820 = ?',
      answer: numberToWords(820),
      opts: shuffleArray([numberToWords(820), numberToWords(802), numberToWords(812), numberToWords(280)]) },
  ];
}

export default function ExpandedFormStation({ onComplete }) {
  const [problems] = useState(() => makeProblems());
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [fb, setFb] = useState(null);
  const [solved, setSolved] = useState(0);

  const p = problems[idx];

  const check = (ans) => {
    const ok = String(ans).trim() === String(p.answer).trim();
    if (ok) {
      setFb('correct'); setSolved(s => s + 1);
      setTimeout(() => { setInput(''); setFb(null); if (idx < problems.length-1) setIdx(i=>i+1); else onComplete(); }, 1100);
    } else {
      setFb('wrong'); setTimeout(() => setFb(null), 1200);
    }
  };

  return (
    <div className="expf-station">
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
        <span>Problem {idx + 1} / {problems.length}</span>
        <span style={{ color: 'var(--green-light)' }}>✅ {solved} correct</span>
      </div>
      <div className="prog-wrap" style={{ width: '100%' }}>
        <div className="prog-fill" style={{ width: `${(idx / problems.length) * 100}%` }} />
      </div>

      <div className="card" style={{ width: '100%', textAlign: 'center', animation: 'slideUp 0.3s ease' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {p.label}
        </div>
        <div style={{ fontFamily: 'var(--font)', fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
          {p.q}
        </div>

        {p.input === 'number' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div className="eq-row">
              <span className="eq-fixed">{p.q.replace('= ___','= ')}</span>
              <input
                className="eq-input"
                type="number"
                value={input}
                onChange={e => { setInput(e.target.value); setFb(null); }}
                onKeyDown={e => e.key === 'Enter' && input && check(parseInt(input,10))}
                placeholder="___"
                aria-label="Answer"
              />
            </div>
            <button className="btn btn-yellow btn-sm" onClick={() => check(parseInt(input,10))} disabled={!input}>
              Check ✓
            </button>
          </div>
        ) : (
          <div className="mcq-grid">
            {p.opts.map((opt, i) => (
              <button
                key={i}
                className={`mcq-opt ${fb && String(opt)===String(p.answer)?'correct':fb==='wrong'&&input===String(opt)?'wrong':''}`}
                onClick={() => { setInput(String(opt)); check(opt); }}
                disabled={!!fb}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
