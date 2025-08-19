import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Button, TextField, Typography } from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

import MainLogo from '../../../../assets/logo.svg'
import {
  useForgetPasswordMutation,
  useEducatorForgetPasswordMutation,
} from '../../../../services/admin'
import { useAdminForgetPasswordMutation } from '../../../../services/onboarding'

const ForgetPassword = ({ type, setShowForgetPassword }) => {
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
    let response
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
      <Box display="flex" alignItems="center" position="relative">
        <Box display="flex" flexDirection="column" justifyContent="center" width="100%">
          <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
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
          <Typography
            component="p"
            fontWeight={400}
            textAlign="center"
            mb={3}
            sx={{ opacity: 0.8 }}
          >
            Enter your email address and we&apos;ll send you a link to get back into your account.
          </Typography>
        </Box>
      </Box>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit(onSubmit)()
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
              />
            )}
          />
        </Grid>

        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mb: 2 }}>
          Send Reset Link
        </Button>
      </form>

      <Box display="flex" alignItems="center" justifyContent="center">
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => {
            setShowForgetPassword(false)
          }}
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  )
}

ForgetPassword.propTypes = {
  type: PropTypes.string,
  setShowForgetPassword: PropTypes.func.isRequired,
}

ForgetPassword.defaultProps = {
  type: '',
}

export default ForgetPassword
