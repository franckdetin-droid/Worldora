# WORLDORA — Marketplace B2B Internationale

WORLDORA est une plateforme web moderne de commerce B2B reliant acheteurs internationaux et fournisseurs certifiés. Elle remplace définitivement les formulaires de devis impersonnels par une **messagerie directe sécurisée**, propose un catalogue d'offres catégorisées avec fiches techniques (PDF), une **régie publicitaire vidéo B2B** et un **tableau de bord super-administrateur** avec analyse des visiteurs par pays.

---

## 1. Technologies Utilisées

- **Frontend & Applet** : React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion.
- **Régie Vidéo & Multimédia** : Lecteur HTML5 réactif, uploads vidéo locaux et intégration directe dans le flux produit.
- **Gestion des Fichiers & Sécurité** : Drag & Drop, validation MIME, blocage des exécutables, processeur DataURL base64 et exportateur ZIP sécurisé (`jszip`).
- **Persistance & Données** : Couche de stockage sécurisée avec amorçage instantané et contrôle d'accès strict (RBAC).
- **Compatibilité Mobile** : Conception mobile-first optimisée pour smartphones Android et intégration WebView native.

---

## 2. Prérequis

- Node.js version 20+
- npm version 10+
- Navigateur moderne (Chrome, Safari, Firefox, Edge) ou smartphone Android.

---

## 3. Installation et Démarrage

```bash
# 1. Cloner le projet ou décompresser l'archive ZIP
cd worldora

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement modèle
cp .env.example .env

# 4. Lancer le serveur de développement
npm run dev
```

L'application est immédiatement accessible à l'adresse `http://localhost:3000`.

---

## 4. Compilation pour la Production

```bash
# Compiler l'application optimisée
npm run build

# Prévisualiser la version de production localement
npm run preview
```

---

## 5. Fonctionnalités Clés

1. **Messagerie Directe Privée** :
   - Remplacement complet des demandes de devis par le bouton « Envoyer un message » sur chaque produit.
   - Rattachement automatique au produit concerné (photo, titre, prix de référence).
   - Envoi de pièces jointes (fiches PDF, photos d'échantillons).
   - Accès strictement réservé aux deux interlocuteurs.

2. **Catalogue & Fiches Techniques** :
   - Filtres par catégorie, pays d'origine, prix et MOQ.
   - Téléchargement des fiches techniques PDF et certificats joints.
   - Exclusion stricte des brouillons en consultation publique.

3. **Espace Super-Administrateur (Créateur du site)** :
   - Compte pré-configuré : `admin@worldora.com`.
   - Statistiques des visiteurs en temps réel réparties par pays (Côte d'Ivoire 🇨🇮, France 🇫🇷, Sénégal 🇸🇳, etc.).
   - Régie publicitaire vidéo B2B (upload de vidéos et suivi des vues/clics).
   - Modération des comptes et attribution du badge « Fournisseur Vérifié ».
   - **Exportateur ZIP complet et sécurisé** avec rapport d'audit.

---

## 6. Tests et Validation de Sécurité

Exécutez la validation des types TypeScript et la vérification du code :
```bash
npm run lint
```
Tous les contrôles d'accès côté service vérifient l'identité et les permissions pour chaque opération.

---

## 7. Licence et Droits
© WORLDORA — Tous droits réservés.
