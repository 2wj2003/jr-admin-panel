const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} \*/
module.exports = {
  mode: 'jit',
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    "./public/**/*.html",
  ],
  safelist: [
    'w-64',
    'w-1/2',
    'rounded-l-lg',
    'rounded-r-lg',
    'bg-gray-200',
    'grid-cols-4',
    'grid-cols-7',
    'h-6',
    'leading-6',
    'h-9',
    'leading-9',
    'shadow-lg'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1877F2',
          '50': '#D1E4FC',
          '100': '#B2D2FB',
          '200': '#8BBBF8',
          '300': '#65A4F6',
          '400': '#3E8EF4',
          '500': '#1877F2',
          '600': '#1463CA',
          '700': '#104FA1',
          '800': '#0C3B79',
          '900': '#082851',
        },
        "gray-primary": '#111827',
        "gray-secondary": '#374151',
        "line": '#06c755',
        "messenger": "#006AFF"
      },
      // sidebar mobile fix
      maxWidth: {
        '2xs': '16rem',
        '8xl': '90rem'
      },
      fontFamily: {
        'sans': ['var(--font-prompt)', ...fontFamily.sans],
        'body': ['var(--font-sarabun), -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif']
      },
      fontSize: {
        '2xs': '0.625rem'
      },
      boxShadow: {
        light: 'rgba(0, 0, 0, 0.08) 0px 1px 12px',
        normal: 'rgba(0, 0, 0, 0.12) 0px 2px 16px',
        dark: 'rgba(0, 0, 0, 0.18) 0px 2px 16px',
      },
      width: {
        'full-8px': 'calc(100% - 8px)',
        '1/2-8px': 'calc(50% - 8px)',
        '1/3-8px': 'calc(33% - 8px)',
        '1/4-8px': 'calc(25% - 8px)'
      },
      maxHeight: {
        '30vh-32px': 'calc(30vh - 32px)',
        '60vh-40px': 'calc(60vh - 40px)',
        '100vh-144px': 'calc(100vh - 144px)'
      },
      minHeight: {
        '30vh-32px': 'calc(30vh - 32px)',
        '60vh-40px': 'calc(60vh - 40px)',
        '100vh-144px': 'calc(100vh - 144px)'
      },
      minWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        '64': '16rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '1/10': '10%',
        '1.5/10': '15%',
        '2/10': '20%',
        '2.5/10': '25%',
        '3/10': '30%',
        '3.5/10': '35%',
        '4/10': '40%',
        '4.5/10': '45%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        '1/2-8px': 'calc(50% - 8px)',
        '1/3-8px': 'calc(33% - 8px)',
        '1/4-8px': 'calc(25% - 8px)',
        '1/5-8px': 'calc(20% - 8px)',
        '2/5-8px': 'calc(40% - 8px)',
        '3/5-8px': 'calc(60% - 8px)',
        '4/5-8px': 'calc(80% - 8px)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            a: {
              color: '#3F83F8',
              '&:hover': {
                color: '#006AFF',
              },
            },
          },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      ringColor: ['focus-visible'],
      ringWidth: ['focus-visible'],
      ringOpacity: ['focus-visible'],
      borderColor: ['focus-visible'],
      height: ['responsive', 'hover', 'focus']
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-scrims')({
    directions: {
      't': 'to bottom',
      'b': 'to top',
    },
    distances: {
      default: '25%',
      '1/2': '50%',
      '1/3': '33.33%',
    },
    colors: {
      default: ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)'],
    },
    variants: [],
  })],
};