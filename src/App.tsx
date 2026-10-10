import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Mail,
  RotateCcw,
  Upload,
  Check,
  Eye,
  Edit3,
  ChevronDown,
  Printer,
  Download,
  Loader2,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';
import { CVData, CoverLetterData, ThemeMode } from './types';
import { APP_NAME } from './config/app';
import { SAMPLE_CV, EMPTY_CV, SAMPLE_LETTER, EMPTY_LETTER } from './data/sample';
import {
  loadSavedCV,
  saveCV,
  loadSavedLetter,
  saveLetter,
  loadSavedSettings,
  saveSettings,
  clearAllSavedData,
} from './lib/storage';
import { printDocument, generateImagePdf } from './lib/pdf';
import { CVForm } from './components/CVForm';
import { CoverLetterForm } from './components/CoverLetterForm';
import { DocumentPreview } from './components/DocumentPreview';
import { ConfirmModal } from './components/ConfirmModal';
import { CVImportModal } from './components/CVImportModal';
import { LandingPage } from './components/LandingPage';
import { ThemeMenu, ThemeChoice, applyTheme } from './components/ui/ThemeMenu';

export default function App() {
  // Vue active de l'application : 'landing' ou 'editor'
  const [currentView, setCurrentView] = useState<'landing' | 'editor'>('landing');

  // Données de l'application
  const [cv, setCv] = useState<CVData>(() => loadSavedCV());
  const [letter, setLetter] = useState<CoverLetterData>(() => loadSavedLetter());
  const [settings, setSettings] = useState(() => loadSavedSettings());

  // Gestion du thème
  useEffect(() => {
    applyTheme(settings.themeMode || 'system');
  }, [settings.themeMode]);

  // Indicateur de sauvegarde automatique
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Vue active sur mobile ('form' ou 'preview')
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Menus déroulants et modales
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fermeture des menus au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Détection des changements et debounce de sauvegarde (500 ms)
  useEffect(() => {
    setIsSaved(false);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveCV(cv);
      saveLetter(letter);
      saveSettings(settings);
      setIsSaved(true);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [cv, letter, settings]);

  const handleTabChange = (tab: 'cv' | 'lettre') => {
    setSettings((prev) => ({ ...prev, activeTab: tab }));
    if (tab === 'lettre' && !letter.poste && cv.titre) {
      setLetter((prev) => ({ ...prev, poste: cv.titre }));
    }
  };

  const handleResetAll = () => {
    clearAllSavedData();
    setCv(EMPTY_CV);
    setLetter(EMPTY_LETTER);
    setSettings((prev) => ({
      ...prev,
      compact: false,
      letterFontSize: 10,
    }));
    setShowResetConfirm(false);
    setIsMoreMenuOpen(false);
  };

  const handleLoadSample = () => {
    setCv(SAMPLE_CV);
    setLetter(SAMPLE_LETTER);
    setSettings((prev) => ({
      ...prev,
      palette: 'marine',
      template: 'moderne-bleu',
      lang: 'fr',
      compact: false,
      letterFontSize: 10,
    }));
    setIsMoreMenuOpen(false);
  };

  const handleImportSuccess = (imported: Partial<CVData>) => {
    setCv((prev) => ({
      ...prev,
      nom: imported.nom || prev.nom,
      titre: imported.titre || prev.titre,
      contact: {
        ...prev.contact,
        ...(imported.contact || {}),
      },
      profil: imported.profil || prev.profil,
      formations: imported.formations && imported.formations.length > 0 ? imported.formations : prev.formations,
      experiences: imported.experiences && imported.experiences.length > 0 ? imported.experiences : prev.experiences,
      competences: imported.competences && imported.competences.length > 0 ? imported.competences : prev.competences,
      langues: imported.langues && imported.langues.length > 0 ? imported.langues : prev.langues,
      centresInteret: imported.centresInteret || prev.centresInteret,
      projets: imported.projets && imported.projets.length > 0 ? imported.projets : prev.projets,
      certifications: imported.certifications && imported.certifications.length > 0 ? imported.certifications : prev.certifications,
    }));
  };

  const handleDownloadDirectPdf = async () => {
    setIsDownloading(true);
    const isLetter = settings.activeTab === 'lettre';
    const nomFichier = isLetter
      ? `Lettre_${cv.nom || 'Candidat'}`
      : `CV_${cv.nom || 'Candidat'}`;

    if (mobileTab === 'form' && typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileTab('preview');
      await new Promise((r) => setTimeout(r, 120));
    }

    const el = document.getElementById('cv-print-wrapper');
    if (el) {
      const res = await generateImagePdf(el, nomFichier, isLetter);
      if (!res.success) {
        printDocument(nomFichier, isLetter);
      }
    } else {
      printDocument(nomFichier, isLetter);
    }
    setIsDownloading(false);
    setIsDownloadMenuOpen(false);
  };

  const handleDownloadPdf = () => {
    const isLetter = settings.activeTab === 'lettre';
    const nomFichier = isLetter
      ? `Lettre_${cv.nom || 'Candidat'}`
      : `CV_${cv.nom || 'Candidat'}`;
    printDocument(nomFichier, isLetter);
    setIsDownloadMenuOpen(false);
  };

  if (currentView === 'landing') {
    return (
      <LandingPage
        onStart={(templateChoice) => {
          if (templateChoice) {
            setSettings((prev) => ({ ...prev, template: templateChoice }));
          }
          setCurrentView('editor');
        }}
        onLoadSample={() => {
          handleLoadSample();
          setCurrentView('editor');
        }}
        themeMode={settings.themeMode || 'system'}
        onThemeChange={(t: ThemeChoice) =>
          setSettings((prev) => ({ ...prev, themeMode: t }))
        }
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page text-primary font-sans antialiased selection:bg-accent-soft selection:text-accent">
      {/* 1. BARRE SUPÉRIEURE FINE (56 PX) */}
      <header className="no-print sticky top-0 z-40 h-14 bg-surface border-b border-default px-4 sm:px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-3">
          {/* GAUCHE : Logo + Onglets CV / Lettre */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer shrink-0"
              title="Retourner à l'accueil"
            >
              <div className="w-7 h-7 rounded-[6px] bg-accent text-accent-contrast flex items-center justify-center font-semibold text-[13px] tracking-tight shrink-0">
                CV
              </div>
              <span className="font-semibold text-[15px] tracking-tight text-primary hidden sm:inline">
                {APP_NAME}
              </span>
            </button>

            {/* Onglets CV / Lettre de motivation */}
            <div className="flex items-center bg-surface-secondary border border-default p-0.5 rounded-lg text-[13px]">
              <button
                type="button"
                onClick={() => handleTabChange('cv')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  settings.activeTab === 'cv'
                    ? 'bg-surface text-primary shadow-xs'
                    : 'text-muted hover:text-primary'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>CV</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('lettre')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  settings.activeTab === 'lettre'
                    ? 'bg-surface text-primary shadow-xs'
                    : 'text-muted hover:text-primary'
                }`}
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>Lettre</span>
              </button>
            </div>
          </div>

          {/* DROITE : Indicateur Enregistré, Thème, Menu Plus, Bouton Télécharger PDF */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Indicateur de sauvegarde discret */}
            <div className="hidden md:flex items-center gap-1.5 text-[12px] text-muted pr-2 border-r border-default">
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-success" />
                  <span>Enregistré</span>
                </>
              ) : (
                <span className="text-warning">Enregistrement...</span>
              )}
            </div>

            {/* Menu de thème (Système, Clair, Sombre) */}
            <ThemeMenu
              currentTheme={settings.themeMode || 'system'}
              onThemeChange={(t: ThemeChoice) =>
                setSettings((prev) => ({ ...prev, themeMode: t }))
              }
            />

            {/* Menu "Plus" */}
            <div ref={moreMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isMoreMenuOpen}
                aria-label="Options supplémentaires"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-default bg-surface text-muted hover:text-primary hover:bg-surface-secondary cursor-pointer transition-colors"
                title="Options supplémentaires"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isMoreMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-1.5 w-48 bg-surface border border-default rounded-xl shadow-dropdown py-1 z-50 text-[13px]"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      handleLoadSample();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-primary hover:bg-surface-secondary cursor-pointer text-left"
                  >
                    <span>Charger l'exemple</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowImportModal(true);
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-primary hover:bg-surface-secondary cursor-pointer text-left"
                  >
                    <Upload className="w-3.5 h-3.5 text-muted" />
                    <span>Importer un CV</span>
                  </button>

                  <div className="my-1 border-t border-default" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowResetConfirm(true);
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-danger hover:bg-danger/5 cursor-pointer text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser tout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bouton principal Télécharger le CV/Lettre avec sous-menu pour impression */}
            <div ref={downloadMenuRef} className="relative flex items-center">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="h-9 pl-3.5 pr-2.5 text-[13px] font-medium text-btn-primary bg-btn-primary hover:opacity-95 rounded-l-lg shadow-card flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-75"
                title="Télécharger le PDF (vectoriel recommandé)"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isDownloading
                    ? 'Téléchargement...'
                    : settings.activeTab === 'lettre'
                    ? 'Télécharger la lettre'
                    : 'Télécharger le CV'}
                </span>
                <span className="sm:hidden">
                  {isDownloading ? 'PDF...' : 'Télécharger'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isDownloadMenuOpen}
                aria-label="Options de téléchargement"
                className="h-9 px-2 text-btn-primary bg-btn-primary hover:opacity-90 border-l border-white/20 rounded-r-lg shadow-card cursor-pointer transition-colors flex items-center justify-center"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isDownloadMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1.5 w-72 bg-surface border border-default rounded-xl shadow-dropdown py-1.5 z-50 text-[13px]"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      handleDownloadPdf();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-primary hover:bg-surface-secondary cursor-pointer text-left font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Printer className="w-4 h-4 text-accent shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">PDF (texte sélectionnable)</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                            Recommandé
                          </span>
                        </div>
                        <div className="text-[11px] text-muted font-normal mt-0.5">Format A4 vectoriel net et indexable</div>
                      </div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-default" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      handleDownloadDirectPdf();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-primary hover:bg-surface-secondary cursor-pointer text-left font-medium transition-colors"
                  >
                    <Download className="w-4 h-4 text-muted shrink-0" />
                    <div>
                      <div className="font-semibold text-primary">PDF image (copie exacte de l'aperçu)</div>
                      <div className="text-[11px] text-muted font-normal mt-0.5">Rendu pixel-perfect haute résolution</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. CONTENU PRINCIPAL EN DEUX PANNEAUX (DESKTOP) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-stretch min-h-0">
        {/* PANNEAU GAUCHE : FORMULAIRE (LARGEUR MAX 560 PX) */}
        <section
          className={`lg:w-1/2 flex flex-col ${
            mobileTab === 'form' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="pb-24 lg:pb-6">
            {settings.activeTab === 'cv' ? (
              <CVForm
                data={cv}
                onChange={setCv}
                lang={settings.lang}
              />
            ) : (
              <CoverLetterForm
                cv={cv}
                letter={letter}
                onChange={setLetter}
                lang={settings.lang}
              />
            )}
          </div>
        </section>

        {/* PANNEAU DROIT : APERÇU STICKY DU DOCUMENT A4 */}
        <section
          className={`lg:w-1/2 flex flex-col h-[calc(100vh-80px)] lg:sticky lg:top-[72px] ${
            mobileTab === 'preview' ? 'block h-[82vh]' : 'hidden lg:flex'
          }`}
        >
          <DocumentPreview
            cv={cv}
            letter={letter}
            activeTab={settings.activeTab}
            paletteId={settings.palette}
            onPaletteChange={(p) => setSettings((s) => ({ ...s, palette: p }))}
            customHex={settings.customHex}
            onCustomHexChange={(hex) => setSettings((s) => ({ ...s, customHex: hex }))}
            templateId={settings.template}
            onTemplateChange={(t) => setSettings((s) => ({ ...s, template: t }))}
            lang={settings.lang}
            onLangChange={(l) => setSettings((s) => ({ ...s, lang: l }))}
            compact={settings.compact}
            onCompactToggle={() => setSettings((s) => ({ ...s, compact: !s.compact }))}
            spacingMode={settings.spacingMode || 'remplir'}
            onSpacingModeChange={(mode) => setSettings((s) => ({ ...s, spacingMode: mode }))}
            showPhotoInATS={Boolean(settings.showPhotoInATS)}
            onTogglePhotoInATS={() =>
              setSettings((s) => ({ ...s, showPhotoInATS: !s.showPhotoInATS }))
            }
            letterFontSize={settings.letterFontSize ?? 10}
            onLetterFontSizeChange={(size) =>
              setSettings((s) => ({ ...s, letterFontSize: size }))
            }
          />
        </section>
      </main>

      {/* 3. BARRE D'ONGLETS INFÉRIEURE POUR MOBILE */}
      <div className="no-print no-fullscreen lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-default px-6 py-2 flex items-center justify-around shadow-card">
        <button
          type="button"
          onClick={() => setMobileTab('form')}
          className={`flex flex-col items-center gap-1 text-[12px] font-medium transition-colors cursor-pointer ${
            mobileTab === 'form' ? 'text-accent' : 'text-muted hover:text-primary'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Formulaire</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex flex-col items-center gap-1 text-[12px] font-medium transition-colors cursor-pointer ${
            mobileTab === 'preview' ? 'text-accent' : 'text-muted hover:text-primary'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Aperçu</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadDirectPdf}
          disabled={isDownloading}
          className="flex flex-col items-center gap-1 text-[12px] font-medium transition-colors cursor-pointer disabled:opacity-75"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
          ) : (
            <Download className="w-4 h-4 text-accent" />
          )}
          <span className="text-accent">{isDownloading ? 'Export...' : 'Télécharger'}</span>
        </button>
      </div>

      {/* 4. MODALE DE RÉINITIALISATION */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Réinitialiser l'application"
        message="Êtes-vous sûr de vouloir effacer toutes vos informations ? Les données du CV et de la lettre seront réinitialisées."
        confirmLabel="Tout effacer"
        cancelLabel="Annuler"
        isDestructive={true}
        onConfirm={handleResetAll}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* 5. MODALE D'IMPORTATION DE CV */}
      <CVImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
