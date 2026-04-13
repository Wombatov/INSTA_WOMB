/** @type {import('tailwindcss').Config} */
// Color values mirror `constants/colors.ts` (CaptionCraft DESIGN_SYSTEM).
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0F0F0F',
          secondary: '#1A1A1A',
          tertiary: '#242424',
          elevated: '#2C2C2C',
        },
        foreground: {
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
          preview: '#121212',
        },
        'light-bg': {
          primary: '#FFFFFF',
          secondary: '#F8F8F8',
          tertiary: '#F0F0F0',
          elevated: '#FFFFFF',
        },
        'light-fg': {
          primary: '#111111',
          secondary: '#666666',
          tertiary: '#AAAAAA',
        },
        'light-border': {
          subtle: '#EBEBEB',
          default: '#D4D4D4',
        },
      },
    },
  },
  plugins: [],
};
