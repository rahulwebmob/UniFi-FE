import { createTheme as getTheme } from '@mui/material/styles'

const defaultMuiTheme = getTheme()

function pxToRem(value) {
  return `${value / 16}rem`
}

function responsiveFontSizes(obj) {
  const breakpoints = defaultMuiTheme.breakpoints.keys

  return breakpoints.reduce((acc, breakpoint) => {
    const value = obj[breakpoint]

    if (value !== undefined && value >= 0) {
      acc[defaultMuiTheme.breakpoints.up(breakpoint)] = {
        fontSize: pxToRem(value),
      }
    }

    return acc
  }, {})
}

const primaryFont =
  '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif'
const secondaryFont =
  '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'

export const typography = {
  fontFamily: primaryFont,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontFamily: secondaryFont,
    fontWeight: 700,
    lineHeight: 1.2,
    fontSize: pxToRem(48),
    letterSpacing: '-0.02em',
    ...responsiveFontSizes({ sm: 56, md: 64, lg: 72 }),
  },
  h2: {
    fontFamily: secondaryFont,
    fontWeight: 700,
    lineHeight: 1.25,
    fontSize: pxToRem(36),
    letterSpacing: '-0.01em',
    ...responsiveFontSizes({ sm: 42, md: 48, lg: 56 }),
  },
  h3: {
    fontFamily: secondaryFont,
    fontWeight: 600,
    lineHeight: 1.3,
    fontSize: pxToRem(28),
    letterSpacing: '-0.005em',
    ...responsiveFontSizes({ sm: 32, md: 36, lg: 40 }),
  },
  h4: {
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 26, md: 28 }),
  },
  h5: {
    fontWeight: 600,
    lineHeight: 1.45,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 22 }),
  },
  h6: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 20 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.6,
    fontSize: pxToRem(16),
    letterSpacing: '0.01em',
  },
  body2: {
    lineHeight: 1.6,
    fontSize: pxToRem(14),
    letterSpacing: '0.01em',
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(15),
    letterSpacing: '0.02em',
    textTransform: 'none',
  },
}
