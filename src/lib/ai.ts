import { CVData, CoverLetterData, CVLang } from '../types';
import { AI_TIMEOUT_MS, AI_COOLDOWN_SECONDS } from '../config/ai';

export interface AIImproveContext {
  poste?: string;
  entreprise?: string;
  role?: string;
  langueCV?: CVLang;
}

export interface CoverLetterOptions {
  poste: string;
  entreprise: string;
  destinataire?: string;
  ville: string;
  date: string;
  ton: 'Professionnel' | 'Dynamique' | 'Sobre';
  longueur: 'Courte' | 'Standard';
  pointsForts?: string;
  langue?: CVLang;
}

export interface AIImprovementResponse {
  improved: string;
  explanation: string;
}

// État global du cooldown pour les erreurs 429
let cooldownRemainingSeconds = 0;
let cooldownTimerId: NodeJS.Timeout | null = null;
const cooldownListeners: Set<(seconds: number) => void> = new Set();

export function getAICooldownSeconds(): number {
  return cooldownRemainingSeconds;
}

export function subscribeToAICooldown(listener: (seconds: number) => void): () => void {
  cooldownListeners.add(listener);
  listener(cooldownRemainingSeconds);
  return () => {
    cooldownListeners.delete(listener);
  };
}

function startCooldown(seconds = AI_COOLDOWN_SECONDS) {
  cooldownRemainingSeconds = seconds;
  cooldownListeners.forEach((fn) => fn(cooldownRemainingSeconds));

  if (cooldownTimerId) clearInterval(cooldownTimerId);

  cooldownTimerId = setInterval(() => {
    cooldownRemainingSeconds -= 1;
    if (cooldownRemainingSeconds <= 0) {
      cooldownRemainingSeconds = 0;
      if (cooldownTimerId) clearInterval(cooldownTimerId);
      cooldownTimerId = null;
    }
    cooldownListeners.forEach((fn) => fn(cooldownRemainingSeconds));
  }, 1000);
}

/**
 * Fonction centrale pour exécuter un appel avec timeout de 30s
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = AI_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Améliore un texte de profil, d'expérience ou de projet.
 */
export async function improveText(
  type: 'profil' | 'experience' | 'projet',
  text: string,
  context?: AIImproveContext
): Promise<AIImprovementResponse> {
  if (cooldownRemainingSeconds > 0) {
    throw new Error(
      `Limite gratuite atteinte, réessayez dans ${cooldownRemainingSeconds} seconde${
        cooldownRemainingSeconds > 1 ? 's' : ''
      }.`
    );
  }

  try {
    const response = await fetchWithTimeout('/api/ai/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, text, context }),
    });

    if (response.status === 429) {
      startCooldown();
      throw new Error('Limite gratuite atteinte, réessayez dans une minute.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Erreur serveur (${response.status})`);
    }

    const data = await response.json();
    return {
      improved: data.improved,
      explanation: data.explanation || 'Texte optimisé selon les règles professionnelles.',
    };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("La requête a expiré (délai dépassé de 30 secondes). Veuillez réessayer.");
    }
    throw error;
  }
}

/**
 * Génère la lettre de motivation complète à partir du CV et de l'offre
 */
export async function generateCoverLetter(
  cv: CVData,
  offre: string,
  options: CoverLetterOptions
): Promise<Partial<CoverLetterData>> {
  if (cooldownRemainingSeconds > 0) {
    throw new Error(
      `Limite gratuite atteinte, réessayez dans ${cooldownRemainingSeconds} seconde${
        cooldownRemainingSeconds > 1 ? 's' : ''
      }.`
    );
  }

  try {
    const response = await fetchWithTimeout('/api/ai/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cv, offre, options }),
    });

    if (response.status === 429) {
      startCooldown();
      throw new Error('Limite gratuite atteinte, réessayez dans une minute.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Erreur (${response.status})`);
    }

    const data = await response.json();
    return {
      objet: data.objet || 'Candidature',
      formuleAppel: data.formuleAppel || 'Madame, Monsieur,',
      paragraphes: Array.isArray(data.paragraphes) ? data.paragraphes : [],
      formulePolitesse: data.formulePolitesse || "Je vous prie d'agréer mes salutations distinguées.",
    };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("La génération a pris trop de temps (timeout 30s). Veuillez réessayer.");
    }
    throw error;
  }
}

/**
 * Régénère un paragraphe précis de la lettre
 */
export async function regenerateLetterParagraph(
  paragraphIndex: number,
  currentText: string,
  cv: CVData,
  offre: string,
  options: CoverLetterOptions
): Promise<string> {
  if (cooldownRemainingSeconds > 0) {
    throw new Error(`Limite gratuite atteinte, réessayez dans ${cooldownRemainingSeconds} secondes.`);
  }

  try {
    const response = await fetchWithTimeout('/api/ai/cover-letter-paragraph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paragraphIndex, currentText, cv, offre, options }),
    });

    if (response.status === 429) {
      startCooldown();
      throw new Error('Limite gratuite atteinte, réessayez dans une minute.');
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la régénération.');
    }

    const data = await response.json();
    return data.paragraph || currentText;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Délai de réponse dépassé (30s).");
    }
    throw error;
  }
}

/**
 * Importe un CV existant (PDF ou Image) et extrait les données structurées
 */
export async function importCV(file: File): Promise<Partial<CVData>> {
  if (cooldownRemainingSeconds > 0) {
    throw new Error(`Limite gratuite atteinte, réessayez dans ${cooldownRemainingSeconds} secondes.`);
  }

  // Convertir le fichier en base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsDataURL(file);
  });

  try {
    const response = await fetchWithTimeout(
      '/api/ai/import-cv',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64Data,
          mimeType: file.type || 'application/pdf',
        }),
      },
      45000 // 45s pour analyse de document
    );

    if (response.status === 429) {
      startCooldown();
      throw new Error('Limite gratuite atteinte, réessayez dans une minute.');
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Impossible d\'analyser le CV.');
    }

    const extracted = await response.json();
    return extracted;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("L'analyse du document a dépassé le délai autorisé.");
    }
    throw error;
  }
}
