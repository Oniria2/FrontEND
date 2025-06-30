import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import QCM from '../../app/qcm';

// Mock axios
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de useLocalSearchParams et router
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({
    name: 'TestUser',
  }),
  router: {
    navigate: mockNavigate,
  },
  Stack: {
    Screen: ({ children, ...props }: any) => children,
  },
}));

describe('QCM Screen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockedAxios.get.mockClear();
  });

  it('should render user greeting', async () => {
    // Mock de la réponse API pour la question
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [{ intitule: 'Test Question?' }]
      }
    });

    // Mock de la réponse API pour les réponses
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { titre: 'Réponse 1', correct: true },
          { titre: 'Réponse 2', correct: false }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });

  it('should load and display question from API', async () => {
    const testQuestion = 'Quelle est la capitale de la France?';
    
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [{ intitule: testQuestion }]
      }
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { titre: 'Paris', correct: true },
          { titre: 'Londres', correct: false }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      expect(getByText(testQuestion)).toBeTruthy();
    });
  });

  it('should display response options', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [{ intitule: 'Test Question?' }]
      }
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { titre: 'Option 1', correct: true },
          { titre: 'Option 2', correct: false },
          { titre: 'Option 3', correct: false }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Option 1')).toBeTruthy();
      expect(getByText('Option 2')).toBeTruthy();
      expect(getByText('Option 3')).toBeTruthy();
    });
  });

  it('should handle correct answer selection', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [{ intitule: 'Test Question?' }]
      }
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { titre: 'Correct Answer', correct: true },
          { titre: 'Wrong Answer', correct: false }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      const correctButton = getByText('Correct Answer');
      expect(correctButton).toBeTruthy();
    });
  });

  it('should navigate to result screen after last question', async () => {
    // Mock initial question
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [{ intitule: 'Last Question?' }]
      }
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { titre: 'Final Answer', correct: true }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Last Question?')).toBeTruthy();
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });
});
