# 📝 BATASITE - User Stories & Tickets

> Sprint-based user stories avec acceptance criteria et tasks breakdown

---

## 🎯 SPRINT 1.5: Content Management (Semaine 3 décembre)

### US-1.5.1: [BACKEND] Content Retrieval API
**Status**: ⏳ TODO  
**Points**: 5  
**Priority**: HIGH  

**User Story:**
> En tant qu'administrateur, je veux récupérer le contenu global du site en JSON, afin de pouvoir l'éditer dans le panel admin.

**Acceptance Criteria:**
- ✅ L'endpoint GET `/content` retourne le JSON global complet
- ✅ La réponse inclut `id`, `content` (JSONB), `updated_at`, `updated_by`
- ✅ Seuls les admins authentifiés peuvent accéder (JWT required)
- ✅ Retourne 404 si aucun contenu n'existe (initialise avec `{}`)
- ✅ Logs d'accès dans le système

**Tasks:**
- [ ] T1: Écrire test `GET /content` returns 200 + JSONB
- [ ] T2: Écrire test `GET /content` requires JWT
- [ ] T3: Implémenter `content.controller.js` - `getContent()`
- [ ] T4: Implémenter routes
- [ ] T5: Tests intégration
- [ ] T6: Documentation endpoint

**Definition of Done:**
- [ ] Tests: ✅ Passing
- [ ] Code review: ✅ Approved
- [ ] Documentation: ✅ Updated
- [ ] No console errors: ✅ Verified

---

### US-1.5.2: [BACKEND] Content Update API
**Status**: ⏳ TODO  
**Points**: 8  
**Priority**: HIGH  

**User Story:**
> En tant qu'administrateur, je veux mettre à jour le contenu global, afin que toutes les modifications d'apparence du site soient persistées.

**Acceptance Criteria:**
- ✅ L'endpoint PUT `/content` accepte un JSONB complet
- ✅ Valide les données contre un schéma Joi
- ✅ Enregistre `updated_by` avec l'ID de l'admin
- ✅ Met à jour `updated_at` à la date courante
- ✅ Retourne le contenu mis à jour
- ✅ Seuls les admins authentifiés peuvent modifier
- ✅ Logs d'audit (qui, quand, quoi)

**Tasks:**
- [ ] T1: Écrire test `PUT /content` updates JSONB
- [ ] T2: Écrire test `PUT /content` requires JWT + admin role
- [ ] T3: Écrire test `PUT /content` validates schema
- [ ] T4: Écrire test `PUT /content` tracks updated_by
- [ ] T5: Implémenter `content.controller.js` - `updateContent()`
- [ ] T6: Implémenter routes
- [ ] T7: Tests intégration avec JWT
- [ ] T8: Documentation + exemples cURL

**Definition of Done:**
- [ ] Tests: ✅ Passing (>80% coverage)
- [ ] Code review: ✅ Approved
- [ ] Audit logs: ✅ Working
- [ ] Documentation: ✅ Updated

---

### US-1.5.3: [BACKEND] Content Partial Update (PATCH)
**Status**: ⏳ TODO  
**Points**: 5  
**Priority**: MEDIUM  

**User Story:**
> En tant qu'administrateur, je veux faire des mises à jour partielles du contenu (ex: une seule section), afin de ne pas avoir à renvoyer l'ensemble du JSON à chaque fois.

**Acceptance Criteria:**
- ✅ L'endpoint PATCH `/content` accepte un objet partiel
- ✅ Fusionne avec le contenu existant (deep merge)
- ✅ N'écrase pas les champs non fournis
- ✅ Valide les données partielles
- ✅ Retourne le contenu fusionné complet

**Tasks:**
- [ ] T1: Écrire test `PATCH /content` merges data correctly
- [ ] T2: Écrire test `PATCH /content` doesn't overwrite missing fields
- [ ] T3: Implémenter `patchContent()` avec deep merge
- [ ] T4: Tests intégration
- [ ] T5: Documentation avec exemples

---

### US-1.5.4: [BACKEND] Content History API
**Status**: ⏳ TODO  
**Points**: 3  
**Priority**: MEDIUM  

**User Story:**
> En tant qu'administrateur, je veux consulter l'historique des modifications du contenu, afin de tracer qui a modifié quoi et quand.

