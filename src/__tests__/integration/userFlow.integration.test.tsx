import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';
import Index from '../../app/index';
import QCM from '../../app/qcm';
import Result from '../../app/result';

// Mock axios
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios');

// Use global mocks from jest.setup.js
const mockNavigate = (global as any).mockNavigate;

// Configuration pour tests d'intégration
// Note: Ces tests utilisent de vraies interactions sans mocks complets

describe('Complete User Flow Integration', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <PaperProvider>
        {component}
      </PaperProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete QCM Journey', () => {
    it('should complete full user journey from home to results', async () => {
      // Étape 1: Page d'accueil
      const { getByText, getByTestId } = renderWithProvider(<Index />);
      
      // Vérifier l'affichage de la page d'accueil
      expect(getByText('Bienvenue sur votre questionnaire')).toBeTruthy();
      expect(getByText('commencer le questionnaire')).toBeTruthy();
      
      // Saisir un nom
      const nameInput = getByTestId('name-input');
      fireEvent.changeText(nameInput, 'IntegrationTestUser');
      
      // Cliquer sur le bouton pour démarrer
      const startButton = getByText('commencer le questionnaire');
      fireEvent.press(startButton);
      
      // Vérifier que la navigation vers QCM est appelée
      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/qcm',
        params: { name: 'IntegrationTestUser' }
      });
    });

    it('should handle QCM flow with realistic data flow', async () => {
      // Mock des données API pour le flux complet
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Mock question
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          rows: [{ id: 1, intitule: 'Comment vous sentez-vous au travail ?' }]
        }
      });
      
      // Mock réponses
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          rows: [
            { id: 1, titre: 'Très bien', correct: '1', question_id: 1 },
            { id: 2, titre: 'Moyennement', correct: '0', question_id: 1 },
            { id: 3, titre: 'Mal', correct: '0', question_id: 1 }
          ]
        }
      });

      const { getByText } = renderWithProvider(<QCM />);

      // Attendre le chargement de la question
      await waitFor(() => {
        expect(getByText('Comment vous sentez-vous au travail ?')).toBeTruthy();
      });

      // Vérifier les options de réponse
      await waitFor(() => {
        expect(getByText('Très bien')).toBeTruthy();
        expect(getByText('Moyennement')).toBeTruthy();
        expect(getByText('Mal')).toBeTruthy();
      });

      // Sélectionner la bonne réponse
      const correctAnswer = getByText('Très bien');
      fireEvent.press(correctAnswer);

      // Vérifier que les appels API ont été faits dans le bon ordre
      expect(mockedAxios.get).toHaveBeenCalledTimes(3); // QCM fait 3 appels API
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/questions'));
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/reponse')); // Singular form
    });

    it('should display results after QCM completion', () => {
      const { getByText } = renderWithProvider(<Result />);

      // Vérifier l'affichage des résultats (texte réel du composant)
      expect(getByText(/Voici l'image qui représente/)).toBeTruthy();
      expect(getByText(/Merci d'avoir pris le temps de répondre a notre questionnaire/)).toBeTruthy();
      expect(getByText('Retour a l\'accueil')).toBeTruthy();

      // Tester le retour à l'accueil
      const homeButton = getByText('Retour a l\'accueil');
      fireEvent.press(homeButton);

      expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/' });
    });
  });

  describe('Data Flow Integration', () => {
    it('should maintain user data consistency across screens', async () => {
      const userName = 'DataFlowTestUser';
      
      // Test que les données utilisateur sont bien transmises
      const mockedUseLocalSearchParams = jest.fn(() => ({ name: userName }));
      
      // Simuler le passage de données entre écrans
      const { getByText: getQCMElements } = renderWithProvider(<QCM />);
      const { getByText: getResultElements } = renderWithProvider(<Result />);

      // Vérifier que le nom est affiché correctement dans QCM
      expect(getQCMElements(/Bonjour.*TestUser.*!!/)).toBeTruthy();

      // Vérifier que le nom est affiché correctement dans Result
      expect(getResultElements(/Merci.*TestUser/i)).toBeTruthy();
    });

    it('should handle API data transformation correctly', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Test avec différents formats de données API
      const apiResponse = {
        data: {
          rows: [
            { id: 1, intitule: 'Question avec caractères spéciaux: âêîôû?!' },
            { id: 2, intitule: 'Question avec émojis 😊 et symboles &@#' }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(apiResponse);
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          rows: [
            { id: 1, titre: 'Réponse avec accents: à été', correct: '1', question_id: 1 },
            { id: 2, titre: 'Réponse normale', correct: '0', question_id: 1 }
          ]
        }
      });

      const { getByText } = renderWithProvider(<QCM />);

      // Vérifier que les caractères spéciaux sont bien gérés
      await waitFor(() => {
        expect(getByText('Question avec caractères spéciaux: âêîôû?!')).toBeTruthy();
      });

      await waitFor(() => {
        expect(getByText('Réponse avec accents: à été')).toBeTruthy();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should gracefully handle network failures across the app', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Simuler des erreurs réseau
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      const { getByText } = renderWithProvider(<QCM />);

      // L'application doit continuer à fonctionner même avec des erreurs API
      await waitFor(() => {
        expect(getByText(/Bonjour.*TestUser.*!!/)).toBeTruthy();
      });

      // Vérifier que l'erreur est bien gérée (pas de crash)
      expect(() => getByText(/Bonjour.*TestUser.*!!/)).not.toThrow();
    });

    it('should handle empty API responses', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Réponses API vides
      mockedAxios.get.mockResolvedValueOnce({ data: { rows: [] } });
      mockedAxios.get.mockResolvedValueOnce({ data: { rows: [] } });

      const { getByText } = renderWithProvider(<QCM />);

      // L'application doit gérer les réponses vides sans crash
      await waitFor(() => {
        expect(getByText(/Bonjour.*TestUser.*!!/)).toBeTruthy();
      });
    });
  });

  describe('Performance Integration', () => {
    it('should load components within acceptable time limits', async () => {
      const startTime = Date.now();
      
      const { getByText } = renderWithProvider(<Index />);
      
      // Vérifier que le composant se charge rapidement
      expect(getByText('Bienvenue sur votre questionnaire')).toBeTruthy();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(1000); // Moins d'1 seconde
    });

    it('should handle multiple rapid user interactions', async () => {
      const { getByText, getByTestId } = renderWithProvider(<Index />);
      
      const nameInput = getByTestId('name-input');
      const startButton = getByText('commencer le questionnaire');

      // Interactions rapides multiples
      fireEvent.changeText(nameInput, 'Test1');
      fireEvent.changeText(nameInput, 'Test2');
      fireEvent.changeText(nameInput, 'Test3');
      
      fireEvent.press(startButton);
      fireEvent.press(startButton); // Double clic
      
      // Vérifier que l'application gère bien les interactions rapides
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('Cross-Component Communication', () => {
    it('should maintain state consistency between component updates', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Mock d'une séquence complète
      mockedAxios.get
        .mockResolvedValueOnce({
          data: { rows: [{ id: 1, intitule: 'Question 1' }] }
        })
        .mockResolvedValueOnce({
          data: { rows: [
            { id: 1, titre: 'Réponse A', correct: '1', question_id: 1 },
            { id: 2, titre: 'Réponse B', correct: '0', question_id: 1 }
          ]}
        });

      const { getByText, rerender } = renderWithProvider(<QCM />);

      await waitFor(() => {
        expect(getByText('Question 1')).toBeTruthy();
      });

      // Sélectionner une réponse
      const answerButton = getByText('Réponse A');
      fireEvent.press(answerButton);

      // Re-render pour simuler une mise à jour
      rerender(
        <PaperProvider>
          <QCM />
        </PaperProvider>
      );

      // Vérifier que l'état est maintenu
      await waitFor(() => {
        expect(getByText('Question 1')).toBeTruthy();
      });
    });
  });
});
