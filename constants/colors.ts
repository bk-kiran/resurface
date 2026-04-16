/**
 * Refsurface — dark-first warm color palette
 *
 * Near-black backgrounds, warm off-white text, amber accent.
 */
export const Colors = {
  // Backgrounds
  background: '#121210',       // near-black with faint warm tint
  surface: '#1E1C1A',          // card / sheet surface
  surfaceRaised: '#28251F',    // elevated surface (modals, popovers)

  // Text
  textPrimary: '#F5F0E8',      // warm white — primary readable text
  textSecondary: '#A89F8C',    // warm mid-gray — labels, captions
  textDisabled: '#5C5650',     // muted — placeholder / disabled state

  // Accent
  accent: '#F5A623',           // amber — CTAs, highlights, active tabs
  accentMuted: '#8C5F14',      // dim amber — pressed states, backgrounds
  accentSubtle: '#2B1E0A',     // very dim amber — tinted backgrounds

  // Semantic
  success: '#6FCF97',
  warning: '#F5A623',          // shares amber accent
  error: '#EB5757',

  // Borders & dividers
  border: '#2E2A25',
  divider: '#1E1C1A',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export type ColorKey = keyof typeof Colors;
