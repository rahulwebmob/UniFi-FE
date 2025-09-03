import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

import {
  useForgetPasswordMutation,
  useEducatorForgetPasswordMutation,
} from '../../../../services/admin'
import { useAdminForgetPasswordMutation } from '../../../../services/onboarding'

const ForgetPassword = ({ type = '', setShowForgetPassword }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [updateForgetPassword] = useForgetPasswordMutation()
  const [adminForgetPassword] = useAdminForgetPasswordMutation()
  const [educatorForgetPassword] = useEducatorForgetPasswordMutation()

  const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email').trim().required('Email is required*'),
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (value) => {
    setIsLoading(true)
    let response
    try {
      if (type === 'admin') {
        response = await adminForgetPassword(value)
      } else if (type === 'educator') {
        response = await educatorForgetPassword(value)
      } else {
        response = await updateForgetPassword(value)
      }
      if (!response.error) {
        reset()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      position="relative"
      className="forget-password-form"
      sx={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <Typography component="p" fontWeight={400} textAlign="center" mb={3} sx={{ opacity: 0.8 }}>
        Enter your email address and we&apos;ll send you a link to get back into your account.
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmit)()
        }}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Grid mb={2}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Email Address
          </Typography>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Enter your email address"
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ArrowLeft size={20} />}
            onClick={() => {
              setShowForgetPassword(false)
            }}
            sx={{
              order: { xs: 2, sm: 1 },
            }}
          >
            Back to Login
          </Button>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} sx={{ color: 'primary.main' }} />
              ) : (
                <Send size={20} />
              )
            }
            sx={{
              order: { xs: 1, sm: 2 },
            }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

ForgetPassword.propTypes = {
  type: PropTypes.string,
  setShowForgetPassword: PropTypes.func.isRequired,
}

export default ForgetPassword
