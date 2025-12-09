# ✅ BATASITE - Iteration Startup Checklist

> Checklist à suivre pour démarrer une nouvelle itération de manière structurée et propre

---

## 📋 Pré-itération (1-2 jours avant)

### Planning
- [ ] Sélectionner les user stories para cette itération
- [ ] Vérifier dépendances (quelle US bloque quelle autre?)
- [ ] Estimer points (fibonacci: 1, 2, 3, 5, 8, 13)
- [ ] Identifier risques potentiels
- [ ] Allouer slack time (20%)
- [ ] Planifier standups quotidiens

### Documentation
- [ ] Créer une branche feature (ex: `feature/1.5-content-api`)
- [ ] Mettre à jour ROADMAP.md avec progression
- [ ] Mettre à jour USER_STORIES.md status → IN PROGRESS
- [ ] Archiver ADRs de la dernière itération

### Environment
- [ ] Vérifier Docker running (`docker ps`)
- [ ] Tests passent (`npm test` in `/back`)
- [ ] No uncommitted changes (`git status`)
- [ ] Pull latest main (`git pull origin main`)

---

## 🎯 Démarrage de l'itération (Jour 1)

### Code Setup
- [ ] Créer feature branch: `git checkout -b feature/<iteration-name>`
- [ ] Vérifier structure des dossiers est prête
- [ ] Vérifier dépendances npm à jour (`npm list`)
- [ ] Vérifier .env bien configuré

### TDD Setup
- [ ] Créer fichier tests `.test.js` para première US
- [ ] Écrire les tests (ils doivent échouer)
- [ ] `npm test` → vérifier failures expectedus
- [ ] Documenter test cases dans USER_STORIES.md

### First Story: TDD Loop

```
1. Write Failing Tests
   npm test → ✅ See red
   
2. Implement Minimum Code
   npm test → ✅ See green
   
3. Refactor
   npm test → ✅ Still green
   
4. Commit
   git add .
   git commit -m "feat: ..."
```

---

## 📅 Daily Standup Checklist

### Matin (Planning)
- [ ] Revue Sprint board
- [ ] Identify blockers de hier
- [ ] Plan tasks para aujourd'hui
- [ ] Communicate changes

### Midi (Checkpoint)
- [ ] Tests toujours passing?
- [ ] Code coverage maintained?
- [ ] Nouvelle issues découvertes?

### Fin de jour (Update)
- [ ] Commit/push changes
- [ ] Update issue status
- [ ] Note blockers para demain
- [ ] Update burndown chart

---

## 🧪 Testing During Iteration

### Before Each Commit
- [ ] `npm test` → all passing
- [ ] `npm run lint` → no errors (if configured)
- [ ] Coverage >= 80% para modules touchés
- [ ] No console.error/warn (except logger)

### Integration Testing
- [ ] Test with Docker running
- [ ] Test with .env configured
- [ ] Test API endpoints manually (Postman/curl)
- [ ] Test edge cases

### Definition of Done per Task
- [ ] Tests passing ✅
- [ ] Code reviewed (if pair programming)
- [ ] No breaking changes
- [ ] Documentation updated
- [ ] Committed with good message

---

## 📝 Documentation During Iteration

### Code Documentation
- [ ] JSDoc comments sur toutes les fonctions
- [ ] Inline comments pour logic complexe
- [ ] README mis à jour si structure change
- [ ] API documentation (Swagger/examples)

### User Stories
- [ ] Mettre à jour acceptance criteria si change
- [ ] Note learnings/challenges
- [ ] Update task status (TODO → IN PROGRESS → DONE)

### Git Commits
- [ ] Messages atomiques et clairs
- [ ] Reference US/ticket number (ex: "US-1.5.1: Add GET /content")
- [ ] Format: `type: subject` (feat:, fix:, refactor:, test:)

### Example Commits
```bash
git commit -m "test(1.5.1): Add tests for GET /content endpoint"
git commit -m "feat(1.5.1): Implement GET /content controller"
git commit -m "refactor(1.5.1): Extract content validation logic"
git commit -m "test(1.5.1): Add integration tests with JWT"
```

