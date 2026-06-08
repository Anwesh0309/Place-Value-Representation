import { useState, useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../../utils/audio.js';

/* Narration — exact matches to audioMap keys */
const SLIDE_AUDIO = [
  "Emma loves collecting stickers. She has so many, she needs to organise them! Can you help her count?",
  "She puts them into albums. Each album holds one hundred stickers. She has three albums — that is 300 stickers!",
  "She also has four strips of ten stickers. That is 40 more stickers!",
  "And she has 7 single stickers too. These are the ones — the last digits!",
  "Three hundreds, four tens, and seven ones. We write this as 347. Look at the place value chart!",
  "We say: three hundred and forty-seven. 347 equals 300 plus 40 plus 7. This is called the expanded form!",
];

/* ── SVG Illustrations ── */
function IllustrationMeiLing() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="100%" style={{ display:'block' }}>
      <rect width="560" height="220" fill="#1a0840"/>
      <rect x="30" y="165" width="500" height="9" rx="4" fill="#4c1d95"/>
      {[0,1,2].map(i=>(
        <g key={i} transform={`translate(${70+i*110},60)`}>
          <rect width="90" height="98" rx="10" fill={['#1d4ed8','#1e40af','#1e3a8a'][i]}/>
          <rect x="5" y="5" width="80" height="88" rx="7" fill={['#2563eb','#3b82f6','#60a5fa'][i]}/>
          <text x="45" y="36" textAnchor="middle" fill="white" fontSize="14" fontWeight="900">100</text>
          <text x="45" y="52" textAnchor="middle" fill="rgba(255,255,255,.7)" fontSize="10">stickers</text>
          {[0,1,2,3].map(r=>[0,1,2,3].map(c=>(
            <rect key={`${r}${c}`} x={9+c*17} y={58+r*7} width={13} height={5} rx="2" fill="#93c5fd" opacity=".6"/>
          )))}
        </g>
      ))}
      <circle cx="420" cy="108" r="30" fill="#fbbf24"/>
      <ellipse cx="420" cy="142" rx="26" ry="20" fill="#7c3aed"/>
      <circle cx="412" cy="102" r="3.5" fill="#1e0f4e"/>
      <circle cx="428" cy="102" r="3.5" fill="#1e0f4e"/>
      <path d="M412 115 Q420 121 428 115" stroke="#1e0f4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M392 97 Q396 75 420 74 Q444 75 448 97" fill="#1e0f4e"/>
      <rect x="450" y="72" width="90" height="28" rx="9" fill="white"/>
      <polygon points="450,86 440,92 450,98" fill="white"/>
      <text x="495" y="90" textAnchor="middle" fill="#1e0f4e" fontSize="10" fontWeight="800">My stickers!</text>
      <text x="280" y="196" textAnchor="middle" fill="#f5c518" fontSize="13" fontWeight="900">Meet Emma — Sticker Collector!</text>
      <text x="280" y="213" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="9.5">She organises her stickers into hundreds, tens and ones</text>
    </svg>
  );
}

function IllustrationHundredAlbums() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="100%" style={{ display:'block' }}>
      <rect width="560" height="220" fill="#0c1a4a"/>
      <text x="280" y="22" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="900">3 Albums × 100 Stickers = 300</text>
      {[0,1,2].map(i=>(
        <g key={i} transform={`translate(${52+i*162},30)`}>
          <rect width="128" height="140" rx="11" fill="#1d4ed8"/>
          <rect x="5" y="5" width="118" height="130" rx="8" fill="#2563eb"/>
          <text x="64" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="900">Album {i+1}</text>
          {Array.from({length:10},(_,r)=>Array.from({length:10},(_,c)=>(
            <rect key={`${r}${c}`} x={8+c*11} y={38+r*8} width={9} height={6} rx="1" fill="#93c5fd" opacity=".6"/>
          )))}
          <text x="64" y="155" textAnchor="middle" fill="#f5c518" fontSize="12" fontWeight="900">= 100 ✓</text>
        </g>
      ))}
      <text x="280" y="200" textAnchor="middle" fill="white" fontSize="15" fontWeight="900">3 × 100 = <tspan fill="#f5c518">300 stickers</tspan></text>
    </svg>
  );
}

