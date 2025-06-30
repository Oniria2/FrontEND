# Tests d'Intégration - Oniria

Ce dossier contient les tests d'intégration pour l'application Oniria, complétant les tests unitaires existants.

## 🎯 Objectif des Tests d'Intégration

Les tests d'intégration vérifient que les différents composants de l'application fonctionnent correctement ensemble, contrairement aux tests unitaires qui testent chaque composant isolément.

## 📁 Structure des Tests d'Intégration

```
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
