import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

interface MissingFieldsModalProps {
  isOpen: boolean;
  missingFields: string[];
  onProceed: () => void;
  onClose: () => void;
}

export const MissingFieldsModal: React.FC<MissingFieldsModalProps> = ({
  isOpen,
  missingFields,
  onProceed,
  onClose,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <div className="relative w-full max-w-lg bg-surface border border-default rounded-xl shadow-dropdown p-5 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-primary p-1 rounded-md hover:bg-surface-secondary cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-warning shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-warning" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-primary">
              Informations recommandées non renseignées
            </h3>
            <p className="text-[13px] text-muted mt-1 leading-relaxed">
              Pour assurer un document complet, nous vous conseillons de renseigner les éléments suivants :
            </p>
          </div>
        </div>

        <ul className="space-y-1.5 bg-surface-secondary/70 p-3.5 rounded-lg border border-default">
          {missingFields.map((field, idx) => (
            <li key={idx} className="text-[13px] text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
              <span>{field}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-default">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-9 px-3.5 text-[13px] font-medium text-muted hover:text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer"
          >
            Compléter les champs
          </button>
          <button
            type="button"
            onClick={onProceed}
            className="w-full sm:w-auto h-9 px-4 text-[13px] font-medium text-btn-primary bg-btn-primary hover:opacity-95 rounded-lg transition-colors cursor-pointer shadow-card"
          >
            Télécharger quand même
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
