import { type Href, router } from 'expo-router';
import { PenLine, Plus } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SwipeableRecipeCard } from '@/components/templates/SwipeableRecipeCard';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/colors';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { RecipeFilter } from '@/store/templatesStore';
import { useRecipesStore } from '@/store/templatesStore';
import type { Recipe } from '@/types';

const FILTER_CHIPS: { key: RecipeFilter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'announce', label: '📣 Анонс' },
  { key: 'story', label: '💬 История' },
  { key: 'sale', label: '🔥 Продажа' },
  { key: 'edu', label: '📚 Обучение' },
  { key: 'engage', label: '🤝 Вовлечение' },
  { key: 'personal', label: '✨ Личное' },
  { key: 'mine', label: '⚙️ Мои' },
];

export default function RecipesScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const theme = useThemeColors();
  const filterByCategory = useRecipesStore((s) => s.filterByCategory);
  const deleteUserRecipe = useRecipesStore((s) => s.deleteUserRecipe);

  const [filter, setFilter] = useState<RecipeFilter>('all');

  const list = useMemo(() => filterByCategory(filter), [filter, filterByCategory]);

  const openCreate = useCallback(() => {
    router.push('/templates/create' as Href);
  }, []);

  const openApply = useCallback((recipe: Recipe) => {
    router.push({
      pathname: '/templates/apply',
      params: { recipeId: recipe.id },
    } as Href);
  }, []);

  const handleDelete = useCallback(
    (recipe: Recipe) => {
      deleteUserRecipe(recipe.id);
    },
    [deleteUserRecipe]
  );

  const renderItem = useCallback(
    ({ item }: { item: Recipe }) => (
      <SwipeableRecipeCard item={item} onPress={openApply} onDelete={handleDelete} />
    ),
    [handleDelete, openApply]
  );

  const keyExtractor = useCallback((item: Recipe) => item.id, []);

  const emptyMine = filter === 'mine' && list.length === 0;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.bg.primary }}
      edges={['top']}
    >
      <View className="flex-row items-center justify-between px-4 pb-3 pt-1">
        <AppText variant="sectionTitle">Рецепты</AppText>
        <Pressable
          onPress={openCreate}
          accessibilityRole="button"
          accessibilityLabel="Создать рецепт"
          className="min-h-12 min-w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: theme.accent.subtle }}
        >
          <Plus size={24} color={theme.accent.primary} strokeWidth={1.8} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-14 flex-grow-0 px-4 pb-3"
        contentContainerStyle={{ gap: 8, alignItems: 'center', paddingRight: 16 }}
      >
        {FILTER_CHIPS.map((chip) => {
          const active = filter === chip.key;
          return (
            <Pressable
              key={chip.key}
              onPress={() => setFilter(chip.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Фильтр ${chip.label}`}
              className="min-h-10 justify-center rounded-full px-3 py-2"
              style={{
                backgroundColor: active ? theme.accent.primary : theme.bg.secondary,
              }}
            >
              <AppText
                variant="caption"
                color={active ? Colors.light.bg.primary : theme.text.primary}
              >
                {chip.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="flex-1 px-4">
        <FlatList
          data={list}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={
            list.length === 0
              ? {
                  flexGrow: 1,
                  minHeight: Math.max(320, windowHeight * 0.5),
                  justifyContent: 'center',
                }
              : { paddingBottom: 24 }
          }
          ListEmptyComponent={
            emptyMine ? (
              <EmptyState
                icon={PenLine}
                title="Нет своих рецептов"
                description="Создай структуру под свой стиль"
              />
            ) : (
              <EmptyState
                icon={PenLine}
                title="Нет рецептов"
                description="Выбери другую категорию или создай свой рецепт"
              />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}
