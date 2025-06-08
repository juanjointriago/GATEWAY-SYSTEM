/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '1440': '1440px',
      },
      minHeight: {
        '600': '600px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.600'),
            maxWidth: 'none',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
          },
        },
      }),
      gradientColorStops: theme => ({
        ...theme('colors'),
        'black-60': 'rgba(0, 0, 0, 0.6)',
        'black-30': 'rgba(0, 0, 0, 0.3)',
      }),
      backdropBlur: {
        sm: '4px',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [
    typography,
  ],
}

