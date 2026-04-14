// NativeWind v4: без этого в release/EAS className не компилируется → «белый экран».
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: './global.css',
  configPath: './tailwind.config.ts',
});
