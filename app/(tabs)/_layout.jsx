import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

function _layout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'index':
                            iconName = 'home-outline';
                            break;
                        case 'history':
                            iconName = 'time-outline';
                            break;
                        case 'info':
                            iconName = 'person-circle-outline';
                            break;
                        default:
                            iconName = 'ellipse-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tabs.Screen name="index" options={{ title: '홈' }} />
            <Tabs.Screen name="history" options={{ title: '히스토리' }} />
            <Tabs.Screen name="info" options={{ title: '내 정보' }} />
        </Tabs>
    );
}

export default _layout;