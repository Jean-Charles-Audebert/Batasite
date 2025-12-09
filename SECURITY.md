# 🔒 Sécurité - Guide de Configuration

## Variables d'environnement sensibles

**JAMAIS committer le fichier `.env` sur Git !**

### Configuration locale

1. Copier le fichier d'exemple:
```bash
cp .env.example .env
```

2. Éditer `.env` avec vos vraies valeurs:
```bash
# Générer des JWT secrets sécurisés:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Configuration en production

Sur votre serveur/NAS Synology:

1. **Ne JAMAIS inclure `.env` dans Docker**
2. **Utiliser les secrets Docker ou les variables d'environnement du système**

Exemple pour Docker Swarm (Synology):
```bash
docker run \
  -e POSTGRES_USER=dbbadmin \
  -e POSTGRES_PASSWORD=<secure_password> \
  -e JWT_SECRET=<secure_jwt_secret> \
  ... autres variables ...
  batasite-backend
```

## Bonnes pratiques

✅ **À faire:**
- ✓ Utiliser `.env.example` comme template
- ✓ Générer des secrets sécurisés en production
- ✓ Utiliser des passwords manager (1Password, Bitwarden, etc.)
- ✓ Changer les credentials par défaut
- ✓ Utiliser HTTPS/TLS en production
- ✓ Limiter les accès DB (pare-feu)

❌ **À NE PAS faire:**
- ✗ Committer `.env` sur Git
- ✗ Exposer les credentials en logs
- ✗ Utiliser des passwords par défaut en production
- ✗ Stocker les secrets en dur dans le code
- ✗ Ignorer les mises à jour de sécurité

## Fichiers git-ignorés

```
.env
.env.local
.env.*.local
.env.production.local
```

Vérifier que les fichiers sensibles ne sont PAS dans Git:
```bash
git status
git ls-files | grep -E "\.env|credentials|secrets"
```

## Variables d'environnement requises

Voir `.env.example` pour la liste complète et les descriptions.

**Minimales pour démarrage:**
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DB_PORT`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV`

## Documentation

- [OWASP - Environment Variables](https://owasp.org/www-community/Sensitive_Data_Exposure)
- [12 Factor App - Config](https://12factor.net/config)
- [Docker Security](https://docs.docker.com/engine/security/)
