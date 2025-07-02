import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

function _layout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName = route.name === 'index' ? 'home-outline' : 'time-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                headerShown: false
            })}
        >
            <Tabs.Screen name="index" options={{ title: '홈' }} />
            <Tabs.Screen name="history" options={{ title: '히스토리' }} />
        </Tabs>
    );
}

export default _layout;