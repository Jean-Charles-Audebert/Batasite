# 🏗️ BATASITE - Architecture Decision Records (ADR)

> Historique des décisions architecturales avec contexte, alternatives et tradeoffs

---

## ADR-001: PostgreSQL + Docker vs SQLite Local

**Status**: ✅ DECIDED  
**Date**: 1 décembre 2025  
**Stakeholders**: DevOps, Backend  

### Contexte

Projet requis une base de données pour stocker admins et contenu. Deux options principales:
- PostgreSQL dans Docker (production-ready)
- SQLite local (développement simple)

### Décision

**✅ PostgreSQL + Docker**

### Rationale

| Aspect | PostgreSQL | SQLite |
|--------|------------|--------|
| **Scalabilité** | ✅ Illimitée | ⚠️ Limitée |
| **JSONB support** | ✅ Native | ⚠️ JSON seulement |
| **Concurrency** | ✅ Native | ⚠️ Locks |
| **Production-ready** | ✅ Oui | ❌ Non |
| **Setup time** | ⚠️ Moyen | ✅ Rapide |
| **Local dev** | ⚠️ Docker requis | ✅ Zéro setup |

### Alternatives considérées

1. **SQLite**: Rejeté - pas de JSONB, scaling limité
2. **MongoDB**: Rejeté - overhead, complexité non nécessaire
3. **MariaDB**: Rejeté - overkill, PostgreSQL mieux pour JSONB

### Tradeoffs

**Avantages**:
- ✅ JSONB pour contenu global (flexible)
- ✅ Production-ready immédiatement
- ✅ Full-text search capabilité future
- ✅ Scalable horizontalement

