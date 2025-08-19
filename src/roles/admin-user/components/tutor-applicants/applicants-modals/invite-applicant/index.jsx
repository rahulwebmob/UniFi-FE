import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'

import { useInviteEducatorMutation } from '../../../../../../services/admin'

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  url: Yup.string().required('URL is required'),
})

const InviiteApplicant = ({ onClose }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const [inviteTutor] = useInviteEducatorMutation()

  const onSubmit = async (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      onboardingLink: data.url,
    }
    await inviteTutor(payload)
    onClose()
  }

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        p: 1,
      }}
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
    >
      <Box>
        <Typography
          variant="body2"
          sx={{
            mb: 0.5,
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          First Name
        </Typography>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              placeholder="Enter first name"
              size="small"
              {...field}
              variant="outlined"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          )}
        />
      </Box>

      <Box>
        <Typography
          variant="body2"
          sx={{
            mb: 0.5,
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          Last Name
        </Typography>
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              placeholder="Enter last name"
              size="small"
              {...field}
              variant="outlined"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          )}
        />
      </Box>

      <Box>
        <Typography
          variant="body2"
          sx={{
            mb: 0.5,
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          Email
        </Typography>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              placeholder="Enter email address"
              size="small"
              {...field}
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          )}
        />
      </Box>

      <Box>
        <Typography
          variant="body2"
          sx={{
            mb: 0.5,
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          Onboarding Form Link
        </Typography>
        <Controller
          name="url"
          control={control}
          render={({ field }) => (
            <TextField
              placeholder="Enter onboarding URL"
              size="small"
              {...field}
              variant="outlined"
              fullWidth
              error={!!errors.url}
              helperText={errors.url?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          )}
        />
      </Box>

      <Box display="flex" mt={3} gap={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            px: 3,
          }}
        >
          Invite Tutor
        </Button>
      </Box>
    </Box>
  )
}

InviiteApplicant.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default InviiteApplicant
