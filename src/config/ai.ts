/**
 * Configuration de l'IA (Gemini)
 * Le nom du modèle est défini dans cette seule constante.
 */

// Modèle Gemini Flash utilisé par défaut (offre gratuite)
export const GEMINI_MODEL = "gemini-3.8-flash";

// Consigne système stricte requise
export const AI_SYSTEM_INSTRUCTION = 
  "Tu es un assistant de rédaction de CV. Règles strictes : 1) Tu reformules uniquement les informations fournies par l'utilisateur. 2) Tu n'inventes aucun chiffre, employeur, diplôme, date, outil, compétence ou résultat. 3) Tu réponds dans la langue du texte d'entrée (français par défaut). 4) Style professionnel, phrases courtes, verbes d'action, sans exagération ni formules creuses. 5) Tu respectes strictement la limite de caractères indiquée. 6) Tu réponds uniquement avec le JSON demandé, sans texte autour.";

// Timeout par requête en millisecondes (30 secondes)
export const AI_TIMEOUT_MS = 30000;

// Durée de temporisation après une erreur de quota 429 (en secondes)
export const AI_COOLDOWN_SECONDS = 60;
