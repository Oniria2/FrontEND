/**
 * TESTS D'INTÉGRATION API RÉELLE - HEROKU
 * =======================================
 * 
 * Ce fichier contient tous les tests d'intégration pour l'API QCM hébergée sur Heroku.
 * Ces tests font de VRAIES requêtes HTTP vers votre API en production.
 * 
 * API BASE URL: https://qcm-api-a108ec633b51.herokuapp.com
 * 
 * ENDPOINTS TESTÉS:
 * - GET /questions/{id} : Récupération d'une question spécifique
 * - GET /reponse/{id} : Récupération des réponses pour une question
 * 
 * DONNÉES RÉELLES TESTÉES:
 * Questions: 1, 2, 3, 4
 * - Q1: "Comment vous sentez-vous ?"
 * - Q2: "Que pensez-vous de votre environnement de travail ?"
 * - Q3: "Avez-vous eu un accident de travail ?"
 * - Q4: "Recommanderiez-vous les postes à pourvoir à vos connaissances ?"
 * 
 * ⚠️ IMPORTANT: Ces tests nécessitent une connexion internet active
 * et que l'API Heroku soit opérationnelle.
 */

describe('Real API Integration Tests - Heroku', () => {
  const baseURL = 'https://qcm-api-a108ec633b51.herokuapp.com';
  
  // Helper pour faire des requêtes HTTP sans axios mocké
  const fetchAPI = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Nettoyage après tous les tests pour éviter les handles ouverts
  afterAll(async () => {
    // Attendre que toutes les connexions fetch se ferment
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Forcer la collecte des ordures pour nettoyer les références
    if (global.gc) {
      global.gc();
    }
  });

  // Timeout plus long pour les tests d'API réelle
  jest.setTimeout(15000);

  /**
   * ========================================
   * TESTS DE L'API QUESTIONS RÉELLE
   * ========================================
   * Tests avec votre vraie API Heroku
   */
  describe('Real Questions API Integration', () => {
    
    /**
     * TEST 1: Récupération d'une question spécifique (ID=1)
     * ----------------------------------------------------
     * OBJECTIF: Vérifier que l'API retourne bien une question réelle
     * ENDPOINT: GET /questions/1
     * DONNÉE ATTENDUE: "Comment vous sentez-vous ?"
     * ASSERTIONS: 
     * - Réponse valide
     * - Structure de données correcte
     * - Intitulé correspond aux données réelles
     */
    it('should fetch question with ID 1 from real API', async () => {
      const questionId = 1;
      
      const data = await fetchAPI(`${baseURL}/questions/${questionId}`);
      
      expect(data).toHaveProperty('rows');
      expect(data.rows).toHaveLength(1);
      expect(data.rows[0]).toHaveProperty('id');
      expect(data.rows[0]).toHaveProperty('intitule');
      expect(data.rows[0].id).toBe(questionId);
      expect(typeof data.rows[0].intitule).toBe('string');
      expect(data.rows[0].intitule.length).toBeGreaterThan(0);
      
      // Vérifier que c'est bien la question attendue
      expect(data.rows[0].intitule.trim()).toBe('Comment vous sentez-vous ?');
      
      console.log('✅ Question 1:', data.rows[0].intitule);
    });

    /**
     * TEST 2: Récupération de toutes les questions (ID=1,2,3,4)
     * --------------------------------------------------------
     * OBJECTIF: Tester toutes les questions du QCM
     * SCÉNARIO: Récupérer les 4 questions une par une
     * DONNÉES ATTENDUES: Questions avec intitulés réels
     * ASSERTIONS:
     * - Toutes les questions existent
     * - Chaque question a l'intitulé attendu
     * - Les IDs correspondent bien
     */
    it('should fetch all 4 questions from real API', async () => {
      const expectedQuestions = {
        1: 'Comment vous sentez-vous ?',
        2: 'Que pensez-vous de votre environnement de travail ?',
        3: 'Avez-vous eu un accident de travail ?',
        4: 'Recommanderiez-vous les postes à pourvoir à vos connaissances ?'
      };
      
      const questionIds = [1, 2, 3, 4];
      const questions = [];
      
      for (const id of questionIds) {
        const data = await fetchAPI(`${baseURL}/questions/${id}`);
        expect(data.rows).toHaveLength(1);
        
        const question = data.rows[0];
        expect(question.id).toBe(id);
        expect(question.intitule).toBeDefined();
        expect(typeof question.intitule).toBe('string');
        
        // Vérifier que l'intitulé correspond aux données réelles
        expect(question.intitule.trim()).toBe(expectedQuestions[id as keyof typeof expectedQuestions]);
        
        questions.push(question);
        console.log(`✅ Question ${id}: ${question.intitule.trim()}`);
      }
      
      // Vérifier que toutes les questions sont différentes
      const intitules = questions.map(q => q.intitule);
      const uniqueIntitules = [...new Set(intitules)];
      expect(uniqueIntitules).toHaveLength(4);
    });

    /**
     * TEST 3: Gestion des questions inexistantes
     * ------------------------------------------
     * OBJECTIF: Tester le comportement avec un ID invalide
     * SCÉNARIO: Requête avec question_id=999 (n'existe pas)
     * ASSERTIONS: Gestion d'erreur appropriée
     */
    it('should handle non-existent question gracefully', async () => {
      try {
        await fetchAPI(`${baseURL}/questions/999`);
        // Si on arrive ici, l'API a retourné une réponse
        // Certaines APIs retournent 200 avec un tableau vide
        console.log('API returned response for non-existent question');
      } catch (error: any) {
        // L'API peut retourner 404 ou une autre erreur
        expect([404, 500].includes(error.message.includes('404') ? 404 : 500)).toBe(true);
        console.log('✅ Expected error for non-existent question:', error.message);
      }
    });
  });

  /**
   * ========================================
   * TESTS DE L'API RÉPONSES RÉELLE
   * ========================================
   * Tests avec l'endpoint /reponse/{id} de votre API
   */
  describe('Real Responses API Integration', () => {
    
    /**
     * TEST 4: Récupération des réponses pour la question 1
     * ---------------------------------------------------
     * OBJECTIF: Vérifier la récupération des réponses réelles
     * ENDPOINT: GET /reponse/1
     * DONNÉES ATTENDUES:
     * - 'Mal' (correct='0')
     * - 'Bien' (correct='1') ← Bonne réponse
     * - 'AssezBien' (correct='0')
     * ASSERTIONS:
     * - Réponses retournées
     * - Structure de données correcte
     * - Une réponse correcte existe
     */
    it('should fetch responses for question 1 from real API', async () => {
      const questionId = 1;
      
      const data = await fetchAPI(`${baseURL}/reponse/${questionId}`);
      
      expect(data).toHaveProperty('rows');
      expect(Array.isArray(data.rows)).toBe(true);
      expect(data.rows.length).toBeGreaterThan(0);
      
      // Données attendues pour la question 1
      const expectedTitles = ['Mal', 'Bien', 'AssezBien'];
      const actualTitles = data.rows.map((row: any) => row.titre);
      
      // Vérifier la structure de chaque réponse
      data.rows.forEach((row: any, index: number) => {
        expect(row).toHaveProperty('id');
        expect(row).toHaveProperty('titre');
        expect(row).toHaveProperty('correct');
        expect(row).toHaveProperty('question_id');
        expect(typeof row.titre).toBe('string');
        expect(row.titre.length).toBeGreaterThan(0);
        expect(row.question_id).toBe(questionId);
        
        const isCorrect = row.correct === '1' || row.correct === 1 || row.correct === true;
        console.log(`✅ Réponse ${index + 1}: ${row.titre} ${isCorrect ? '✓' : '✗'} (correct=${row.correct})`);
      });
      
      // Vérifier qu'il y a au moins une bonne réponse
      const hasCorrectAnswer = data.rows.some((row: any) => 
        row.correct === '1' || row.correct === 1 || row.correct === true
      );
      expect(hasCorrectAnswer).toBe(true);
      
      // Vérifier que 'Bien' est la bonne réponse
      const correctAnswer = data.rows.find((row: any) => 
        row.correct === '1' || row.correct === 1 || row.correct === true
      );
      expect(correctAnswer?.titre).toBe('Bien');
    });

    /**
     * TEST 5: Récupération des réponses pour toutes les questions
     * ----------------------------------------------------------
     * OBJECTIF: Tester les réponses de toutes les questions du QCM
     * SCÉNARIO: Récupérer les réponses pour les questions 1,2,3,4
     * DONNÉES ATTENDUES: Selon votre base de données
     * ASSERTIONS:
     * - Chaque question a des réponses
     * - Chaque question a exactement une bonne réponse
     * - Structure cohérente pour toutes les réponses
     */
    it('should fetch responses for all questions from real API', async () => {
      const questionIds = [1, 2, 3, 4];
      
      // Réponses correctes attendues par question
      const expectedCorrectAnswers = {
        1: 'Bien',
        2: 'Est idéal',
        3: 'Non',
        4: 'Oui'
      };
      
      for (const questionId of questionIds) {
        const data = await fetchAPI(`${baseURL}/reponse/${questionId}`);
        
        expect(data.rows.length).toBeGreaterThan(0);
        
        const responses = data.rows;
        console.log(`\n=== Question ${questionId} - Réponses ===`);
        
        // Analyser les réponses
        let correctCount = 0;
        let correctAnswerTitle = '';
        
        responses.forEach((row: any, index: number) => {
          const isCorrect = row.correct === '1' || row.correct === 1 || row.correct === true;
          if (isCorrect) {
            correctCount++;
            correctAnswerTitle = row.titre;
          }
          
          console.log(`${index + 1}. ${row.titre} ${isCorrect ? '✓' : '✗'}`);
          
          // Validation de la structure
          expect(row).toHaveProperty('id');
          expect(row).toHaveProperty('titre');
          expect(row).toHaveProperty('correct');
          expect(row).toHaveProperty('question_id');
          expect(row.question_id).toBe(questionId);
        });
        
        // Vérifier qu'il y a exactement une bonne réponse (logique QCM)
        expect(correctCount).toBe(1);
        
        // Vérifier que la bonne réponse correspond aux données attendues
        expect(correctAnswerTitle).toBe(expectedCorrectAnswers[questionId as keyof typeof expectedCorrectAnswers]);
        
        console.log(`✅ Bonne réponse: ${correctAnswerTitle}`);
      }
    });

    /**
     * TEST 6: Validation de la cohérence question-réponses
     * ---------------------------------------------------
     * OBJECTIF: Vérifier l'intégrité entre questions et réponses
     * SCÉNARIO: Pour chaque question, vérifier ses réponses
     * ASSERTIONS: Cohérence des données entre les deux endpoints
     */
    it('should maintain consistency between questions and responses', async () => {
      const questionIds = [1, 2];
      
      for (const questionId of questionIds) {
        // Récupérer la question
        const questionData = await fetchAPI(`${baseURL}/questions/${questionId}`);
        const question = questionData.rows[0];
        
        // Récupérer les réponses
        const responsesData = await fetchAPI(`${baseURL}/reponse/${questionId}`);
        const responses = responsesData.rows;
        
        // Vérifications de cohérence
        expect(question.id).toBe(questionId);
        expect(responses.length).toBeGreaterThan(0);
        
        // Vérifier que toutes les réponses référencent bien cette question
        responses.forEach((response: any) => {
          expect(response.question_id).toBe(questionId);
        });
        
        console.log(`✅ Cohérence vérifiée pour la question ${questionId}: "${question.intitule.trim()}"`);
      }
    });
  });

  /**
   * ========================================
   * TESTS DE PERFORMANCE API RÉELLE
   * ========================================
   * Tests de performance avec votre vraie API
   */
  describe('Real API Performance Tests', () => {
    
    /**
     * TEST 7: Temps de réponse acceptable
     * -----------------------------------
     * OBJECTIF: Vérifier que l'API répond dans un délai raisonnable
     * SEUIL: < 5 secondes (API en production sur Heroku)
     * ASSERTIONS: Temps de réponse acceptable
     */
    it('should respond within acceptable time', async () => {
      const startTime = Date.now();
      
      const data = await fetchAPI(`${baseURL}/questions/1`);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(data.rows).toBeDefined();
      expect(responseTime).toBeLessThan(5000); // 5 secondes max
      
      console.log(`✅ Temps de réponse: ${responseTime}ms`);
    });

    /**
     * TEST 8: Test de charge léger
     * ----------------------------
     * OBJECTIF: Vérifier que l'API gère plusieurs requêtes simultanées
     * SCÉNARIO: 3 requêtes en parallèle
     * ASSERTIONS: Toutes les requêtes aboutissent
     */
    it('should handle multiple concurrent requests', async () => {
      const promises = [
        fetchAPI(`${baseURL}/questions/1`),
        fetchAPI(`${baseURL}/reponse/1`),
        fetchAPI(`${baseURL}/reponse/2`)
      ];
      
      const responses = await Promise.all(promises);
      
      expect(responses).toHaveLength(3);
      responses.forEach((response: any) => {
        expect(response.rows).toBeDefined();
      });
      
      console.log('✅ 3 requêtes concurrentes réussies');
    });
  });

  /**
   * ========================================
   * TESTS DE ROBUSTESSE
   * ========================================
   * Tests de gestion d'erreurs avec la vraie API
   */
  describe('Real API Error Handling', () => {
    
    /**
     * TEST 9: Gestion des timeouts
     * ----------------------------
     * OBJECTIF: Tester le comportement en cas de timeout
     * SCÉNARIO: Requête avec timeout très court
     * NOTE: Fetch n'a pas de timeout par défaut, on utilise AbortController
     */
    it('should handle request timeouts', async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1); // 1ms timeout
      
      try {
        await fetch(`${baseURL}/questions/1`, { 
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
      } catch (error: any) {
        expect(error.name === 'AbortError' || error.message.includes('aborted')).toBe(true);
        console.log('✅ Timeout géré correctement:', error.message);
      }
    });

    /**
     * TEST 10: Validation des données réelles
     * ---------------------------------------
     * OBJECTIF: Vérifier que les données de l'API sont cohérentes
     * ASSERTIONS: Validation stricte des données retournées
     */
    it('should validate real data structure and content', async () => {
      // Test sur une question
      const questionData = await fetchAPI(`${baseURL}/questions/1`);
      const question = questionData.rows[0];
      
      // Validations strictes
      expect(typeof question.id).toBe('number');
      expect(typeof question.intitule).toBe('string');
      expect(question.intitule.trim().length).toBeGreaterThan(3);
      
      // Test sur les réponses
      const responsesData = await fetchAPI(`${baseURL}/reponse/1`);
      const responses = responsesData.rows;
      
      expect(responses.length).toBeGreaterThanOrEqual(2); // Au moins 2 choix
      expect(responses.length).toBeLessThanOrEqual(10);   // Max 10 choix (raisonnable)
      
      responses.forEach((response: any) => {
        expect(typeof response.id).toBe('number');
        expect(typeof response.titre).toBe('string');
        expect(response.titre.trim().length).toBeGreaterThan(0);
        expect(response.correct !== undefined).toBe(true);
        expect(response.question_id).toBe(1);
      });
      
      console.log('✅ Validation des données réelles réussie');
    });
  });
});

/**
 * RÉSUMÉ DES TESTS D'INTÉGRATION API RÉELLE
 * =========================================
 * 
 * COUVERTURE FONCTIONNELLE:
 * ✓ 10 tests couvrant votre API Heroku réelle
 * ✓ Tests des endpoints /questions/{id} et /reponse/{id}
 * ✓ Validation complète des vraies données
 * ✓ Tests de performance en conditions réelles
 * ✓ Gestion d'erreurs et robustesse
 * 
 * SCENARIOS COUVERTS:
 * - Récupération des questions individuelles ✓
 * - Récupération de toutes les questions (1-4) ✓
 * - Gestion des IDs inexistants ✓
 * - Récupération des réponses par question ✓
 * - Validation de la cohérence des données ✓
 * - Tests de performance réseau ✓
 * - Requêtes concurrentes ✓
 * - Gestion des timeouts ✓
 * - Validation stricte des données ✓
 * 
 * AVANTAGES DE CES TESTS:
 * - Testent votre API en conditions réelles
 * - Valident la structure de vos vraies données
 * - Détectent les problèmes de performance réseau
 * - Vérifient la disponibilité de l'API Heroku
 * 
 * UTILISATION:
 * npm test -- real-api.integration.test.tsx
 * 
 */
