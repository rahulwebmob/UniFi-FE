import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Grid,
  Button,
  useTheme,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import MainLogo from '../../../../assets/logo.svg'
import { signIn } from '../../../../redux/reducers/user-slice'
import { useLoginMutation, useEducatorLoginMutation } from '../../../../services/admin'
import { useAdminLoginMutation } from '../../../../services/onboarding'
import { initializeSocket } from '../../../../services/sockets'
import ForgetPassword from '../forget-password'
import ResendEmail from '../resend-email'

import SocialMediaAuth from './social-media-auth'

const ViewState = {
  LOGIN: 'LOGIN',
  RESEND_EMAIL: 'RESEND_EMAIL',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
}

const Login = ({ type = '', setIsLoginPage }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [visible, setVisible] = useState(false)
  const [viewState, setViewState] = useState(ViewState.LOGIN)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')

  const [educatorLogin] = useEducatorLoginMutation()
  const [submitLoginForm, { isLoading }] = useLoginMutation()
  const [adminLogin, { isLoading: isAdminLoading }] = useAdminLoginMutation()

  const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email').trim().required('Email is required'),
    password: yup.string().required('Password is required'),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (values) => {
    let response

    switch (type) {
      case 'educator':
        response = await educatorLogin(values)
        break
      case 'admin':
        response = await adminLogin(values)
        break
      default:
        response = await submitLoginForm(values)
    }

    if (response?.data) {
      const { token } = response.data
      localStorage.setItem('token', token)
      dispatch(signIn({ token }))

      switch (type) {
        case 'admin':
          void navigate('/admin')
          break
        case 'educator':
          void initializeSocket(token, false)
          void navigate('/educator')
          break
        default:
          void initializeSocket(token)
          setTimeout(() => {
            void navigate('/dashboard')
          }, 100)
      }
    } else if (
      response.error &&
      'status' in response.error &&
      response.error.status === 406 &&
      values.email
    ) {
      setVerificationEmail(values.email)
      setViewState(ViewState.RESEND_EMAIL)
    }
  }

  const renderHeader = () => (
    <Box display="flex" alignItems="center">
      <Box display="flex" flexDirection="column" justifyContent="center" width="100%">
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
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
        <Typography component="p" fontWeight={400} textAlign="center" mb={2} sx={{ opacity: 0.8 }}>
          {type === 'admin'
            ? 'Enter your credentials to access the admin portal'
            : type === 'educator'
              ? 'Welcome back! Sign in to manage your courses and webinars'
              : 'Enter details to login and access the platform'}
        </Typography>
      </Box>
    </Box>
  )

  const renderLoginForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void handleSubmit(onSubmit)()
      }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <Grid size={12} mb={1.5}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Email
        </Typography>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              type="email"
              variant="outlined"
              fullWidth
              placeholder="Enter your email"
              {...field}
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
            />
          )}
        />
      </Grid>
      <Grid size={12} mb={1.5}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          Password
        </Typography>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              variant="outlined"
              fullWidth
              type={visible ? 'text' : 'password'}
              placeholder="Enter password"
              {...field}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setVisible(!visible)}>
                      {visible ? <Eye size={20} /> : <EyeOff size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
            />
          )}
        />
      </Grid>
      <Button
        sx={{ mb: 2 }}
        disabled={isLoading || isAdminLoading || isOAuthLoading}
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
      >
        Login
      </Button>
    </form>
  )

  const renderForgotPasswordLink = () => (
    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
      <Typography variant="body2" color={theme.palette.text.secondary} sx={{ fontSize: 14 }}>
        Trouble logging in?
        <Typography
          variant="body2"
          component="span"
          onClick={() => setViewState(ViewState.FORGOT_PASSWORD)}
          sx={{
            marginLeft: 0.75,
            fontSize: 14,
            fontWeight: 600,
            color: theme.palette.primary.main,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Reset password
        </Typography>
      </Typography>
    </Box>
  )

  const renderEducatorSignup = () => (
    <Box display="flex" alignItems="center" justifyContent="center" pt={2}>
      <Typography variant="body2" color={theme.palette.text.secondary} sx={{ fontSize: 14 }}>
        Want to become an educator?
        <Typography
          variant="body2"
          component="span"
          onClick={() => {
            void navigate('/educator/onboarding')
          }}
          sx={{
            marginLeft: 0.75,
            fontSize: 14,
            fontWeight: 700,
            color: theme.palette.primary.main,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Apply Now
        </Typography>
      </Typography>
    </Box>
  )

  const renderUserSignup = () => (
    <>
      <SocialMediaAuth
        setIsOAuthLoading={setIsOAuthLoading}
        isOAuthLoading={isLoading || isOAuthLoading}
      />
      <Box display="flex" alignItems="center" justifyContent="center" mt={2} pb={2}>
        <Typography variant="body2" color={theme.palette.text.secondary} sx={{ fontSize: 14 }}>
          Don&apos;t have an account?
          <Typography
            variant="body2"
            component="span"
            onClick={() => setIsLoginPage(false)}
            sx={{
              marginLeft: 0.75,
              fontSize: 14,
              fontWeight: 600,
              color: theme.palette.primary.main,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Sign up
          </Typography>
        </Typography>
      </Box>
    </>
  )

  const renderLoginView = () => (
    <Box width="100%">
      {renderHeader()}
      {renderLoginForm()}
      {renderForgotPasswordLink()}
      {type === 'educator' && renderEducatorSignup()}
      {!type && renderUserSignup()}
    </Box>
  )

  const renderContent = () => {
    switch (viewState) {
      case ViewState.LOGIN:
        return renderLoginView()

      case ViewState.FORGOT_PASSWORD:
        return (
          <ForgetPassword
            setShowForgetPassword={(show) =>
              setViewState(show ? ViewState.FORGOT_PASSWORD : ViewState.LOGIN)
            }
            type={type}
          />
        )

      case ViewState.RESEND_EMAIL:
        return (
          <ResendEmail
            setResendEmail={(resend) =>
              setViewState(resend ? ViewState.RESEND_EMAIL : ViewState.LOGIN)
            }
            email={verificationEmail}
          />
        )

      default:
        return renderLoginView()
    }
  }

  return <>{renderContent()}</>
}

export default Login
