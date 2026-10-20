# Variables d'Environnement — WORLDORA B2B Marketplace

Ce document détaille l'intégralité des variables d'environnement requises et recommandées pour exécuter et déployer l'application **WORLDORA** en développement et en production.

---

## Règle de Sécurité Absolue

> **IMPORTANT** : Ne commitez JAMAIS de fichier `.env` contenant de véritables clés privées, mots de passe ou secrets dans un dépôt public Git ou dans une archive non chiffrée. Utilisez exclusivement `.env.example` comme modèle avec des valeurs factices.

---

## 1. Variables Principales

### `APP_URL`
- **Service** : Hôte de l'application WORLDORA (Cloud Run, VPS, domaine personnalisé).
- **Utilité** : Utilisée pour les liens d'accès direct, les redirections après authentification, les Webhooks et la génération des balises OpenGraph et métadonnées.
- **Obligatoire / Facultatif** : Obligatoire en production, facultatif en développement local (défaut : `http://localhost:3000`).
- **Où obtenir la valeur** : Fournie automatiquement par votre hébergeur (ex: URL du service Google Cloud Run, domaine `https://worldora.com`, etc.).
- **Configuration en Production** : Définir dans les variables d'environnement de votre plateforme d'hébergement :
  ```bash
  APP_URL=https://www.worldora.com
  ```
- **Séparation Dev / Prod** : Oui (`http://localhost:3000` en local, `https://votre-domaine.com` en production).

---

### `SECRET_KEY` / `FLASK_SECRET_KEY`
- **Service** : Sécurité des sessions et chiffrement des cookies / jetons.
- **Utilité** : Signature cryptographique des sessions d'authentification utilisateur et protection CSRF des formulaires.
- **Obligatoire / Facultatif** : Obligatoire en production.
- **Où obtenir la valeur** : Générer une clé aléatoire forte de 64 caractères hexadécimaux :
  ```bash
  python -c 'import secrets; print(secrets.token_hex(32))'
  # ou via node :
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Configuration en Production** : Injecter en variable secrète (Secret Manager ou variables d'environnement système).
- **Séparation Dev / Prod** : Oui (ne jamais réutiliser la clé locale en production).

---

### `GEMINI_API_KEY`
- **Service** : Google AI Studio / Gemini API (`@google/genai`).
- **Utilité** : Traduction automatique multilingue des fiches produits (FR / EN / ES / AR), assistance à la rédaction des descriptions B2B et modération intelligente.
- **Obligatoire / Facultatif** : Facultatif (le catalogue et la messagerie fonctionnent de manière autonome sans l'API).
- **Où obtenir la valeur** : Obtenez gratuitement votre clé API sur [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Configuration en Production** : Définir dans le gestionnaire de secrets :
  ```bash
  GEMINI_API_KEY="AIzaSy..."
  ```
- **Séparation Dev / Prod** : Clé partagée ou clé dédiée de production avec quotas configurés.

---

### `PORT`
- **Service** : Serveur HTTP web.
- **Utilité** : Port d'écoute pour l'application.
- **Obligatoire / Facultatif** : Facultatif (par défaut : `3000` ou `8080` sur Cloud Run).
- **Où obtenir la valeur** : Déterminée par l'environnement d'exécution (ex. Cloud Run injecte automatiquement `PORT=8080`).

---

### `NODE_ENV` / `FLASK_ENV`
- **Service** : Environnement d'exécution.
- **Utilité** : Définit si l'application tourne en mode débogage ou optimisée pour la production.
- **Obligatoire / Facultatif** : Fortement recommandé en production (`production`).
- **Séparation Dev / Prod** :
  - En développement : `development`
  - En production : `production` (désactive le mode debug pour éviter l'exposition d'informations sensibles).

---

## 2. Exemple de fichier `.env.example`

```bash
# WORLDORA — Configuration d'environnement modèle
# Copiez ce fichier vers .env et renseignez vos véritables valeurs (ne commitez jamais .env)

APP_URL="http://localhost:3000"
SECRET_KEY="remplacez_par_une_cle_secrete_aleatoire_de_64_caracteres"
GEMINI_API_KEY="VOTRE_CLE_GOOGLE_AI_STUDIO_OPTIONNELLE"
PORT=3000
NODE_ENV="production"
```
