/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Mirrors constants/colors.ts — update both together
        background:       '#121210',
        surface:          '#1E1C1A',
        'surface-raised': '#28251F',
        primary:          '#F5F0E8',
        secondary:        '#A89F8C',
        disabled:         '#5C5650',
        accent:           '#F5A623',
        'accent-muted':   '#8C5F14',
        'accent-subtle':  '#2B1E0A',
        success:          '#6FCF97',
        error:            '#EB5757',
        border:           '#2E2A25',
      },
    },
  },
  plugins: [],
};
