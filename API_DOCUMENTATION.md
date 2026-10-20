# Documentation des API et Services — WORLDORA

Ce document détaille les points de terminaison, services de données et contrôles de sécurité effectivement présents dans la marketplace B2B **WORLDORA**.

---

## 1. Vue d'ensemble de la Sécurité

Chaque opération respecte les règles fondamentales :
- **Authentification requise** pour : envoyer un message, ouvrir une conversation, ajouter/modifier/supprimer un produit, accéder au tableau de bord ou à l'administration.
- **Contrôle d'accès strict (RBAC)** :
  - Seul le fournisseur propriétaire d'un produit peut le modifier ou le supprimer.
  - Seuls les participants légitimes d'une conversation (`buyerId` ou `supplierId`) peuvent en lire ou envoyer des messages.
  - Seul l'administrateur (`isAdmin: true`) peut accéder à l'export ZIP, à la modération et à la régie publicitaire.

---

## 2. Services d'Authentification

### `POST /api/auth/register`
- **Utilité** : Inscription d'un nouvel utilisateur (Acheteur, Fournisseur ou les deux).
- **Paramètres attendus** :
  ```json
  {
    "name": "Jean Dupont",
    "email": "contact@entreprise.com",
    "password": "••••••••",
    "accountType": "buyer" | "supplier" | "both",
    "companyName": "Raison Sociale SARL",
    "country": "France",
    "city": "Paris",
    "description": "Présentation de l'entreprise",
    "phone": "+33 1 00 00 00 00"
  }
  ```
- **Réponse** : `{ "success": true, "user": { "id": "user-...", "name": "...", ... } }`
- **Erreurs possibles** : `400 Bad Request` (champs obligatoires manquants), `409 Conflict` (e-mail déjà enregistré).

### `POST /api/auth/login`
- **Utilité** : Connexion sécurisée.
- **Paramètres attendus** : `{ "email": "...", "password": "..." }`
- **Réponse** : `{ "success": true, "user": { ... } }`

---

## 3. Services Catalogue & Produits

### `GET /api/products`
- **Utilité** : Récupérer le catalogue public des offres B2B.
- **Règle absolue** : Les produits avec le statut `"draft"` (brouillon) sont **strictement exclus** du catalogue public.
- **Paramètres de filtre optionnels** :
  - `search` (recherche par nom, marque, catégorie, fournisseur)
  - `category` (ex: "Agroalimentaire & Matières premières")
  - `country` (ex: "Côte d'Ivoire")
  - `minPrice`, `maxPrice`
  - `sortBy` : `recent` | `price-asc` | `price-desc` | `moq-asc`
- **Réponse** : Tableau d'objets `Product`.

### `POST /api/products`
- **Utilité** : Publication ou enregistrement en brouillon d'une offre.
- **Autorisation** : Utilisateur connecté (`supplier` ou `both`).
- **Paramètres** :
  - `name`, `category`, `description`, `price`, `currency`, `unit`, `minOrderQty` (MOQ), `countryOfOrigin`, `images`, `status` ("published" ou "draft"), `documents` (optionnel).
- **Réponse** : `{ "success": true, "product": { ... } }`

### `PUT /api/products/:id`
- **Utilité** : Modification d'un produit.
- **Autorisation** : Propriétaire du produit (`product.supplierId === currentUserId`) ou Super-Admin.

### `DELETE /api/products/:id`
- **Utilité** : Suppression définitive d'un produit.
- **Autorisation** : Propriétaire du produit ou Super-Admin.

---

## 4. Services de Messagerie Directe (Remplacement Devis)

### `POST /api/conversations`
- **Utilité** : Ouvrir ou récupérer une conversation privée entre un acheteur et un fournisseur au sujet d'un produit.
- **Règle anti-auto-contact** : Empêche formellement un fournisseur de se contacter lui-même pour son propre produit.
- **Paramètres** : `{ "buyerId": "...", "supplierId": "...", "productId": "..." }`
- **Réponse** : `{ "success": true, "conversation": { ... } }`

### `GET /api/conversations/:id/messages`
- **Utilité** : Récupérer l'historique chronologique des messages.
- **Autorisation** : L'utilisateur connecté DOIT être le `buyerId` ou le `supplierId` de la conversation. Les tiers sont refoulés (`403 Forbidden`).

### `POST /api/conversations/:id/messages`
- **Utilité** : Envoyer un message direct avec pièce jointe optionnelle (PDF, photo).
- **Paramètres** :
  ```json
  {
    "content": "Bonjour, nous souhaitons commander 20 tonnes...",
    "attachment": {
      "name": "specifications.pdf",
      "url": "data:application/pdf;base64,...",
      "size": "2.4 Mo",
      "type": "pdf"
    }
  }
  ```

---

## 5. Services Régie Publicitaire Vidéo B2B & Administration

### `GET /api/admin/videos`
- **Utilité** : Récupérer les publicités vidéos actives pour le flux continu ou la gestion.
- **Réponse** : Tableau d'objets `AdVideo` (titre, URL vidéo, marque, pays, vues, clics, CTA).

### `POST /api/admin/videos`
- **Utilité** : Enregistrer une nouvelle annonce vidéo avec fichier uploadé ou URL vidéo.
- **Autorisation** : Super-Admin uniquement.

### `GET /api/admin/analytics/visitors`
- **Utilité** : Obtenir la répartition géographique en temps réel des visiteurs par pays (Côte d'Ivoire, France, Sénégal, Maroc, etc.).
- **Autorisation** : Super-Admin uniquement.

### `GET /api/admin/export-project`
- **Utilité** : Générer et télécharger l'archive ZIP complète du projet WORLDORA avec audit de sécurité.
- **Autorisation** : Super-Admin uniquement.
