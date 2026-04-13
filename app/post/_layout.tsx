import { Stack } from 'expo-router';

import { Colors } from '@/constants/colors';

export default function PostStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.bg.primary },
        headerTintColor: Colors.text.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.bg.primary },
      }}
    />
  );
}
