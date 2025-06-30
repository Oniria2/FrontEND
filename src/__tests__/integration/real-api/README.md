# Tests d'Intégration API Réelle

Ce dossier contient les tests d'intégration qui interrogent directement votre API Heroku en production.

## 🌐 API Testée

- **Base URL** : `https://qcm-api-a108ec633b51.herokuapp.com`
- **Endpoints** :
  - `GET /questions/{id}` - Récupération d'une question spécifique
  - `GET /reponse/{id}` - Récupération des réponses pour une question

## 🔄 Différence avec les autres tests

| Type de Test | Mocks | Vraies Requêtes | Vitesse | Fiabilité |
|-------------|--------|-----------------|---------|-----------|
| **Tests Unitaires** | ✅ | ❌ | 🚀 Très rapide | 🛡️ Très fiable |
| **Tests d'Intégration (Mock)** | ✅ | ❌ | ⚡ Rapide | 🔒 Fiable |
| **Tests d'Intégration Réelle** | ❌ | ✅ | 🐌 Lent | 🌐 Dépend du réseau |

## 🚀 Comment exécuter ces tests

### 1. Tous les tests d'API réelle
```bash
npm test -- real-api.integration.test.tsx
```

### 2. Tests spécifiques
```bash
# Tests des questions seulement
npm test -- real-api.integration.test.tsx -t "Real Questions API"

# Tests des réponses seulement  
npm test -- real-api.integration.test.tsx -t "Real Responses API"

# Tests de performance
npm test -- real-api.integration.test.tsx -t "Performance"
```

### 3. Mode watch (surveille les changements)
```bash
npm test -- real-api.integration.test.tsx --watch
```

## 📋 Prérequis

- ✅ Connexion internet active
- ✅ API Heroku opérationnelle
- ✅ Patience (tests plus lents que les mocks)

## 🔍 Ce que ces tests vérifient

### ✅ Fonctionnalités
- Récupération des questions (ID 1, 2, 3, 4)
- Récupération des réponses pour chaque question
- Validation de la structure des données
- Cohérence entre questions et réponses

### ⚡ Performance
- Temps de réponse < 5 secondes
- Gestion des requêtes concurrentes
- Comportement en cas de timeout

### 🛡️ Robustesse
- Gestion des erreurs HTTP
- Validation des types de données
- Test avec des IDs inexistants

## 📊 Exemple de sortie

```
Real API Integration Tests - Heroku
  Real Questions API Integration
    ✓ should fetch question with ID 1 from real API (1234ms)
      Question 1: Comment vous sentez-vous ?
    ✓ should fetch all 4 questions from real API (3456ms)
      Question 1: Comment vous sentez-vous ?
      Question 2: Que pensez-vous de votre travail ?
      Question 3: Avez-vous eu un accident de travail ?
      Question 4: Êtes-vous satisfait de votre environnement ?
  
  Real Responses API Integration
    ✓ should fetch responses for question 1 from real API (987ms)
      Réponse 1: Très bien ✓
      Réponse 2: Bien ✗
      Réponse 3: Mal ✗
```

## ⚠️ Limitations

- **Plus lents** : Vraies requêtes réseau
- **Dépendants du réseau** : Peuvent échouer si pas d'internet
- **Dépendants de l'API** : Échouent si Heroku est down
- **Coûteux** : Consomment des quotas API

## 🔧 Configuration

Les tests utilisent un timeout de 10 secondes par défaut. Vous pouvez l'ajuster dans le fichier de test :

```typescript
axios.defaults.timeout = 10000; // 10 secondes
```

## 🆚 Quand utiliser quels tests ?

### Tests d'Intégration Réelle (ce dossier)
- ✅ Avant un déploiement
- ✅ Pour valider que l'API fonctionne vraiment
- ✅ Pour débugger des problèmes réseau
- ✅ Pour tester les performances réelles

### Tests d'Intégration Mock (dossier parent)
- ✅ Développement quotidien
- ✅ Tests automatisés (CI/CD)
- ✅ Validation de la logique applicative
- ✅ Tests de cas d'erreurs spécifiques

### Tests Unitaires
- ✅ Développement TDD
- ✅ Tests de fonctions isolées
- ✅ Validation de la logique métier
- ✅ Couverture de code

## 📝 Notes importantes

1. **Ces tests ne remplacent pas les tests avec mocks**, ils les complètent
2. **Utilisez-les avec parcimonie** pour éviter de surcharger votre API
3. **Parfaits pour la validation finale** avant mise en production
4. **Peuvent révéler des problèmes** que les mocks ne détectent pas

## 🐛 Débogage

Si les tests échouent :

1. **Vérifiez votre connexion internet**
2. **Testez l'API manuellement** : `curl https://qcm-api-a108ec633b51.herokuapp.com/questions/1`
3. **Vérifiez les logs Heroku** si vous y avez accès
4. **Augmentez le timeout** si les requêtes sont lentes
