import React from 'react'
import * as Yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Box, Button, TextField, FormLabel } from '@mui/material'

import { useInviteEducatorMutation } from '../../../../../../services/admin'

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  url: Yup.string().required('URL is required'),
})

const InviteTutorForm = ({ onClose }) => {
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
        gap: '10px',
      }}
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
    >
      <Box>
        <FormLabel>First Name</FormLabel>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              label="First Name"
              size="small"
              {...field}
              variant="outlined"
              color="secondary"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName ? errors.firstName.message : ''}
            />
          )}
        />
      </Box>

      <Box>
        <FormLabel>Last Name</FormLabel>
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              label="Last Name"
              size="small"
              {...field}
              variant="outlined"
              color="secondary"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ''}
            />
          )}
        />
      </Box>

      <Box>
        <FormLabel>Email</FormLabel>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              label="Email"
              size="small"
              {...field}
              variant="outlined"
              color="secondary"
              fullWidth
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
          )}
        />
      </Box>

      <Box>
        <FormLabel>Enter onboarding form link</FormLabel>
        <Controller
          name="url"
          control={control}
          render={({ field }) => (
            <TextField
              label="URL"
              size="small"
              {...field}
              variant="outlined"
              color="secondary"
              fullWidth
              error={!!errors.url}
              helperText={errors.url ? errors.url.message : ''}
            />
          )}
        />
      </Box>

      <Box display="flex" mt={2} gap={2}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" fullWidth>
          Invite Tutor
        </Button>
      </Box>
    </Box>
  )
}

export default InviteTutorForm
