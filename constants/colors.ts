/**
 * Resurface — warm dark colour palette
 *
 * Near-black amber-tinted backgrounds, cream text, amber accent.
 * Update tailwind.config.js alongside this file — they share the same tokens.
 */
export const Colors = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  background:     '#1A1108',   // deep warm near-black
  surface:        '#251A0E',   // card / sheet surface
  surfaceRaised:  '#2A2015',   // elevated surface / map placeholder

  // ── Amber accent ───────────────────────────────────────────────────────────
  amber:          '#E8A830',   // primary accent — CTAs, active states, pins
  amberLight:     '#F5C454',   // lighter amber — hover / highlights
  accentMuted:    '#8C5F14',   // dim amber — pressed backgrounds
  accentSubtle:   '#2B1E0A',   // very dim amber — tinted backgrounds

  // ── Cream text ─────────────────────────────────────────────────────────────
  cream:          '#F0E6D0',   // primary text (warm white)
  creamMuted:     '#9C8E7A',   // secondary / muted text
  textDisabled:   '#5C5650',   // placeholder / disabled

  // ── Polaroid card ──────────────────────────────────────────────────────────
  polaroid:       '#F5F0E8',   // card body (classic film border)
  polaroidCaption:'#8A7D6E',   // italic caption inside card

  // ── Semantic ───────────────────────────────────────────────────────────────
  success:        '#6FCF97',
  error:          '#EB5757',

  // ── Borders & dividers ─────────────────────────────────────────────────────
  border:         '#3D2E1A',
  divider:        '#251A0E',

  // ── Overlays ───────────────────────────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export type ColorKey = keyof typeof Colors;
