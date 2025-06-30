# Index de la Documentation des Tests - Oniria

## 📋 Vue d'ensemble

Cette documentation complète couvre tous les aspects des tests unitaires de l'application Oniria, de la philosophie générale aux détails d'implémentation.

## 📚 Documentation Disponible

### 1. [README des Tests](../src/__tests__/README.md)
- Introduction rapide aux tests
- Structure des fichiers de test
- Scripts de lancement
- Configuration de base

### 2. [Architecture et Philosophie](./TESTS_ARCHITECTURE.md)
- Philosophie TDD adaptée
- Architecture hiérarchique des tests
- Anatomie d'un fichier de test
- Stratégies par type de composant
- Gestion des mocks
- Patterns avancés
- Bonnes pratiques

### 3. [Guide de Contribution](./TESTS_CONTRIBUTING.md)
- Workflow de développement
- Templates de tests prêts à l'emploi
- Helpers et utilitaires
- Stratégies de mocking
- Tests d'intégration
- Debugging et performance
- Validation CI/CD

## 🚀 Démarrage Rapide

### Pour Lancer les Tests
```bash
# Tous les tests
npm test

# Mode développement (watch)
npm run test:watch

# Avec couverture
npm run test:coverage
```

### Pour Écrire un Nouveau Test
1. Créer le fichier `[NomComposant].test.tsx` dans le bon dossier
2. Utiliser les templates du guide de contribution
3. Utiliser les helpers existants
4. Valider avec `npm test`

## 🏗️ Architecture Générale

```
docs/
├── README.md                    # Ce fichier
├── TESTS_ARCHITECTURE.md        # Architecture détaillée
└── TESTS_CONTRIBUTING.md        # Guide pratique

src/
├── __tests__/
│   ├── README.md               # Introduction aux tests
│   ├── Component/              # Tests des composants
│   └── app/                    # Tests des écrans
├── Component/                  # Code source des composants
└── app/                       # Code source des écrans

jest.setup.js                  # Configuration globale des mocks
package.json                   # Configuration Jest
```

## 🎯 Objectifs des Tests

- **Fiabilité** : Détecter les régressions rapidement
- **Maintenabilité** : Tests faciles à comprendre et modifier
- **Couverture** : Couvrir les chemins critiques
- **Performance** : Tests rapides et efficaces

## 🔧 Outils et Technologies

- **Jest** : Framework de test principal
- **React Native Testing Library** : Utilitaires de test
- **TypeScript** : Typage des tests
- **Expo** : Preset Jest pour Expo
- **Axios Mocking** : Simulation des appels API

## 📊 État Actuel

- ✅ 62 tests actifs
- ✅ 100% de réussite
- ✅ Couverture des composants critiques
- ✅ Mocks alignés sur la structure SQL réelle
- ✅ Documentation complète

## 🤝 Contribution

1. Lire le [Guide de Contribution](./TESTS_CONTRIBUTING.md)
2. Utiliser les templates fournis
3. Respecter les conventions de nommage
4. Valider avec `npm test` avant commit

## 📞 Support

Pour toute question sur les tests :
1. Consulter cette documentation
2. Examiner les tests existants comme exemples
3. Utiliser les helpers et templates fournis

---

*Cette documentation évolue avec l'application. Proposez des améliorations via les pull requests.*
