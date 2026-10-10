/**
 * Modèle de données central de CV Studio
 * Principe : un seul objet de données (CVData) alimente tout le système.
 */

export type LanguageLevel = 'Natif' | 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1';

export interface CVContact {
  telephone: string;
  email: string;
  localisation: string;
  lien?: string;
  permis?: string;
}

export interface CVLangue {
  id: string;
  langue: string;
  niveau: string;
}

export interface CVCompetence {
  id: string;
  texte: string;
}

export interface CVFormation {
  id: string;
  debut: string;
  fin: string;
  diplome: string;
  etablissement: string;
}

export interface CVExperience {
  id: string;
  debut: string;
  fin: string;
  enCours: boolean;
  poste: string;
  entreprise: string;
  description: string;
}

export interface CVProjet {
  id: string;
  annee: string;
  role: string;
  description: string;
}

export interface CVCertification {
  id: string;
  annee: string;
  intitule: string;
  organisme: string;
}

export interface CVData {
  photo: string | null;
  nom: string;
  titre: string;
  contact: CVContact;
  profil: string;
  langues: CVLangue[];
  competences: CVCompetence[];
  centresInteret: string;
  formations: CVFormation[];
  experiences: CVExperience[];
  projets: CVProjet[];
  certifications: CVCertification[];
}

export type PaletteId =
  | 'marine'
  | 'royal'
  | 'petrole'
  | 'foret'
  | 'sauge'
  | 'bordeaux'
  | 'rose'
  | 'terracotta'
  | 'ambre'
  | 'violet'
  | 'anthracite'
  | 'noir'
  | 'emeraude'
  | 'menthe'
  | 'indigo'
  | 'prune'
  | 'chocolat'
  | 'cyan'
  | 'kaki'
  | 'rubis'
  | 'corail'
  | 'lavande'
  | 'moutarde'
  | 'custom';

export type ThemeMode = 'system' | 'light' | 'dark';

export type SpacingMode = 'remplir' | 'normal' | 'compact' | 'spacious';

export interface PaletteColors {
  id: PaletteId;
  name: string;
  fonce: string;       // Couleur principale foncée (ex: #1F2E55)
  clair: string;       // Couleur secondaire claire (ex: #D2E0F6)
  fondPage: string;    // Fond de page du CV (ex: #F5F7FB)
  textePrincipal: string; // Couleur texte (#1F2937)
  borderClair?: string;
  isCustom?: boolean;
}

export type TemplateId =
  | 'moderne-bleu'
  | 'canva-sidebar'
  | 'canva-elegant'
  | 'canva-minimaliste'
  | 'canva-cadres'
  | 'canva-arche'
  | 'canva-vague'
  | 'canva-geometrique'
  | 'canva-executif'
  | 'classique-ats';

export type CVLang = 'fr' | 'en';

export interface CoverLetterData {
  poste: string;
  entreprise: string;
  destinataire: string;
  ville: string;
  date: string;
  offre: string;
  ton: 'Professionnel' | 'Dynamique' | 'Sobre';
  longueur: 'Courte' | 'Standard';
  pointsForts: string;
  objet: string;
  formuleAppel: string;
  paragraphes: string[];
  formulePolitesse: string;
}

export interface AIImprovementResult {
  original: string;
  improved: string;
  explanation?: string;
}
