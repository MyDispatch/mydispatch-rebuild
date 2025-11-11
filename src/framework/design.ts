// NeXify Design Foundation v1.1 — Tokens & CSS Vars
// Minimal, erweiterbar: Palette, Motion, Spacing, Breakpoints.

export const designFoundation = {
  palette: {
    primary: '#1F3A8A',
    secondary: '#0EA5E9',
    accent: '#22C55E',
    background: '#0B1220',
    surface: '#111827',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    success: '#10B981',
    white: '#FFFFFF',
    black: '#000000',
  },
  motion: {
    duration: {
      fast: '150ms',
      medium: '300ms',
      slow: '500ms',
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },
  zIndex: {
    header: 30,
    footer: 20,
    overlay: 50,
    sheet: 60,
    modal: 70,
    toast: 90,
  },
} as const;

export type DesignFoundation = typeof designFoundation;

export function applyDesignVars(root: HTMLElement, tokens: DesignFoundation) {
  const set = (k: string, v: string | number) => root.style.setProperty(k, String(v));
  // Colors
  const { palette } = tokens;
  // 1) Hex-Abbildung (maschinenlesbar, Debugging, direkte Nutzung möglich)
  Object.entries(palette).forEach(([key, value]) => set(`--color-${kebab(key)}`, value));
  // 2) HSL-Abbildung für Tailwind/Nutzt hsl(var(--token)) — überschreibt :root Defaults
  const hslKeys = [
    'primary', 'secondary', 'accent', 'background', 'surface',
    'textPrimary', 'textSecondary', 'error', 'warning', 'info', 'success',
  ] as const;
  hslKeys.forEach((k) => {
    const hex = palette[k];
    if (!hex) return;
    const triplet = hexToHslTriplet(hex);
    set(`--${kebab(k)}`, triplet);
  });
  // Motion
  Object.entries(tokens.motion.duration).forEach(([k, v]) => set(`--motion-duration-${k}`, v));
  Object.entries(tokens.motion.easing).forEach(([k, v]) => set(`--motion-easing-${k}`, v));
  // Spacing
  Object.entries(tokens.spacing).forEach(([k, v]) => set(`--space-${k}`, `${v}px`));
  // Z-Index
  Object.entries(tokens.zIndex).forEach(([k, v]) => set(`--z-${k}`, v));
}

function hexToHslTriplet(hex: string): string {
  // Unterstützt Formate #RRGGBB und #RGB
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.substring(0, 2), 16) / 255;
  const g = parseInt(full.substring(2, 4), 16) / 255;
  const b = parseInt(full.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  const H = Math.round(h * 360);
  const S = Math.round(s * 100);
  const L = Math.round(l * 100);
  // Tailwind erwartet Format: "H S% L%" (ohne Kommas)
  return `${H} ${S}% ${L}%`;
}

function kebab(s: string) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
