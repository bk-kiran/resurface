import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1989 },
  (_, i) => CURRENT_YEAR - i,
);
const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR',
  'MAY', 'JUN', 'JUL', 'AUG',
  'SEP', 'OCT', 'NOV', 'DEC',
];

const SERIF = 'PlayfairDisplay_400Regular';
const SERIF_ITALIC = 'PlayfairDisplay_400Regular_Italic';
const SERIF_BOLD = 'PlayfairDisplay_700Bold';

// ─── Inline icon components ───────────────────────────────────────────────────

function MenuIcon() {
  return (
    <View style={{ gap: 5, justifyContent: 'center' }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{ width: 20, height: 1.5, backgroundColor: Colors.amber, borderRadius: 1 }}
        />
      ))}
    </View>
  );
}

function HistoryIcon() {
  // Clock face built from Views
  const size = 22;
  const r = size / 2;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: r,
        borderWidth: 1.5,
        borderColor: Colors.amber,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Hour hand */}
      <View
        style={{
          position: 'absolute',
          width: 1.5,
          height: 6,
          backgroundColor: Colors.amber,
          borderRadius: 1,
          bottom: r,
          left: r - 0.75,
          transformOrigin: 'bottom',
          transform: [{ rotate: '-30deg' }],
        }}
      />
      {/* Minute hand */}
      <View
        style={{
          position: 'absolute',
          width: 1.5,
          height: 7,
          backgroundColor: Colors.amber,
          borderRadius: 1,
          bottom: r,
          left: r - 0.75,
          transformOrigin: 'bottom',
          transform: [{ rotate: '60deg' }],
        }}
      />
      {/* Arrow tail suggesting backwards motion */}
      <View
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          width: 5,
          height: 5,
          borderTopWidth: 1.5,
          borderLeftWidth: 1.5,
          borderColor: Colors.amber,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

function PinIcon({ size = 32 }: { size?: number }) {
  const circleSize = size * 0.72;
  const pointSize = size * 0.38;
  return (
    <View style={{ alignItems: 'center', width: size, height: size + 4 }}>
      <View
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: Colors.amber,
          zIndex: 2,
          // Hole in center
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: circleSize * 0.32,
            height: circleSize * 0.32,
            borderRadius: circleSize * 0.16,
            backgroundColor: Colors.surfaceRaised,
          }}
        />
      </View>
      {/* Point */}
      <View
        style={{
          width: pointSize,
          height: pointSize,
          backgroundColor: Colors.amber,
          transform: [{ rotate: '45deg' }],
          marginTop: -(pointSize * 0.55),
          zIndex: 1,
        }}
      />
    </View>
  );
}

// ─── Picker item (shared style logic) ────────────────────────────────────────

function pickerStyle(distance: number) {
  return {
    fontSize: distance === 0 ? 32 : distance === 1 ? 20 : distance === 2 ? 15 : 13,
    color: distance === 0 ? Colors.amber : Colors.creamMuted,
    opacity: distance === 0 ? 1 : distance === 1 ? 0.65 : distance === 2 ? 0.35 : 0.15,
    fontFamily: distance === 0 ? SERIF_BOLD : SERIF,
  } as const;
}

// ─── Month picker item ────────────────────────────────────────────────────────

function MonthItem({
  month,
  distance,
  itemWidth,
}: {
  month: string;
  distance: number;
  itemWidth: number;
}) {
  const { fontSize, color, opacity, fontFamily } = pickerStyle(distance);
  return (
    <View
      style={{
        width: itemWidth,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        opacity,
      }}
    >
      <Text
        style={{ fontFamily, fontSize, color, letterSpacing: distance === 0 ? 1.5 : 1 }}
        numberOfLines={1}
      >
        {month}
      </Text>
    </View>
  );
}

// ─── Year picker item ─────────────────────────────────────────────────────────