---

## 🔄 Mid-Iteration Check (Day 3-4)

### Progress Review
- [ ] Burndown chart on track?
- [ ] Velocity meeting estimates?
- [ ] Blockers identified?

### Quality Check
- [ ] All tests passing?
- [ ] Coverage maintained?
- [ ] No technical debt accumulating?
- [ ] Code reviews happening?

### Adjustment if Behind
- [ ] Reduce scope (cut lowest priority US)?
- [ ] Ask for help?
- [ ] Extend deadline?
- [ ] Note in retro

---

## ✨ Iteration Completion (End of Sprint)

### Code Finalization
- [ ] All tests passing
- [ ] All code reviewed
- [ ] No TODOs/FIXMEs in code
- [ ] Refactoring done (clean code)
- [ ] No dead code

### Testing & QA
- [ ] Unit tests: 100% of changed code
- [ ] Integration tests: All endpoints
- [ ] Manual testing: Complete flow
- [ ] Edge cases covered

### Documentation Finalization
- [ ] README updated
- [ ] API docs complete
- [ ] JSDoc complete (100%)
- [ ] User Stories marked DONE
- [ ] ROADMAP.md progress updated

### Git & Deployment Readiness
- [ ] Feature branch clean (rebased on main)
- [ ] All commits squashed logically
- [ ] Commit messages descriptive
- [ ] Ready para pull request

### Pre-Merge Checklist
- [ ] Merge main into feature branch
- [ ] All conflicts resolved
- [ ] Tests still passing post-merge
- [ ] Create pull request
- [ ] 2 approvals minimum
- [ ] Merge to main

### Post-Merge
- [ ] Delete feature branch
- [ ] Update ROADMAP.md → status ✅ DONE
- [ ] Tag release (v1.5.0, etc.)
- [ ] Document in CHANGELOG
- [ ] Close related tickets

---

## 📊 Metrics to Track

### Code Metrics (Daily)
```
Lines added:    [count]
Lines removed:  [count]
Coverage:       [%]
Tests passing:  [count]/[total]
Commits:        [count]
```

### Time Metrics
```
Time estimated: [points]
Time spent:     [hours]
Velocity:       [points/day]
Efficiency:     [%]
```

### Quality Metrics
```
Bugs found:     [count]
Security issues:[count]
Performance issues: [count]
UX issues:      [count]
```

---

## 🎓 Retrospective Template (End of Iteration)

### What Went Well ✅
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

### What Could Be Better ⚠️
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

### Action Items for Next Iteration
- [ ] Action 1 (owner)
- [ ] Action 2 (owner)
- [ ] Action 3 (owner)

### Velocity & Estimates Accuracy
```
Estimated: XX points
Completed: XX points
Accuracy: XX%

Adjustments para next iteration:
- Estimation was [too high/too low/accurate]
- Future estimates should [increase/decrease/maintain]
```

---

## 🚀 Per-Feature Checklist

### For Backend Endpoints

```
New Endpoint Checklist:
- [ ] Tests written (TDD)
- [ ] Route defined
- [ ] Controller implemented
- [ ] Validation (Joi)
- [ ] Error handling
- [ ] Logging added
- [ ] JWT protection (if needed)
- [ ] Integration tests
- [ ] API docs (Swagger)
- [ ] Example requests (curl)
```

### For Database Changes

```
DB Change Checklist:
- [ ] Migration written (if needed)
- [ ] Schema change tested
- [ ] Indexes added (if needed)
- [ ] Backward compatible?
- [ ] Tests updated
- [ ] Docs updated
- [ ] Rollback plan documented
```

### For Frontend Components

```
Component Checklist:
- [ ] Component design planned
- [ ] Props documented
- [ ] Tests written
- [ ] Component stories (Storybook)
- [ ] Accessibility checked
- [ ] Mobile responsive
- [ ] Performance optimized
```

### For Security Changes

