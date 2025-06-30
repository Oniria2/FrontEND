# Guide de Contribution aux Tests - Oniria

## Introduction

Ce guide est destiné aux développeurs qui souhaitent contribuer aux tests de l'application Oniria. Il complète la documentation d'architecture en fournissant des instructions pratiques pour écrire et maintenir les tests.

## Avant de Commencer

### Prérequis
- Connaissance de base de Jest et React Native Testing Library
- Familiarité avec TypeScript/JavaScript
- Compréhension de l'architecture React Native/Expo

### Installation des Dépendances
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo
```

## Workflow de Développement avec Tests

### 1. Développement Piloté par les Tests (TDD)

```bash
# 1. Écrire le test (qui échoue)
npm test -- --watch MyComponent.test.tsx

# 2. Écrire le code minimal pour faire passer le test
# 3. Refactorer si nécessaire
# 4. Répéter
```

### 2. Développement avec Tests de Régression

```bash
# 1. Écrire le composant
# 2. Écrire les tests
# 3. Valider que tous les tests passent
npm test

# 4. Commit avec tests
git add .
git commit -m "feat: add MyComponent with tests"
```

## Templates de Tests

### 1. Composant Simple

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import MyComponent from '../MyComponent';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <PaperProvider>
      {component}
    </PaperProvider>
  );
};

describe('MyComponent', () => {
  const defaultProps = {
    title: 'Test Title',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      const { getByText } = renderWithProvider(
        <MyComponent {...defaultProps} />
      );
      
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('should render with custom props', () => {
      const customProps = { ...defaultProps, title: 'Custom Title' };
      const { getByText } = renderWithProvider(
        <MyComponent {...customProps} />
      );
      
      expect(getByText('Custom Title')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const { getByText } = renderWithProvider(
        <MyComponent {...defaultProps} />
      );
      
      fireEvent.press(getByText('Test Title'));
      
      expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const { getByTestId } = renderWithProvider(
        <MyComponent title={undefined} onPress={jest.fn()} />
      );
      
      expect(getByTestId('my-component')).toBeTruthy();
    });
  });
});
```

### 2. Écran avec API

```tsx
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import axios from 'axios';
import MyScreen from '../MyScreen';

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock des dépendances de navigation
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
  router: { navigate: mockNavigate },
}));

describe('MyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockClear();
  });

  describe('Data Loading', () => {
    it('should load data on mount', async () => {
      const mockData = {
        data: { rows: [{ id: 1, name: 'Test Item' }] }
      };
      mockedAxios.get.mockResolvedValueOnce(mockData);

      const { getByText } = render(<MyScreen />);

      await waitFor(() => {
        expect(getByText('Test Item')).toBeTruthy();
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/items')
      );
    });

    it('should handle loading state', () => {
      mockedAxios.get.mockImplementation(() => new Promise(() => {}));

      const { getByTestId } = render(<MyScreen />);

      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('should handle API errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      const { getByText } = render(<MyScreen />);

      await waitFor(() => {
        expect(getByText('Erreur de chargement')).toBeTruthy();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('User Interactions', () => {
    it('should handle item selection', async () => {
      const mockData = {
        data: { rows: [{ id: 1, name: 'Test Item' }] }
      };
      mockedAxios.get.mockResolvedValueOnce(mockData);

      const { getByText } = render(<MyScreen />);

      await waitFor(() => {
        expect(getByText('Test Item')).toBeTruthy();
      });

      fireEvent.press(getByText('Test Item'));

      expect(mockNavigate).toHaveBeenCalledWith('/details/1');
    });
  });
});
```

### 3. Hook Personnalisé

```tsx
import { renderHook, act } from '@testing-library/react-native';
import { useCustomHook } from '../hooks/useCustomHook';

describe('useCustomHook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCustomHook());

    expect(result.current.value).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('should update value correctly', () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.setValue('new value');
    });

    expect(result.current.value).toBe('new value');
  });

  it('should handle async operations', async () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.loadData();
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

## Helpers et Utilitaires Réutilisables

### 1. Créer un Fichier de Helpers

```tsx
// src/__tests__/helpers/testUtils.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

export const renderWithProviders = (
  component: React.ReactElement,
  options: { withNavigation?: boolean } = {}
) => {
  const { withNavigation = false } = options;

  let wrapper = <PaperProvider>{component}</PaperProvider>;

  if (withNavigation) {
    wrapper = (
      <NavigationContainer>
        {wrapper}
      </NavigationContainer>
    );
  }

  return render(wrapper);
};

export const createMockProps = (overrides = {}) => ({
  title: 'Default Title',
  onPress: jest.fn(),
  disabled: false,
  ...overrides,
});

export const waitForLoading = async (getByTestId: Function) => {
  await waitFor(() => {
    expect(() => getByTestId('loading-indicator')).toThrow();
  });
};
```

### 2. Utilisation des Helpers

```tsx
import { renderWithProviders, createMockProps } from '../helpers/testUtils';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const props = createMockProps({ title: 'Custom Title' });
    const { getByText } = renderWithProviders(<MyComponent {...props} />);
    
    expect(getByText('Custom Title')).toBeTruthy();
  });
});
```

## Stratégies de Mocking

### 1. Mock d'API avec Différents Scénarios

```tsx
// Mock avec données réalistes
const mockSuccessResponse = {
  data: {
    rows: [
      { id: 1, name: 'Item 1', active: true },
      { id: 2, name: 'Item 2', active: false },
    ]
  }
};

const mockErrorResponse = new Error('Network Error');