function YearItem({
  year,
  distance,
  itemWidth,
}: {
  year: number;
  distance: number;
  itemWidth: number;
}) {
  const fontSize = distance === 0 ? 38 : distance === 1 ? 22 : distance === 2 ? 16 : 13;
  const color =
    distance === 0
      ? Colors.amber
      : distance === 1
        ? Colors.creamMuted
        : Colors.textDisabled;
  const opacity = distance === 0 ? 1 : distance === 1 ? 0.7 : distance === 2 ? 0.4 : 0.2;
  const fontFamily = distance === 0 ? SERIF_BOLD : SERIF;

  return (
    <View
      style={{
        width: itemWidth,
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        opacity,
      }}
    >
      <Text
        style={{
          fontFamily,
          fontSize,
          color,
          letterSpacing: distance === 0 ? -1 : 0,
        }}
        numberOfLines={1}
      >
        {year}
      </Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function PlayScreen() {
  const { width: screenWidth } = useWindowDimensions();

  // ── State ────────────────────────────────────────────────────────────────
  const [selectedYearIdx, setSelectedYearIdx] = useState(0);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);

  // ── Shared picker item width ──────────────────────────────────────────────
  const PICKER_ITEM_WIDTH = Math.floor(screenWidth / 3);

  // ── Year picker ──────────────────────────────────────────────────────────
  const yearListRef = useRef<FlatList>(null);

  const handleYearScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.x;
      const idx = Math.round(offset / PICKER_ITEM_WIDTH);
      setSelectedYearIdx(Math.max(0, Math.min(YEARS.length - 1, idx)));
    },
    [PICKER_ITEM_WIDTH],
  );

  // ── Month picker ─────────────────────────────────────────────────────────
  const monthListRef = useRef<FlatList>(null);

  const handleMonthScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.x;
      const idx = Math.round(offset / PICKER_ITEM_WIDTH);
      setSelectedMonthIdx(Math.max(0, Math.min(MONTHS.length - 1, idx)));
    },
    [PICKER_ITEM_WIDTH],
  );

  // ── Polaroid dimensions ──────────────────────────────────────────────────
  const CARD_WIDTH = Math.floor(screenWidth * 0.72);
  const CARD_PADDING = 10;
  const PHOTO_SIZE = CARD_WIDTH - CARD_PADDING * 2;
  const PHOTO_HEIGHT = Math.floor(PHOTO_SIZE * 0.75); // ~4:3
  const CAPTION_HEIGHT = 44; // 28px top + 16px bottom padding around 13px text
  const CARD_HEIGHT = PHOTO_HEIGHT + CARD_PADDING + CAPTION_HEIGHT;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.amber,
        }}
      >
        <Pressable hitSlop={12} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <MenuIcon />
        </Pressable>

        <Text
          style={{
            fontFamily: SERIF_BOLD,
            fontSize: 13,
            color: Colors.amber,
            letterSpacing: 4,
          }}
        >
          RESURFACE
        </Text>

        <Pressable hitSlop={12} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <HistoryIcon />
        </Pressable>
      </View>

      {/* ── Scrollable content ─────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Polaroid stack ───────────────────────────────────────────── */}
        <View
          style={{
            alignItems: 'center',
            marginTop: 16,
            marginBottom: 20,
            height: CARD_HEIGHT + 8, // 8px for rotated card peek
          }}
        >
          {/* Back card — rotated left */}
          <View
            style={{
              position: 'absolute',
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              backgroundColor: Colors.polaroid,
              borderRadius: 4,
              transform: [{ rotate: '-5deg' }],
              top: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          />

          {/* Middle card — rotated right */}
          <View
            style={{
              position: 'absolute',
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              backgroundColor: Colors.polaroid,
              borderRadius: 4,
              transform: [{ rotate: '3deg' }],
              top: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 4,
            }}
          />

          {/* Top card — straight, shows photo */}
          <Pressable
            style={{
              position: 'absolute',
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              backgroundColor: Colors.polaroid,
              borderRadius: 4,
              padding: CARD_PADDING,
              paddingBottom: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 14,
              elevation: 8,
            }}
          >
            {/* Photo area — placeholder for now */}
            <View
              style={{
                width: PHOTO_SIZE,
                height: PHOTO_HEIGHT,
                backgroundColor: '#2C3A4A',
                borderRadius: 2,
                overflow: 'hidden',
                // Subtle warm overlay gradient feel via layered views
              }}
            >
              {/* Placeholder landscape gradient simulation */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#1A2535',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: PHOTO_HEIGHT * 0.45,
                  backgroundColor: '#0F1B28',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: PHOTO_HEIGHT * 0.3,
                  backgroundColor: '#C87941',
                  opacity: 0.55,
                }}
              />
            </View>

            {/* Caption row */}
            <View
              style={{
                height: CAPTION_HEIGHT,
                alignItems: 'flex-start',
                paddingTop: 28,
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: SERIF_ITALIC,
                  fontSize: 13,
                  color: Colors.polaroidCaption,
                  letterSpacing: 0.2,
                }}
              >
                Untitled Memory
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ── WHEN WAS THIS? ──────────────────────────────────────────── */}
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontFamily: SERIF,
              fontSize: 11,
              color: Colors.cream,
              letterSpacing: 3,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            WHEN WAS THIS?
          </Text>

          {/* Year picker */}
          <FlatList
            ref={yearListRef}
            data={YEARS}
            keyExtractor={(item) => String(item)}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={PICKER_ITEM_WIDTH}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={handleYearScroll}
            contentContainerStyle={{
              paddingHorizontal: (screenWidth - PICKER_ITEM_WIDTH) / 2,
            }}
            getItemLayout={(_, index) => ({
              length: PICKER_ITEM_WIDTH,
              offset: PICKER_ITEM_WIDTH * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <YearItem
                year={item}
                distance={Math.abs(index - selectedYearIdx)}
                itemWidth={PICKER_ITEM_WIDTH}
              />
            )}
            style={{ marginBottom: 4 }}
          />

          {/* Month picker */}
          <FlatList
            ref={monthListRef}
            data={MONTHS}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={PICKER_ITEM_WIDTH}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={handleMonthScroll}
            contentContainerStyle={{
              paddingHorizontal: (screenWidth - PICKER_ITEM_WIDTH) / 2,
            }}
            getItemLayout={(_, index) => ({
              length: PICKER_ITEM_WIDTH,
              offset: PICKER_ITEM_WIDTH * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <MonthItem
                month={item}
                distance={Math.abs(index - selectedMonthIdx)}
                itemWidth={PICKER_ITEM_WIDTH}
              />
            )}
          />
        </View>

        {/* ── WHERE WERE YOU? ─────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: SERIF,
              fontSize: 11,
              color: Colors.cream,
              letterSpacing: 3,
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            WHERE WERE YOU?
          </Text>

          {/* Map placeholder */}
          <View
            style={{
              backgroundColor: Colors.surfaceRaised,
              borderRadius: 12,
              height: 180,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderWidth: 0.5,
              borderColor: Colors.border,
            }}
          >
            {/* Faint grid lines suggesting a map */}
            {[-40, 0, 40].map((y) => (
              <View
                key={`h${y}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 90 + y,
                  height: 0.5,
                  backgroundColor: Colors.border,
                  opacity: 0.6,
                }}
              />
            ))}
            {[-60, 0, 60].map((x) => (
              <View
                key={`v${x}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: screenWidth / 2 - 20 + x,
                  width: 0.5,
                  backgroundColor: Colors.border,
                  opacity: 0.6,
                }}
              />
            ))}

            {/* Pin */}
            <PinIcon size={36} />

            {/* Coordinates chip */}
            <View
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                backgroundColor: 'rgba(26,17,8,0.85)',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: SERIF,
                  fontSize: 9,
                  color: Colors.creamMuted,
                  letterSpacing: 1,
                }}
              >
                TAP TO DROP PIN
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Lock it in — sticky bottom button ─────────────────────────── */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 20,
          borderTopWidth: 0.5,
          borderTopColor: Colors.border,
          backgroundColor: Colors.background,
        }}
      >
        <Pressable
          style={({ pressed }) => ({
            backgroundColor: Colors.amber,
            borderRadius: 12,
            paddingVertical: 18,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
            opacity: pressed ? 0.82 : 1,
          })}
          onPress={() => {
            // TODO: submit guess
          }}
        >
          <Text
            style={{
              fontFamily: SERIF_BOLD,
              fontSize: 18,
              color: Colors.background,
              letterSpacing: 0.3,
            }}
          >
            lock it in
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.background,
              opacity: 0.75,
            }}
          >
            ◆
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
