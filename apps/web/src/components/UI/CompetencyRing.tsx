/** SVG ring showing a 0–100 competency score with colour-coded threshold feedback. */
export const CompetencyRing = ({
  score,
  size = 80,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) => {
  const strokeW = 8;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, score)) / 100) * circ;
  const color =
    score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 absolute inset-0">
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="#f3f4f6" strokeWidth={strokeW}
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth={strokeW}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold leading-none" style={{ color }}>
            {Math.round(score)}
          </span>
          <span className="text-[9px] text-gray-400 leading-none">/ 100</span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-gray-500 text-center leading-tight max-w-[80px]">
          {label}
        </span>
      )}
    </div>
  );
};