**Acceptance Criteria:**
- ✅ GET `/content/history` retourne les N dernières versions
- ✅ Inclut: `id`, `content`, `updated_at`, `email` (de l'admin)
- ✅ Triées par `updated_at` DESC (plus récent d'abord)
- ✅ Limite par défaut: 20 versions (customizable via query param `limit`)

**Tasks:**
- [ ] T1: Écrire test `GET /content/history` returns array
- [ ] T2: Écrire test `GET /content/history` respects limit
- [ ] T3: Implémenter `getContentHistory()`
- [ ] T4: Tests intégration
- [ ] T5: Documentation

---

### US-1.5.5: [BACKEND] Admin CRUD - Read Operations
**Status**: ⏳ TODO  
**Points**: 5  
**Priority**: HIGH  

**User Story:**
> En tant que superadmin, je veux lister tous les admins et voir leurs détails, afin de gérer les accès.

**Acceptance Criteria:**
- ✅ GET `/admin` retourne la liste de tous les admins
- ✅ GET `/admin/:id` retourne un admin spécifique
- ✅ Inclut: `id`, `email`, `role`, `is_active`, `created_at`
- ✅ N'inclut pas les `password_hash`
- ✅ Seul superadmin peut lister/voir les admins

**Tasks:**
- [ ] T1: Écrire test `GET /admin` returns all admins
- [ ] T2: Écrire test `GET /admin/:id` returns one admin
- [ ] T3: Écrire test endpoints require superadmin role
- [ ] T4: Implémenter `admin.controller.js` - `getAllAdmins()`, `getAdminById()`
- [ ] T5: Tests intégration
- [ ] T6: Documentation

---

### US-1.5.6: [BACKEND] Admin CRUD - Update/Delete Operations
**Status**: ⏳ TODO  
**Points**: 8  
**Priority**: HIGH  

**User Story:**
> En tant que superadmin, je veux gérer les admins (activer/désactiver, supprimer), afin de contrôler les accès.

**Acceptance Criteria:**
- ✅ PATCH `/admin/:id` permet d'activer/désactiver un admin (`is_active`)
- ✅ DELETE `/admin/:id` supprime un admin
- ✅ L'opération retourne le statut final
- ✅ Seul superadmin peut modifier/supprimer
- ✅ Un admin ne peut pas se supprimer lui-même
- ✅ Logs d'audit de ces opérations

**Tasks:**
- [ ] T1: Écrire test `PATCH /admin/:id` updates is_active
- [ ] T2: Écrire test `DELETE /admin/:id` removes admin
- [ ] T3: Écrire test cannot delete self
- [ ] T4: Implémenter `updateAdmin()`, `deleteAdmin()`
- [ ] T5: Tests intégration avec permissions
- [ ] T6: Documentation

---

### US-1.5.7: [BACKEND] Protected Routes Middleware
**Status**: ⏳ TODO  
**Points**: 3  
**Priority**: HIGH  

**User Story:**
> En tant que développeur, je veux un middleware de protection des routes, afin que seuls les admins authentifiés accèdent aux endpoints sensibles.

**Acceptance Criteria:**
- ✅ Middleware `auth` vérifie la présence d'un JWT valide
- ✅ Extraction de `id`, `email`, `role` du token
- ✅ Middleware `superadminOnly` vérifie le rôle
- ✅ Retourne 401 si pas d'authentification
- ✅ Retourne 403 si rôle insuffisant
- ✅ Ajoute `req.user` pour les routes protégées

**Tasks:**
- [ ] T1: Écrire test auth middleware validates JWT
- [ ] T2: Écrire test auth middleware rejects invalid JWT
- [ ] T3: Écrire test superadminOnly checks role
- [ ] T4: Implémenter middlewares
- [ ] T5: Appliquer aux routes sensibles
- [ ] T6: Tests intégration

---

## 🎯 SPRINT 2: Admin Panel React (Semaine 1 janvier)

### US-2.1: [FRONTEND] React Project Setup
**Status**: ⏳ TODO  
**Points**: 3  
**Priority**: HIGH  

**User Story:**
> En tant que développeur frontend, je veux un projet React proprement structuré, afin de démarrer l'admin panel.

**Acceptance Criteria:**
- ✅ Vite + React 18 + ESLint + Prettier
- ✅ Dossier `/admin` avec structure claire
- ✅ Context API pour state global
- ✅ React Router configuré
- ✅ Services folder pour fetch API
- ✅ Tests setup (Jest/Vitest)

**Tasks:**
- [ ] T1: Create `/admin` project avec Vite
- [ ] T2: Configure ESLint + Prettier
- [ ] T3: Setup Context API
- [ ] T4: Setup React Router
- [ ] T5: Create services folder structure
- [ ] T6: Setup Jest/Vitest

---

### US-2.2: [FRONTEND] Authentication Flow
**Status**: ⏳ TODO  
**Points**: 8  
**Priority**: HIGH  

**User Story:**
> En tant qu'administrateur, je veux me connecter et me déconnecter du panel, afin d'accéder à l'édition du contenu.

**Acceptance Criteria:**
- ✅ Page login avec form email + password
- ✅ Call POST `/auth/login` et stocke tokens
- ✅ Tokens stockés en localStorage (httpOnly non possible en front)
- ✅ Refresh automatique du token avant expiration
- ✅ Bouton logout → POST `/auth/logout`
- ✅ Redirect vers login si pas d'authentification
- ✅ Affiche erreurs login de façon claire

**Tasks:**
- [ ] T1: Create LoginPage component
- [ ] T2: Create AuthContext
- [ ] T3: Implement login service
- [ ] T4: Implement token refresh logic
- [ ] T5: Create ProtectedRoute component
- [ ] T6: Create logout functionality
- [ ] T7: Component tests

---

### US-2.3: [FRONTEND] Content Editor - Schema Viewer
**Status**: ⏳ TODO  
**Points**: 13  
**Priority**: HIGH  

**User Story:**
> En tant qu'administrateur, je veux voir une interface visuelle d'édition du contenu JSON, afin de modifier l'apparence du site sans écrire du JSON.

**Acceptance Criteria:**
- ✅ Affiche le JSON global du serveur
- ✅ Interface atomique par section (hero, about, galerie, etc.)
- ✅ Chaque section a un éditeur visuel
- ✅ Live preview en temps réel
- ✅ Champs validés avant soumission
- ✅ Bouton Annuler restaure l'état initial
- ✅ Bouton Sauvegarder = PUT `/content` unique

**Tasks:**
- [ ] T1: Create ContentEditor page
- [ ] T2: Fetch content from server
- [ ] T3: Create Section components (hero, about, etc.)
- [ ] T4: Create Element editors (text input, image upload, etc.)
- [ ] T5: Create live preview pane
- [ ] T6: Implement undo/cancel
- [ ] T7: Implement save functionality
- [ ] T8: Component tests + E2E

---

### US-2.4: [FRONTEND] Admin Management
**Status**: ⏳ TODO  
**Points**: 8  
**Priority**: MEDIUM  

**User Story:**
> En tant que superadmin, je veux gérer les autres admins (créer, activer, supprimer), afin de contrôler les accès au panel.

**Acceptance Criteria:**
- ✅ Liste des admins existants
- ✅ Formulaire de création admin
- ✅ Toggle is_active pour chaque admin
- ✅ Bouton supprimer admin
- ✅ Confirmations avant actions destructrices

**Tasks:**
- [ ] T1: Create AdminListPage
- [ ] T2: Create AdminForm component
- [ ] T3: Implement fetch admin list
- [ ] T4: Implement admin creation
- [ ] T5: Implement status toggle
- [ ] T6: Implement admin deletion
- [ ] T7: Component tests

---

## 🎯 SPRINT 3: Production & Deployment (Semaine 3 janvier)

### US-3.1: [OPS] Docker Optimization
**Status**: ⏳ TODO  
**Points**: 5  
**Priority**: MEDIUM  

**Tasks:**
- [ ] Multi-stage build backend
- [ ] Frontend build + serve static
- [ ] Reduce image sizes
- [ ] Security scanning

---

### US-3.2: [OPS] Synology Deployment
**Status**: ⏳ TODO  
**Points**: 8  
**Priority**: HIGH  

**Tasks:**
- [ ] Setup Docker on Synology
- [ ] Volume mounting
- [ ] Auto-restart policies
- [ ] Backup strategy
- [ ] Health monitoring

---

### US-3.3: [OPS] Reverse Proxy & HTTPS
**Status**: ⏳ TODO  
**Points**: 8  
**Priority**: HIGH  

**Tasks:**
- [ ] Nginx reverse proxy
- [ ] Cloudflare HTTPS
- [ ] SSL certificates
- [ ] Domain routing

---

## 📊 Template for New User Stories

```markdown
### US-X.X.X: [CATEGORY] Title

**Status**: ⏳ TODO | 🔄 IN PROGRESS | ✅ DONE  
**Points**: N  
**Priority**: HIGH | MEDIUM | LOW  

**User Story:**
> En tant que [role], je veux [action], afin de [bénéfice].

**Acceptance Criteria:**
- ✅ Criterion 1
- ✅ Criterion 2

**Tasks:**
- [ ] Task 1
- [ ] Task 2

**Definition of Done:**
- [ ] Tests passing
- [ ] Code review approved
- [ ] Documentation updated
```

---

## 🏃 Sprint Planning

### Comment utiliser ce document

1. **Sélectionner une US**: Choisir par ordre de priorité
2. **Écrire les tests d'abord** (TDD): Implémenter les test cases
3. **Exécuter les tests** (ils doivent échouer au départ)
4. **Implémenter le code**: Faire passer les tests
5. **Refactorise**: Améliorer la qualité
6. **Code review**: Vérifier les critères d'acceptation
7. **Merger**: Ajouter à la branche main

### Checklist de completion

Avant de marquer une US comme DONE:
- [ ] Tous les tests passent
- [ ] Code review approuvé
- [ ] Documentation mise à jour
- [ ] Aucun console error/warning
- [ ] Acceptance criteria satisfaits
- [ ] No breaking changes

---

## 📈 Velocity & Burndown

| Sprint | US planifiées | US complétées | Velocity | Burndown |
|--------|--------------|---------------|----------|----------|
| 1 (Dec 1-15) | 10 | 10 | 100% | ✅ |
| 1.5 (Dec 16-22) | 7 | 0 | 0% | ⏳ |
| 2 (Jan 1-15) | 4 | 0 | 0% | ⏳ |
| 3 (Jan 16-31) | 3 | 0 | 0% | ⏳ |

---

**Dernière mise à jour**: 9 décembre 2025