describe('API Tests', () => {
  it('should handle successful response', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockSuccessResponse);
    // Test logic
  });

  it('should handle error response', async () => {
    mockedAxios.get.mockRejectedValueOnce(mockErrorResponse);
    // Test logic
  });

  it('should handle empty response', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { rows: [] } });
    // Test logic
  });
});
```

### 2. Mock de Navigation Complexe

```tsx
// Mock avancé d'expo-router
const mockRouter = {
  navigate: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
};

const mockParams = {
  id: '1',
  name: 'Test User',
};

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  router: mockRouter,
  Stack: {
    Screen: ({ children, ...props }: any) => children,
  },
}));
```

### 3. Mock de Contexte

```tsx
// Mock d'un contexte personnalisé
const mockContextValue = {
  user: { id: 1, name: 'Test User' },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
};

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockContextValue,
  AuthProvider: ({ children }: any) => children,
}));
```

## Tests d'Intégration

### 1. Test de Flux Complet

```tsx
describe('Complete User Flow', () => {
  it('should complete quiz flow from start to finish', async () => {
    // Mock des données de questions
    mockedAxios.get
      .mockResolvedValueOnce({ data: { rows: [mockQuestion] } })
      .mockResolvedValueOnce({ data: { rows: mockAnswers } });

    const { getByText, getByTestId } = render(<QCMScreen />);

    // Étape 1: Chargement des données
    await waitFor(() => {
      expect(getByText(mockQuestion.intitule)).toBeTruthy();
    });

    // Étape 2: Sélection d'une réponse
    fireEvent.press(getByText('Correct Answer'));

    // Étape 3: Soumission
    fireEvent.press(getByTestId('submit-button'));

    // Étape 4: Navigation vers les résultats
    expect(mockNavigate).toHaveBeenCalledWith('/result');
  });
});
```

### 2. Test de Comportement Multi-Composants

```tsx
describe('Component Integration', () => {
  it('should pass data between parent and child components', () => {
    const onDataChange = jest.fn();
    
    const { getByTestId } = render(
      <ParentComponent onDataChange={onDataChange}>
        <ChildComponent />
      </ParentComponent>
    );

    fireEvent.changeText(getByTestId('child-input'), 'new value');

    expect(onDataChange).toHaveBeenCalledWith('new value');
  });
});
```

## Debugging des Tests

### 1. Techniques de Debug

```tsx
describe('Debug Example', () => {
  it('should debug test failure', async () => {
    const { debug, getByText } = render(<MyComponent />);

    // Afficher la structure DOM actuelle
    debug();

    // Afficher un élément spécifique
    debug(getByText('Specific Element'));

    // Vérifier les appels de mock
    console.log('Mock calls:', mockFunction.mock.calls);

    // Attendre avec log
    await waitFor(() => {
      console.log('Waiting for element...');
      expect(getByText('Expected Element')).toBeTruthy();
    });
  });
});
```

### 2. Gestion des Tests Instables

```tsx
describe('Stable Tests', () => {
  it('should handle timing issues', async () => {
    // ❌ Test instable
    // expect(getByText('Async Content')).toBeTruthy();

    // ✅ Test stable avec waitFor
    await waitFor(() => {
      expect(getByText('Async Content')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('should handle animation timing', async () => {
    fireEvent.press(getByTestId('animate-button'));

    // Attendre la fin de l'animation
    await waitFor(() => {
      expect(getByTestId('animated-element')).toHaveStyle({
        opacity: 1
      });
    }, { timeout: 2000 });
  });
});
```

## Performance des Tests

### 1. Optimisation des Tests

```tsx
// ✅ Grouper les tests similaires
describe('Component Rendering', () => {
  const commonProps = { title: 'Test', onPress: jest.fn() };

  it('should render with props A', () => {
    render(<Component {...commonProps} variant="A" />);
  });

  it('should render with props B', () => {
    render(<Component {...commonProps} variant="B" />);
  });
});

// ✅ Réutiliser les mocks
beforeAll(() => {
  // Setup coûteux une seule fois
});

beforeEach(() => {
  // Nettoyage léger
  jest.clearAllMocks();
});
```

### 2. Tests Parallèles

```bash
# Configuration dans package.json
{
  "scripts": {
    "test": "jest --maxWorkers=4",
    "test:ci": "jest --maxWorkers=2 --passWithNoTests"
  }
}
```

## Validation et CI/CD

### 1. Scripts de Validation

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:update": "jest --updateSnapshot"
  }
}
```

### 2. Configuration GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run test:ci
```

## Checklist de Contribution

### Avant de Soumettre des Tests

- [ ] Tous les tests passent localement
- [ ] Les tests couvrent les cas nominaux et d'erreur
- [ ] Les mocks sont appropriés et réalistes
- [ ] Le code de test est lisible et bien organisé
- [ ] Les helpers sont réutilisés quand c'est possible
- [ ] La documentation est mise à jour si nécessaire

### Revue de Code pour Tests

- [ ] Les tests testent le comportement, pas l'implémentation
- [ ] Les noms de test sont descriptifs
- [ ] Les données de test sont réalistes
- [ ] Les assertions sont précises
- [ ] Les tests sont indépendants
- [ ] Les mocks n'interfèrent pas entre les tests

## Ressources Complémentaires

### Documentation Officielle
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Outils Recommandés
- **VS Code Extension**: Jest Runner
- **Debug**: Node.js Debug Terminal
- **Coverage**: lcov viewer

Ce guide évoluera avec l'application. N'hésitez pas à proposer des améliorations !
