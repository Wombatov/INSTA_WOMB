import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecipeHighlightedText } from '@/components/recipes/RecipeHighlightedText';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { useToast } from '@/hooks/useToast';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useRecipesStore } from '@/store/templatesStore';
import type { RecipeCategory } from '@/types';

const CATEGORY_CHIPS: { key: RecipeCategory; label: string }[] = [
  { key: 'announce', label: '📣 Анонс' },
  { key: 'story', label: '💬 История' },
  { key: 'sale', label: '🔥 Продажа' },
  { key: 'edu', label: '📚 Обучение' },
  { key: 'engage', label: '🤝 Вовлечение' },
  { key: 'personal', label: '✨ Личное' },
];

const CATEGORY_EMOJI: Record<RecipeCategory, string> = {
  announce: '🚀',
  story: '💬',
  sale: '🔥',
  engage: '🤝',
  edu: '📚',
  personal: '✨',
  custom: '📝',
};

export default function CreateRecipeScreen() {
  const theme = useThemeColors();
  const createUserRecipe = useRecipesStore((s) => s.createUserRecipe);
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('announce');
  const [content, setContent] = useState('');

  const nameOk = useMemo(() => Array.from(name.trim()).length >= 3, [name]);
  const contentOk = useMemo(
    () => Array.from(content.trim()).length >= 20,
    [content]
  );
  const canSave = nameOk && contentOk;

  const onCancel = useCallback(() => {
    router.back();
  }, []);

  const onSave = useCallback(() => {
    if (!canSave) {
      return;
    }
    try {
      createUserRecipe({
        name: name.trim(),
        emoji: CATEGORY_EMOJI[category],
        category,
        description: '',
        content: content.trim(),
        tags: [],
      });
      showToast({ message: 'Рецепт сохранён', variant: 'success' });
      router.back();
    } catch {
      showToast({ message: 'Не удалось сохранить рецепт', variant: 'error' });
    }
  }, [canSave, category, content, createUserRecipe, name, showToast]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.bg.primary }}
      edges={['top']}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View
          className="flex-row items-center justify-between border-b px-4 py-3"
          style={{ borderColor: theme.border.subtle }}
        >
          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Отмена"
            className="min-h-12 min-w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: theme.bg.secondary }}
          >
            <AppText variant="bodyMedium" color={theme.accent.primary}>
              Отмена
            </AppText>
          </Pressable>
          <AppText variant="sectionTitle" className="flex-1 text-center">
            Новый рецепт
          </AppText>
          <View className="min-h-12 min-w-12" />
        </View>

        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <AppText variant="label" color={theme.text.secondary} className="mb-1 mt-3">
            Название
          </AppText>
          <TextInput
            className="mb-4 rounded-xl px-3 py-3 text-[15px] leading-[22px]"
            style={{
              color: theme.text.primary,
              backgroundColor: theme.bg.secondary,
            }}
            value={name}
            onChangeText={setName}
            placeholder="Например: Мой формат анонса"
            placeholderTextColor={theme.text.tertiary}
            accessibilityLabel="Название рецепта"
          />

          <AppText variant="label" color={theme.text.secondary} className="mb-2">
            Категория
          </AppText>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {CATEGORY_CHIPS.map((chip) => {
              const active = category === chip.key;
              return (
                <Pressable
                  key={chip.key}
                  onPress={() => setCategory(chip.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
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
          </View>

          <AppText variant="label" color={theme.text.secondary} className="mb-1">
            Структура поста
          </AppText>
          <TextInput
            className="mb-2 min-h-[160px] rounded-xl px-3 py-3 text-[15px] leading-[22px]"
            style={{
              color: theme.text.primary,
              backgroundColor: theme.bg.secondary,
              textAlignVertical: 'top',
            }}
            multiline
            value={content}
            onChangeText={setContent}
            placeholder="Вставь абзацы и [подсказки в скобках]"
            placeholderTextColor={theme.text.tertiary}
            accessibilityLabel="Структура поста рецепта"
          />
          <AppText variant="caption" color={theme.text.tertiary} className="mb-4 leading-5">
            Используй [скобки] для мест, которые будешь менять в каждом посте. Например: [название
            продукта], [цена], [дата]
          </AppText>

          <AppText variant="label" color={theme.text.secondary} className="mb-1">
            Превью
          </AppText>
          <View
            className="mb-6 rounded-xl px-3 py-3"
            style={{ backgroundColor: theme.bg.secondary }}
          >
            <RecipeHighlightedText text={content} />
          </View>

          <Button
            label="Сохранить рецепт"
            onPress={onSave}
            variant="primary"
            disabled={!canSave}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
