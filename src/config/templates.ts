import { TemplateId } from '../types';

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  tagline: string;
  layoutLabel: '2 colonnes' | '1 colonne' | 'ATS';
  description: string;
  previewBg: string;
  accentClass: string;
}

export const TEMPLATES_CATALOG: TemplateMetadata[] = [
  {
    id: 'moderne-bleu',
    name: 'Moderne Bleu',
    tagline: 'Mise en page dynamique à deux colonnes avec bandeau identitaire',
    layoutLabel: '2 colonnes',
    description: 'Photo avec cadre décalé, grand titre et frise chronologique détaillée.',
    previewBg: '#1F2E55',
    accentClass: 'bg-indigo-600',
  },
  {
    id: 'canva-sidebar',
    name: 'Colonne latérale',
    tagline: 'Colonne latérale contrastée pleine hauteur',
    layoutLabel: '2 colonnes',
    description: 'Colonne latérale à fort impact visuel avec photo et corps épuré.',
    previewBg: '#0f172a',
    accentClass: 'bg-slate-900',
  },
  {
    id: 'canva-elegant',
    name: 'Bandeau supérieur',
    tagline: 'En-tête horizontal sobre intégrant la photo et les coordonnées',
    layoutLabel: '2 colonnes',
    description: 'En-tête supérieur soigné avec coordonnées et répartition équilibrée.',
    previewBg: '#1E3A8A',
    accentClass: 'bg-blue-900',
  },
  {
    id: 'canva-minimaliste',
    name: 'Minimaliste',
    tagline: 'Typographie soignée, lignes fines et espacements généreux',
    layoutLabel: '1 colonne',
    description: 'Lignes fines, espacements amples et hiérarchie typographique sans fioriture.',
    previewBg: '#334155',
    accentClass: 'bg-slate-700',
  },
  {
    id: 'canva-cadres',
    name: 'Blocs structurés',
    tagline: 'Sections ordonnées en modules délimités pour une lecture rapide',
    layoutLabel: '2 colonnes',
    description: 'Sections organisées sous forme de modules soignés pour une clarté optimale.',
    previewBg: '#0284c7',
    accentClass: 'bg-sky-600',
  },
  {
    id: 'canva-arche',
    name: 'Arche',
    tagline: 'Photo au format arche et équilibre feutré',
    layoutLabel: '2 colonnes',
    description: 'Découpe arche contemporaine et mise en valeur soignée du profil.',
    previewBg: '#7c3aed',
    accentClass: 'bg-purple-700',
  },
  {
    id: 'canva-vague',
    name: 'Vague créative',
    tagline: 'Bandeau supérieur découpé pour profils créatifs',
    layoutLabel: '2 colonnes',
    description: 'Bandeau découpé avec précision pour les métiers de création.',
    previewBg: '#0d9488',
    accentClass: 'bg-teal-600',
  },
  {
    id: 'canva-geometrique',
    name: 'Géométrique',
    tagline: 'Structure contemporaine avec mise en valeur des compétences',
    layoutLabel: '2 colonnes',
    description: 'Structure moderne avec hiérarchie claire et équilibre A4 précis.',
    previewBg: '#4f46e5',
    accentClass: 'bg-indigo-600',
  },
  {
    id: 'canva-executif',
    name: 'Exécutif',
    tagline: 'Disposition de prestige pour cadres et managers',
    layoutLabel: '2 colonnes',
    description: 'En-tête raffiné, typographie distinctive et équilibre rigoureux.',
    previewBg: '#1e293b',
    accentClass: 'bg-slate-800',
  },
  {
    id: 'classique-ats',
    name: 'Classique ATS',
    tagline: '1 colonne optimisée pour le tri automatique des candidatures',
    layoutLabel: 'ATS',
    description: 'Structure sémantique stricte sans colonnes complexes pour franchir les filtres ATS.',
    previewBg: '#475569',
    accentClass: 'bg-slate-600',
  },
];
