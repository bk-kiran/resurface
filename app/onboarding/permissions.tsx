import { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';

type DeniedState = { denied: false } | { denied: true; canAskAgain: boolean };

export default function PermissionsScreen() {
  const [state, setState] = useState<DeniedState>({ denied: false });
  const [requesting, setRequesting] = useState(false);

  const screenOpacity = useSharedValue(0);
  const screenY = useSharedValue(16);

  useEffect(() => {
    const ease = Easing.out(Easing.exp);
    screenOpacity.value = withTiming(1, { duration: 600, easing: ease });
    screenY.value = withTiming(0, { duration: 600, easing: ease });
  }, []);

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ translateY: screenY.value }],
  }));

  const handleGrant = useCallback(async () => {
    if (requesting) return;
    setRequesting(true);

    try {
      const result = await MediaLibrary.requestPermissionsAsync();

      if (result.granted) {
        router.push('/onboarding/scanning');
      } else {
        setState({ denied: true, canAskAgain: result.canAskAgain });
      }
    } finally {
      setRequesting(false);
    }
  }, [requesting]);

  const handleOpenSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const isDenied = state.denied;
  const canAskAgain = state.denied ? state.canAskAgain : true;
  const buttonLabel = requesting
    ? 'requesting…'
    : isDenied && !canAskAgain
      ? 'open settings'
      : 'grant access';

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Content */}
      <Animated.View
        style={screenStyle}
        className="flex-1 items-center justify-center px-10"
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: '300',
            color: '#F5F0E8',
            textAlign: 'center',
            letterSpacing: -0.3,
            lineHeight: 34,
            marginBottom: 20,
          }}
        >
          resurface needs{'\n'}your photos.
        </Text>

        <Text
          style={{
            fontSize: 15,
            fontWeight: '300',
            color: '#A89F8C',
            textAlign: 'center',
            lineHeight: 24,
            letterSpacing: 0.2,
          }}
        >
          We scan your library once, on your device.{'\n'}Nothing ever leaves your phone.
        </Text>
      </Animated.View>

      {/* Bottom actions */}
      <Animated.View style={screenStyle} className="px-8 pb-10 gap-4">
        {/* Inline denial error */}
        {isDenied && (
          <Text
            className="text-error text-center"
            style={{ fontSize: 13, fontWeight: '400', letterSpacing: 0.2 }}
          >
            {canAskAgain
              ? 'photo access is required to continue.'
              : 'please enable photo access in settings.'}
          </Text>
        )}

        <Pressable
          className="bg-accent rounded-2xl py-4 items-center"
          style={({ pressed }) => ({ opacity: pressed || requesting ? 0.75 : 1 })}
          onPress={isDenied && !canAskAgain ? handleOpenSettings : handleGrant}
          disabled={requesting}
        >
          <Text
            style={{ color: '#121210', fontSize: 15, fontWeight: '500', letterSpacing: 0.3 }}
          >
            {buttonLabel}
          </Text>
        </Pressable>

        <Pressable
          className="items-center py-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          onPress={() => router.back()}
        >
          <Text
            style={{ color: '#5C5650', fontSize: 13, fontWeight: '400', letterSpacing: 0.2 }}
          >
            go back
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
