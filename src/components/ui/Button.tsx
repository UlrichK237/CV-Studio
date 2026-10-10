import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'subtle' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Hauteurs strictes du design system : md = 40px, sm = 36px (dense), lg = 44px (touch mobile)
    const sizeClasses = {
      sm: 'h-9 px-3 text-[13px] gap-1.5',
      md: 'h-10 px-4 text-[14px] gap-2',
      lg: 'h-11 px-5 text-[15px] gap-2.5',
    }[size];

    const variantClasses = {
      primary:
        'bg-btn-primary text-btn-primary hover:opacity-95 active:opacity-90 font-medium border border-transparent shadow-card cursor-pointer',
      secondary:
        'bg-surface text-primary border border-default hover:bg-surface-secondary active:border-strong font-medium cursor-pointer',
      subtle:
        'bg-transparent text-muted hover:text-primary hover:bg-surface-secondary border border-transparent font-medium cursor-pointer',
      danger:
        'bg-surface text-danger border border-default hover:border-danger hover:bg-danger/5 font-medium cursor-pointer',
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-lg select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-all ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
