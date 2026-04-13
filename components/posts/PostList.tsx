import { FileText } from 'lucide-react-native';
import React, { memo, useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import type { Post } from '@/types';

import { EmptyState } from '@/components/ui/EmptyState';

import { SwipeablePost } from './SwipeablePost';

export interface PostListProps {
  posts: Post[];
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
          title="Пока нет постов"
          description="Создай первый пост на вкладке редактора."
        />
      ),
      []
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
