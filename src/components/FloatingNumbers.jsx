// Fully static — computed once at module load, never re-renders expensively
const ITEMS = Array.from({ length: 14 }, (_, i) => {
  const nums = ['100','200','347','H','T','O','300+40+7','999','500','123'];
  return {
    id: i,
    text: nums[i % nums.length],
    left: 4 + (i * 6.8) % 92,
    fontSize: 13 + (i * 6) % 20,
    duration: 20 + (i * 2.8) % 18,
    delay: -(i * 2.5) % 20,
  };
});

export default function FloatingNumbers() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {ITEMS.map((item) => (
        <div
          key={item.id}
          className="float-num"
          style={{
            left: `${item.left}%`,
            fontSize: item.fontSize,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
