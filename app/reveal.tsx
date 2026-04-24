import { useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

// ─── Constants ────────────────────────────────────────────────────────────────

const { height: SH } = Dimensions.get('window');

const FINAL_SCORE = 4850;
const MEMORY_CAPTION = 'a winter afternoon in Boston, four years ago';
const COORD_TEXT = 'MEMORY COORDINATES • 42.3601° N, 71.0589° W';
const STREAK_DAYS = 12;

const SERIF = 'PlayfairDisplay_400Regular';
const SERIF_ITALIC = 'PlayfairDisplay_400Regular_Italic';
const SERIF_BOLD = 'PlayfairDisplay_700Bold';

type RevealParams = {
  guessLat?: string;
  guessLng?: string;
  guessMonth?: string;
  guessYear?: string;
};

function formatScore(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RevealScreen() {
  const insets = useSafeAreaInsets();
  useLocalSearchParams<RevealParams>();

  // ── Animated score counter ─────────────────────────────────────────────────
  const scoreSv = useSharedValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  useAnimatedReaction(
    () => Math.round(scoreSv.value),
    (val, prev) => {
      if (val !== prev) runOnJS(setDisplayScore)(val);
    },
  );

  useEffect(() => {
    const t = setTimeout(() => {
      scoreSv.value = withTiming(FINAL_SCORE, {
        duration: 1400,
        easing: Easing.out(Easing.cubic),
      });
    }, 250);
    return () => clearTimeout(t);
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I scored ${formatScore(FINAL_SCORE)} on Resurface — "${MEMORY_CAPTION}"`,
      });
    } catch {
      // dismissed
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1108', paddingTop: insets.top }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E8A830' }}>
        <Text style={{ color: '#E8A830', fontFamily: SERIF_BOLD, fontSize: 13, letterSpacing: 3, textAlign: 'center' }}>
          RESURFACE
        </Text>
      </View>

      {/* ── Map polaroid — fixed height ───────────────────────────────── */}
      <View style={{ height: SH * 0.48, alignItems: 'center', justifyContent: 'center', paddingTop: 12 }}>
        <View style={{ width: '78%', height: '100%', backgroundColor: '#F5F0E8', borderRadius: 4, padding: 8 }}>
          <View style={{ flex: 1, backgroundColor: '#2A2015', borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 28 }}>📍</Text>
          </View>
          <View style={{ height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#5C4A2A', fontSize: 9, letterSpacing: 1.5, textAlign: 'center' }}>
              {COORD_TEXT}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Score + caption + streak + buttons ────────────────────────── */}
      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'space-evenly', alignItems: 'center' }}>

        {/* Score */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#9C8E7A', fontSize: 10, letterSpacing: 3 }}>
            RECOGNITION SCORE
          </Text>
          <Animated.Text style={{ color: '#F0E6D0', fontFamily: SERIF_BOLD, fontSize: 56, lineHeight: 64 }}>
            {formatScore(displayScore)}
          </Animated.Text>
          <View style={{ width: 40, height: 1, backgroundColor: '#E8A830', marginTop: 4 }} />
        </View>

        {/* Caption */}
        <Text style={{ color: '#F0E6D0', fontFamily: SERIF_ITALIC, fontSize: 18, textAlign: 'center', lineHeight: 26 }}>
          {`"${MEMORY_CAPTION}"`}
        </Text>

        {/* Streak badge */}
        <View style={{ backgroundColor: '#251A0E', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text style={{ color: '#E8A830', fontSize: 11, letterSpacing: 2 }}>
            ⚡ {STREAK_DAYS} DAY STREAK
          </Text>
        </View>

        {/* Buttons */}
        <View style={{ width: '100%', gap: 12 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#E8A830', borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={{ color: '#1A1108', fontFamily: SERIF_BOLD, fontSize: 13, letterSpacing: 2 }}>
              CONTINUE JOURNEY →
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 12 }} onPress={handleShare}>
            <Text style={{ color: '#9C8E7A', fontSize: 12, letterSpacing: 2 }}>
              ↗ SHARE MEMORY
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      <View style={{ height: insets.bottom }} />
    </View>
  );
}
