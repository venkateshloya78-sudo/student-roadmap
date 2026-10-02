interface ProgressBarProps {
  value: number; // 0–100
  color?: 'blue' | 'green' | 'amber' | 'purple';
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  blue:   'bg-brand-500',
  green:  'bg-emerald-500',
  amber:  'bg-amber-400',
  purple: 'bg-purple-500',
};

const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

export const ProgressBar = ({
  value,
  color = 'blue',
  showLabel = false,
  height = 'md',
}: ProgressBarProps) => (
  <div className="flex items-center gap-2 w-full">
    <div className={`flex-1 bg-gray-100 rounded-full overflow-hidden ${heightMap[height]}`}>
      <div
        className={`${colorMap[color]} ${heightMap[height]} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
    {showLabel && (
      <span className="text-xs text-gray-500 w-9 text-right tabular-nums">{Math.round(value)}%</span>
    )}
  </div>
);
