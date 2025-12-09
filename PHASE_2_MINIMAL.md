# Phase 2 - React Admin Dashboard (Minimaliste)

## Principes Directeurs

✅ **ZÉRO lib externe non-essentielle**
- React Router uniquement (pour la navigation)
- Fetch API natif (pas axios)
- CSS Modules natif (pas Tailwind/Material)
- Context API natif (pas Redux/Zustand)

## Architecture

```
front/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx           (US-2.1)
│   │   ├── RegisterPage.jsx        (US-2.1)
│   │   ├── DashboardPage.jsx       (US-2.2)
│   │   ├── ContentPage.jsx         (US-2.3) - À faire
│   │   └── AdminPage.jsx           (US-2.4) - À faire
│   ├── components/
│   │   ├── ProtectedRoute.jsx      (Routes sécurisées)
│   │   ├── TestRunner.jsx          (Tests unitaires)
│   │   └── ApiTestComponent.jsx    (Vérif connexion)
│   ├── services/
│   │   └── api.js                  (Couche HTTP natif)
│   ├── contexts/
│   │   └── AuthContext.jsx         (State management)
│   ├── App.jsx                     (Routeur principal)
│   ├── main.jsx                    (Entry point)
│   └── __tests__/
│       └── api.test.js             (Tests service API)
```

## État du Projet

### ✅ COMPLÉTÉ (Sprint 1 - Phase 2.0)

**Pages implémentées:**
- Login (`/login`) - Formulaire email/password
- Register (`/register`) - Inscription avec validation
- Dashboard (`/dashboard`) - Layout avec sidebar navigation

**Services:**
- `api.js` - Service API minimaliste avec Fetch natif
  - ✓ GET, POST, PATCH, PUT, DELETE
  - ✓ Auth: register, login, logout, refresh
  - ✓ Content: CRUD endpoints
  - ✓ Admin: CRUD endpoints
  - ✓ Gestion tokens (localStorage)

**Sécurité:**
- `ProtectedRoute` - HOC pour routes privées
- `AuthContext` - State management sans lib
- Auto-logout si 401 (Unauthorized)

**Tests:**
- `api.test.js` - Tests unitaires du service API
- `TestRunner.jsx` - UI pour exécuter tests

### ⏳ À FAIRE

**US-2.3: Gestion du Contenu** (Prochaine: ~2-3 jours)
- [ ] Table de versions du contenu
- [ ] Formulaire d'édition WYSIWYG minimaliste
- [ ] Historique avec pagination
- [ ] Undo/Redo (optionnel)

**US-2.4: Gestion des Administrateurs** (Prochaine: ~2-3 jours)
- [ ] Liste des admins avec filtres
- [ ] Création/édition admin
- [ ] Changement de rôle
- [ ] Désactivation d'admins

**US-2.5: Polish & Tests E2E** (~1-2 jours)
- [ ] Tests E2E (Cypress/Playwright si nécessaire)
- [ ] Responsive design
- [ ] Accessibilité (ARIA labels)
- [ ] Performance optimization

## Stack Technique

```
Frontend:
  - React 19.2.0
  - React Router 6
  - Vite 7.2
  - CSS Modules (natif)
  - Fetch API (natif)

Backend (existant):
  - Node.js 20
  - Express 5.2
  - PostgreSQL 16
  - JWT + Argon2id
```

## Configuration

### .env.local
```
VITE_API_URL=http://localhost:3000
```

### Démarrage
```bash
# Terminal 1: Backend
cd back
npm start

# Terminal 2: Frontend
cd front
npm run dev

# Accéder à: http://localhost:5174
```

## Stratégie de Gestion d'État

**Sans Redux/Zustand, on utilise:**
1. `Context API` - État global (Auth)
2. `useState` - État local (formulaires, UI)
3. `localStorage` - Tokens + preferences
4. `Fetch` natif - Requêtes HTTP

### Pattern pour fetch simple:
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  api.getContent()
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

## Styles

**Approche CSS:**
- CSS Modules (.module.css)
- Pas de framework CSS
- Variables CSS pour cohérence
- Mobile-first responsive

### Variables CSS globales (à mettre dans App.css):
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --error-color: #e74c3c;
  --success-color: #27ae60;
  --text-color: #333;
  --border-color: #ddd;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

## Tests

**Structure de tests minimaliste:**
```javascript
// src/__tests__/api.test.js
export async function runApiTests() {
  // Tests sans framework
  assert(condition, 'message');
  await test('name', async () => { /* ... */ });
  return { passed, failed, total };
}
```

**Exécuter les tests:**
```jsx
import { TestRunner } from './components/TestRunner';

// Dans votre page de dev
<TestRunner />
```

## Roadmap Détaillée

### Phase 2.1 (DONE ✓) - Base Frontend
- [x] React Router setup
- [x] AuthContext + useAuth hook
- [x] Login/Register pages
- [x] Dashboard layout
- [x] API service (Fetch natif)
- [x] Protected routes
- [x] Tests unitaires API

### Phase 2.2 (TODO - 2-3 jours)
- [ ] Content management page
- [ ] Content editor (textarea minimaliste)
- [ ] Version history + pagination
- [ ] Restore/Preview versions

### Phase 2.3 (TODO - 2-3 jours)
- [ ] Admin management page
- [ ] Admin CRUD forms
- [ ] Role assignment UI
- [ ] Activity log viewer

### Phase 2.4 (TODO - 1-2 jours)
- [ ] Responsive design
- [ ] Dark mode (optionnel)
- [ ] Keyboard shortcuts (optionnel)
- [ ] Notifications/Toast (optionnel)

### Phase 2.5 (TODO - 1-2 jours)
- [ ] E2E tests
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] Documentation complète

## Commandes Utiles

```bash
# Dev server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint
npm run lint

# Tests (manuels via TestRunner UI)
```

## Patterns Adoptés

### 1. Service API minimaliste
```javascript
// Pas de axios, juste Fetch
async request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    ...options
  });
  return response.json();
}
```

### 2. Context pour auth
```javascript
// Pas de Redux
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
```

### 3. Composants réutilisables
```javascript
// Composition simple
function Form({ onSubmit }) {
  // ...
}
```

## Notes de Développement

- **Pas de breaking changes**: Chaque feature ajoutée est isolée
- **Tests d'abord**: Écrire les tests avant le code
- **Clean code**: Commentaires JSDoc, noms explicites
- **Accessibilité**: ARIA labels, semantic HTML
- **Mobile-first**: Breakpoints: 768px, 1024px

## Prochaines Étapes

1. **MAINTENANT**: Tester la connexion Login → Dashboard
2. **Puis**: Implémenter US-2.3 (Content Management)
3. **Puis**: Implémenter US-2.4 (Admin Management)
4. **Puis**: Tester, Polish, Documentation

---

**Status**: 🟢 Phase 2.1 Prête, Backend fonctionnel, Frontend en développement
**Dernière mise à jour**: Dec 9, 2025
