# Architecture et Philosophie des Tests Unitaires - Oniria

## Vue d'ensemble

Cette documentation détaille l'architecture, la philosophie et les bonnes pratiques adoptées pour les tests unitaires de l'application Oniria. Notre approche vise à garantir la fiabilité, la maintenabilité et la robustesse de l'application React Native/Expo.

## Philosophie des Tests

### 1. Test-Driven Development (TDD) Adapté
- **Tests fonctionnels** : Nous testons le comportement utilisateur plutôt que l'implémentation
- **Tests de régression** : Prévention des bugs lors des modifications futures
- **Couverture significative** : Focus sur les chemins critiques plutôt que la couverture à 100%

### 2. Approche Comportementale
```tsx
// ❌ Test d'implémentation (fragile)
it('should call useState with initial value', () => {
  // Test de l'implémentation interne
});

// ✅ Test comportemental (robuste)
it('should display welcome message when user logs in', () => {
  // Test du comportement visible par l'utilisateur
});
```

### 3. Isolation et Indépendance
- Chaque test est autonome et peut s'exécuter indépendamment
- Les mocks garantissent l'isolation des dépendances externes
- Nettoyage systématique entre les tests

## Architecture des Fichiers de Test

### 1. Structure Hiérarchique Miroir

```
src/
├── app/
│   ├── qcm.tsx
│   └── result.tsx
└── Component/
    ├── MyButton.tsx
    └── TimerComponent.tsx

src/__tests__/
├── app/
│   ├── qcm.test.tsx
│   └── result.test.tsx
└── Component/
    ├── MyButton.test.tsx
    └── TimerComponent.test.tsx
```

**Avantages :**
- Navigation intuitive entre code et tests
- Maintenance facilitée
- Cohérence organisationnelle

### 2. Convention de Nommage

```
[NomDuComposant].test.tsx
```

**Exemples :**
- `MyButton.tsx` → `MyButton.test.tsx`
- `qcm.tsx` → `qcm.test.tsx`
- `TimerComponent.tsx` → `TimerComponent.test.tsx`

## Anatomie d'un Fichier de Test

### 1. Structure Standard

```tsx
// 1. Imports obligatoires
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// 2. Import du composant testé
import MyComponent from '../path/to/MyComponent';

// 3. Mocks spécifiques (si nécessaire)
const mockFunction = jest.fn();

// 4. Suite de tests principale
describe('MyComponent', () => {
  // 5. Configuration avant chaque test
  beforeEach(() => {
    mockFunction.mockClear();
  });

  // 6. Tests individuels
  it('should render correctly', () => {
    // Test implementation
  });

  // 7. Nettoyage après chaque test (si nécessaire)
  afterEach(() => {
    // Cleanup logic
  });
});
```

### 2. Exemple Concret : MyButton.test.tsx

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import MyButton from '../../Component/MyButton';

// Helper de rendu avec contexte
const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <PaperProvider>
      {component}
    </PaperProvider>
  );
};