function IllustrationTenStrips() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="100%" style={{ display:'block' }}>
      <rect width="560" height="220" fill="#062316"/>
      <text x="280" y="20" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="900">4 Strips × 10 Stickers = 40</text>
      {[0,1,2,3].map(i=>(
        <g key={i} transform={`translate(${58+i*112},28)`}>
          <rect width="94" height="150" rx="10" fill="#15803d"/>
          <rect x="5" y="5" width="84" height="140" rx="7" fill="#16a34a"/>
          {Array.from({length:10},(_,j)=>(
            <rect key={j} x="10" y={12+j*12} width="74" height="9" rx="3" fill="#86efac" opacity=".7"/>
          ))}
          <text x="47" y="168" textAnchor="middle" fill="#f5c518" fontSize="12" fontWeight="900">10</text>
        </g>
      ))}
      <text x="280" y="200" textAnchor="middle" fill="white" fontSize="15" fontWeight="900">4 × 10 = <tspan fill="#f5c518">40 stickers</tspan></text>
    </svg>
  );
}

function IllustrationOnes() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="100%" style={{ display:'block' }}>
      <rect width="560" height="220" fill="#2d1a00"/>
      <text x="280" y="20" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="900">7 Single Stickers (Ones)</text>
      {[0,1,2,3,4,5,6].map(i=>{
        const emojis=['⭐','🌟','💫','✨','🌸','🎀','🦋'];
        const col=i%4, row=Math.floor(i/4);
        return (
          <g key={i} transform={`translate(${52+col*112},${28+row*95})`}>
            <rect width="90" height="80" rx="13" fill="#92400e"/>
            <rect x="4" y="4" width="82" height="72" rx="10" fill="#b45309"/>
            <text x="45" y="50" textAnchor="middle" fontSize="30">{emojis[i]}</text>
          </g>
        );
      })}
      <text x="280" y="208" textAnchor="middle" fill="white" fontSize="15" fontWeight="900">7 × 1 = <tspan fill="#f5c518">7 stickers</tspan></text>
    </svg>
  );
}

function IllustrationPVChart() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="100%" style={{ display:'block' }}>
      <rect width="560" height="220" fill="#0a1628"/>
      <text x="280" y="20" textAnchor="middle" fill="#f5c518" fontSize="13" fontWeight="900">Place Value Chart — 347</text>
      {[
        {x:72,  label:'Hundreds', bg:'#1d4ed8', accent:'#93c5fd', val:'3'},
        {x:212, label:'Tens',     bg:'#15803d', accent:'#86efac', val:'4'},
        {x:352, label:'Ones',     bg:'#92400e', accent:'#fde68a', val:'7'},
      ].map(c=>(
        <g key={c.label} transform={`translate(${c.x},28)`}>
          <rect width="128" height="44" rx="7" fill={c.bg}/>
          <text x="64" y="30" textAnchor="middle" fill={c.accent} fontSize="12" fontWeight="900">{c.label}</text>
          <rect y="44" width="128" height="84" rx="7" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.15)" strokeWidth="1"/>
          <text x="64" y="100" textAnchor="middle" fill="white" fontSize="44" fontWeight="900">{c.val}</text>
        </g>
      ))}
      <text x="280" y="168" textAnchor="middle" fill="rgba(255,255,255,.45)" fontSize="11">The number is:</text>
      <text x="280" y="204" textAnchor="middle" fill="#f5c518" fontSize="34" fontWeight="900">347</text>
    </svg>
  );
}

