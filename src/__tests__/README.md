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
└── app/                         # Tests des écrans de l'application
    ├── _layout.test.tsx         # Tests du layout principal
    ├── index.test.tsx           # Tests de l'écran d'accueil
    ├── qcm.test.tsx            # Tests de l'écran de questionnaire
    └── result.test.tsx         # Tests de l'écran de résultats
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
# Lancer tous les tests
npm test

# Lancer les tests en mode watch (développement)
npm run test:watch

# Lancer les tests avec couverture de code
npm run test:coverage

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
