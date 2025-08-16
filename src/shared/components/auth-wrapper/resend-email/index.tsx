import React from 'react'
import { Mail, ArrowLeft } from 'lucide-react'

import { Box, Button, useTheme, Typography } from '@mui/material'

import MainLogo from '../../../../Assets/logo.svg'
import { useResendEmailMutation } from '../../../../Services/admin'

interface ResendEmailProps {
  setResendEmail: (resend: boolean) => void
  email: string
}

const ResendEmail: React.FC<ResendEmailProps> = ({ setResendEmail, email }) => {
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
      <Box display="flex" alignItems="center" position="relative">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="100%"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 1 }}
          >
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

          {/* Email Icon */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.light + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Mail
                size={32}
                color={theme.palette.primary.main}
              />
            </Box>
          </Box>

          <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
            Please verify your email
          </Typography>
          <Typography
            component="p"
            fontWeight={400}
            textAlign="center"
            mb={3}
            sx={{ opacity: 0.8 }}
          >
            We&apos;ve sent you an email at{' '}
            <Typography component="span" fontWeight={600} color="primary">
              {email}
            </Typography>
            . Just click the link in the email to finish signing up.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          padding: 2,
          borderRadius: 1,
          backgroundColor: theme.palette.grey[50],
          border: `1px solid ${theme.palette.grey[200]}`,
          mb: 2,
        }}
      >
        <Typography
          variant="body2"
          textAlign="center"
          mb={1.5}
          sx={{ opacity: 0.8 }}
        >
          Still can&apos;t find the email? No problem.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => { void onSubmit() }}
          sx={{ mb: 1 }}
        >
          Resend Verification Email
        </Button>
        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ opacity: 0.7 }}
        >
          Check your spam folder if you don&apos;t see it in your inbox
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center">
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => { setResendEmail(false) }}
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

export default ResendEmail
