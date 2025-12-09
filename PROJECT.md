# Batasite — Project Specification

## 1. Objectifs

Batasite est un site vitrine SPA (Single Page Application) présentant les activités de Batala La Rochelle.  
La structure HTML de la page publique est **figée**, mais tous les contenus et apparences sont **dynamiques** via un panneau d'administration React sécurisé.

La page publique est actuellement servie par `/front/index.html`, `/front/index.css` et `/front/main.js`.

Un bouton flottant permettra l’accès au panel d’administration.

Le site sera déployé sur le domaine officiel `https://www.batala-lr.com/` après transfert DNS vers Cloudflare.

Seuls les contenus + les styles dynamiques changent grâce à :
- un fichier JSON global géré par l’admin
- un panneau React permettant de modifier ce JSON
- un backend Express + PostgreSQL qui stocke ce JSON en base dans un jsonb

**Le JSON global est la source unique de vérité.**

## Structure HTML publique (fixe)

L'admin ne modifie pas le HTML, seulement les contenus et styles via JSON.

- page
    - hero
        - logo
        - title
        - nav links
        - social links
    - sections (plusieurs)
        - présentation
        - séparateur
        - événements (cards)
        - séparateur
        - Mundo
        - séparateur
        - galerie 
            - images
            - vidéos
    - footer
        - nav links
        - btn contact-form modal
        - social links
        - copyright

## JSON global attendu (source unique de vérité)

Se baser toujours sur ce JSON pour le backend et le frontend public. (JSON exact et complet à construire selon les fichiers de la page publique). Les valeurs nulles ou vides sont acceptables si un élément n’est pas utilisé. Elles font référence à des valeurs par défaut. Par exemple, si le logo n’est pas utilisé, son objet peut être vide ou avec des valeurs nulles. Si "font-family" est vide, la font par défaut du CSS sera utilisée.
En commun : border-radius, ombre, couleurs, tailles, polices, positions (grille CSS), media-picker (image/gif/vidéo/local/YouTube), visibilité (bool)

```json
{
  "page": {
    "favicon": "/public/favicon.ico",
    "title": "Batala La Rochelle",
    "font-family": "Lithos, sans-serif",
    "font-weight": 900,
    "background": {
      "type": "color", 
      "value": "#000000",
      "image": "",
      "video": "",
      "youtube": ""
    }
  },
  "hero": {
    "logo": { "src": "", "size": "", "position": "", "visible": false },
    "title": { "text": "Batala La Rochelle", "font-family": "", "size": "", "color": "", "visible": false, "bg_color": "", "position": { "grid-column-start": "1", "grid-column-end": "12", "justify-content": "center" } },
    "navLinks": {
     "visible": true,
     "color": "",
     "size": "",
     "bg_color": "",
     "grid-column": "2-5",
     "justify-content": "flex-end",
      "items": [
        { "text": "Présentation", "href": "#presentation", "visible": true },
        { "text": "Événements", "href": "#events", "visible": true },
        { "text": "Galerie", "href": "#gallery", "visible": true },
        { "text": "Vidéos", "href": "#videos", "visible": true },
      ],
    },
    "socialLinks": [ ... ]
  },
  "sections": [
    {
      "type": "presentation",
      "content": { ... }
    },
    {
      "type": "separator",
      "content": { ... }
    },
    {
      "type": "events",
      "events": [ ... ]
    },
    {
      "type": "separator",
      "content": { ... }
    },
    {
      "type": "mundo",
      "content": { ... }
    },
    {
      "type": "separator",
      "content": { ... }
    },
    {
      "type": "gallery",
      "images": [ ... ],
      "videos": [ ... ]
    }
  ],
  "footer": {
    "navLinks": [ ... ],
    "socialLinks": [ ... ],
    "style": { ... }
  }
}
```

## 2. Contenu modifiable par l’admin

### 2.1 Page globale
- Favicon
- Couleur de fond
- Font family globale
- Font weight global
- Image/vidéo locale en fond
- Vidéo YouTube en fond

### 2.2 Hero
- Logo (src, taille, position L/C/R, visibilité)
- Titre (texte, police, taille, couleur, position)
- Nav links : visibilité, couleur, police, taille, position (devant le hero bas/gauche/droite/centre)
- Social links : visibilité, couleur, taille, position (devant le hero bas/gauche/droite/centre)

### 2.3 Sections
#### Séparateurs
- Type : image / gif / vidéo / vidéo YouTube / couleur / dégradé
- Taille, position, opacité

#### Présentation
- Média (image/gif/vidéo)
- Position (grille : col-span )
- Taille
- Texte (titre + paragraphes) : taille, couleur, fond, border-radius, ombre du container
- Titre : police, taille, couleur, couleur background, shadow, border-radius
- Paragraphes : police, taille, couleur, interligne, alignement, couleur background, shadow, border-radius

#### Événements (cards)
- modifier un événement (il y en a toujours 3). Modifier l'ordre des évènements par drag & drop. Modifier l'apparence globale des cards (taille, ombre, border-radius, background color/gradient/image) ou d'une card.
- Image
- Date, titre, description
- Style : police, couleur, border-radius, ombre (pour titre d'une part et description d'autre part)

