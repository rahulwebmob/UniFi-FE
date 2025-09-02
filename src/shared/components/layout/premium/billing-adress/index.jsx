import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Grid,
  Link,
  Button,
  useTheme,
  Checkbox,
  TextField,
  Typography,
  RadioGroup,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Autocomplete,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

import countries from '../../../../../constants/countries'
import FlagDisplay from '../../../flag-display'
import RequiredFieldIndicator from '../../../ui-elements/required-field-indicator'

const BillingAddress = ({ subscriptionFormData, setSubscriptionFormData, setCurrentStep }) => {
  const theme = useTheme()
  const zipRegex = /^[0-9a-zA-Z]+(?:-[0-9a-zA-Z]+)?(?: [0-9a-zA-Z]+)?$/

  const schema = yup.object().shape({
    firstName: yup.string().trim().required('First name is required.'),
    lastName: yup.string().trim().required('Last name is required.'),
    address: yup
      .string()
      .trim()
      .required('Address is required.')
      .test('Size', 'Maximum allowed length is 60.', (value) => value.length <= 60),
    city: yup.string().trim().required('City is required.'),
    state: yup.string().trim().required('State is required.'),
    zip: yup
      .string()
      .trim()
      .required('ZIP code is required.')
      .matches(zipRegex, 'Invalid Zip code.'),
    country: yup.string().trim().required('Country is required.'),
    isAgree: yup.boolean().oneOf([true], 'Please agree to the terms and conditions.'),
  })

  const { control, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: subscriptionFormData?.firstName || '',
      lastName: subscriptionFormData?.lastName || '',
      country: subscriptionFormData?.country || '',
      state: subscriptionFormData?.state || '',
      city: subscriptionFormData?.city || '',
      zip: subscriptionFormData?.zip || '',
      address: subscriptionFormData?.address || '',
    },
  })

  const onSubmit = (data) => {
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
        handleSubmit(onSubmit)()
      }}
    >
      <Box p={3}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography component="p">
              First Name
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
                  placeholder="First Name"
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
              Last Name
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
                  placeholder="Last Name"
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
              Country
              <RequiredFieldIndicator />
            </Typography>
            <Controller
              name="country"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  value={countries.find((country) => country.value === value) || null}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.value : '')
                  }}
                  options={countries}
                  getOptionLabel={(option) => option.value || ''}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      {...props}
                    >
                      <FlagDisplay countryCode={option.code} size={20} />
                      {option.value}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select your country"
                      error={!!errors.country}
                      helperText={errors.country?.message}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: value && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                            <FlagDisplay countryCode={countries.find((c) => c.value === value)?.code} size={20} />
                          </Box>
                        ),
                      }}
                    />
                  )}
                  fullWidth
                  autoHighlight
                  clearOnEscape
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography component="p">
              State
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
                  placeholder="State"
                  variant="outlined"
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography component="p">
              City
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
                  placeholder="City"
                  variant="outlined"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography component="p">
              ZIP code
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
              Address
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
                  placeholder="144 WallStreet, NewYork"
                  variant="outlined"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
      <Box px={3} pb={3} display="flex" justifyContent="space-between" alignItems="center">
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
                    setValue('isAgree', e.target.checked)
                  }}
                  label={
                    <Typography>
                      I agree to the&nbsp;
                      <Link
                        underline="hover"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.primary.main,
                        }}
                      >
                        terms and conditions
                      </Link>
                      &nbsp; of use.
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
        <Box gap={1} display="flex" alignItems="center" justifyContent="space-between">
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
            Continue
          </Button>
        </Box>
      </Box>
    </form>
  )
}

BillingAddress.propTypes = {
  subscriptionFormData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    country: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    zip: PropTypes.string,
    address: PropTypes.string,
  }),
  setSubscriptionFormData: PropTypes.func,
  setCurrentStep: PropTypes.func,
}

export default BillingAddress
