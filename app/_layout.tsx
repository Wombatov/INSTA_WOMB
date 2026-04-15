import '../global.css';

import {
  Syne_500Medium,
  Syne_700Bold,
} from '@expo-google-fonts/syne';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  type Href,
  Stack,
  useRouter,
  useRootNavigationState,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { BootLoadingScreen } from '@/components/debug/BootLoadingScreen';
import { RootErrorBoundary } from '@/components/debug/RootErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useSettingsStore } from '@/store/settingsStore';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useThemeColors();

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme.bg.primary }}
    >
      <RootErrorBoundary>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <ToastProvider>
            <RootNavigation />
            <StatusBar style="auto" />
          </ToastProvider>
        </ThemeProvider>
      </RootErrorBoundary>
    </GestureHandlerRootView>
  );
}

function RootNavigation() {
  const [fontsLoaded] = useFonts({
    'Syne-Bold': Syne_700Bold,
    'Syne-Medium': Syne_500Medium,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-SemiBold': DMSans_600SemiBold,
    'DMMono-Regular': DMMono_400Regular,
  });

  const [hydrated, setHydrated] = useState(() =>
    useSettingsStore.persist.hasHydrated()
  );

  useEffect(() => {
    const finish = (): void => {
      setHydrated(true);
    };
    const unsub = useSettingsStore.persist.onFinishHydration(finish);
    if (useSettingsStore.persist.hasHydrated()) {
      finish();
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const onboardingComplete = useSettingsStore(
    (s) => s.settings.onboardingComplete ?? false
  );
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!fontsLoaded || !hydrated || !navigationState?.key) {
      return;
    }
    const root = segments[0] as string | undefined;
    const inOnboarding = root === 'onboarding';
    if (!onboardingComplete && !inOnboarding) {
      router.replace('/onboarding' as Href);
    } else if (onboardingComplete && inOnboarding) {
      router.replace('/(tabs)' as Href);
    }
  }, [
    fontsLoaded,
    hydrated,
    navigationState?.key,
    onboardingComplete,
    router,
    segments,
  ]);

  if (!fontsLoaded || !hydrated) {
    return <BootLoadingScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
