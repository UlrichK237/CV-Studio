import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  Download,
  Loader2,
  AlertTriangle,
  Layers,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
  Check,
  Camera,
  FileCheck,
} from 'lucide-react';
import {
  CVData,
  CoverLetterData,
  PaletteId,
  TemplateId,
  CVLang,
  SpacingMode,
} from '../types';
import { PALETTES, getResolvedPalette } from '../config/palettes';
import { TEMPLATES_CATALOG } from '../config/templates';
import { REQUIRED_FIELDS } from '../config/limits';
import { printDocument, generateImagePdf } from '../lib/pdf';
import { PaperDocument, PaperDocumentProps } from './PaperDocument';
import { FullscreenPreview } from './FullscreenPreview';
import { MissingFieldsModal } from './MissingFieldsModal';
import { TemplatePickerModal } from './TemplatePickerModal';
import { SegmentedControl } from './ui/SegmentedControl';
import { CustomSelect } from './ui/CustomSelect';

interface DocumentPreviewProps {
  cv: CVData;
  letter: CoverLetterData;
  activeTab: 'cv' | 'lettre';
  paletteId: PaletteId;
  onPaletteChange: (p: PaletteId) => void;
  customHex?: string;
  onCustomHexChange?: (hex: string) => void;
  templateId: TemplateId;
  onTemplateChange: (t: TemplateId) => void;
  lang: CVLang;
  onLangChange: (l: CVLang) => void;
  compact: boolean;
  onCompactToggle: () => void;
  spacingMode?: SpacingMode;
  onSpacingModeChange?: (mode: SpacingMode) => void;
  showPhotoInATS: boolean;
  onTogglePhotoInATS: () => void;
  letterFontSize?: number;
  onLetterFontSizeChange?: (size: number) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  cv,
  letter,
  activeTab,
  paletteId,
  onPaletteChange,
  customHex = '#1F2E55',
  onCustomHexChange,
  templateId,
  onLangChange,
  onTemplateChange,
  lang,
  compact,
  spacingMode = 'remplir',
  onSpacingModeChange,
  showPhotoInATS,
  onTogglePhotoInATS,
  letterFontSize = 10,
  onLetterFontSizeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  const [autoScale, setAutoScale] = useState<number>(0.8);
  const [customZoom, setCustomZoom] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [exportingImagePdf, setExportingImagePdf] = useState<boolean>(false);
  const [missingModalOpen, setMissingModalOpen] = useState<boolean>(false);
  const [missingFieldsList, setMissingFieldsList] = useState<string[]>([]);
  const [pendingExportType, setPendingExportType] = useState<'print' | 'image' | null>(null);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState<boolean>(false);
  const [isPalettePopoverOpen, setIsPalettePopoverOpen] = useState<boolean>(false);
  const [showPrintGuideModal, setShowPrintGuideModal] = useState<boolean>(false);
  const [dontShowPrintGuideAgain, setDontShowPrintGuideAgain] = useState<boolean>(false);

  const colorPopoverRef = useRef<HTMLDivElement>(null);

