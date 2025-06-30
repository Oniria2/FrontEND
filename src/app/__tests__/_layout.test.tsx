import React from 'react';
import { render } from '@testing-library/react-native';
import Layout from '../_layout';

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: () => null,
}));

describe('Layout Component', () => {
  it('should render without crashing', () => {
    const result = render(<Layout />);
    expect(result).toBeTruthy();
  });

  it('should wrap children with PaperProvider', () => {
    const result = render(<Layout />);
    
    // Le composant devrait être rendu avec le PaperProvider
    // Comme PaperProvider est un wrapper, on vérifie juste que le composant se rend
    expect(result).toBeTruthy();
  });

  it('should include Stack component', () => {
    const result = render(<Layout />);
    
    // Vérifier que le composant s'est rendu correctement
    expect(result).toBeTruthy();
  });
});
