# Documentation Complète des Tests d'Intégration

## 🎯 Vue d'ensemble

Ce dossier contient la suite complète des tests d'intégration pour l'application QCM React Native/Expo. Ces tests vérifient le bon fonctionnement de l'application dans son ensemble, incluant l'intégration API, la navigation, et les flux utilisateur complets.

## 📁 Structure des Tests

```
integration/
├── api.integration.test.tsx       # Tests d'intégration API (14 tests)
├── navigation.e2e.test.tsx        # Tests de navigation E2E (14 tests)
├── userFlow.integration.test.tsx  # Tests de flux utilisateur (10 tests)
└── README.md                      # Cette documentation complète
```

## 🔍 Types de Tests Détaillés

### 1. Tests d'Intégration API (`api.integration.test.tsx`)

**Objectif :** Vérifier la communication avec l'API backend et la gestion des données.

#### 📋 Questions API Integration (4 tests)
1. **Récupération basique des questions**
   - Vérification du status 200
   - Validation de la structure des données
   - Présence des propriétés obligatoires (id, intitule)

2. **Gestion des types de données variés**
   - Nombres dans les intitulés
   - Dates formatées
   - Caractères spéciaux/accents
   - Chaînes vides et valeurs null

3. **Limitation de taux (Rate Limiting)**
   - Simulation d'erreur 429 (Too Many Requests)
   - Vérification de la gestion des quotas API

#### 📝 Responses API Integration (3 tests)
4. **Récupération des réponses par question**
   - Test avec question_id en paramètre
   - Validation de l'intégrité référentielle
   - Vérification de la présence d'une bonne réponse

5. **Validation de la structure des données**
   - Types de données (id: number, titre: string, etc.)
   - Valeurs correctes pour le champ 'correct' ('0'/'1')
   - Cohérence des question_id

6. **Gestion des questions sans réponses**
   - Test avec question inexistante (ID 999)
   - Retour de tableau vide mais valide

#### ⚠️ API Error Handling Integration (4 tests)
7. **Timeouts réseau**
   - Simulation de dépassement de délai
   - Gestion gracieuse des timeouts

8. **Erreurs serveur (500)**
   - Simulation d'erreur interne serveur
   - Récupération des messages d'erreur détaillés

9. **Réponses mal formées**
   - API retournant une structure incorrecte
   - Détection et gestion des anomalies

10. **Mécanisme de retry**
    - Premier appel échoue, deuxième réussit
    - Validation de la logique de nouvelle tentative

#### ⚡ API Performance Integration (2 tests)
11. **Temps de réponse acceptable**
    - Test avec 100 questions simultanées
    - Seuil de performance : < 2 secondes

12. **Requêtes concurrentes**
    - 4 requêtes en parallèle (Promise.all)
    - Vérification de l'absence d'interférence

#### 🔗 API Data Consistency (2 tests)
13. **Intégrité référentielle**
    - Cohérence entre question.id et response.question_id
    - Validation des relations entre entités

14. **Logique des bonnes réponses**
    - Une seule bonne réponse par question
    - Cohérence de la logique métier QCM

### 2. Tests de Navigation E2E (`navigation.e2e.test.tsx`)

**Objectif :** Vérifier les flux de navigation complets dans l'application.

#### 🧭 Navigation Flow Tests (14 tests)
- Navigation complète Index → QCM → Result
- Gestion des erreurs de navigation
- Tests de performance de navigation (< 500ms)
- Navigation rapide et gestion de la pile
- Récupération après erreurs de navigation

### 3. Tests de Flux Utilisateur (`userFlow.integration.test.tsx`)

**Objectif :** Simuler des parcours utilisateur complets et réalistes.

#### � User Journey Tests (10 tests)
- Parcours QCM complet du début à la fin
- Saisie du nom utilisateur
- Réponse aux questions
- Affichage des résultats
- Intégration des données entre écrans
src/__tests__/integration/
├── README.md                           # Ce fichier
├── userFlow.integration.test.tsx       # Tests de flux utilisateur complets
├── api.integration.test.tsx           # Tests d'intégration API
└── navigation.e2e.test.tsx            # Tests de navigation end-to-end
```

## 🔄 Types de Tests d'Intégration

### 1. Tests de Flux Utilisateur (`userFlow.integration.test.tsx`)
- **Parcours complets** : Accueil → QCM → Résultats
- **Flux de données** : Transmission des données entre écrans
- **Gestion d'erreurs** : Comportement en cas d'échec
- **Performance** : Temps de réponse et interactions rapides

### 2. Tests d'Intégration API (`api.integration.test.tsx`)
- **Appels API réels** : Tests avec données réalistes
- **Gestion d'erreurs** : Timeouts, erreurs serveur, données malformées
- **Performance** : Temps de réponse, requêtes concurrent
- **Intégrité des données** : Cohérence questions/réponses

### 3. Tests de Navigation End-to-End (`navigation.e2e.test.tsx`)
- **Navigation complète** : Tous les chemins de navigation
- **Gestion des paramètres** : Deep linking, paramètres manquants
- **Stack de navigation** : Gestion de l'historique
- **Récupération d'erreurs** : Résilience aux échecs de navigation

## 🚀 Lancer les Tests d'Intégration

### Scripts Disponibles

```bash
# Lancer tous les tests (unitaires + intégration)
npm test

