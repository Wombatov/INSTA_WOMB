import type { TextStyle } from 'react-native';

export const Typography = {
  fonts: {
    display: 'Syne-Bold',
    displayMedium: 'Syne-Medium',
    body: 'DMSans-Regular',
    bodyMedium: 'DMSans-Medium',
    bodySemiBold: 'DMSans-SemiBold',
    mono: 'DMMono-Regular',
  },

  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1.2,
  },
} as const;

export const TextStyles = {
  screenTitle: {
    fontFamily: 'Syne-Bold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontFamily: 'Syne-Medium',
    fontSize: 17,
    letterSpacing: 0,
  },

  body: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
  },

  caption: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
    letterSpacing: 0.2,
  },

  counter: {
    fontFamily: 'DMMono-Regular',
    fontSize: 13,
  },
} as const satisfies Record<string, TextStyle>;
