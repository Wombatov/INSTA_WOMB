import * as Clipboard from 'expo-clipboard';
import { type Href, router } from 'expo-router';
import { ArrowUpDown } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';

import { Colors } from '@/constants/colors';
import type { Post, SortOrder } from '@/types';

import { PostList } from '@/components/posts/PostList';
import { SearchBar } from '@/components/ui/SearchBar';
import { AppText } from '@/components/ui/AppText';
import { useToast } from '@/hooks/useToast';
import { computeFilteredPosts, usePostsStore } from '@/store/postsStore';
import { hapticsCopy, hapticsDeleteHeavy } from '@/utils/haptics';

function nextSortOrder(current: SortOrder): SortOrder {
  switch (current) {
    case 'newest':
      return 'oldest';
    case 'oldest':
      return 'alphabetical';
    case 'alphabetical':
      return 'newest';
  }
}

function sortLabel(order: SortOrder): string {
  switch (order) {
    case 'newest':
      return 'Сначала новые';
    case 'oldest':
      return 'Сначала старые';
    case 'alphabetical':
      return 'По алфавиту';
  }
}

export default function HomeScreen() {
  const { searchQuery, sortOrder, allPosts } = usePostsStore(
    useShallow((s) => ({
      searchQuery: s.searchQuery,
      sortOrder: s.sortOrder,
      allPosts: s.posts,
    }))
  );

  const posts = useMemo(
    () => computeFilteredPosts(allPosts, searchQuery, sortOrder),
    [allPosts, searchQuery, sortOrder]
  );

  const setSearchQuery = useCallback((query: string) => {
    usePostsStore.getState().setSearchQuery(query);
  }, []);

  const setSortOrder = useCallback((order: SortOrder) => {
    usePostsStore.getState().setSortOrder(order);
  }, []);

  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSortOrder('newest');
    setTimeout(() => setRefreshing(false), 250);
  }, [setSortOrder]);

  const cycleSort = useCallback(() => {
    setSortOrder(nextSortOrder(sortOrder));
  }, [setSortOrder, sortOrder]);

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

  const sortHint = useMemo(() => sortLabel(sortOrder), [sortOrder]);

  const emptySearch =
    allPosts.length > 0 &&
    searchQuery.trim().length > 0 &&
    posts.length === 0;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.bg.primary }}
      edges={['top']}
    >
      <View className="flex-row items-center justify-between px-4 pb-2 pt-1">
        <AppText variant="sectionTitle">Посты</AppText>
        <Pressable
          onPress={cycleSort}
          accessibilityRole="button"
          accessibilityLabel={`Сортировка: ${sortHint}. Нажмите, чтобы сменить`}
          className="min-h-12 flex-row items-center gap-1"
        >
          <ArrowUpDown size={22} color={Colors.accent.primary} strokeWidth={1.8} />
          <AppText variant="caption" color={Colors.text.secondary}>
            {sortHint}
          </AppText>
        </Pressable>
      </View>

      <View className="px-4 pb-2">
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      <View className="flex-1 px-4">
        <PostList
          posts={posts}
          emptySearch={emptySearch}
          onPostPress={onPostPress}
          onPostCopy={onPostCopy}
          onPostDelete={onPostDelete}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </SafeAreaView>
  );
}
