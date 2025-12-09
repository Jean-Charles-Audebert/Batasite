# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (prod + dev pour les tests)
RUN npm ci

# Application stage
FROM node:20-alpine

WORKDIR /app

# Définir l'utilisateur non-root par défaut
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copier les dépendances depuis le builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./

# Copier le code source
COPY --chown=nodejs:nodejs src ./src

# Utiliser l'utilisateur non-root
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]

# Copie le code source
COPY src ./src
COPY .env* ./

# Expose le port
EXPOSE 3000

# Démarre le serveur
CMD ["npm", "start"]
