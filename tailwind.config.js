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
        background:      '#1A1108',
        surface:         '#251A0E',
        'surface-raised':'#2A2015',
        amber:           '#E8A830',
        'amber-light':   '#F5C454',
        'accent-muted':  '#8C5F14',
        'accent-subtle': '#2B1E0A',
        cream:           '#F0E6D0',
        'cream-muted':   '#9C8E7A',
        disabled:        '#5C5650',
        polaroid:        '#F5F0E8',
        success:         '#6FCF97',
        error:           '#EB5757',
        border:          '#3D2E1A',
      },
    },
  },
  plugins: [],
};
