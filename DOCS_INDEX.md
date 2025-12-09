# 📚 BATASITE - Documentation Index

> Guide de navigation pour trouver tous les documents projet

---

## 🎯 Quick Start

**Nouveau sur le projet?** Lire dans cet ordre:

1. **PROJECT.md** - Spécifications complètes
2. **ROADMAP.md** - Vue d'ensemble des phases
3. **back/README.md** - Architecture backend
4. **Ce fichier** - Documentation index

---

## 📋 Fichiers de suivi d'avancement

### 🚀 ROADMAP.md
**Objectif**: Vue d'ensemble du projet avec tracking par phase

- Vue des 3 phases du projet (Infrastructure, Admin Panel, Production)
- Détail complet de chaque US de Phase 1
- Métriques d'avancement (tests, documentation, code)
- Principes de travail (TDD, sécurité, documentation)
- Problèmes rencontrés et solutions appliquées
- Prochaines itérations plannifiées

**À consulter pour**: Comprendre l'avancement global, les métriques, les problèmes résolus

**Mise à jour**: À chaque fin d'itération

---

### 📝 USER_STORIES.md
**Objectif**: User stories détaillées avec acceptance criteria et tasks

- **Sprint 1.5**: Content Management (7 US, 41 pts)
  - US-1.5.1 à US-1.5.7
  - Chaque US: acceptance criteria + task breakdown
  
- **Sprint 2**: Admin Panel React (4 US)
  - US-2.1 à US-2.4
  
- **Sprint 3**: Production (3 US)
  - US-3.1 à US-3.3

- **Template** pour créer nouvelles US

**À consulter pour**: Détails d'une US, acceptance criteria, task breakdown

**Mise à jour**: À chaque nouvelle US

---

### 📊 SPRINT_TRACKING.md
**Objectif**: Tracking détaillé des sprints avec métriques et learnings

- **Sprint 1 Completed** (9 déc):
  - 6 itérations completed (1.0 à 1.5)
  - Métriques: 43/43 tests, ~45% coverage
  - Issues trouvées et résolvues
  - Retrospective & learnings
  - Action items para sprints futur
  
- **Sprint 1.5 Planning**:
  - Plan d'action détaillé
  - Risques identifiés & mitigation
  
- **Velocity & Burndown charts**

**À consulter pour**: Détails d'un sprint écoulé, lessons learned, burndown

**Mise à jour**: À chaque fin de sprint

---

### ✅ ITERATION_CHECKLIST.md
**Objectif**: Checklists pour bien démarrer et compléter une itération

- **Pré-itération**: Planning, documentation, environment
- **Démarrage**: Code setup, TDD loop
- **Daily standup**: Morning, midi, end of day
- **Testing**: Before commit, integration, DoD
- **Completion**: Code finalization, testing, documentation
- **Retrospective template**
- **Per-feature checklists**: Endpoints, DB, components, security
- **Quality gates**: Must pass, should pass, nice to have

**À consulter pour**: Avant de démarrer une itération, pendant les daily tasks

**Mise à jour**: Amélioré en continu

---

## 🏗️ Architecture & Décisions

### 🏛️ ADR.md (Architecture Decision Records)
**Objectif**: Historique des décisions architecturales avec contexte et tradeoffs

- **ADR-001**: PostgreSQL + Docker
- **ADR-002**: JWT Stateless
- **ADR-003**: Express Framework
- **ADR-004**: Argon2id Hashing
- **ADR-005**: Joi Validation
- **ADR-006**: Route Paths (`/auth`)
- **ADR-007**: Context API (Upcoming)
- **ADR-008**: Schema `content` field
- **ADR-009**: Jest Testing
- **ADR-010**: Logger Wrapper
- **Template** para nouvelles ADRs

**À consulter pour**: Comprendre pourquoi une décision, les tradeoffs, alternatives

**Mise à jour**: À chaque décision architecturale majeure

---

## 📖 Spécifications & Documentation

### 📋 PROJECT.md
**Objectif**: Spécifications complètes du projet

**Contient**:
- Résumé exécutif
- Objectifs du projet
- User personas
- Fonctionnalités détaillées
- Frontend requirements
- Backend requirements
- Database schema
- API endpoints
- Sécurité
- RGPD
- SEO
- Roadmap par phases

**À consulter pour**: Spécifications officielles, requirements complets

**Mise à jour**: Rarement (document de référence)

---

### 📚 back/README.md
**Objectif**: Documentation de l'architecture backend

