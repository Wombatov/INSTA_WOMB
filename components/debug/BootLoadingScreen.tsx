import React, { memo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';

export const BootLoadingScreen = memo(() => {
  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: Colors.bg.primary }}
      accessibilityLabel="Загрузка приложения"
    >
      <ActivityIndicator size="large" color={Colors.accent.primary} />
      <Text
        style={{
          marginTop: 20,
          color: Colors.text.secondary,
          fontSize: 16,
          textAlign: 'center',
        }}
      >
        CaptionCraft
      </Text>
      <Text
        style={{
          marginTop: 8,
          color: Colors.text.tertiary,
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
