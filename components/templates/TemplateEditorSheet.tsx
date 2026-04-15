import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-colors';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { useTemplatesStore } from '@/store/templatesStore';
import { extractVariables } from '@/utils/templateParser';
import { hapticsSaveSuccess } from '@/utils/haptics';

export interface TemplateEditorSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TemplateEditorSheet = memo<TemplateEditorSheetProps>(
  ({ isVisible, onClose }) => {
    const theme = useThemeColors();
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

    const scrollBottomPad = 24 + keyboardInset;

    return (
      <BottomSheet isVisible={isVisible} onClose={onClose} title="Новый шаблон">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%' }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: scrollBottomPad,
            }}
          >
            <View
              className="mb-4 rounded-xl px-3 py-3"
              style={{
                backgroundColor: theme.bg.secondary,
                borderWidth: 1,
                borderColor: theme.border.subtle,
              }}
            >
              <AppText variant="label" color={theme.accent.primary} className="mb-2">
                Зачем шаблон
              </AppText>
              <AppText variant="caption" color={theme.text.secondary} className="mb-3 leading-5">
                Один раз сохраняешь заготовку подписи. Потом при создании поста из шаблона
                подставишь только разные названия, цены или даты — без копирования всего
                текста заново.
              </AppText>
              <AppText variant="label" color={theme.text.secondary} className="mb-1">
                Как задать «пустышки»
              </AppText>
              <AppText variant="caption" color={theme.text.tertiary} className="mb-2 leading-5">
                В двойных фигурных скобках напиши имя поля латиницей или кириллицей, без
                пробелов: {'{{товар}}'}, {'{{цена}}'}. При заполнении шаблона появятся поля с
                этими именами.
              </AppText>
              <View
                className="rounded-lg px-2 py-2"
                style={{ backgroundColor: theme.bg.tertiary }}
              >
                <AppText variant="caption" color={theme.text.tertiary} className="mb-1">
                  Пример текста
                </AppText>
                <AppText
                  variant="caption"
                  color={theme.text.primary}
                  className="leading-5"
                  accessibilityLabel="Пример: Скидка на товар с переменными"
                >
                  ✨ Скидка на {'{{товар}}'}! Только {'{{цена}}'} ₽ — успей до конца недели.
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
                minHeight: 160,
                textAlignVertical: 'top',
              }}
              placeholder="Новинка: {{продукт}} — всего {{цена}} ₽"
              placeholderTextColor={theme.text.tertiary}
              multiline
              value={content}
              onChangeText={setContent}
              accessibilityLabel="Текст шаблона с переменными в фигурных скобках"
            />

            <AppText variant="caption" color={theme.text.tertiary} className="mb-4 leading-5">
              Обнаружено полей:{' '}
              {varHint.length > 0 ? varHint.map((v) => `{{${v}}}`).join(', ') : 'пока нет — добавь {{имя}} в текст выше'}
            </AppText>

            <Button label="Сохранить шаблон" onPress={handleSave} variant="primary" />
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

TemplateEditorSheet.displayName = 'TemplateEditorSheet';