describe('MyButton Component', () => {
  const mockHandleRedirect = jest.fn();
  const buttonText = 'Test Button';

  beforeEach(() => {
    mockHandleRedirect.mockClear();
  });

  it('should render correctly with given props', () => {
    const { getByText } = renderWithProvider(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );
    
    expect(getByText(buttonText)).toBeTruthy();
  });

  it('should call handleRedirect when pressed', () => {
    const { getByText } = renderWithProvider(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );
    
    const button = getByText(buttonText);
    fireEvent.press(button);
    
    expect(mockHandleRedirect).toHaveBeenCalledTimes(1);
  });
});
```

## Stratégies de Test par Type de Composant

### 1. Composants Simples (MyButton, TimerComponent)

**Objectifs :**
- Rendu correct
- Interaction utilisateur
- Props handling

**Structure type :**
```tsx
describe('SimpleComponent', () => {
  it('should render with correct props', () => {});
  it('should handle user interaction', () => {});
  it('should display correct content', () => {});
});
```

### 2. Écrans Complexes (QCM, Result)

**Objectifs :**
- Appels API
- Navigation
- Gestion d'état
- Gestion d'erreurs

**Structure type :**
```tsx
describe('ComplexScreen', () => {
  describe('Data Loading', () => {
    it('should load data on mount', () => {});
    it('should handle loading states', () => {});
    it('should handle API errors', () => {});
  });

  describe('User Interactions', () => {
    it('should handle user selections', () => {});
    it('should navigate on completion', () => {});
  });

  describe('Edge Cases', () => {
    it('should handle empty data', () => {});
    it('should handle network errors', () => {});
  });
});
```

### 3. Layouts et Navigation (_layout.tsx)

**Objectifs :**
- Structure de navigation
- Contexte providers
- Configuration globale

## Gestion des Mocks

### 1. Mocks Globaux (jest.setup.js)

```javascript
// Configuration centralisée pour toute l'application
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({ name: 'TestUser' })),
  router: { navigate: jest.fn() },
  Stack: { Screen: ({ children }) => children }
}));
```

**Avantages :**
- Cohérence entre tous les tests
- Maintenance centralisée
- Évite la duplication

### 2. Mocks Locaux

```tsx
// Mock spécifique à un test
const mockSpecificFunction = jest.fn();
jest.mock('../api/service', () => ({
  specificFunction: mockSpecificFunction
}));
```

**Usage :**
- Comportements spécifiques à un test
- Override des mocks globaux
- Tests d'intégration ciblés

### 3. Mocks Axios et API

```javascript
// Structure SQL réaliste dans jest.setup.js
axios.get.mockImplementation((url) => {
  if (url.includes('/questions')) {
    return Promise.resolve({
      data: {
        rows: [
          { id: 1, intitule: 'Comment vous sentez-vous ?' },
          { id: 2, intitule: 'Que pensez-vous de votre travail ?' }
        ]
      }
    });
  }
  // ... autres endpoints
});
```

## Helpers et Utilitaires

### 1. Render Helpers

```tsx
// Helper pour PaperProvider
const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <PaperProvider>
      {component}
    </PaperProvider>
  );
};

// Helper pour Navigation + Paper
const renderWithNavigationAndPaper = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      <PaperProvider>
        {component}
      </PaperProvider>
    </NavigationContainer>
  );
};
```

### 2. Data Helpers

```tsx
// Données de test réutilisables
const mockQuestion = {
  id: 1,
  intitule: 'Test Question'
};

const mockAnswers = [
  { id: 1, titre: 'Answer 1', correct: '0', question_id: 1 },
  { id: 2, titre: 'Answer 2', correct: '1', question_id: 1 }
];
```

### 3. Assertion Helpers

```tsx
// Helpers pour les assertions communes
const expectElementToBeVisible = (getByTestId: Function, testId: string) => {
  expect(getByTestId(testId)).toBeTruthy();
};

const expectNavigationToBeCalled = (mockNavigate: jest.Mock, route: string) => {
  expect(mockNavigate).toHaveBeenCalledWith(route);
};
```

## Patterns de Test Avancés

### 1. Test des Hooks Personnalisés

```tsx
import { renderHook, act } from '@testing-library/react-native';

describe('useCustomHook', () => {
  it('should manage state correctly', () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.updateState('new value');
    });
    
    expect(result.current.state).toBe('new value');
  });
});
```

### 2. Test des Contextes

```tsx
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MyContext.Provider value={mockContextValue}>
    {children}
  </MyContext.Provider>
);

