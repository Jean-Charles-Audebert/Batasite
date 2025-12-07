# Build stage pour le front
FROM node:20-alpine as front-builder
WORKDIR /app/front
COPY front/ ./
RUN npm ci 2>/dev/null || true
RUN npm run build || true

# Stage final - serveur web statique
FROM nginx:alpine

# Copier tous les fichiers du front
COPY front/ /usr/share/nginx/html/

# Configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
