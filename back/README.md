# Backend - Batasite

## Architecture

```
src/
├── config/          # Configuration (DB, etc.)
├── models/          # Modèles de données (queries DB)
├── controllers/     # Logique métier (à implémenter)
├── routes/          # Routes API (à implémenter)
├── middleware/      # Middlewares Express
├── utils/           # Utilitaires (auth, validation, logger)
└── tests/           # Tests Jest
```

## Installation & Démarrage

### Avec Docker (recommandé)

```bash
# À la racine du projet
docker-compose up
```

Le backend démarrera automatiquement sur `http://localhost:3000`

### Développement local

**Prérequis**: PostgreSQL 16+

```bash
cd back

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

## Variables d'environnement

Voir `.env` à la racine du projet. Les variables principales :

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` - Credentials PostgreSQL
- `JWT_SECRET`, `JWT_REFRESH_SECRET` - Secrets JWT
- `SMTP_*` - Configuration email

## Modèles de données

### Admin
```javascript
{
  id: number (PK),
  email: string (unique),
  password_hash: string (argon2id),
  role: string ('admin' | 'superadmin'),
  is_active: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
}
```

### Content
```javascript
{
  id: number (PK),
  data: jsonb (contenu du site),
  created_at: timestamp,
  updated_at: timestamp,
  updated_by: number (FK admin)
}
```

## API Endpoints (à implémenter)

### Authentication
- `POST /auth/register` - Créer un admin
- `POST /auth/login` - Se connecter
- `POST /auth/refresh` - Rafraîchir le token
- `POST /auth/logout` - Se déconnecter

### Admin Management
- `GET /admin` - Lister les admins
- `POST /admin` - Créer un admin
- `PUT /admin/:id` - Mettre à jour un admin
- `DELETE /admin/:id` - Supprimer un admin

### Content Management
- `GET /content` - Récupérer le contenu global
- `PUT /content` - Mettre à jour le contenu
- `PATCH /content` - Mettre à jour partiellement
- `GET /content/history` - Historique des mises à jour

## Principes

- ✅ Code minimaliste et modulaire
- ✅ Aucun code mort
- ✅ Validation stricte (Joi)
- ✅ Gestion d'erreurs cohérente
- ✅ Logs informatifs
- ✅ TDD (tests en premier)
- ✅ DRY (pas de duplication)

## Tests

```bash
npm test                 # Exécuter les tests
npm run test:watch      # Mode watch
```

## Structure complète prête pour implémentation

✅ Configuration PostgreSQL
✅ Serveur Express avec middlewares
✅ Tables DB (admins, content)
✅ Modèles (admin.model, content.model)
✅ Utilitaires (auth, validation, logger)
✅ Middlewares (authentication, error handling)
✅ Docker & docker-compose
✅ Structure des routes (à compléter)

Prochaines étapes: Implémenter les controllers et routes API.
