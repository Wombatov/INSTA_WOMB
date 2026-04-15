import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-colors';
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

    return (
      <BottomSheet isVisible={isVisible} onClose={onClose} title="Новый шаблон">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
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
              Текст с переменными {'{{переменная}}'}
            </AppText>
            <TextInput
              className="mb-2 rounded-xl px-3 py-3 text-[15px] leading-[22px]"
              style={{
                color: theme.text.primary,
                backgroundColor: theme.bg.secondary,
                minHeight: 160,
                textAlignVertical: 'top',
              }}
              placeholder="Новинка: {{продукт}} — всего {{цена}}!"
              placeholderTextColor={theme.text.tertiary}
              multiline
              value={content}
              onChangeText={setContent}
              accessibilityLabel="Текст шаблона"
            />

            <AppText variant="caption" color={theme.text.tertiary} className="mb-4">
              Переменные:{' '}
              {varHint.length > 0 ? varHint.map((v) => `{{${v}}}`).join(', ') : '—'}
            </AppText>

            <Button label="Сохранить шаблон" onPress={handleSave} variant="primary" />
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

TemplateEditorSheet.displayName = 'TemplateEditorSheet';
