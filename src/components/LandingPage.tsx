import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Check,
  X as XIcon,
  Play,
  Pause,
} from 'lucide-react';
import { TemplateId, ThemeMode } from '../types';
import { TEMPLATES_CATALOG, TemplateMetadata } from '../config/templates';
import { SAMPLE_CV, SAMPLE_LETTER } from '../data/sample';
import { PALETTES } from '../config/palettes';
import { ThemeMenu, ThemeChoice } from './ui/ThemeMenu';
import {
  HERO_VIDEO_MP4,
  HERO_VIDEO_WEBM,
  HERO_POSTER,
  HERO_OVERLAY_OPACITY,
} from '../config/media';
import { ModerneBleu } from '../templates/ModerneBleu';
import { CanvaCreatifSidebar } from '../templates/CanvaCreatifSidebar';
import { CanvaElegantHeader } from '../templates/CanvaElegantHeader';
import { CanvaMinimaliste } from '../templates/CanvaMinimaliste';
import { CanvaCadres } from '../templates/CanvaCadres';
import { CanvaArche } from '../templates/CanvaArche';
import { CanvaVague } from '../templates/CanvaVague';
import { CanvaGeometrique } from '../templates/CanvaGeometrique';
import { CanvaExecutif } from '../templates/CanvaExecutif';
import { ClassiqueATS } from '../templates/ClassiqueATS';
import { LettreTemplate } from '../templates/Lettre';
import { PrivacyModal } from './PrivacyModal';

interface LandingPageProps {
  onStart: (template?: TemplateId) => void;
  onLoadSample: () => void;
  themeMode: ThemeMode;
  onThemeChange: (theme: ThemeChoice) => void;
}

/**
 * Composant de vignette A4 dynamique :
 * Calcule avec exactitude l'échelle nécessaire pour que la feuille 210 × 297 mm
 * remplisse 100 % du conteneur sans débordement ni bande blanche latérale.
 */
