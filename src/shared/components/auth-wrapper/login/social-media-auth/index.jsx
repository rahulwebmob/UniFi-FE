import { Box, Button, Divider, useTheme, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import FacebookIcon from '../../../../../assets/social-icons/facebook.svg'
import GoogleIcon from '../../../../../assets/social-icons/google.svg'
import LinkedinIcon from '../../../../../assets/social-icons/linkedin.svg'
import useFbLogin from '../../../../../hooks/useFbLogin'
import useGoogleLogin from '../../../../../hooks/useGoogleLogin'
import useLinkedinLogin from '../../../../../hooks/useLinkedinLogin'
import { useOAuthLoginMutation } from '../../../../../services/admin'
import { initializeSocket } from '../../../../../services/sockets'

import { SOCIAL_AUTH } from './constant'
// Social media SVG icons

const SocialMediaAuth = ({ isOAuthLoading, setIsOAuthLoading }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [socialbtn, setSocialBtn] = useState(null)
  const [oAuthLogin, { isLoading }] = useOAuthLoginMutation()

  useEffect(() => {
    setIsOAuthLoading(isLoading || !!socialbtn)
  }, [isLoading, socialbtn, setIsOAuthLoading])

  const handleLogin = async (values) => {
    try {
      const response = await oAuthLogin(values).unwrap()

      if (response?.token) {
        localStorage.setItem('token', response.token)
        void initializeSocket(response.token)
        setTimeout(() => {
          void navigate('/dashboard')
        }, 100)
      }
    } catch (error) {
      console.error('OAuth login failed:', error)
      setSocialBtn(null)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (response) => {
      void handleLogin({
        authType: SOCIAL_AUTH.GOOGLE,
        accessToken: response.access_token,
      })
    },
    onError: () => setSocialBtn(null),
    onNonOAuthError: () => setSocialBtn(null),
  })

  const handleLinkedInLogin = useLinkedinLogin({
    onSuccess: (accessToken) => {
      void handleLogin({
        authType: SOCIAL_AUTH.LINKEDIN,
        accessToken,
      })
    },
    onError: () => setSocialBtn(null),
  })

  const handleFbLogin = useFbLogin({
    onSuccess: ({ authResponse }) => {
      if (authResponse?.accessToken) {
        void handleLogin({
          authType: SOCIAL_AUTH.FACEBOOK,
          accessToken: authResponse.accessToken,
        })
      } else {
        setSocialBtn(null)
      }
    },
    onError: () => setSocialBtn(null),
  })

  const socialProviders = [
    {
      id: 'google',
      label: 'Google',
      icon: (
        <img
          src={GoogleIcon}
          alt="Google"
          width="20"
          height="20"
          style={{
            display: 'block',
            opacity: isOAuthLoading ? 0.3 : 1,
            transition: 'opacity 0.2s ease',
          }}
        />
      ),
      onClick: () => {
        setSocialBtn('google')
        handleGoogleLogin()
      },
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: (
        <img
          src={LinkedinIcon}
          alt="LinkedIn"
          width="20"
          height="20"
          style={{
            display: 'block',
            opacity: isOAuthLoading ? 0.3 : 1,
            transition: 'opacity 0.2s ease',
          }}
        />
      ),
      onClick: () => {
        setSocialBtn('linkedin')
        handleLinkedInLogin()
      },
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: (
        <img
          src={FacebookIcon}
          alt="Facebook"
          width="20"
          height="20"
          style={{
            display: 'block',
            opacity: isOAuthLoading ? 0.3 : 1,
            transition: 'opacity 0.2s ease',
          }}
        />
      ),
      onClick: () => {
        setSocialBtn('facebook')
        handleFbLogin()
      },
    },
  ]

  return (
    <>
      <Divider
        textAlign="center"
        sx={{
          my: 2,
          color: theme.palette.text.secondary,
          fontSize: '0.875rem',
          '&::before, &::after': {
            borderColor: theme.palette.grey[200],
          },
        }}
      >
        Or continue with
      </Divider>

      <Box
        sx={{
          gap: isMobile ? 1 : 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {socialProviders.map((item) => (
          <Button
            key={item.id}
            fullWidth={!isMobile}
            variant="outlined"
            sx={{
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.grey[300]}`,
              backgroundColor: theme.palette.background.paper,
              fontWeight: 500,
              textTransform: 'none',
              minWidth: isMobile ? 'auto' : 'initial',
              padding: isMobile ? '8px 12px' : '8px 22px',
              flex: isMobile ? 0 : 1,
            }}
            startIcon={!isMobile && item.icon}
            onClick={item.onClick}
            disabled={isOAuthLoading}
          >
            {isMobile ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '20px',
                  opacity: isOAuthLoading ? 0.3 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {item.icon}
              </Box>
            ) : socialbtn === item.id ? (
              'Logging in...'
            ) : (
              item.label
            )}
          </Button>
        ))}
      </Box>
    </>
  )
}

export default SocialMediaAuth
