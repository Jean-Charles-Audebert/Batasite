# Frontend Architecture - Deux applications

## Vue d'ensemble

Le projet frontend a **deux applications distinctes** :

### 1. Site Vitrine (index.html)
- **Route**: `/` (racine du site)
- **Contenu**: Page statique du site Batala La Rochelle
- **Tech**: HTML + CSS + JavaScript natif
- **Accès**: `http://localhost:5174/`

### 2. Admin Dashboard (admin.html)
- **Route**: `/admin.html` ou `/admin`
- **Contenu**: Dashboard React d'administration
- **Tech**: React 19 + React Router + Fetch API
- **Accès**: `http://localhost:5174/admin.html`

## Structure

```
front/
├── index.html              ← Page statique (site vitrine)
├── admin.html              ← Entry point admin (React app)
├── src/
│   ├── main.jsx           ← Entry pour index.html
│   ├── admin.jsx          ← Entry pour admin.html
│   ├── App.jsx            ← Root de l'app React
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── DashboardPage.jsx
│   └── ...
└── vite.config.js
```

## Routes API

### Backend (/auth endpoints)
```
POST   /auth/register         → Inscription
POST   /auth/login            → Connexion
POST   /auth/logout           → Déconnexion
POST   /auth/refresh          → Refresh token

GET    /content               → Récupérer contenu
PUT    /content               → Remplacer contenu
PATCH  /content               → Merge contenu
GET    /content/history       → Historique

GET    /admin                 → Lister admins
GET    /admin/:id             → Récupérer admin
PATCH  /admin/:id             → Modifier admin
DELETE /admin/:id             → Supprimer admin
```

### Frontend Routes (Admin React)
```
GET    /login                 → Page connexion
GET    /register              → Page inscription
GET    /dashboard             → Dashboard (protégé)
GET    /dashboard/content     → Gestion contenu (US-2.3)
GET    /dashboard/admins      → Gestion admins (US-2.4)
```

## Démarrage

```bash
# Terminal 1 - Backend
cd back
npm start

# Terminal 2 - Frontend
cd front
npm run dev
```

### Accès
- **Site vitrine**: http://localhost:5174/
- **Admin dashboard**: http://localhost:5174/admin.html
- **API backend**: http://localhost:3000

## Build Production

```bash
# Build admin + vitrine ensemble
npm run build

# Output dans /dist
dist/
├── index.html      ← Site vitrine
├── admin.html      ← Admin app
├── assets/         ← JS + CSS
└── ...
```

## Notes d'Architecture

1. **Séparation propre**: Admin isolé, pas de conflit avec le site statique
2. **Pas de monorepo complexity**: Un seul build Vite, deux entry points
3. **API endpoints clairs**: `/auth/*` pour auth, `/content` + `/admin` pour data
4. **Frontend routes simples**: `/login`, `/register`, `/dashboard`

---

**Statut**: 🟢 Architecture corrigée
**Date**: Dec 9, 2025
