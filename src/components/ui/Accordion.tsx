import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface AccordionItemProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  isCompleted?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  description,
  icon,
  isCompleted = false,
  isOpen,
  onToggle,
  children,
  className = '',
}) => {
  return (
    <div
      id={id}
      className={`bg-surface border border-default rounded-xl transition-colors ${className}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-primary truncate group-hover:text-accent transition-colors">
                {title}
              </span>
              {isCompleted && (
                <span
                  className="inline-flex items-center text-success"
                  title="Section complétée"
                  aria-label="Section complétée"
                >
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            {description && (
              <p className="text-[12px] text-muted truncate mt-0.5">{description}</p>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center text-muted group-hover:text-primary transition-colors">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-150 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-default/60">
          {children}
        </div>
      )}
    </div>
  );
};
