import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import Index from '../../app/index';

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children, ...props }: any) => children,
  },
  useRouter: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock des assets
jest.mock('../../../assets/StartImage.png', () => 'StartImage.png');

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <PaperProvider>
      {component}
    </PaperProvider>
  );
};

describe('Index Screen', () => {
  it('should render welcome text', () => {
    const { getByText } = renderWithProvider(<Index />);
    
    expect(getByText('Bienvenue sur votre questionnaire')).toBeTruthy();
  });

  it('should render text input', () => {
    const { getByDisplayValue } = renderWithProvider(<Index />);
    
    // L'input devrait être présent (même s'il est vide au début)
    const input = getByDisplayValue('');
    expect(input).toBeTruthy();
  });

  it('should render start button', () => {
    const { getByText } = renderWithProvider(<Index />);
    
    expect(getByText('commencer le questionnaire')).toBeTruthy();
  });

  it('should update text input when typing', () => {
    const { getByDisplayValue } = renderWithProvider(<Index />);
    
    const input = getByDisplayValue('');
    fireEvent.changeText(input, 'John Doe');
    
    expect(getByDisplayValue('John Doe')).toBeTruthy();
  });

  it('should handle button press', () => {
    const { getByText, getByDisplayValue } = renderWithProvider(<Index />);
    
    // Saisir un nom
    const input = getByDisplayValue('');
    fireEvent.changeText(input, 'Test User');
    
    // Cliquer sur le bouton
    const button = getByText('commencer le questionnaire');
    fireEvent.press(button);
    
    // Le bouton devrait être cliquable
    expect(button).toBeTruthy();
  });

  it('should render with correct initial state', () => {
    const { getByDisplayValue } = renderWithProvider(<Index />);
    
    // L'input devrait être vide au début
    expect(getByDisplayValue('')).toBeTruthy();
  });
});
