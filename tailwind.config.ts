import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './data/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: 'var(--shadow)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        background: 'hsl(var(--bg) / <alpha-value>)',
        foreground: 'hsl(var(--text) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-2': 'hsl(var(--surface-2) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        brand: {
          DEFAULT: '#FF6B35',
          50: '#FFF1E9',
          100: '#FFE1D1',
          200: '#FFC8A9',
          300: '#FF9B76',
          400: '#FF7A52',
          500: '#FF6B35',
          600: '#E0551F',
          700: '#B43F15',
          800: '#8C310F',
          900: '#66250A'
        }
      }
    }
  },
  plugins: [typography]
};

export default config;
