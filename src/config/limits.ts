/**
 * Limites et règles de validation de CV Studio
 * Tout au même endroit pour une modification simple et centralisée.
 */

export const LIMITS = {
  // Limites de caractères des champs simples
  nom: 40,
  titre: 70,
  telephone: 20,
  email: 60,
  localisation: 50,
  lien: 60,
  permis: 20,
  profil: 350,
  centresInteret: 80,

  // Limites pour la lettre de motivation
  offreEmploi: 4000,
  posteLettre: 70,
  entrepriseLettre: 60,
  destinataireLettre: 60,
  villeLettre: 50,
  pointsFortsLettre: 300,

  // Listes : nombre maximum d'éléments et limites de caractères
  langues: {
    maxItems: 6,
    langue: 25,
  },
  competences: {
    maxItems: 12,
    texte: 40,
  },
  formations: {
    maxItems: 5,
    diplome: 90,
    etablissement: 70,
    debut: 20,
    fin: 20,
  },
  experiences: {
    maxItems: 5,
    poste: 70,
    entreprise: 60,
    description: 200,
    debut: 20,
    fin: 20,
  },
  projets: {
    maxItems: 4,
    annee: 20,
    role: 80,
    description: 220,
  },
  certifications: {
    maxItems: 5,
    annee: 20,
    intitule: 90,
    organisme: 50,
  },

  // Photo
  photo: {
    maxSizeInBytes: 2 * 1024 * 1024, // 2 Mo max
    maxWidthPx: 600, // Redimensionnement canvas
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const;

// Niveaux de langue disponibles
export const LANGUAGE_LEVELS = [
  'Natif',
  'C2',
  'C1',
  'B2',
  'B1',
  'A2',
  'A1',
] as const;

// Champs obligatoires pour l'export (vérifiés uniquement lors de l'export)
export const REQUIRED_FIELDS = [
  { key: 'nom', label: 'Nom complet', check: (cv: { nom: string }) => Boolean(cv.nom?.trim()) },
  { key: 'titre', label: 'Titre professionnel', check: (cv: { titre: string }) => Boolean(cv.titre?.trim()) },
  { key: 'email', label: 'Adresse e-mail', check: (cv: { contact: { email: string } }) => Boolean(cv.contact?.email?.trim()) },
  { key: 'telephone', label: 'Numéro de téléphone', check: (cv: { contact: { telephone: string } }) => Boolean(cv.contact?.telephone?.trim()) },
  { key: 'localisation', label: 'Localisation', check: (cv: { contact: { localisation: string } }) => Boolean(cv.contact?.localisation?.trim()) },
  { 
    key: 'formations', 
    label: 'Au moins une formation', 
    check: (cv: { formations: Array<{ diplome: string; etablissement: string }> }) => 
      Boolean(cv.formations && cv.formations.length > 0 && cv.formations.some(f => f.diplome?.trim() || f.etablissement?.trim())) 
  },
] as const;
