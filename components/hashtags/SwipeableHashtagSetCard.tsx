import { Trash2 } from 'lucide-react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { HashtagSet } from '@/types';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { AppText } from '@/components/ui/AppText';
import { hapticsDeleteHeavy } from '@/utils/haptics';
import { formatHashtags } from '@/utils/textFormatter';

const DELETE_WIDTH = 72;
const SPRING = { damping: 20, stiffness: 300 };

export interface SwipeableHashtagSetCardProps {
  item: HashtagSet;
  onPress: (set: HashtagSet) => void;
  onDelete: (set: HashtagSet) => void;
}

function previewFive(set: HashtagSet): string {
  const slice = set.hashtags.slice(0, 5);
  return formatHashtags(slice);
}

export const SwipeableHashtagSetCard = memo<SwipeableHashtagSetCardProps>(
  ({ item, onPress, onDelete }) => {
    const theme = useThemeColors();
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const resetPosition = useCallback(() => {
      translateX.value = withSpring(0, SPRING);
    }, [translateX]);

    const confirmDelete = useCallback(() => {
      Alert.alert(
        'Удалить набор?',
        `«${item.name}» будет удалён без восстановления.`,
        [
          { text: 'Отмена', style: 'cancel', onPress: resetPosition },
          {
            text: 'Удалить',
            style: 'destructive',
            onPress: () => {
              resetPosition();
              void hapticsDeleteHeavy();
              onDelete(item);
            },
          },
        ]
      );
    }, [item, onDelete, resetPosition]);

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
      [startX, translateX]
    );

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const countLabel = `${item.hashtags.length} хэштегов`;
    const preview = previewFive(item);

    return (
      <View className="mb-3 overflow-hidden rounded-xl">
        <View
          className="absolute bottom-0 right-0 top-0 justify-center"
          style={{ width: DELETE_WIDTH }}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel={`Удалить набор ${item.name}`}
            className="h-full w-full items-center justify-center rounded-xl"
            style={{ backgroundColor: theme.status.error }}
          >
            <Trash2 size={24} color={theme.text.primary} strokeWidth={1.8} />
          </Pressable>
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>
            <Pressable
              onPress={() => onPress(item)}
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: theme.bg.secondary }}
              accessibilityRole="button"
              accessibilityLabel={`Редактировать набор ${item.name}, ${countLabel}`}
            >
              <AppText
                variant="bodyMedium"
                color={theme.text.primary}
                className="mb-1"
              >
                {item.name}
              </AppText>
              <AppText variant="caption" color={theme.text.secondary} className="mb-2">
                {countLabel}
              </AppText>
              <AppText
                variant="caption"
                color={theme.text.tertiary}
                numberOfLines={2}
              >
                {preview.length > 0 ? preview : '—'}
              </AppText>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

SwipeableHashtagSetCard.displayName = 'SwipeableHashtagSetCard';
