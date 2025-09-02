import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import { Elements } from '@stripe/react-stripe-js'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import { getStripe, STRIPE_CONFIG } from '../../../../../config/stripe'
import StripePaymentForm from '../stripe-payment-form'

const StripePaymentWrapper = ({
  subscriptionFormData,
  setSubscriptionFormData,
  setCurrentStep,
}) => {
  const [stripe, setStripe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripeInstance = await getStripe()
        if (!stripeInstance) {
          setError(
            'Stripe key not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment.',
          )
        } else {
          setStripe(stripeInstance)
        }
      } catch (err) {
        console.error('Failed to initialize Stripe:', err)
        setError('Failed to initialize payment system. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    initStripe()
  }, [])

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading payment system...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!stripe) {
    return (
      <Box p={3}>
        <Alert severity="warning">Payment system is not configured. Please contact support.</Alert>
      </Box>
    )
  }

  return (
    <Elements stripe={stripe} options={STRIPE_CONFIG.appearance}>
      <StripePaymentForm
        subscriptionFormData={subscriptionFormData}
        setSubscriptionFormData={setSubscriptionFormData}
        setCurrentStep={setCurrentStep}
      />
    </Elements>
  )
}

StripePaymentWrapper.propTypes = {
  subscriptionFormData: PropTypes.shape({
    nameOnCard: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  setSubscriptionFormData: PropTypes.func.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
}

export default StripePaymentWrapper
