import { useState } from 'react';

function HundredBlockSVG({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="hundred">
      {Array.from({length:10},(_,r)=>Array.from({length:10},(_,c)=>(
        <rect key={`${r}${c}`} x={c*10+1} y={r*10+1} width={8} height={8} fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.5" rx="1"/>
      )))}
    </svg>
  );
}
function TenBlockSVG({ size = 40 }) {
  return (
    <svg width={size/8} height={size} viewBox="0 0 14 100" role="img" aria-label="ten">
      {Array.from({length:10},(_,i)=>(
        <rect key={i} x={1} y={i*10+1} width={12} height={8} fill="#16a34a" stroke="#15803d" strokeWidth="0.5" rx="1"/>
      ))}
    </svg>
  );
}
function OneBlockSVG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" role="img" aria-label="one">
      <rect x={1} y={1} width={18} height={18} fill="#d97706" stroke="#92400e" strokeWidth="1" rx="3"/>
    </svg>
  );
}

export default function QuestionRenderer({ question: q, onAnswer, disabled = false }) {
  const [textInput, setTextInput] = useState('');
  const isMCQ = Array.isArray(q.options) && q.options.length > 0;

  const submit = () => { if (textInput.trim()) { onAnswer(textInput.trim()); setTextInput(''); } };

  const showBlocks = q.type === 'block_count' || q.type === 'word_problem';
  const showChart  = q.visual === 'chart' || q.type === 'place_value_chart' || q.type === 'digit_place';
  const showCompare= q.type === 'compare_order';

  return (
    <div>
      {/* Block visual */}
      {showBlocks && (
        <div className="block-vis">
          {q.hundreds > 0 && (
            <div className="block-vis-group">
              <div className="block-vis-items">
                {Array.from({length: q.hundreds}, (_,i) => <HundredBlockSVG key={i} size={38} />)}
              </div>
              <span className="block-vis-label">Hundreds ({q.hundreds})</span>
            </div>
          )}
          {q.tens > 0 && (
            <div className="block-vis-group">
              <div className="block-vis-items">
                {Array.from({length: q.tens}, (_,i) => <TenBlockSVG key={i} size={38} />)}
              </div>
              <span className="block-vis-label">Tens ({q.tens})</span>
            </div>
          )}
          {q.ones > 0 && (
            <div className="block-vis-group">
              <div className="block-vis-items">
                {Array.from({length: Math.min(q.ones,9)}, (_,i) => <OneBlockSVG key={i} />)}
              </div>
              <span className="block-vis-label">Ones ({q.ones})</span>
            </div>
          )}
        </div>
      )}

      {/* PV Chart visual */}
      {showChart && (
        <div className="pv-display">
          {['H','T','O'].map((l,i) => (
            <div key={l} className={`pvd-head ${['h','t','o'][i]}`}>{l}</div>
          ))}
          {[q.hundreds, q.tens, q.ones].map((v,i) => (
            <div key={i} className="pvd-val">{v}</div>
          ))}
        </div>
      )}

      {/* Compare visual */}
      {showCompare && (
        <div style={{ display:'flex', gap:20, justifyContent:'center', marginBottom:14 }}>
          {q.options.map(opt => (
            <div key={opt} style={{
              fontFamily:'var(--font)', fontSize:'2rem', fontWeight:900,
              padding:'10px 22px', borderRadius:'var(--r-md)',
              background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.14)',
            }}>{opt}</div>
          ))}
        </div>
      )}

      {/* Pattern visual */}
      {q.type === 'number_pattern' && (
        <div style={{ display:'flex', gap:8, justifyContent:'center', alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
          {q.questionText.split(',').slice(0,-1).map((n,i) => (
            <div key={i} style={{
              fontFamily:'var(--font)', fontSize:'1.3rem', fontWeight:900,
              padding:'7px 14px', borderRadius:'var(--r-md)',
              background:'rgba(96,165,250,0.15)', border:'1.5px solid rgba(96,165,250,0.3)',
              color:'#93c5fd',
            }}>{n.replace(/___/,'').trim()}</div>
          ))}
          <div style={{
            fontFamily:'var(--font)', fontSize:'1.3rem', fontWeight:900,
            padding:'7px 14px', borderRadius:'var(--r-md)',
            background:'rgba(245,197,24,0.08)', border:'2px dashed var(--yellow)',
            color:'var(--yellow)',
          }}>?</div>
        </div>
      )}

      {/* Question text */}
      <p className="q-text">{q.questionText}</p>

      {/* MCQ */}
      {isMCQ ? (
        <div className="mcq-grid">
          {q.options.map((opt,i) => (
            <button
              key={i}
              className="mcq-opt"
              onClick={() => !disabled && onAnswer(opt)}
              disabled={disabled}
              aria-label={String(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="ans-row">
          <input
            className="ans-input"
            type="text"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Type answer…"
            disabled={disabled}
            aria-label="Your answer"
          />
          <button className="btn btn-yellow btn-sm" onClick={submit} disabled={disabled || !textInput.trim()}>
            Check ✓
          </button>
        </div>
      )}
    </div>
  );
}
