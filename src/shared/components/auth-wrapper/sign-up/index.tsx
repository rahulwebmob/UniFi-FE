import * as yup from 'yup'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useTheme } from '@mui/material/styles'
import {
  Box,
  Grid,
  Button,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material'

import MainLogo from '../../../../assets/logo.svg'
import SocialMediaAuth from '../login/social-media-auth'
import { useSignUpMutation } from '../../../../services/admin'

interface SignUpProps {
  setIsLoginPage: (isLogin: boolean) => void
}

const SignUp = ({ setIsLoginPage }: SignUpProps) => {
  const theme = useTheme()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [signUp, { isLoading }] = useSignUpMutation()

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
      termsOfUsage: yup.string().required('Please select usage type'),
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
      password: '',
      confirmPassword: '',
      termsOfUsage: '',
    },
  })

  interface FormValues {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    termsOfUsage: string
  }

  const onSubmit = async (values: FormValues) => {
    const formData = { ...values }

    const response = await signUp(formData)

    if (response && 'data' in response) {
      setIsLoginPage(true)
      void navigate('/thank-you', { state: { text: TEXT } })
    }
  }

  return (
    <Box width="100%">
      <Box display="flex" alignItems="center">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="100%"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 1 }}
          >
            <img src={MainLogo} alt="Logo" style={{ width: 80, height: 80 }} />
          </Box>

          <Typography
            variant="h6"
            fontWeight={700}
            textAlign="center"
            sx={{
              letterSpacing: 3.84,
              mb: 1,
            }}
          >
            UNICITIZENS
          </Typography>
          <Typography
            component="p"
            fontWeight={400}
            textAlign="center"
            mb={2}
            sx={{ opacity: 0.8 }}
          >
            Create a free account to access the platform.{' '}
          </Typography>
        </Box>
      </Box>

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
        <Grid mb={1.5}>
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
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
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
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
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
        <Typography
          variant="body2"
          color={theme.palette.text.secondary}
          sx={{ fontSize: 14 }}
        >
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

export default SignUp
