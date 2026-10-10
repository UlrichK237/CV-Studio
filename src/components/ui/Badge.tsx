import React from 'react';

export interface BadgeProps {
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
}) => {
  const variantClasses = {
    neutral: 'bg-surface-secondary text-muted border-default',
    accent: 'bg-accent-soft text-accent border-accent/20',
    success: 'bg-surface-secondary text-success border-success/30',
    warning: 'bg-surface-secondary text-warning border-warning/30',
    danger: 'bg-surface-secondary text-danger border-danger/30',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[12px] font-medium rounded-md border ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
