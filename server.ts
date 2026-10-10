import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { GEMINI_MODEL, AI_SYSTEM_INSTRUCTION } from './src/config/ai';
import { LIMITS } from './src/config/limits';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialisation du client GoogleGenAI côté serveur
const apiKey = process.env.GEMINI_API_KEY;

function getAiClient(): GoogleGenAI {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY non configurée dans les variables d\'environnement.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Route: Améliorer un texte (profil, description expérience, description projet)
 */
app.post('/api/ai/improve', async (req, res) => {
  try {
    const { type, text, context } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Texte d\'entrée manquant ou vide.' });
    }

    if (!['profil', 'experience', 'projet'].includes(type)) {
      return res.status(400).json({ error: 'Type invalide. Doit être profil, experience ou projet.' });
    }

    const ai = getAiClient();
    const lang = context?.langueCV === 'en' ? 'anglais' : 'français';

    let maxChars: number = LIMITS.profil;
    let specificRule = '';

    if (type === 'profil') {
      maxChars = LIMITS.profil;
      specificRule = `Pour le profil : 2 à 3 phrases claires et percutantes. Longueur maximale stricte : ${maxChars} caractères.`;
    } else if (type === 'experience') {
      maxChars = LIMITS.experiences.description;
      specificRule = `Pour la description de poste (${context?.poste || 'Poste'} chez ${context?.entreprise || 'Entreprise'}) : 1 à 2 phrases, sans puces, même personne grammaticale que le texte d'origine. Longueur maximale stricte : ${maxChars} caractères.`;
    } else if (type === 'projet') {
      maxChars = LIMITS.projets.description;
      specificRule = `Pour la description de projet (${context?.role || 'Rôle'}) : 1 à 2 phrases, sans puces, même personne grammaticale que le texte d'origine. Longueur maximale stricte : ${maxChars} caractères.`;
    }

    const prompt = `Améliore le texte suivant pour un CV en ${lang}.
Contexte:
${specificRule}

Texte original à améliorer :
"${text.trim()}"

Renvoie un JSON valide respectant le schéma :
{
  "improved": "Le texte amélioré respectant strictement la limite de caractères",
  "explanation": "Explication brève en 1 phrase des améliorations apportées"
}`;

    const executeCall = async () => {
      return await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: AI_SYSTEM_INSTRUCTION,
          temperature: 0.3,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              improved: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['improved'],
          },
        },
      });
    };

    let response;
    try {
      response = await executeCall();
    } catch (err: unknown) {
      // Deuxième essai si premier échec
      const errMsg = String(err);
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        return res.status(429).json({
          error: 'QUOTA_EXCEEDED',
          message: 'Limite gratuite atteinte, réessayez dans une minute.',
        });
      }
      response = await executeCall();
    }

    const rawJson = response?.text?.trim() || '{}';
    let parsed: { improved?: string; explanation?: string } = {};

    try {
      parsed = JSON.parse(rawJson);
    } catch {
      // Tentative de parsing regex
      const match = rawJson.match(/"improved"\s*:\s*"([^"]+)"/);
      parsed = { improved: match ? match[1] : text };
    }

    let improved = parsed.improved?.trim() || text;
    // Tronquer côté client/serveur si dépassement de la limite stricte
    if (improved.length > maxChars) {
      improved = improved.slice(0, maxChars);
    }

    return res.json({
      improved,
      explanation: parsed.explanation || 'Reformulation professionnelle et concise.',
    });
  } catch (error: unknown) {
    console.error('Erreur /api/ai/improve:', error);
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error: 'QUOTA_EXCEEDED',
        message: 'Limite gratuite atteinte, réessayez dans une minute.',
      });
    }
    return res.status(500).json({ error: msg });
  }
});

/**
 * Route: Générer la lettre de motivation complète
 */
