import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import { Elements } from '@stripe/react-stripe-js'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import { getStripe, STRIPE_CONFIG } from '../../../../../config/stripe'
import ReviewEducation from '../review-education'

const ReviewEducationWrapper = ({
  transactionInfo,
  setCurrentStep,
  closeModal,
  purchaseDetails,
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
      <ReviewEducation
        transactionInfo={transactionInfo}
        setCurrentStep={setCurrentStep}
        closeModal={closeModal}
        purchaseDetails={purchaseDetails}
      />
    </Elements>
  )
}

ReviewEducationWrapper.propTypes = {
  transactionInfo: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    country: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    address: PropTypes.string,
    email: PropTypes.string,
    paymentMethodId: PropTypes.string,
    cardLast4: PropTypes.string,
    cardBrand: PropTypes.string,
  }),
  setCurrentStep: PropTypes.func,
  closeModal: PropTypes.func,
  purchaseDetails: PropTypes.shape({
    purchaseType: PropTypes.string,
    title: PropTypes.string,
    _id: PropTypes.string,
    scheduledDate: PropTypes.string,
    thumbNail: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
}

export default ReviewEducationWrapper