  // Fermeture du popover couleur au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (colorPopoverRef.current && !colorPopoverRef.current.contains(e.target as Node)) {
        setIsPalettePopoverOpen(false);
      }
    }
    if (isPalettePopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPalettePopoverOpen]);

  // Résolution de la palette (preset ou personnalisée)
  const currentPalette = getResolvedPalette(paletteId, customHex);

  // Redimensionnement automatique selon le conteneur
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.clientWidth - 48; // marges
      const a4WidthPx = 794; // ~210mm à 96 DPI
      if (containerWidth > 0) {
        const computed = Math.min(containerWidth / a4WidthPx, 1);
        setAutoScale(Math.max(computed, 0.35));
      }
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const currentScale = customZoom ?? autoScale;

  const handleZoomIn = () => {
    setCustomZoom((prev) => {
      const base = prev ?? autoScale;
      return Math.min(1.5, Math.round((base + 0.1) * 10) / 10);
    });
  };

  const handleZoomOut = () => {
    setCustomZoom((prev) => {
      const base = prev ?? autoScale;
      return Math.max(0.35, Math.round((base - 0.1) * 10) / 10);
    });
  };

  const handleResetZoom = () => {
    setCustomZoom(null);
  };

  // Détection du débordement d'une page A4 (297mm = 1123px)
  useEffect(() => {
    const checkOverflow = () => {
      if (documentRef.current) {
        const pageEl = documentRef.current.querySelector('.a4-page') as HTMLElement;
        if (pageEl) {
          const maxAllowedPx = 1123;
          setIsOverflowing(pageEl.scrollHeight > maxAllowedPx + 8);
        }
      }
    };
    const timer = setTimeout(checkOverflow, 250);
    return () => clearTimeout(timer);
  }, [cv, letter, activeTab, templateId, spacingMode, compact, letterFontSize]);

  const validateRequiredFields = () => {
    const missing: string[] = [];
    if (activeTab === 'cv') {
      REQUIRED_FIELDS.forEach((rf) => {
        if (!rf.check(cv)) {
          missing.push(rf.label);
        }
      });
    } else {
      if (!letter.poste?.trim()) missing.push('Poste visé');
      if (!letter.entreprise?.trim()) missing.push('Entreprise');
      if (!letter.offre?.trim()) missing.push("Texte de l'offre d'emploi");
    }
    return missing;
  };

  const handleTriggerExport = (type: 'print' | 'image') => {
    const missing = validateRequiredFields();
    if (missing.length > 0) {
      setMissingFieldsList(missing);
      setPendingExportType(type);
      setMissingModalOpen(true);
      return;
    }

    if (type === 'print') {
      let isHidden = false;
      try {
        isHidden = localStorage.getItem('hide_print_guide') === '1';
      } catch {
        // ignore
      }
      if (!isHidden) {
        setShowPrintGuideModal(true);
        return;
      }
    }

    executeExport(type);
  };

  const proceedWithPrint = () => {
    executeExport('print');
  };

  const executeExport = async (type: 'print' | 'image') => {
    const isLetter = activeTab === 'lettre';
    const nomFichier = isLetter
      ? `Lettre_Motivation_${cv.nom || 'Candidat'}`
      : `CV_${cv.nom || 'Candidat'}`;
    const docName = nomFichier.trim().replace(/\s+/g, '_');

    if (type === 'print') {
      await printDocument(docName, isLetter);
    } else {
      const targetElement =
        (document.getElementById('print-root')?.firstElementChild as HTMLElement) ||
        document.getElementById('cv-print-wrapper') ||
        documentRef.current;
      if (!targetElement) return;
      setExportingImagePdf(true);
      const res = await generateImagePdf(targetElement, docName, isLetter);
      if (!res.success) {
        await printDocument(docName, isLetter);
      }
      setExportingImagePdf(false);
    }
  };

  const handleProceedWithMissing = () => {
    setMissingModalOpen(false);
    if (pendingExportType) {
      if (pendingExportType === 'print') {
        let isHidden = false;
        try {
          isHidden = localStorage.getItem('hide_print_guide') === '1';
        } catch {
          // ignore
        }
        if (!isHidden) {
          setShowPrintGuideModal(true);
          setPendingExportType(null);
          return;
        }
      }
      executeExport(pendingExportType);
      setPendingExportType(null);
    }
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    if (onCustomHexChange) onCustomHexChange(newHex);
    onPaletteChange('custom');
  };

  // Props universelles transmises au PaperDocument unique
  const documentProps: PaperDocumentProps = {
    cv,
    letter,
    activeTab,
    palette: currentPalette,
    templateId,
    lang,
    compact,
    spacingMode,
    showPhotoInATS,
    letterFontSize,
  };

  const selectedTemplateInfo = TEMPLATES_CATALOG.find((t) => t.id === templateId);

  const templateOptions = TEMPLATES_CATALOG.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const spacingOptions = [
    { value: 'remplir', label: 'Remplir A4' },
    { value: 'normal', label: 'Équilibré' },
    { value: 'spacious', label: 'Spacieux' },
    { value: 'compact', label: 'Compact' },
  ];

  return (
    <div className="flex flex-col h-full bg-surface border border-default rounded-xl shadow-card overflow-hidden transition-colors">
      {/* 1. INSTANCE HORS-ÉCRAN DE #print-root (PORTAL VERS document.body)
          Rendu à l'échelle 1 sans transform de zoom, partagé entre export vectoriel et export image */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="print-root">
            <PaperDocument {...documentProps} />
          </div>,
          document.body
        )}

      {/* BARRE D'OUTILS SUR UNE LIGNE MAXIMUM SUR GRAND ÉCRAN */}
      <div className="px-3.5 py-2.5 bg-surface border-b border-default flex items-center gap-2 flex-wrap shrink-0">
        {activeTab === 'cv' && (
            <>
              {/* Sélecteur de modèle personnalisé */}
              <div className="w-44">
                <CustomSelect
                  dense
                  value={templateId}
                  onChange={(val) => onTemplateChange(val as TemplateId)}
                  options={templateOptions}
                />
              </div>

              {/* Bouton Galerie */}
              <button
                type="button"
                onClick={() => setIsTemplatePickerOpen(true)}
                className="h-9 px-2.5 flex items-center gap-1.5 text-[12px] font-medium text-muted hover:text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors"
                title="Parcourir la galerie des modèles"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Galerie</span>
              </button>

              {/* Photo ATS option */}
              {templateId === 'classique-ats' && (
                <button
                  type="button"
                  onClick={onTogglePhotoInATS}
                  className={`h-9 px-2.5 flex items-center gap-1 text-[12px] rounded-lg border cursor-pointer transition-colors ${
                    showPhotoInATS
                      ? 'bg-accent-soft text-accent border-accent/40 font-medium'
                      : 'bg-surface text-muted border-default hover:bg-surface-secondary'
                  }`}
                  title="Afficher ou masquer la photo dans le modèle ATS"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Photo</span>
                </button>
              )}
            </>
          )}

          {/* Bouton Couleur ouvrant un Popover nuancier */}
          <div ref={colorPopoverRef} className="relative">
            <button
              type="button"
              onClick={() => setIsPalettePopoverOpen((prev) => !prev)}
              aria-haspopup="dialog"
              aria-expanded={isPalettePopoverOpen}
              className="h-9 px-2.5 flex items-center gap-2 text-[12px] font-medium text-primary bg-surface border border-default hover:bg-surface-secondary rounded-lg cursor-pointer transition-colors"
              title="Choisir la couleur d'accent du document"
            >
              <span
                className="w-4 h-4 rounded-full ring-1 ring-black/20 dark:ring-white/40 border border-white/60 dark:border-black/40 shadow-xs shrink-0"
                style={{ backgroundColor: currentPalette.fonce }}
              />
              <span>Couleur</span>
            </button>

            {isPalettePopoverOpen && (
              <div className="absolute z-50 left-0 mt-1.5 w-64 bg-surface border border-default rounded-xl shadow-dropdown p-3 space-y-3">
                <div className="flex items-center justify-between text-[12px] font-semibold text-primary pb-1 border-b border-default">
                  <span>Nuances du document</span>
                  <button
                    type="button"
                    onClick={() => setIsPalettePopoverOpen(false)}
                    className="text-muted hover:text-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Grille de pastilles de couleurs */}
                <div className="grid grid-cols-6 gap-2">
                  {Object.entries(PALETTES).map(([key, pal]) => {
                    const isSelected = paletteId === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          onPaletteChange(key as PaletteId);
                        }}
                        className={`w-7 h-7 rounded-md border flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                          isSelected ? 'ring-2 ring-accent border-transparent' : 'border-default'
                        }`}
                        style={{ backgroundColor: pal.fonce }}
                        title={pal.name}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Couleur hexadécimale sur-mesure */}
                <div className="pt-2 border-t border-default space-y-1.5">
                  <span className="text-[11px] font-medium text-muted block">
                    Couleur personnalisée (Hex) :
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentPalette.fonce.startsWith('#') ? currentPalette.fonce : customHex}
                      onChange={handleCustomColorChange}
                      className="w-8 h-8 rounded border border-default cursor-pointer p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={currentPalette.fonce.startsWith('#') ? currentPalette.fonce : customHex}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (onCustomHexChange) onCustomHexChange(val);
                        onPaletteChange('custom');
                      }}
                      className="h-8 px-2 w-full text-[12px] bg-surface text-primary border border-default rounded-md uppercase"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Densité d'espacement pour le CV */}
          {activeTab === 'cv' && (
            <div className="w-32">
              <CustomSelect
                dense
                value={spacingMode}
                onChange={(val) => onSpacingModeChange?.(val as SpacingMode)}
                options={spacingOptions}
              />
            </div>
          )}

          {/* Choix de la taille de police pour la lettre de motivation (10 à 13 pt, pas de 0.5 pt) */}
          {activeTab === 'lettre' && (
            <div
              className="flex items-center bg-surface border border-default rounded-lg h-9 px-1 gap-1 text-[12px]"
              title="Taille d'écriture de la lettre (10 à 13 pt)"
            >
              <span className="text-[11px] font-medium text-muted pl-1.5 pr-0.5 hidden sm:inline">
                Taille :
              </span>
              <button
                type="button"
                onClick={() =>
                  onLetterFontSizeChange?.(
                    Math.max(10, Math.round((letterFontSize - 0.5) * 10) / 10)
                  )
                }
                disabled={letterFontSize <= 10}
                aria-label="Réduire la taille du texte"
                title="Réduire la taille du texte"
                className="w-7 h-7 flex items-center justify-center rounded text-muted hover:text-primary hover:bg-surface-secondary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-[12px]"
              >
                A-
              </button>
              <span className="min-w-12 text-center font-semibold text-primary tabular-nums text-[12px]">
                {letterFontSize % 1 === 0 ? `${letterFontSize} pt` : `${letterFontSize.toFixed(1)} pt`}
              </span>
              <button
                type="button"
                onClick={() =>
                  onLetterFontSizeChange?.(
                    Math.min(13, Math.round((letterFontSize + 0.5) * 10) / 10)
                  )
                }
                disabled={letterFontSize >= 13}
                aria-label="Augmenter la taille du texte"
                title="Augmenter la taille du texte"
                className="w-7 h-7 flex items-center justify-center rounded text-muted hover:text-primary hover:bg-surface-secondary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-[12px]"
              >
                A+
              </button>
            </div>
          )}

          {/* Sélecteur de langue SegmentedControl FR / EN */}
          <SegmentedControl
            dense
            value={lang}
            onChange={(l) => onLangChange(l as CVLang)}
            options={[
              { value: 'fr', label: 'FR' },
              { value: 'en', label: 'EN' },
            ]}
          />
      </div>

      {/* AVERTISSEMENT DE DÉBORDEMENT DISCRET */}
      {isOverflowing && (
        <div className="bg-surface-secondary border-b border-warning/40 px-3.5 py-1.5 flex items-center justify-between text-[12px] text-warning shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
            <span>
              {activeTab === 'lettre'
                ? 'La lettre dépasse une page à cette taille. Réduisez la taille du texte ou raccourcissez la lettre.'
                : 'Le contenu dépasse 1 page A4 (297 mm). Ajustez la longueur ou le mode compact.'}
            </span>
          </div>
          {activeTab === 'cv' && spacingMode !== 'compact' && onSpacingModeChange && (
            <button
              type="button"
              onClick={() => onSpacingModeChange('compact')}
              className="px-2 py-0.5 text-[11px] font-medium border border-warning/50 rounded hover:bg-warning/10 cursor-pointer shrink-0"
            >
              Passer en compact
            </button>
          )}
        </div>
      )}

      {/* TABLE DE TRAVAIL (ZONE DERRIÈRE LA FEUILLE D'APERÇU) */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-6 relative select-none bg-workspace transition-colors"
      >
        <div
          style={{
            width: `${794 * currentScale}px`,
            height: `${1123 * currentScale}px`,
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            id="cv-print-wrapper"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '794px',
              height: '1123px',
              transform: `scale(${currentScale})`,
              transformOrigin: 'top left',
              transition: 'transform 0.14s ease-out',
            }}
            className="shrink-0 shadow-paper rounded-xs bg-white"
          >
            <div ref={documentRef}>
              <PaperDocument {...documentProps} />
            </div>
          </div>
        </div>
      </div>

      {/* COMMANDES DE ZOOM REGROUPÉES EN BAS DU PANNEAU EN PETITE TAILLE */}
      <div className="px-3 py-1.5 bg-surface border-t border-default flex items-center justify-between text-[12px] text-muted shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-7 h-7 flex items-center justify-center rounded border border-default bg-surface hover:bg-surface-secondary text-primary cursor-pointer"
            title="Zoomer arrière (-10%)"
            aria-label="Zoom arrière"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-12 text-center text-[12px] font-medium text-primary tabular-nums">
            {Math.round(currentScale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-7 h-7 flex items-center justify-center rounded border border-default bg-surface hover:bg-surface-secondary text-primary cursor-pointer"
            title="Zoomer avant (+10%)"
            aria-label="Zoom avant"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className={`px-2 h-7 rounded text-[11px] font-medium border transition-colors cursor-pointer ml-1 ${
              customZoom === null
                ? 'bg-accent-soft text-accent border-accent/30'
                : 'bg-surface text-muted border-default hover:text-primary hover:bg-surface-secondary'
            }`}
          >
            Ajuster
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-subtle hidden sm:inline">
            A4 (210 × 297 mm)
          </span>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="h-7 px-2 flex items-center gap-1 rounded text-[11px] font-medium text-muted hover:text-primary bg-surface border border-default hover:bg-surface-secondary cursor-pointer"
            title="Inspecter en plein écran"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Plein écran</span>
          </button>
        </div>
      </div>

      {/* MODALE PLEIN ÉCRAN OPTIMISÉE SANS AUCUNE BARRE QUI COUPE LE CV */}
      {isFullscreen && (
        <FullscreenPreview
          title={activeTab === 'lettre' ? 'Lettre de motivation — Plein écran' : 'Aperçu du CV — Plein écran'}
          templateName={selectedTemplateInfo?.name || 'Modèle A4'}
          onClose={() => setIsFullscreen(false)}
        >
          <PaperDocument {...documentProps} />
        </FullscreenPreview>
      )}

      {/* MODALE D'AIDE POUR L'IMPRESSION VECTORIELLE A4 STRICTE */}
      {showPrintGuideModal && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100001] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-surface border border-default rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-primary">Télécharger le PDF vectoriel</h3>
                  <p className="text-[12px] text-muted">Format A4 fidèle, texte net et sélectionnable</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintGuideModal(false)}
                className="text-muted hover:text-primary cursor-pointer p-1"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-surface-secondary border border-default rounded-xl p-3.5 space-y-2 text-[12.5px] text-primary">
              <p className="font-medium text-accent">Dans la fenêtre d'impression :</p>
              <ul className="space-y-1.5 text-muted pl-4 list-disc text-[12px]">
                <li><strong>Destination :</strong> « Enregistrer au format PDF »</li>
                <li><strong>Format :</strong> A4</li>
                <li><strong>Marges :</strong> « Aucune » (ou 0 mm)</li>
                <li><strong>Échelle :</strong> 100 %</li>
                <li><strong>Options :</strong> Décocher « En-têtes et pieds de page »</li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-[12px] text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowPrintGuideAgain}
                  onChange={(e) => setDontShowPrintGuideAgain(e.target.checked)}
                  className="rounded border-default text-accent focus:ring-accent cursor-pointer"
                />
                <span>Ne plus afficher cette aide</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowPrintGuideModal(false);
                  if (dontShowPrintGuideAgain) {
                    try {
                      localStorage.setItem('hide_print_guide', '1');
                    } catch {
                      // ignore
                    }
                  }
                  proceedWithPrint();
                }}
                className="px-4 py-2 bg-btn-primary text-btn-primary rounded-xl text-[13px] font-medium hover:opacity-95 cursor-pointer shadow-sm transition-opacity"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODALE GALERIE VISUELLE */}
      <TemplatePickerModal
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        selectedTemplate={templateId}
        onSelectTemplate={onTemplateChange}
      />

      {/* MODAL DE SIGNALEMENT DES CHAMPS OBLIGATOIRES MANQUANTS */}
      <MissingFieldsModal
        isOpen={missingModalOpen}
        missingFields={missingFieldsList}
        onClose={() => {
          setMissingModalOpen(false);
          setPendingExportType(null);
        }}
        onProceed={handleProceedWithMissing}
      />
    </div>
  );
};
