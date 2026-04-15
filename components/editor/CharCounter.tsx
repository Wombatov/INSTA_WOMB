import React, { memo, useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { CaptionCharStatus } from '@/hooks/useCharCounter';
import { useCharCounter } from '@/hooks/useCharCounter';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { INSTAGRAM_LIMITS } from '@/utils/instagramLimits';

import { AppText } from '@/components/ui/AppText';

function statusColor(
  status: CaptionCharStatus,
  statusPalette: ReturnType<typeof useThemeColors>['status']
): string {
  switch (status) {
    case 'ok':
      return statusPalette.ok;
    case 'warning':
      return statusPalette.warning;
    case 'danger':
      return statusPalette.danger;
    case 'error':
      return statusPalette.error;
  }
}

export interface CharCounterProps {
  text: string;
}

export const CharCounter = memo<CharCounterProps>(({ text }) => {
  const theme = useThemeColors();
  const { charCount, hashtagCount, status } = useCharCounter(text);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (status === 'warning' || status === 'danger') {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.55, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = 1;
    }
  }, [opacity, status]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const color = statusColor(status, theme.status);

  const label = `[#${hashtagCount}/${INSTAGRAM_LIMITS.HASHTAG_MAX}] · [${charCount}/${INSTAGRAM_LIMITS.CAPTION_MAX}]`;

  return (
    <Animated.View
      style={pulseStyle}
      accessibilityRole="text"
      accessibilityLabel={`Хэштеги ${hashtagCount} из ${INSTAGRAM_LIMITS.HASHTAG_MAX}, символов ${charCount} из ${INSTAGRAM_LIMITS.CAPTION_MAX}`}
    >
      <AppText variant="counter" color={color} className="text-right">
        {label}
      </AppText>
    </Animated.View>
  );
});

CharCounter.displayName = 'CharCounter';
