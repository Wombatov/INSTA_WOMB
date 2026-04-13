import { Copy } from 'lucide-react-native';
import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Colors } from '@/constants/colors';
import { TextStyles } from '@/constants/typography';
import type { Post } from '@/types';
import { formatRelativePostDate } from '@/utils/relativeTime';
import { INSTAGRAM_LIMITS } from '@/utils/instagramLimits';

import { AppText } from '@/components/ui/AppText';

export interface PostCardProps {
  post: Post;
  onPress: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

const SPRING = { damping: 18, stiffness: 320 };

export const PostCard = memo<PostCardProps>(
  ({ post, onPress, onCopy, onDelete: _onDelete }) => {
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

    const badgeBg = isDraft
      ? 'rgba(234, 179, 8, 0.22)'
      : 'rgba(34, 197, 94, 0.22)';
    const badgeFg = isDraft ? '#FACC15' : Colors.status.ok;

    const dateLabel = formatRelativePostDate(post.updatedAt);

    void _onDelete;

    return (
      <Animated.View
        className="rounded-xl px-3 py-3"
        style={[
          animatedStyle,
          { backgroundColor: Colors.bg.secondary, minHeight: 80 },
        ]}
      >
        <View className="mb-2 flex-row items-center gap-2">
          <View
            className="rounded-md px-2 py-0.5"
            style={{ backgroundColor: badgeBg }}
          >
            <AppText variant="caption" style={{ color: badgeFg }}>
              {isDraft ? 'Черновик' : 'Опубликован'}
            </AppText>
          </View>
          <View className="min-w-0 flex-1" />
          <AppText variant="caption" color={Colors.text.tertiary}>
            {dateLabel}
          </AppText>
          <Pressable
            onPress={onCopy}
            accessibilityRole="button"
            accessibilityLabel="Копировать текст поста"
            className="min-h-12 min-w-12 items-center justify-center"
          >
            <Copy size={18} color={Colors.text.secondary} strokeWidth={1.8} />
          </Pressable>
        </View>

        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={`Пост ${post.title || 'без названия'}, ${isDraft ? 'черновик' : 'опубликован'}`}
        >
          <Text
            className="mb-2 text-[15px] leading-[22px]"
            style={{ color: Colors.text.primary }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {post.content}
          </Text>

          <View className="flex-row items-center gap-2">
            <View
              className="rounded-md px-2 py-0.5"
              style={{ backgroundColor: Colors.bg.tertiary }}
            >
              <Text style={[TextStyles.counter, { color: Colors.text.secondary }]}>
                #{post.hashtagCount}/{INSTAGRAM_LIMITS.HASHTAG_MAX}
              </Text>
            </View>
            <AppText variant="caption" color={Colors.text.tertiary}>
              ·
            </AppText>
            <View
              className="rounded-md px-2 py-0.5"
              style={{ backgroundColor: Colors.bg.tertiary }}
            >
              <Text style={[TextStyles.counter, { color: Colors.text.secondary }]}>
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
