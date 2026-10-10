import { CVLang } from '../types';

export interface SectionTitles {
  profil: string;
  formations: string;
  experiences: string;
  projets: string;
  certifications: string;
  contact: string;
  langues: string;
  competences: string;
  centresInteret: string;
}

export interface I18nLabels {
  sections: SectionTitles;
  present: string;
  telephone: string;
  email: string;
  localisation: string;
  lien: string;
  permis: string;
  objet: string;
  aLattentionDe: string;
  datePrefix: string;
}

export const LABELS: Record<CVLang, I18nLabels> = {
  fr: {
    sections: {
      profil: 'PROFIL',
      formations: 'FORMATIONS',
      experiences: 'EXPÉRIENCES PROFESSIONNELLES',
      projets: 'PROJETS',
      certifications: 'CERTIFICATIONS',
      contact: 'CONTACT',
      langues: 'LANGUES',
      competences: 'COMPÉTENCES',
      centresInteret: "CENTRES D'INTÉRÊT",
    },
    present: 'Présent',
    telephone: 'Téléphone',
    email: 'E-mail',
    localisation: 'Localisation',
    lien: 'Portfolio / Lien',
    permis: 'Permis',
    objet: 'Objet :',
    aLattentionDe: "À l'attention de",
    datePrefix: 'Le',
  },
  en: {
    sections: {
      profil: 'PROFILE',
      formations: 'EDUCATION',
      experiences: 'WORK EXPERIENCE',
      projets: 'PROJECTS',
      certifications: 'CERTIFICATIONS',
      contact: 'CONTACT',
      langues: 'LANGUAGES',
      competences: 'SKILLS',
      centresInteret: 'INTERESTS',
    },
    present: 'Present',
    telephone: 'Phone',
    email: 'Email',
    localisation: 'Location',
    lien: 'Portfolio / Link',
    permis: "Driver's License",
    objet: 'Subject:',
    aLattentionDe: 'Attention:',
    datePrefix: 'Date:',
  },
};
