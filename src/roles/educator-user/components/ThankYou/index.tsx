import React from 'react'
import { Box, Button, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle } from 'lucide-react'

interface ThankYouProps {
  text?: string
}

const ThankYou: React.FC<ThankYouProps> = ({ text }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('education')

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 600,
          width: '100%',
          borderRadius: 3,
          p: { xs: 4, sm: 6 },
          textAlign: 'center',
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: (theme) => theme.palette.success.light,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 3,
          }}
        >
          <CheckCircle
            size={40}
            style={{ color: 'var(--mui-palette-success-main)' }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Thank You!
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: 'text.secondary',
            lineHeight: 1.8,
          }}
        >
          {text || 'Your application has been successfully submitted. We will review your application and get back to you soon.'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/educator/login')}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              px: 3,
              py: 1.5,
            }}
          >
            Back to Login
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.location.replace('https://www.unicitizens.com')
            }}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              px: 3,
              py: 1.5,
            }}
          >
            {t('THANKYOU_PAGE.VISIT_WEBSITE')}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default ThankYou