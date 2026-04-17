import { Tabs } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.amber,
        tabBarInactiveTintColor: Colors.creamMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Play',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: 'Map' }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'History' }}
      />
    </Tabs>
  );
}
