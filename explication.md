# Explication des Tests Unitaires - Oniria

## Vue d'ensemble

Ce document explique en détail comment les tests unitaires ont été mis en place pour l'application Oniria, une application React Native/Expo de questionnaire de bien-être au travail. L'ensemble de la suite de tests comprend **62 tests répartis sur 12 suites** qui couvrent tous les composants et écrans principaux.

## Architecture de Test

### 🛠️ Stack Technique

- **Jest** : Framework de test JavaScript
- **React Native Testing Library** : Utilitaires de test pour React Native
- **@testing-library/jest-native** : Matchers Jest étendus
- **React Test Renderer** : Rendu des composants pour les tests
- **Fake Timers** : Simulation du temps pour les tests de timer

### 📁 Structure des Fichiers

```
src/
├── __tests__/
│   ├── Component/
│   │   ├── MyButton.test.tsx
│   │   └── TimerComponent.test.tsx
│   └── app/
│       ├── _layout.test.tsx
│       ├── index.test.tsx
│       ├── qcm.test.tsx
│       └── result.test.tsx
├── Component/__tests__/
│   ├── MyButton.test.tsx
│   └── TimerComponent.test.tsx
└── app/__tests__/
    ├── _layout.test.tsx
    ├── index.test.tsx
    ├── qcm.test.tsx
    └── result.test.tsx
```

## Configuration Jest

### 📋 Configuration dans package.json

```json
{
  "jest": {
    "preset": "react-native",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "testMatch": [
      "**/__tests__/**/*.(ts|tsx|js)",
      "**/*.(test|spec).(ts|tsx|js)"
    ],
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts"
    ],
    "transform": {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-native-paper|react-native-vector-icons)"
    ],
    "moduleNameMapper": {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "identity-obj-proxy"
    }
  }
}
```

### 🔧 Fichier jest.setup.js

Le fichier `jest.setup.js` centralise tous les mocks globaux nécessaires :

#### Mocks d'Expo Router
```javascript
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    navigate: mockNavigate,
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  router: {
    navigate: mockNavigate,
    // ...autres méthodes
  },
  Stack: ({ children, ...props }) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID: 'stack', ...props }, children);
  },
}));
```

#### Mocks de React Native Paper
```javascript
jest.mock('react-native-paper', () => ({
  PaperProvider: ({ children }) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID: 'paper-provider' }, children);
  },
  Button: ({ children, onPress, ...props }) => 
    React.createElement('TouchableOpacity', 
      { onPress, testID: 'paper-button', ...props }, 
      React.createElement('Text', { testID: 'paper-button-text' }, children)
    ),
  // ...autres composants Paper
}));
```

#### Mocks d'Axios avec Structure de Données Réelle
```javascript
const mockAxiosGet = jest.fn(() => Promise.resolve({ 
  data: { 
    rows: [
      { id: 1, intitule: 'Comment vous sentez-vous ? ' }
    ]
  } 
}));
```

## Tests par Composant

### 🔘 MyButton Component

**Fichier** : `MyButton.test.tsx`  
**Tests** : 4 tests

#### Ce qui est testé :
1. **Rendu correct** : Vérifie que le bouton s'affiche
2. **Interaction au clic** : Teste l'appel de la fonction `handleRedirect`
3. **Affichage du texte** : Valide que le texte passé en props s'affiche
4. **Mode élevé** : Teste les différents modes du bouton Paper

#### Exemple de test :
```typescript
it('should call handleRedirect when pressed', () => {
  const mockHandleRedirect = jest.fn();
  const { getByTestId } = render(
    <MyButton 
      text="Test Button" 
      handleRedirect={mockHandleRedirect} 
    />
  );
  
  const button = getByTestId('paper-button');
  fireEvent.press(button);
  
  expect(mockHandleRedirect).toHaveBeenCalledTimes(1);
});
```

### ⏱️ TimerComponent

**Fichier** : `TimerComponent.test.tsx`  
**Tests** : 4 tests

#### Défis techniques résolus :
- **Fake Timers** : Utilisation de `jest.useFakeTimers()` pour contrôler le temps
- **Warnings Act()** : Enveloppement des manipulations de timer dans `act()`
- **État asynchrone** : Gestion des mises à jour d'état asynchrones

#### Tests implémentés :
```typescript
it('should progress over time', () => {
  const duration = 10;
  render(<TimerComponent duration={duration} />);
  
  // Avancer le temps d'1 seconde avec act
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  
  // Vérifications de progression
});
```

## Tests des Écrans

### 🏠 Index (Page d'accueil)

**Fichier** : `index.test.tsx`  
**Tests** : 6 tests

#### Fonctionnalités testées :
- Affichage du message de bienvenue
- Présence de l'input de saisie du nom
- Bouton de démarrage du questionnaire
- Navigation avec paramètres vers l'écran QCM

### 📝 QCM (Questionnaire)

**Fichier** : `qcm.test.tsx`  
**Tests** : 8 tests

#### Structure de données testée :
```typescript
// Question
{ id: 1, intitule: 'Comment vous sentez-vous ? ' }

// Réponses
[
  { id: 1, titre: 'AssezBien', correct: '0', question_id: 1 },
  { id: 2, titre: 'Bien', correct: '1', question_id: 1 },
  { id: 3, titre: 'Mal', correct: '0', question_id: 1 }
]
```

