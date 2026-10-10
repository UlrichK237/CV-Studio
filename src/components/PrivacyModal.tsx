import React from 'react';
import { X, ShieldCheck, Database, Send, Lock, Trash2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData?: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Arrière-plan semi-transparent */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Conteneur de la modale */}
      <div className="relative w-full max-w-2xl bg-surface border border-default rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-default bg-surface-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-base font-semibold text-primary">
                Politique de confidentialité
              </h2>
              <p className="text-[12px] text-muted">
                Transparence complète sur le traitement et la protection de vos données
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-surface-secondary cursor-pointer transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-[13.5px] leading-relaxed text-primary">
          {/* Section 1 : Stockage local */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-semibold text-[14px]">
              <Database className="w-4 h-4 shrink-0" />
              <h3>1. Ce qui est stocké sur votre appareil (localement)</h3>
            </div>
            <p className="text-muted text-[13px]">
              Toutes les informations que vous saisissez dans le formulaire (nom, expériences, formations, compétences, coordonnées, choix visuels et lettre de motivation) sont enregistrées <strong>exclusivement dans la mémoire de votre navigateur web</strong> (via <code className="px-1.5 py-0.5 rounded bg-surface-secondary text-primary font-mono text-[12px]">localStorage</code>).
            </p>
            <p className="text-muted text-[13px]">
              Aucun compte utilisateur n'est créé, aucun mot de passe n'est demandé, et <strong>aucune base de données distante ne conserve votre CV</strong>. Vos données restent physiquement sur votre machine.
            </p>
          </div>

          {/* Section 2 : Utilisation des fonctions d'IA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent font-semibold text-[14px]">
              <Send className="w-4 h-4 shrink-0" />
              <h3>2. Ce qui est transmis au service d'IA (Google Gemini)</h3>
            </div>
            <p className="text-muted text-[13px]">
              L'utilisation des fonctionnalités d'IA est optionnelle et déclenchée uniquement par une action de votre part. Pour chaque fonction, seules les données strictement nécessaires sont transmises de manière chiffrée (HTTPS) et éphémère :
            </p>
            <ul className="space-y-2 pl-3 text-muted text-[13px]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>
                  <strong className="text-primary">Améliorer un texte :</strong> seul le paragraphe que vous demandez de reformuler (ex. profil ou description de poste) est envoyé.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>
                  <strong className="text-primary">Rédiger ou régénérer la lettre de motivation :</strong> le texte de l'offre d'emploi saisie et les éléments factuels de votre CV (formations, postes, compétences). <em>Règle stricte de confidentialité :</em> vos coordonnées personnelles (e-mail, téléphone et photo) sont <strong>systématiquement exclues</strong> de la requête et ne quittent jamais votre machine.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>
                  <strong className="text-primary">Importer un CV (PDF ou image) :</strong> uniquement le fichier sélectionné, pour analyse optique et extraction des champs de saisie. Le document n'est pas conservé après l'extraction.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 3 : Ce qui n'est jamais envoyé ni collecté */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-semibold text-[14px]">
              <Lock className="w-4 h-4 shrink-0" />
              <h3>3. Ce qui n'est JAMAIS envoyé ni collecté</h3>
            </div>
            <ul className="space-y-1.5 pl-3 text-muted text-[13px]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>Aucun traceur publicitaire, aucun cookie tiers, aucun outil de profilage commercial.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>Votre photo de profil n'est jamais envoyée lors de la rédaction de lettre.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>Aucun contenu de CV ni d'offre d'emploi n'est enregistré dans les journaux (logs) du serveur.</span>
              </li>
            </ul>
          </div>

          {/* Section 4 : Comment effacer ses données */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-semibold text-[14px]">
              <Trash2 className="w-4 h-4 shrink-0" />
              <h3>4. Comment effacer toutes vos données</h3>
            </div>
            <p className="text-muted text-[13px]">
              Puisque vos données résident exclusivement dans votre navigateur, vous gardez un contrôle total. Vous pouvez les supprimer à tout instant :
            </p>
            <ul className="space-y-1 pl-3 text-muted text-[13px]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>
                  En utilisant le bouton <strong>« Réinitialiser tout »</strong> accessible dans le menu « ... » de la barre supérieure.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>
                  Ou en vidant les cookies et données de site de votre navigateur pour ce domaine.
                </span>
              </li>
            </ul>
            {onResetData && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onResetData();
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-danger/40 text-danger hover:bg-danger/10 text-[12px] font-medium transition-colors cursor-pointer"
                >
                  Effacer immédiatement mes données locales
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pied de la modale */}
        <div className="px-6 py-3.5 border-t border-default bg-surface-secondary/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface border border-default hover:bg-surface-secondary text-primary font-medium text-[13px] cursor-pointer transition-colors shadow-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
