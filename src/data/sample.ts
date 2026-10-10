import { CVData, CoverLetterData } from '../types';

export const SAMPLE_CV: CVData = {
  photo: null,
  nom: 'DEFFO KOUNDI ULRICH',
  titre: 'Technicien en Informatique Industrielle et Automatisme',
  contact: {
    telephone: '+237 6XX XX XX XX',
    email: 'prenom.nom@email.com',
    localisation: 'Bomono, Douala, Cameroun',
    lien: 'linkedin.com/in/ulrich-koundi',
    permis: 'Permis B',
  },
  profil:
    "Diplômé en Informatique Industrielle et Automatisme, je conçois des systèmes intelligents qui combinent automatisme, systèmes embarqués et développement web. Autonome et orienté résultats, je souhaite mettre mes compétences techniques au service de l'industrie.",
  langues: [
    { id: 'l-1', langue: 'Français', niveau: 'Natif' },
    { id: 'l-2', langue: 'Anglais', niveau: 'B2' },
  ],
  competences: [
    { id: 'c-1', texte: 'Automatisme industriel' },
    { id: 'c-2', texte: 'Systèmes embarqués (ESP32, Arduino, PIC)' },
    { id: 'c-3', texte: 'Programmation Python, Java, C/C++' },
    { id: 'c-4', texte: 'Développement web (Django, HTML/CSS/JS)' },
    { id: 'c-5', texte: 'Base de données PostgreSQL' },
    { id: 'c-6', texte: 'Supervision SCADA et automates (PLC)' },
    { id: 'c-7', texte: 'Électricité / Électronique' },
    { id: 'c-8', texte: 'Simulation de circuits (Proteus)' },
    { id: 'c-9', texte: 'Maintenance informatique' },
    { id: 'c-10', texte: 'Gestion de projet' },
    { id: 'c-11', texte: 'Résolution de problèmes' },
  ],
  centresInteret: "Basketball, Jeux d'Échecs",
  formations: [
    {
      id: 'f-1',
      debut: '2025',
      fin: '2026',
      diplome: 'Licence Professionnelle en Informatique Industrielle et Automatisme',
      etablissement: 'École Supérieure Technique La Salle - Douala',
    },
    {
      id: 'f-2',
      debut: '2023',
      fin: '2025',
      diplome: 'BTS en Informatique Industrielle et Automatisme',
      etablissement: 'École Supérieure Technique La Salle - Douala',
    },
    {
      id: 'f-3',
      debut: '2016',
      fin: '2023',
      diplome: 'Baccalauréat Scientifique (série C)',
      etablissement: 'Lycée Bilingue de Bonabéri - Douala',
    },
  ],
  experiences: [
    {
      id: 'e-1',
      debut: '2023',
      fin: '',
      enCours: true,
      poste: 'Technicien informatique indépendant',
      entreprise: 'Freelance - Douala',
      description: '', // Sans description pour tester l'affichage propre
    },
  ],
  projets: [
    {
      id: 'p-1',
      annee: '2026',
      role: "Développeur, projet de fin d'études SIMPSCE",
      description:
        'Système de maintenance prédictive développé en binôme (ESP32, Django/PostgreSQL, dashboard temps réel, diagnostic assisté par IA).',
    },
    {
      id: 'p-2',
      annee: '2025',
      role: 'Concepteur électrique, projet scolaire',
      description:
        'Inverseur de tension automatique à trois sources : schéma électrique, choix des composants, câblage, programmation, simulation sous Proteus.',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      annee: '2026',
      intitule: 'Cybercriminalité',
      organisme: 'UNODC',
    },
    {
      id: 'cert-2',
      annee: '2026',
      intitule: "Productivité, Emploi, Business : Maîtrisez l'IA",
      organisme: 'Orange Digital Center',
    },
  ],
};

export const EMPTY_CV: CVData = {
  photo: null,
  nom: '',
  titre: '',
  contact: {
    telephone: '',
    email: '',
    localisation: '',
    lien: '',
    permis: '',
  },
  profil: '',
  langues: [],
  competences: [],
  centresInteret: '',
  formations: [],
  experiences: [],
  projets: [],
  certifications: [],
};

export const SAMPLE_LETTER: CoverLetterData = {
  poste: "Technicien supérieur en automatisme et systèmes embarqués",
  entreprise: "Industries Camerounaises SARL",
  destinataire: "Madame la Directrice des Ressources Humaines",
  ville: "Douala",
  date: "5 octobre 2026",
  offre: "Nous recrutons un Technicien en Automatisme pour assurer la supervision de nos lignes de production automatisées, le diagnostic de pannes et l'optimisation des flux industriels.",
  ton: "Professionnel",
  longueur: "Standard",
  pointsForts: "Maîtrise des automates programmables, rigueur en maintenance prédictive, esprit d'initiative",
  objet: "Candidature au poste de Technicien supérieur en automatisme",
  formuleAppel: "Madame la Directrice,",
  paragraphes: [
    "Titulaire d'une formation approfondie en Informatique Industrielle et Automatisme à l'École Supérieure Technique La Salle de Douala, je me permets de vous adresser ma candidature pour le poste de Technicien en automatisme au sein de votre entreprise.",
    "Au cours de mes projets académiques et de mes missions indépendantes, j'ai notamment conçu un système complet de maintenance prédictive intégrant automates et transmission de données en temps réel. Cette expérience m'a permis de développer une méthode d'analyse rigoureuse et une forte réactivité face aux aléas techniques.",
    "Rejoindre votre structure représente pour moi l'opportunité de mettre mon savoir-faire technique au service de vos objectifs de productivité, tout en participant activement à la fiabilité de vos installations industrielles.",
  ],
  formulePolitesse: "Je vous prie d'agréer, Madame la Directrice, l'expression de mes salutations distinguées.",
};

export const EMPTY_LETTER: CoverLetterData = {
  poste: '',
  entreprise: '',
  destinataire: '',
  ville: 'Douala',
  date: '5 octobre 2026',
  offre: '',
  ton: 'Professionnel',
  longueur: 'Standard',
  pointsForts: '',
  objet: '',
  formuleAppel: 'Madame, Monsieur,',
  paragraphes: [],
  formulePolitesse: "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
};
