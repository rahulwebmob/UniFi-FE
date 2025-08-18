export const colors = {
  // Primary Colors - UniCitizens Brand Palette
  primary: {
    main: '#114262', // UniCitizens Deep Blue - Core brand color
    light: '#87A3B6', // UniCitizens Light Blue
    dark: '#0A2A42', // Darker variant
    contrastText: '#FFFFFF',
    50: '#E8F0F5',
    100: '#C5DAE7',
    200: '#9FC2D7',
    300: '#87A3B6', // Brand Light Blue
    400: '#5B7A94',
    500: '#3D5E7B',
    600: '#265677', // Brand Medium Blue
    700: '#1A4766',
    800: '#114262', // Main brand color
    900: '#0A2A42',
  },

  // Secondary Colors - UniCitizens Green
  secondary: {
    main: '#208544', // UniCitizens Green - Supporting color
    light: '#4CAF50',
    dark: '#165F31',
    contrastText: '#FFFFFF',
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#208544', // Main secondary green
    700: '#1B5E20',
    800: '#165F31',
    900: '#0D3E19',
  },

  // Additional Secondary Colors - UniCitizens Brand
  secondaryVariants: {
    red: '#D2312A', // UniCitizens Red - Alert/Error color
    skyBlue: '#4F9DD1', // UniCitizens Sky Blue - Info color
    navy: '#27488F', // UniCitizens Navy - Professional accent
  },

  // Tertiary Colors - UI Structure colors
  tertiary: {
    slate: '#CBD5E1', // For dividers, lines, inactive UI
    navy: '#114262', // UniCitizens Navy for contrast
    darkBlue: '#0A2A42', // Extra dark for high contrast
    lightGray: '#F8FAFC', // Light section backgrounds
    paleBlue: '#EBF4FA', // Subtle blue backgrounds
    brandBlue: '#265677', // Medium brand blue
  },

  // Neutral Colors - Text and base layers
  neutral: {
    graphite: '#1F2937', // Main text color - darker for better contrast
    pureWhite: '#FFFFFF', // Basic background
    offWhite: '#FAFBFC', // Slightly tinted white
    divider: '#E5E7EB', // For separating elements
    muted: '#6B7280', // Labels, metadata
  },

  // Status Colors - State indicators
  status: {
    success: {
      deep: '#165F31', // Deep Green - Success accent
      main: '#208544', // UniCitizens Green - Success messages
      soft: '#E8F5E9', // Soft Green - Success background
    },
    warning: {
      main: '#F59E0B', // Amber - Warning indicators
      soft: '#FEF3C7', // Soft Yellow - Warning background
    },
    error: {
      main: '#D2312A', // UniCitizens Red - Error messages
      soft: '#FFEBEE', // Soft Red - Error background
    },
  },

  // System Colors - UniCitizens UI system colors
  error: {
    main: '#D2312A', // UniCitizens Red
    light: '#E57373',
    dark: '#B71C1C',
    contrastText: '#FFFFFF',
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#D2312A', // Main brand red
    700: '#C62828',
    800: '#B71C1C',
    900: '#8E1A1A',
  },

  warning: {
    main: '#F59E0B', // Amber
    light: '#FCD34D',
    dark: '#D97706',
    contrastText: '#FFFFFF',
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  info: {
    main: '#4F9DD1', // UniCitizens Sky Blue
    light: '#87A3B6',
    dark: '#27488F',
    contrastText: '#FFFFFF',
    50: '#EBF4FA',
    100: '#D6E9F5',
    200: '#B3D5EC',
    300: '#87A3B6', // Brand light blue
    400: '#6BB0D8',
    500: '#4F9DD1', // Main sky blue
    600: '#3E7FB8',
    700: '#27488F', // Navy blue
    800: '#1A3366',
    900: '#0F1F3D',
  },

  success: {
    main: '#208544', // UniCitizens Green
    light: '#4CAF50',
    dark: '#165F31',
    contrastText: '#FFFFFF',
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#208544', // Main brand green
    700: '#1B5E20',
    800: '#165F31',
    900: '#0D3E19',
  },

  // Background Colors - Clean and modern
  background: {
    default: '#FFFFFF',
    paper: '#FAFBFC', // Slightly off-white
    surface: '#F8FAFC', // Light surface
    elevated: 'rgba(255, 255, 255, 0.98)',
    overlay: 'rgba(15, 23, 42, 0.6)', // Dark overlay
    light: '#F1F5F9',
    subtle: '#F8FAFC',
  },

  // Text Colors - Better hierarchy
  text: {
    primary: '#1F2937', // Dark Gray for better contrast
    secondary: '#6B7280', // Medium Gray
    disabled: '#9CA3AF', // Light Gray
    hint: '#D1D5DB', // Very Light Gray
    inverse: '#FFFFFF',
  },

  // Neutral Colors - Modern gray scale
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Glass morphism effects
  glass: {
    light: 'rgba(255, 255, 255, 0.25)',
    medium: 'rgba(255, 255, 255, 0.45)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },

  // Accent Colors - UniCitizens brand accent colors
  accent: {
    primary: '#114262', // UniCitizens Deep Blue
    secondary: '#208544', // UniCitizens Green
    skyBlue: '#4F9DD1', // UniCitizens Sky Blue
    red: '#D2312A', // UniCitizens Red
    navy: '#27488F', // UniCitizens Navy
    lightBlue: '#87A3B6', // UniCitizens Light Blue
  },

  // Common
  common: {
    black: '#000000',
    white: '#FFFFFF',
  },
}
