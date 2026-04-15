import { router, type Href } from 'expo-router';
import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-colors';
import type { HashtagSet } from '@/types';
import { formatHashtags } from '@/utils/textFormatter';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { AppText } from '@/components/ui/AppText';
import { useHashtagsStore } from '@/store/hashtagsStore';

export interface HashtagSetPickerProps {
  isVisible: boolean;
  onClose: () => void;
  postText: string;
  onChangePostText: (text: string) => void;
}

function appendHashtagSetToPost(existing: string, set: HashtagSet): string {
  const block = formatHashtags(set.hashtags);
  if (!block) {
    return existing;
  }
  if (existing.length === 0) {
    return block;
  }
  const needsGap = !/\s$/.test(existing) && !existing.endsWith('\n');
  const sep = needsGap ? '\n' : '';
  return `${existing}${sep}${block}`;
}

function previewLine(set: HashtagSet): string {
  const shown = set.hashtags.slice(0, 3).map((h) => (h.startsWith('#') ? h : `#${h}`));
  const rest = Math.max(0, set.hashtags.length - 3);
  const head = shown.join(' ');
  if (rest > 0) {
    return `${head} …ещё ${rest}`;
  }
  return head;
}

export const HashtagSetPicker = memo<HashtagSetPickerProps>(
  ({ isVisible, onClose, postText, onChangePostText }) => {
    const theme = useThemeColors();
    const sets = useHashtagsStore((s) => s.sets);

    const sortedSets = useMemo(
      () => [...sets].sort((a, b) => a.name.localeCompare(b.name, 'ru')),
      [sets]
    );

    const onPickSet = useCallback(
      (set: HashtagSet) => {
        onChangePostText(appendHashtagSetToPost(postText, set));
        onClose();
      },
      [onChangePostText, onClose, postText]
    );

    const goNewSet = useCallback(() => {
      onClose();
      router.push('/hashtags' as Href);
    }, [onClose]);

    const renderItem = useCallback(
      ({ item }: { item: HashtagSet }) => (
        <Pressable
          onPress={() => onPickSet(item)}
          className="mb-2 rounded-xl px-3 py-3"
          style={{ backgroundColor: theme.bg.secondary }}
          accessibilityRole="button"
          accessibilityLabel={`Вставить набор ${item.name}`}
        >
          <AppText variant="bodyMedium" color={theme.text.primary} className="mb-1">
            {item.name}
          </AppText>
          <AppText variant="caption" color={theme.text.secondary} numberOfLines={2}>
            {previewLine(item)}
          </AppText>
        </Pressable>
      ),
      [onPickSet, theme]
    );

    const keyExtractor = useCallback((item: HashtagSet) => item.id, []);

    return (
      <BottomSheet isVisible={isVisible} onClose={onClose} title="Наборы хэштегов">
        <FlatList
          data={sortedSets}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={{ maxHeight: 400 }}
          nestedScrollEnabled
          ListEmptyComponent={
            <AppText variant="body" color={theme.text.secondary} className="py-4 text-center">
              Пока нет сохранённых наборов
            </AppText>
          }
          ListFooterComponent={
            <View className="mt-2 pb-2">
              <Pressable
                onPress={goNewSet}
                className="min-h-12 items-center justify-center rounded-xl py-3"
                style={{ backgroundColor: theme.accent.subtle }}
                accessibilityRole="button"
                accessibilityLabel="Создать новый набор хэштегов"
              >
                <AppText variant="bodyMedium" color={theme.accent.light}>
                  + Новый набор
                </AppText>
              </Pressable>
            </View>
          }
        />
      </BottomSheet>
    );
  }
);

HashtagSetPicker.displayName = 'HashtagSetPicker';
