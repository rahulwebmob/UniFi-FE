import React from 'react'
import * as yup from 'yup'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  Box,
  Grid,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'

import Creditcvv from '../../../../../assets/images/cvv.png'
import CreditCard from '../../../../../assets/images/cards.png'
import RequiredFieldIndicator from '../../../ui-elements/required-field-indicator'

interface SubscriptionFormData {
  cardHolderName?: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  [key: string]: unknown
}

interface AddNewCardProps {
  subscriptionFormData: SubscriptionFormData
  setSubscriptionFormData: (data: SubscriptionFormData) => void
  setCurrentStep: (step: number) => void
}

const AddNewCard = ({
  subscriptionFormData,
  setSubscriptionFormData,
  setCurrentStep,
}: AddNewCardProps) => {
  const today = new Date()
  const { t } = useTranslation('application')
  const currentYear = today.getFullYear() % 100
  const currentMonth = today.getMonth() + 1

  const schema = yup.object().shape({
    cardNumber: yup
      .string()
      .required(t('application:PREMIUM_MODAL.VALIDATION_CARD_NUMBER'))
      .transform((_, originalValue) => originalValue.replace(/\s/g, ''))
      .test(
        'Length',
        t('application:PREMIUM_MODAL.VALIDATION_INVALID_CARD'),
        (value) => value?.length >= 13 && value?.length <= 16,
      ),
    expDate: yup
      .string()
      .required(t('application:PREMIUM_MODAL.VALIDATION_EXPIRY_DATE'))
      .matches(
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        t('application:PREMIUM_MODAL.VALIDATION_INVALID_DATE'),
      )
      .test(
        'is-valid-exp-date',
        t('application:PREMIUM_MODAL.VALIDATION_EXPIRATION_DATE'),
        (value) => {
          const [monthStr, yearStr] = value.split('/')
          const month = parseInt(monthStr, 10)
          const parsedYear = parseInt(yearStr, 10)
          if (parsedYear < currentYear || parsedYear > currentYear + 100) {
            return false
          }
          return parsedYear === currentYear
            ? month >= currentMonth
            : month >= 1 && month <= 12
        },
      ),
    cardCode: yup
      .string()
      .required(t('application:PREMIUM_MODAL.VALIDATION_CARD_CODE'))
      .test(
        'Length',
        t('application:PREMIUM_MODAL.VALIDATION_INVALID_CODE'),
        (value) => value?.length === 3 || value?.length === 4,
      ),

    nameOnCard: yup
      .string()
      .trim()
      .required(t('application:PREMIUM_MODAL.VALIDATION_NAME_CARD')),
  })

  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cardNumber: (subscriptionFormData?.cardNumber as string) || '',
      expDate: (subscriptionFormData?.expDate as string) || '',
      cardCode: (subscriptionFormData?.cardCode as string) || '',
      nameOnCard: (subscriptionFormData?.nameOnCard as string) || '',
    },
  })

  const { errors } = formState

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const isNumeric = /^\d+$/
    if (!isNumeric.test(event.key)) {
      event.preventDefault()
    }
  }

  const onSubmit = (data: SubscriptionFormData) => {
    const newData = { ...data, ...subscriptionFormData }
    setSubscriptionFormData(newData)
    setCurrentStep(3)
  }

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit(onSubmit)()
        }}
      >
        <Box p={2} pb={1} display="flex" alignItems="center">
          <IconButton disableRipple>
            <ArrowLeft
              size={20}
              // sx={{ cursor: 'pointer' }}
              onClick={() => setCurrentStep(1)}
            />
          </IconButton>
          <Typography variant="h6">
            {t('application:PREMIUM_MODAL.ADD_NEW_CARD')}
          </Typography>
        </Box>
        <Divider
          sx={{
            my: 1,
            borderColor: (theme) => theme.palette.primary.main,
          }}
        />
        <Box pl={2} pr={2}>
          <Grid container spacing={1} columnSpacing={2}>
            <Grid size={{ xs: 12 }} mb={1}>
              <Typography component="p">
                {t('application:PREMIUM_MODAL.CARD_NUMBER')}
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
                              <img
                                src={CreditCard}
                                alt="Credit Cards"
                                style={{ height: '20px' }}
                              />
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
                {t('application:PREMIUM_MODAL.EXPIRY_DATE')}
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
                    placeholder={t(
                      'application:PREMIUM_MODAL.EXPIRY_DATE_FORMAT',
                    )}
                    variant="outlined"
                    error={!!errors.expDate}
                    helperText={errors.expDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} mb={1}>
              <Typography component="p">
                {t('application:PREMIUM_MODAL.CVV/CVC')}
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
                    placeholder={t(
                      'application:PREMIUM_MODAL.PLACEHOLDER_CVV/CVC',
                    )}
                    variant="outlined"
                    error={!!errors.cardCode}
                    helperText={errors.cardCode?.message}
                    inputProps={{
                      pattern: '[0-9]*',
                      maxLength: 4,
                      endAdornment: (
                        <InputAdornment position="end">
                          <img
                            src={Creditcvv}
                            alt="Credit Cards"
                            style={{ height: '45px' }}
                          />
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
                {t('application:PREMIUM_MODAL.NAME_ON_CARD')}
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
                    placeholder={t('application:PREMIUM_MODAL.NAME_ON_CARD')}
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
            {t('application:PREMIUM_MODAL.ADD_CARD')}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default AddNewCard
