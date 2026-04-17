import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { runScan } from '../../services/photoScanner';
import { setHasCompletedOnboarding } from '../../lib/storage';

const SERIF_ITALIC = 'PlayfairDisplay_400Regular_Italic';
const SERIF_BOLD = 'PlayfairDisplay_700Bold';

export default function ScanningScreen() {
  const [count, setCount] = useState(0);

  const handleProgress = useCallback(
    (_scanned: number, _total: number, eligible: number) => {
      setCount(eligible);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    runScan(handleProgress).then((result) => {
      if (cancelled) return;

      if ('error' in result) {
        router.back();
        return;
      }

      setCount(result.eligible);

      const timer = setTimeout(() => {
        if (cancelled) return;
        setHasCompletedOnboarding(true);
        router.replace('/(tabs)');
      }, 1600);

      return () => clearTimeout(timer);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1A1108' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
        <Text
          style={{
            fontFamily: SERIF_ITALIC,
            fontSize: 22,
            color: '#9C8E7A',
            textAlign: 'center',
            letterSpacing: 0.3,
            marginBottom: 32,
          }}
        >
          finding your memories
        </Text>

        <Text
          style={{
            fontFamily: SERIF_BOLD,
            fontSize: 88,
            color: '#E8A830',
            letterSpacing: -3,
            lineHeight: 88,
          }}
        >
          {count}
        </Text>

        <Text
          style={{
            fontSize: 10,
            fontWeight: '500',
            color: '#5C5650',
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            marginTop: 16,
          }}
        >
          fragments recovered
        </Text>
      </View>
    </SafeAreaView>
  );
}
