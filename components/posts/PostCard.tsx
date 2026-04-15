import { Check, Copy } from 'lucide-react-native';
import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { TextStyles } from '@/constants/typography';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { Post } from '@/types';
import { formatRelativePostDate } from '@/utils/relativeTime';
import { INSTAGRAM_LIMITS } from '@/utils/instagramLimits';
import { hapticsToggle } from '@/utils/haptics';

import { AppText } from '@/components/ui/AppText';
import { usePostsStore } from '@/store/postsStore';

export interface PostCardProps {
  post: Post;
  onPress: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

const SPRING = { damping: 18, stiffness: 320 };

export const PostCard = memo<PostCardProps>(
  ({ post, onPress, onCopy, onDelete: _onDelete }) => {
    const theme = useThemeColors();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.98, SPRING);
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, SPRING);
    }, [scale]);

    const isDraft = post.status === 'draft';

    const toggleStatus = useCallback(() => {
      void hapticsToggle();
      const next: Post['status'] = isDraft ? 'published' : 'draft';
      usePostsStore.getState().updatePost(post.id, { status: next });
    }, [isDraft, post.id]);

    const dateLabel = formatRelativePostDate(post.updatedAt);

    void _onDelete;

    const statusLabel = isDraft ? 'Черновик' : 'Выложен';
    const statusA11y = isDraft
      ? 'Переключить на выложен'
      : 'Переключить на черновик';

    return (
      <Animated.View
        className="rounded-xl px-3 py-3"
        style={[
          animatedStyle,
          { backgroundColor: theme.bg.secondary, minHeight: 80 },
        ]}
      >
        <View className="mb-2 flex-row items-center gap-2">
          <Pressable
            onPress={toggleStatus}
            accessibilityRole="button"
            accessibilityLabel={statusA11y}
            accessibilityHint="Меняет статус поста между черновиком и выложенным"
            className="min-h-12 flex-row items-center justify-center rounded-md px-2 py-1"
            style={{
              backgroundColor: isDraft
                ? theme.bg.tertiary
                : 'rgba(34, 197, 94, 0.22)',
            }}
          >
            {isDraft ? (
              <AppText variant="caption" color={theme.text.secondary}>
                {statusLabel}
              </AppText>
            ) : (
              <View className="flex-row items-center gap-1">
                <Check
                  size={14}
                  color={theme.status.ok}
                  strokeWidth={2.5}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
                <AppText variant="caption" style={{ color: theme.status.ok }}>
                  {statusLabel}
                </AppText>
              </View>
            )}
          </Pressable>
          <View className="min-w-0 flex-1" />
          <AppText variant="caption" color={theme.text.tertiary}>
            {dateLabel}
          </AppText>
          <Pressable
            onPress={onCopy}
            accessibilityRole="button"
            accessibilityLabel="Копировать текст поста"
            className="min-h-12 min-w-12 items-center justify-center"
          >
            <Copy size={18} color={theme.text.secondary} strokeWidth={1.8} />
          </Pressable>
        </View>

        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={`Пост ${post.title || 'без названия'}, ${isDraft ? 'черновик' : 'выложен'}`}
        >
          <Text
            className="mb-2 text-[15px] leading-[22px]"
            style={{ color: theme.text.primary }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {post.content}
          </Text>

          <View className="flex-row items-center gap-2">
            <View
              className="rounded-md px-2 py-0.5"
              style={{ backgroundColor: theme.bg.tertiary }}
            >
              <Text style={[TextStyles.counter, { color: theme.text.secondary }]}>
                #{post.hashtagCount}/{INSTAGRAM_LIMITS.HASHTAG_MAX}
              </Text>
            </View>
            <AppText variant="caption" color={theme.text.tertiary}>
              ·
            </AppText>
            <View
              className="rounded-md px-2 py-0.5"
              style={{ backgroundColor: theme.bg.tertiary }}
            >
              <Text style={[TextStyles.counter, { color: theme.text.secondary }]}>
                {post.charCount}/{INSTAGRAM_LIMITS.CAPTION_MAX}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

PostCard.displayName = 'PostCard';
