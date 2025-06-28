import React, { createContext, useContext } from 'react';
import { colors as lightColors } from '../../constants/colors';

interface AppTheme {
    colors: typeof lightColors;
}

const ThemeContext = createContext<AppTheme>({
    colors: lightColors,
});

export const useAppTheme = () => useContext(ThemeContext);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeContext.Provider value={{ colors: lightColors }}>
            {children}
        </ThemeContext.Provider>
    );
}