describe('Component with Context', () => {
  it('should use context value', () => {
    const { getByText } = render(
      <TestWrapper>
        <MyComponent />
      </TestWrapper>
    );
    
    expect(getByText('Context Value')).toBeTruthy();
  });
});
```

### 3. Test des Animations

```tsx
describe('Animated Component', () => {
  it('should handle animation completion', async () => {
    const { getByTestId } = render(<AnimatedComponent />);
    
    // Déclencher l'animation
    fireEvent.press(getByTestId('trigger-animation'));
    
    // Attendre la fin de l'animation
    await waitFor(() => {
      expect(getByTestId('animated-element')).toHaveStyle({
        opacity: 1
      });
    }, { timeout: 2000 });
  });
});
```

## Bonnes Pratiques

### 1. Nommage des Tests

```tsx
// ✅ Descriptif et comportemental
it('should display error message when API call fails', () => {});
it('should navigate to result screen when quiz is completed', () => {});
it('should disable submit button when no answer is selected', () => {});

// ❌ Technique et peu descriptif
it('should call setState', () => {});
it('should render component', () => {});
```

### 2. Organisation des Tests

```tsx
describe('QCM Screen', () => {
  // Groupement par fonctionnalité
  describe('Data Loading', () => {
    it('should load questions on mount', () => {});
    it('should handle loading errors', () => {});
  });

  describe('User Interactions', () => {
    it('should select answer when button pressed', () => {});
    it('should submit when all answers selected', () => {});
  });

  describe('Navigation', () => {
    it('should navigate to results on completion', () => {});
    it('should navigate back when back button pressed', () => {});
  });
});
```

### 3. Données de Test

```tsx
// ✅ Données réalistes et cohérentes
const mockUserData = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

// ✅ Utilisation de factories pour les données complexes
const createMockQuestion = (overrides = {}) => ({
  id: 1,
  intitule: 'Default question',
  ...overrides
});
```

### 4. Gestion des Erreurs

```tsx
it('should handle API errors gracefully', async () => {
  // Mock d'erreur API
  mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

  const { getByText } = render(<QCM />);

  await waitFor(() => {
    expect(getByText('Erreur de connexion')).toBeTruthy();
  });
});
```

## Maintenance et Évolution

### 1. Refactoring des Tests

- **Principe DRY** : Factoriser les helpers communs
- **Évolution des mocks** : Adapter aux changements d'API
- **Nettoyage régulier** : Supprimer les tests obsolètes

### 2. Ajout de Nouveaux Tests

```tsx
// Template pour nouveau composant
describe('NewComponent', () => {
  // Setup
  beforeEach(() => {
    // Configuration
  });

  // Tests de base
  it('should render correctly', () => {});

  // Tests d'interaction
  it('should handle user interaction', () => {});

  // Tests d'edge cases
  it('should handle edge cases', () => {});
});
```

### 3. Monitoring de la Qualité

```bash
# Couverture de code
npm run test:coverage

# Tests en mode watch pendant le développement
npm run test:watch

# Validation avant commit
npm test
```

## Dépannage

### 1. Erreurs Communes

**Mock non défini :**
```tsx
// ❌ Mock oublié
const { getByText } = render(<ComponentWithNavigation />);

// ✅ Mock ajouté
jest.mock('expo-router', () => ({
  router: { navigate: jest.fn() }
}));
```

**Composant non wrappé :**
```tsx
// ❌ PaperProvider manquant
render(<ComponentWithPaper />);

// ✅ Avec provider
render(
  <PaperProvider>
    <ComponentWithPaper />
  </PaperProvider>
);
```

### 2. Debug des Tests

```tsx
// Afficher l'état du DOM
import { screen } from '@testing-library/react-native';
screen.debug(); // Affiche la structure actuelle

// Vérifier les appels de mock
console.log(mockFunction.mock.calls);

// Attendre avec timeout personnalisé
await waitFor(() => {
  expect(element).toBeTruthy();
}, { timeout: 5000 });
```

## Conclusion

Cette architecture de tests vise à :
- **Fiabilité** : Tests robustes et prévisibles
- **Maintenabilité** : Code de test facile à maintenir
- **Lisibilité** : Tests compréhensibles par toute l'équipe
- **Efficacité** : Détection rapide des régressions

L'investissement dans une architecture de tests solide garantit la qualité à long terme de l'application Oniria.
