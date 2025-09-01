import { yupResolver } from '@hookform/resolvers/yup'
import { Button, FormLabel, Grid, TextField, Box, Typography } from '@mui/material'
import { Trash2, RefreshCw } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  useUpdatePlatformUserMutation,
  useDeletePlatformUserMutation,
} from '../../../../../services/admin'

const PlatformUserModal = ({ modalType, userId, firstName, lastName, email, closeModal }) => {
  const [updatePlatformUser] = useUpdatePlatformUserMutation()
  const [deletePlatformUser] = useDeletePlatformUserMutation()
  const [isDeleting, setIsDeleting] = useState(false)

  const schemaResolver = yupResolver(
    yup.object().shape({
      firstName: yup.string().trim().required('Please enter first name'),
      lastName: yup.string().trim().required('Please enter last name'),
      email: yup.string().email('Invalid email').required('Please enter email'),
    }),
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: schemaResolver,
    defaultValues: {
      firstName,
      lastName,
      email,
    },
  })

  const handleFormSubmit = async (values) => {
    const response = await updatePlatformUser({ ...values, userId, action: 'update' })
    if (!response.error) {
      closeModal()
      reset()
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await deletePlatformUser({ userId })
      if (!response.error) {
        closeModal()
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (modalType === 'delete') {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Delete User
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Are you sure you want to delete this user?
        </Typography>

        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={closeModal} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Trash2 size={18} />}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        <Grid item size={12}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            First Name
          </FormLabel>
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                size="small"
                variant="outlined"
                placeholder="Enter first name"
                fullWidth
                {...field}
                error={!!errors?.firstName}
                helperText={errors?.firstName?.message}
              />
            )}
          />
        </Grid>
        <Grid item size={12}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            Last Name
          </FormLabel>
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            fullWidth
            render={({ field }) => (
              <TextField
                size="small"
                placeholder="Enter last name"
                variant="outlined"
                fullWidth
                {...field}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
        </Grid>
        <Grid item size={12}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            Email
          </FormLabel>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            fullWidth
            render={({ field }) => (
              <TextField
                size="small"
                placeholder="Enter email"
                variant="outlined"
                fullWidth
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
      </Grid>
      <Button
        startIcon={<RefreshCw size={18} />}
        variant="contained"
        type="submit"
        size="large"
        sx={{ mt: 2 }}
      >
        Update
      </Button>
    </form>
  )
}

export default PlatformUserModal

PlatformUserModal.propTypes = {
  modalType: PropTypes.oneOf(['edit', 'delete']).isRequired,
  userId: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
}
