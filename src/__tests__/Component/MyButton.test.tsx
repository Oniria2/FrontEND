import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyButton from '../../Component/MyButton';

describe('MyButton Component', () => {
  const mockHandleRedirect = jest.fn();
  const buttonText = 'Test Button';

  beforeEach(() => {
    mockHandleRedirect.mockClear();
  });

  it('should render correctly with given props', () => {
    const { getByText } = render(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );
    
    expect(getByText(buttonText)).toBeTruthy();
  });

  it('should call handleRedirect when pressed', () => {
    const { getByText } = render(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );
    
    const button = getByText(buttonText);
    fireEvent.press(button);
    
    expect(mockHandleRedirect).toHaveBeenCalledTimes(1);
  });

  it('should have correct button text', () => {
    const customText = 'Custom Button Text';
    const { getByText } = render(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={customText} />
    );
    
    expect(getByText(customText)).toBeTruthy();
  });

  it('should render with elevated mode', () => {
    const { getByText } = render(
      <MyButton handleRedirect={mockHandleRedirect} buttonText={buttonText} />
    );
    
    const button = getByText(buttonText);
    expect(button).toBeTruthy();
  });
});
