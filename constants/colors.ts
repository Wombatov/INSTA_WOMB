export const Colors = {
  bg: {
    primary: '#0F0F0F',
    secondary: '#1A1A1A',
    tertiary: '#242424',
    elevated: '#2C2C2C',
  },

  text: {
    primary: '#F2F2F2',
    secondary: '#9A9A9A',
    tertiary: '#5A5A5A',
    inverse: '#0F0F0F',
  },

  accent: {
    primary: '#A855F7',
    light: '#C084FC',
    dark: '#7C3AED',
    subtle: '#1E1030',
  },

  status: {
    ok: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    error: '#DC2626',
  },

  border: {
    subtle: '#2A2A2A',
    default: '#383838',
    focus: '#A855F7',
  },

  instagram: {
    gradient: ['#833AB4', '#FD1D1D', '#FCB045'] as const,
    preview_bg: '#121212',
  },

  light: {
    bg: {
      primary: '#FFFFFF',
      secondary: '#F8F8F8',
      tertiary: '#F0F0F0',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#111111',
      secondary: '#666666',
      tertiary: '#AAAAAA',
    },
    border: {
      subtle: '#EBEBEB',
      default: '#D4D4D4',
    },
  },
} as const;