function IllustrationExpandedForm() {
  return (
    <svg viewBox="0 0 560 220" width="100%" height="100%" style={{ display:'block' }}>
      <rect width="560" height="220" fill="#0d0620"/>
      <text x="280" y="20" textAnchor="middle" fill="#f5c518" fontSize="13" fontWeight="900">Expanded Form</text>
      <text x="280" y="70" textAnchor="middle" fill="white" fontSize="46" fontWeight="900">347</text>
      <text x="280" y="94" textAnchor="middle" fill="rgba(255,255,255,.35)" fontSize="14">=</text>
      {[
        {x:28,  w:106, text:'300', sub:'3 hundreds', bg:'#1d4ed8', col:'#93c5fd'},
        {x:146, w:18,  text:'+',  sub:'',            bg:'none',    col:'rgba(255,255,255,.3)'},
        {x:172, w:94,  text:'40', sub:'4 tens',      bg:'#15803d', col:'#86efac'},
        {x:278, w:18,  text:'+',  sub:'',            bg:'none',    col:'rgba(255,255,255,.3)'},
        {x:304, w:82,  text:'7',  sub:'7 ones',      bg:'#92400e', col:'#fde68a'},
      ].map((b,i)=> b.sub ? (
        <g key={i} transform={`translate(${b.x+84},104)`}>
          <rect width={b.w} height="56" rx="9" fill={b.bg} opacity=".85"/>
          <text x={b.w/2} y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="900">{b.text}</text>
          <text x={b.w/2} y="46" textAnchor="middle" fill={b.col} fontSize="8.5">{b.sub}</text>
        </g>
      ):(
        <text key={i} x={b.x+84+b.w/2} y="138" textAnchor="middle" fill={b.col} fontSize="20" fontWeight="900">{b.text}</text>
      ))}
      <text x="280" y="186" textAnchor="middle" fill="rgba(255,255,255,.38)" fontSize="10.5">This is called expanded form!</text>
      <text x="280" y="208" textAnchor="middle" fill="#f5c518" fontSize="12" fontWeight="800">300 + 40 + 7 = 347</text>
    </svg>
  );
}

