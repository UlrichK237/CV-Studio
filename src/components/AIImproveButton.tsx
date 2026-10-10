import React, { useState, useEffect } from 'react';
import { Loader2, Check, X, Clock, AlertCircle } from 'lucide-react';
import {
  improveText,
  subscribeToAICooldown,
  getAICooldownSeconds,
  AIImproveContext,
} from '../lib/ai';

interface AIImproveButtonProps {
  type: 'profil' | 'experience' | 'projet';
  currentText: string;
  context?: AIImproveContext;
  onAccept: (improvedText: string) => void;
  className?: string;
}

export const AIImproveButton: React.FC<AIImproveButtonProps> = ({
  type,
  currentText,
  context,
  onAccept,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(getAICooldownSeconds());
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ original: string; improved: string; explanation: string } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAICooldown((sec) => setCooldown(sec));
    return unsubscribe;
  }, []);

  const handleImprove = async () => {
    if (!currentText || !currentText.trim()) {
      setError("Veuillez d'abord saisir un texte initial à améliorer.");
      setTimeout(() => setError(null), 4000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await improveText(type, currentText, context);
      setResult({
        original: currentText,
        improved: res.improved,
        explanation: res.explanation,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'amélioration";
      setError(msg);
      setTimeout(() => setError(null), 6000);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (result) {
      onAccept(result.improved);
      setResult(null);
    }
  };

  const handleCancel = () => {
    setResult(null);
  };

  const isButtonDisabled = loading || cooldown > 0 || !currentText?.trim();

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={handleImprove}
        disabled={isButtonDisabled}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-md border transition-colors cursor-pointer ${
          isButtonDisabled
            ? 'bg-surface-secondary text-subtle border-default opacity-60 cursor-not-allowed'
            : 'bg-surface text-primary border-default hover:bg-surface-secondary hover:border-strong'
        }`}
        title={
          cooldown > 0
            ? `Limite d'appels, attente ${cooldown}s`
            : !currentText?.trim()
            ? 'Saisissez du texte pour proposer une amélioration'
            : 'Proposer une reformulation professionnelle'
        }
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
            <span>Reformulation...</span>
          </>
        ) : cooldown > 0 ? (
          <>
            <Clock className="w-3.5 h-3.5 text-warning" />
            <span>Attente {cooldown}s</span>
          </>
        ) : (
          <>
            <span className="text-[11px] font-semibold text-accent px-1 py-0.2 rounded bg-accent-soft">
              IA
            </span>
            <span>Améliorer le texte</span>
          </>
        )}
      </button>

      {error && (
        <div className="absolute left-0 top-full mt-1.5 z-40 w-72 p-2.5 bg-surface border border-danger text-danger rounded-lg text-[12px] shadow-dropdown flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-snug">{error}</div>
        </div>
      )}

      {/* Boîte de comparaison Avant / Après sobre */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg bg-surface border border-default rounded-xl shadow-dropdown p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-default">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-accent px-1.5 py-0.5 rounded bg-accent-soft">
                  IA
                </span>
                <h3 className="font-semibold text-primary text-[15px]">
                  Proposition de reformulation
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="text-muted hover:text-primary p-1 rounded-md hover:bg-surface-secondary cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {result.explanation && (
              <div className="text-[13px] text-muted bg-surface-secondary p-3 rounded-lg border border-default leading-relaxed">
                {result.explanation}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
                  Texte actuel :
                </span>
                <div className="mt-1 p-3 bg-surface-secondary text-muted rounded-lg text-[13px] border border-default max-h-32 overflow-y-auto leading-relaxed">
                  {result.original}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                  Proposition :
                </span>
                <div className="mt-1 p-3 bg-surface text-primary rounded-lg text-[13px] border border-accent max-h-40 overflow-y-auto leading-relaxed">
                  {result.improved}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-default flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCancel}
                className="h-9 px-3.5 text-[13px] font-medium text-muted hover:text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="h-9 px-4 text-[13px] font-medium text-btn-primary bg-btn-primary hover:opacity-95 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-card"
              >
                <Check className="w-4 h-4" />
                <span>Appliquer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
