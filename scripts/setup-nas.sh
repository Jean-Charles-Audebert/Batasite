#!/bin/bash

# Script de configuration initiale du NAS pour Batasite
# À exécuter une seule fois sur le NAS

set -e

echo "=== Configuration Batasite sur NAS ==="

# Variables
DOCKER_DIR="/volume1/docker/batasite"
IMAGE_NAME="iousco/batasite"

echo "1. Création du répertoire Docker..."
mkdir -p $DOCKER_DIR
cd $DOCKER_DIR

echo "2. Vérification de Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Installez-le via Container Manager sur le NAS"
    exit 1
fi

echo "3. Vérification du .env..."
if [ ! -f "$DOCKER_DIR/.env" ]; then
    echo "❌ Le fichier .env est manquant dans $DOCKER_DIR"
    echo "Veuillez copier le .env du projet dans ce répertoire"
    exit 1
fi

echo "4. Test de connexion à Docker Hub..."
docker login --username $DOCKER_USERNAME --password $DOCKER_TOKEN || {
    echo "❌ Impossible de se connecter à Docker Hub"
    exit 1
}

echo "5. Téléchargement de l'image Docker..."
docker pull $IMAGE_NAME:latest || {
    echo "❌ Impossible de télécharger l'image"
    exit 1
}

echo "6. Arrêt des anciens containers..."
docker stop batasite 2>/dev/null || true
docker rm batasite 2>/dev/null || true

echo "7. Lancement du container..."
docker run -d \
    --name batasite \
    --restart always \
    -p 3000:80 \
    --env-file $DOCKER_DIR/.env \
    $IMAGE_NAME:latest

echo "8. Vérification du container..."
sleep 2
if docker ps | grep -q batasite; then
    echo "✅ Container lancé avec succès !"
    echo "L'application est accessible sur http://localhost:3000"
    docker logs batasite
else
    echo "❌ Le container n'a pas démarré"
    docker logs batasite
    exit 1
fi

echo ""
echo "=== Configuration terminée ==="
echo "Pour vérifier le statut : docker ps -a | grep batasite"
echo "Pour voir les logs : docker logs -f batasite"
echo "Pour arrêter : docker stop batasite"