const SLIDES = [
  { Illustration: IllustrationMeiLing,      title: "Emma's Sticker Collection",      text: "Emma loves collecting stickers. She has so many, she needs to organise them! Can you help her count?",                               highlight: null,                          mascot: "Let's count with Emma! 📚" },
  { Illustration: IllustrationHundredAlbums,title: "Hundreds — Albums of 100",        text: "She puts them into albums. Each album holds one hundred stickers. She has three albums — that is 300 stickers!",                           highlight: "✦ 3 × 100 = 300 stickers ✦", mascot: "3 albums = 300! 📁" },
  { Illustration: IllustrationTenStrips,    title: "Tens — Strips of 10",             text: "She also has four strips of ten stickers. That is 40 more stickers!",                                                                       highlight: "✦ 4 × 10 = 40 stickers ✦",   mascot: "4 strips = 40! 🟩" },
  { Illustration: IllustrationOnes,         title: "Ones — Single Stickers",          text: "And she has 7 single stickers too. These are the ones — the last digits!",                                                                  highlight: "✦ 7 × 1 = 7 stickers ✦",     mascot: "7 singles! ⭐" },
  { Illustration: IllustrationPVChart,      title: "Place Value Chart",               text: "Three hundreds, four tens, and seven ones. We write this as 347. Look at the place value chart!",                                           highlight: "✦ H=3  T=4  O=7  →  347 ✦",  mascot: "Look at the chart! 📊" },
  { Illustration: IllustrationExpandedForm, title: "Expanded Form",                   text: "We say: three hundred and forty-seven. 347 equals 300 plus 40 plus 7. This is called the expanded form!",                                  highlight: "✦ 347 = 300 + 40 + 7 ✦",     mascot: "347 = 300+40+7! 🎉" },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const audioRef = useRef(audioEnabled);
  audioRef.current = audioEnabled;

  useEffect(() => {
    stopNarration();
    if (audioRef.current && SLIDE_AUDIO[slide]) {
      const t = setTimeout(() => narrate([{ text: SLIDE_AUDIO[slide], style: 'statement' }]), 250);
      return () => { clearTimeout(t); stopNarration(); };
    }
    return () => stopNarration();
  }, [slide]); // eslint-disable-line

  const goSlide = (n) => { stopNarration(); setSlide(n); };
  const s = SLIDES[slide];

  return (
    /* Full-height wrapper, centers the card vertically */
    <div style={{
      minHeight: 'calc(100vh - 58px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 20px 16px',
      boxSizing: 'border-box',
    }}>

      {/* Narrow story card — max 620px, matches reference */}
      <div style={{
        width: '100%',
        maxWidth: 640,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>

        {/* Progress bar + counter — above card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 10,
        }}>
          <div style={{
            flex: 1, height: 4,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 99, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${((slide + 1) / SLIDES.length) * 100}%`,
              background: 'linear-gradient(90deg,#6d28d9,#f5c518)',
              transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{
            fontSize: '0.74rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap',
          }}>
            {slide + 1} / {SLIDES.length}
          </span>
        </div>

        {/* Story card */}
        <div
          key={slide}
          style={{
            background: 'rgba(26, 10, 72, 0.88)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(0,0,0,0.55)',
            animation: 'slideUp 0.3s ease',
          }}
        >
          {/* Illustration — rounded top, fixed height */}
          <div style={{
            width: '100%',
            height: 220,
            background: '#0a0520',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '18px 18px 0 0',
          }}>
            <s.Illustration />
          </div>

          {/* Card body */}
          <div style={{ padding: '16px 22px 18px' }}>
            {/* Gold title — large, bold */}
            <h2 style={{
              fontFamily: 'var(--font)',
              fontSize: '1.2rem',
              fontWeight: 900,
              color: '#f5c518',
              marginBottom: 10,
              lineHeight: 1.2,
            }}>
              {s.title}
            </h2>

            {/* Body text — large and readable for children */}
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 700,
              marginBottom: s.highlight ? 12 : 14,
            }}>
              {s.text}
            </p>

            {/* Highlight pill — extra bold */}
            {s.highlight && (
              <div style={{
                background: 'rgba(109,40,217,0.4)',
                border: '2px solid rgba(109,40,217,0.6)',
                borderRadius: 12,
                padding: '10px 18px',
                textAlign: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '1rem',
                marginBottom: 14,
                letterSpacing: '0.3px',
              }}>
                {s.highlight}
              </div>
            )}

            {/* Mascot row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg,#f97316,#f59e0b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', flexShrink: 0,
                boxShadow: '0 2px 10px rgba(249,115,22,.4)',
              }}>🐻</div>
              <div style={{
                background: '#fff',
                color: '#0d0620',
                borderRadius: '12px 12px 12px 3px',
                padding: '6px 12px',
                fontWeight: 700,
                fontSize: '0.8rem',
                lineHeight: 1.4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}>
                {s.mascot}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation row — OUTSIDE card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 14,
          padding: '0 2px',
        }}>
          {/* ← Back */}
          <button
            onClick={() => goSlide(Math.max(0, slide - 1))}
            disabled={slide === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '9px 20px', borderRadius: 10,
              border: '1.5px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)',
              color: slide === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--font)', fontWeight: 800, fontSize: '0.85rem',
              cursor: slide === 0 ? 'not-allowed' : 'pointer',
              transition: 'all .18s',
            }}
          >
            ← Back
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {SLIDES.map((_, i) => (
              <div
                key={i}
                onClick={() => goSlide(i)}
                style={{
                  width: i === slide ? 24 : 8, height: 8,
                  borderRadius: 4,
                  background: i === slide ? '#f5c518' : i < slide ? 'var(--green)' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer', transition: 'all .3s', flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Next → / Simulate */}
          {slide < SLIDES.length - 1 ? (
            <button
              onClick={() => goSlide(slide + 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '9px 24px', borderRadius: 10, border: 'none',
                background: '#f5c518', color: '#0d0620',
                fontFamily: 'var(--font)', fontWeight: 800, fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(245,197,24,.35)',
                transition: 'all .18s',
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onComplete}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '9px 20px', borderRadius: 10, border: 'none',
                background: '#f5c518', color: '#0d0620',
                fontFamily: 'var(--font)', fontWeight: 800, fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(245,197,24,.35)',
              }}
            >
              Simulate 🧪
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
