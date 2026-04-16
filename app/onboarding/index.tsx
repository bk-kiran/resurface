import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);

  useEffect(() => {
    const ease = Easing.out(Easing.exp);

    wordmarkOpacity.value = withDelay(100, withTiming(1, { duration: 800, easing: ease }));
    wordmarkY.value = withDelay(100, withTiming(0, { duration: 800, easing: ease }));
    taglineOpacity.value = withDelay(350, withTiming(1, { duration: 700, easing: ease }));
    ctaOpacity.value = withDelay(650, withTiming(1, { duration: 600, easing: ease }));
  }, []);

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
  }));

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Center wordmark + tagline */}
      <Animated.View className="flex-1 items-center justify-center px-10">
        <Animated.Text
          style={[
            wordmarkStyle,
            { fontSize: 46, fontWeight: '200', letterSpacing: 8, color: '#F5A623' },
          ]}
        >
          resurface
        </Animated.Text>

        <Animated.Text
          style={[
            taglineStyle,
            {
              fontSize: 15,
              fontWeight: '300',
              color: '#A89F8C',
              textAlign: 'center',
              marginTop: 20,
              lineHeight: 24,
              letterSpacing: 0.3,
            },
          ]}
        >
          a memory surfaces every day.
        </Animated.Text>
      </Animated.View>

      {/* Bottom CTA */}
      <Animated.View style={ctaStyle} className="px-8 pb-10">
        <Pressable
          className="bg-accent rounded-2xl py-4 items-center"
          style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}
          onPress={() => router.push('/onboarding/permissions')}
        >
          <Text
            style={{ color: '#121210', fontSize: 15, fontWeight: '500', letterSpacing: 0.3 }}
          >
            get started
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