```
Security Checklist:
- [ ] Threat model reviewed
- [ ] OWASP compliance checked
- [ ] Secrets not in code
- [ ] Input validated
- [ ] Output encoded
- [ ] Encryption used (if needed)
- [ ] Security tests added
- [ ] Audit logged
```

---

## 📋 Iteration Template

**Iteration**: 1.5  
**Duration**: 16-22 décembre  
**Status**: ⏳ IN PROGRESS  
**Velocity**: ? points  

### User Stories

```
[ ] US-1.5.1: Content Retrieval [5 pts]
    - [ ] T1: Write tests
    - [ ] T2: Implement controller
    - [ ] T3: Integration tests
    [ ] DONE ✅ 
    
[ ] US-1.5.2: Content Update [8 pts]
    - [ ] T1: Write tests
    - [ ] T2: Implement controller
    - [ ] T3: Integration tests
    [ ] DONE ✅ 
```

### Daily Log

```
Day 1 (16 déc):
- Worked on US-1.5.1 tests
- All tests passing
- Issues: None
- Tomorrow: Implement controller

Day 2 (17 déc):
- Implemented GET /content
- Coverage: 100%
- Issues: Merge conflicts resolved
- Tomorrow: Integration tests
```

### Blockers
```
- None currently
```

### Learnings
```
- [Anything learned]
- [Patterns discovered]
- [Improvements identified]
```

---

## 🔗 Important URLs & Commands

### Local Development
```bash
# Start Docker
docker-compose up -d

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

### Git Commands
```bash
# Feature branch
git checkout -b feature/us-1.5-1-content-api

# Push
git push origin feature/us-1.5-1-content-api

# Create PR
hub pull-request -b main

# Squash commits
git rebase -i HEAD~N
```

### Docker Commands
```bash
# Check status
docker ps

# View logs
docker logs batasite-backend

# Access database
docker exec -it batasite-db psql -U batadmin -d batasite

# Clean everything
docker-compose down -v
```

---

## 🎯 Quality Gates

### Before Merging to Main

**MUST PASS** ✅
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Coverage >= 80%
- [ ] Code review approved (2 reviewers)
- [ ] No console errors/warnings
- [ ] No security issues
- [ ] No breaking changes

**SHOULD PASS** ⚠️
- [ ] Linting passes
- [ ] Performance benchmarks OK
- [ ] Documentation complete
- [ ] User story acceptance criteria met

**NICE TO HAVE** 💡
- [ ] Added new test cases
- [ ] Reduced complexity
- [ ] Improved performance
- [ ] Refactored legacy code

---

## 📞 Getting Help

### Common Issues & Solutions

**Tests failing randomly?**
- [ ] Check database state (`docker logs batasite-db`)
- [ ] Restart containers (`docker-compose restart`)
- [ ] Clear node_modules (`rm -rf node_modules && npm install`)

**Port conflicts?**
- [ ] Check ports in use (`lsof -i :3000`)
- [ ] Update .env if needed

**Git conflicts?**
- [ ] Pull latest main
- [ ] Rebase feature branch
- [ ] Resolve conflicts locally
- [ ] Run tests after merge

**Performance issues?**
- [ ] Profile with Node profiler
- [ ] Check database queries
- [ ] Review algorithm complexity

---

## 📚 References

- **ROADMAP.md** - Project overview & phases
- **USER_STORIES.md** - Detailed user stories
- **SPRINT_TRACKING.md** - Previous sprints & metrics
- **ADR.md** - Architecture decisions
- **PROJECT.md** - Original specifications
- **back/README.md** - Backend documentation

---

## 📝 Notes for Future Iterations

```
From Sprint 1 learnings:
- TDD discipline keeps code clean ✅
- Audit at end catches issues → do continuous audits
- Documentation matters! ✅
- Refactoring after tests green improves code quality ✅
- Daily standups unnecessary for solo dev (but good for team)
```

---

**Last Updated**: 9 décembre 2025  
**Applicable Starting**: Sprint 1.5

