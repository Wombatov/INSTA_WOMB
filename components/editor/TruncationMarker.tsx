import React, { memo, useCallback } from 'react';
import { Pressable, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { countInstagramChars, INSTAGRAM_LIMITS } from '@/utils/instagramLimits';

import { AppText } from '@/components/ui/AppText';
import { useSettingsStore } from '@/store/settingsStore';

export interface TruncationMarkerProps {
  text: string;
}

export const TruncationMarker = memo<TruncationMarkerProps>(({ text }) => {
  const charLen = countInstagramChars(text);
  const visible = charLen > INSTAGRAM_LIMITS.CAPTION_TRUNCATE;
  const tooltipSeen = useSettingsStore(
    (s) => s.settings.truncationMarkerTooltipSeen ?? false
  );
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const showTooltipBubble = visible && !tooltipSeen;

  const dismissTooltip = useCallback(() => {
    updateSettings({ truncationMarkerTooltipSeen: true });
  }, [updateSettings]);

  if (!visible) {
    return null;
  }

  return (
    <View className="my-2">
      {showTooltipBubble ? (
        <View
          className="mb-2 rounded-xl px-3 py-2"
          style={{ backgroundColor: Colors.bg.elevated }}
        >
          <AppText variant="caption" color={Colors.text.secondary} className="mb-2">
            В ленте Instagram после {INSTAGRAM_LIMITS.CAPTION_TRUNCATE} символов подпись
            сворачивается с «ещё». Выше — зона, видимая без нажатия.
          </AppText>
          <Pressable
            onPress={dismissTooltip}
            accessibilityRole="button"
            accessibilityLabel="Закрыть подсказку про обрезку подписи"
            className="min-h-12 min-w-12 items-start justify-center"
          >
            <AppText variant="label" color={Colors.accent.primary}>
              Понятно
            </AppText>
          </Pressable>
        </View>
      ) : null}

      <View className="flex-row items-center gap-2">
        <View
          className="h-px flex-1"
          style={{ backgroundColor: Colors.accent.primary, opacity: 0.5 }}
        />
        <AppText
          variant="caption"
          color={Colors.accent.primary}
          style={{ opacity: 0.5 }}
          accessibilityRole="text"
        >
          ──── 👁 видно без &apos;ещё&apos; ────
        </AppText>
        <View
          className="h-px flex-1"
          style={{ backgroundColor: Colors.accent.primary, opacity: 0.5 }}
        />
      </View>
    </View>
  );
});

TruncationMarker.displayName = 'TruncationMarker';