# Lancer uniquement les tests d'intégration
npm test -- --testPathPattern=integration

# Lancer un fichier de test spécifique
npm test -- userFlow.integration.test.tsx

# Tests d'intégration en mode watch
npm test -- --testPathPattern=integration --watch

# Tests d'intégration avec couverture
npm test -- --testPathPattern=integration --coverage
```

### Tests par Catégorie

```bash
# Tests de flux utilisateur
npm test -- userFlow.integration.test.tsx

# Tests d'API
npm test -- api.integration.test.tsx

# Tests de navigation E2E
npm test -- navigation.e2e.test.tsx
```

## 🏗️ Architecture des Tests d'Intégration

### Différences avec les Tests Unitaires

| Aspect | Tests Unitaires | Tests d'Intégration |
|--------|----------------|-------------------|
| **Portée** | Composant isolé | Plusieurs composants |
| **Mocks** | Tous les externes | Mocks minimaux |
| **Données** | Données mocké | Données réalistes |
| **Navigation** | Mock complet | Navigation simulée |
| **API** | Mock complet | Vraies requêtes (mock) |
| **Performance** | Non testé | Temps de réponse |

### Configuration Spécifique

```typescript
// Mocks minimaux pour intégration
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ name: 'IntegrationTestUser' }),
  router: { navigate: mockNavigate },
  Stack: { Screen: ({ children }: any) => children },
}));
```

## 📊 Couverture des Tests d'Intégration

### Scénarios Couverts

#### ✅ Flux Utilisateur Complets
- Navigation Accueil → QCM → Résultats
- Transmission des données utilisateur
- Gestion des interactions rapides
- Consistency des données entre écrans

#### ✅ Intégration API
- Chargement des questions/réponses
- Gestion des erreurs réseau
- Validation des structures de données
- Performance des appels API

#### ✅ Navigation End-to-End
- Tous les chemins de navigation
- Gestion des paramètres d'URL
- Stack de navigation
- Récupération après erreurs

#### ✅ Cas d'Erreur
- Échecs de navigation
- Erreurs API (timeout, 500, données malformées)
- Paramètres manquants
- Interactions utilisateur rapides

### Métriques de Qualité

- **Temps de réponse** : < 1 seconde pour le chargement
- **Navigation** : < 500ms entre écrans
- **API** : < 2 secondes pour 100 questions
- **Résilience** : Récupération automatique d'erreurs

## 🛠️ Bonnes Pratiques

### 1. Tests Réalistes
```typescript
// ✅ Données réalistes
const mockQuestion = {
  id: 1,
  intitule: 'Comment évaluez-vous votre bien-être au travail ?'
};

// ❌ Données simplistes
const mockQuestion = { id: 1, title: 'Test' };
```

### 2. Gestion d'Erreurs
```typescript
// ✅ Test des cas d'erreur
it('should handle API errors gracefully', async () => {
  mockedAxios.get.mockRejectedValue(new Error('Network Error'));
  // Vérifier que l'app continue à fonctionner
});
```

### 3. Performance
```typescript
// ✅ Tests de performance
it('should load within acceptable time', async () => {
  const startTime = Date.now();
  // ... action
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(1000);
});
```

### 4. Flux Complets
```typescript
// ✅ Tests de bout en bout
it('should complete full user journey', async () => {
  // Étape 1: Accueil
  // Étape 2: QCM
  // Étape 3: Résultats
  // Vérifier chaque étape
});
```

## 🔍 Debugging des Tests d'Intégration

### Techniques de Debug

```typescript
// Afficher l'état des mocks
console.log('Mock calls:', mockNavigate.mock.calls);

// Vérifier les réponses API
console.log('API Response:', response.data);

// Temps d'exécution
console.time('Test execution');
// ... test
console.timeEnd('Test execution');
```

### Outils de Diagnostic

```bash
# Verbose output
npm test -- --testPathPattern=integration --verbose

# Debug mode
npm test -- --testPathPattern=integration --debug

# Run with inspection
node --inspect-brk node_modules/.bin/jest --testPathPattern=integration
```

## 🎯 Avantages des Tests d'Intégration

### Pour l'Équipe
- **Confiance** dans les flux utilisateur
- **Détection** des régressions cross-composants
- **Validation** des interactions complexes
- **Documentation** des comportements attendus

### Pour la Qualité
- **Couverture** des cas réels d'utilisation
- **Performance** sous conditions réalistes
- **Robustesse** face aux erreurs
- **Cohérence** des données entre composants

## 🚀 Évolution Future

### Extensions Possibles
- **Tests E2E avec Detox** : Tests sur vrais devices
- **Tests de performance** : Profiling et benchmarks
- **Tests cross-platform** : iOS vs Android
- **Tests d'accessibilité** : Screen readers, navigation

### Intégration CI/CD
```yaml
# Tests d'intégration dans GitHub Actions
- name: Run Integration Tests
  run: npm test -- --testPathPattern=integration --ci
```

## 📈 Métriques et Reporting

### Couverture de Code
```bash
# Couverture spécifique aux tests d'intégration
npm test -- --testPathPattern=integration --coverage --coverageDirectory=coverage/integration
```

### Rapports de Performance
Les tests d'intégration incluent des assertions sur les temps de réponse et la performance générale de l'application.

---

*Ces tests d'intégration complètent parfaitement la suite de tests unitaires existante, offrant une couverture complète de l'application Oniria.*
