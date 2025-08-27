import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Button, Divider, TextField, Typography, InputAdornment } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

import CreditCard from '../../../../../assets/images/cards.png'
import Creditcvv from '../../../../../assets/images/cvv.png'
import RequiredFieldIndicator from '../../../ui-elements/required-field-indicator'

const AddNewCard = ({ subscriptionFormData, setSubscriptionFormData, setCurrentStep }) => {
  const today = new Date()
  const currentYear = today.getFullYear() % 100
  const currentMonth = today.getMonth() + 1

  const schema = yup.object().shape({
    cardNumber: yup
      .string()
      .required('Card number is required.')
      .transform((_, originalValue) => originalValue.replace(/\s/g, ''))
      .test('Length', 'Invalid card number', (value) => value?.length >= 13 && value?.length <= 16),
    expDate: yup
      .string()
      .required('Expiration date is required.')
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid date (MM/YY).')
      .test('is-valid-exp-date', 'Invalid expiration date.', (value) => {
        const [monthStr, yearStr] = value.split('/')
        const month = parseInt(monthStr, 10)
        const parsedYear = parseInt(yearStr, 10)
        if (parsedYear < currentYear || parsedYear > currentYear + 100) {
          return false
        }
        return parsedYear === currentYear ? month >= currentMonth : month >= 1 && month <= 12
      }),
    cardCode: yup
      .string()
      .required('Card code is required.')
      .test('Length', 'Invalid Length.', (value) => value?.length === 3 || value?.length === 4),

    nameOnCard: yup.string().trim().required('Name on card is required.'),
  })

  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cardNumber: subscriptionFormData?.cardNumber || '',
      expDate: subscriptionFormData?.expDate || '',
      cardCode: subscriptionFormData?.cardCode || '',
      nameOnCard: subscriptionFormData?.nameOnCard || '',
    },
  })

  const { errors } = formState

  const handleKeyPress = (event) => {
    const isNumeric = /^\d+$/
    if (!isNumeric.test(event.key)) {
      event.preventDefault()
    }
  }

  const onSubmit = (data) => {
    const newData = { ...data, ...subscriptionFormData }
    setSubscriptionFormData(newData)
    setCurrentStep(1)
  }

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit(onSubmit)()
        }}
      >
        <Box p={3}>
          <Grid container spacing={1} columnSpacing={2}>
            <Grid size={{ xs: 12 }} mb={1}>
              <Typography component="p">
                Card Number
                <RequiredFieldIndicator />
              </Typography>

              <Controller
                name="cardNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    size="small"
                    {...field}
                    fullWidth
                    placeholder="1234 1234 1234 1234"
                    variant="outlined"
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber?.message}
                    slotProps={{
                      input: {
                        inputProps: {
                          pattern: '[0-9]*',
                          maxLength: 16,
                          endAdornment: (
                            <InputAdornment position="end">
                              <img src={CreditCard} alt="Credit Cards" style={{ height: '20px' }} />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                    onKeyPress={handleKeyPress}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} mb={1}>
              <Typography component="p">
                Expiration Date
                <RequiredFieldIndicator />
              </Typography>
              <Controller
                name="expDate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="MM/YY"
                    variant="outlined"
                    error={!!errors.expDate}
                    helperText={errors.expDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} mb={1}>
              <Typography component="p">
                CVV/CVC
                <RequiredFieldIndicator />
              </Typography>
              <Controller
                name="cardCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Enter your card's CVV/CVC"
                    variant="outlined"
                    error={!!errors.cardCode}
                    helperText={errors.cardCode?.message}
                    inputProps={{
                      pattern: '[0-9]*',
                      maxLength: 4,
                      endAdornment: (
                        <InputAdornment position="end">
                          <img src={Creditcvv} alt="Credit Cards" style={{ height: '45px' }} />
                        </InputAdornment>
                      ),
                    }}
                    onKeyPress={handleKeyPress}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }} mb={1}>
              <Typography component="p">
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
                    placeholder="Name on Card"
                    variant="outlined"
                    error={!!errors.nameOnCard}
                    helperText={errors.nameOnCard?.message}
                    inputProps={{
                      maxLength: 100,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Box p={2} textAlign="right">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ borderRadius: '8px', fontWeight: 600 }}
          >
            Next
          </Button>
        </Box>
      </form>
    </Box>
  )
}

AddNewCard.propTypes = {
  subscriptionFormData: PropTypes.shape({
    cardNumber: PropTypes.string,
    expDate: PropTypes.string,
    cardCode: PropTypes.string,
    nameOnCard: PropTypes.string,
  }).isRequired,
  setSubscriptionFormData: PropTypes.func.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
}

export default AddNewCard
