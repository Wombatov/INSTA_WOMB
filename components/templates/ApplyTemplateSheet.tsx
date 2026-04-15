import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PostTemplate } from '@/types';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { applyVariables } from '@/utils/templateParser';

const WINDOW_H = Dimensions.get('window').height;

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
    const insets = useSafeAreaInsets();
    const keyboardInset = useKeyboardInset();
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

    const sheetMax = WINDOW_H * 0.75;
    const titleReserve = 64;
    const footerBlock = 92;
    const bodyCap = Math.max(200, sheetMax - titleReserve);
    const scrollMax = Math.max(120, bodyCap - footerBlock);

    return (
      <BottomSheet isVisible={isVisible} onClose={onClose} title={title}>
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
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              {keys.length === 0 ? (
                <AppText variant="body" color={theme.text.secondary} className="mb-3">
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

              <AppText variant="caption" color={theme.text.tertiary} className="leading-5">
                Предпросмотр: {resolvedPreview.slice(0, 200)}
                {resolvedPreview.length > 200 ? '…' : ''}
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
              <Button
                label="Создать пост"
                onPress={handleSubmit}
                variant="primary"
                disabled={resolvedPreview.trim().length === 0}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

ApplyTemplateSheet.displayName = 'ApplyTemplateSheet';
