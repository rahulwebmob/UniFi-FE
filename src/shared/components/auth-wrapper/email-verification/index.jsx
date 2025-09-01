import { Box, Button, TextField, Typography, useTheme, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import MainLogo from '../../../../assets/logo.svg'
import { signIn } from '../../../../redux/reducers/user-slice'
import { useEmailVerificationQuery, useResendEmailMutation } from '../../../../services/admin'

const EmailVerification = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [progress, setProgress] = useState(5)
  const [countdownActive, setCountdownActive] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const queryParams = new URLSearchParams(window.location.search)
  const token = queryParams.get('token')

  const { isLoading, isSuccess, error, data } = useEmailVerificationQuery({
    token,
  })

  const [resendEmail] = useResendEmailMutation()

  const emailSchema = yup.object().shape({
    email: yup.string().trim().email('Invalid email').required('Email is required'),
  })

  const handleResendEmail = async () => {
    try {
      await emailSchema.validate({ email })
      setEmailError('')
      await resendEmail({ email })
    } catch (err) {
      setEmailError(err.message)
    }
  }

  useEffect(() => {
    if ((isSuccess || error?.status === 400) && !countdownActive) {
      setCountdownActive(true)
    }

    if (isSuccess && data) {
      const { loginToken } = data
      localStorage.removeItem('token')
      localStorage.setItem('token', loginToken)
      dispatch(signIn({ token: loginToken }))
      setTimeout(() => navigate('/dashboard'))
    }
  }, [isSuccess, error?.status, countdownActive, data, dispatch, navigate])

  useEffect(() => {
    let intervalId
    if (countdownActive && progress !== 0) {
      intervalId = setInterval(() => {
        setProgress((prevProgress) => prevProgress - 1)
      }, 1000)
    } else if (progress === 0) {
      navigate('/dashboard')
    }
    return () => clearInterval(intervalId)
  }, [countdownActive, progress, navigate])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        [theme.breakpoints.down('md')]: {
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          margin: '0 auto',
          px: { xs: 0, sm: 2, md: 3, lg: 4 },
          [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
            px: 0,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            borderRadius: 2.5,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            minHeight: 400,
            maxWidth: 500,
            margin: '0 auto',
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column',
              boxShadow: 'none',
              borderRadius: 0,
              overflow: 'visible',
            },
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              overflow: 'auto',
              background: theme.palette.background.paper,
              [theme.breakpoints.down('md')]: {
                padding: 3,
                overflow: 'visible',
              },
              [theme.breakpoints.down('sm')]: {
                padding: 2,
              },
            }}
          >
            <Box
              sx={{
                width: '100%',
                [theme.breakpoints.down('xs')]: {
                  maxWidth: '100%',
                },
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
                <img src={MainLogo} alt="Logo" style={{ width: 80, height: 80 }} />
              </Box>

              {isLoading && (
                <Box sx={{ textAlign: 'center' }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={40}
                    sx={{ margin: '0 auto', mb: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={24}
                    sx={{ margin: '0 auto', mb: 1 }}
                  />
                  <Skeleton variant="text" width="70%" height={24} sx={{ margin: '0 auto' }} />
                </Box>
              )}

              {!isLoading && (isSuccess || error?.status === 400 || error?.status === 403) && (
                <Box>
                  {(isSuccess || error?.status === 400) && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={600} mb={2}>
                        {isSuccess ? 'Email Verified' : 'Email Already Verified'}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" mb={3}>
                        Your email {isSuccess ? 'was' : 'is already'} verified. You can continue
                        using the application.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Redirecting to dashboard in {progress} seconds
                      </Typography>
                    </Box>
                  )}

                  {error?.status === 403 && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={600} mb={2}>
                        Email Verification Link Expired
                      </Typography>
                      <Typography variant="body1" color="text.secondary" mb={4}>
                        Looks like the verification link has expired. Not to worry, we can send the
                        link again.
                      </Typography>
                      <TextField
                        required
                        fullWidth
                        placeholder="Enter your email"
                        variant="outlined"
                        label="Email"
                        size="medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
                        sx={{ mb: 2 }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleResendEmail}
                        size="large"
                        sx={{
                          textTransform: 'none',
                          py: 1.5,
                          fontSize: '1rem',
                        }}
                      >
                        Resend Verification Email
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default EmailVerification
