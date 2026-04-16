import { Tabs } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FontSize } from '../../constants/typography';

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
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '500',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Play' }}
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
