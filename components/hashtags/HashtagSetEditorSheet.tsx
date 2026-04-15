import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import type { HashtagSet } from '@/types';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { useHashtagsStore } from '@/store/hashtagsStore';
import { hapticsSaveSuccess } from '@/utils/haptics';
import { parseHashtagInput } from '@/utils/hashtagInput';
import { INSTAGRAM_LIMITS } from '@/utils/instagramLimits';
import { formatHashtags } from '@/utils/textFormatter';

export interface HashtagSetEditorSheetProps {
  isVisible: boolean;
  onClose: () => void;
  /** `null` — создание нового набора */
  editingSet: HashtagSet | null;
}

export const HashtagSetEditorSheet = memo<HashtagSetEditorSheetProps>(
  ({ isVisible, onClose, editingSet }) => {
    const theme = useThemeColors();
    const createSet = useHashtagsStore((s) => s.createSet);
    const updateSet = useHashtagsStore((s) => s.updateSet);
    const { showToast } = useToast();

    const [name, setName] = useState('');
    const [rawHashtags, setRawHashtags] = useState('');

    useEffect(() => {
      if (!isVisible) {
        return;
      }
      if (editingSet) {
        setName(editingSet.name);
        setRawHashtags(formatHashtags(editingSet.hashtags));
      } else {
        setName('');
        setRawHashtags('');
      }
    }, [isVisible, editingSet]);

    const hashtagCount = useMemo(
      () => parseHashtagInput(rawHashtags).length,
      [rawHashtags]
    );

    const handleSave = useCallback(() => {
      const trimmedName = name.trim();
      if (trimmedName.length === 0) {
        showToast({ message: 'Введите название набора', variant: 'error' });
        return;
      }
      const tags = parseHashtagInput(rawHashtags);
      if (tags.length === 0) {
        showToast({
          message: 'Добавьте хотя бы один хэштег',
          variant: 'error',
        });
        return;
      }
      if (editingSet) {
        updateSet(editingSet.id, { name: trimmedName, hashtags: tags });
      } else {
        createSet(trimmedName, tags);
      }
      void hapticsSaveSuccess();
      onClose();
    }, [
      createSet,
      editingSet,
      name,
      onClose,
      rawHashtags,
      showToast,
      updateSet,
    ]);

    const handleCancel = useCallback(() => {
      onClose();
    }, [onClose]);

    const title =
      editingSet === null ? 'Новый набор' : 'Редактировать набор';

    return (
      <BottomSheet isVisible={isVisible} onClose={onClose} title={title}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AppText variant="label" color={theme.text.secondary} className="mb-1">
              Название
            </AppText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Например: Путешествия"
              placeholderTextColor={theme.text.tertiary}
              className="mb-4 min-h-12 rounded-xl px-3 py-2"
              style={{
                color: theme.text.primary,
                backgroundColor: theme.bg.secondary,
              }}
              accessibilityLabel="Название набора хэштегов"
              accessibilityHint="Обязательное поле"
            />

            <AppText variant="label" color={theme.text.secondary} className="mb-1">
              Хэштеги
            </AppText>
            <TextInput
              value={rawHashtags}
              onChangeText={setRawHashtags}
              placeholder="#travel #nature или через запятую"
              placeholderTextColor={theme.text.tertiary}
              multiline
              className="mb-2 min-h-28 rounded-xl px-3 py-2"
              style={{
                color: theme.text.primary,
                backgroundColor: theme.bg.secondary,
                textAlignVertical: 'top',
              }}
              accessibilityLabel="Список хэштегов"
              accessibilityHint="Через пробел или запятую, не более тридцати"
            />
            <AppText
              variant="caption"
              color={theme.text.secondary}
              className="mb-4"
            >
              Хэштегов: {hashtagCount} / {INSTAGRAM_LIMITS.HASHTAG_MAX}
            </AppText>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  label="Отмена"
                  onPress={handleCancel}
                  variant="secondary"
                  size="md"
                />
              </View>
              <View className="flex-1">
                <Button
                  label="Сохранить"
                  onPress={handleSave}
                  variant="primary"
                  size="md"
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

HashtagSetEditorSheet.displayName = 'HashtagSetEditorSheet';
