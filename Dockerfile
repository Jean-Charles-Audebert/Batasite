# Build stage pour le front
FROM node:20-alpine as front-builder
WORKDIR /app/front
COPY front/package*.json ./
RUN npm ci
COPY front/ ./
RUN npm run build || true

# Stage final - serveur web statique
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copier tous les fichiers du front (HTML, CSS, JS, images, etc)
COPY front/index.html ./
COPY front/index.css ./
COPY front/main.js ./

# Copier les fichiers publics (images, vidéos, etc) s'ils existent
# On copie le contenu du dossier public s'il existe, sinon on continue
RUN mkdir -p ./public
COPY front/public/ ./public/ || true

# Configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
