
// Color palette for the restaurant management app
export const lightColors = {
    // Primary colors
    primary: '#3498db',
    primaryDark: '#2980b9',
    primaryLight: '#5dade2',

    // Secondary colors
    secondary: '#f39c12',
    secondaryDark: '#d35400',
    secondaryLight: '#f8c471',

    // Status colors
    vacant: '#2ecc71',
    reserved: '#f39c12',
    occupied: '#e74c3c',

    // Neutral colors
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    border: '#ecf0f1',

    // Gradient colors
    gradientStart: '#3498db',
    gradientEnd: '#2980b9',
};

export const darkColors = {
    // Primary colors
    primary: '#3498db',
    primaryDark: '#2980b9',
    primaryLight: '#5dade2',

    // Secondary colors
    secondary: '#f39c12',
    secondaryDark: '#d35400',
    secondaryLight: '#f8c471',

    // Status colors
    vacant: '#2ecc71',
    reserved: '#f39c12',
    occupied: '#e74c3c',

    // Neutral colors
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    textLight: '#b0b0b0',
    border: '#404040',

    // Gradient colors
    gradientStart: '#2c3e50',
    gradientEnd: '#1a252f',
};

// Default export for backward compatibility
export const colors = lightColors;

export const getColors = (isDark: boolean) => isDark ? darkColors : lightColors;
