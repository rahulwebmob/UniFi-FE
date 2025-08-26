import { alpha, createTheme } from '@mui/material/styles'

import { colors } from './foundations/colors'
import { components } from './foundations/components'
import { spacing, breakpoints, borderRadius } from './foundations/spacing'
import { typography } from './foundations/typography'

// UniCitizens brand gradient definitions
const gradients = {
  // Primary Deep Blue - Core brand gradient
  primary: `linear-gradient(135deg, ${colors.primary[800]} 0%, ${colors.primary.main} 50%, ${colors.primary[300]} 100%)`,

  // Green - Secondary gradient
  secondary: `linear-gradient(135deg, ${colors.secondary[700]} 0%, ${colors.secondary.main} 50%, ${colors.secondary[400]} 100%)`,

  // Sky Blue - Info gradient
  info: `linear-gradient(135deg, ${colors.info[700]} 0%, ${colors.info.main} 50%, ${colors.info[300]} 100%)`,

  // Success - Green gradient
  success: `linear-gradient(135deg, ${colors.success[700]} 0%, ${colors.success.main} 50%, ${colors.success[400]} 100%)`,

  // Warning - Amber gradient
  warning: `linear-gradient(135deg, ${colors.warning[700]} 0%, ${colors.warning.main} 50%, ${colors.warning[300]} 100%)`,

  // Error - Red gradient
  error: `linear-gradient(135deg, ${colors.error[700]} 0%, ${colors.error.main} 50%, ${colors.error[400]} 100%)`,

  // Glass effect for overlays
  glass: `linear-gradient(135deg, ${alpha('#FFFFFF', 0.08)} 0%, ${alpha('#FFFFFF', 0.02)} 100%)`,

  // UniCitizens branded gradients
  ocean: `linear-gradient(135deg, ${colors.primary[900]} 0%, ${colors.primary.main} 50%, ${colors.accent.lightBlue} 100%)`,
  navy: `linear-gradient(135deg, ${colors.tertiary.navy} 0%, ${colors.accent.navy} 50%, ${colors.accent.skyBlue} 100%)`,
  forest: `linear-gradient(135deg, ${colors.secondary[800]} 0%, ${colors.secondary.main} 50%, ${colors.secondary[300]} 100%)`,
  sky: `linear-gradient(135deg, ${colors.accent.skyBlue} 0%, ${colors.accent.lightBlue} 50%, ${colors.primary[200]} 100%)`,

  // Professional themed gradients for education platform
  professional: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.tertiary.brandBlue} 50%, ${colors.accent.lightBlue} 100%)`,
  modern: `linear-gradient(135deg, ${colors.tertiary.navy} 0%, ${colors.primary.main} 50%, ${colors.accent.skyBlue} 100%)`,
  education: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.accent.navy} 50%, ${colors.secondary[400]} 100%)`,

  // Additional gradients
  sunset: `linear-gradient(135deg, ${colors.warning[800]} 0%, ${colors.warning.main} 50%, ${colors.warning[300]} 100%)`,
  aurora: `linear-gradient(135deg, ${colors.info[800]} 0%, ${colors.info.main} 50%, ${colors.info[300]} 100%)`,
  health: `linear-gradient(135deg, ${colors.success[800]} 0%, ${colors.success.main} 50%, ${colors.success[300]} 100%)`,
}

