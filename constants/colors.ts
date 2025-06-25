
import { useThemeStore } from '@/store/themeStore';

// Export the theme hook for easy access
export const useThemeColors = () => useThemeStore(state => state.colors);

// Legacy export for backward compatibility
export const colors = {
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
