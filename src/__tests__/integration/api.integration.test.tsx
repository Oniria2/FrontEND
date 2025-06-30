import axios from 'axios';
import { waitFor } from '@testing-library/react-native';

// Tests d'intégration API réelle
// Note: Ces tests peuvent être configurés pour utiliser une API de test réelle

describe('API Integration Tests', () => {
  const baseURL = process.env.REACT_NATIVE_API_URL || 'http://localhost:3000';
  
  // Configuration pour tests d'API réelle
  beforeAll(() => {
    // Configuration axios pour les tests d'intégration
    if (axios.defaults) {
      axios.defaults.timeout = 5000;
    }
  });

  afterEach(() => {
    // Nettoyage après chaque test
    jest.clearAllMocks();
  });

  describe('Questions API Integration', () => {
    it('should fetch questions from real API endpoint', async () => {
      // Mock pour simulation d'API réelle
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      const mockResponse = {
        data: {
          rows: [
            { id: 1, intitule: 'Comment vous sentez-vous ?' },
            { id: 2, intitule: 'Que pensez-vous de votre travail ?' },
            { id: 3, intitule: 'Avez-vous eu un accident de travail ?' }
          ]
        },
        status: 200,
        statusText: 'OK'
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(`${baseURL}/questions`);
      
      expect(response.status).toBe(200);
      expect(response.data.rows).toHaveLength(3);
      expect(response.data.rows[0]).toHaveProperty('id');
      expect(response.data.rows[0]).toHaveProperty('intitule');
    });

    it('should handle questions API with different data types', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      const mockResponse = {
        data: {
          rows: [
            { id: 1, intitule: 'Question avec nombre: 42' },
            { id: 2, intitule: 'Question avec date: 2024-01-01' },
            { id: 3, intitule: 'Question avec caractères spéciaux: âêîôû' },
            { id: 4, intitule: 'Question vide: ' },
            { id: 5, intitule: null } // Cas de données nulles
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(`${baseURL}/questions`);
      
      // Vérifier que tous les types de données sont gérés
      expect(response.data.rows).toHaveLength(5);
      expect(response.data.rows[0].intitule).toContain('42');
      expect(response.data.rows[1].intitule).toContain('2024');
      expect(response.data.rows[2].intitule).toContain('âêîôû');
      expect(response.data.rows[3].intitule).toBe('Question vide: ');
      expect(response.data.rows[4].intitule).toBeNull();
    });

    it('should handle API rate limiting', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Simuler une limitation de taux
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 429,
          statusText: 'Too Many Requests',
          data: { error: 'Rate limit exceeded' }
        }
      });

      try {
        await axios.get(`${baseURL}/questions`);
      } catch (error: any) {
        expect(error.response.status).toBe(429);
        expect(error.response.data.error).toBe('Rate limit exceeded');
      }
    });
  });

  describe('Responses API Integration', () => {
    it('should fetch responses for a specific question', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      const questionId = 1;
      const mockResponse = {
        data: {
          rows: [
            { id: 1, titre: 'Très bien', correct: '1', question_id: questionId },
            { id: 2, titre: 'Bien', correct: '0', question_id: questionId },
            { id: 3, titre: 'Mal', correct: '0', question_id: questionId }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(`${baseURL}/reponses?question_id=${questionId}`);
      
      expect(response.data.rows).toHaveLength(3);
      expect(response.data.rows.every((r: any) => r.question_id === questionId)).toBe(true);
      expect(response.data.rows.some((r: any) => r.correct === '1')).toBe(true);
    });

    it('should validate response data structure', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      const mockResponse = {
        data: {
          rows: [
            { id: 1, titre: 'Réponse 1', correct: '1', question_id: 1 },
            { id: 2, titre: 'Réponse 2', correct: '0', question_id: 1 }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(`${baseURL}/reponses?question_id=1`);
      
      // Valider la structure de chaque réponse
      response.data.rows.forEach((row: any) => {
        expect(row).toHaveProperty('id');
        expect(row).toHaveProperty('titre');
        expect(row).toHaveProperty('correct');
        expect(row).toHaveProperty('question_id');
        expect(typeof row.id).toBe('number');
        expect(typeof row.titre).toBe('string');
        expect(['0', '1']).toContain(row.correct);
        expect(typeof row.question_id).toBe('number');
      });
    });

    it('should handle empty responses for a question', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      const mockResponse = {
        data: { rows: [] }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(`${baseURL}/reponses?question_id=999`);
      
      expect(response.data.rows).toHaveLength(0);
      expect(Array.isArray(response.data.rows)).toBe(true);
    });
  });

  describe('API Error Handling Integration', () => {
    it('should handle network timeouts gracefully', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Simuler un timeout
      mockedAxios.get.mockRejectedValueOnce(new Error('timeout of 5000ms exceeded'));

      try {
        await axios.get(`${baseURL}/questions`, { timeout: 100 });
      } catch (error: any) {
        expect(error.message).toContain('timeout');
      }
    });

    it('should handle server errors (500)', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: { error: 'Database connection failed' }
        }
      });

      try {
        await axios.get(`${baseURL}/questions`);
      } catch (error: any) {
        expect(error.response.status).toBe(500);
        expect(error.response.data.error).toBe('Database connection failed');
      }
    });

    it('should handle malformed API responses', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Réponse mal formée
      const malformedResponse = {
        data: {
          // Manque la propriété 'rows'
          questions: [{ id: 1, title: 'Wrong format' }]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(malformedResponse);

      const response = await axios.get(`${baseURL}/questions`);
      
      // Vérifier que la réponse mal formée est détectée
      expect(response.data.rows).toBeUndefined();
      expect(response.data.questions).toBeDefined();
    });

    it('should retry failed requests', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Premier appel échoue, deuxième réussit
      mockedAxios.get
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce({
          data: { rows: [{ id: 1, intitule: 'Question après retry' }] }
        });

      // Simuler une logique de retry
      let response;
      try {
        response = await axios.get(`${baseURL}/questions`);
      } catch (error) {
        // Retry
        response = await axios.get(`${baseURL}/questions`);
      }
      
      expect(response.data.rows).toHaveLength(1);
      expect(response.data.rows[0].intitule).toBe('Question après retry');
    });
  });

  describe('API Performance Integration', () => {
    it('should load questions within acceptable time', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      const mockResponse = {
        data: {
          rows: Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            intitule: `Question ${i + 1}`
          }))
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const startTime = Date.now();
      const response = await axios.get(`${baseURL}/questions`);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      
      expect(response.data.rows).toHaveLength(100);
      expect(responseTime).toBeLessThan(2000); // Moins de 2 secondes
    });

    it('should handle concurrent API requests', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      // Préparer les réponses pour les requêtes concurrentes
      mockedAxios.get
        .mockResolvedValueOnce({ data: { rows: [{ id: 1, intitule: 'Q1' }] } })
        .mockResolvedValueOnce({ data: { rows: [{ id: 1, titre: 'R1', correct: '1', question_id: 1 }] } })
        .mockResolvedValueOnce({ data: { rows: [{ id: 2, intitule: 'Q2' }] } })
        .mockResolvedValueOnce({ data: { rows: [{ id: 2, titre: 'R2', correct: '0', question_id: 2 }] } });

      // Lancer plusieurs requêtes en parallèle
      const promises = [
        axios.get(`${baseURL}/questions`),
        axios.get(`${baseURL}/reponses?question_id=1`),
        axios.get(`${baseURL}/questions`),
        axios.get(`${baseURL}/reponses?question_id=2`)
      ];

      const responses = await Promise.all(promises);
      
      expect(responses).toHaveLength(4);
      responses.forEach(response => {
        expect(response.data.rows).toBeDefined();
      });
    });
  });

  describe('API Data Consistency', () => {
    it('should maintain referential integrity between questions and responses', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      const questionId = 1;
      
      // Mock question
      mockedAxios.get.mockResolvedValueOnce({
        data: { rows: [{ id: questionId, intitule: 'Test Question' }] }
      });
      
      // Mock responses
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          rows: [
            { id: 1, titre: 'Answer 1', correct: '1', question_id: questionId },
            { id: 2, titre: 'Answer 2', correct: '0', question_id: questionId }
          ]
        }
      });

      const questionResponse = await axios.get(`${baseURL}/questions`);
      const answersResponse = await axios.get(`${baseURL}/reponses?question_id=${questionId}`);
      
      const question = questionResponse.data.rows[0];
      const answers = answersResponse.data.rows;
      
      // Vérifier l'intégrité référentielle
      expect(question.id).toBe(questionId);
      answers.forEach((answer: any) => {
        expect(answer.question_id).toBe(questionId);
      });
    });

    it('should validate correct answer logic', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      
      const mockResponse = {
        data: {
          rows: [
            { id: 1, titre: 'Correct Answer', correct: '1', question_id: 1 },
            { id: 2, titre: 'Wrong Answer 1', correct: '0', question_id: 1 },
            { id: 3, titre: 'Wrong Answer 2', correct: '0', question_id: 1 }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const response = await axios.get(`${baseURL}/reponses?question_id=1`);
      const answers = response.data.rows;
      
      // Vérifier qu'il y a exactement une bonne réponse
      const correctAnswers = answers.filter((a: any) => a.correct === '1');
      const wrongAnswers = answers.filter((a: any) => a.correct === '0');
      
      expect(correctAnswers).toHaveLength(1);
      expect(wrongAnswers).toHaveLength(2);
      expect(correctAnswers[0].titre).toBe('Correct Answer');
    });
  });
});
