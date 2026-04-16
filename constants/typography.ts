/**
 * Refsurface — type scale constants
 *
 * Based on a 4-pt baseline grid with a 1.25 modular scale.
 */
export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,   // body default
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 38,
} as const;

export const LineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  caps: 1.5,   // for all-caps labels
} as const;

export type FontSizeKey = keyof typeof FontSize;
export type FontWeightKey = keyof typeof FontWeight;
