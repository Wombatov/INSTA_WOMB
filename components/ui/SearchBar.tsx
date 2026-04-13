import React, { memo, useCallback, useMemo } from 'react';
import { Pressable, TextInput, useColorScheme, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { Colors } from '@/constants/colors';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
}

export const SearchBar = memo<SearchBarProps>(
  ({
    value,
    onChangeText,
    placeholder = 'Поиск',
    accessibilityLabel = 'Поиск по постам',
  }) => {
    const clear = useCallback(() => {
      onChangeText('');
    }, [onChangeText]);

    const colorScheme = useColorScheme();
    const palette = useMemo(() => {
      const isLight = colorScheme === 'light';
      return {
        surface: isLight ? Colors.light.bg.secondary : Colors.bg.secondary,
        primary: isLight ? Colors.light.text.primary : Colors.text.primary,
        secondary: isLight ? Colors.light.text.secondary : Colors.text.secondary,
        tertiary: isLight ? Colors.light.text.tertiary : Colors.text.tertiary,
      };
    }, [colorScheme]);

    return (
      <View
        className="min-h-12 flex-row items-center rounded-xl px-3"
        style={{ backgroundColor: palette.surface }}
      >
        <Search
          size={20}
          color={palette.secondary}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.tertiary}
          className="min-h-12 flex-1 px-2 py-2 text-[15px]"
          style={{ color: palette.primary }}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="search"
          returnKeyType="search"
        />
        {value.length > 0 ? (
          <Pressable
            onPress={clear}
            accessibilityRole="button"
            accessibilityLabel="Очистить поиск"
            className="min-h-12 min-w-12 items-center justify-center"
          >
            <X size={20} color={palette.secondary} />
          </Pressable>
        ) : null}
      </View>
    );
  }
);

SearchBar.displayName = 'SearchBar';
