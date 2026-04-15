import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import type { PostTemplate } from '@/types';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { applyVariables } from '@/utils/templateParser';

export interface ApplyTemplateSheetProps {
  template: PostTemplate | null;
  isVisible: boolean;
  onClose: () => void;
  /** Готовый текст после подстановки переменных */
  onComplete: (resolvedText: string) => void;
}

function emptyValues(keys: string[]): Record<string, string> {
  const o: Record<string, string> = {};
  for (const k of keys) {
    o[k] = '';
  }
  return o;
}

export const ApplyTemplateSheet = memo<ApplyTemplateSheetProps>(
  ({ template, isVisible, onClose, onComplete }) => {
    const theme = useThemeColors();
    const [values, setValues] = useState<Record<string, string>>({});

    const keys = template?.variables ?? [];

    useEffect(() => {
      if (!isVisible || !template) {
        return;
      }
      setValues(emptyValues(template.variables));
    }, [isVisible, template]);

    const resolvedPreview = useMemo(() => {
      if (!template) {
        return '';
      }
      return applyVariables(template.content, values);
    }, [template, values]);

    const setField = useCallback((key: string, text: string) => {
      setValues((prev) => ({ ...prev, [key]: text }));
    }, []);

    const handleSubmit = useCallback(() => {
      if (!template) {
        return;
      }
      const text = applyVariables(template.content, values).trim();
      if (text.length === 0) {
        return;
      }
      onComplete(text);
      onClose();
    }, [onClose, onComplete, template, values]);

    const title = template?.name ?? 'Шаблон';

    if (!template) {
      return null;
    }

    return (
      <BottomSheet isVisible={isVisible} onClose={onClose} title={title}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {keys.length === 0 ? (
              <AppText variant="body" color={theme.text.secondary} className="mb-4">
                В шаблоне нет переменных — будет создан пост с текстом как есть.
              </AppText>
            ) : (
              keys.map((key) => (
                <View key={key} className="mb-3">
                  <AppText variant="label" color={theme.text.secondary} className="mb-1">
                    {`{{${key}}}`}
                  </AppText>
                  <TextInput
                    className="rounded-xl px-3 py-2 text-[15px] leading-[22px]"
                    style={{
                      color: theme.text.primary,
                      backgroundColor: theme.bg.secondary,
                      minHeight: 44,
                    }}
                    placeholder={`Значение для «${key}»`}
                    placeholderTextColor={theme.text.tertiary}
                    value={values[key] ?? ''}
                    onChangeText={(t) => setField(key, t)}
                    accessibilityLabel={`Переменная ${key}`}
                  />
                </View>
              ))
            )}

            <AppText variant="caption" color={theme.text.tertiary} className="mb-3">
              Предпросмотр: {resolvedPreview.slice(0, 200)}
              {resolvedPreview.length > 200 ? '…' : ''}
            </AppText>

            <Button
              label="Создать пост"
              onPress={handleSubmit}
              variant="primary"
              disabled={resolvedPreview.trim().length === 0}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

ApplyTemplateSheet.displayName = 'ApplyTemplateSheet';
