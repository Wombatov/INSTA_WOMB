import React, { memo, useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Colors } from '@/constants/colors';

import { AppText } from '@/components/ui/AppText';

export interface SelectionRange {
  start: number;
  end: number;
}

export interface QuickInsertProps {
  text: string;
  selection: SelectionRange;
  onChangeText: (next: string) => void;
}

const ITEMS = [
  { key: 'nl', label: '↵ Пустая строка', insert: '\n\n' },
  { key: 'dot', label: '• Точка', insert: '• ' },
  { key: 'spark', label: '✨', insert: '✨' },
  { key: 'dizzy', label: '💫', insert: '💫' },
  { key: 'fire', label: '🔥', insert: '🔥' },
  { key: 'heart', label: '❤️', insert: '❤️' },
] as const;

function insertAtSelection(
  base: string,
  selection: SelectionRange,
  fragment: string
): string {
  const { start, end } = selection;
  return base.slice(0, start) + fragment + base.slice(end);
}

export const QuickInsert = memo<QuickInsertProps>(
  ({ text, selection, onChangeText }) => {
    const insert = useCallback(
      (fragment: string) => {
        onChangeText(insertAtSelection(text, selection, fragment));
      },
      [onChangeText, selection, text]
    );

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="h-10 max-h-10"
      >
        <View className="flex-row items-center gap-2 px-1">
          {ITEMS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => insert(item.insert)}
              className="h-10 shrink-0 items-center justify-center rounded-lg px-2"
              style={{ backgroundColor: Colors.bg.tertiary }}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <AppText variant="caption" color={Colors.text.primary}>
                {item.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    );
  }
);

QuickInsert.displayName = 'QuickInsert';
