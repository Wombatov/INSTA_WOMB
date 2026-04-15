import React, { memo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/hooks/use-theme-colors';

const ITEMS = [
  { key: 'nl', label: '↵ Пустая строка', insert: '\n\n' },
  { key: 'dot', label: '• Точка', insert: '• ' },
  { key: 'spark', label: '✨', insert: '✨' },
  { key: 'dizzy', label: '💫', insert: '💫' },
  { key: 'fire', label: '🔥', insert: '🔥' },
  { key: 'heart', label: '❤️', insert: '❤️' },
] as const;

export interface QuickInsertProps {
  /** Вставка фрагмента: родитель обновляет текст и позицию каретки. */
  onInsert: (fragment: string) => void;
}

export const QuickInsert = memo<QuickInsertProps>(({ onInsert }) => {
  const theme = useThemeColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      className="h-10 max-h-10"
    >
      <View className="flex-row items-center gap-2 px-1">
        {ITEMS.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => onInsert(item.insert)}
            className="h-10 shrink-0 items-center justify-center rounded-lg px-2"
            style={{ backgroundColor: theme.bg.tertiary }}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <AppText variant="caption" color={theme.text.primary}>
              {item.label}
            </AppText>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
});

QuickInsert.displayName = 'QuickInsert';
