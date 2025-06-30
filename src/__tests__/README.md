# Tests Unitaires - Oniria

Ce dossier contient tous les tests unitaires pour l'application Oniria.

## 📚 Documentation Complète

- **[Architecture et Philosophie](../docs/TESTS_ARCHITECTURE.md)** - Vue d'ensemble détaillée de l'architecture des tests
- **[Guide de Contribution](../docs/TESTS_CONTRIBUTING.md)** - Instructions pratiques pour écrire et maintenir les tests

## Structure des Tests

```
src/__tests__/
├── Component/                    # Tests des composants réutilisables
│   ├── MyButton.test.tsx        # Tests du composant bouton personnalisé
│   └── TimerComponent.test.tsx   # Tests du composant timer
├── app/                         # Tests des écrans de l'application
│   ├── _layout.test.tsx         # Tests du layout principal
│   ├── index.test.tsx           # Tests de l'écran d'accueil
│   ├── qcm.test.tsx            # Tests de l'écran de questionnaire
│   └── result.test.tsx         # Tests de l'écran de résultats
└── integration/                 # Tests d'intégration (nouveaux)
    ├── README.md                # Documentation des tests d'intégration
    ├── userFlow.integration.test.tsx     # Tests de flux utilisateur complets
    ├── api.integration.test.tsx          # Tests d'intégration API
    └── navigation.e2e.test.tsx           # Tests de navigation end-to-end
```

## Configuration

Les tests utilisent :
- **Jest** : Framework de test principal
- **React Native Testing Library** : Utilitaires de test pour React Native
- **@testing-library/jest-native** : Matchers Jest supplémentaires
- **Jest Expo** : Preset Jest optimisé pour Expo

### Configuration Centralisée
- `jest.setup.js` : Mocks globaux et configuration partagée
- `package.json` : Configuration Jest et scripts de test

## Scripts Disponibles

```bash
# Lancer tous les tests (unitaires + intégration)
npm test

# Tests unitaires seulement
npm run test:unit

# Tests d'intégration seulement
npm run test:integration

# Tests en mode watch (développement)
npm run test:watch

# Tests d'intégration en mode watch
npm run test:integration:watch

# Tests avec couverture de code
npm run test:coverage

# Tests d'intégration avec couverture
npm run test:integration:coverage

# Générer un rapport de tests détaillé (HTML + JSON)
npm run test:report

# Générer un rapport COMPLET de tous les tests (unitaires + intégration)
npm run test:report:all

# Tests pour CI/CD
npm run test:ci
```

## Philosophie des Tests

### 🎯 Approche Comportementale
Nous testons le **comportement utilisateur** plutôt que l'implémentation technique :
- ✅ "L'utilisateur voit le message de bienvenue"
- ❌ "Le state showMessage est true"

### 🔄 Tests de Régression
Chaque bug corrigé = un nouveau test pour éviter la régression.

### 🏗️ Structure Modulaire
- **Mocks globaux** dans `jest.setup.js`
- **Helpers réutilisables** pour le rendu avec contexte
- **Données de test réalistes** alignées sur la structure SQL

### 📊 Couverture Complète
- **Tests unitaires** : Composants isolés avec mocks complets
- **Tests d'intégration** : Flux complets avec mocks minimaux
- **Tests E2E** : Navigation et interactions réelles

## Tests des Composants

### MyButton.test.tsx
- ✅ Rendu correct avec les props données
- ✅ Appel de la fonction handleRedirect au clic
- ✅ Affichage du texte correct
- ✅ Mode élevé du bouton

### TimerComponent.test.tsx
- ✅ Rendu correct
- ✅ Progression initiale à 0%
- ✅ Mise à jour de la progression dans le temps
- ✅ Completion après la durée complète
- ✅ Gestion de durée zéro

## Tests des Écrans

### index.test.tsx (Page d'accueil)
- ✅ Affichage du message de bienvenue
- ✅ Rendu de l'input de texte
- ✅ Affichage du bouton de démarrage
- ✅ Navigation vers QCM avec paramètres
- ✅ Titre de l'en-tête correct

### qcm.test.tsx (Questionnaire)
- ✅ Affichage du salut utilisateur
- ✅ Chargement et affichage des questions depuis l'API
- ✅ Affichage des options de réponse
- ✅ Gestion de la sélection de réponse correcte
- ✅ Navigation vers l'écran de résultat
- ✅ Gestion des erreurs API

### result.test.tsx (Résultats)
- ✅ Affichage du nom utilisateur
- ✅ Message de félicitations
- ✅ Message de remerciement
- ✅ Bouton de retour à l'accueil
- ✅ Navigation vers l'accueil
- ✅ Affichage de l'image trophée

