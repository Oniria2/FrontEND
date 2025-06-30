# 🧪 Tableau de Bord des Tests - Application Oniria

## 🎯 État Global des Tests

| Métrique | Valeur | Status |
|----------|---------|---------|
| **Suites de tests** | 15 | ✅ |
| **Tests totaux** | 100 | ✅ |
| **Tests passants** | 100 (100%) | ✅ |
| **Couverture des statements** | 92.77% | ✅ |
| **Couverture des branches** | 75% | ⚠️ |
| **Couverture des fonctions** | 95.83% | ✅ |
| **Couverture des lignes** | 92.4% | ✅ |

> **Note** : Couverture globale excellente (>90%). Seule la couverture des branches pourrait être améliorée.

## 📊 Répartition des Tests

### Tests Unitaires (62 tests)
- **Components** : 9 tests (MyButton, TimerComponent)
- **Screens** : 53 tests (index, qcm, result, _layout)

### Tests d'Intégration (38 tests)
- **Flux utilisateur** : 10 tests complets
- **API Integration** : 14 tests d'API
- **Navigation E2E** : 14 tests de navigation

## 🚀 Commande Recommandée

```bash
# Commande principale pour générer un rapport complet
npm run test:report:all
```

**Cette commande génère :**
- ✅ Exécution complète (unitaires + intégration + E2E)
- ✅ Rapport HTML interactif (`coverage/lcov-report/index.html`)
- ✅ Résumé détaillé dans le terminal
- ✅ Exports JSON et LCOV pour CI/CD
- ✅ Détection des fuites mémoire

## 📋 Autres Commandes Utiles

```bash
# Tests standards
npm test                    # Tous les tests
npm run test:unit          # Tests unitaires uniquement
npm run test:integration   # Tests d'intégration uniquement

# Mode développement
npm run test:watch         # Mode watch pour tous les tests
npm run test:integration:watch  # Mode watch pour les tests d'intégration

# Rapports et couverture
npm run test:coverage      # Couverture simple
npm run test:report        # Rapport HTML
npm run test:ci           # Tests pour CI/CD
```

## 📁 Accès au Rapport HTML

Après avoir exécuté `npm run test:report:all` :

1. **Ouvrir le fichier** : `coverage/lcov-report/index.html`
2. **Navigation** : 
   - Vue d'ensemble du projet
   - Analyse détaillée par fichier
   - Visualisation ligne par ligne
   - Statistiques complètes

## 🔍 Couverture par Module

| Module | Statements | Branches | Functions | Lines |
|--------|------------|----------|-----------|-------|
| **src/app/** | ~95% | ~80% | ~100% | ~95% |
| **src/Component/** | ~90% | ~70% | ~90% | ~90% |
| **Global** | **92.77%** | **75%** | **95.83%** | **92.4%** |

## 📖 Documentation Associée

- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Guide rapide pour développeurs
- **[README.md](./README.md)** - Documentation générale avec section tests
- **[src/__tests__/README.md](./src/__tests__/README.md)** - Documentation technique détaillée
- **[src/__tests__/integration/README.md](./src/__tests__/integration/README.md)** - Spécificités des tests d'intégration

## ⚡ Performance

- **Temps d'exécution** : ~5 secondes (tous les tests)
- **Tests parallèles** : Activés
- **Mocks optimisés** : Oui
- **Détection des fuites** : Activée

## ⚠️ Points d'Attention

1. **Warnings `act()`** : Présents mais n'empêchent pas l'exécution
2. **Couverture des branches** : 75% (objectif : 80%+)
3. **Tests E2E** : Nécessitent des mocks réseau

## 🎯 Objectifs de Qualité

| Critère | Cible | Actuel | Status |
|---------|-------|---------|---------|
| Tests passants | 100% | 100% | ✅ |
| Couverture statements | >90% | 92.77% | ✅ |
| Couverture branches | >80% | 75% | ⚠️ |
| Couverture fonctions | >90% | 95.83% | ✅ |
| Temps d'exécution | <10s | ~5s | ✅ |

---

## 📞 Support

Pour toute question sur les tests :
1. Consulter la documentation dans `src/__tests__/README.md`
2. Vérifier les exemples dans les fichiers de tests existants
3. Suivre les bonnes pratiques du `TESTING_GUIDE.md`

**Dernière mise à jour** : Générée automatiquement lors des tests
