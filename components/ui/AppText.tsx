import React, { memo } from 'react';
import { Text, useColorScheme, type TextProps, type TextStyle } from 'react-native';

import { Colors } from '@/constants/colors';
import { TextStyles } from '@/constants/typography';

export type AppTextVariant =
  | 'body'
  | 'bodyMedium'
  | 'caption'
  | 'label'
  | 'screenTitle'
  | 'sectionTitle'
  | 'counter';

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  /** Overrides semantic theme text color when set (e.g. `#fff` or `Colors.accent.primary`). */
  color?: string;
  children: React.ReactNode;
}

function defaultTextColor(scheme: 'light' | 'dark' | null | undefined): string {
  const isLight = scheme === 'light';
  return isLight ? Colors.light.text.primary : Colors.text.primary;
}

export const AppText = memo<AppTextProps>(
  ({
    variant = 'body',
    color,
    style,
    children,
    className,
    ...rest
  }) => {
    const colorScheme = useColorScheme();
    const baseStyle = TextStyles[variant] as TextStyle;
    const resolvedColor = color ?? defaultTextColor(colorScheme);

    return (
      <Text
        style={[baseStyle, { color: resolvedColor }, style]}
        className={className}
        accessibilityRole="text"
        {...rest}
      >
        {children}
      </Text>
    );
  }
);

AppText.displayName = 'AppText';
