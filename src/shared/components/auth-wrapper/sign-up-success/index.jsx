import { Box, Typography, Button } from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import PropTypes from 'prop-types'

const SignUpSuccess = ({ onBackToLogin }) => (
  <Box
    width="100%"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
      Welcome to Unicitizens!
    </Typography>

    <Typography component="p" fontWeight={400} textAlign="center" mb={2} sx={{ opacity: 0.8 }}>
      Thank you for signing up! Please check your email to verify your account and start learning.
    </Typography>

    <Button
      startIcon={<ArrowLeft size={20} />}
      variant="contained"
      color="primary"
      fullWidth
      onClick={onBackToLogin}
      sx={{ mb: 2 }}
    >
      Back to Login
    </Button>
  </Box>
)

SignUpSuccess.propTypes = {
  onBackToLogin: PropTypes.func.isRequired,
}

export default SignUpSuccess
