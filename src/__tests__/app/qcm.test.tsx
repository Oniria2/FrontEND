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
        rows: [{ id: 1, intitule: 'Comment vous sentez-vous ? ' }]
      }
    });

    // Mock de la réponse API pour les réponses
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { id: 1, titre: 'AssezBien', correct: '0', question_id: 1 },
          { id: 2, titre: 'Bien', correct: '1', question_id: 1 },
          { id: 3, titre: 'Mal', correct: '0', question_id: 1 }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Bonjour TestUser!!')).toBeTruthy();
    });
  });

  it('should load and display question from API', async () => {
    const testQuestion = 'Comment vous sentez-vous ? ';
    
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [{ id: 1, intitule: testQuestion }]
      }
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { id: 1, titre: 'AssezBien', correct: '0', question_id: 1 },
          { id: 2, titre: 'Bien', correct: '1', question_id: 1 },
          { id: 3, titre: 'Mal', correct: '0', question_id: 1 }
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
        rows: [{ id: 2, intitule: 'Que pensez-vous de votre environnement de travail ? ' }]
      }
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { id: 4, titre: 'Peut être améliorer', correct: '0', question_id: 2 },
          { id: 5, titre: 'Ne convient pas', correct: '0', question_id: 2 },
          { id: 6, titre: 'Est idéal', correct: '1', question_id: 2 }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Peut être améliorer')).toBeTruthy();
      expect(getByText('Ne convient pas')).toBeTruthy();
      expect(getByText('Est idéal')).toBeTruthy();
    });
  });

  it('should handle correct answer selection', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [{ id: 1, intitule: 'Comment vous sentez-vous ? ' }]
      }
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { id: 1, titre: 'AssezBien', correct: '0', question_id: 1 },
          { id: 2, titre: 'Bien', correct: '1', question_id: 1 },
          { id: 3, titre: 'Mal', correct: '0', question_id: 1 }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      const correctButton = getByText('Bien');
      expect(correctButton).toBeTruthy();
    });
  });

  it('should display work accident question', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [{ id: 3, intitule: 'Avez-vous eu un accident de travail ?' }]
      }
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { id: 7, titre: 'moins de 3 mois', correct: '0', question_id: 3 },
          { id: 8, titre: 'plus de 3 mois', correct: '0', question_id: 3 },
          { id: 9, titre: 'Non', correct: '1', question_id: 3 }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Avez-vous eu un accident de travail ?')).toBeTruthy();
      expect(getByText('moins de 3 mois')).toBeTruthy();
      expect(getByText('plus de 3 mois')).toBeTruthy();
      expect(getByText('Non')).toBeTruthy();
    });
  });

  it('should display recommendation question', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [{ id: 4, intitule: 'Recommanderiez-vous les postes à pourvoir à vos connaissances ? ' }]
      }
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rows: [
          { id: 10, titre: 'Oui', correct: '1', question_id: 4 },
          { id: 11, titre: 'Non', correct: '0', question_id: 4 },
          { id: 12, titre: 'Possiblement', correct: '0', question_id: 4 }
        ]
      }
    });

    const { getByText } = render(<QCM />);
    
    await waitFor(() => {
      expect(getByText('Recommanderiez-vous les postes à pourvoir à vos connaissances ? ')).toBeTruthy();
      expect(getByText('Oui')).toBeTruthy();
      expect(getByText('Non')).toBeTruthy();
      expect(getByText('Possiblement')).toBeTruthy();
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
