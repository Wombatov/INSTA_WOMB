import { useMemo } from 'react';

import { Colors } from '@/constants/colors';

import { useColorScheme } from '@/hooks/use-color-scheme';

export interface ThemeColors {
  isLight: boolean;
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: {
    subtle: string;
    default: string;
    focus: string;
  };
  accent: typeof Colors.accent;
  status: typeof Colors.status;
  instagram: typeof Colors.instagram;
}

/** Палитра интерфейса с учётом настройки темы (светлая / тёмная / системная). */
export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  const isLight = scheme === 'light';

  return useMemo(
    () => ({
      isLight,
      bg: isLight
        ? {
            primary: Colors.light.bg.primary,
            secondary: Colors.light.bg.secondary,
            tertiary: Colors.light.bg.tertiary,
            elevated: Colors.light.bg.elevated,
          }
        : {
            primary: Colors.bg.primary,
            secondary: Colors.bg.secondary,
            tertiary: Colors.bg.tertiary,
            elevated: Colors.bg.elevated,
          },
      text: isLight
        ? {
            primary: Colors.light.text.primary,
            secondary: Colors.light.text.secondary,
            tertiary: Colors.light.text.tertiary,
            inverse: Colors.text.inverse,
          }
        : {
            primary: Colors.text.primary,
            secondary: Colors.text.secondary,
            tertiary: Colors.text.tertiary,
            inverse: Colors.text.inverse,
          },
      border: isLight
        ? {
            subtle: Colors.light.border.subtle,
            default: Colors.light.border.default,
            focus: Colors.border.focus,
          }
        : {
            subtle: Colors.border.subtle,
            default: Colors.border.default,
            focus: Colors.border.focus,
          },
      accent: Colors.accent,
      status: Colors.status,
      instagram: Colors.instagram,
    }),
    [isLight]
  );
}
