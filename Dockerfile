# Build stage pour le front
FROM node:20-alpine as front-builder
WORKDIR /app/front
COPY front/ ./
RUN npm ci 2>/dev/null || true
RUN npm run build || true

# Stage final - serveur web statique
FROM nginx:alpine

# Copier les fichiers HTML, CSS, JS à la racine
COPY front/index.html /usr/share/nginx/html/
COPY front/index.css /usr/share/nginx/html/
COPY front/main.js /usr/share/nginx/html/

# Copier le dossier public avec tous les assets
COPY front/public/ /usr/share/nginx/html/public/

# Configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
