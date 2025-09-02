import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Grid,
  Button,
  Divider,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

import RequiredFieldIndicator from '../../../ui-elements/required-field-indicator'

const StripePaymentForm = ({ subscriptionFormData, setSubscriptionFormData, setCurrentStep }) => {
  // These hooks will only work inside Elements provider
  const stripe = useStripe()
  const elements = useElements()
  const theme = useTheme()
  const [cardError, setCardError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const schema = yup.object().shape({
    nameOnCard: yup.string().trim().required('Name on card is required.'),
    email: yup.string().email('Invalid email').required('Email is required for receipt.'),
  })

  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nameOnCard: subscriptionFormData?.nameOnCard || '',
      email: subscriptionFormData?.email || '',
    },
  })

  const { errors } = formState

  // Match MUI TextField styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '14px',
        color: theme.palette.text.primary,
        '::placeholder': {
          color: theme.palette.text.secondary,
        },
        fontFamily: theme.typography.fontFamily,
        fontSmoothing: 'antialiased',
        lineHeight: '40px',
      },
      invalid: {
        color: theme.palette.error.main,
        iconColor: theme.palette.error.main,
      },
    },
    hidePostalCode: false,
  }

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message)
    } else {
      setCardError(null)
    }
  }

  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      setCardError('Stripe is not loaded. Please refresh and try again.')
      return
    }

    setIsProcessing(true)
    setCardError(null)

    const cardElement = elements.getElement(CardElement)

    try {
      // Create token instead of payment method
      const { error, token } = await stripe.createToken(cardElement, {
        name: data.nameOnCard,
        email: data.email,
      })

      if (error) {
        setCardError(error.message)
        setIsProcessing(false)
        return
      }

      // Store token and user data (simplified without metadata)
      const newData = {
        ...subscriptionFormData,
        ...data,
        stripeToken: token.id,
        cardLast4: token.card.last4,
        cardBrand: token.card.brand,
      }

      setSubscriptionFormData(newData)
      setIsProcessing(false)
      setCurrentStep(1)
    } catch {
      setCardError('An error occurred. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmit)()
        }}
      >
        <Box p={3}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography component="p" mb={1}>
                Email for Receipt
                <RequiredFieldIndicator />
              </Typography>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="your@email.com"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isProcessing}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Typography component="p" mb={1}>
                Name on Card
                <RequiredFieldIndicator />
              </Typography>
              <Controller
                name="nameOnCard"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="John Doe"
                    variant="outlined"
                    error={!!errors.nameOnCard}
                    helperText={errors.nameOnCard?.message}
                    disabled={isProcessing}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Typography component="p" mb={1}>
                Card Information
                <RequiredFieldIndicator />
              </Typography>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: cardError ? theme.palette.error.main : 'rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  padding: '8.5px 14px',
                  backgroundColor: isProcessing ? '#f5f5f5' : 'white',
                  transition: 'border-color 0.3s',
                  '&:hover': {
                    borderColor: cardError ? theme.palette.error.main : 'rgba(0, 0, 0, 0.87)',
                  },
                  '&:focus-within': {
                    borderColor: cardError ? theme.palette.error.main : theme.palette.primary.main,
                    borderWidth: '2px',
                    padding: '7.5px 13px',
                  },
                }}
              >
                <CardElement
                  options={cardElementOptions}
                  onChange={handleCardChange}
                  disabled={isProcessing}
                />
              </Box>
              {cardError && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 0.5, ml: 1.75, display: 'block' }}
                >
                  {cardError}
                </Typography>
              )}
            </Grid>

            <Grid size={12}>
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Your payment information is securely processed by Stripe. We never store your card
                  details.
                </Typography>
              </Alert>
            </Grid>

            {/* Test mode notice */}
            {process.env.NODE_ENV === 'development' && (
              <Grid size={12}>
                <Alert severity="warning">
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Test Mode - Use these test cards:
                  </Typography>
                  <Typography variant="body2">• Success: 4242 4242 4242 4242</Typography>
                  <Typography variant="body2">
                    • Requires authentication: 4000 0025 0000 3155
                  </Typography>
                  <Typography variant="body2">• Declined: 4000 0000 0000 0002</Typography>
                  <Typography variant="caption">
                    Use any future date for expiry and any 3 digits for CVC
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider sx={{ mt: 2 }} />

        <Box p={2} textAlign="right">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!stripe || isProcessing}
            sx={{
              borderRadius: '8px',
              fontWeight: 600,
              minWidth: '100px',
            }}
          >
            {isProcessing ? <CircularProgress size={20} color="inherit" /> : 'Next'}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

StripePaymentForm.propTypes = {
  subscriptionFormData: PropTypes.shape({
    nameOnCard: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  setSubscriptionFormData: PropTypes.func.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
}

export default StripePaymentForm
