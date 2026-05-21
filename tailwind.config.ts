import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './data/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 24px 120px rgba(15,23,42,0.18)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
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
  plugins: [require('@tailwindcss/typography')]
};

export default config;
