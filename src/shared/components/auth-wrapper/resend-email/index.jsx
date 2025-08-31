import { Box, Button, useTheme, Typography } from '@mui/material'
import { Mail, ArrowLeft } from 'lucide-react'
import PropTypes from 'prop-types'

import { useResendEmailMutation } from '../../../../services/admin'

const ResendEmail = ({ setResendEmail, email }) => {
  const theme = useTheme()
  const [resendEmail] = useResendEmailMutation()

  const onSubmit = async () => {
    await resendEmail({ email })
  }

  return (
    <Box
      position="relative"
      className="resend-email-form"
      sx={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      {/* Email Icon */}
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: `${theme.palette.primary.light}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mail size={32} color={theme.palette.primary.main} />
        </Box>
      </Box>

      <Typography variant="h5" textAlign="center" mb={1}>
        Please verify your email
      </Typography>
      <Typography component="p" fontWeight={400} textAlign="center" mb={3} sx={{ opacity: 0.8 }}>
        We&apos;ve sent you an email at{' '}
        <Typography component="span" fontWeight={600} color="primary">
          {email}
        </Typography>
        . Just click the link in the email to finish signing up.
      </Typography>

      <Box
        sx={{
          padding: 2,
          borderRadius: 1,
          backgroundColor: theme.palette.grey[50],
          border: `1px solid ${theme.palette.grey[200]}`,
          mb: 2,
        }}
      >
        <Typography variant="body2" textAlign="center" mb={1.5} sx={{ opacity: 0.8 }}>
          Still can&apos;t find the email? No problem.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            onSubmit()
          }}
          sx={{ mb: 1 }}
        >
          Resend Verification Email
        </Button>
        <Typography variant="caption" display="block" textAlign="center" sx={{ opacity: 0.7 }}>
          Check your spam folder if you don&apos;t see it in your inbox
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center">
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => {
            setResendEmail(false)
          }}
          sx={{
            textTransform: 'none',
            color: theme.palette.primary.main,
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  )
}

ResendEmail.propTypes = {
  setResendEmail: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
}

export default ResendEmail
