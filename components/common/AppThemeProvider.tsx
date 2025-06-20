import React, { createContext, useContext } from 'react';
import { colors } from '../../constants/colors';

interface AppTheme {
    colors: typeof colors;
}

const defaultTheme: AppTheme = {
    colors
};

const ThemeContext = createContext<AppTheme>(defaultTheme);

export const useAppTheme = () => useContext(ThemeContext);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeContext.Provider value={defaultTheme}>
            {children}
        </ThemeContext.Provider>
    );
}
