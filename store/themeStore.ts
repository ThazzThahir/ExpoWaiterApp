
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
    // Primary colors
    primary: string;
    primaryDark: string;
    primaryLight: string;

    // Secondary colors
    secondary: string;
    secondaryDark: string;
    secondaryLight: string;

    // Status colors
    vacant: string;
    reserved: string;
    occupied: string;

    // Neutral colors
    background: string;
    card: string;
    text: string;
    textLight: string;
    border: string;

    // Gradient colors
    gradientStart: string;
    gradientEnd: string;

    // Additional colors
    success: string;
    warning: string;
    error: string;
    info: string;
}

const lightTheme: ThemeColors = {
    primary: '#3498db',
    primaryDark: '#2980b9',
    primaryLight: '#5dade2',
    secondary: '#f39c12',
    secondaryDark: '#d35400',
    secondaryLight: '#f8c471',
    vacant: '#2ecc71',
    reserved: '#f39c12',
    occupied: '#e74c3c',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textLight: '#7f8c8d',
    border: '#ecf0f1',
    gradientStart: '#3498db',
    gradientEnd: '#2980b9',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
};

const darkTheme: ThemeColors = {
    primary: '#3498db',
    primaryDark: '#2980b9',
    primaryLight: '#5dade2',
    secondary: '#f39c12',
    secondaryDark: '#d35400',
    secondaryLight: '#f8c471',
    vacant: '#27ae60',
    reserved: '#f39c12',
    occupied: '#e74c3c',
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    textLight: '#b0b0b0',
    border: '#404040',
    gradientStart: '#2980b9',
    gradientEnd: '#1f4e79',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
};

interface ThemeState {
    mode: ThemeMode;
    colors: ThemeColors;
    isDark: boolean;
    setTheme: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            mode: 'light',
            colors: lightTheme,
            isDark: false,

            setTheme: (mode: ThemeMode) => {
                const isDark = mode === 'dark' || (mode === 'system' && isSystemDark());
                set({
                    mode,
                    colors: isDark ? darkTheme : lightTheme,
                    isDark,
                });
            },

            toggleTheme: () => {
                const currentMode = get().mode;
                const newMode = currentMode === 'light' ? 'dark' : 'light';
                get().setTheme(newMode);
            },
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Helper function to detect system theme (simplified for now)
const isSystemDark = (): boolean => {
    // In a real app, you'd use Appearance API from react-native
    // For now, we'll default to false
    return false;
};
