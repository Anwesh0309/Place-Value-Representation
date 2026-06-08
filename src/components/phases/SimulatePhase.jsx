import { useEffect } from 'react';
import BlockBuilder from '../simulations/BlockBuilder.jsx';
import PlaceValueChartStation from '../simulations/PlaceValueChartStation.jsx';
import ExpandedFormStation from '../simulations/ExpandedFormStation.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import {
  simulateStationANarration,
  simulateStationBNarration,
  simulateStationCNarration,
} from '../../utils/narration.js';

const STATIONS = [
  {
    id: 0, label: '🧱 Block Builder', sub: 'Concrete',
    desc: 'Use + and − to build the target number with place value blocks.',
    getNarration: simulateStationANarration,
  },
  {
    id: 1, label: '📊 Place Value Chart', sub: 'Pictorial',
    desc: 'Fill in the H | T | O chart using the arrows. Watch the word appear!',
    getNarration: simulateStationBNarration,
  },
  {
    id: 2, label: '🔢 Expanded Form', sub: 'Abstract',
    desc: 'Complete expanded form and notation challenges.',
    getNarration: simulateStationCNarration,
  },
];

export default function SimulatePhase({ onComplete, audioEnabled, simStationsComplete, dispatch }) {
  const firstIncomplete = simStationsComplete.indexOf(false);
  const activeStation   = firstIncomplete === -1 ? 2 : firstIncomplete;
  const stationInfo     = STATIONS[activeStation];

  useEffect(() => {
    stopNarration();
    if (audioEnabled) {
      const t = setTimeout(() => {
        narrate(stationInfo.getNarration());
      }, 350);
      return () => { clearTimeout(t); stopNarration(); };
    }
    return () => stopNarration();
  }, [activeStation, audioEnabled]); // eslint-disable-line

  const done = (stationIdx) => {
    dispatch({ type: 'COMPLETE_SIM_STATION', payload: stationIdx });
    if (stationIdx === 2) onComplete();
  };

  return (
    <div style={{
      padding: '14px 20px',
      maxWidth: 720,
      margin: '0 auto',
      minHeight: 'calc(100vh - 52px)',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--yellow)', marginBottom: 4 }}>
          Simulation Stations
        </h2>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.42)' }}>
          Concrete → Pictorial → Abstract
        </p>
      </div>

      {/* Station tabs */}
      <div className="station-tabs">
        {STATIONS.map(s => (
          <button
            key={s.id}
            className={`station-tab ${activeStation === s.id ? 'active' : ''} ${simStationsComplete[s.id] ? 'complete' : ''}`}
            disabled={!simStationsComplete[s.id] && s.id !== activeStation}
            aria-label={`Station ${s.id + 1}: ${s.label}`}
          >
            {simStationsComplete[s.id] ? '✅ ' : ''}{s.label}
            <span style={{ display: 'block', fontSize: '0.56rem', opacity: 0.6 }}>{s.sub}</span>
          </button>
        ))}
      </div>

      <div className="card" key={activeStation} style={{ animation: 'slideUp 0.3s ease' }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--font)', fontWeight: 900, fontSize: '0.98rem', color: 'var(--yellow)', marginBottom: 4 }}>
            Station {activeStation + 1}: {stationInfo.label}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.42)', fontWeight: 600 }}>
            {stationInfo.desc}
          </div>
        </div>

        {activeStation === 0 && <BlockBuilder   onComplete={() => done(0)} audioEnabled={audioEnabled} />}
        {activeStation === 1 && <PlaceValueChartStation onComplete={() => done(1)} audioEnabled={audioEnabled} />}
        {activeStation === 2 && <ExpandedFormStation    onComplete={() => done(2)} audioEnabled={audioEnabled} />}
      </div>
    </div>
  );
}
