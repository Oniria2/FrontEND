import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import MyButton from '../MyButton';

// Wrapper pour fournir le contexte PaperProvider
const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <PaperProvider>
      {component}
    </PaperProvider>
  );
};

describe('MyButton Component', () => {
  it('should render correctly with given text', () => {
    const mockHandleRedirect = jest.fn();
    const buttonText = 'Test Button';

    const { getByText } = renderWithProvider(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );

    expect(getByText(buttonText)).toBeTruthy();
  });

  it('should call handleRedirect when pressed', () => {
    const mockHandleRedirect = jest.fn();
    const buttonText = 'Click Me';

    const { getByText } = renderWithProvider(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );

    const button = getByText(buttonText);
    fireEvent.press(button);

    expect(mockHandleRedirect).toHaveBeenCalledTimes(1);
  });

  it('should not call handleRedirect when not pressed', () => {
    const mockHandleRedirect = jest.fn();
    const buttonText = 'Inactive Button';

    renderWithProvider(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );

    expect(mockHandleRedirect).not.toHaveBeenCalled();
  });

  it('should render with different button texts', () => {
    const mockHandleRedirect = jest.fn();
    const buttonTexts = ['Start', 'Continue', 'Finish'];

    buttonTexts.forEach(text => {
      const { getByText, unmount } = renderWithProvider(
        <MyButton handleRedirect={mockHandleRedirect} buttonText={text} />
      );

      expect(getByText(text)).toBeTruthy();
      unmount();
    });
  });
});
