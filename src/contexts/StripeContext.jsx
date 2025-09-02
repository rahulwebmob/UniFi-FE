import { Elements } from '@stripe/react-stripe-js'
import PropTypes from 'prop-types'
import { createContext, useContext, useState, useEffect } from 'react'

import { getStripe, STRIPE_CONFIG } from '../config/stripe'

const StripeContext = createContext(null)

const useStripeContext = () => {
  const context = useContext(StripeContext)
  if (!context) {
    throw new Error('useStripeContext must be used within StripeProvider')
  }
  return context
}

export { useStripeContext }

export const StripeProvider = ({ children }) => {
  const [stripe, setStripe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripeInstance = await getStripe()
        setStripe(stripeInstance)
      } catch (err) {
        console.error('Failed to initialize Stripe:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    initStripe()
  }, [])

  const value = {
    stripe,
    isLoading,
    error,
  }

  if (!stripe) {
    return <StripeContext.Provider value={value}>{children}</StripeContext.Provider>
  }

  return (
    <StripeContext.Provider value={value}>
      <Elements stripe={stripe} options={STRIPE_CONFIG.appearance}>
        {children}
      </Elements>
    </StripeContext.Provider>
  )
}

StripeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default StripeProvider
