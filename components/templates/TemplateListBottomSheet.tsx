import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, Pressable } from 'react-native';

import type { PostTemplate } from '@/types';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AppText } from '@/components/ui/AppText';
import { useTemplatesStore } from '@/store/templatesStore';

export interface TemplateListBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PostTemplate) => void;
}

export const TemplateListBottomSheet = memo<TemplateListBottomSheetProps>(
  ({ isVisible, onClose, onSelectTemplate }) => {
    const theme = useThemeColors();
    const templates = useTemplatesStore((s) => s.templates);

    const sorted = useMemo(
      () =>
        [...templates].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      [templates]
    );

    const renderItem = useCallback(
      ({ item }: { item: PostTemplate }) => (
        <Pressable
          onPress={() => {
            onSelectTemplate(item);
            onClose();
          }}
          className="mb-2 min-h-12 rounded-xl px-3 py-3"
          style={{ backgroundColor: theme.bg.secondary }}
          accessibilityRole="button"
          accessibilityLabel={`Выбрать шаблон ${item.name}`}
        >
          <AppText variant="bodyMedium" color={theme.text.primary} numberOfLines={1}>
            {item.name}
          </AppText>
          <AppText variant="caption" color={theme.text.tertiary} numberOfLines={2}>
            {item.content.trim().slice(0, 120)}
            {item.content.length > 120 ? '…' : ''}
          </AppText>
        </Pressable>
      ),
      [onClose, onSelectTemplate, theme.bg.secondary, theme.text]
    );

    const keyExtractor = useCallback((item: PostTemplate) => item.id, []);

    const empty = useCallback(
      () => (
        <AppText variant="body" color={theme.text.secondary} className="py-6 text-center">
          Нет сохранённых шаблонов. Создайте на вкладке «Шаблоны».
        </AppText>
      ),
      [theme.text.secondary]
    );

    return (
      <BottomSheet isVisible={isVisible} onClose={onClose} title="Шаблоны">
        <FlatList
          data={sorted}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={empty}
          style={{ maxHeight: 400 }}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        />
      </BottomSheet>
    );
  }
);

TemplateListBottomSheet.displayName = 'TemplateListBottomSheet';
