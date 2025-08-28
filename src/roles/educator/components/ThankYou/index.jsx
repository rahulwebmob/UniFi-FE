import { Box, Typography } from '@mui/material'
import { CheckCircle } from 'lucide-react'
import PropTypes from 'prop-types'

const ThankYou = ({ text }) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        maxWidth: 600,
        width: '100%',
        borderRadius: 3,
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        boxShadow: (theme) => theme.shadows[1],
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
        <CheckCircle size={40} style={{ color: 'var(--mui-palette-success-main)' }} />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 2,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
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
        {text ||
          'Your application has been successfully submitted. We will review your application and get back to you soon.'}
      </Typography>
    </Box>
  </Box>
)

ThankYou.propTypes = {
  text: PropTypes.string,
}

export default ThankYou