**Contient**:
- Résumé du backend
- Structure des dossiers
- Installation & setup
- Configuration .env
- Database schema (tables admins & content)
- API endpoints (planifiés)
- Tests & coverage
- Principes du projet

**À consulter pour**: Comment fonctionne le backend, structure des dossiers

**Mise à jour**: À chaque changement majeur

---

### 🔒 SECURITY.md
**Objectif**: Guidelines de sécurité et hardening en production

**Contient**:
- Password hashing (Argon2id)
- JWT configuration
- Input validation
- SQL injection prevention
- Rate limiting setup
- HTTPS configuration
- Environment variables
- Deployment checklist

**À consulter pour**: Security best practices, hardening steps

**Mise à jour**: À chaque changement de sécurité

---

### 📝 .env.example
**Objectif**: Template des variables d'environnement

**Contient**:
- Database credentials
- JWT secrets
- SMTP configuration
- Token expiration settings
- Node environment

**À consulter pour**: Savoir quelles variables sont nécessaires

**Mise à jour**: À chaque nouvelle variable d'env

---

## 🗂️ Structure du projet

```
BATASITE/
├── 📚 Docs (ce dossier)
│   ├── PROJECT.md ..................... Spécifications
│   ├── ROADMAP.md ..................... Tracking phases
│   ├── USER_STORIES.md ............... Détail des US
│   ├── SPRINT_TRACKING.md ............ Métriques sprints
│   ├── ITERATION_CHECKLIST.md ........ Checklists
│   ├── ADR.md ........................ Décisions arch
│   ├── SECURITY.md ................... Sécurité
│   ├── .env.example .................. Template env
│   └── DOCS_INDEX.md (ce fichier) .... Navigation
│
├── 🐋 Docker
│   ├── docker-compose.yml ............ Orchestration
│   ├── .env .......................... Variables (local)
│   └── .gitignore .................... Exclusions
│
├── 🔙 Backend (back/)
│   ├── package.json .................. Dependencies
│   ├── README.md ..................... Backend docs
│   ├── Dockerfile .................... Image build
│   ├── src/
│   │   ├── server.js ................. Entry point
│   │   ├── config/
│   │   │   └── db.js ................. Database config
│   │   ├── controllers/
│   │   │   └── auth.controller.js .... Auth logic
│   │   ├── models/
│   │   │   ├── admin.model.js ........ Admin CRUD
│   │   │   └── content.model.js ...... Content CRUD
│   │   ├── routes/
│   │   │   └── auth.routes.js ........ Auth routes
│   │   ├── middleware/
│   │   │   ├── auth.js ............... JWT verify
│   │   │   └── errorHandler.js ....... Error handling
│   │   ├── utils/
│   │   │   ├── auth.js ............... Password/token utils
│   │   │   ├── validators.js ......... Joi schemas
│   │   │   └── logger.js ............ Logging
│   │   └── tests/
│   │       ├── auth.test.js ......... Auth utils tests
│   │       ├── validators.test.js ... Validation tests
│   │       ├── db.test.js ........... Database tests
│   │       ├── auth.controller.test.js .. Integration tests
│   │       ├── admin.model.test.js .. (skipped)
│   │       └── content.model.test.js . (skipped)
│
├── 🎨 Frontend (front/)
│   ├── package.json .................. Dependencies
│   ├── vite.config.js ............... Vite config
│   ├── index.html ................... Entry page
│   ├── src/
│   │   ├── main.jsx ................. React entry
│   │   ├── App.jsx .................. Main component
│   │   ├── assets/
│   │   └── data.json ................ Content JSON
│   └── public/ ....................... Static assets
│
└── 📄 Misc
    ├── LICENSE ....................... Project license
    └── README.md ..................... Project README
```

---

## 🔍 Comment trouver rapidement

### Je veux comprendre...

| Sujet | Document | Section |
|-------|----------|---------|
| L'objectif global | PROJECT.md | Section 1-2 |
| Où on en est | ROADMAP.md | Vue d'ensemble + Phase 1 |
| Les étapes suivantes | USER_STORIES.md | Sprint 1.5 |
| Comment démarrer une tâche | ITERATION_CHECKLIST.md | Pré-itération |
| Pourquoi Express pas Fastify | ADR.md | ADR-003 |
| Comment sécuriser le code | SECURITY.md | Toutes sections |
| Structure du backend | back/README.md | Architecture section |
| Les tests du backend | back/README.md | Tests section |
| Comment configurer l'env | .env.example | Commentaires |
| Les learnings du sprint 1 | SPRINT_TRACKING.md | Retrospective |
| Les problèmes et solutions | ROADMAP.md | Notes & Decisions |

