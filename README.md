# CV Studio

CV Studio est une application web moderne de création de curriculum vitae professionnel et de lettre de motivation assistée par IA, au format strict A4 avec export PDF haute fidélité.

## Fonctionnalités principales
- **10 modèles de CV A4 professionnels** : personnalisables (polices, palettes de couleurs, espacement compact ou aéré).
- **Lettre de motivation intégrée** : accordée au style graphique du CV sélectionné, avec ajustement de la taille de texte en points (10 à 13 pt).
- **Exports PDF doubles** :
  - *PDF (texte sélectionnable)* : rendu vectoriel net A4 via le moteur natif du navigateur, texte indexable par les recruteurs et ATS.
  - *PDF image* : rendu pixel-perfect haute résolution (copie exacte de l'aperçu écran).
- **Assistance IA (Google Gemini)** :
  - Reformulation et amélioration percutante du profil et des expériences.
  - Rédaction et adaptation ciblée de lettre de motivation à partir d'une offre d'emploi.
  - Pré-remplissage automatique par import de CV (PDF ou image).
- **Confidentialité par défaut** : stockage local dans le navigateur (`localStorage`), sans compte utilisateur requis.

## Prérequis
- Node.js version 22 ou supérieure (`node >= 22`).
- npm version 10 ou supérieure.

## Installation locale
```bash
# Cloner le dépôt
git clone <url-du-depot>
cd cv-studio

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Renseigner votre GEMINI_API_KEY dans .env

# Lancer en mode développement (serveur Express + Vite middleware)
npm run dev
```

## Déploiement

L'application est conçue pour être déployée facilement sur un service Node classique (comme Render, Railway, Fly.io ou VPS).

### Variables d'environnement requises
Sur votre plateforme d'hébergement, configurez les variables d'environnement suivantes dans les paramètres du service :
- `NODE_ENV` : définir à `production`
- `PORT` : port d'écoute fourni automatiquement par l'hébergeur (ou `3000` par défaut)
- `GEMINI_API_KEY` : votre clé d'API Google Gemini (console Google AI Studio / Google Cloud)
- `MAX_DAILY_AI_REQUESTS` : plafond global quotidien de requêtes IA (optionnel, défaut : `500`)
- `STRICT_FRAMING` : définir à `true` sur Render en production pour activer les protections anti-intégration strictes (`frame-ancestors 'none'` et `X-Frame-Options: DENY`). Laisser vide ou non défini dans les environnements de prévisualisation intégrés (AI Studio).

### Commandes de build et démarrage
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start` (exécute `NODE_ENV=production tsx server.ts`)
- **Health Check Path** : `/healthz`

### Médias optionnels
Pour activer la vidéo d'arrière-plan du hero sur la page d'accueil, déposez votre fichier `hero.mp4` dans `public/media/hero.mp4`. En l'absence de ce fichier, l'affiche `hero-poster.jpg` est automatiquement affichée sans fond noir.
