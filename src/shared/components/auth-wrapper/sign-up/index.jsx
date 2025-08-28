import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Button, TextField, IconButton, Typography, InputAdornment } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Eye, EyeOff } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as yup from 'yup'

import { useSignUpMutation } from '../../../../services/admin'
import SocialMediaAuth from '../login/social-media-auth'

const SignUp = ({ setIsLoginPage }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [showPassword, setShowPassword] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [signUp, { isLoading }] = useSignUpMutation()

  const referredBy = searchParams.get('referredBy')

  const schemaResolver = yupResolver(
    yup.object().shape({
      firstName: yup
        .string()
        .trim()
        .required('Please enter first name')
        .max(100, 'Maximum 100 characters are allowed'),
      lastName: yup
        .string()
        .trim()
        .required('Please enter last name')
        .max(100, 'Maximum 100 characters are allowed'),
      email: yup
        .string()
        .trim()
        .required('Please enter email')
        .email('Invalid email')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'),
      phoneNumber: yup
        .string()
        .trim()
        .required('Please enter phone number')
        .matches(
          /^[+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
          'Please enter a valid phone number',
        ),
      password: yup
        .string()
        .trim()
        .required('Please enter password')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_+\-~()`{}[\]:;"'<>/?.,|\\]).{8,}$/,
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
        ),
      confirmPassword: yup
        .string()
        .trim()
        .required('Please confirm password')
        .oneOf([yup.ref('password')], 'Passwords do not match'),
    }),
  )

  const TEXT = `Thank you for signing up with Unicitizens! We're thrilled to have you onboard. Please check your email to confirm your account and unlock full access to the platform.`

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: schemaResolver,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values) => {
    const formData = referredBy ? { ...values, referredBy } : { ...values }

    const response = await signUp(formData)

    if (response && 'data' in response) {
      setIsLoginPage(true)
      void navigate('/thank-you', { state: { text: TEXT } })
    }
  }

  return (
    <Box width="100%">
      <Typography component="p" fontWeight={400} textAlign="center" mb={2} sx={{ opacity: 0.8 }}>
        Create a free account to access the platform.
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit(onSubmit)()
        }}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid container spacing={1.5} mt={1} mb={1.5}>
          <Grid size={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              First Name
            </Typography>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  placeholder="Enter your first name"
                  fullWidth
                  {...field}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Last Name
            </Typography>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  placeholder="Enter your last name"
                  variant="outlined"
                  fullWidth
                  {...field}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1.5} mb={1.5}>
          <Grid size={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Email
            </Typography>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  placeholder="Enter your email"
                  variant="outlined"
                  fullWidth
                  {...field}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Phone Number
            </Typography>
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  placeholder="Enter your phone number"
                  variant="outlined"
                  fullWidth
                  {...field}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid mb={1.5}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Password
          </Typography>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                placeholder="Enter password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                {...field}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="new-password"
              />
            )}
          />
        </Grid>
        <Grid mb={1.5}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Confirm Password
          </Typography>
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                placeholder="Confirm your password"
                variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                {...field}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                autoComplete="new-password"
              />
            )}
          />
        </Grid>

        <Button
          sx={{ mb: 2 }}
          type="submit"
          color="primary"
          variant="contained"
          disabled={isOAuthLoading}
        >
          Sign Up
        </Button>
      </form>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="body2" color={theme.palette.text.secondary}>
          By creating an account, you agree to our
          <Typography
            variant="body2"
            component="span"
            sx={{
              margin: 0.5,
              fontSize: 13,
              fontWeight: 500,
              color: theme.palette.primary.main,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Terms of Use
          </Typography>
          and
          <Typography
            component="span"
            variant="body2"
            sx={{
              marginLeft: 0.5,
              fontSize: 13,
              fontWeight: 500,
              color: theme.palette.primary.main,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Privacy Policy
          </Typography>
        </Typography>
      </Box>
      <Grid mb={2}>
        <SocialMediaAuth
          setIsOAuthLoading={setIsOAuthLoading}
          isOAuthLoading={isLoading || isOAuthLoading}
        />
      </Grid>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="body2" color={theme.palette.text.secondary} sx={{ fontSize: 14 }}>
          Already have an account?
          <Typography
            variant="body2"
            component="span"
            className="link"
            onClick={() => setIsLoginPage(true)}
            sx={{
              marginLeft: 0.75,
              fontSize: 14,
              fontWeight: 600,
              color: theme.palette.primary.main,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Login
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

SignUp.propTypes = {
  setIsLoginPage: PropTypes.func.isRequired,
}

export default SignUp
