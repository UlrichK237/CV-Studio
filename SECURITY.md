# Politique de sécurité — CV Studio

## Signalement d'une vulnérabilité

La sécurité de CV Studio et la confidentialité des données de nos utilisateurs sont prises très au sérieux. Si vous découvrez une faille de sécurité ou une vulnérabilité potentielle, merci de nous la signaler de manière responsable avant toute divulgation publique.

### Contact de sécurité
- **E-mail de contact :** [À renseigner : ulrichkoundi05@gmail.com]
- **Délai de première réponse visé :** sous 48 heures ouvrées

Merci d'inclure dans votre signalement :
1. Une description détaillée de la vulnérabilité observée.
2. Les étapes précises ou un scénario de reproduction (PoC minimal).
3. Les composants ou routes concernés (ex. `/api/ai/...`).

### Mesures de sécurité en place
- Application sans base de données utilisateur ni stockage persistant de données personnelles sur nos serveurs.
- Validation stricte des entrées et typage (Zod, limites de taille de payload).
- En-têtes de sécurité HTTP stricts (Helmet, Content-Security-Policy, HSTS, Permissions-Policy).
- Limitation du débit de requêtes par IP (`express-rate-limit`) et plafond global quotidien en mémoire.
- Chiffrement en transit (HTTPS obligatoire en production).
