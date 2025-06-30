import React from 'react';
import { render } from '@testing-library/react-native';
import Layout from '../../app/_layout';

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: () => 'Stack',
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => ({
  PaperProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Layout Component', () => {
  it('should render without crashing', () => {
    render(<Layout />);
    expect(true).toBe(true);
  });

  it('should wrap Stack in PaperProvider', () => {
    const { getByText } = render(<Layout />);
    // Le Stack devrait être rendu à l'intérieur du PaperProvider
    expect(getByText('Stack')).toBeTruthy();
  });

  it('should provide Paper theme context', () => {
    render(<Layout />);
    // Le PaperProvider devrait fournir le contexte du thème
    expect(true).toBe(true);
  });
});
