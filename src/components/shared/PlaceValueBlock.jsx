// Reusable SVG place value block components

export function HundredBlock({ size = 60, animated = false }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      style={animated ? { animation: 'blockDrop 0.4s ease' } : {}}
      role="img" aria-label="hundred block"
    >
      {Array.from({ length: 10 }, (_, row) =>
        Array.from({ length: 10 }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 10 + 1} y={row * 10 + 1}
            width={8} height={8}
            fill="#2980B9" stroke="#1A5276" strokeWidth="0.5" rx="1"
          />
        ))
      )}
    </svg>
  );
}

export function TenBlock({ size = 60, animated = false }) {
  return (
    <svg
      width={size / 7} height={size}
      viewBox="0 0 14 100"
      style={animated ? { animation: 'blockDrop 0.4s ease' } : {}}
      role="img" aria-label="ten block"
    >
      {Array.from({ length: 10 }, (_, i) => (
        <rect
          key={i}
          x={1} y={i * 10 + 1}
          width={12} height={8}
          fill="#27AE60" stroke="#1E8449" strokeWidth="0.5" rx="1"
        />
      ))}
    </svg>
  );
}

export function OneBlock({ size = 18, animated = false }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 20 20"
      style={animated ? { animation: 'blockDrop 0.3s ease' } : {}}
      role="img" aria-label="one block"
    >
      <rect x={1} y={1} width={18} height={18} fill="#F4C542" stroke="#D4AC0D" strokeWidth="1" rx="3" />
    </svg>
  );
}

// Renders a group of H/T/O blocks for a given number
export function BlockSet({ hundreds = 0, tens = 0, ones = 0, size = 50 }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
      {hundreds > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', maxWidth: (size + 6) * 3 }}>
            {Array.from({ length: hundreds }, (_, i) => <HundredBlock key={i} size={size} />)}
          </div>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
            Hundreds ({hundreds})
          </span>
        </div>
      )}
      {tens > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Array.from({ length: tens }, (_, i) => <TenBlock key={i} size={size} />)}
          </div>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
            Tens ({tens})
          </span>
        </div>
      )}
      {ones > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', maxWidth: (18 + 5) * 5 }}>
            {Array.from({ length: ones }, (_, i) => <OneBlock key={i} size={18} />)}
          </div>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
            Ones ({ones})
          </span>
        </div>
      )}
    </div>
  );
}
