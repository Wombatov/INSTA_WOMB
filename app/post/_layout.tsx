import { Stack } from 'expo-router';

import { useThemeColors } from '@/hooks/use-theme-colors';

export default function PostStackLayout() {
  const theme = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.bg.primary },
        headerTintColor: theme.text.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.bg.primary },
      }}
    />
  );
}