const TemplateThumbnail: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.25);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const computeScale = () => {
      // 210mm = 793.7px à 96 DPI standard
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / 793.7);
      }
    };

    computeScale();
    const ro = new ResizeObserver(computeScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[210/297] bg-white border border-default group-hover:border-accent rounded-lg overflow-hidden shadow-card transition-colors"
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '210mm',
          height: '297mm',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onLoadSample,
  themeMode,
  onThemeChange,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const defaultPalette = PALETTES.marine;

  const renderTemplateSample = (id: TemplateId) => {
    switch (id) {
      case 'moderne-bleu':
        return <ModerneBleu data={SAMPLE_CV} palette={defaultPalette} lang="fr" />;
      case 'canva-sidebar':
        return <CanvaCreatifSidebar data={SAMPLE_CV} palette={defaultPalette} lang="fr" />;
      case 'canva-elegant':
        return <CanvaElegantHeader data={SAMPLE_CV} palette={defaultPalette} lang="fr" />;
      case 'canva-minimaliste':
        return <CanvaMinimaliste data={SAMPLE_CV} palette={defaultPalette} lang="fr" />;
      case 'canva-cadres':
        return <CanvaCadres data={SAMPLE_CV} palette={defaultPalette} lang="fr" />;
      case 'canva-arche':
        return <CanvaArche data={SAMPLE_CV} palette={defaultPalette} lang="fr" />;
      case 'canva-vague':
        return <CanvaVague data={SAMPLE_CV} palette={defaultPalette} lang="fr" />;
      case 'canva-geometrique':
        return <CanvaGeometrique data={SAMPLE_CV} palette={defaultPalette} lang="fr" />;
      case 'canva-executif':
        return <CanvaExecutif data={SAMPLE_CV} palette={defaultPalette} lang="fr" />;
      case 'classique-ats':
      default:
        return <ClassiqueATS data={SAMPLE_CV} palette={defaultPalette} lang="fr" showPhoto={false} />;
    }
  };

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const faqs = [
    {
      q: 'Le PDF téléchargé contient-il du texte sélectionnable ?',
      a: "Oui. Le téléchargement principal utilise le moteur d'impression vectorielle de votre navigateur, générant un PDF A4 avec texte 100 % sélectionnable, indexable par les moteurs de recherche et conforme aux lecteurs d'écran.",
    },
    {
      q: 'Où sont enregistrées mes données personnelles ?',
      a: "Vos données de CV sont enregistrées exclusivement dans la mémoire locale de votre navigateur (localStorage). Aucun compte utilisateur n'est requis et aucun stockage persistant n'existe sur nos serveurs. Lorsque vous sollicitez une fonction d'IA (amélioration de texte, lettre de motivation ou import), seuls les éléments nécessaires sont transmis de manière éphémère et chiffrée au fournisseur d'IA (Google Gemini) sans être conservés.",
    },
    {
      q: "L'application prend-elle en charge les candidatures en anglais ?",
      a: 'Oui. Un sélecteur FR / EN permet de basculer instantanément les intitulés fixes du document (expériences, formations, compétences, coordonnées) en anglais ou en français.',
    },
    {
      q: 'Mon CV tient-il rigoureusement sur une seule page A4 ?',
      a: "Chaque modèle est calibré pour le format strict 210 × 297 mm. L'éditeur dispose d'un détecteur de débordement et d'options d'ajustement (standard, compact ou espacé) pour garantir un rendu parfait sur une feuille.",
    },
  ];

  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isOverHero, setIsOverHero] = useState<boolean>(true);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);

  // État de lecture initial prenant en compte prefers-reduced-motion, saveData et le choix mémorisé
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    if (typeof navigator !== 'undefined') {
      const nav = navigator as any;
      if (
        nav.connection?.saveData ||
        nav.connection?.effectiveType === 'slow-2g' ||
        nav.connection?.effectiveType === '2g'
      ) {
        return false;
      }
    }
    try {
      const saved = localStorage.getItem('cvstudio_hero_video_paused');
      if (saved === 'true') return false;
      if (saved === 'false') return true;
    } catch (e) {}
    return true;
  });

  // 1. Détection dynamique précise : l'en-tête reste transparent tant que le hero est visible derrière lui (56px)
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      // L'en-tête mesure 56px de haut. Tant que le bas du hero se trouve à plus de 56px du sommet, on est au-dessus du hero.
      setIsOverHero(rect.bottom > 56);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // 2. Observer pour la mise en pause automatique quand le hero quitte le viewport
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          if (isPlaying) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [isPlaying]);

  // 3. Vérification immédiate si la vidéo est déjà chargée
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setIsVideoReady(true);
    }
  }, []);

  // 4. Gestion de la visibilité de l'onglet (visibilitychange)
  useEffect(() => {
    const handleVisibility = () => {
      if (!videoRef.current) return;
      if (document.hidden) {
        videoRef.current.pause();
      } else if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isPlaying]);

  // Bascule manuelle de lecture/pause avec mémorisation dans localStorage
  const togglePlayback = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('cvstudio_hero_video_paused', String(!next));
      } catch (e) {}

      if (videoRef.current) {
        if (next) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col font-sans selection:bg-accent-soft selection:text-accent relative">
      {/* 1. EN-TÊTE SOBRE (56 px) - Transparent sur le hero, puis aux couleurs du thème actif */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-14 transition-[background-color,border-color,box-shadow] duration-150 px-4 sm:px-6 lg:px-8 ${
          isOverHero
            ? 'bg-transparent border-b border-transparent'
            : 'bg-surface/95 backdrop-blur-md border-b border-default shadow-xs'
        }`}
      >
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          {/* Logo : Monogramme carré plein couleur accent (rayon 6px) + mot-symbole */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[6px] bg-accent text-accent-contrast flex items-center justify-center font-semibold text-[13px] tracking-tight shrink-0">
              CV
            </div>
            <span
              className={`font-semibold text-[16px] tracking-tight transition-colors duration-150 ${
                isOverHero ? 'text-[#F5F6F8]' : 'text-primary'
              }`}
            >
              CV Studio
            </span>
          </div>

          {/* Navigation sobre */}
          <nav
            className={`hidden md:flex items-center gap-6 text-[14px] transition-colors duration-150 ${
              isOverHero ? 'text-[#D9DDE5]' : 'text-muted'
            }`}
          >
            <a
              href="#modeles"
              className={`transition-colors cursor-pointer ${
                isOverHero ? 'hover:text-white' : 'hover:text-primary'
              }`}
            >
              Modèles
            </a>
            <a
              href="#comment-ca-marche"
              className={`transition-colors cursor-pointer ${
                isOverHero ? 'hover:text-white' : 'hover:text-primary'
              }`}
            >
              Comment ça marche
            </a>
            <a
              href="#ia-explications"
              className={`transition-colors cursor-pointer ${
                isOverHero ? 'hover:text-white' : 'hover:text-primary'
              }`}
            >
              Aide IA
            </a>
            <a
              href="#questions"
              className={`transition-colors cursor-pointer ${
                isOverHero ? 'hover:text-white' : 'hover:text-primary'
              }`}
            >
              Questions
            </a>
          </nav>

          {/* Actions : Menu de thème + Bouton principal Créer mon CV */}
          <div className="flex items-center gap-2.5">
            <ThemeMenu
              currentTheme={themeMode}
              onThemeChange={onThemeChange}
              inverted={isOverHero}
            />
            <button
              type="button"
              onClick={() => onStart()}
              className={`h-9 px-4 text-[13px] rounded-lg shadow-card cursor-pointer transition-colors ${
                isOverHero
                  ? 'font-semibold text-[#0B0F1A] bg-[#6D8AF5] hover:bg-[#8EA6FF]'
                  : 'font-medium text-btn-primary bg-btn-primary hover:opacity-95'
              }`}
            >
              Créer mon CV
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO AVEC VIDÉO D'ARRIÈRE-PLAN (1 SEULE COLONNE, TOUJOURS SOMBRE) */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-[#0A0C10] border-b border-default select-text"
        style={{
          minHeight: 'clamp(560px, 88vh, 820px)',
        }}
      >
        {/* Fond uni sombre immédiat (#0A0C10) */}
        <div className="absolute inset-0 bg-[#0A0C10] z-0" aria-hidden="true" />

        {/* Poster immédiat pour éliminer tout flash noir avant lecture vidéo */}
        {HERO_POSTER && (
          <img
            src={HERO_POSTER}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          />
        )}

        {/* Balise vidéo en arrière-plan (chargement doux et fondu progressif de 400ms) */}
        {!hasVideoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER || undefined}
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setIsVideoReady(true)}
            onLoadedData={() => setIsVideoReady(true)}
            onPlaying={() => setIsVideoReady(true)}
            onError={() => setHasVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-400 pointer-events-none ${
              isVideoReady && isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {HERO_VIDEO_WEBM && <source src={HERO_VIDEO_WEBM} type="video/webm" />}
            {HERO_VIDEO_MP4 && <source src={HERO_VIDEO_MP4} type="video/mp4" />}
          </video>
        )}

        {/* Voile sombre uniforme (#0A0C10 à HERO_OVERLAY_OPACITY) garantissant un contraste AA/AAA strict */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundColor: '#0A0C10',
            opacity: HERO_OVERLAY_OPACITY,
          }}
          aria-hidden="true"
        />

        {/* Bande inférieure de 120 px se fondant en dégradé fonctionnel dans le fond du thème actif */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none z-[2]"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--color-page))',
          }}
          aria-hidden="true"
        />

        {/* Contenu textuel du hero (1 seule colonne, max 40rem, aligné à gauche) */}
        <div className="relative z-10 max-w-6xl w-full mx-auto py-24 sm:py-28 lg:py-32">
          <div className="max-w-[40rem] text-left space-y-6">
            <h1
              className="font-serif font-semibold text-[#F5F6F8] tracking-[-0.02em] leading-[1.1] max-w-[60ch]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
            >
              Votre CV et votre lettre de motivation, prêts à envoyer.
            </h1>

            <p className="text-[15px] sm:text-[16px] text-[#D9DDE5] leading-relaxed max-w-[50ch]">
              Remplissez le formulaire, choisissez un modèle, téléchargez un PDF au format A4. Une aide IA optionnelle vous propose des reformulations, sans rien inventer.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onStart()}
                className="h-10 px-5 text-[14px] font-semibold text-[#0B0F1A] bg-[#6D8AF5] hover:bg-[#8EA6FF] rounded-lg shadow-card flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Créer mon CV</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onLoadSample}
                className="h-10 px-4 text-[14px] font-medium text-[#ECEEF3] bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
              >
                Voir un exemple
              </button>
            </div>

            <p className="text-[12px] text-[#A3A9B8]">
              Sans compte. Vos informations sont enregistrées dans votre navigateur.
            </p>
          </div>
        </div>

        {/* Bouton discret de mise en pause / reprise de la vidéo */}
        {!hasVideoError && (
          <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-8 z-20">
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={
                isPlaying
                  ? "Mettre en pause l'animation de fond"
                  : "Reprendre l'animation de fond"
              }
              aria-pressed={!isPlaying}
              title={
                isPlaying
                  ? "Mettre en pause l'animation de fond"
                  : "Reprendre l'animation de fond"
              }
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-black/40 hover:bg-black/60 border border-white/20 text-[#ECEEF3] backdrop-blur-xs transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </section>

      {/* 3. COMMENT ÇA MARCHE : TROIS ÉTAPES SUR UNE LIGNE (pas de cartes) */}
      <section
        id="comment-ca-marche"
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-default bg-page"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted">
              Démarche
            </span>
            <h2 className="text-[22px] font-semibold text-primary mt-1">
              Comment ça marche
            </h2>
          </div>

          {/* Trois étapes numérotées sur une seule ligne avec traits de liaison parfaitement centrés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 pt-2">
            {/* Étape 1 */}
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-surface border border-default flex items-center justify-center text-[13px] font-semibold text-primary shrink-0 z-10 shadow-xs">
                  1
                </div>
                <div
                  className="hidden md:block flex-1 h-[1px] bg-[var(--color-border-default)] ml-3 -mr-6 z-0"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-[15px] font-semibold text-primary pt-1">
                Renseignez vos informations
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Complétez votre parcours, vos diplômes et vos compétences dans le formulaire structuré.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-surface border border-default flex items-center justify-center text-[13px] font-semibold text-primary shrink-0 z-10 shadow-xs">
                  2
                </div>
                <div
                  className="hidden md:block flex-1 h-[1px] bg-[var(--color-border-default)] ml-3 -mr-6 z-0"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-[15px] font-semibold text-primary pt-1">
                Choisissez un modèle et une couleur
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Basculez entre 10 dispositions éditoriales et ajustez la nuance chromatique en direct.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-surface border border-default flex items-center justify-center text-[13px] font-semibold text-primary shrink-0 z-10 shadow-xs">
                  3
                </div>
              </div>
              <h3 className="text-[15px] font-semibold text-primary pt-1">
                Téléchargez votre PDF
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Obtenez un document A4 prêt à l'emploi avec texte vectoriel sélectionnable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODÈLES : GRILLE DE MINIATURES RÉELLES */}
      <section
        id="modeles"
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-default bg-surface"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-muted">
                Catalogue
              </span>
              <h2 className="text-[22px] font-semibold text-primary mt-1">
                Modèles de documents
              </h2>
              <p className="text-[14px] text-muted mt-1">
                Chaque modèle est rendu fidèlement au format A4 avec vos données.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onStart()}
              className="text-[13px] font-medium text-accent hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Ouvrir l'éditeur</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grille de miniatures RÉELLES avec redimensionnement précis */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TEMPLATES_CATALOG.map((tpl: TemplateMetadata) => (
              <div
                key={tpl.id}
                onClick={() => onStart(tpl.id)}
                className="group flex flex-col cursor-pointer text-left"
              >
                {/* Cadre de la miniature avec mise à l'échelle dynamique */}
                <TemplateThumbnail>
                  {renderTemplateSample(tpl.id)}
                </TemplateThumbnail>

                {/* Nom et étiquette neutre sous la miniature */}
                <div className="mt-2.5 flex items-center justify-between gap-1">
                  <span className="text-[13px] font-medium text-primary truncate group-hover:text-accent transition-colors">
                    {tpl.name}
                  </span>
                  <span className="text-[11px] text-muted px-1.5 py-0.5 rounded bg-surface-secondary border border-default shrink-0">
                    {tpl.layoutLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. L'IA : CE QU'ELLE FAIT, CE QU'ELLE NE FAIT PAS (2 colonnes simples) */}
      <section
        id="ia-explications"
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-default bg-page"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted">
              Transparence
            </span>
            <h2 className="text-[22px] font-semibold text-primary mt-1">
              L'IA : ce qu'elle fait, ce qu'elle ne fait pas
            </h2>
            <p className="text-[14px] text-muted mt-1">
              Une assistance discrète au service de vos faits réels, sans automatismes opaques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-2">
            {/* Colonne "Elle fait" */}
            <div className="space-y-4">
              <h3 className="text-[15px] font-semibold text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-surface border border-default text-success flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                <span>Ce qu'elle fait</span>
              </h3>
              <ul className="space-y-3 text-[14px] text-muted leading-relaxed pl-7">
                <li>
                  <strong className="text-primary font-medium">Reformuler vos phrases :</strong>{' '}
                  proposer des tournures précises et professionnelles pour vos missions et votre résumé.
                </li>
                <li>
                  <strong className="text-primary font-medium">Adapter la lettre :</strong>{' '}
                  ajuster vos arguments à partir du texte brut d'une offre d'emploi.
                </li>
                <li>
                  <strong className="text-primary font-medium">Pré-remplir le formulaire :</strong>{' '}
                  extraire vos sections à partir d'un ancien fichier PDF ou d'une image de CV.
                </li>
              </ul>
            </div>

            {/* Colonne "Elle ne fait pas" */}
            <div className="space-y-4">
              <h3 className="text-[15px] font-semibold text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-surface border border-default text-danger flex items-center justify-center shrink-0">
                  <XIcon className="w-3 h-3" />
                </span>
                <span>Ce qu'elle ne fait pas</span>
              </h3>
              <ul className="space-y-3 text-[14px] text-muted leading-relaxed pl-7">
                <li>
                  <strong className="text-primary font-medium">Inventer des faits :</strong>{' '}
                  aucun diplôme, employeur, date ou chiffre imaginaire n'est ajouté.
                </li>
                <li>
                  <strong className="text-primary font-medium">Collecter vos coordonnées :</strong>{' '}
                  votre photo, votre e-mail et votre numéro ne sont pas transmis pour l'entraînement d'un modèle.
                </li>
                <li>
                  <strong className="text-primary font-medium">Imposer un texte :</strong>{' '}
                  chaque suggestion est soumise dans un panneau Avant / Après que vous validez ou refusez.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUESTIONS FRÉQUENTES (ACCORDÉON DE 4 QUESTIONS) */}
      <section
        id="questions"
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-default bg-surface"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted">
              Aide
            </span>
            <h2 className="text-[22px] font-semibold text-primary mt-1">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-surface border border-default rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[14px] font-semibold text-primary pr-3 group-hover:text-accent transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 border-t border-default/40">
                      <p className="text-[13px] text-muted leading-relaxed pt-3">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. PIED DE PAGE SOBRE */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-surface text-muted text-[13px]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-[4px] bg-accent text-accent-contrast flex items-center justify-center font-semibold text-[10px]">
              CV
            </div>
            <span className="font-medium text-primary">CV Studio</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => onStart()}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Éditeur
            </button>
            <a
              href="#modeles"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Modèles
            </a>
            <a
              href="#comment-ca-marche"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Comment ça marche
            </a>
            <a
              href="#ia-explications"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Aide IA
            </a>
            <a
              href="#questions"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Questions
            </a>
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-primary transition-colors cursor-pointer font-medium"
            >
              Confidentialité
            </button>
          </div>

          <span className="text-[12px] text-subtle">
            © 2026 CV Studio
          </span>
        </div>
      </footer>

      {/* Modale de Confidentialité */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
};
