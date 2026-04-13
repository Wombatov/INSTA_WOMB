import React, { memo, useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/colors';
import type { CaptionCharStatus } from '@/hooks/useCharCounter';
import { useCharCounter } from '@/hooks/useCharCounter';
import { INSTAGRAM_LIMITS } from '@/utils/instagramLimits';

import { AppText } from '@/components/ui/AppText';

function statusColor(status: CaptionCharStatus): string {
  switch (status) {
    case 'ok':
      return Colors.status.ok;
    case 'warning':
      return Colors.status.warning;
    case 'danger':
      return Colors.status.danger;
    case 'error':
      return Colors.status.error;
  }
}

export interface CharCounterProps {
  text: string;
}

export const CharCounter = memo<CharCounterProps>(({ text }) => {
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

  const color = statusColor(status);

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