---

## ✍️ Conventions

### Nommage des branches Git
```
feature/us-1.5-1-content-retrieval
bugfix/auth-token-expiration
refactor/logger-optimization
```

### Commits
```
feat(1.5.1): Add GET /content endpoint
test(1.5.1): Write tests for content retrieval
refactor(1.5.1): Extract validation logic
```

### User Story IDs
```
US-1.5.1    = Phase 1.5, Story 1
US-2.1      = Phase 2, Story 1
US-3.2      = Phase 3, Story 2
```

### Status Codes
```
✅ DONE (completed, tested)
🔄 IN PROGRESS (actively working)
⏳ TODO (planned, not started)
⚠️ BLOCKED (needs help)
⏸️ DEFERRED (intentionally postponed)
```

---

## 📊 Dashboards & Metrics

### Test Coverage
- Current: **43/43 passing** (100% phase 1)
- Target: >= 80% global
- Command: `npm test`

### Code Quality
- No TODOs/FIXMEs in code
- No console.error in production code
- No hardcoded credentials

### Documentation
- JSDoc: 100%
- README: 95%
- API Docs: 70%

### Performance
- Response time: < 500ms
- Database queries: < 100ms
- Build time: < 30s

---

## 🚀 Quick Links

### Local Development
```bash
# Start everything
docker-compose up -d

# Run tests
npm test

# Watch mode
npm run test:watch
```

### Important URLs
```
Backend:     http://localhost:3000
Health:      http://localhost:3000/health
Database:    localhost:5434 (psql)
```

### Key Files to Know
```
.env                          Configuration
back/src/server.js            Server entry
back/src/controllers/auth.controller.js
back/src/tests/auth.controller.test.js
```

---

## 🤝 Contributing

### Before committing
1. Check ITERATION_CHECKLIST.md "Before Each Commit" section
2. Run `npm test`
3. Run `npm run lint`
4. Update relevant documentation
5. Create a clear commit message

### Before merging
1. Verify all quality gates in ITERATION_CHECKLIST.md
2. Get code review
3. All tests passing
4. Update ROADMAP.md and USER_STORIES.md

---

## 📞 Getting Help

### Issues & Troubleshooting
- See ITERATION_CHECKLIST.md "Getting Help" section
- Check SPRINT_TRACKING.md "Issues rencontrées" table
- Review ADR.md for decisions

### Questions
- Architecture: See ADR.md
- Requirements: See PROJECT.md or USER_STORIES.md
- Development: See back/README.md or ITERATION_CHECKLIST.md
- Progress: See ROADMAP.md or SPRINT_TRACKING.md

---

## 📈 Next Actions

**Pour démarrer Sprint 1.5** (16 décembre):
1. Lire USER_STORIES.md - Sprint 1.5 section
2. Suivre ITERATION_CHECKLIST.md - Pré-itération
3. Créer feature branch: `feature/1.5-content-api`
4. TDD: Write tests first for US-1.5.1
5. Implement, refactor, test until green
6. Repeat para remaining US

---

## 📝 Document Maintenance

| Document | Frequency | Owner | Next Review |
|----------|-----------|-------|-------------|
| PROJECT.md | Rarely | Project Lead | Never (reference) |
| ROADMAP.md | End of sprint | Dev | 22 déc (1.5 end) |
| USER_STORIES.md | Per US | Dev | 22 déc |
| SPRINT_TRACKING.md | End of sprint | Dev | 22 déc |
| ITERATION_CHECKLIST.md | Continuously | Dev | 22 déc |
| ADR.md | Per decision | Dev | As needed |
| back/README.md | Per major change | Dev | 22 déc |
| SECURITY.md | Per security change | Dev | 22 déc |

---

## 🎓 Learning Resources

### TDD Discipline
- ITERATION_CHECKLIST.md "Testing During Iteration"
- SPRINT_TRACKING.md "Retrospective"

### Backend Architecture
- back/README.md
- ADR.md (all decisions)

### Security
- SECURITY.md
- ADR-004 (Argon2id)

### Project Management
- ROADMAP.md
- USER_STORIES.md
- SPRINT_TRACKING.md

---

**Dernière mise à jour**: 9 décembre 2025

**Questions?** Consult this document first, then check the relevant detailed document.

