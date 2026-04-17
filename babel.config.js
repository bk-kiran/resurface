module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      // NativeWind v4: exports a preset (not a plugin) — must be in presets[]
      'nativewind/babel',
    ],
    plugins: [
      // Reanimated plugin must be listed last
      'react-native-reanimated/plugin',
    ],
  };
};
