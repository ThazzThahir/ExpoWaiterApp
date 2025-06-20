import React from 'react';
import { View, ViewProps } from 'react-native';
import { useAppTheme } from './AppThemeProvider';

interface ScreenContentWrapperProps extends ViewProps {
    children: React.ReactNode;
}

export function ScreenContentWrapper({ children, style, ...props }: ScreenContentWrapperProps) {
    const { colors } = useAppTheme();

    return (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor: colors.background,
                },
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
}
