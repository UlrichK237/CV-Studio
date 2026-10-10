/**
 * Configuration des médias du hero de la page d'accueil.
 * SEUL endroit où sont référencés les chemins et l'opacité du hero vidéo.
 */

// Chemin vers la vidéo MP4 dans le dossier public
export const HERO_VIDEO_MP4 = '/media/hero.mp4';

// Chemin vers la vidéo WebM (optionnelle, vide par défaut)
export const HERO_VIDEO_WEBM = '';

// Image d'affiche (poster) optionnelle
export const HERO_POSTER = '/media/hero-poster.jpg';

// Opacité du voile sombre (#0A0C10) pour garantir la lisibilité et le contraste AA (>= 0.5)
// La vidéo comporte des éléments clairs mobiles (feuille de CV blanche, manche claire, carnet blanc).
// 0.65 garantit un contraste strict supérieur aux exigences WCAG AA sur toute la durée.
export const HERO_OVERLAY_OPACITY = 0.65;

// Hauteur minimale recommandée du hero (entre 560px et 820px, 88vh)
export const HERO_MIN_HEIGHT = '88vh';
