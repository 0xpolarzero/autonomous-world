import { fontFamily } from 'tailwindcss/defaultTheme';

/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  prefix: '',
  theme: {
    extend: {
      colors: {
        // From Flexoki
        // see https://gist.github.com/martin-mael/4b50fa8e55da846f3f73399d84fa1848
        overlay: {
          DEFAULT: 'rgba(36, 36, 36, 0.9)',
          light: 'rgba(36, 36, 36, 0.5)',
        },
        button: {
          DEFAULT: '#4A5568',
          light: '#718096',
        },
        red: {
          DEFAULT: '#AF3029',
          light: '#D14D41',
        },
        orange: {
          DEFAULT: '#BC5215',
          light: '#DA702C',
        },
        yellow: {
          DEFAULT: '#AD8301',
          light: '#D0A215',
        },
        green: {
          DEFAULT: '#66800B',
          light: '#879A39',
        },
      },
    },
  },
};
