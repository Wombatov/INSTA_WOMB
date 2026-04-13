import { type Href, router, Stack, useLocalSearchParams } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '@/constants/colors';
import { CharCounter } from '@/components/editor/CharCounter';
import { HashtagSetPicker } from '@/components/editor/HashtagSetPicker';
import { QuickInsert } from '@/components/editor/QuickInsert';
import { TruncationMarker } from '@/components/editor/TruncationMarker';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useToast } from '@/hooks/useToast';
import { usePostsStore } from '@/store/postsStore';
import { hapticsDeleteHeavy, hapticsSaveSuccess } from '@/utils/haptics';

export default function EditPostScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = typeof rawId === 'string' ? rawId : rawId?.[0];
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  const posts = usePostsStore((s) => s.posts);
  const updatePost = usePostsStore((s) => s.updatePost);
  const deletePost = usePostsStore((s) => s.deletePost);

  const post = posts.find((p) => p.id === id);

  const [text, setText] = useState(post?.content ?? '');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [pickerOpen, setPickerOpen] = useState(false);

  const { showToast } = useToast();
  const { copy, isCopied } = useCopyToClipboard(text);

  useEffect(() => {
    if (post) {
      setText(post.content);
    }
  }, [post]);

  const confirmDelete = useCallback(() => {
    if (!id) {
      return;
    }
    Alert.alert('Удалить пост?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () => {
          void hapticsDeleteHeavy();
          deletePost(id);
          showToast({ message: 'Пост удалён', variant: 'info' });
          router.back();
        },
      },
    ]);
  }, [deletePost, id, showToast]);

  const toggleStatus = useCallback(() => {
    if (!post || !id) {
      return;
    }
    if (post.status === 'draft') {
      updatePost(id, {
        status: 'published',
        publishedAt: new Date().toISOString(),
      });
    } else {
      updatePost(id, { status: 'draft', publishedAt: undefined });
    }
  }, [id, post, updatePost]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row items-center gap-2 pr-1">
          <Pressable
            onPress={toggleStatus}
            accessibilityRole="button"
            accessibilityLabel="Переключить черновик или опубликован"
            className="min-h-10 justify-center rounded-lg px-2 py-1"
            style={{ backgroundColor: Colors.bg.tertiary }}
          >
            <AppText variant="caption" color={Colors.text.primary}>
              {post?.status === 'published' ? 'Опубликован' : 'Черновик'}
            </AppText>
          </Pressable>
          <Pressable
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel="Удалить пост"
            className="min-h-12 min-w-12 items-center justify-center"
          >
            <Trash2 size={22} color={Colors.status.error} strokeWidth={1.8} />
          </Pressable>
        </View>
      ),
    });
  }, [confirmDelete, navigation, post?.status, toggleStatus]);

  const onSave = useCallback(() => {
    if (!id || !post) {
      return;
    }
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      showToast({ message: 'Текст не может быть пустым', variant: 'error' });
      return;
    }
    updatePost(id, { content: trimmed });
    void hapticsSaveSuccess();
    showToast({ message: 'Изменения сохранены', variant: 'success' });
  }, [id, post, showToast, text, updatePost]);

  const onPreview = useCallback(() => {
    if (!id) {
      return;
    }
    router.push({
      pathname: '/post/preview',
      params: { postId: id },
    } as unknown as Href);
  }, [id]);

  if (!post || !id) {
    return (
      <>
        <Stack.Screen options={{ title: 'Пост' }} />
        <SafeAreaView className="flex-1 items-center justify-center p-4">
          <AppText variant="body" color={Colors.text.secondary}>
            Пост не найден
          </AppText>
          <Button label="Назад" onPress={() => router.back()} variant="ghost" size="md" />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Редактор' }} />
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: Colors.bg.primary }}
        edges={['bottom']}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={
            Platform.OS === 'ios' ? headerHeight + 8 : 0
          }
        >
          <View className="flex-1 px-4 pb-3">
            <View className="relative min-h-[160px] flex-1">
              <TextInput
                className="flex-1 rounded-xl px-3 py-3 text-[15px] leading-[22px]"
                style={{
                  color: Colors.text.primary,
                  backgroundColor: Colors.bg.secondary,
                  textAlignVertical: 'top',
                }}
                placeholder="Текст подписи…"
                placeholderTextColor={Colors.text.tertiary}
                multiline
                value={text}
                onChangeText={setText}
                onSelectionChange={(e) =>
                  setSelection(e.nativeEvent.selection)
                }
                scrollEnabled
              />
              <View className="absolute bottom-2 right-2">
                <CharCounter text={text} />
              </View>
            </View>

            <TruncationMarker text={text} />

            <View className="my-2">
              <QuickInsert
                text={text}
                selection={selection}
                onChangeText={setText}
              />
            </View>

            <Pressable
              onPress={() => setPickerOpen(true)}
              className="mb-3 min-h-12 flex-row items-center justify-center gap-2 rounded-xl px-3"
              style={{ backgroundColor: Colors.bg.secondary }}
              accessibilityRole="button"
              accessibilityLabel="Хэштеги"
            >
              <AppText variant="bodyMedium" color={Colors.accent.primary}>
                # Хэштеги
              </AppText>
            </Pressable>

            <View className="flex-row flex-wrap gap-2">
              <View className="min-w-[30%] flex-1">
                <Button
                  label="Превью"
                  onPress={onPreview}
                  variant="secondary"
                  size="sm"
                />
              </View>
              <View className="min-w-[30%] flex-1">
                <Button
                  label="Сохранить изменения"
                  onPress={onSave}
                  variant="primary"
                  size="sm"
                />
              </View>
              <View className="min-w-[30%] flex-1">
                <Button
                  label={isCopied ? 'Скопировано' : 'Копировать'}
                  onPress={() => {
                    void copy();
                  }}
                  variant="ghost"
                  size="sm"
                  disabled={text.trim().length === 0}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <HashtagSetPicker
        isVisible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        postText={text}
        onChangePostText={setText}
      />
    </>
  );
}
