import { Trash2 } from 'lucide-react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { PostTemplate } from '@/types';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { AppText } from '@/components/ui/AppText';
import { hapticsDeleteHeavy } from '@/utils/haptics';

function formatVariableCountRu(count: number): string {
  if (count === 0) {
    return 'Без переменных';
  }
  if (count === 1) {
    return '1 переменная';
  }
  return `${count} переменных`;
}

const DELETE_WIDTH = 72;
const SPRING = { damping: 20, stiffness: 300 };
const PREVIEW_MAX = 140;

export interface SwipeableTemplateCardProps {
  item: PostTemplate;
  onPress: (template: PostTemplate) => void;
  onDelete: (template: PostTemplate) => void;
}

export const SwipeableTemplateCard = memo<SwipeableTemplateCardProps>(
  ({ item, onPress, onDelete }) => {
    const theme = useThemeColors();
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const resetPosition = useCallback(() => {
      translateX.value = withSpring(0, SPRING);
    }, [translateX]);

    const confirmDelete = useCallback(() => {
      Alert.alert(
        'Удалить шаблон?',
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

    const preview = useMemo(() => {
      const t = item.content.trim();
      if (t.length <= PREVIEW_MAX) {
        return t;
      }
      return `${t.slice(0, PREVIEW_MAX)}…`;
    }, [item.content]);

    const varLabel = formatVariableCountRu(item.variables.length);

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
            accessibilityLabel={`Удалить шаблон ${item.name}`}
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
              accessibilityLabel={`Шаблон ${item.name}, ${varLabel}`}
            >
              <AppText
                variant="bodyMedium"
                color={theme.text.primary}
                className="mb-1"
              >
                {item.name}
              </AppText>
              <AppText variant="caption" color={theme.text.secondary} className="mb-2">
                {varLabel}
              </AppText>
              <AppText
                variant="caption"
                color={theme.text.tertiary}
                numberOfLines={3}
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

SwipeableTemplateCard.displayName = 'SwipeableTemplateCard';
