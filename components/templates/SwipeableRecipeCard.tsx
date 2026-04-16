import { ChevronRight, Trash2 } from 'lucide-react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { Recipe } from '@/types';
import { hapticsDeleteHeavy } from '@/utils/haptics';

const DELETE_WIDTH = 72;
const SPRING = { damping: 20, stiffness: 300 };

function formatUsageLine(count: number): string {
  const n = Math.max(0, count);
  const mod10 = n % 10;
  const mod100 = n % 100;
  let suffix = 'раз';
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) {
      suffix = 'раз';
    } else if (mod10 >= 2 && mod10 <= 4) {
      suffix = 'раза';
    }
  }
  return `Использовано ${n} ${suffix}`;
}

export interface SwipeableRecipeCardProps {
  item: Recipe;
  onPress: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

export const SwipeableRecipeCard = memo<SwipeableRecipeCardProps>(
  ({ item, onPress, onDelete }) => {
    const theme = useThemeColors();
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const resetPosition = useCallback(() => {
      translateX.value = withSpring(0, SPRING);
    }, [translateX]);

    const confirmDelete = useCallback(() => {
      Alert.alert(
        'Удалить рецепт?',
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

    const usageLabel = useMemo(
      () => formatUsageLine(item.usageCount),
      [item.usageCount]
    );

    const cardInner = (
      <Pressable
        onPress={() => onPress(item)}
        accessibilityRole="button"
        accessibilityLabel={`Открыть рецепт ${item.name}`}
        className="min-h-[72px] flex-row items-center justify-between rounded-xl px-3 py-3"
        style={{ backgroundColor: theme.bg.secondary }}
      >
        <View className="flex-1 flex-row items-center gap-2 pr-2">
          <AppText variant="sectionTitle">{item.emoji}</AppText>
          <View className="min-w-0 flex-1">
            <View className="flex-row items-center gap-1">
              <AppText variant="bodyMedium" className="flex-shrink" numberOfLines={1}>
                {item.name}
              </AppText>
              <ChevronRight size={18} color={theme.text.tertiary} strokeWidth={1.8} />
            </View>
            <AppText variant="caption" color={theme.text.secondary} numberOfLines={1}>
              {item.description}
            </AppText>
            <AppText variant="caption" color={theme.text.tertiary} className="mt-0.5">
              {usageLabel}
            </AppText>
          </View>
        </View>
      </Pressable>
    );

    if (item.isBuiltIn) {
      return <View className="mb-2">{cardInner}</View>;
    }

    return (
      <View className="mb-2 overflow-hidden rounded-xl">
        <View
          className="absolute bottom-0 right-0 top-0 justify-center"
          style={{
            width: DELETE_WIDTH,
            backgroundColor: theme.status.danger,
          }}
        >
          <Pressable
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel={`Удалить рецепт ${item.name}`}
            className="min-h-12 min-w-12 flex-1 items-center justify-center"
          >
            <Trash2 size={22} color={theme.text.inverse} strokeWidth={1.8} />
          </Pressable>
        </View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>{cardInner}</Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

SwipeableRecipeCard.displayName = 'SwipeableRecipeCard';
