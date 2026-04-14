import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { type Href, router } from 'expo-router';
import { Hash } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
import { usePreviewStore } from '@/store/previewStore';
import { hapticsSaveSuccess } from '@/utils/haptics';
import { insertFragmentAtSelection } from '@/utils/textInsert';

const TEXT_INPUT_MIN = 200;
const TEXT_INPUT_MAX = 420;

export default function EditorScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const inputRef = useRef<React.ElementRef<typeof TextInput> | null>(null);
  const [text, setText] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [pickerOpen, setPickerOpen] = useState(false);

  const createPost = usePostsStore((s) => s.createPost);
  const setDraftCaption = usePreviewStore((s) => s.setDraftCaption);

  const { showToast } = useToast();
  const { copy, isCopied } = useCopyToClipboard(text);

  const onSave = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      showToast({ message: 'Введите текст подписи', variant: 'error' });
      return;
    }
    try {
      createPost(trimmed);
      setText('');
      void hapticsSaveSuccess();
      showToast({ message: 'Пост сохранён', variant: 'success' });
    } catch {
      showToast({ message: 'Не удалось сохранить пост', variant: 'error' });
    }
  }, [createPost, showToast, text]);

  const onPreview = useCallback(() => {
    setDraftCaption(text);
    router.push('/post/preview' as Href);
  }, [setDraftCaption, text]);

  const onQuickInsert = useCallback(
    (fragment: string) => {
      const { nextText, caret } = insertFragmentAtSelection(
        text,
        selection,
        fragment
      );
      setText(nextText);
      setSelection({ start: caret, end: caret });
      requestAnimationFrame(() => {
        inputRef.current?.setNativeProps({
          selection: { start: caret, end: caret },
        });
        inputRef.current?.focus();
      });
    },
    [selection, text]
  );

  const scrollBottomPad = tabBarHeight + 28;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.bg.primary }}
      edges={['top']}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? tabBarHeight + 8 : 0
        }
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: scrollBottomPad,
          }}
        >
          <View className="flex-1 px-4 pb-3">
            <AppText variant="sectionTitle" className="mb-2">
              Новый пост
            </AppText>

            <View className="relative" style={{ minHeight: TEXT_INPUT_MIN }}>
              <TextInput
                ref={inputRef}
                className="rounded-xl px-3 py-3 text-[15px] leading-[22px]"
                style={{
                  minHeight: TEXT_INPUT_MIN,
                  maxHeight: TEXT_INPUT_MAX,
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
                blurOnSubmit={false}
              />
              <View className="absolute bottom-2 right-2">
                <CharCounter text={text} />
              </View>
            </View>

            <TruncationMarker text={text} />

            <View className="my-2">
              <QuickInsert onInsert={onQuickInsert} />
            </View>

            <Pressable
              onPress={() => setPickerOpen(true)}
              className="mb-3 min-h-12 flex-row items-center justify-center gap-2 rounded-xl px-3"
              style={{ backgroundColor: Colors.bg.secondary }}
              accessibilityRole="button"
              accessibilityLabel="Выбрать набор хэштегов"
            >
              <Hash size={20} color={Colors.accent.primary} strokeWidth={1.8} />
              <AppText variant="bodyMedium" color={Colors.accent.primary}>
                Хэштеги
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
                  label="Сохранить"
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
        </ScrollView>
      </KeyboardAvoidingView>

      <HashtagSetPicker
        isVisible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        postText={text}
        onChangePostText={setText}
      />
    </SafeAreaView>
  );
}
