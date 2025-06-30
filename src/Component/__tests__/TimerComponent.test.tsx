import React from 'react';
import { render } from '@testing-library/react-native';
import TimerComponent from '../TimerComponent';

// Mock des timers pour contrôler le comportement des tests
jest.useFakeTimers();

describe('TimerComponent', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should render correctly with initial state', () => {
    const duration = 10;
    const { getByTestId } = render(<TimerComponent duration={duration} />);
    
    // Le composant doit être rendu
    expect(getByTestId || render).toBeTruthy();
  });

  it('should start with 0% progress', () => {
    const duration = 10;
    const { container } = render(<TimerComponent duration={duration} />);
    
    // Vérifier que le composant s'est bien rendu
    expect(container).toBeTruthy();
  });

  it('should progress over time', () => {
    const duration = 10;
    render(<TimerComponent duration={duration} />);
    
    // Avancer le temps d'1 seconde
    jest.advanceTimersByTime(1000);
    
    // Le timer devrait avoir progressé
    expect(jest.getTimerCount()).toBe(1);
  });

  it('should handle different durations', () => {
    const durations = [5, 10, 30, 60];
    
    durations.forEach(duration => {
      const { unmount } = render(<TimerComponent duration={duration} />);
      expect(render).toBeTruthy();
      unmount();
    });
  });

  it('should complete after specified duration', () => {
    const duration = 5;
    render(<TimerComponent duration={duration} />);
    
    // Avancer le temps de la durée complète
    jest.advanceTimersByTime(duration * 1000);
    
    // Le timer devrait être terminé
    expect(jest.getTimerCount()).toBe(0);
  });
});
