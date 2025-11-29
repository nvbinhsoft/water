import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.800'),
            a: {
              color: theme('colors.indigo.600'),
              '&:hover': {
                color: theme('colors.indigo.700'),
              },
            },
            code: {
              backgroundColor: theme('colors.slate.100'),
              padding: '0.2rem 0.35rem',
              borderRadius: theme('borderRadius.md'),
              fontWeight: '600',
            },
            pre: {
              backgroundColor: theme('colors.slate.900'),
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.slate.100'),
            a: {
              color: theme('colors.indigo.300'),
              '&:hover': {
                color: theme('colors.indigo.200'),
              },
            },
            code: {
              backgroundColor: theme('colors.slate.800'),
            },
            pre: {
              backgroundColor: theme('colors.slate.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
