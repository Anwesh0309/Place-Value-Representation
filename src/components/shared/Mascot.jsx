export default function Mascot({ mood = 'idle', size = 72, bubble = null }) {
  return (
    <div className="mascot-wrap">
      {bubble && <div className="mascot-bubble">{bubble}</div>}
      <div
        className={`mascot-avatar ${mood === 'celebrating' ? 'celebrating' : mood === 'thinking' ? 'thinking' : ''}`}
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        🐻
      </div>
    </div>
  );
}
