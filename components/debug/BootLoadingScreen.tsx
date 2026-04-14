import React, { memo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';

export const BootLoadingScreen = memo(() => {
  return (
    <View
      accessibilityLabel="Загрузка приложения"
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: Colors.bg.primary,
      }}
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