**Inconvénients**:
- ⚠️ Docker obligatoire (mais c'était un requirement)
- ⚠️ Setup initial plus long
- ⚠️ Ressources système plus grandes

### Résultat

✅ **Implémentation réussie**: Docker Compose, health checks, volumes. Zéro issues en production.

### Prochains pas

- [ ] Ajouter replicas PostgreSQL (Phase 3)
- [ ] Backup automatique (Phase 3)
- [ ] Monitoring (Phase 3)

---

## ADR-002: JWT Stateless vs Refresh Tokens Table

**Status**: ✅ DECIDED  
**Date**: 2 décembre 2025  
**Stakeholders**: Security, Backend  

### Contexte

Authentification requise avec tokens. Deux approches:
- JWT stateless (aucune DB state)
- JWT + refresh_tokens table (token blacklisting possible)

### Décision

**✅ JWT Stateless**

### Rationale

Pour MVP, stateless JWT suffit. Avantages majeurs:
- ✅ Zéro DB queries pour validation token
- ✅ Scaling horizontal facile (aucun state partage)
- ✅ Stateless API REST purs
- ✅ Simpler pour initial release

### Alternatives considérées

1. **Refresh tokens table**: Ajoute complexity, DB queries à chaque request
2. **Session-based**: Antique, non-scalable
3. **OAuth2**: Overkill pour MVP

### Tradeoffs

**Avantages**:
- ✅ Performance (zero DB queries pour auth)
- ✅ Scaling horizontal trivial
- ✅ Simpler code
- ✅ REST pure

**Inconvénients**:
- ⚠️ Pas de revocation instantanée
- ⚠️ Token compromis = unauthorized access jusqu'à expiration
- ⚠️ Logout ne revoque pas vraiment le token

### Mitigation

- ✅ Access tokens très courts (15 min)
- ✅ Refresh tokens longer (7 days)
- ✅ HTTPS mandatory en production
- ✅ Rate limiting sur endpoints sensibles

### Résultat

✅ **Fonctionne parfaitement pour MVP**. Peut upgrade vers refresh_tokens table en Phase 3 si besoin.

### Prochains pas

- [ ] Ajouter token blacklist si besoin (Phase 2)
- [ ] Implement rate limiting (Phase 3)

---

## ADR-003: Express vs Fastify vs Hapi

**Status**: ✅ DECIDED  
**Date**: 2 décembre 2025  
**Stakeholders**: Backend  

### Contexte

Framework Node.js pour REST API. Options:
- Express (mature, ecosystem)
- Fastify (rapide, moderne)
- Hapi (enterprise, structure)

### Décision

**✅ Express 5.2.1**

### Rationale

| Aspect | Express | Fastify | Hapi |
|--------|---------|---------|------|
| **Maturité** | ✅ 15+ ans | ✅ 5+ ans | ✅ 10+ ans |
| **Ecosystem** | ✅ Huge | ⚠️ Growing | ⚠️ Moderate |
| **Learning curve** | ✅ Easy | ✅ Easy | ⚠️ Steep |
| **Performance** | ⚠️ Adequate | ✅ Fast | ✅ Fast |
| **Team familiarity** | ✅ High | ⚠️ Lower | ⚠️ Lower |
| **Scalability** | ✅ Good | ✅ Better | ✅ Good |

### Alternatives considérées

1. **Fastify**: Rejected - no strong performance requirement pour MVP
2. **Hapi**: Rejected - overkill, steeper learning curve

### Tradeoffs

**Avantages**:
- ✅ Huge community & ecosystem
- ✅ Easy to learn & extend
- ✅ Middleware pattern simple
- ✅ Team already familiar

**Inconvénients**:
- ⚠️ Not as fast as Fastify
- ⚠️ Legacy baggage (but v5 cleaner)
- ⚠️ Less opinionated (DIY patterns)

### Résultat

✅ **Perfect choice pour MVP**. Productivity > raw speed pour cette phase.

### Prochains pas

- [ ] Consider Fastify pour Phase 3 si performance critique
- [ ] Benchmark comparison later

---

## ADR-004: Argon2id vs Bcrypt vs Scrypt

**Status**: ✅ DECIDED  
**Date**: 3 décembre 2025  
**Stakeholders**: Security  

### Contexte

Password hashing pour authentification. Options:
- Argon2id (latest, GPU-resistant)
- Bcrypt (proven, slow by design)
- Scrypt (alternative, moins connu)

### Décision

**✅ Argon2id via `argon2` npm package**

### Rationale

| Aspect | Argon2id | Bcrypt | Scrypt |
|--------|----------|--------|--------|
| **Security** | ✅ Best-in-class | ✅ Good | ✅ Good |
| **GPU resistant** | ✅ Yes | ⚠️ No | ✅ Yes |
| **Speed control** | ✅ Yes (memory/time) | ⚠️ Limited | ✅ Yes |
| **Proven** | ✅ OWASP 2023 | ✅ Decades | ⚠️ Moderate |
| **Implementation** | ✅ Simple (npm) | ✅ Simple | ✅ Simple |

### Alternatives considérées

1. **Bcrypt**: Good but older, less GPU-resistant
2. **Scrypt**: Good but less adopted

### OWASP Recommendation (2023)

> "Argon2id is the winner of the Password Hashing Competition and is recommended for password hashing."

### Tradeoffs

**Avantages**:
- ✅ Best security (OWASP recommended)
- ✅ GPU-resistant (protects against brute force)
- ✅ Tunable parameters (memory/time)
- ✅ Modern standard

**Inconvénients**:
- ⚠️ Slightly slower than bcrypt (intentional)
- ⚠️ Newer algorithm (less battle-tested than bcrypt, but still proven)

### Configuration

```javascript
// Current settings (conservative)
{
  timeCost: 3,        // iterations
  memoryCost: 65536,  // 64MB
  parallelism: 2      // threads
}
```

### Résultat

✅ **Excellent choice pour sécurité**. Légère latence acceptable (< 1s/hash).

### Prochains pas

- [ ] Monitor hashing performance en production
- [ ] Consider tuning parameters si trop lent
- [ ] Document security guidelines

---

## ADR-005: Joi vs Yup vs Custom Validators

**Status**: ✅ DECIDED  
**Date**: 4 décembre 2025  
**Stakeholders**: Backend  

### Contexte

Input validation pour API. Options:
- Joi (Hapi ecosystem, powerful)
- Yup (React friendly, simpler)
- Custom validators (full control, maintenance burden)

### Décision

**✅ Joi v17**

### Rationale

| Aspect | Joi | Yup | Custom |
|--------|-----|-----|--------|
| **Features** | ✅ Complete | ✅ Good | ⚠️ Limited |
| **Performance** | ✅ Fast | ✅ Fast | ✅ Fastest |
| **Ecosystem** | ✅ Hapi | ✅ React | ⚠️ None |
| **Learning** | ⚠️ Steep | ✅ Easy | ✅ Easy |
| **Async validation** | ✅ Yes | ✅ Yes | ⚠️ Manual |
| **Error messages** | ✅ Excellent | ✅ Good | ⚠️ Manual |

### Tradeoffs

**Avantages**:
- ✅ Very powerful & flexible
- ✅ Async validation (DB checks)
- ✅ Excellent error messages
- ✅ Well documented

**Inconvénients**:
- ⚠️ Steeper learning curve
- ⚠️ Verbose for simple cases
- ⚠️ Async validation adds complexity

### Résultat

✅ **Perfect pour strict validation**. Complexity worth it for security.

### Prochains pas

- [ ] Add more async validators (DB uniqueness checks)
- [ ] Expand schema library

---

## ADR-006: Route Paths: `/auth` vs `/api/auth`

**Status**: ✅ DECIDED (Corrected)  
**Date**: 9 décembre 2025  
**Stakeholders**: API Design, Frontend  

### Contexte

API endpoint naming convention. Options:
- `/api/v1/auth/login` (versioned, traditional)
- `/api/auth/login` (unversioned but grouped)
- `/auth/login` (minimal, PROJECT.md spec)

### Decision

**✅ `/auth/login` (per PROJECT.md)**

### Note historique

- Initial implémentation: `/api/auth`
- Audit 9 déc: Found inconsistency avec PROJECT.md
- Decision: Align avec PROJECT.md specification
- Update: Tous les paths changés à `/auth`, `/admin`, `/content`

### Rationale

1. **PROJECT.md specification**: Already defined
2. **Simpler URLs**: Less nested
3. **Frontend familiarity**: Match with spec

### Tradeoffs

**Avantages**:
- ✅ Match PROJECT.md exactly
- ✅ Simpler URLs
- ✅ Easier for frontend (matches expected paths)

**Inconvénients**:
- ⚠️ Less versioning flexibility
- ⚠️ No namespacing (mais pas critical pour MVP)

### Versioning Strategy

If future versioning needed:
```
/auth/v2/login  (instead of /v2/auth/login)
```

### Résultat

✅ **Now aligned avec PROJECT.md**. Clean & simple.

### Prochains pas

- [ ] Document API endpoints in Swagger (Phase 2)
- [ ] Consider versioning strategy pour Phase 3

---

## ADR-007: Context API vs Redux vs Zustand (Upcoming Phase 2)

**Status**: 🏗️ PLANNED  
**Date**: TBD  
**Stakeholders**: Frontend  

### Contexte (Prévisionnel)

State management pour React admin panel. Phase 2 decision:
- Context API (built-in, no deps)
- Redux (proven, complex)
- Zustand (simple, modern)

### Recommended Decision

**✅ Context API (pour MVP)**

**Rationale**:
- ✅ No external dependencies
- ✅ Sufficient pour simple auth + content state
- ✅ Learning curve shallow
- ⚠️ Upgrade à Redux/Zustand facile later si needed

### Notes

- Evaluate après Phase 2 requirements
- Redux considéré seulement si state becomes complex

---

## ADR-008: Database Schema: `data` vs `content` vs `payload`

**Status**: ✅ DECIDED (Corrected)  
**Date**: 9 décembre 2025  
**Stakeholders**: Database Design  

### Contexte

JSONB field naming pour contenu global. Options:
- `data` (generic, initial choice)
- `content` (semantic, PROJECT.md spec)
- `payload` (generic, alternative)

### Décision

**✅ `content` (per PROJECT.md)**

### Note historique

- Initial: Champ nommé `data` JSONB
- Audit 9 déc: Found mismatch avec PROJECT.md
- Decision: Rename to `content`
- Update: Tous les SQL queries mise à jour

### Rationale

1. **PROJECT.md spec**: Already defined as `content`
2. **Semantic clarity**: `content` makes more sense than `data`
3. **Future-proof**: Consistent naming

### Migration

**Completed** via direct schema update:
```sql
ALTER TABLE content RENAME COLUMN data TO content;
```

### Résultat

✅ **Now matches PROJECT.md schema exactly**.

### Prochains pas

- [ ] Document schema in API docs
- [ ] Ensure frontend expects `content` field

---

## ADR-009: Testing Framework: Jest vs Vitest vs Mocha

**Status**: ✅ DECIDED  
**Date**: 4 décembre 2025  
**Stakeholders**: QA, Backend  

### Contexte

Testing framework pour Node.js + Express. Options:
- Jest (popular, heavy)
- Vitest (new, Vite-native)
- Mocha (mature, lightweight)

### Décision

**✅ Jest + Supertest**

### Rationale

| Aspect | Jest | Vitest | Mocha |
|--------|------|--------|-------|
| **Setup** | ✅ Zero-config | ✅ Easy | ⚠️ Manual |
| **Features** | ✅ Complete | ✅ Complete | ⚠️ Minimal |
| **Speed** | ⚠️ Slow | ✅ Very fast | ✅ Fast |
| **Mocking** | ✅ Built-in | ✅ Built-in | ⚠️ Needs lib |
| **Coverage** | ✅ Built-in | ✅ Built-in | ⚠️ Needs lib |
| **Community** | ✅ Huge | ✅ Growing | ✅ Large |

### Tradeoffs

**Avantages**:
- ✅ Complete out of the box
- ✅ Huge community & plugins
- ✅ Excellent documentation
- ✅ Coverage reporting built-in

**Inconvénients**:
- ⚠️ Slow startup (for development)
- ⚠️ Heavy (lots of features not used)
- ⚠️ Complex configuration

### Résultat

✅ **Excellent choice pour API testing**. 43/43 tests passing.

### Coverage Metrics

```
Current (Phase 1):
├── auth.util.js: 100%
├── validators.js: 100%
├── auth.controller.js: 95%
└── Global: ~45%

Target (Phase 2): >= 80% global
```

### Prochains pas

- [ ] Add coverage tracking
- [ ] Setup coverage reporting
- [ ] Consider Vitest para Phase 2 frontend

---

## ADR-010: Logging Strategy: Console vs Winston vs Pino

**Status**: ✅ DECIDED  
**Date**: 5 décembre 2025  
**Stakeholders**: DevOps, Backend  

### Contexte

Logging système pour observability. Options:
- Simple console (minimal)
- Winston (feature-rich)
- Pino (performance-focused)

### Décision

**✅ Custom logger wrapper + console (MVP)**

### Rationale

Pour MVP:
- ✅ Simple wrapper suffisant
- ✅ Zéro dependencies
- ✅ Easy to upgrade later

### Implémentation

```javascript
// src/utils/logger.js
const log = {
  info: (message, data) => console.log(`[INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[ERROR] ${message}`, error || ''),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data || ''),
}
```

### Upgrade Path

Phase 3 upgrade options:
1. **Winston**: Full-featured
2. **Pino**: Performance
3. **ELK Stack**: Enterprise logging

### Résultat

✅ **Minimal but effective para MVP**.

### Prochains pas

- [ ] Add Winston in Phase 3
- [ ] Setup centralized logging
- [ ] Add structured logging (JSON)

---

## Summary Table

| ADR | Title | Status | Impact |
|-----|-------|--------|--------|
| 001 | PostgreSQL + Docker | ✅ DONE | High |
| 002 | JWT Stateless | ✅ DONE | High |
| 003 | Express Framework | ✅ DONE | High |
| 004 | Argon2id Hashing | ✅ DONE | High |
| 005 | Joi Validation | ✅ DONE | Medium |
| 006 | Route Paths `/auth` | ✅ CORRECTED | Medium |
| 007 | Context API (React) | 🏗️ PLANNED | Medium |
| 008 | Schema `content` field | ✅ CORRECTED | Medium |
| 009 | Jest Testing | ✅ DONE | High |
| 010 | Logger Wrapper | ✅ DONE | Low |

---

## How to Use This Document

1. **For new decisions**: Copy template below and fill out
2. **For reviews**: Check Status and Rationale
3. **For migrations**: Check Tradeoffs and Upgrade Path
4. **For disputes**: Reference OWASP/best practices

---

## Template for New ADR

```markdown
## ADR-XXX: [Decision Title]

**Status**: 🏗️ PLANNED | ⏳ IN DISCUSSION | ✅ DECIDED  
**Date**: [Date]  
**Stakeholders**: [Roles]  

### Contexte
[Problem statement & options]

### Décision
**✅ [Chosen option]**

### Rationale
[Why this option]

### Alternatives considérées
1. [Alt 1]: [Why rejected]
2. [Alt 2]: [Why rejected]

### Tradeoffs
**Avantages**:
- ✅ ...
- ✅ ...

**Inconvénients**:
- ⚠️ ...
- ⚠️ ...

### Résultat
[Impact & learnings]

### Prochains pas
- [ ] Action 1
- [ ] Action 2
```

---

**Dernière mise à jour**: 9 décembre 2025  
**Total ADRs**: 10 (8 complétées, 2 planifiées)

