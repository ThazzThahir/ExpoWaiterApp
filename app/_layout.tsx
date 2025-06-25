import React from 'react';
import { Stack } from 'expo-router';
import { AppThemeProvider } from '@/components/common/AppThemeProvider';

export default function RootLayout() {
    return (
        <AppThemeProvider>
            <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(app)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </AppThemeProvider>
    );
}