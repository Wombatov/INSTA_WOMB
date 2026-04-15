import { FileText } from 'lucide-react-native';
import React, { memo, useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import type { Post } from '@/types';

import { EmptyState } from '@/components/ui/EmptyState';

import { SwipeablePost } from './SwipeablePost';

export interface PostListProps {
  posts: Post[];
  /** Посты есть, но поиск ничего не нашёл (иначе — пустой список постов) */
  emptySearch: boolean;
  /** Выбран фильтр черновик/выложены, но под него нет постов (при этом посты вообще есть) */
  emptyFilter?: boolean;
  onPostPress: (post: Post) => void;
  onPostCopy: (post: Post) => void;
  onPostDelete: (post: Post) => void;
  /** Вызывается при pull-to-refresh (например, повторная сортировка по дате в сторе) */
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
}

export const PostList = memo<PostListProps>(
  ({
    posts,
    emptySearch,
    emptyFilter = false,
    onPostPress,
    onPostCopy,
    onPostDelete,
    onRefresh,
    refreshing = false,
  }) => {
    const renderItem = useCallback(
      ({ item }: { item: Post }) => (
        <SwipeablePost
          post={item}
          onPress={() => onPostPress(item)}
          onCopy={() => onPostCopy(item)}
          onDelete={() => onPostDelete(item)}
        />
      ),
      [onPostCopy, onPostDelete, onPostPress]
    );

    const keyExtractor = useCallback((item: Post) => item.id, []);

    const separator = useCallback(
      () => <View style={{ height: 8 }} />,
      []
    );

    const empty = useCallback(
      () => (
        <EmptyState
          icon={FileText}
          title={
            emptySearch
              ? 'Ничего не найдено'
              : emptyFilter
                ? 'Нет таких постов'
                : 'Ещё нет постов'
          }
          description={
            emptySearch
              ? 'Ничего не найдено по запросу'
              : emptyFilter
                ? 'Смените фильтр или создайте пост с нужным статусом'
                : 'Ещё нет постов. Напиши первый!'
          }
        />
      ),
      [emptyFilter, emptySearch]
    );

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlatList
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={separator}
          ListEmptyComponent={empty}
          contentContainerStyle={posts.length === 0 ? { flexGrow: 1 } : undefined}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        />
      </GestureHandlerRootView>
    );
  }
);

PostList.displayName = 'PostList';