// UniCitizens shadow system with brand colors
const customShadows = {
  // Standard shadows
  card: `0px 1px 3px ${alpha(colors.primary.main, 0.04)}, 0px 2px 8px ${alpha(colors.primary.dark, 0.08)}`,
  dialog: `0px 4px 16px ${alpha(colors.primary.main, 0.08)}, 0px 8px 32px ${alpha(colors.primary.dark, 0.12)}`,
  dropdown: `0px 2px 8px ${alpha(colors.grey[600], 0.15)}, 0px 4px 16px ${alpha(colors.grey[600], 0.1)}`,
  tooltip: `0px 2px 8px ${alpha(colors.grey[700], 0.2)}`,
  button: `0px 2px 4px ${alpha(colors.primary.main, 0.15)}, 0px 4px 8px ${alpha(colors.primary.main, 0.1)}`,
  buttonHover: `0px 4px 12px ${alpha(colors.primary.main, 0.2)}, 0px 8px 24px ${alpha(colors.primary.main, 0.15)}`,
  colored: `0px 4px 16px ${alpha(colors.primary.main, 0.18)}`,

  // Content shadows (matching the one you're using)
  content: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
  contentHover: '0px 0px 15px 0px rgba(0, 0, 0, 0.15)',

  // Brand colored shadows
  primary: `0px 0px 10px 0px ${alpha(colors.primary.main, 0.15)}`,
  primaryStrong: `0px 0px 15px 0px ${alpha(colors.primary.main, 0.25)}`,
  primarySubtle: `0px 0px 8px 0px ${alpha(colors.primary.main, 0.08)}`,

  secondary: `0px 0px 10px 0px ${alpha(colors.secondary.main, 0.15)}`,
  secondaryStrong: `0px 0px 15px 0px ${alpha(colors.secondary.main, 0.25)}`,
  secondarySubtle: `0px 0px 8px 0px ${alpha(colors.secondary.main, 0.08)}`,

  // Elevation levels (neutral)
  elevation1: `0px 1px 2px ${alpha('#000000', 0.05)}`,
  elevation2: `0px 1px 3px ${alpha('#000000', 0.04)}, 0px 1px 2px ${alpha('#000000', 0.06)}`,
  elevation3: `0px 2px 4px ${alpha('#000000', 0.04)}, 0px 2px 8px ${alpha('#000000', 0.06)}`,
  elevation4: `0px 4px 8px ${alpha('#000000', 0.04)}, 0px 4px 16px ${alpha('#000000', 0.08)}`,

  // Special effects
  glow: `0px 0px 20px 0px ${alpha(colors.primary.main, 0.3)}`,
  soft: '0px 2px 8px 0px rgba(0, 0, 0, 0.06)',
  medium: '0px 4px 12px 0px rgba(0, 0, 0, 0.08)',
  strong: '0px 8px 24px 0px rgba(0, 0, 0, 0.12)',
}

// Create base theme with enhanced foundations
const baseThemeOptions = {
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    success: colors.success,

    background: {
      default: colors.background.default,
      paper: colors.background.paper,
      surface: colors.background.surface,
      elevated: colors.background.elevated,
      overlay: colors.background.overlay,
      light: colors.background.light,
      subtle: colors.background.subtle,
    },

    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },

    grey: colors.grey,

    common: colors.common,

    accent: colors.accent,
    glass: colors.glass,

    divider: alpha(colors.grey[300], 0.24),

    action: {
      active: colors.primary.main,
      hover: alpha(colors.primary.main, 0.08),
      selected: alpha(colors.primary.main, 0.12),
      disabled: alpha(colors.grey[400], 0.8),
      disabledBackground: alpha(colors.grey[300], 0.24),
    },
  },

  typography,
  spacing,
  breakpoints,

  shape: {
    borderRadius: borderRadius.md,
  },

  shadows: [
    'none',
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.card,
    customShadows.dialog,
    customShadows.dialog,
    customShadows.dialog,
    customShadows.dialog,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
    customShadows.dropdown,
  ],

  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
}

// Create theme with base options
const baseTheme = createTheme(baseThemeOptions)

// Create final theme with components and custom properties
export const theme = createTheme(baseTheme, {
  components,
})

// Add custom properties to theme
const extendedTheme = theme

extendedTheme.customShadows = customShadows
extendedTheme.gradients = gradients

// Export additional theme utilities
export { colors, spacing, typography, borderRadius }
export { gradients, customShadows }
