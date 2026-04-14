// nativewind/babel — это preset (возвращает { plugins: [...] }), не entry в `plugins`.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', require('nativewind/babel')],
    plugins: ['react-native-reanimated/plugin'],
  };
};
