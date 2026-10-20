# Guide de Déploiement en Production — WORLDORA

Ce document détaille les méthodes recommandées pour déployer l'application **WORLDORA** sur des infrastructures de production sécurisées et compatibles.

---

## 1. Prérequis Système

- **Node.js** version 20 LTS ou supérieure.
- **npm** version 10+ ou **pnpm**.
- Un nom de domaine avec certificat SSL / HTTPS actif (obligatoire pour la sécurité B2B et l'intégration WebView Android).
- Accès aux variables d'environnement de votre hébergeur.

---

## 2. Déploiement Standard (Vite + Node / Express / Nginx)

### Étape 1 : Installation et Compilation
```bash
# 1. Cloner ou décompresser l'archive du projet
cd worldora

# 2. Installer les dépendances
npm install

# 3. Compiler l'application optimisée pour la production
npm run build
```
Le dossier `dist/` contient alors l'ensemble des fichiers HTML, CSS et JavaScript compilés, minifiés et optimisés.

### Étape 2 : Lancement en Production avec Node / PM2
```bash
# Servir les fichiers statiques ou démarrer le serveur
npx serve -s dist -l 3000
# ou via un gestionnaire de processus (PM2) :
pm2 start "npx serve -s dist -l 3000" --name "worldora-b2b"
```

---

## 3. Déploiement Conteneurisé avec Docker

Un fichier `Dockerfile` prêt à l'emploi :

```dockerfile
# Étape 1 : Construction
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur de production allégé
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Commandes d'exécution :
```bash
docker build -t worldora-app .
docker run -d -p 80:80 --name worldora-production worldora-app
```

---

## 4. Déploiement sur Google Cloud Run

WORLDORA est nativement prêt pour Google Cloud Run (conteneurisé ou via Buildpacks) :

```bash
gcloud run deploy worldora-marketplace \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=8080
```

---

## 5. Passerelle Python / Flask (Si intégration backend Python souhaitée)

Si vous souhaitez servir cette interface ou connecter une API Flask existante :
```python
# app.py
from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='dist', static_url_path='')
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'default-dev-key')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

---

## 6. Checklist de Sécurité avant Mise en Ligne

- [x] HTTPS activé sur tout le domaine.
- [x] Variables d'environnement sensibles définies hors du code source.
- [x] Mode de débogage désactivé (`NODE_ENV=production` ou `FLASK_DEBUG=0`).
- [x] Fichiers `.env` et sauvegardes privées exclus du dépôt public.
- [x] Contrôle d'accès et authentification testés pour la messagerie et les produits.