#### Galerie images
- Remplacer une image
- Border-radius, ombre

#### Galerie vidéos
- Lien YouTube modifiable

### 2.4 Footer
- Nav links : visible / invisible, style
- Social links : visible / invisible, style
- Media background ou couleur
- Style du container (couleur, background, border-radius)

### Admins
- Gérer les comptes admin (CRUD)
- Seul update possible : activer/désactiver un compte (is_active bool)
- A la création, l'utilisateur reçoit un email avec un lien de reset de mot de passe

### Divers
- un .env à la racine est la source unique des valeurs sensibles (JWT secret, DB credentials, SMTP, etc.)

---

## 3. Technologies

- **Frontend public** : HTML, CSS, Vanilla JS
- **Frontend admin** : React + Vite
- **Backend** : Node.js + Express
- **Database** : PostgreSQL
- **Auth** : JWT Access + Refresh (httpOnly secure cookie)
- **Password hashing** : argon2id
- **Hosting** : Docker sur NAS Synology

---

## 4. Architecture et règles pour Copilot

### 4.1 Principes
- Code minimaliste, lisible, modulaire
- Aucun code mort
- Aucun `console.log` en production
- Respect de TDD : écrire d’abord les tests, ensuite le code  
- Architecture MVC strictement séparée
- Validation stricte côté backend (Zod ou validator natif)
- Pas de libs inutile (pas d’Axios → utiliser `fetch`)
- Endpoints RESTful propres et cohérents
- Éviter la duplication : services réutilisables (DRY) par exemple, media-picker commun, controlleurs communs pour les tailles/styles...
- Pas de "magie" : tout doit être explicite et testé

---

## 5. Structure Back-End attendue

/backend
/src
/config
db.js
/models
admin.model.js
section.model.js
element.model.js
navlink.model.js
sociallink.model.js
/controllers
auth.controller.js
admin.controller.js
content.controller.js
/services
auth.service.js
admin.service.js
content.service.js
/routes
auth.routes.js
admin.routes.js
content.routes.js
/middleware
auth.js
errorHandler.js
/utils
logger.js
validate.js
/tests
auth.test.js
content.test.js
admin.test.js
server.js


---

## 6. Base de données

### Règles
- Tables minimalistes
- Sections **fixes** (pas de création/suppression par l’admin)
- Les contenus modifiables vivent dans des `jsonb`
- Un seul “snapshot JSON” du contenu envoyé/validé côté backend

### Tables

#### admins
- id (PK)
- email (unique)
- password_hash
- role ('admin', 'superadmin')
- is_active (bool)
- created_at

#### refresh_tokens
- id (PK)
- admin_id (FK)
- token_hash
- exipires_at
- created_at

#### content
- id (PK)
- content (jsonb) → contient **le JSON global complet**
- updated_at

---

## 7. API Backend

### Auth
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Admins
- `GET /admin`
- `POST /admin`
- `PUT /admin/:id`
- `DELETE /admin/:id`

### Content
- `GET /content` → retourne **le JSON global**
- `PUT /content` → met à jour **toute la configuration** (sections + elements + nav + social)

> Toute modification passe par un **unique JSON global**, simplifiant l’éditeur.

Au démarrage du server, seed automatique du superadmin et de l'admin "test" dont les credentials sont dans le .env. (les passwords seront hashés avec argon2id)

---

## 8. Frontend public (index.html + index.css + main.js)

### Règles
- Aucun framework
- Code minimal
- Pas d’inline styles
- Tout se base sur `data-*` et classes CSS
- Chargement du JSON contenu via `/content`
- Application des styles dynamiques en JS pur
- Toutes les modifs d’apparence viennent du JSON

---

## 9. Frontend Admin (React)

### Règles
- Composants atomiques
- Hooks propres (state global via context, pas de redux ou de zustand)
- Un éditeur visuel basé sur un “schema JSON”
- Preview en temps réel
- Validation avant envoi
- Bouton “Annuler / Restaurer état initial”
- Un seul PUT final

### Structure
/admin
/src
/components
/pages
/services (fetch)
/context
App.jsx


---

## 10. Sécurité

- JWT Access très court (5 min)
- JWT Refresh longue durée (30j)
- Refresh token stocké en httpOnly + secure
- Argon2id pour les mots de passe
- Rate limiting sur /auth/login
- Validation systématique des entrées
- Pas de leak en erreur (message générique)

---

## 11. RGPD

- Bandeau cookie simple (Google/YT)
- Pas de tracking obligatoire
- Pas de cookies tiers hors YouTube
- Consentement stocké en localStorage

---

## 12. SEO

- Meta dynamiques
- Sitemap.xml généré
- robots.txt propre
- Preload des assets importants
- Lazyload des médias lourds

---

## 13. Roadmap

### Phase 1 — Infrastructure
- Structure backend + DB (docker, avec volumes)
- Routes auth + content
- Seed initial

### Phase 2 — Panel Admin React
- Login + refresh
- Fetch + édition du JSON global
- Preview live
- UI d’édition section/élément

### Phase 3 — Mise en production
- Dockerisation complète
- Reverse proxy Synology
- HTTPS via Cloudflare
