import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Refsurface',
  slug: 'resurface',
  scheme: 'refsurface',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#121212',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.refsurface.app',
    infoPlist: {
      // Required by Mapbox SDK on iOS
      MGLMapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '',
    },
  },
  android: {
    package: 'com.refsurface.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#121212',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-sqlite',
    'expo-font',
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsUseV11: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
