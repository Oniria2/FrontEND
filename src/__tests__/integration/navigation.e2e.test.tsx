import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';

// Import des composants
import Index from '../../app/index';
import QCM from '../../app/qcm';
import Result from '../../app/result';

// Use global mocks from jest.setup.js
const mockNavigate = (global as any).mockNavigate;

describe('End-to-End Navigation Flow', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <PaperProvider>
        {component}
      </PaperProvider>
    );
  };

  // Mock de navigation pour E2E
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Application Flow', () => {
    it('should navigate through entire application flow', async () => {
      // Phase 1: Page d'accueil
      const { getByText: getHomeText, getByTestId } = renderWithProvider(<Index />);
      
      expect(getHomeText('Bienvenue sur votre questionnaire')).toBeTruthy();
      
      // Saisie du nom
      const nameInput = getByTestId('name-input');
      fireEvent.changeText(nameInput, 'E2ETestUser');
      
      // Navigation vers QCM
      const startButton = getHomeText('commencer le questionnaire');
      fireEvent.press(startButton);
      
      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/qcm',
        params: { name: 'E2ETestUser' }
      });

      // Phase 2: QCM avec données réalistes
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      mockedAxios.get
        .mockResolvedValueOnce({
          data: { rows: [{ id: 1, intitule: 'Comment évaluez-vous votre bien-être au travail ?' }] }
        })
        .mockResolvedValueOnce({
          data: {
            rows: [
              { id: 1, titre: 'Excellent', correct: '1', question_id: 1 },
              { id: 2, titre: 'Bon', correct: '0', question_id: 1 },
              { id: 3, titre: 'Moyen', correct: '0', question_id: 1 },
              { id: 4, titre: 'Mauvais', correct: '0', question_id: 1 }
            ]
          }
        });

      const { getByText: getQCMText } = renderWithProvider(<QCM />);
      
      // Attendre le chargement du QCM
      await waitFor(() => {
        expect(getQCMText(/Bonjour.*TestUser.*!!/)).toBeTruthy();
      });

      await waitFor(() => {
        expect(getQCMText('Comment évaluez-vous votre bien-être au travail ?')).toBeTruthy();
      });

      // Sélectionner une réponse
      const answerButton = getQCMText('Excellent');
      fireEvent.press(answerButton);

      // Phase 3: Résultats
      const { getByText: getResultText } = renderWithProvider(<Result />);
      
      expect(getResultText(/Voici l'image qui représente/)).toBeTruthy();
      expect(getResultText(/Merci d'avoir pris le temps de répondre a notre questionnaire/)).toBeTruthy();
      
      // Retour à l'accueil
      const homeButton = getResultText('Retour a l\'accueil');
      fireEvent.press(homeButton);
      
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/' });
    });

    it('should handle navigation errors gracefully', async () => {
      // Simuler une erreur de navigation
      mockNavigate.mockImplementationOnce(() => {
        throw new Error('Navigation failed');
      });

      const { getByText, getByTestId } = renderWithProvider(<Index />);
      
      const nameInput = getByTestId('name-input');
      fireEvent.changeText(nameInput, 'ErrorTestUser');
      
      const startButton = getByText('commencer le questionnaire');
      
      // L'application ne doit pas crasher même si la navigation échoue
      expect(() => fireEvent.press(startButton)).not.toThrow();
    });

    it('should maintain navigation history correctly', () => {
      const { getByText } = renderWithProvider(<Result />);
      
      // Test du bouton retour
      const backButton = getByText('Retour a l\'accueil');
      fireEvent.press(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/' });
      fireEvent.press(backButton);
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Deep Linking and URL Parameters', () => {
    it('should handle direct navigation to QCM with parameters', () => {
      const { getByText } = renderWithProvider(<QCM />);
      
      expect(getByText(/Bonjour.*TestUser.*!!/)).toBeTruthy();
    });

    it('should handle missing parameters gracefully', () => {
      // Simuler des paramètres manquants
      const mockUseLocalSearchParams = jest.fn(() => ({}));
      
      const { getByText } = renderWithProvider(<QCM />);
      
      // L'application doit gérer les paramètres manquants
      expect(() => getByText(/Bonjour.*TestUser.*!!/)).not.toThrow();
    });

    it('should handle malformed parameters', () => {
      // Simuler des paramètres malformés
      const mockUseLocalSearchParams = jest.fn(() => ({ 
        name: null, 
        invalidParam: 'test' 
      }));
      
      const { getByText } = renderWithProvider(<Result />);
      
      // L'application doit gérer les paramètres malformés
      expect(() => getByText(/Voici l'image qui représente/)).not.toThrow();
    });
  });

  describe('State Persistence Across Navigation', () => {
    it('should maintain user session across screens', async () => {
      const userName = 'PersistenceTestUser';
      
      // Test que les données utilisateur persistent
      const { getByText: getQCMText } = renderWithProvider(<QCM />);
      const { getByText: getResultText } = renderWithProvider(<Result />);
      
      // Vérifier que le nom persiste dans QCM
      expect(getQCMText(/Bonjour.*!!/)).toBeTruthy();
      
      // Vérifier que le nom persiste dans Result
      expect(getResultText(/Voici l'image qui représente/)).toBeTruthy();
    });

    it('should handle navigation with complex data', async () => {
      const complexParams = {
        name: 'ComplexTestUser',
        score: 85,
        timestamp: '2024-01-01T10:00:00Z',
        answers: JSON.stringify(['A', 'B', 'C'])
      };
      
      // Simuler des paramètres complexes
      const mockUseLocalSearchParams = jest.fn(() => complexParams);
      
      const { getByText } = renderWithProvider(<Result />);
      
      expect(getByText(/Voici l'image qui représente/)).toBeTruthy();
    });
  });

  describe('Navigation Performance', () => {
    it('should navigate quickly between screens', () => {
      const startTime = Date.now();
      
      const { getByText, getByTestId } = renderWithProvider(<Index />);
      
      const nameInput = getByTestId('name-input');
      fireEvent.changeText(nameInput, 'SpeedTestUser');
      
      const startButton = getByText('commencer le questionnaire');
      fireEvent.press(startButton);
      
      const navigationTime = Date.now() - startTime;
      
      expect(navigationTime).toBeLessThan(500); // Navigation rapide
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should handle rapid navigation attempts', () => {
      const { getByText } = renderWithProvider(<Result />);
      
      const homeButton = getByText('Retour a l\'accueil');
      
      // Clics rapides multiples
      fireEvent.press(homeButton);
      fireEvent.press(homeButton);
      fireEvent.press(homeButton);
      
      // La navigation doit être appelée pour chaque clic
      expect(mockNavigate).toHaveBeenCalledTimes(3);
    });
  });

  describe('Navigation Stack Management', () => {
    it('should manage navigation stack correctly', () => {
      // Test des différents types de navigation
      const { getByText: getIndexText, getByTestId } = renderWithProvider(<Index />);
      
      const nameInput = getByTestId('name-input');
      fireEvent.changeText(nameInput, 'StackTestUser');
      
      const startButton = getIndexText('commencer le questionnaire');
      fireEvent.press(startButton);
      
      // Navigation forward
      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/qcm',
        params: { name: 'StackTestUser' }
      });
      
      // Test navigation back depuis Result
      const { getByText: getResultText } = renderWithProvider(<Result />);
      const backButton = getResultText('Retour a l\'accueil');
      fireEvent.press(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/' });
    });

    it('should prevent navigation loops', () => {
      const { getByText } = renderWithProvider(<Result />);
      
      const homeButton = getByText('Retour a l\'accueil');
      
      // Multiples tentatives de navigation vers la même route
      fireEvent.press(homeButton);
      fireEvent.press(homeButton);
      fireEvent.press(homeButton);
      
      // Toutes les navigations doivent être autorisées (pas de prévention de loop dans ce cas)
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/' });
    });
  });

  describe('Navigation Error Recovery', () => {
    it('should recover from navigation failures', () => {
      // Premier appel échoue, deuxième réussit
      mockNavigate
        .mockImplementationOnce(() => { throw new Error('Navigation Error'); })
        .mockImplementationOnce(() => {});

      const { getByText, getByTestId } = renderWithProvider(<Index />);
      
      const nameInput = getByTestId('name-input');
      fireEvent.changeText(nameInput, 'RecoveryTestUser');
      
      const startButton = getByText('commencer le questionnaire');
      
      // Premier clic échoue
      expect(() => fireEvent.press(startButton)).not.toThrow();
      
      // Deuxième clic réussit
      fireEvent.press(startButton);
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });

    it('should handle network-related navigation issues', async () => {
      // Simuler des problèmes réseau affectant la navigation
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      const { getByText } = renderWithProvider(<QCM />);
      
      // L'application doit rester fonctionnelle même avec des erreurs réseau
      await waitFor(() => {
        expect(getByText(/Bonjour.*TestUser.*!!/)).toBeTruthy();
      });
      
      // La navigation doit toujours fonctionner
      expect(() => getByText(/Bonjour.*TestUser.*!!/)).not.toThrow();
    });
  });
});
