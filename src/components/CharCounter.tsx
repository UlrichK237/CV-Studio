import React from 'react';

interface CharCounterProps {
  current: number;
  max: number;
  className?: string;
}

export const CharCounter: React.FC<CharCounterProps> = ({ current, max, className = '' }) => {
  const percentage = max > 0 ? (current / max) * 100 : 0;

  let colorClass = 'text-slate-500 dark:text-slate-400 font-medium';
  if (percentage >= 100) {
    colorClass = 'text-rose-600 dark:text-rose-400 font-semibold';
  } else if (percentage >= 90) {
    colorClass = 'text-amber-600 dark:text-amber-400 font-medium';
  }

  return (
    <div className={`text-[10.5px] font-mono tabular-nums text-right transition-colors ${colorClass} ${className}`}>
      {current} / {max}
    </div>
  );
};
