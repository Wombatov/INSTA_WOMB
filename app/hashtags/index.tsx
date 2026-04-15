import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';

import type { HashtagSet } from '@/types';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { HashtagSetEditorSheet } from '@/components/hashtags/HashtagSetEditorSheet';
import { SwipeableHashtagSetCard } from '@/components/hashtags/SwipeableHashtagSetCard';
import { AppText } from '@/components/ui/AppText';
import { useHashtagsStore } from '@/store/hashtagsStore';

export const options = {
  title: 'Наборы хэштегов',
};

export default function HashtagsScreen() {
  const theme = useThemeColors();
  const router = useRouter();
  const sets = useHashtagsStore((s) => s.sets);
  const deleteSet = useHashtagsStore((s) => s.deleteSet);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<HashtagSet | null>(null);

  const sortedSets = useMemo(
    () => [...sets].sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    [sets]
  );

  const openCreate = useCallback(() => {
    setEditingSet(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((set: HashtagSet) => {
    setEditingSet(set);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setEditingSet(null);
  }, []);

  const handleDelete = useCallback(
    (set: HashtagSet) => {
      deleteSet(set.id);
    },
    [deleteSet]
  );

  const renderItem = useCallback(
    ({ item }: { item: HashtagSet }) => (
      <SwipeableHashtagSetCard
        item={item}
        onPress={openEdit}
        onDelete={handleDelete}
      />
    ),
    [handleDelete, openEdit]
  );

  const keyExtractor = useCallback((item: HashtagSet) => item.id, []);

  const canGoBack = router.canGoBack();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.bg.primary }}
      edges={['top']}
    >
      <View className="flex-row items-center px-4 pb-3 pt-1">
        <View className="w-12 items-start justify-center">
          {canGoBack ? (
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Назад"
              className="min-h-12 min-w-12 items-center justify-center"
            >
              <ChevronLeft
                size={28}
                color={theme.text.primary}
                strokeWidth={1.8}
              />
            </Pressable>
          ) : (
            <View className="min-h-12 min-w-12" />
          )}
        </View>
        <View className="min-w-0 flex-1 px-1">
          <AppText variant="sectionTitle" className="text-center" numberOfLines={1}>
            Наборы хэштегов
          </AppText>
        </View>
        <View className="w-12 items-end justify-center">
          <Pressable
            onPress={openCreate}
            accessibilityRole="button"
            accessibilityLabel="Добавить набор хэштегов"
            className="min-h-12 min-w-12 items-center justify-center"
          >
            <Plus size={26} color={theme.accent.primary} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <View className="flex-1 px-4">
        <FlatList
          data={sortedSets}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            sortedSets.length === 0
              ? { flexGrow: 1, paddingBottom: 24 }
              : { paddingBottom: 24 }
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center py-16">
              <AppText
                variant="body"
                color={theme.text.secondary}
                className="text-center"
              >
                Нет наборов хэштегов
              </AppText>
            </View>
          }
        />
      </View>

      <HashtagSetEditorSheet
        isVisible={sheetOpen}
        onClose={closeSheet}
        editingSet={editingSet}
      />
    </SafeAreaView>
  );
}
