import React, { memo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-colors';

export const BootLoadingScreen = memo(() => {
  const theme = useThemeColors();
  return (
    <View
      accessibilityLabel="Загрузка приложения"
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: theme.bg.primary,
      }}
    >
      <ActivityIndicator size="large" color={theme.accent.primary} />
      <Text
        style={{
          marginTop: 20,
          color: theme.text.secondary,
          fontSize: 16,
          textAlign: 'center',
        }}
      >
        INstaWomb
      </Text>
      <Text
        style={{
          marginTop: 8,
          color: theme.text.tertiary,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Загрузка…
      </Text>
    </View>
  );
});

BootLoadingScreen.displayName = 'BootLoadingScreen';
