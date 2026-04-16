import React, { memo } from 'react';
import { Text } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { highlightPlaceholders } from '@/utils/templateParser';

export interface RecipeHighlightedTextProps {
  text: string;
}

export const RecipeHighlightedText = memo<RecipeHighlightedTextProps>(({ text }) => {
  const theme = useThemeColors();
  const parts = highlightPlaceholders(text);

  if (text.trim().length === 0) {
    return (
      <AppText variant="body" color={theme.text.tertiary}>
        …
      </AppText>
    );
  }

  return (
    <Text style={{ fontSize: 15, lineHeight: 22 }}>
      {parts.map((part, i) => (
        <Text
          key={`h-${i}`}
          style={{
            fontSize: 15,
            lineHeight: 22,
            color: part.isPlaceholder ? theme.accent.primary : theme.text.primary,
          }}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
});

RecipeHighlightedText.displayName = 'RecipeHighlightedText';
