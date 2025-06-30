# Tests Unitaires - Oniria

Ce projet utilise Jest et React Native Testing Library pour les tests unitaires.

## Configuration

Les tests sont configurés avec :
- **Jest** : Framework de test
- **React Native Testing Library** : Utilitaires pour tester les composants React Native
- **Jest Expo** : Preset Jest optimisé pour Expo

## Structure des Tests

```
src/
├── app/
│   ├── __tests__/
│   │   ├── index.test.tsx        # Tests pour la page d'accueil
│   │   ├── qcm.test.tsx          # Tests pour le questionnaire
│   │   ├── result.test.tsx       # Tests pour la page de résultats
│   │   └── _layout.test.tsx      # Tests pour le layout
│   └── ...
├── Component/
│   ├── __tests__/
│   │   ├── MyButton.test.tsx     # Tests pour le composant bouton
│   │   └── TimerComponent.test.tsx # Tests pour le composant timer
│   └── ...
```

## Scripts de Test

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch (surveillance)
npm run test:watch

# Exécuter les tests avec couverture de code
npm run test:coverage
```

## Types de Tests Implémentés

### Tests de Composants
- **MyButton** : Test du rendu, des interactions et des props
- **TimerComponent** : Test du comportement temporel et des états
- **InputTextComponent** : Test des entrées utilisateur

### Tests d'Écrans
- **Index (Accueil)** : Test du formulaire de saisie du nom
- **QCM** : Test du chargement des questions et des réponses via API
- **Result** : Test de l'affichage des résultats et navigation
- **Layout** : Test du wrapper principal

### Tests d'Intégration
- Navigation entre les écrans
- Gestion des états globaux
- Appels API mockés

## Mocks Utilisés

- **expo-router** : Navigation mockée
- **axios** : Appels API mockés
- **expo-status-bar** : Composant Expo mocké
- **react-native-vector-icons** : Icônes mockées
- **Assets** : Images mockées

## Exemples d'Utilisation

### Test d'un Composant Simple
```typescript
it('should render correctly with given text', () => {
  const mockHandleRedirect = jest.fn();
  const buttonText = 'Test Button';

  const { getByText } = renderWithProvider(
    <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
  );

  expect(getByText(buttonText)).toBeTruthy();
});
```

### Test d'Interaction Utilisateur
```typescript
it('should call handleRedirect when pressed', () => {
  const mockHandleRedirect = jest.fn();
  
  const { getByText } = renderWithProvider(
    <MyButton handleRedirect={mockHandleRedirect} buttonText="Click Me" />
  );

  fireEvent.press(getByText('Click Me'));
  expect(mockHandleRedirect).toHaveBeenCalledTimes(1);
});
```

### Test d'API Mockée
```typescript
it('should load and display first question', async () => {
  mockedAxios.get.mockResolvedValue({
    data: { rows: [{ intitule: 'Test Question' }] }
  });

  const { getByText } = render(<QCM />);
  
  await waitFor(() => {
    expect(getByText('Test Question')).toBeTruthy();
  });
});
```

## Couverture de Code

Les tests couvrent :
- ✅ Rendu des composants
- ✅ Interactions utilisateur
- ✅ Gestion des états
- ✅ Navigation
- ✅ Appels API
- ✅ Gestion d'erreurs
- ✅ Props et paramètres

## Bonnes Pratiques

1. **Isolation** : Chaque test est indépendant
2. **Mocking** : Dépendances externes mockées
3. **Descriptif** : Noms de tests clairs et descriptifs
4. **Couverture** : Tests de tous les cas d'usage importants
5. **Performance** : Tests rapides et efficaces

## Dépannage

### Erreurs Communes

1. **Module non trouvé** : Vérifier les mocks dans `jest.setup.js`
2. **Timeout** : Utiliser `waitFor` pour les opérations asynchrones
3. **Navigation** : S'assurer que `expo-router` est correctement mocké
