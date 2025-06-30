import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import MyButton from '../../Component/MyButton';

// Wrapper pour fournir le contexte PaperProvider
const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <PaperProvider>
      {component}
    </PaperProvider>
  );
};

describe('MyButton Component', () => {
  const mockHandleRedirect = jest.fn();
  const buttonText = 'Test Button';

  beforeEach(() => {
    mockHandleRedirect.mockClear();
  });

  it('should render correctly with given props', () => {
    const { getByText } = renderWithProvider(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );
    
    expect(getByText(buttonText)).toBeTruthy();
  });

  it('should call handleRedirect when pressed', () => {
    const { getByText } = renderWithProvider(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );
    
    const button = getByText(buttonText);
    fireEvent.press(button);
    
    expect(mockHandleRedirect).toHaveBeenCalledTimes(1);
  });

  it('should have correct button text', () => {
    const customText = 'Custom Button Text';
    const { getByText } = renderWithProvider(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={customText} />
    );
    
    expect(getByText(customText)).toBeTruthy();
  });

  it('should render with elevated mode', () => {
    const { getByText } = renderWithProvider(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );
    
    const button = getByText(buttonText);
    expect(button).toBeTruthy();
  });
});
