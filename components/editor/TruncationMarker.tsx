import React, { memo, useCallback } from 'react';
import { Pressable, View } from 'react-native';

import {
  countInstagramChars,
  INSTAGRAM_LIMITS,
} from '@/utils/instagramLimits';

import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useSettingsStore } from '@/store/settingsStore';

export interface TruncationMarkerProps {
  text: string;
}

export const TruncationMarker = memo<TruncationMarkerProps>(({ text }) => {
  const theme = useThemeColors();
  const charLen = countInstagramChars(text);
  const limit = INSTAGRAM_LIMITS.CAPTION_TRUNCATE;
  const tooltipSeen = useSettingsStore(
    (s) => s.settings.truncationMarkerTooltipSeen ?? false
  );
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const dismissTooltip = useCallback(() => {
    updateSettings({ truncationMarkerTooltipSeen: true });
  }, [updateSettings]);

  const showTooltipBubble = charLen > limit && !tooltipSeen;
  const showFoldUi = charLen > 0;

  if (!showFoldUi) {
    return null;
  }

  const foldRatio = Math.min(charLen / limit, 1);
  const overFold = charLen > limit;

  return (
    <View className="my-2">
      {showTooltipBubble ? (
        <View
          className="mb-3 rounded-xl border px-3 py-2"
          style={{
            backgroundColor: theme.bg.elevated,
            borderColor: theme.border.focus,
          }}
        >
          <AppText variant="caption" color={theme.text.secondary} className="mb-2">
            В ленте Instagram после {limit} символов подпись сворачивается с «ещё».
            Полоса ниже показывает, какая доля текста уместится до «ещё».
          </AppText>
          <Pressable
            onPress={dismissTooltip}
            accessibilityRole="button"
            accessibilityLabel="Закрыть подсказку про обрезку подписи"
            className="min-h-12 min-w-12 items-start justify-center"
          >
            <AppText variant="label" color={theme.accent.primary}>
              Понятно
            </AppText>
          </Pressable>
        </View>
      ) : null}

      <View className="mb-2">
        <View className="mb-1 flex-row items-center justify-between">
          <AppText variant="caption" color={theme.text.secondary}>
            В ленту без «ещё»
          </AppText>
          <AppText
            variant="caption"
            color={overFold ? theme.status.warning : theme.accent.light}
          >
            {charLen} / {limit}
          </AppText>
        </View>
        <View
          className="h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: theme.bg.tertiary }}
          accessibilityRole="progressbar"
          accessibilityValue={{
            min: 0,
            max: limit,
            now: Math.min(charLen, limit),
            text: `${Math.min(charLen, limit)} из ${limit} символов до свёртки`,
          }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${foldRatio * 100}%`,
              backgroundColor: overFold
                ? theme.status.warning
                : theme.accent.primary,
            }}
          />
        </View>
        {overFold ? (
          <AppText variant="caption" color={theme.status.warning} className="mt-1">
            Лимит «ещё» пройден — в ленте текст после {limit}-го символа скрыт
          </AppText>
        ) : null}
      </View>

      <View
        className="flex-row items-center gap-2 py-1"
        style={{ opacity: overFold ? 1 : 0.85 }}
      >
        <View
          className="flex-1"
          style={{ height: 2, backgroundColor: theme.accent.light }}
        />
        <AppText
          variant="label"
          color={theme.text.primary}
          accessibilityRole="text"
        >
          👁 видно без «ещё»
        </AppText>
        <View
          className="flex-1"
          style={{ height: 2, backgroundColor: theme.accent.light }}
        />
      </View>
    </View>
  );
});

TruncationMarker.displayName = 'TruncationMarker';
