import { PaletteColors, PaletteId } from '../types';

export const PALETTES: Record<Exclude<PaletteId, 'custom'>, PaletteColors> = {
  marine: {
    id: 'marine',
    name: 'Bleu Marine (Défaut)',
    fonce: '#1F2E55',
    clair: '#D2E0F6',
    fondPage: '#F5F7FB',
    textePrincipal: '#1F2937',
    borderClair: '#BCCEEA',
  },
  royal: {
    id: 'royal',
    name: 'Bleu Royal / Cobalt',
    fonce: '#1E40AF',
    clair: '#DBEAFE',
    fondPage: '#F8FAFC',
    textePrincipal: '#1F2937',
    borderClair: '#BFDBFE',
  },
  petrole: {
    id: 'petrole',
    name: 'Bleu Canard / Pétrole',
    fonce: '#0E7490',
    clair: '#CFFAFE',
    fondPage: '#F6FBFB',
    textePrincipal: '#1F2937',
    borderClair: '#A5F3FC',
  },
  cyan: {
    id: 'cyan',
    name: 'Bleu Glacier / Lagon',
    fonce: '#0284C7',
    clair: '#E0F2FE',
    fondPage: '#F8FAFC',
    textePrincipal: '#0F172A',
    borderClair: '#BAE6FD',
  },
  indigo: {
    id: 'indigo',
    name: 'Indigo Tech / Nuit',
    fonce: '#4338CA',
    clair: '#E0E7FF',
    fondPage: '#F8F9FE',
    textePrincipal: '#1E1B4B',
    borderClair: '#C7D2FE',
  },
  foret: {
    id: 'foret',
    name: 'Vert Forêt / Écologie',
    fonce: '#1B4332',
    clair: '#D8F3DC',
    fondPage: '#F4F9F6',
    textePrincipal: '#1F2937',
    borderClair: '#B7E4C7',
  },
  emeraude: {
    id: 'emeraude',
    name: 'Vert Émeraude / Luxe',
    fonce: '#065F46',
    clair: '#D1FAE5',
    fondPage: '#F2FDF8',
    textePrincipal: '#064E3B',
    borderClair: '#A7F3D0',
  },
  menthe: {
    id: 'menthe',
    name: 'Menthe Fraîche / Cyan',
    fonce: '#0F766E',
    clair: '#CCFBF1',
    fondPage: '#F5FCFA',
    textePrincipal: '#134E4A',
    borderClair: '#99F6E4',
  },
  sauge: {
    id: 'sauge',
    name: 'Vert Sauge / Moderne',
    fonce: '#3F4E4F',
    clair: '#DCD7C9',
    fondPage: '#F8F7F5',
    textePrincipal: '#1F2937',
    borderClair: '#C8C2B3',
  },
  kaki: {
    id: 'kaki',
    name: 'Kaki Chic / Olive',
    fonce: '#3F4933',
    clair: '#EDF1E8',
    fondPage: '#F8FAF6',
    textePrincipal: '#252D1D',
    borderClair: '#DCE4D3',
  },
  bordeaux: {
    id: 'bordeaux',
    name: 'Bordeaux / Vin',
    fonce: '#581825',
    clair: '#FCE4E8',
    fondPage: '#FAF5F6',
    textePrincipal: '#1F2937',
    borderClair: '#F8B4C0',
  },
  rubis: {
    id: 'rubis',
    name: 'Rubis Carmin / Élégant',
    fonce: '#991B1B',
    clair: '#FEE2E2',
    fondPage: '#FFF8F8',
    textePrincipal: '#450A0A',
    borderClair: '#FECACA',
  },
  rose: {
    id: 'rose',
    name: 'Rose Poudré / Corail',
    fonce: '#9F1239',
    clair: '#FFE4E6',
    fondPage: '#FFF8F8',
    textePrincipal: '#1F2937',
    borderClair: '#FECDD3',
  },
  corail: {
    id: 'corail',
    name: 'Corail Solaire / Punch',
    fonce: '#BE123C',
    clair: '#FFE4E6',
    fondPage: '#FFF7F8',
    textePrincipal: '#4C0519',
    borderClair: '#FDA4AF',
  },
  terracotta: {
    id: 'terracotta',
    name: 'Terracotta / Terre Cuite',
    fonce: '#9A3412',
    clair: '#FFEDD5',
    fondPage: '#FFFBF5',
    textePrincipal: '#1F2937',
    borderClair: '#FED7AA',
  },
  ambre: {
    id: 'ambre',
    name: 'Ambre Doré / Exécutif',
    fonce: '#854D0E',
    clair: '#FEF3C7',
    fondPage: '#FFFDF7',
    textePrincipal: '#1F2937',
    borderClair: '#FDE68A',
  },
  moutarde: {
    id: 'moutarde',
    name: 'Ocre Jaune / Moutarde',
    fonce: '#A16207',
    clair: '#FEF9C3',
    fondPage: '#FFFDF5',
    textePrincipal: '#422006',
    borderClair: '#FDE047',
  },
  chocolat: {
    id: 'chocolat',
    name: 'Moka / Chocolat Chaud',
    fonce: '#451A03',
    clair: '#F5ECE4',
    fondPage: '#FAF7F4',
    textePrincipal: '#271002',
    borderClair: '#E8D5C4',
  },
  violet: {
    id: 'violet',
    name: 'Violet Impérial / Prune',
    fonce: '#5B21B6',
    clair: '#EDE9FE',
    fondPage: '#FAF8FF',
    textePrincipal: '#1F2937',
    borderClair: '#DDD6FE',
  },
  prune: {
    id: 'prune',
    name: 'Prune Luxueuse / Raisin',
    fonce: '#701A75',
    clair: '#FAE8FF',
    fondPage: '#FDF8FE',
    textePrincipal: '#3B0764',
    borderClair: '#F5D0FE',
  },
  lavande: {
    id: 'lavande',
    name: 'Lavande Douce / Pastel',
    fonce: '#6D28D9',
    clair: '#EDE9FE',
    fondPage: '#FAF8FF',
    textePrincipal: '#2E1065',
    borderClair: '#DDD6FE',
  },
  anthracite: {
    id: 'anthracite',
    name: 'Anthracite / Ardoise',
    fonce: '#2D3748',
    clair: '#E2E8F0',
    fondPage: '#F7FAFC',
    textePrincipal: '#1F2937',
    borderClair: '#CBD5E1',
  },
  noir: {
    id: 'noir',
    name: 'Noir Épuré / Minimaliste',
    fonce: '#18181B',
    clair: '#E4E4E7',
    fondPage: '#FAFAFA',
    textePrincipal: '#18181B',
    borderClair: '#D4D4D8',
  },
};

