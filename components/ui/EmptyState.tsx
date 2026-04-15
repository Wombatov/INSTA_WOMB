import React, { memo } from 'react';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { Colors } from '@/constants/colors';

import { AppText } from './AppText';
import { Button } from './Button';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

export interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  description: string;
  action?: EmptyStateAction;
}

export const EmptyState = memo<EmptyStateProps>(
  ({ icon: Icon, title, description, action }) => {
    const colorScheme = useColorScheme();
    const secondaryText =
      colorScheme === 'light'
        ? Colors.light.text.secondary
        : Colors.text.secondary;
    const tertiaryIcon =
      colorScheme === 'light'
        ? Colors.light.text.tertiary
        : Colors.text.tertiary;

    return (
      <View
        className="flex-1 items-center justify-center px-8 py-12"
        accessibilityRole="none"
      >
        <View className="mb-4 items-center justify-center">
          <Icon size={48} color={tertiaryIcon} />
        </View>
        <AppText
          variant="sectionTitle"
          className="mb-2 text-center"
          accessibilityRole="header"
        >
          {title}
        </AppText>
        <AppText
          variant="body"
          color={secondaryText}
          className="mb-6 text-center"
        >
          {description}
        </AppText>
        {action ? (
          <Button
            label={action.label}
            onPress={action.onPress}
            variant="primary"
            size="md"
          />
        ) : null}
      </View>
    );
  }
);

EmptyState.displayName = 'EmptyState';
