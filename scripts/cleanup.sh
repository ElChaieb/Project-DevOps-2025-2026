#!/bin/bash

echo "🧹 Nettoyage en cours..."
echo "======================="

# Arrêter et supprimer les conteneurs
echo "🛑 Arrêt des conteneurs..."
docker ps -a | grep devops-task-manager | awk '{print $1}' | xargs -r docker stop 2>/dev/null
docker ps -a | grep devops-task-manager | awk '{print $1}' | xargs -r docker rm 2>/dev/null

# Nettoyer les artefacts de build
echo "🗑️  Suppression des artefacts..."
rm -rf dist/
rm -rf node_modules/.vite
rm -f *.log

echo ""
echo "✅ Nettoyage terminé!"