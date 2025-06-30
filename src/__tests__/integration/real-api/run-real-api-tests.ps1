# Script PowerShell pour lancer les tests d'API réelle
# Usage: .\run-real-api-tests.ps1 [options]

param(
    [string]$TestType = "all"
)

Write-Host "🌐 Tests d'Intégration API Réelle - Heroku" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier la connexion internet
Write-Host "🔍 Vérification de la connexion..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://qcm-api-a108ec633b51.herokuapp.com/questions/1" -Method Head -TimeoutSec 10
    Write-Host "✅ API accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ API non accessible - Vérifiez votre connexion internet" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Lancer les tests selon l'argument
switch ($TestType) {
    "questions" {
        Write-Host "🤔 Tests des Questions uniquement..." -ForegroundColor Blue
        npm test -- real-api.integration.test.tsx -t "Real Questions API"
    }
    "responses" {
        Write-Host "💬 Tests des Réponses uniquement..." -ForegroundColor Blue
        npm test -- real-api.integration.test.tsx -t "Real Responses API"
    }
    "performance" {
        Write-Host "⚡ Tests de Performance uniquement..." -ForegroundColor Blue
        npm test -- real-api.integration.test.tsx -t "Performance"
    }
    "errors" {
        Write-Host "🛡️ Tests de Gestion d'Erreurs uniquement..." -ForegroundColor Blue
        npm test -- real-api.integration.test.tsx -t "Error Handling"
    }
    "watch" {
        Write-Host "👀 Mode Watch - Surveille les changements..." -ForegroundColor Blue
        npm test -- real-api.integration.test.tsx --watch
    }
    "verbose" {
        Write-Host "📝 Mode Verbose - Tous les détails..." -ForegroundColor Blue
        npm test -- real-api.integration.test.tsx --verbose
    }
    default {
        Write-Host "🚀 Tous les tests d'API réelle..." -ForegroundColor Blue
        Write-Host "⏳ Patience, les vraies requêtes prennent du temps..." -ForegroundColor Yellow
        npm test src/__tests__/integration/real-api/real-api.integration.test.tsx
    }
}

Write-Host ""
Write-Host "✨ Tests terminés !" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Commandes disponibles:" -ForegroundColor Cyan
Write-Host "  .\run-real-api-tests.ps1 questions    - Tests des questions"
Write-Host "  .\run-real-api-tests.ps1 responses    - Tests des réponses"
Write-Host "  .\run-real-api-tests.ps1 performance  - Tests de performance"
Write-Host "  .\run-real-api-tests.ps1 errors       - Tests d'erreurs"
Write-Host "  .\run-real-api-tests.ps1 watch        - Mode surveillance"
Write-Host "  .\run-real-api-tests.ps1 verbose      - Mode détaillé"
