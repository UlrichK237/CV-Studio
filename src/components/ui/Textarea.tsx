import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ hasError = false, className = '', disabled, ...props }, ref) => {
    const borderClass = hasError
      ? 'border-danger focus:border-danger'
      : 'border-default focus:border-accent';

    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`w-full bg-surface text-primary rounded-lg border ${borderClass} px-3 py-2.5 text-[14px] leading-relaxed placeholder:text-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-y ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
