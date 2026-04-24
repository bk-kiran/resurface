import { View, Text, FlatList, TouchableOpacity, Dimensions, StatusBar, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display'
import * as MediaLibrary from 'expo-media-library'

const { width: SW, height: SH } = Dimensions.get('window')

const YEARS = Array.from({ length: 35 }, (_, i) => String(2026 - i))
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const PICKER_ITEM_W = SW / 3

export default function PlayScreen() {
  const insets = useSafeAreaInsets()
  const [selectedYear, setSelectedYear] = useState('2023')
  const [selectedMonth, setSelectedMonth] = useState('JAN')
  const [photo, setPhoto] = useState<MediaLibrary.Asset | null>(null)
  const [photoLocation, setPhotoLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [photoDate, setPhotoDate] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      const { granted } = await MediaLibrary.requestPermissionsAsync()
      if (!granted) return
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        first: 100,
        sortBy: 'creationTime',
      })
      const withLocation = assets.filter((a) => (a as any).location != null)
      const pool = withLocation.length > 0 ? withLocation : assets
      if (pool.length === 0) return
      const asset = pool[Math.floor(Math.random() * pool.length)]
      const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id)
      setPhoto({ ...asset, uri: assetInfo.localUri ?? assetInfo.uri })
      const loc = (asset as any).location ?? assetInfo.location
      if (loc) setPhotoLocation(loc)
      setPhotoDate(asset.creationTime)
    })()
  }, [])

  const [fontsLoaded] = useFonts({ PlayfairDisplay_700Bold, PlayfairDisplay_400Regular_Italic })
  if (!fontsLoaded) return null

  const HEADER_H = insets.top + 48
  const POLAROID_H = SH * 0.30
  const PICKER_H = 48
  const MAP_H = 80
  const BUTTON_H = 52
  const PADDING_BOTTOM = insets.bottom + 8

  // Everything except header and bottom button
  const MIDDLE_H = SH - HEADER_H - POLAROID_H - BUTTON_H - PADDING_BOTTOM - 16

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1108' }}>
      <StatusBar barStyle="light-content" />

      {/* HEADER - fixed at top */}
      <View style={{
        height: HEADER_H,
        paddingTop: insets.top,
        borderBottomWidth: 1,
        borderBottomColor: '#E8A830',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{
          color: '#E8A830',
          fontSize: 13,
          letterSpacing: 3,
          fontFamily: 'PlayfairDisplay_700Bold'
        }}>RESURFACE</Text>
      </View>

      {/* POLAROID - fixed height */}
      <View style={{
        height: POLAROID_H,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8
      }}>
        {/* Back cards */}
        <View style={{
          position: 'absolute',
          width: SW * 0.62,
          height: POLAROID_H - 10,
          backgroundColor: '#E8E0D0',
          borderRadius: 4,
          transform: [{ rotate: '-4deg' }],
          top: 8, left: SW * 0.15
        }} />
        <View style={{
          position: 'absolute',
          width: SW * 0.62,
          height: POLAROID_H - 10,
          backgroundColor: '#EDE6D6',
          borderRadius: 4,
          transform: [{ rotate: '3deg' }],
          top: 4, left: SW * 0.15
        }} />
        {/* Top card */}
        <View style={{
          width: SW * 0.65,
          height: POLAROID_H - 4,
          backgroundColor: '#F5F0E8',
          borderRadius: 4,
          padding: 8,
          paddingBottom: 28,
        }}>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={{ flex: 1, borderRadius: 2 }} resizeMode="cover" />
          ) : (
            <View style={{ flex: 1, backgroundColor: '#2A3A4A', borderRadius: 2 }} />
          )}
          <Text style={{
            position: 'absolute',
            bottom: 8,
            left: 12,
            color: '#9C8E7A',
            fontSize: 11,
            fontFamily: 'PlayfairDisplay_400Regular_Italic'
          }}>{photoDate ? new Date(photoDate).getFullYear().toString() : 'Untitled Memory'}</Text>
        </View>
      </View>

      {/* MIDDLE SECTION - fixed height, no flex, no scroll */}
      <View style={{
        height: MIDDLE_H,
        paddingHorizontal: 20,
        justifyContent: 'space-evenly'
      }}>

        {/* When was this label */}
        <Text style={{
          color: '#F0E6D0',
          fontSize: 11,
          letterSpacing: 3,
          textAlign: 'center'
        }}>WHEN WAS THIS?</Text>

        {/* Year picker */}
        <FlatList
          data={YEARS}
          horizontal
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          snapToInterval={PICKER_ITEM_W}
          decelerationRate="fast"
          style={{ height: PICKER_H, flexGrow: 0 }}
          getItemLayout={(_, index) => ({ length: PICKER_ITEM_W, offset: PICKER_ITEM_W * index, index })}
          renderItem={({ item }) => {
            const isSelected = item === selectedYear
            const dist = Math.abs(YEARS.indexOf(item) - YEARS.indexOf(selectedYear))
            return (
              <TouchableOpacity
                style={{ width: PICKER_ITEM_W, height: PICKER_H, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setSelectedYear(item)}
              >
                <Text style={{
                  fontFamily: 'PlayfairDisplay_700Bold',
                  fontSize: isSelected ? 32 : 20,
                  color: isSelected ? '#E8A830' : dist === 1 ? '#9C8E7A' : '#3D2E1A',
                }}>{item}</Text>
              </TouchableOpacity>
            )
          }}
        />

        {/* Month picker */}
        <FlatList
          data={MONTHS}
          horizontal
          keyExtractor={i => i}
          showsHorizontalScrollIndicator={false}
          snapToInterval={PICKER_ITEM_W}
          decelerationRate="fast"
          style={{ height: PICKER_H, flexGrow: 0 }}
          getItemLayout={(_, index) => ({ length: PICKER_ITEM_W, offset: PICKER_ITEM_W * index, index })}
          renderItem={({ item }) => {
            const isSelected = item === selectedMonth
            const dist = Math.abs(MONTHS.indexOf(item) - MONTHS.indexOf(selectedMonth))
            return (
              <TouchableOpacity
                style={{ width: PICKER_ITEM_W, height: PICKER_H, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setSelectedMonth(item)}
              >
                <Text style={{
                  fontFamily: 'PlayfairDisplay_700Bold',
                  fontSize: isSelected ? 28 : 18,
                  color: isSelected ? '#E8A830' : dist === 1 ? '#9C8E7A' : '#3D2E1A',
                }}>{item}</Text>
              </TouchableOpacity>
            )
          }}
        />

        {/* Where were you label */}
        <Text style={{
          color: '#F0E6D0',
          fontSize: 11,
          letterSpacing: 3,
          textAlign: 'center'
        }}>WHERE WERE YOU?</Text>

        {/* Map placeholder */}
        <View style={{
          height: MAP_H,
          backgroundColor: '#251A0E',
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ fontSize: 24 }}>📍</Text>
          <Text style={{
            color: '#9C8E7A',
            fontSize: 9,
            letterSpacing: 2,
            marginTop: 4
          }}>TAP TO DROP PIN</Text>
        </View>

      </View>

      {/* LOCK IT IN BUTTON - always at bottom, never moves */}
      <View style={{
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 8
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#E8A830',
            borderRadius: 12,
            height: BUTTON_H,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => router.push({
            pathname: '/reveal',
            params: {
              guessMonth: selectedMonth,
              guessYear: selectedYear,
              actualLat: photoLocation?.latitude ?? 42.3601,
              actualLng: photoLocation?.longitude ?? -71.0589,
              actualDate: photoDate ?? Date.now(),
            },
          })}
        >
          <Text style={{
            color: '#1A1108',
            fontFamily: 'PlayfairDisplay_700Bold',
            fontSize: 13,
            letterSpacing: 2
          }}>lock it in ◆</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}
