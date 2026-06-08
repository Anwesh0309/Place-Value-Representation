export default function NumberPad({ value = '', onChange, onSubmit, maxDigits = 4, disabled = false }) {
  const handleKey = (k) => {
    if (disabled) return;
    if (k === '⌫') {
      onChange(value.slice(0, -1));
    } else if (k === '✓') {
      if (onSubmit) onSubmit(value);
    } else {
      if (value.length < maxDigits) onChange(value + k);
    }
  };

  const keys = ['1','2','3','4','5','6','7','8','9','⌫','0','✓'];

  return (
    <div className="number-pad">
      {keys.map((k) => (
        <button
          key={k}
          className={`num-key ${k === '⌫' ? 'del' : ''} ${k === '✓' ? 'enter' : ''}`}
          onClick={() => handleKey(k)}
          disabled={disabled}
          aria-label={k === '⌫' ? 'Delete' : k === '✓' ? 'Submit' : k}
        >
          {k}
        </button>
      ))}
    </div>
  );
}
