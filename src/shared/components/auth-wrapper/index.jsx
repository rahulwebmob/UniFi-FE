import { Box, Typography, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import AdminImage from '../../../assets/admin.webp'
import MainLogo from '../../../assets/logo.svg'
import SignUpImage from '../../../assets/sign-up/Sign Up.png'

import Login from './login'
import SignUp from './sign-up'

const EducatorImage = SignUpImage

const AuthWrapper = ({ type = '', children = null }) => {
  const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoginPage, setIsLoginPage] = useState(
    type === 'admin' ? true : !searchParams.get('sign-up'),
  )

  useEffect(() => {
    // Skip URL management if custom children are provided
    if (children || type === 'admin') {
      return
    }

    if (isLoginPage && searchParams.has('sign-up')) {
      searchParams.delete('sign-up')
      setSearchParams(searchParams)
    }

    if (!isLoginPage && !searchParams.has('sign-up')) {
      searchParams.set('sign-up', 'true')
      setSearchParams(searchParams)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginPage])

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
          maxWidth: 1600,
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
            minHeight: 700,
            height: '80vh',
            maxHeight: 900,
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column',
              height: '100vh',
              minHeight: '100vh',
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
              position: 'relative',
              overflow: 'hidden',
              background: theme.palette.background.paper,
              [theme.breakpoints.down('md')]: {
                display: 'none',
              },
            }}
          >
            <img
              src={
                type === 'admin' ? AdminImage : type === 'educator' ? EducatorImage : SignUpImage
              }
              alt={
                type === 'admin'
                  ? 'Admin Portal'
                  : type === 'educator'
                    ? 'Educator Portal'
                    : 'Authentication'
              }
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                maxWidth: 800,
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 5,
              overflow: 'auto',
              [theme.breakpoints.down('md')]: {
                padding: 3,
                height: '100%',
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
                maxWidth: 680,
                [theme.breakpoints.down('xs')]: {
                  maxWidth: '100%',
                },
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
                <img src={MainLogo} alt="Logo" style={{ width: 80, height: 80 }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                textAlign="center"
                sx={{
                  letterSpacing: 3.84,
                  mb: 3,
                }}
              >
                UNICITIZENS
              </Typography>
              {children ? (
                children
              ) : isLoginPage ? (
                <Login type={type} setIsLoginPage={setIsLoginPage} />
              ) : (
                type !== 'admin' && <SignUp setIsLoginPage={setIsLoginPage} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

AuthWrapper.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node,
}

export default AuthWrapper