### _layout.test.tsx (Layout)
- ✅ Rendu sans crash
- ✅ Enveloppe Stack dans PaperProvider
- ✅ Fourniture du contexte de thème Paper

## Tests d'Intégration (Nouveaux !)

### 🔗 Flux Utilisateur Complets (userFlow.integration.test.tsx)
- ✅ Parcours Accueil → QCM → Résultats
- ✅ Transmission des données entre écrans
- ✅ Gestion d'erreurs cross-composants
- ✅ Performance des interactions utilisateur
- ✅ Tests de cohérence des données

### 🌐 Intégration API (api.integration.test.tsx)
- ✅ Requêtes API avec données réalistes
- ✅ Gestion des timeouts et erreurs serveur
- ✅ Validation des structures de données
- ✅ Tests de performance API
- ✅ Intégrité questions/réponses
- ✅ Requêtes concurrent

### 🧭 Navigation End-to-End (navigation.e2e.test.tsx)
- ✅ Navigation complète entre écrans
- ✅ Gestion des paramètres d'URL
- ✅ Deep linking et navigation directe
- ✅ Stack management et historique
- ✅ Récupération d'erreurs de navigation
- ✅ Tests de performance de navigation

## Mocks

Les tests utilisent des mocks pour :
- **expo-router** : Navigation et paramètres
- **expo-status-bar** : Barre de statut
- **react-native-paper** : Composants UI
- **axios** : Appels API
- **Images** : Assets statiques

## Couverture de Code

Les tests couvrent :
- Tous les composants dans `src/Component/`
- Tous les écrans dans `src/app/`
- Logique de navigation
- Appels API
- Gestion des erreurs
- Interactions utilisateur

## Génération de Rapports

### 📊 Rapport de Tests Complet
```bash
# Générer un rapport HTML détaillé avec couverture
npm run test:report
```

Ce script génère :
- **Rapport HTML interactif** : `coverage/lcov-report/index.html`
- **Rapport JSON** : `coverage/coverage-final.json`
- **Rapport LCOV** : `coverage/lcov.info`
- **Métriques détaillées** par fichier et fonction

### 📈 Types de Rapports Disponibles

1. **Rapport de Couverture Standard**
   ```bash
   npm run test:coverage
   ```
   - Affichage dans le terminal
   - Métriques globales (statements, branches, functions, lines)

2. **Rapport d'Intégration**
   ```bash
   npm run test:integration:coverage
   ```
   - Couverture spécifique aux tests d'intégration
   - Métriques des flux complets

3. **Rapport Complet (HTML)**
   ```bash
   npm run test:report
   ```
   - Interface web interactive
   - Navigation par fichier
   - Détail ligne par ligne
   - Code coverage highlighting

4. **Rapport TOTAL - Tous les Tests (Recommandé)**
   ```bash
   npm run test:report:all
   ```
   - **Tous les tests** : unitaires + intégration + E2E
   - **Rapport HTML complet** avec toutes les métriques
   - **Résumé détaillé** affiché dans le terminal
   - **Analyse complète** de la couverture de code
   - **Détection des handles ouverts** pour identifier les fuites mémoire

### 📍 Accès au Rapport HTML
Après génération, ouvrez dans votre navigateur :
```
coverage/lcov-report/index.html
```

Le rapport interactif permet de :
- ✅ Naviguer dans l'arborescence des fichiers
- ✅ Voir la couverture ligne par ligne avec code highlighting
- ✅ Identifier les branches non testées (rouge/vert)
- ✅ Analyser les métriques par composant
- ✅ Exporter les données pour CI/CD

## Bonnes Pratiques

1. **Isolation** : Chaque test est isolé avec des mocks appropriés
2. **Nettoyage** : Les mocks sont réinitialisés entre les tests
3. **Attente** : Utilisation de `waitFor` pour les opérations asynchrones
4. **Lisibilité** : Tests descriptifs avec des noms explicites
5. **Couverture** : Tests des cas normaux et des cas d'erreur

## Lancer les Tests

```bash
# Installation des dépendances (si nécessaire)
npm install

# Lancer tous les tests
npm test

# Tests en mode watch (utile pendant le développement)
npm run test:watch

# Tests avec rapport de couverture
npm run test:coverage
```

## Débuggage

Pour débugger les tests :
1. Utilisez `console.log` dans les tests
2. Utilisez `screen.debug()` pour voir le DOM rendu
3. Vérifiez les mocks avec `jest.fn().mockClear()`
