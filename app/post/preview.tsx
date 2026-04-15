import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { InstagramCard } from '@/components/preview/InstagramCard';
import { AppText } from '@/components/ui/AppText';
import { useToast } from '@/hooks/useToast';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { usePostsStore } from '@/store/postsStore';
import { usePreviewStore } from '@/store/previewStore';
import { hapticsCopy } from '@/utils/haptics';

export default function PostPreviewScreen() {
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();
  const { postId } = useLocalSearchParams<{ postId?: string }>();
  const id = typeof postId === 'string' ? postId : postId?.[0];
  const posts = usePostsStore((s) => s.posts);
  const draftCaption = usePreviewStore((s) => s.draftCaption);

  const text = useMemo(() => {
    if (id) {
      const post = posts.find((p) => p.id === id);
      return post?.content ?? '';
    }
    return draftCaption;
  }, [draftCaption, id, posts]);

  const { showToast } = useToast();

  const copyCaption = async () => {
    if (!text) {
      return;
    }
    await Clipboard.setStringAsync(text);
    await hapticsCopy();
    showToast({ message: 'Подпись скопирована', variant: 'success' });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Превью', headerBackTitle: 'Назад' }} />
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: theme.bg.primary }}
        edges={['bottom']}
      >
        <ScrollView
          className="flex-1 px-4 pt-2"
          contentContainerStyle={{ paddingBottom: 32 + insets.bottom }}
        >
          <InstagramCard text={text} />
          <View className="mt-6">
            <Pressable
              onPress={() => {
                void copyCaption();
              }}
              className="min-h-12 items-center justify-center rounded-xl py-3"
              style={{ backgroundColor: theme.accent.primary }}
              accessibilityRole="button"
              accessibilityLabel="Копировать подпись"
            >
              <AppText variant="bodyMedium" color="#FFFFFF">
                Копировать подпись
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
