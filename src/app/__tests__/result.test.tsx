import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Result from '../result';

// Mock expo-router
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    navigate: mockNavigate,
  },
  useLocalSearchParams: () => ({
    name: 'TestUser',
    score: '3',
  }),
}));

// Mock des assets
jest.mock('../../../assets/trophé.png', () => 'trophy.png');

describe('Result Screen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render welcome message with user name', () => {
    const { getByText } = render(<Result />);
    
    expect(getByText(/Voici l'image qui représente/)).toBeTruthy();
    expect(getByText(/TestUser/)).toBeTruthy();
  });

  it('should render thank you message', () => {
    const { getByText } = render(<Result />);
    
    expect(getByText(/Merci d'avoir pris le temps/)).toBeTruthy();
  });

  it('should render back to home button', () => {
    const { getByText } = render(<Result />);
    
    expect(getByText('Retour a l\'accueil')).toBeTruthy();
  });

  it('should navigate to home when button is pressed', () => {
    const { getByText } = render(<Result />);
    
    const button = getByText('Retour a l\'accueil');
    fireEvent.press(button);
    
    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/',
    });
  });

  it('should display trophy image', () => {
    const { getByRole } = render(<Result />);
    
    // Vérifier que l'image est présente
    const image = getByRole('image');
    expect(image).toBeTruthy();
  });
});

describe('Result Screen with different params', () => {
  it('should handle different user names', () => {
    // Mock différents paramètres
    jest.doMock('expo-router', () => ({
      router: {
        navigate: jest.fn(),
      },
      useLocalSearchParams: () => ({
        name: 'AnotherUser',
        score: '2',
      }),
    }));

    const { getByText } = render(<Result />);
    expect(getByText(/AnotherUser/)).toBeTruthy();
  });
});