app.post('/api/ai/cover-letter', async (req, res) => {
  try {
    const { cv, offre, options } = req.body;

    if (!offre || typeof offre !== 'string' || !offre.trim()) {
      return res.status(400).json({ error: "L'offre d'emploi est requise." });
    }

    const ai = getAiClient();

    // Règle de confidentialité : NE JAMAIS envoyer photo, email, téléphone au modèle !
    const sanitizedCV = {
      nom: cv.nom || '',
      titre: cv.titre || '',
      profil: cv.profil || '',
      formations: (cv.formations || []).map((f: { diplome: string; etablissement: string; debut: string; fin: string }) => ({
        diplome: f.diplome,
        etablissement: f.etablissement,
        periode: `${f.debut || ''} - ${f.fin || ''}`,
      })),
      experiences: (cv.experiences || []).map((e: { poste: string; entreprise: string; description: string; debut: string; fin: string; enCours: boolean }) => ({
        poste: e.poste,
        entreprise: e.entreprise,
        description: e.description,
        periode: `${e.debut || ''} - ${e.enCours ? 'Présent' : e.fin || ''}`,
      })),
      competences: (cv.competences || []).map((c: { texte: string }) => c.texte),
      langues: (cv.langues || []).map((l: { langue: string; niveau: string }) => `${l.langue} (${l.niveau})`),
    };

    const targetWords = options.longueur === 'Courte' ? 'environ 200 mots' : 'environ 300 mots';
    const lang = options.langue === 'en' ? 'en anglais' : 'en français';

    const prompt = `Rédige une lettre de motivation professionnelle complète ${lang} basée sur les éléments suivants.

Poste visé: ${options.poste || 'Candidat'}
Entreprise: ${options.entreprise || 'Entreprise'}
Nom/Titre du destinataire: ${options.destinataire || 'Responsable du recrutement'}
Ton souhaité: ${options.ton || 'Professionnel'} (adapté au profil)
Longueur souhaitée: ${targetWords} (doit tenir sur une seule page A4 !)
Points forts à valoriser: ${options.pointsForts || 'Parcours technique et motivation'}

Données du candidat (sans coordonnées privées) :
${JSON.stringify(sanitizedCV, null, 2)}

Offre d'emploi ciblée :
"${offre.trim().slice(0, 4000)}"

Règles :
1. Reformule uniquement des faits réels mentionnés dans le CV et l'offre.
2. Structure stricte :
   - objet : court et percutant (ex: Candidature au poste de ...)
   - formuleAppel : formule d'appel personnalisée (ex: Madame, Monsieur, ou nom du destinataire)
   - paragraphes : liste de 3 ou 4 paragraphes distincts (Introduction/Accroche, Lien entre compétences et besoins de l'offre, Motivation pour l'entreprise/valeur ajoutée, Conclusion invitant à l'échange).
   - formulePolitesse : formule de politesse finale formelle et élégante.
3. Reste concis pour que la lettre tienne impérativement sur une page A4.`;

    const executeCall = async () => {
      return await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: AI_SYSTEM_INSTRUCTION,
          temperature: 0.4,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              objet: { type: Type.STRING },
              formuleAppel: { type: Type.STRING },
              paragraphes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              formulePolitesse: { type: Type.STRING },
            },
            required: ['objet', 'formuleAppel', 'paragraphes', 'formulePolitesse'],
          },
        },
      });
    };

    let response;
    try {
      response = await executeCall();
    } catch (err: unknown) {
      const errMsg = String(err);
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        return res.status(429).json({
          error: 'QUOTA_EXCEEDED',
          message: 'Limite gratuite atteinte, réessayez dans une minute.',
        });
      }
      response = await executeCall();
    }

    const rawJson = response?.text?.trim() || '{}';
    const parsed = JSON.parse(rawJson);

    return res.json(parsed);
  } catch (error: unknown) {
    console.error('Erreur /api/ai/cover-letter:', error);
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error: 'QUOTA_EXCEEDED',
        message: 'Limite gratuite atteinte, réessayez dans une minute.',
      });
    }
    return res.status(500).json({ error: msg });
  }
});

/**
 * Route: Régénérer un paragraphe précis de la lettre de motivation
 */
