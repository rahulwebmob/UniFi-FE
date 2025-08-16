import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Divider, useTheme, useMediaQuery } from '@mui/material'

// Social media SVG icons
import FacebookIcon from '../../../../../Assets/social-icons/facebook.svg'
import LinkedinIcon from '../../../../../Assets/social-icons/linkedin.svg'

import { SOCIAL_AUTH } from './constant'
import useFbLogin from '../../../../../Hooks/useFbLogin'
import useGoogleLogin from '../../../../../Hooks/useGoogleLogin'
import { initializeSocket } from '../../../../../Services/sockets'
import useLinkedinLogin from '../../../../../Hooks/useLinkedinLogin'
import { useOAuthLoginMutation } from '../../../../../Services/admin'
// import { clearLangCookie } from "../../../../utils/globalUtils"

interface SocialMediaAuthProps {
  isOAuthLoading: boolean
  setIsOAuthLoading: (loading: boolean) => void
}

const SocialMediaAuth: React.FC<SocialMediaAuthProps> = ({ isOAuthLoading, setIsOAuthLoading }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [socialbtn, setSocialBtn] = useState<string | null>(null)
  const [oAuthLogin, { isLoading }] = useOAuthLoginMutation()

  useEffect(() => {
    setIsOAuthLoading(isLoading || !!socialbtn)
  }, [isLoading, socialbtn, setIsOAuthLoading])

  const handleLogin = async (values: { authType: string; accessToken: string }) => {
    const response = await oAuthLogin(values)

    if (response && 'data' in response && response.data) {
      const responseData = response.data as { token: string; data?: { subscription?: { isBasicSubscribed?: boolean } } }
      const token = responseData.token
      localStorage.setItem('token', token)

      void initializeSocket(token)
      setTimeout(() => {
        if (responseData?.data?.subscription?.isBasicSubscribed) {
          void navigate('/dashboard/layout')
        } else {
          void navigate('/dashboard')
        }
      })
    } else setSocialBtn(null)
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      await handleLogin({
        authType: SOCIAL_AUTH.GOOGLE,
        accessToken: response.access_token,
      })
    },
    onError: () => setSocialBtn(null),
    onNonOAuthError: () => setSocialBtn(null),
  })

  const handleLinkedInLogin = useLinkedinLogin({
    onSuccess: async (accessToken) => {
      await handleLogin({
        accessToken,
        authType: SOCIAL_AUTH.LINKEDIN,
      })
    },
    onError: () => setSocialBtn(null),
  })

  const handleFbLogin = useFbLogin({
    onSuccess: async ({ authResponse }) => {
      await handleLogin({
        authType: SOCIAL_AUTH.FACEBOOK,
        accessToken: authResponse.accessToken,
      })
    },
    onError: () => setSocialBtn(null),
  })

  const socialProviders = [
    {
      id: 'google',
      label: 'Google',
      icon: (
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
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
          style={{ display: 'block' }}
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
          style={{ display: 'block' }}
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
                sx={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}
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
