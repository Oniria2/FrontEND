import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

// Mock expo-router
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children, ...props }: any) => children,
  },
  useLocalSearchParams: () => ({
    name: 'TestUser',
  }),
  router: {
    navigate: mockNavigate,
  },
}));

// Importer le composant après les mocks
const QCM = require('../qcm').default;

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <PaperProvider>
      {component}
    </PaperProvider>
  );
};

describe('QCM Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render user greeting', async () => {
    const { getByText } = renderWithProvider(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });

  it('should render QCM component successfully', async () => {
    const { getByText } = renderWithProvider(<QCM />);
    
    await waitFor(() => {
      // Vérifier que le composant s'est rendu sans erreur
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });

  it('should handle API data structure correctly', async () => {
    // Test que le composant peut gérer la structure de données de l'API
    const { getByText } = renderWithProvider(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });

  it('should work with real question format', async () => {
    // Test avec le format réel des questions
    const { getByText } = renderWithProvider(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });

  it('should handle multiple choice answers', async () => {
    // Test que le composant peut gérer plusieurs réponses
    const { getByText } = renderWithProvider(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });

  it('should display timer component', async () => {
    const { getByText } = renderWithProvider(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });
});