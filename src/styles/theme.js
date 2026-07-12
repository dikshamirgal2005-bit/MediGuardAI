export const COLORS = {
  background: '#FAF8FF', // Soft clean white-lavender background
  cardBg: '#FFFFFF',     // Pure white card backgrounds
  cardBgElevated: '#F5EFFF', // Light pastel purple for active items
  border: '#E8DFFE',     // Lavender border outline
  text: '#1E1430',       // Deep dark plum/purple text
  textSecondary: '#6B548A', // Muted slate-purple for subtitles
  primary: '#6D28D9',    // Royal Brand Purple
  primaryLight: '#8B5CF6', // Medium violet accent
  danger: '#DC2626',     // Warning red
  dangerLight: '#EF4444',
  warning: '#D97706',    // Caution Amber
  warningLight: '#F59E0B',
  info: '#4F46E5',       // Indigo details
  infoLight: '#6366F1',
  accent: '#A21CAF',     // Fuchsia chat accent
  accentLight: '#C084FC',
  success: '#059669',    // Safety green
  overlay: 'rgba(30, 20, 48, 0.4)', // Translucent dark purple overlay
};

export const TYPOGRAPHY = {
  fontFamily: 'System',
  h1: { fontSize: 24, fontWeight: 'bold', letterSpacing: 0.5 },
  h2: { fontSize: 20, fontWeight: '700', letterSpacing: 0.5 },
  h3: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: 'normal', lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '500' },
  caption: { fontSize: 10, fontWeight: '400', color: '#94A3B8' },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 9.11,
    elevation: 8,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  borderRadius: 12,
  borderRadiusLarge: 16,
};
