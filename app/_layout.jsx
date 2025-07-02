import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient()
function _layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                    <QueryClientProvider client={queryClient}>
                        <Stack screenOptions={{ headerShown: false }} />
                    </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default _layout;