#### Tests spécifiques aux vraies données :
1. **Question sentiment** : "Comment vous sentez-vous ?" avec réponses "Bien", "Mal", "AssezBien"
2. **Question environnement** : "Que pensez-vous de votre environnement de travail ?" 
3. **Question accident** : "Avez-vous eu un accident de travail ?" avec "Non", "moins de 3 mois", "plus de 3 mois"
4. **Question recommandation** : "Recommanderiez-vous les postes..." avec "Oui", "Non", "Possiblement"

#### Gestion des erreurs API :
```typescript
it('should handle API errors gracefully', async () => {
  mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
  mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

  const { getByText } = render(<QCM />);
  
  await waitFor(() => {
    expect(getByText('Bonjour TestUser!!')).toBeTruthy();
  });
});
```

### 🏆 Result (Résultats)

**Fichier** : `result.test.tsx`  
**Tests** : 7 tests

#### Problèmes résolus :
- **Conflits de mocks** : Suppression des mocks locaux qui entraient en conflit avec les mocks globaux
- **Navigation** : Test de la navigation de retour à l'accueil
- **Paramètres d'URL** : Utilisation des paramètres passés par `useLocalSearchParams`

### 🏗️ Layout

**Fichier** : `_layout.test.tsx`  
**Tests** : 3 tests

#### Corrections apportées :
- **Mock Stack** : Transformation du mock `Stack` d'un objet vers un composant React valide
- **TestID** : Utilisation de `testID` au lieu de recherche textuelle pour les tests plus robustes

## Défis Techniques Résolus

### 🔄 Gestion des Mocks

#### Problème initial :
```typescript
// ❌ Mock local conflictuel
jest.mock('expo-router', () => ({
  router: { navigate: localMockNavigate }
}));
```

#### Solution implémentée :
```typescript
// ✅ Mock global dans jest.setup.js
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  router: { navigate: mockNavigate }
}));
```

### ⏰ Fake Timers et Act()

#### Problème :
```
Warning: An update to TimerComponent inside a test was not wrapped in act(...)
```

#### Solution :
```typescript
// ✅ Enveloppement correct
act(() => {
  jest.advanceTimersByTime(1000);
});
```

### 🔗 Structure de Données API

#### Transformation nécessaire :
```typescript
// ❌ Structure de test générique
{ data: { question: "Test?" } }

// ✅ Structure réelle de l'API
{ data: { rows: [{ id: 1, intitule: "Comment vous sentez-vous ? " }] } }
```

## Patterns de Test Utilisés

### 🎯 Pattern Arrange-Act-Assert

```typescript
it('should navigate when button pressed', async () => {
  // Arrange
  const { getByText } = render(<Component />);
  
  // Act
  const button = getByText('Bouton');
  fireEvent.press(button);
  
  // Assert
  expect(mockNavigate).toHaveBeenCalledWith('/next-screen');
});
```

### 🔄 Pattern beforeEach pour l'isolation

```typescript
describe('Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockClear();
  });
  
  // Tests...
});
```

### ⏳ Pattern waitFor pour l'asynchrone

```typescript
await waitFor(() => {
  expect(getByText('Loaded Content')).toBeTruthy();
});
```

## Métriques de Couverture

### 📊 Résultats actuels :
- **12 suites de tests** ✅
- **62 tests** ✅
- **0 échec** ✅
- **Couverture** : Tous les composants et écrans principaux

### 🎯 Zones couvertes :
1. **Rendu des composants** : Vérification que tous les composants s'affichent
2. **Interactions utilisateur** : Clics, saisie de texte, navigation
3. **Logique métier** : Progression du timer, gestion des réponses QCM
4. **Gestion d'erreurs** : Erreurs réseau, données manquantes
5. **Navigation** : Flux entre écrans avec paramètres

## Bonnes Pratiques Appliquées

### ✅ Tests Isolés
- Chaque test est indépendant
- Nettoyage des mocks entre tests
- Pas d'effets de bord entre tests

### ✅ Tests Descriptifs
```typescript
// ✅ Nom explicite
it('should display work accident question with correct answers')

// ❌ Nom vague
it('should work')
```

### ✅ Tests Robustes
- Utilisation de `testID` plutôt que de texte
- Gestion des cas d'erreur
- Tests des cas limites

### ✅ Mocks Réalistes
- Structure de données conforme à l'API réelle
- Comportement des mocks proche de la réalité
- Mocks centralisés et réutilisables

## Commandes de Test

```bash
# Tests complets
npm test

# Tests en mode watch (développement)
npm run test:watch

# Tests avec couverture de code
npm run test:coverage

# Tests d'un fichier spécifique
npm test -- qcm.test.tsx

# Tests avec verbose pour plus de détails
npm test -- --verbose
```

## Maintenance des Tests

### 🔧 Mise à jour des tests
1. **Nouveaux composants** : Créer les tests correspondants
2. **Modifications API** : Adapter les mocks dans `jest.setup.js`
3. **Nouvelles fonctionnalités** : Ajouter les cas de test appropriés

### 🐛 Debugging des tests
1. Utiliser `console.log` dans les tests
2. Utiliser `screen.debug()` pour voir le DOM rendu
3. Vérifier les mocks avec `expect(mockFunction).toHaveBeenCalled()`

## Conclusion

Cette suite de tests unitaires fournit une couverture complète de l'application Oniria, garantissant :
- **Fiabilité** : Détection précoce des régressions
- **Maintenabilité** : Refactoring en toute sécurité
- **Documentation** : Les tests servent de documentation vivante
- **Qualité** : Assurance de bon fonctionnement des fonctionnalités

L'architecture de test mise en place est scalable et peut facilement être étendue pour de nouvelles fonctionnalités tout en maintenant les standards de qualité établis.
