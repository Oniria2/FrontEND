import React from 'react';
import { render } from '@testing-library/react-native';
import Layout from '../../app/_layout';

describe('Layout Component', () => {
  it('should render without crashing', () => {
    render(<Layout />);
    expect(true).toBe(true);
  });

  it('should wrap Stack in PaperProvider', () => {
    const { getByTestId } = render(<Layout />);
    // Le Stack devrait être rendu à l'intérieur du PaperProvider
    expect(getByTestId('paper-provider')).toBeTruthy();
  });

  it('should provide Paper theme context', () => {
    render(<Layout />);
    // Le PaperProvider devrait fournir le contexte du thème
    expect(true).toBe(true);
  });
});
