import React from 'react';

export interface FieldProps {
  label?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  counter?: { current: number; max: number };
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Field: React.FC<FieldProps> = ({
  label,
  required,
  helpText,
  error,
  counter,
  children,
  className = '',
  id,
}) => {
  // Calcul de statut du compteur
  let counterColorClass = 'text-subtle';
  if (counter) {
    const ratio = counter.current / counter.max;
    if (counter.current > counter.max) {
      counterColorClass = 'text-danger font-medium';
    } else if (ratio >= 0.9) {
      counterColorClass = 'text-warning font-medium';
    }
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || counter) && (
        <div className="flex items-center justify-between gap-2 min-h-[18px]">
          {label && (
            <label
              htmlFor={id}
              className="text-[13px] font-medium text-primary select-none flex items-center gap-1"
            >
              <span>{label}</span>
              {required && (
                <span className="text-subtle text-xs" title="Champ obligatoire" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}

          {counter && (
            <span
              className={`text-[12px] tabular-nums ml-auto ${counterColorClass}`}
              aria-live="polite"
            >
              {counter.current} / {counter.max}
            </span>
          )}
        </div>
      )}

      <div>{children}</div>

      {error ? (
        <p className="text-[12px] text-danger mt-0.5 flex items-center gap-1" role="alert">
          {error}
        </p>
      ) : helpText ? (
        <p className="text-[12px] text-subtle mt-0.5">{helpText}</p>
      ) : null}
    </div>
  );
};
