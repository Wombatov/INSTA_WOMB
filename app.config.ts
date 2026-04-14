import type { ExpoConfig } from 'expo/config';

/** `react-native-mmkv` подключён как зависимость; отдельный config plugin в текущей версии не требуется. */

const config: ExpoConfig = {
  name: 'CaptionCraft',
  slug: 'captioncraft',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'captioncraft',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.captioncraft.app',
    /** Клавиатура уменьшает окно — кнопки редактора остаются доступны при ScrollView. */
    softwareKeyboardLayoutMode: 'resize',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    permissions: ['android.permission.VIBRATE'],
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-dev-client',
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    'expo-font',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: '56295f7f-fb26-46ec-8baf-2791a40f90e3',
    },
  },
};

export default config;
