
import React, { createContext, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore, ThemeColors } from '@/store/themeStore';

interface AppTheme {
    colors: ThemeColors;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<AppTheme | null>(null);

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within AppThemeProvider');
    }
    return context;
};

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const { colors, isDark, toggleTheme, setTheme } = useThemeStore();

    const theme: AppTheme = {
        colors,
        isDark,
        toggleTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={theme}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            {children}
        </ThemeContext.Provider>
    );
}
