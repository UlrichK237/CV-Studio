import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2, X } from 'lucide-react';
import { importCV } from '../lib/ai';
import { CVData } from '../types';

interface CVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedData: Partial<CVData>) => void;
}

export const CVImportModal: React.FC<CVImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Partial<CVData> | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError('Le fichier ne doit pas dépasser 10 Mo.');
        return;
      }
      setFile(selected);
      setError(null);
      setPreviewData(null);
    }
  };

  const handleStartImport = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const data = await importCV(file);
      setPreviewData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'importation";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmApply = () => {
    if (previewData) {
      onImportSuccess(previewData);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <div className="relative w-full max-w-xl bg-surface border border-default rounded-xl shadow-dropdown p-5 max-h-[90vh] flex flex-col transition-colors space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-default">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary">
              <Upload className="w-4 h-4 text-muted" />
            </div>
            <div>
              <h3 className="font-semibold text-primary text-[15px]">
                Importer un ancien CV (PDF ou image)
              </h3>
              <p className="text-[12px] text-muted">
                Pré-remplissez automatiquement le formulaire
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-primary p-1 rounded-md hover:bg-surface-secondary cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3.5">
          <p className="text-[13px] text-muted leading-relaxed">
            Téléversez votre document existant. Les champs (identité, formations, expériences, compétences) seront extraits automatiquement.
          </p>

          {!previewData ? (
            <div className="space-y-3">
              <label className="flex flex-col items-center justify-center border border-dashed border-default hover:border-accent rounded-xl p-6 cursor-pointer bg-surface-secondary/40 hover:bg-surface-secondary/80 transition-colors">
                <FileText className="w-8 h-8 text-muted mb-2" />
                <span className="text-[13px] font-medium text-primary">
                  {file ? file.name : 'Sélectionnez un fichier (PDF, PNG, JPG)'}
                </span>
                <span className="text-[11px] text-subtle mt-1">10 Mo maximum</span>
                <input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {error && (
                <div className="p-3 bg-surface border border-danger text-danger rounded-lg text-[12px] flex items-start gap-2 shadow-dropdown">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-surface border border-success text-success rounded-lg text-[13px] flex items-center gap-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <span>Analyse réussie. Vérifiez les informations extraites :</span>
              </div>

              <div className="bg-surface-secondary/60 p-3.5 rounded-lg border border-default text-[13px] space-y-2 max-h-56 overflow-y-auto text-primary">
                <div>
                  <strong className="text-muted">Nom :</strong> {previewData.nom || 'Non détecté'}
                </div>
                <div>
                  <strong className="text-muted">Titre :</strong> {previewData.titre || 'Non détecté'}
                </div>
                <div>
                  <strong className="text-muted">Email :</strong> {previewData.contact?.email || 'Non détecté'}
                </div>
                {previewData.formations && previewData.formations.length > 0 && (
                  <div>
                    <strong className="text-muted">Formations ({previewData.formations.length}) :</strong>{' '}
                    {previewData.formations.map((f) => f.diplome).filter(Boolean).join(', ')}
                  </div>
                )}
                {previewData.experiences && previewData.experiences.length > 0 && (
                  <div>
                    <strong className="text-muted">Expériences ({previewData.experiences.length}) :</strong>{' '}
                    {previewData.experiences.map((e) => e.poste).filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-default flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-3.5 text-[13px] font-medium text-muted hover:text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer"
          >
            Annuler
          </button>

          {!previewData ? (
            <button
              type="button"
              disabled={!file || loading}
              onClick={handleStartImport}
              className="h-9 px-4 text-[13px] font-medium text-btn-primary bg-btn-primary hover:opacity-95 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-card"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Extraction en cours...' : 'Analyser le fichier'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmApply}
              className="h-9 px-4 text-[13px] font-medium text-btn-primary bg-btn-primary hover:opacity-95 rounded-lg transition-colors cursor-pointer shadow-card"
            >
              Pré-remplir le formulaire
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