export const DEFAULT_PALETTE: PaletteId = 'marine';

/**
 * Génère une palette harmonieuse à partir de n'importe quel code couleur hexadécimal choisi par l'utilisateur
 */
export function createCustomPalette(hexColor: string): PaletteColors {
  const cleanHex = hexColor.replace('#', '').trim() || '1F2E55';
  let r = 31, g = 46, b = 85;
  if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16) || 31;
    g = parseInt(cleanHex.substring(2, 4), 16) || 46;
    b = parseInt(cleanHex.substring(4, 6), 16) || 85;
  } else if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16) || 31;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) || 46;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) || 85;
  }

  // Teinte claire (mélange ~82% de blanc)
  const lightR = Math.round(r * 0.18 + 255 * 0.82);
  const lightG = Math.round(g * 0.18 + 255 * 0.82);
  const lightB = Math.round(b * 0.18 + 255 * 0.82);
  const clair = `rgb(${lightR}, ${lightG}, ${lightB})`;

  // Fond de page (mélange ~96% de blanc)
  const bgR = Math.round(r * 0.04 + 255 * 0.96);
  const bgG = Math.round(g * 0.04 + 255 * 0.96);
  const bgB = Math.round(b * 0.04 + 255 * 0.96);
  const fondPage = `rgb(${bgR}, ${bgG}, ${bgB})`;

  // Bordure claire
  const borderR = Math.round(r * 0.28 + 255 * 0.72);
  const borderG = Math.round(g * 0.28 + 255 * 0.72);
  const borderB = Math.round(b * 0.28 + 255 * 0.72);
  const borderClair = `rgb(${borderR}, ${borderG}, ${borderB})`;

  return {
    id: 'custom',
    name: 'Couleur Personnalisée',
    fonce: `#${cleanHex}`,
    clair,
    fondPage,
    textePrincipal: '#1F2937',
    borderClair,
    isCustom: true,
  };
}

export function getResolvedPalette(paletteId: PaletteId, customHex?: string): PaletteColors {
  if (paletteId === 'custom' && customHex) {
    return createCustomPalette(customHex);
  }
  if (paletteId !== 'custom' && PALETTES[paletteId]) {
    return PALETTES[paletteId];
  }
  return PALETTES.marine;
}
