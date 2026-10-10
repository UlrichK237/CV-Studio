import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Loader2,
  FileText,
  Building,
  Briefcase,
  MapPin,
  Calendar,
  User,
  Sliders,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';
import { CVData, CoverLetterData, CVLang } from '../types';
import { LIMITS } from '../config/limits';
import {
  generateCoverLetter,
  regenerateLetterParagraph,
  subscribeToAICooldown,
  getAICooldownSeconds,
} from '../lib/ai';
import { CustomSelect } from './ui/CustomSelect';

interface CoverLetterFormProps {
  cv: CVData;
  letter: CoverLetterData;
  onChange: (updated: CoverLetterData) => void;
  lang: CVLang;
}

export const CoverLetterForm: React.FC<CoverLetterFormProps> = ({
  cv,
  letter,
  onChange,
  lang,
}) => {
  const [generating, setGenerating] = useState(false);
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(getAICooldownSeconds());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAICooldown((sec) => setCooldown(sec));
    return unsub;
  }, []);

  const updateLetterField = <K extends keyof CoverLetterData>(
    field: K,
    val: CoverLetterData[K]
  ) => {
    onChange({ ...letter, [field]: val });
  };

  const updateParagraph = (index: number, val: string) => {
    const updated = [...letter.paragraphes];
    updated[index] = val;
    updateLetterField('paragraphes', updated);
  };

  const addParagraph = () => {
    updateLetterField('paragraphes', [...letter.paragraphes, '']);
  };

  const removeParagraph = (index: number) => {
    const updated = letter.paragraphes.filter((_, idx) => idx !== index);
    updateLetterField('paragraphes', updated);
  };

  const handleGenerateFullLetter = async () => {
    if (!letter.offre?.trim()) {
      setError("Veuillez coller le texte de l'offre d'emploi avant de générer.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const generated = await generateCoverLetter(cv, letter.offre, {
        poste: letter.poste || cv.titre,
        entreprise: letter.entreprise,
        destinataire: letter.destinataire,
        ville: letter.ville,
        date: letter.date,
        ton: letter.ton,
        longueur: letter.longueur,
        pointsForts: letter.pointsForts,
        langue: lang,
      });

      onChange({
        ...letter,
        objet: generated.objet || letter.objet,
        formuleAppel: generated.formuleAppel || letter.formuleAppel,
        paragraphes: generated.paragraphes || letter.paragraphes,
        formulePolitesse: generated.formulePolitesse || letter.formulePolitesse,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la génération';
      setError(msg);
      setTimeout(() => setError(null), 7000);
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateParagraph = async (index: number) => {
    setRegeneratingIdx(index);
    setError(null);

    try {
      const newText = await regenerateLetterParagraph(
        index,
        letter.paragraphes[index] || '',
        cv,
        letter.offre,
        {
          poste: letter.poste || cv.titre,
          entreprise: letter.entreprise,
          ton: letter.ton,
          longueur: letter.longueur,
          ville: letter.ville,
          date: letter.date,
          langue: lang,
        }
      );
      updateParagraph(index, newText);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la régénération';
      setError(msg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setRegeneratingIdx(null);
    }
  };

  const isGeneratingDisabled = generating || cooldown > 0 || !letter.offre?.trim();

  const inputClass =
    'w-full h-10 px-3 bg-surface text-primary border border-default rounded-lg text-[14px] placeholder:text-subtle focus:border-accent transition-colors';
  const textareaClass =
    'w-full p-3 bg-surface text-primary border border-default rounded-lg text-[14px] leading-relaxed placeholder:text-subtle focus:border-accent transition-colors resize-y';
  const labelClass = 'text-[13px] font-medium text-primary select-none flex items-center gap-1';
  const charClass = 'text-[12px] tabular-nums text-subtle ml-auto';

  return (
    <div className="w-full max-w-[560px] mx-auto space-y-4">
      {/* 1. INFORMATIONS CIBLES DE LA CANDIDATURE */}
      <div className="bg-surface border border-default rounded-xl p-4 sm:p-5 space-y-4 transition-colors">
        <div className="flex items-center gap-3 pb-3 border-b border-default">
          <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-default flex items-center justify-center text-primary shrink-0">
            <Briefcase className="w-4 h-4 text-muted" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-primary">
              Opportunité ciblée
            </h3>
            <p className="text-[12px] text-muted">
              Renseignez l'offre pour adapter la lettre de motivation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass}>
                Poste visé <span className="text-subtle text-xs">*</span>
              </label>
              <span className={charClass}>
                {letter.poste.length} / {LIMITS.posteLettre}
              </span>
            </div>
            <input
              type="text"
              value={letter.poste}
              maxLength={LIMITS.posteLettre}
              onChange={(e) => updateLetterField('poste', e.target.value)}
              placeholder="Chef de projet digital"
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass}>
                Entreprise <span className="text-subtle text-xs">*</span>
              </label>
              <span className={charClass}>
                {letter.entreprise.length} / {LIMITS.entrepriseLettre}
              </span>
            </div>
            <input
              type="text"
              value={letter.entreprise}
              maxLength={LIMITS.entrepriseLettre}
              onChange={(e) => updateLetterField('entreprise', e.target.value)}
              placeholder="Groupe Atlas"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Destinataire (optionnel)</label>
            <input
              type="text"
              value={letter.destinataire}
              maxLength={LIMITS.destinataireLettre}
              onChange={(e) => updateLetterField('destinataire', e.target.value)}
              placeholder="Direction des RH"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Ville</label>
            <input
              type="text"
              value={letter.ville}
              maxLength={LIMITS.villeLettre}
              onChange={(e) => updateLetterField('ville', e.target.value)}
              placeholder="Paris"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Date</label>
            <input
              type="text"
              value={letter.date}
              onChange={(e) => updateLetterField('date', e.target.value)}
              placeholder="7 octobre 2026"
              className={inputClass}
            />
          </div>
        </div>

        {/* OFFRE D'EMPLOI À COLLER */}
        <div>
          <div className="flex items-center justify-between">
            <label className={labelClass}>
              Texte de l'offre d'emploi <span className="text-subtle text-xs">*</span>
            </label>
            <span className={charClass}>
              {letter.offre.length} / {LIMITS.offreEmploi}
            </span>
          </div>
          <textarea
            rows={4}
            value={letter.offre}
            maxLength={LIMITS.offreEmploi}
            onChange={(e) => updateLetterField('offre', e.target.value)}
            placeholder="Collez ici l'annonce ou la description du poste pour que l'IA adapte les arguments de la lettre..."
            className={textareaClass}
          />
        </div>

        {/* OPTIONS : TON & LONGUEUR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Ton de la lettre</label>
            <CustomSelect
              value={letter.ton}
              onChange={(val) =>
                updateLetterField('ton', val as 'Professionnel' | 'Dynamique' | 'Sobre')
              }
              options={[
                { value: 'Professionnel', label: 'Professionnel (Recommandé)' },
                { value: 'Dynamique', label: 'Dynamique & Entreprenant' },
                { value: 'Sobre', label: 'Sobre & Concis' },
              ]}
            />
          </div>

          <div>
            <label className={labelClass}>Longueur (1 page A4)</label>
            <CustomSelect
              value={letter.longueur}
              onChange={(val) =>
                updateLetterField('longueur', val as 'Courte' | 'Standard')
              }
              options={[
                { value: 'Standard', label: 'Standard (~300 mots)' },
                { value: 'Courte', label: 'Courte (~200 mots)' },
              ]}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className={labelClass}>Points clés à valoriser (optionnel)</label>
            <span className={charClass}>
              {letter.pointsForts.length} / {LIMITS.pointsFortsLettre}
            </span>
          </div>
          <input
            type="text"
            value={letter.pointsForts}
            maxLength={LIMITS.pointsFortsLettre}
            onChange={(e) => updateLetterField('pointsForts', e.target.value)}
            placeholder="Disponibilité immédiate, bilingue anglais, certification Scrum..."
            className={inputClass}
          />
        </div>

        {/* BOUTON GÉNÉRER LA LETTRE */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleGenerateFullLetter}
            disabled={isGeneratingDisabled}
            className={`w-full h-10 px-4 rounded-lg flex items-center justify-center gap-2 text-[14px] font-medium transition-colors cursor-pointer ${
              isGeneratingDisabled
                ? 'bg-surface-secondary text-subtle border border-default cursor-not-allowed opacity-60'
                : 'bg-btn-primary text-btn-primary hover:opacity-95 shadow-card'
            }`}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-current" />
                <span>Rédaction de votre lettre en cours...</span>
              </>
            ) : cooldown > 0 ? (
              <>
                <Clock className="w-4 h-4 text-warning" />
                <span>Attente requise ({cooldown}s)</span>
              </>
            ) : (
              <>
                <span className="text-[11px] font-semibold text-accent px-1.5 py-0.5 rounded bg-accent-soft">
                  IA
                </span>
                <span>Rédiger la lettre adaptée à l'offre</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-2.5 p-3 bg-surface border border-danger text-danger rounded-lg text-[12px] flex items-start gap-2 shadow-dropdown">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. ÉDITION DES PARAGRAPHES & STRUCTURE */}
      <div className="bg-surface border border-default rounded-xl p-4 sm:p-5 space-y-4 transition-colors">
        <div className="pb-3 border-b border-default">
          <h3 className="text-[14px] font-semibold text-primary">
            Corps du document
          </h3>
          <p className="text-[12px] text-muted">
            Modifiez chaque paragraphe manuellement ou demandez une reformulation
          </p>
        </div>

        {/* OBJET */}
        <div>
          <label className={labelClass}>Objet</label>
          <input
            type="text"
            value={letter.objet}
            onChange={(e) => updateLetterField('objet', e.target.value)}
            placeholder="Candidature au poste de..."
            className={`${inputClass} font-semibold`}
          />
        </div>

        {/* FORMULE D'APPEL */}
        <div>
          <label className={labelClass}>Formule d'appel</label>
          <input
            type="text"
            value={letter.formuleAppel}
            onChange={(e) => updateLetterField('formuleAppel', e.target.value)}
            placeholder="Madame, Monsieur,"
            className={inputClass}
          />
        </div>

        {/* PARAGRAPHES DU CORPS */}
        <div className="space-y-3">
          <label className={labelClass}>
            Paragraphes ({letter.paragraphes.length})
          </label>

          {letter.paragraphes.map((p, idx) => (
            <div
              key={idx}
              className="p-3 bg-surface-secondary/50 border border-default rounded-lg space-y-2 relative"
            >
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-muted">Paragraphe {idx + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={regeneratingIdx === idx || cooldown > 0}
                    onClick={() => handleRegenerateParagraph(idx)}
                    className="flex items-center gap-1 text-[11px] text-accent hover:underline font-medium cursor-pointer disabled:opacity-40"
                    title="Reformuler ce paragraphe avec l'IA"
                  >
                    {regeneratingIdx === idx ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    <span>Reformuler</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeParagraph(idx)}
                    className="p-1 text-muted hover:text-danger cursor-pointer"
                    title="Supprimer ce paragraphe"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={p}
                onChange={(e) => updateParagraph(idx, e.target.value)}
                placeholder="Rédigez le texte de ce paragraphe..."
                className={textareaClass}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addParagraph}
            className="w-full h-9 flex items-center justify-center gap-1.5 text-[13px] font-medium text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-muted" />
            <span>Ajouter un paragraphe</span>
          </button>
        </div>

        {/* FORMULE DE POLITESSE */}
        <div>
          <label className={labelClass}>Formule de politesse</label>
          <input
            type="text"
            value={letter.formulePolitesse}
            onChange={(e) => updateLetterField('formulePolitesse', e.target.value)}
            placeholder="Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};
