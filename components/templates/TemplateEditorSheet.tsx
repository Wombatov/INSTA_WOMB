import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '@/hooks/use-theme-colors';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { useTemplatesStore } from '@/store/templatesStore';
import { extractVariables } from '@/utils/templateParser';
import { hapticsSaveSuccess } from '@/utils/haptics';

const WINDOW_H = Dimensions.get('window').height;

export interface TemplateEditorSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TemplateEditorSheet = memo<TemplateEditorSheetProps>(
  ({ isVisible, onClose }) => {
    const theme = useThemeColors();
    const insets = useSafeAreaInsets();
    const keyboardInset = useKeyboardInset();
    const createTemplate = useTemplatesStore((s) => s.createTemplate);
    const { showToast } = useToast();

    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
      if (!isVisible) {
        return;
      }
      setName('');
      setContent('');
    }, [isVisible]);

    const varHint = extractVariables(content);

    const handleSave = useCallback(() => {
      const trimmedName = name.trim();
      if (trimmedName.length === 0) {
        showToast({ message: 'Введите название шаблона', variant: 'error' });
        return;
      }
      if (content.trim().length === 0) {
        showToast({ message: 'Введите текст шаблона', variant: 'error' });
        return;
      }
      createTemplate(trimmedName, content);
      void hapticsSaveSuccess();
      onClose();
    }, [content, createTemplate, name, onClose, showToast]);

    /** Как в BottomSheet: ~75% экрана минус шапка «Новый шаблон» */
    const sheetMax = WINDOW_H * 0.75;
    const sheetTitleReserve = 76;
    const footerBlock = 92;
    const bodyCap = Math.max(220, sheetMax - sheetTitleReserve);
    const scrollMax = Math.max(140, bodyCap - footerBlock);

    return (
      <BottomSheet isVisible={isVisible} onClose={onClose} title="Новый шаблон">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
          style={{ width: '100%' }}
        >
          <View
            style={{
              width: '100%',
              marginBottom: keyboardInset,
              maxHeight: bodyCap,
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator
              style={{ maxHeight: scrollMax }}
              contentContainerStyle={{
                paddingBottom: 8,
              }}
            >
              <View
                className="mb-3 rounded-xl px-3 py-2.5"
                style={{
                  backgroundColor: theme.bg.secondary,
                  borderWidth: 1,
                  borderColor: theme.border.subtle,
                }}
              >
                <AppText variant="caption" color={theme.text.secondary} className="mb-2 leading-5">
                  Зачем: одна заготовка — потом только подставляешь названия, цены, даты.
                </AppText>
                <AppText variant="caption" color={theme.text.tertiary} className="mb-2 leading-5">
                  Пустышки: напиши {'{{имя}}'} в двойных скобках — при заполнении появятся поля с
                  этими именами.
                </AppText>
                <View
                  className="rounded-lg px-2 py-1.5"
                  style={{ backgroundColor: theme.bg.tertiary }}
                >
                  <AppText
                    variant="caption"
                    color={theme.text.primary}
                    className="leading-5"
                    accessibilityLabel="Пример шаблона со скобками"
                  >
                    Пример: ✨ {'{{товар}}'} за {'{{цена}}'} ₽
                  </AppText>
                </View>
              </View>

              <AppText variant="label" color={theme.text.secondary} className="mb-1">
                Название
              </AppText>
              <TextInput
                className="mb-3 rounded-xl px-3 py-2 text-[15px] leading-[22px]"
                style={{
                  color: theme.text.primary,
                  backgroundColor: theme.bg.secondary,
                  minHeight: 44,
                }}
                placeholder="Например: Анонс продукта"
                placeholderTextColor={theme.text.tertiary}
                value={name}
                onChangeText={setName}
                accessibilityLabel="Название шаблона"
              />

              <AppText variant="label" color={theme.text.secondary} className="mb-1">
                Текст подписи
              </AppText>
              <TextInput
                className="mb-2 rounded-xl px-3 py-3 text-[15px] leading-[22px]"
                style={{
                  color: theme.text.primary,
                  backgroundColor: theme.bg.secondary,
                  minHeight: 120,
                  maxHeight: 200,
                  textAlignVertical: 'top',
                }}
                placeholder="Новинка: {{продукт}} — всего {{цена}} ₽"
                placeholderTextColor={theme.text.tertiary}
                multiline
                scrollEnabled
                value={content}
                onChangeText={setContent}
                accessibilityLabel="Текст шаблона с переменными в фигурных скобках"
              />

              <AppText variant="caption" color={theme.text.tertiary} className="leading-5">
                Поля:{' '}
                {varHint.length > 0
                  ? varHint.map((v) => `{{${v}}}`).join(', ')
                  : 'добавь {{имя}} в текст выше'}
              </AppText>
            </ScrollView>

            <View
              style={{
                paddingTop: 12,
                paddingBottom: Math.max(insets.bottom, 12),
                marginTop: 4,
                borderTopWidth: 1,
                borderTopColor: theme.border.subtle,
                backgroundColor: theme.bg.elevated,
              }}
            >
              <Button label="Сохранить шаблон" onPress={handleSave} variant="primary" />
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

TemplateEditorSheet.displayName = 'TemplateEditorSheet';
