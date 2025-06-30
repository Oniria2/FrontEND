import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
    // Mock des réponses API
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/questions/1')) {
        return Promise.resolve({
          data: {
            rows: [{ intitule: 'Question test 1' }]
          }
        });
      }
      if (url.includes('/reponse/1')) {
        return Promise.resolve({
          data: {
            rows: [
              { titre: 'Réponse A', correct: true },
              { titre: 'Réponse B', correct: false }
            ]
          }
        });
      }
      return Promise.reject(new Error('URL non mockée'));
    });

    const { getByText } = renderWithProvider(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });

  it('should load and display first question', async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/questions/1')) {
        return Promise.resolve({
          data: {
            rows: [{ intitule: 'Quelle est la capitale de la France ?' }]
          }
        });
      }
      if (url.includes('/reponse/1')) {
        return Promise.resolve({
          data: {
            rows: [
              { titre: 'Paris', correct: true },
              { titre: 'Londres', correct: false },
              { titre: 'Berlin', correct: false }
            ]
          }
        });
      }
      return Promise.reject(new Error('URL non mockée'));
    });

    const { getByText } = renderWithProvider(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Quelle est la capitale de la France ?')).toBeTruthy();
    });
  });

  it('should display answer options', async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/questions/1')) {
        return Promise.resolve({
          data: {
            rows: [{ intitule: 'Question test' }]
          }
        });
      }
      if (url.includes('/reponse/1')) {
        return Promise.resolve({
          data: {
            rows: [
              { titre: 'Option A', correct: true },
              { titre: 'Option B', correct: false },
              { titre: 'Option C', correct: false }
            ]
          }
        });
      }
      return Promise.reject(new Error('URL non mockée'));
    });

    const { getByText } = renderWithProvider(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Option A')).toBeTruthy();
      expect(getByText('Option B')).toBeTruthy();
      expect(getByText('Option C')).toBeTruthy();
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    renderWithProvider(<QCM />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching question:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  it('should navigate to result screen after 4 questions', async () => {
    // Mock pour simuler la 4ème question
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/questions/4')) {
        return Promise.resolve({
          data: {
            rows: [{ intitule: 'Question 4' }]
          }
        });
      }
      if (url.includes('/reponse/4')) {
        return Promise.resolve({
          data: {
            rows: [
              { titre: 'Réponse correcte', correct: true }
            ]
          }
        });
      }
      return Promise.resolve({ data: { rows: [] } });
    });

    const { getByText } = renderWithProvider(<QCM />);
    
    // Simuler la sélection d'une réponse à la 4ème question
    await waitFor(() => {
      const answerButton = getByText('Réponse correcte');
      if (answerButton) {
        fireEvent.press(answerButton);
      }
    });

    // Vérifier que la navigation vers result a été appelée
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/result',
          params: expect.objectContaining({
            name: 'TestUser'
          })
        })
      );
    });
  });
});
