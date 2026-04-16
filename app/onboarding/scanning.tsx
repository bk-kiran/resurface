import { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { runScan } from '../../services/photoScanner';
import { setHasCompletedOnboarding } from '../../lib/storage';

export default function ScanningScreen() {
  // Animated counter driven by spring on the shared value
  const countSv = useSharedValue(0);
  const [displayCount, setDisplayCount] = useState(0);

  // Screen-level entrance
  const screenOpacity = useSharedValue(0);

  // Pulsing line
  const lineOpacity = useSharedValue(0);
  const lineScale = useSharedValue(0.6);

  // Completion fade-up for the "done" label
  const doneOpacity = useSharedValue(0);

  // Mirror the spring value into React state for rendering
  useAnimatedReaction(
    () => Math.round(countSv.value),
    (rounded, prev) => {
      if (rounded !== prev) runOnJS(setDisplayCount)(rounded);
    },
  );

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  const lineStyle = useAnimatedStyle(() => ({
    opacity: lineOpacity.value,
    transform: [{ scaleX: lineScale.value }],
  }));

  const doneStyle = useAnimatedStyle(() => ({ opacity: doneOpacity.value }));

  const handleProgress = useCallback(
    (_scanned: number, _total: number, eligible: number) => {
      countSv.value = withSpring(eligible, { damping: 18, stiffness: 80 });
    },
    // countSv is stable (Reanimated shared value ref doesn't change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const ease = Easing.out(Easing.exp);

    // Entrance
    screenOpacity.value = withTiming(1, { duration: 500, easing: ease });

    // Pulsing line — breathes in/out indefinitely while scanning
    lineOpacity.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 950, easing: Easing.inOut(Easing.sine) }),
          withTiming(0.18, { duration: 950, easing: Easing.inOut(Easing.sine) }),
        ),
        -1,
        false,
      ),
    );
    lineScale.value = withDelay(300, withTiming(1, { duration: 600, easing: ease }));

    runScan(handleProgress).then((result) => {
      if (cancelled) return;

      if ('error' in result) {
        // Permissions were revoked between screens — go back
        router.back();
        return;
      }

      // Spring to the final exact count
      countSv.value = withSpring(result.eligible, { damping: 12, stiffness: 60 });

      // Stop the pulse, show "done" label
      lineOpacity.value = withTiming(0.35, { duration: 400 });
      doneOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));

      // Pause so the user can read the count, then enter the app
      const timer = setTimeout(() => {
        if (cancelled) return;
        setHasCompletedOnboarding(true);
        router.replace('/(tabs)');
      }, 1800);

      return () => clearTimeout(timer);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Animated.View
        style={screenStyle}
        className="flex-1 items-center justify-center px-10"
      >
        {/* Counter label */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: '400',
            color: '#5C5650',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          found
        </Text>

        {/* Spring-driven number */}
        <Text
          style={{
            fontSize: 80,
            fontWeight: '200',
            color: '#F5F0E8',
            letterSpacing: -3,
            lineHeight: 88,
            includeFontPadding: false,
          }}
        >
          {displayCount}
        </Text>

        <Text
          style={{
            fontSize: 13,
            fontWeight: '400',
            color: '#5C5650',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginTop: 10,
          }}
        >
          memories
        </Text>

        {/* Pulsing line — breathing activity indicator */}
        <Animated.View
          style={[
            lineStyle,
            {
              width: 56,
              height: 1,
              backgroundColor: '#F5A623',
              borderRadius: 1,
              marginTop: 48,
            },
          ]}
        />

        {/* Completion label — fades in after scan finishes */}
        <Animated.Text
          style={[
            doneStyle,
            {
              fontSize: 13,
              fontWeight: '400',
              color: '#A89F8C',
              letterSpacing: 0.3,
              marginTop: 20,
            },
          ]}
        >
          all done.
        </Animated.Text>
      </Animated.View>
    </SafeAreaView>
  );
}
