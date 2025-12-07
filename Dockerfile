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

# Copier les fichiers du front
COPY --from=front-builder /app/front/index.html ./
COPY --from=front-builder /app/front/index.css ./
COPY --from=front-builder /app/front/main.js ./
COPY --from=front-builder /app/front/public/ ./public/

# Configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
