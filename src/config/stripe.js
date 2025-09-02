import { loadStripe } from '@stripe/stripe-js'

import { ENV } from '../utils/env'

// Initialize Stripe with your publishable key
// This will be loaded once and reused throughout the app
let stripePromise = null

export const getStripe = () => {
  if (!stripePromise && ENV.STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(ENV.STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

// Stripe configuration options
export const STRIPE_CONFIG = {
  // Appearance customization for Stripe Elements
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorSurface: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
    },
  },
  // Element options
  elementOptions: {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    },
  },
}

// Test cards for development
export const TEST_CARDS = {
  SUCCESS: '4242424242424242',
  DECLINED: '4000000000000002',
  REQUIRES_AUTHENTICATION: '4000002500003155',
  INSUFFICIENT_FUNDS: '4000000000009995',
}

// Payment method types
export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  WALLET: 'wallet',
}

// Currency configuration
export const CURRENCY = {
  DEFAULT: 'usd',
  SYMBOL: '$',
}
