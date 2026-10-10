import React from 'react';

export interface SegmentedOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  dense?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  dense = false,
  className = '',
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  const containerHeight = dense ? 'h-9 p-0.5' : 'h-10 p-1';
  const itemPadding = dense ? 'px-2.5 py-1 text-[12px]' : 'px-3 py-1.5 text-[13px]';

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center bg-surface-secondary border border-default rounded-lg select-none ${containerHeight} ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`flex items-center justify-center gap-1.5 font-medium rounded-md transition-all cursor-pointer ${itemPadding} ${
              isSelected
                ? 'bg-surface text-primary border border-default shadow-xs'
                : 'text-muted hover:text-primary'
            }`}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
