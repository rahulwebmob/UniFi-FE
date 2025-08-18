// Spacing scale based on 8px grid system
export const spacing = 8

// Custom spacing values for specific use cases
export const customSpacing = {
  xs: 4, // 0.5 * 8
  sm: 8, // 1 * 8
  md: 16, // 2 * 8
  lg: 24, // 3 * 8
  xl: 32, // 4 * 8
  xxl: 48, // 6 * 8
  xxxl: 64, // 8 * 8
}

// Breakpoints for responsive design
export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
}

// Container max widths
export const containerMaxWidths = {
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1440,
}

// Border radius values for consistent rounded corners
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
}

// Elevation values for depth
export const elevations = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
  xxl: 24,
}

// Z-index values for layering
export const zIndex = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
}

// Transition durations
export const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
}