app.post('/api/ai/cover-letter-paragraph', async (req, res) => {
  try {
    const { paragraphIndex, currentText, cv, offre, options } = req.body;

    const ai = getAiClient();
    const lang = options?.langue === 'en' ? 'en anglais' : 'en français';

    const prompt = `Régénère et perfectionne le paragraphe numéro ${paragraphIndex + 1} d'une lettre de motivation ${lang}.
Poste: ${options?.poste || ''} chez ${options?.entreprise || ''}.
Ton: ${options?.ton || 'Professionnel'}.
Texte actuel de ce paragraphe:
"${currentText}"

Offre d'emploi (pour contextualiser):
"${(offre || '').slice(0, 1500)}"

Compétences du candidat:
${(cv?.competences || []).map((c: { texte: string }) => c.texte).join(', ')}

Consigne : Rédige une version alternative, dynamique et professionnelle de ce seul paragraphe (1 seul paragraphe de 2 à 4 phrases).`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 0.5,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            paragraph: { type: Type.STRING },
          },
          required: ['paragraph'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ paragraph: parsed.paragraph || currentText });
  } catch (error: unknown) {
    console.error('Erreur /api/ai/cover-letter-paragraph:', error);
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error: 'QUOTA_EXCEEDED',
        message: 'Limite gratuite atteinte, réessayez dans une minute.',
      });
    }
    return res.status(500).json({ error: msg });
  }
});

/**
 * Route: Import de CV depuis un fichier PDF ou Image (Bonus)
 */
app.post('/api/ai/import-cv', async (req, res) => {
  try {
    const { fileBase64, mimeType } = req.body;

    if (!fileBase64 || !mimeType) {
      return res.status(400).json({ error: 'Données de fichier manquantes.' });
    }

    const ai = getAiClient();

    const prompt = `Analyse ce document de CV et extrait toutes les informations sous une forme structurée pour pré-remplir notre formulaire.
Règles :
1. N'invente aucune information non présente.
2. Sépare bien chaque champ : nom, titre professionnel, téléphone, e-mail, localisation, résumé de profil.
3. Extrais les formations (diplôme, établissement, année début, année fin).
4. Extrais les expériences (poste, entreprise, année début, année fin, description).
5. Extrais les compétences clés sous forme de liste.
6. Extrais les langues et leur niveau estimé.
7. Ne retourne que le JSON correspondant exactement au schéma.`;

    const parts = [
      {
        inlineData: {
          mimeType,
          data: fileBase64,
        },
      },
      {
        text: prompt,
      },
    ];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts },
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nom: { type: Type.STRING },
            titre: { type: Type.STRING },
            contact: {
              type: Type.OBJECT,
              properties: {
                telephone: { type: Type.STRING },
                email: { type: Type.STRING },
                localisation: { type: Type.STRING },
                lien: { type: Type.STRING },
                permis: { type: Type.STRING },
              },
            },
            profil: { type: Type.STRING },
            langues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  langue: { type: Type.STRING },
                  niveau: { type: Type.STRING },
                },
              },
            },
            competences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  texte: { type: Type.STRING },
                },
              },
            },
            centresInteret: { type: Type.STRING },
            formations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  debut: { type: Type.STRING },
                  fin: { type: Type.STRING },
                  diplome: { type: Type.STRING },
                  etablissement: { type: Type.STRING },
                },
              },
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  debut: { type: Type.STRING },
                  fin: { type: Type.STRING },
                  enCours: { type: Type.BOOLEAN },
                  poste: { type: Type.STRING },
                  entreprise: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
            projets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  annee: { type: Type.STRING },
                  role: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  annee: { type: Type.STRING },
                  intitule: { type: Type.STRING },
                  organisme: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: unknown) {
    console.error('Erreur /api/ai/import-cv:', error);
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error: 'QUOTA_EXCEEDED',
        message: 'Limite gratuite atteinte, réessayez dans une minute.',
      });
    }
    return res.status(500).json({ error: msg });
  }
});

// Montage de Vite en développement ou des fichiers statiques en production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur CV Studio démarré sur http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Échec du démarrage du serveur:', err);
});
