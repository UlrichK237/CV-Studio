import { CVData, CoverLetterData, PaletteId, TemplateId, CVLang, ThemeMode, SpacingMode } from '../types';
import { EMPTY_CV, EMPTY_LETTER } from '../data/sample';

const STORAGE_KEY_CV = 'cv_studio_cv_data_v1';
const STORAGE_KEY_LETTER = 'cv_studio_letter_data_v1';
const STORAGE_KEY_SETTINGS = 'cv_studio_settings_v1';

export interface AppSettings {
  palette: PaletteId;
  template: TemplateId;
  lang: CVLang;
  compact: boolean;
  activeTab: 'cv' | 'lettre';
  showPhotoInATS?: boolean;
  themeMode?: ThemeMode;
  spacingMode?: SpacingMode;
  customHex?: string;
  letterFontSize?: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  palette: 'marine',
  template: 'moderne-bleu',
  lang: 'fr',
  compact: false,
  activeTab: 'cv',
  showPhotoInATS: false,
  themeMode: 'system',
  spacingMode: 'remplir',
  customHex: '#1F2E55',
  letterFontSize: 10,
};

// Mémoire tampon de secours si le localStorage est indisponible ou saturé
let inMemoryCV: CVData | null = null;
let inMemoryLetter: CoverLetterData | null = null;
let inMemorySettings: AppSettings | null = null;

export function loadSavedCV(): CVData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CV);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as CVData;
      }
    }
  } catch (err) {
    console.warn('localStorage non accessible pour CVData, utilisation du fallback.', err);
  }
  return inMemoryCV || EMPTY_CV;
}

export function saveCV(data: CVData): boolean {
  inMemoryCV = data;
  try {
    localStorage.setItem(STORAGE_KEY_CV, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn('Impossible de sauvegarder CVData dans localStorage (quota ou restreint).', err);
    return false;
  }
}

export function loadSavedLetter(): CoverLetterData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LETTER);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as CoverLetterData;
      }
    }
  } catch (err) {
    console.warn('localStorage non accessible pour CoverLetter, utilisation du fallback.', err);
  }
  return inMemoryLetter || EMPTY_LETTER;
}

export function saveLetter(data: CoverLetterData): boolean {
  inMemoryLetter = data;
  try {
    localStorage.setItem(STORAGE_KEY_LETTER, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn('Impossible de sauvegarder la lettre dans localStorage.', err);
    return false;
  }
}

export function loadSavedSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch (err) {
    console.warn('localStorage non accessible pour les réglages.', err);
  }
  return inMemorySettings || DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): boolean {
  inMemorySettings = settings;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.warn('Impossible de sauvegarder les réglages.', err);
    return false;
  }
}

export function clearAllSavedData(): void {
  inMemoryCV = null;
  inMemoryLetter = null;
  inMemorySettings = null;
  try {
    localStorage.removeItem(STORAGE_KEY_CV);
    localStorage.removeItem(STORAGE_KEY_LETTER);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
  } catch (err) {
    console.warn('Erreur lors du nettoyage de localStorage.', err);
  }
}
