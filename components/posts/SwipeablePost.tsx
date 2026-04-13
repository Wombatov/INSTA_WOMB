import { Trash2 } from 'lucide-react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Colors } from '@/constants/colors';
import type { Post } from '@/types';

import { PostCard, type PostCardProps } from './PostCard';

const DELETE_WIDTH = 72;
const SPRING = { damping: 20, stiffness: 300 };

export interface SwipeablePostProps
  extends Omit<PostCardProps, 'post' | 'onDelete'> {
  post: Post;
  onDelete: () => void;
}

export const SwipeablePost = memo<SwipeablePostProps>(
  ({ post, onPress, onCopy, onDelete }) => {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const resetPosition = useCallback(() => {
      translateX.value = withSpring(0, SPRING);
    }, [translateX]);

    const confirmDelete = useCallback(() => {
      Alert.alert(
        'Удалить пост?',
        'Его нельзя будет восстановить.',
        [
          { text: 'Отмена', style: 'cancel', onPress: resetPosition },
          {
            text: 'Удалить',
            style: 'destructive',
            onPress: () => {
              resetPosition();
              onDelete();
            },
          },
        ]
      );
    }, [onDelete, resetPosition]);

    const panGesture = useMemo(
      () =>
        Gesture.Pan()
          .activeOffsetX([-24, 24])
          .failOffsetY([-18, 18])
          .onStart(() => {
            startX.value = translateX.value;
          })
          .onUpdate((e) => {
            const next = startX.value + e.translationX;
            if (next > 0) {
              translateX.value = 0;
              return;
            }
            translateX.value = Math.max(-DELETE_WIDTH, Math.min(0, next));
          })
          .onEnd(() => {
            const threshold = DELETE_WIDTH / 2;
            if (translateX.value < -threshold) {
              translateX.value = withSpring(-DELETE_WIDTH, SPRING);
            } else {
              translateX.value = withSpring(0, SPRING);
            }
          }),
      []
    );

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    return (
      <View className="overflow-hidden rounded-xl">
        <View
          className="absolute bottom-0 right-0 top-0 justify-center"
          style={{ width: DELETE_WIDTH }}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel="Удалить пост"
            className="h-full w-full items-center justify-center rounded-xl"
            style={{ backgroundColor: Colors.status.error }}
          >
            <Trash2 size={24} color={Colors.text.primary} strokeWidth={1.8} />
          </Pressable>
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle} className="rounded-xl">
            <PostCard
              post={post}
              onPress={onPress}
              onCopy={onCopy}
              onDelete={onDelete}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

SwipeablePost.displayName = 'SwipeablePost';
