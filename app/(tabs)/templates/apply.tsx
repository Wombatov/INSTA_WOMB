import { type Href, router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CharCounter } from '@/components/editor/CharCounter';
import { RecipeHighlightedText } from '@/components/recipes/RecipeHighlightedText';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { usePostsStore } from '@/store/postsStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useRecipesStore } from '@/store/templatesStore';
import { hapticsSaveSuccess } from '@/utils/haptics';

export default function ApplyRecipeScreen() {
  const theme = useThemeColors();
  const params = useLocalSearchParams<{ recipeId?: string | string[] }>();
  const recipeId = Array.isArray(params.recipeId)
    ? params.recipeId[0]
    : params.recipeId;
  const getAllRecipes = useRecipesStore((s) => s.getAllRecipes);
  const incrementUsage = useRecipesStore((s) => s.incrementUsage);
  const createPost = usePostsStore((s) => s.createPost);
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const { showToast } = useToast();

  const recipe = useMemo(() => {
    if (recipeId == null || recipeId === '') {
      return undefined;
    }
    return getAllRecipes().find((r) => r.id === recipeId);
  }, [getAllRecipes, recipeId]);

  const [text, setText] = useState('');
  const [recipesHydrated, setRecipesHydrated] = useState(() =>
    useRecipesStore.persist.hasHydrated()
  );

  useEffect(() => {
    const done = (): void => {
      setRecipesHydrated(true);
    };
    const unsub = useRecipesStore.persist.onFinishHydration(done);
    if (useRecipesStore.persist.hasHydrated()) {
      done();
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (recipe) {
      setText(recipe.content);
    }
  }, [recipe]);

  useEffect(() => {
    if (!recipesHydrated) {
      return;
    }
    if (recipeId == null || recipeId === '') {
      showToast({ message: 'Рецепт не выбран', variant: 'error' });
      router.back();
      return;
    }
    if (!recipe) {
      showToast({ message: 'Рецепт не найден', variant: 'error' });
      router.back();
    }
  }, [recipe, recipeId, recipesHydrated, showToast]);

  const hintDismissed = settings.recipeHintShown === true;

  const dismissHint = useCallback(() => {
    updateSettings({ recipeHintShown: true });
  }, [updateSettings]);

  const onClose = useCallback(() => {
    router.back();
  }, []);

  const onCreatePost = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      showToast({ message: 'Введите текст поста', variant: 'error' });
      return;
    }
    if (!recipe) {
      return;
    }
    try {
      createPost(trimmed);
      incrementUsage(recipe.id);
      void hapticsSaveSuccess();
      showToast({ message: 'Пост создан', variant: 'success' });
      router.replace('/(tabs)/' as Href);
    } catch {
      showToast({ message: 'Не удалось создать пост', variant: 'error' });
    }
  }, [createPost, incrementUsage, recipe, showToast, text]);

  if (!recipe) {
    return null;
  }

  const headerTitle = `${recipe.emoji} ${recipe.name}`;

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
          <AppText variant="sectionTitle" className="flex-1 pr-2" numberOfLines={2}>
            {headerTitle}
          </AppText>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Закрыть"
            className="min-h-12 min-w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: theme.bg.secondary }}
          >
            <X size={22} color={theme.text.primary} strokeWidth={1.8} />
          </Pressable>
        </View>

        {!hintDismissed ? (
          <View
            className="mx-4 mt-3 flex-row items-start gap-2 rounded-xl px-3 py-2"
            style={{
              backgroundColor: theme.bg.secondary,
              borderWidth: 1,
              borderColor: theme.border.subtle,
            }}
          >
            <AppText variant="caption" color={theme.text.secondary} className="flex-1">
              Замени текст в [скобках] своим содержимым
            </AppText>
            <Pressable
              onPress={dismissHint}
              accessibilityRole="button"
              accessibilityLabel="Закрыть подсказку"
              className="min-h-10 min-w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: theme.bg.tertiary }}
            >
              <X size={18} color={theme.text.tertiary} strokeWidth={1.8} />
            </Pressable>
          </View>
        ) : null}

        <ScrollView
          className="flex-shrink px-4 pt-3"
          style={{ maxHeight: 200 }}
          keyboardShouldPersistTaps="handled"
        >
          <AppText variant="label" color={theme.text.secondary} className="mb-1">
            Превью с подсветкой
          </AppText>
          <View
            className="rounded-xl px-3 py-3"
            style={{ backgroundColor: theme.bg.secondary }}
          >
            <RecipeHighlightedText text={text} />
          </View>
        </ScrollView>

        <View className="flex-1 px-4 pb-2 pt-2">
          <AppText variant="label" color={theme.text.secondary} className="mb-1">
            Текст поста
          </AppText>
          <TextInput
            className="flex-1 rounded-xl px-3 py-3 text-[15px] leading-[22px]"
            style={{
              color: theme.text.primary,
              backgroundColor: theme.bg.secondary,
              textAlignVertical: 'top',
              minHeight: 160,
            }}
            multiline
            scrollEnabled
            value={text}
            onChangeText={setText}
            placeholder="Редактируй текст здесь…"
            placeholderTextColor={theme.text.tertiary}
            accessibilityLabel="Редактирование текста рецепта"
          />
        </View>

        <View
          className="flex-row items-center justify-between border-t px-4 py-3"
          style={{
            borderColor: theme.border.subtle,
            backgroundColor: theme.bg.elevated,
          }}
        >
          <CharCounter text={text} />
          <View className="min-w-[160px] shrink-0">
            <Button label="Создать пост →" onPress={onCreatePost} variant="primary" size="sm" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
