import React from 'react'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  Box,
  Grid,
  Link,
  Button,
  MenuItem,
  useTheme,
  Checkbox,
  TextField,
  Typography,
  RadioGroup,
  FormControl,
  FormHelperText,
  FormControlLabel,
} from '@mui/material'

import countries from '../../../../../constants/countries'
import RequiredFieldIndicator from '../../../ui-elements/required-field-indicator'

interface SubscriptionFormData {
  country?: string
  state?: string
  city?: string
  address?: string
  [key: string]: unknown
}

interface BillingAddressProps {
  subscriptionFormData: SubscriptionFormData
  setSubscriptionFormData: React.Dispatch<
    React.SetStateAction<SubscriptionFormData>
  >
  setCurrentStep: (step: number | ((prev: number) => number)) => void
}

const BillingAddress: React.FC<BillingAddressProps> = ({
  subscriptionFormData,
  setSubscriptionFormData,
  setCurrentStep,
}) => {
  const { t } = useTranslation('application')
  const theme = useTheme()
  const zipRegex = /^[0-9a-zA-Z]+(?:-[0-9a-zA-Z]+)?(?: [0-9a-zA-Z]+)?$/

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .trim()
      .required(t('application:PREMIUM_MODAL.VALIDATION_FIRSTNAME_REQ')),
    lastName: yup
      .string()
      .trim()
      .required(t('application:PREMIUM_MODAL.VALIDATION_LASTNAME_REQ')),
    address: yup
      .string()
      .trim()
      .required(t('application:PREMIUM_MODAL.VALIDATION_ADDRESS_REQ'))
      .test(
        'Size',
        t('application:PREMIUM_MODAL.VALIDATION_ADDRESS_LENGTH'),
        (value) => value.length <= 60,
      ),
    city: yup
      .string()
      .trim()
      .required(t('application:PREMIUM_MODAL.VALIDATION_CITY_REQ')),
    state: yup
      .string()
      .trim()
      .required(t('application:PREMIUM_MODAL.VALIDATION_STATE_REQ')),
    zip: yup
      .string()
      .trim()
      .required(t('application:PREMIUM_MODAL.VALIDATION_ZIP_REQ'))
      .matches(zipRegex, t('application:PREMIUM_MODAL.VALIDATION_INVALID_ZIP')),
    country: yup
      .string()
      .trim()
      .required(t('application:PREMIUM_MODAL.VALIDATION_COUNTRY_REQ')),
    isAgree: yup
      .boolean()
      .oneOf([true], t('application:PREMIUM_MODAL.VALIDATION_ISAGREE')),
  })

  const { control, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: (subscriptionFormData?.firstName as string) || '',
      lastName: (subscriptionFormData?.lastName as string) || '',
      country: (subscriptionFormData?.country as string) || '',
      state: (subscriptionFormData?.state as string) || '',
      city: (subscriptionFormData?.city as string) || '',
      zip: (subscriptionFormData?.zip as string) || '',
      address: (subscriptionFormData?.address as string) || '',
    },
  })

  const onSubmit = (data: SubscriptionFormData) => {
    // Handle form submission here
    const newData = { ...data, ...subscriptionFormData }
    setSubscriptionFormData(newData)
    setCurrentStep((prev) => prev + 1)
  }

  const { errors } = formState

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void handleSubmit(onSubmit)()
      }}
    >
      <Box p={3}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography component="p">
              {t('application:PREMIUM_MODAL.FIRST_NAME')}
              <RequiredFieldIndicator />
            </Typography>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder={t('application:PREMIUM_MODAL.FIRST_NAME')}
                  variant="outlined"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  inputProps={{
                    maxLength: 100,
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography component="p">
              {t('application:PREMIUM_MODAL.LAST_NAME')}
              <RequiredFieldIndicator />
            </Typography>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder={t('application:PREMIUM_MODAL.LAST_NAME')}
                  variant="outlined"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  inputProps={{
                    maxLength: 100,
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography component="p">
              {t('application:PREMIUM_MODAL.COUNTRY')}
              <RequiredFieldIndicator />
            </Typography>
            <Controller
              name="country"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  size="small"
                  placeholder={t('application:PREMIUM_MODAL.SELECT_COUNTRY')}
                  variant="outlined"
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>{t('application:PREMIUM_MODAL.SELECT_COUNTRY')}</em>
                  </MenuItem>
                  {countries.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.value}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography component="p">
              {t('application:PREMIUM_MODAL.STATE')}
              <RequiredFieldIndicator />
            </Typography>
            <Controller
              name="state"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder={t('application:PREMIUM_MODAL.STATE')}
                  variant="outlined"
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography component="p">
              {t('application:PREMIUM_MODAL.CITY')}
              <RequiredFieldIndicator />
            </Typography>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder={t('application:PREMIUM_MODAL.CITY')}
                  variant="outlined"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography component="p">
              {t('application:PREMIUM_MODAL.ZIP_CODE')}
              <RequiredFieldIndicator />
            </Typography>
            <Controller
              name="zip"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="000000"
                  variant="outlined"
                  error={!!errors.zip}
                  helperText={errors.zip?.message}
                  inputProps={{
                    maxLength: 10,
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography component="p">
              {t('application:PREMIUM_MODAL.ADDRESS')}
              <RequiredFieldIndicator />
            </Typography>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder={t(
                    'application:PREMIUM_MODAL.PLACEHOLDER_ADDRESS',
                  )}
                  variant="outlined"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        px={3}
        pb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <FormControl component="fieldset">
          <Controller
            name="isAgree"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup row aria-label="subscriberType" {...field}>
                <FormControlLabel
                  value={false}
                  control={<Checkbox />}
                  onChange={(e) => {
                    setValue('isAgree', (e.target as HTMLInputElement).checked)
                  }}
                  label={
                    <Typography>
                      {t('application:PREMIUM_MODAL.TERMS_AGREEMENT-1')}&nbsp;
                      <Link
                        underline="hover"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.primary.main,
                        }}
                      >
                        {t('application:PREMIUM_MODAL.TERMS_AGREEMENT-2')}
                      </Link>
                      &nbsp; {t('application:PREMIUM_MODAL.TERMS_AGREEMENT-3')}
                    </Typography>
                  }
                />
              </RadioGroup>
            )}
          />
          <FormHelperText sx={{ color: theme.palette.error.main }}>
            {errors.isAgree?.message}
          </FormHelperText>
        </FormControl>
        <Box
          gap={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            variant="outlined"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            sx={{ borderRadius: '8px' }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ borderRadius: '8px', fontWeight: 600 }}
          >
            {t('application:PREMIUM_MODAL.CONTINUE')}
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default BillingAddress
