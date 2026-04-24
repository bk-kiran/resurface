import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function ScanningScreen() {
  useEffect(() => {
    setTimeout(() => router.replace('/(tabs)'), 2000);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1108', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#E8A830', fontSize: 18 }}>finding your memories...</Text>
    </View>
  );
}
