import React from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';

export const options = {
  title: 'Хэштеги',
};

export default function HashtagsScreen() {
  return (
    <View className="flex-1 items-center justify-center px-4">
      <AppText variant="body" className="text-center">
        Экран наборов хэштегов в разработке.
      </AppText>
    </View>
  );
}
