import React from 'react'

import {
  Box,
  useTheme,
  IconButton,
  Typography,
} from '@mui/material'

// Social media SVG icons
import FacebookIcon from '../../../../Assets/social-icons/facebook.svg'
import LinkedinIcon from '../../../../Assets/social-icons/linkedin.svg'
import XIcon from '../../../../Assets/social-icons/x-twitter.svg'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const theme = useTheme()

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        boxShadow: '0 -2px 4px rgba(0,0,0,0.08)',
        mt: 'auto',
        py: 2,
      }}
    >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mx: 5,
          }}
        >
          {/* Left Section - Copyright and Social */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Copyright */}
            <Typography
              variant="body2"
              color="text.secondary"
            >
              © {currentYear} UniCitizens
            </Typography>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                sx={{ 
                  color: theme.palette.text.secondary,
                  border: `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: '8px',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.grey[400],
                  },
                }}
                aria-label="Facebook"
              >
                <img 
                  src={FacebookIcon} 
                  alt="Facebook" 
                  width="18" 
                  height="18"
                  style={{ display: 'block' }}
                />
              </IconButton>
              <IconButton
                size="small"
                sx={{ 
                  color: theme.palette.text.secondary,
                  border: `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: '8px',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.grey[400],
                  },
                }}
                aria-label="LinkedIn"
              >
                <img 
                  src={LinkedinIcon} 
                  alt="LinkedIn" 
                  width="18" 
                  height="18"
                  style={{ display: 'block' }}
                />
              </IconButton>
              <IconButton
                size="small"
                sx={{ 
                  color: theme.palette.text.secondary,
                  border: `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: '8px',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.grey[400],
                  },
                }}
                aria-label="X"
              >
                <img 
                  src={XIcon} 
                  alt="X" 
                  width="18" 
                  height="18"
                  style={{ display: 'block' }}
                />
              </IconButton>
            </Box>
          </Box>

          {/* Right Section - Legal Links */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              component="a"
              href="/privacy"
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              Privacy Policy
            </Typography>
            
            <Box
              sx={{
                width: '1px',
                height: '16px',
                backgroundColor: theme.palette.grey[300],
              }}
            />
            
            <Typography
              component="a"
              href="/terms"
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              Terms and Conditions
            </Typography>
            
            <Box
              sx={{
                width: '1px',
                height: '16px',
                backgroundColor: theme.palette.grey[300],
              }}
            />
            
            <Typography
              component="a"
              href="/refund"
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              Refund and Cancellation
            </Typography>
            
            <Box
              sx={{
                width: '1px',
                height: '16px',
                backgroundColor: theme.palette.grey[300],
              }}
            />
            
            <Typography
              component="a"
              href="/support"
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              Support
            </Typography>
          </Box>
        </Box>
    </Box>
  )
}

export default Footer