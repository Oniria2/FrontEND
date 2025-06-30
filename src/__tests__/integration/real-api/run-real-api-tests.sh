#!/bin/bash

# Script pour lancer les tests d'API réelle
# Usage: ./run-real-api-tests.sh [options]

echo "🌐 Tests d'Intégration API Réelle - Heroku"
echo "=========================================="
echo ""

# Vérifier la connexion internet
echo "🔍 Vérification de la connexion..."
if curl -s --head https://qcm-api-a108ec633b51.herokuapp.com/questions/1 > /dev/null; then
    echo "✅ API accessible"
else
    echo "❌ API non accessible - Vérifiez votre connexion internet"
    exit 1
fi

echo ""

# Lancer les tests selon l'argument
case "$1" in
    "questions")
        echo "🤔 Tests des Questions uniquement..."
        npm test -- real-api.integration.test.tsx -t "Real Questions API"
        ;;
    "responses")
        echo "💬 Tests des Réponses uniquement..."
        npm test -- real-api.integration.test.tsx -t "Real Responses API"
        ;;
    "performance")
        echo "⚡ Tests de Performance uniquement..."
        npm test -- real-api.integration.test.tsx -t "Performance"
        ;;
    "errors")
        echo "🛡️ Tests de Gestion d'Erreurs uniquement..."
        npm test -- real-api.integration.test.tsx -t "Error Handling"
        ;;
    "watch")
        echo "👀 Mode Watch - Surveille les changements..."
        npm test -- real-api.integration.test.tsx --watch
        ;;
    "verbose")
        echo "📝 Mode Verbose - Tous les détails..."
        npm test -- real-api.integration.test.tsx --verbose
        ;;
    *)
        echo "🚀 Tous les tests d'API réelle..."
        echo "⏳ Patience, les vraies requêtes prennent du temps..."
        npm test src/__tests__/integration/real-api/real-api.integration.test.tsx
        ;;
esac

echo ""
echo "✨ Tests terminés !"
echo ""
echo "💡 Commandes disponibles:"
echo "  ./run-real-api-tests.sh questions    - Tests des questions"
echo "  ./run-real-api-tests.sh responses    - Tests des réponses"
echo "  ./run-real-api-tests.sh performance  - Tests de performance"
echo "  ./run-real-api-tests.sh errors       - Tests d'erreurs"
echo "  ./run-real-api-tests.sh watch        - Mode surveillance"
echo "  ./run-real-api-tests.sh verbose      - Mode détaillé"
