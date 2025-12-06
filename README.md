# Batasite

Site vitrine multi-client pour Batala La Rochelle et autres clients. Application full-stack Node.js + React avec base de données PostgreSQL.

## 🏗️ Architecture

- **Backend**: Node.js + Express avec TDD (Jest + Supertest)
- **Frontend**: React + Vite (développement statique)
- **Base de données**: PostgreSQL (via Docker)
- **Structure**: Multi-client prête pour l'évolutivité

## 📋 Prérequis

- Node.js 18+ 
- Docker et Docker Compose
- npm ou yarn

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Jean-Charles-Audebert/Batasite.git
cd Batasite
```

### 2. Configurer le Backend

```bash
cd backend
npm install
cp .env.example .env
```

Modifiez le fichier `.env` selon vos besoins.

### 3. Configurer le Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

### 4. Démarrer PostgreSQL avec Docker

```bash
cd ..
docker-compose up -d
```

Vérifiez que PostgreSQL est en cours d'exécution:
```bash
docker-compose ps
```

### 5. Initialiser la base de données

```bash
cd backend
npm run seed
```

## 🎯 Utilisation

### Démarrer le Backend (mode développement)

```bash
cd backend
npm run dev
```

Le backend sera accessible sur `http://localhost:3000`

### Démarrer le Frontend (mode développement)

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

### Exécuter les tests

```bash
cd backend
npm test
```

Mode watch pour le développement TDD:
```bash
npm run test:watch
```

## 📁 Structure du Projet

```
Batasite/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration (DB, etc.)
│   │   ├── controllers/    # Logique des contrôleurs
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Middlewares Express
│   │   ├── utils/          # Utilitaires
│   │   ├── tests/          # Tests unitaires et d'intégration
│   │   ├── app.js          # Configuration Express
│   │   └── index.js        # Point d'entrée
│   ├── seeds/              # Seeds et initialisation DB
│   │   ├── init.sql        # Schéma de base de données
│   │   ├── data.json       # Données de seed
│   │   └── seed.js         # Script de seeding
│   ├── .env.example        # Exemple de configuration
│   ├── jest.config.js      # Configuration Jest
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/     # Composants réutilisables
│   │   │   └── clients/    # Composants spécifiques clients
│   │   ├── services/       # Services API
│   │   ├── utils/          # Utilitaires
│   │   ├── App.jsx         # Composant principal
│   │   └── main.jsx        # Point d'entrée
│   ├── .env.example        # Exemple de configuration
│   └── package.json
├── docker-compose.yml      # Configuration Docker pour PostgreSQL
├── .gitignore
└── README.md
```

## 🗄️ Base de Données

### Schéma

**Table `clients`**
- `id`: Serial (PK)
- `name`: Nom du client
- `slug`: Identifiant URL unique
- `description`: Description du client
- `logo_url`: URL du logo
- `active`: Statut actif/inactif
- `created_at`, `updated_at`: Timestamps

**Table `content`**
- `id`: Serial (PK)
- `client_id`: FK vers clients
- `title`: Titre du contenu
- `content_type`: Type (text, image, video, gallery)
- `body`: Corps du contenu
- `media_url`: URL du média
- `published`: Statut publié
- `created_at`, `updated_at`: Timestamps

## 🔌 API Endpoints

### Clients

- `GET /api/clients` - Liste tous les clients
- `GET /api/clients/:identifier` - Récupère un client (par ID ou slug)
- `POST /api/clients` - Crée un nouveau client
- `PUT /api/clients/:id` - Met à jour un client
- `DELETE /api/clients/:id` - Supprime un client

### Content

- `GET /api/content/client/:clientId` - Liste le contenu d'un client
- `GET /api/content/:id` - Récupère un contenu spécifique
- `POST /api/content` - Crée un nouveau contenu
- `PUT /api/content/:id` - Met à jour un contenu
- `DELETE /api/content/:id` - Supprime un contenu

### Health Check

- `GET /health` - Vérification de l'état du serveur

## 🧪 Tests

Le backend utilise Jest et Supertest pour les tests TDD. Les tests couvrent:
- Routes API
- Contrôleurs
- Modèles
- Points d'entrée

Exécuter tous les tests:
```bash
cd backend && npm test
```

## 🐳 Docker

Le projet utilise Docker uniquement pour PostgreSQL:

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

## 🔒 Variables d'Environnement

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=batasite
DB_USER=postgres
DB_PASSWORD=postgres
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Multi-Client

L'application est structurée pour supporter plusieurs clients:

1. Chaque client a son propre enregistrement dans la table `clients`
2. Le contenu est associé à un client via `client_id`
3. L'interface frontend affiche dynamiquement le contenu par client
4. Prêt pour l'extension avec des thèmes/styles par client

## 📝 Développement TDD

Le backend suit une approche TDD stricte:

1. Écrire un test qui échoue
2. Implémenter le code minimum pour passer le test
3. Refactoriser
4. Répéter

Exemple de workflow:
```bash
# Terminal 1: Mode watch pour les tests
cd backend && npm run test:watch

# Terminal 2: Développement
cd backend && npm run dev
```

## 🤝 Contribution

1. Forker le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.
