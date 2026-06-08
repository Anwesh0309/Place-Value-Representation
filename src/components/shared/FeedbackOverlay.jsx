export default function FeedbackOverlay({ isCorrect, explanation, onContinue, showExplanation = false }) {
  return (
    <div className="feedback-overlay" onClick={onContinue} role="dialog" aria-modal="true">
      <div
        className={`feedback-card ${isCorrect ? 'correct' : 'incorrect'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-emoji">{isCorrect ? '🎉' : '🔢'}</div>
        <div className={`feedback-title ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? 'Brilliant!' : 'Not quite!'}
        </div>
        <div className="feedback-text">
          {isCorrect
            ? "You know your place values! Keep it up! 🌟"
            : "Let's look at the place value chart again. You can do it! 💪"}
        </div>
        {showExplanation && explanation && (
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 16,
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'left',
            lineHeight: 1.6,
          }}>
            💡 {explanation}
          </div>
        )}
        <button className="btn btn-primary" onClick={onContinue} autoFocus>
          {isCorrect ? 'Next Question →' : 'Try Again →'}
        </button>
      </div>
    </div>
  );
}
