import * as Clipboard from 'expo-clipboard';
import { type Href, router } from 'expo-router';
import { ArrowUpDown, Check } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';

import type { Post, SortOrder } from '@/types';

import { useThemeColors } from '@/hooks/use-theme-colors';

import { PostList } from '@/components/posts/PostList';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SearchBar } from '@/components/ui/SearchBar';
import { AppText } from '@/components/ui/AppText';
import { useToast } from '@/hooks/useToast';
import {
  computeFilteredPosts,
  normalizeSortOrder,
  usePostsStore,
} from '@/store/postsStore';
import { hapticsCopy, hapticsDeleteHeavy, hapticsToggle } from '@/utils/haptics';

const SORT_OPTIONS: { id: SortOrder; label: string }[] = [
  { id: 'newest', label: 'Новые сначала' },
  { id: 'oldest', label: 'Старые сначала' },
  { id: 'draftsFirst', label: 'Черновики сначала' },
];

function sortLabel(order: SortOrder): string {
  const found = SORT_OPTIONS.find((o) => o.id === order);
  return found?.label ?? 'Новые сначала';
}

type PostStatusFilter = 'all' | 'draft' | 'published';

const FILTER_CHIPS: { id: PostStatusFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'draft', label: 'Черновики' },
  { id: 'published', label: 'Выложены' },
];

export default function HomeScreen() {
  const theme = useThemeColors();
  const { searchQuery, sortOrder, allPosts } = usePostsStore(
    useShallow((s) => ({
      searchQuery: s.searchQuery,
      sortOrder: s.sortOrder,
      allPosts: s.posts,
    }))
  );

  const effectiveSort = useMemo(
    () => normalizeSortOrder(sortOrder),
    [sortOrder]
  );

  const [postFilter, setPostFilter] = useState<PostStatusFilter>('all');

  const basePosts = useMemo(
    () => computeFilteredPosts(allPosts, searchQuery, sortOrder),
    [allPosts, searchQuery, sortOrder]
  );

  const posts = useMemo(() => {
    switch (postFilter) {
      case 'draft':
        return basePosts.filter((p) => p.status === 'draft');
      case 'published':
        return basePosts.filter((p) => p.status === 'published');
      default:
        return basePosts;
    }
  }, [basePosts, postFilter]);

  const setSearchQuery = useCallback((query: string) => {
    usePostsStore.getState().setSearchQuery(query);
  }, []);

  const setSortOrder = useCallback((order: SortOrder) => {
    usePostsStore.getState().setSortOrder(order);
  }, []);

  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 250);
  }, []);

  const openSortSheet = useCallback(() => {
    void hapticsToggle();
    setSortSheetOpen(true);
  }, []);

  const selectSort = useCallback(
    (order: SortOrder) => {
      void hapticsToggle();
      setSortOrder(order);
      setSortSheetOpen(false);
    },
    [setSortOrder]
  );

  const onPostPress = useCallback((post: Post) => {
    router.push(`/post/${post.id}` as Href);
  }, []);

  const onPostCopy = useCallback(
    async (post: Post) => {
      await Clipboard.setStringAsync(post.content);
      await hapticsCopy();
      showToast({ message: 'Скопировано в буфер', variant: 'success' });
    },
    [showToast]
  );

  const onPostDelete = useCallback(
    (post: Post) => {
      void hapticsDeleteHeavy();
      usePostsStore.getState().deletePost(post.id);
      showToast({ message: 'Пост удалён', variant: 'info' });
    },
    [showToast]
  );

  const sortHint = useMemo(() => sortLabel(effectiveSort), [effectiveSort]);

  const emptySearch =
    allPosts.length > 0 &&
    searchQuery.trim().length > 0 &&
    basePosts.length === 0;

  const emptyFilter =
    allPosts.length > 0 &&
    basePosts.length > 0 &&
    posts.length === 0 &&
    postFilter !== 'all';

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.bg.primary }}
      edges={['top']}
    >
      <View className="flex-row items-center justify-between px-4 pb-2 pt-1">
        <AppText variant="sectionTitle">Посты</AppText>
        <Pressable
          onPress={openSortSheet}
          accessibilityRole="button"
          accessibilityLabel={`Сортировка: ${sortHint}`}
          accessibilityHint="Открывает выбор порядка постов"
          className="min-h-12 min-w-12 items-center justify-center"
        >
          <ArrowUpDown size={22} color={theme.accent.primary} strokeWidth={1.8} />
        </Pressable>
      </View>

      <View className="px-4 pb-2">
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        className="pb-2"
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 4,
        }}
      >
        {FILTER_CHIPS.map((chip) => {
          const active = postFilter === chip.id;
          return (
            <Pressable
              key={chip.id}
              onPress={() => {
                void hapticsToggle();
                setPostFilter(chip.id);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Фильтр: ${chip.label}`}
              className="justify-center rounded-full px-3.5 py-2"
              style={{
                minHeight: 44,
                backgroundColor: active
                  ? theme.accent.subtle
                  : theme.bg.secondary,
                borderWidth: 1,
                borderColor: active ? theme.accent.primary : theme.border.subtle,
              }}
            >
              <AppText
                variant="caption"
                className="font-medium"
                style={{
                  color: active ? theme.accent.primary : theme.text.secondary,
                }}
              >
                {chip.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="flex-1 px-4">
        <PostList
          posts={posts}
          emptySearch={emptySearch}
          emptyFilter={emptyFilter}
          onPostPress={onPostPress}
          onPostCopy={onPostCopy}
          onPostDelete={onPostDelete}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>

      <BottomSheet
        isVisible={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        title="Сортировка"
      >
        {SORT_OPTIONS.map((opt) => {
          const active = effectiveSort === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => selectSort(opt.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={opt.label}
              className="min-h-12 flex-row items-center justify-between rounded-xl px-3 py-3"
              style={{
                backgroundColor: active ? theme.bg.secondary : 'transparent',
              }}
            >
              <AppText
                variant="bodyMedium"
                color={active ? theme.accent.primary : theme.text.primary}
              >
                {opt.label}
              </AppText>
              {active ? (
                <Check
                  size={22}
                  color={theme.accent.primary}
                  strokeWidth={2.2}
                  accessibilityElementsHidden
                />
              ) : (
                <View className="h-[22px] w-[22px]" />
              )}
            </Pressable>
          );
        })}
      </BottomSheet>
    </SafeAreaView>
  );
}
