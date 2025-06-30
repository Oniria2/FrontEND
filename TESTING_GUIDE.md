# Guide de Tests - Application Oniria

## Vue d'ensemble

Cette application dispose d'une suite de tests complète comprenant :
- **Tests unitaires** : Validation des composants individuels
- **Tests d'intégration** : Validation des flux complets et API
- **Tests E2E** : Tests de navigation et d'interactions

## Commandes rapides

```bash
# Exécuter tous les tests
npm test

# Générer un rapport de couverture complet
npm run test:report

# Tests d'intégration uniquement
npm run test:integration

# Tests en mode watch (développement)
npm run test:watch
```

## Rapport de Couverture

### Génération
```bash
npm run test:report
```

### Consultation
Ouvrir dans votre navigateur : `coverage/lcov-report/index.html`

### Interprétation
- **Vert** : Code bien couvert par les tests
- **Rouge** : Code non testé nécessitant une attention
- **Jaune** : Couverture partielle

## Structure des Tests

```
src/__tests__/
├── Component/               # Tests unitaires des composants
├── app/                    # Tests unitaires des écrans
└── integration/            # Tests d'intégration et E2E
    ├── api.integration.test.tsx        # Tests API
    ├── userFlow.integration.test.tsx   # Tests de flux utilisateur
    └── navigation.e2e.test.tsx         # Tests de navigation
```

## Statistiques Actuelles

- **✅ 15 suites de tests**
- **✅ 100 tests passent**
- **✅ 38 tests d'intégration**
- **✅ Documentation complète**

## Bonnes Pratiques

1. **Exécuter les tests avant commit**
2. **Maintenir >80% de couverture**
3. **Documenter les nouveaux tests**
4. **Utiliser des données de test réalistes**

## Documentation Complète

Voir `src/__tests__/README.md` pour la documentation technique détaillée.
