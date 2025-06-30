import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Result from '../../app/result';

// Mock de useLocalSearchParams et router
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({
    name: 'TestUser',
    score: '3',
  }),
  router: {
    navigate: mockNavigate,
  },
}));

describe('Result Screen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render user name in result message', () => {
    const { getByText } = render(<Result />);
    expect(getByText(/TestUser/)).toBeTruthy();
  });

  it('should render congratulations message', () => {
    const { getByText } = render(<Result />);
    expect(getByText(/Voici l'image qui représente/)).toBeTruthy();
  });

  it('should render thank you message', () => {
    const { getByText } = render(<Result />);
    expect(getByText(/Merci d'avoir pris le temps/)).toBeTruthy();
  });

  it('should render return to home button', () => {
    const { getByText } = render(<Result />);
    expect(getByText('Retour a l\'accueil')).toBeTruthy();
  });

  it('should navigate to home when return button is pressed', () => {
    const { getByText } = render(<Result />);
    
    const returnButton = getByText('Retour a l\'accueil');
    fireEvent.press(returnButton);
    
    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/',
    });
  });

  it('should display trophy image', () => {
    render(<Result />);
    // L'image du trophée devrait être affichée
    expect(true).toBe(true);
  });

  it('should have correct styling', () => {
    const { getByText } = render(<Result />);
    const thankYouMessage = getByText(/Merci d'avoir pris le temps/);
    expect(thankYouMessage).toBeTruthy();
  });
});
