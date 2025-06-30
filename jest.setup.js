import '@testing-library/jest-native/extend-expect';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Mock expo modules
jest.mock('expo-constants', () => ({
  executionEnvironment: 'standalone',
}));

jest.mock('expo-linking', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  getInitialURL: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock expo-router
const mockNavigate = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    navigate: mockNavigate,
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
  }),
  useLocalSearchParams: () => ({
    name: 'TestUser',
    score: '3',
  }),
  router: {
    navigate: mockNavigate,
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
  },
  Stack: {
    Screen: ({ children, ...props }) => children,
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  
  const mockSafeAreaContext = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  return {
    SafeAreaProvider: ({ children }) => React.createElement('View', {}, children),
    SafeAreaView: ({ children, ...props }) => React.createElement('View', props, children),
    SafeAreaConsumer: ({ children }) => children(mockSafeAreaContext),
    SafeAreaContext: React.createContext(mockSafeAreaContext),
    useSafeAreaInsets: () => mockSafeAreaContext,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    withSafeAreaInsets: (Component) => Component,
    SafeAreaProviderCompat: ({ children }) => React.createElement('View', {}, children),
    SafeAreaInsetsContext: React.createContext(mockSafeAreaContext),
  };
});

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  
  const mockTheme = {
    colors: {
      primary: '#6200ee',
      surface: '#ffffff',
      background: '#f6f6f6',
      onSurface: '#000000',
      text: '#000000',
    },
    fonts: {
      regular: { fontFamily: 'System' },
      medium: { fontFamily: 'System' },
      light: { fontFamily: 'System' },
      thin: { fontFamily: 'System' },
    },
  };
  
  return {
    PaperProvider: ({ children, theme }) => {
      const contextValue = {
        theme: { ...mockTheme, ...theme },
        isV3: true,
      };
      return React.createElement('View', { testID: 'paper-provider' }, children);
    },
    Button: ({ children, onPress, mode = 'contained', ...props }) => 
      React.createElement('TouchableOpacity', 
        { onPress, testID: 'paper-button', ...props }, 
        React.createElement('Text', { testID: 'paper-button-text' }, children)
      ),
    Text: ({ children, variant = 'bodyMedium', ...props }) => 
      React.createElement('Text', { testID: 'paper-text', ...props }, children),
    Surface: ({ children, ...props }) => 
      React.createElement('View', { testID: 'paper-surface', ...props }, children),
    Card: ({ children, ...props }) => 
      React.createElement('View', { testID: 'paper-card', ...props }, children),
    Title: ({ children, ...props }) => 
      React.createElement('Text', { testID: 'paper-title', ...props }, children),
    Paragraph: ({ children, ...props }) => 
      React.createElement('Text', { testID: 'paper-paragraph', ...props }, children),
    DefaultTheme: mockTheme,
    MD3LightTheme: mockTheme,
    useTheme: () => mockTheme,
  };
});

// Mock axios
const mockAxiosGet = jest.fn(() => Promise.resolve({ 
  data: { 
    intitule: 'Question de test',
    id: 1 
  } 
}));

const mockAxiosPost = jest.fn(() => Promise.resolve({ 
  data: [
    { id: 1, intitule: 'Réponse correcte', correct: true },
    { id: 2, intitule: 'Réponse incorrecte', correct: false }
  ] 
}));

jest.mock('axios', () => ({
  get: mockAxiosGet,
  post: mockAxiosPost,
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock images and assets
jest.mock('../assets/StartImage.png', () => 'StartImage.png');
jest.mock('../assets/trophé.png', () => 'trophé.png');
jest.mock('../assets/MonImage.jpeg', () => 'MonImage.jpeg');

// Global mock for any image imports
jest.mock('*.png', () => 'mock-image.png', { virtual: true });
jest.mock('*.jpg', () => 'mock-image.jpg', { virtual: true });
jest.mock('*.jpeg', () => 'mock-image.jpeg', { virtual: true });

// Suppress console warnings during tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: React.createElement') ||
       args[0].includes('Warning: An update to') ||
       args[0].includes('SafeAreaProviderCompat'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
  
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('The above error occurred in the') ||
       args[0].includes('Consider adding an error boundary') ||
       args[0].includes('SafeAreaProviderCompat'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
