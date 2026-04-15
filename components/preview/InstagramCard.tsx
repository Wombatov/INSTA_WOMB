import React, { memo, useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Bookmark,
  Heart,
  Hexagon,
  MoreHorizontal,
  Send,
  UserRound,
} from 'lucide-react-native';

import { CaptionPreview } from './CaptionPreview';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useSettingsStore } from '@/store/settingsStore';

export interface InstagramCardProps {
  text: string;
}

export const InstagramCard = memo<InstagramCardProps>(({ text }) => {
  const theme = useThemeColors();
  const username = useSettingsStore((s) => s.settings.username);
  const [layoutMode, setLayoutMode] = useState<'full' | 'clipped'>('clipped');
  const [captionExpanded, setCaptionExpanded] = useState(false);

  const isExpanded = layoutMode === 'full' || captionExpanded;
  const suppressCollapseHint = layoutMode === 'full';

  const onCaptionToggle = useCallback(() => {
    if (layoutMode === 'clipped') {
      setCaptionExpanded((prev) => !prev);
    }
  }, [layoutMode]);

  const setMode = useCallback((mode: 'full' | 'clipped') => {
    setLayoutMode(mode);
    setCaptionExpanded(false);
  }, []);

  const iconColor = theme.text.primary;

  return (
    <View className="w-full">
      <View className="mb-2 flex-row gap-2">
        <Pressable
          onPress={() => setMode('full')}
          accessibilityRole="button"
          accessibilityLabel="Полный текст подписи"
          accessibilityState={{ selected: layoutMode === 'full' }}
          className="min-h-12 flex-1 items-center justify-center rounded-lg px-3 py-2"
          style={{
            backgroundColor:
              layoutMode === 'full' ? theme.accent.subtle : theme.bg.tertiary,
          }}
        >
          <Text
            style={{
              color:
                layoutMode === 'full' ? theme.accent.light : theme.text.secondary,
              fontWeight: layoutMode === 'full' ? '600' : '400',
            }}
          >
            Полный
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('clipped')}
          accessibilityRole="button"
          accessibilityLabel="Обрезанный текст как в ленте"
          accessibilityState={{ selected: layoutMode === 'clipped' }}
          className="min-h-12 flex-1 items-center justify-center rounded-lg px-3 py-2"
          style={{
            backgroundColor:
              layoutMode === 'clipped' ? theme.accent.subtle : theme.bg.tertiary,
          }}
        >
          <Text
            style={{
              color:
                layoutMode === 'clipped' ? theme.accent.light : theme.text.secondary,
              fontWeight: layoutMode === 'clipped' ? '600' : '400',
            }}
          >
            Обрезан
          </Text>
        </Pressable>
      </View>

      <View
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: theme.instagram.preview_bg }}
      >
        <View className="flex-row items-center justify-between px-3 py-2">
          <View className="flex-row items-center gap-2">
            <View
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: theme.bg.tertiary }}
            >
              <UserRound size={20} color={theme.text.secondary} />
            </View>
            <Text
              style={{
                color: theme.text.primary,
                fontWeight: '600',
              }}
              accessibilityRole="text"
            >
              {username}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ещё действия"
            className="min-h-12 min-w-12 items-center justify-center"
          >
            <MoreHorizontal size={22} color={theme.text.primary} />
          </Pressable>
        </View>

        <View
          className="w-full items-center justify-center"
          style={{
            aspectRatio: 1,
            backgroundColor: theme.bg.secondary,
          }}
          accessibilityRole="image"
          accessibilityLabel="Заглушка изображения поста"
        >
          <Text style={{ fontSize: 48 }}>🖼</Text>
        </View>

        <View className="flex-row items-center justify-between px-3 py-2">
          <View className="flex-row items-center gap-4">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Нравится"
              className="min-h-12 min-w-12 items-center justify-center"
            >
              <Heart size={26} color={iconColor} strokeWidth={1.8} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Комментарии"
              className="min-h-12 min-w-12 items-center justify-center"
            >
              <Hexagon size={26} color={iconColor} strokeWidth={1.8} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Отправить"
              className="min-h-12 min-w-12 items-center justify-center"
            >
              <Send size={26} color={iconColor} strokeWidth={1.8} />
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Сохранить"
            className="min-h-12 min-w-12 items-center justify-center"
          >
            <Bookmark size={26} color={iconColor} strokeWidth={1.8} />
          </Pressable>
        </View>

        <View className="px-3 pb-3">
          <CaptionPreview
            text={text}
            isExpanded={isExpanded}
            onToggle={onCaptionToggle}
            suppressCollapseHint={suppressCollapseHint}
            usernamePrefix={username}
          />
        </View>
      </View>
    </View>
  );
});

InstagramCard.displayName = 'InstagramCard';
