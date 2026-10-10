import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  dense?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      hasError = false,
      dense = false,
      leftElement,
      rightElement,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const heightClass = dense ? 'h-9 text-[13px]' : 'h-10 text-[14px]';
    const borderClass = hasError
      ? 'border-danger focus:border-danger'
      : 'border-default focus:border-accent';

    return (
      <div className="relative flex items-center w-full">
        {leftElement && (
          <div className="absolute left-3 flex items-center pointer-events-none text-muted shrink-0">
            {leftElement}
          </div>
        )}

        <input
          ref={ref}
          disabled={disabled}
          className={`w-full bg-surface text-primary rounded-lg border ${borderClass} px-3 py-2 ${heightClass} ${
            leftElement ? 'pl-9' : ''
          } ${rightElement ? 'pr-9' : ''} placeholder:text-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center pointer-events-none text-muted shrink-0">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
