import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <div className="relative w-full max-w-md bg-surface border border-default rounded-xl shadow-dropdown p-5 space-y-4">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-muted hover:text-primary p-1 rounded-md hover:bg-surface-secondary cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-danger shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>

          <div className="flex-1 pr-6">
            <h3 className="text-[15px] font-semibold text-primary">{title}</h3>
            <p className="text-[13px] text-muted mt-1.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-default">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 px-3.5 text-[13px] font-medium text-muted hover:text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-9 px-4 text-[13px] font-medium rounded-lg transition-colors cursor-pointer ${
              isDestructive
                ? 'bg-danger text-white hover:opacity-95'
                : 'bg-btn-primary text-btn-primary hover:opacity-95'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
