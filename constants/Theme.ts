import { DefaultTheme } from 'react-native-paper';
// import { Theme } from 'react-native-paper/lib/typescript/types';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      border: string;
    }

    // interface Theme {
    //   myOwnProperty: boolean;
    // }
  }
}

export const LightTheme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    border: 'rgba(0, 0, 0, 0.2)',
  },
};

export const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  mode: 'adaptive',
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgba(0, 0, 255, 1)',
    accent: '#03dac6',
    background: '#121212',
    surface: '#121212',
    error: '#CF6679',
    onSurface: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.2)',
    text: '#fff',
    disabled: 'rgba(255, 255, 255, 0.38)',
    placeholder: 'rgba(255, 255, 255, 0.54)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#6200ee',
  },
  fonts: {
    light: { fontFamily: 'sans-serif-light', fontWeight: 'normal' },
    medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' },
    regular: { fontFamily: 'sans-serif', fontWeight: 'normal' },
    thin: { fontFamily: 'sans-serif-thin', fontWeight: 'normal' },
  },
};
