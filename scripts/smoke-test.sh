#!/bin/bash

echo "🔥 Lancement des Smoke Tests..."
echo "================================"

# Attendre que le conteneur soit prêt
echo "⏳ Attente du démarrage de l'application..."
sleep 8

# Vérifier que le port est accessible
echo "🔍 Vérification de la disponibilité du port..."
for i in {1..10}; do
    if curl -s http://localhost:${TEST_PORT:-3000} > /dev/null; then
        echo "✅ Application accessible!"
        break
    fi
    echo "   Tentative $i/10..."
    sleep 2
done

# Exécuter les tests
echo ""
echo "🧪 Exécution des tests smoke..."
node tests/smoke-test.js

# Capturer le code de sortie
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Tous les smoke tests ont réussi!"
else
    echo "❌ Les smoke tests ont échoué!"
fi

exit $EXIT_CODE