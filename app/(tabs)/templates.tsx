import { type Href, router } from 'expo-router';
import { Layout as LayoutIcon, Plus } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PostTemplate } from '@/types';

import { ApplyTemplateSheet } from '@/components/templates/ApplyTemplateSheet';
import { SwipeableTemplateCard } from '@/components/templates/SwipeableTemplateCard';
import { TemplateEditorSheet } from '@/components/templates/TemplateEditorSheet';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { usePostsStore } from '@/store/postsStore';
import { useTemplatesStore } from '@/store/templatesStore';

export default function TemplatesTabScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const theme = useThemeColors();
  const templates = useTemplatesStore((s) => s.templates);
  const deleteTemplate = useTemplatesStore((s) => s.deleteTemplate);
  const createPost = usePostsStore((s) => s.createPost);

  const [editorOpen, setEditorOpen] = useState(false);
  const [applyTemplate, setApplyTemplate] = useState<PostTemplate | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  const sorted = useMemo(
    () =>
      [...templates].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [templates]
  );

  const openCreate = useCallback(() => {
    setEditorOpen(true);
  }, []);

  const openApply = useCallback((t: PostTemplate) => {
    setApplyTemplate(t);
    setApplyOpen(true);
  }, []);

  const closeApply = useCallback(() => {
    setApplyOpen(false);
    setApplyTemplate(null);
  }, []);

  const onCompleteApply = useCallback(
    (resolvedText: string) => {
      const post = createPost(resolvedText);
      router.push(`/post/${post.id}` as Href);
    },
    [createPost]
  );

  const handleDelete = useCallback(
    (t: PostTemplate) => {
      deleteTemplate(t.id);
    },
    [deleteTemplate]
  );

  const renderItem = useCallback(
    ({ item }: { item: PostTemplate }) => (
      <SwipeableTemplateCard
        item={item}
        onPress={openApply}
        onDelete={handleDelete}
      />
    ),
    [handleDelete, openApply]
  );

  const keyExtractor = useCallback((item: PostTemplate) => item.id, []);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.bg.primary }}
      edges={['top']}
    >
      <View className="flex-row items-center justify-between px-4 pb-3 pt-1">
        <AppText variant="sectionTitle">Шаблоны</AppText>
        <Pressable
          onPress={openCreate}
          accessibilityRole="button"
          accessibilityLabel="Создать шаблон"
          className="min-h-12 min-w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: theme.accent.subtle }}
        >
          <Plus size={24} color={theme.accent.primary} strokeWidth={1.8} />
        </Pressable>
      </View>

      <View className="flex-1 px-4">
        <FlatList
          data={sorted}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={
            sorted.length === 0
              ? {
                  flexGrow: 1,
                  minHeight: Math.max(320, windowHeight * 0.55),
                  justifyContent: 'center',
                }
              : { paddingBottom: 24 }
          }
          ListEmptyComponent={
            <EmptyState
              icon={LayoutIcon}
              title="Нет шаблонов"
              description="Создай шаблон для быстрого написания однотипных постов"
            />
          }
        />
      </View>

      <TemplateEditorSheet isVisible={editorOpen} onClose={() => setEditorOpen(false)} />

      <ApplyTemplateSheet
        template={applyTemplate}
        isVisible={applyOpen && applyTemplate !== null}
        onClose={closeApply}
        onComplete={onCompleteApply}
      />
    </SafeAreaView>
  );
}
