import React from 'react';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'subtle' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  'aria-label': string; // Obligatoire pour l'accessibilité
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      children,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-8 h-8 min-w-[32px] p-1.5',
      md: 'w-10 h-10 min-w-[40px] p-2',
      lg: 'w-11 h-11 min-w-[44px] p-2.5',
    }[size];

    const variantClasses = {
      primary: 'bg-btn-primary text-btn-primary hover:opacity-95 active:opacity-90 border border-transparent shadow-card',
      secondary: 'bg-surface text-muted hover:text-primary border border-default hover:bg-surface-secondary active:border-strong',
      subtle: 'bg-transparent text-muted hover:text-primary hover:bg-surface-secondary border border-transparent',
      danger: 'bg-surface text-muted hover:text-danger border border-default hover:border-danger hover:bg-danger/5',
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-lg select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer transition-all ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
