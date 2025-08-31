import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import { Send, Trash2, AlertTriangle, RefreshCw, UserPlus } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useRemoveAdminUserMutation,
  useGetAdminPrivilegesQuery,
} from '../../../../../services/admin'

const AdminUserModal = ({
  modalType,
  adminId,
  firstName,
  lastName,
  email,
  privilege,
  closeModal,
}) => {
  const [createAdminUser] = useCreateAdminUserMutation()
  const [updateAdminUser] = useUpdateAdminUserMutation()
  const [removeAdminUser] = useRemoveAdminUserMutation()
  const { data: privilegesData } = useGetAdminPrivilegesQuery()
  const [isDeleting, setIsDeleting] = useState(false)

  const isAddMode = modalType === 'add'
  const isEditMode = modalType === 'edit'
  const isDeleteMode = modalType === 'delete'
  const isResendMode = modalType === 'resend'

  const schemaResolver = yupResolver(
    yup.object().shape({
      firstName: yup.string().trim().required('Please enter first name'),
      lastName: yup.string().trim().required('Please enter last name'),
      email: yup.string().trim().email('Invalid email').required('Please enter email'),
      privilege:
        isAddMode || isEditMode ? yup.string().required('Please select privilege') : yup.string(),
    }),
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: schemaResolver,
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      privilege: privilege?._id || privilege || '',
    },
  })

  const handleFormSubmit = async (values) => {
    let response

    if (isAddMode) {
      response = await createAdminUser({ ...values, action: 'createAdmin' })
    } else if (isEditMode) {
      response = await updateAdminUser({ ...values, adminId })
    } else if (isResendMode) {
      response = await createAdminUser({
        ...values,
        adminId,
        action: 'resendInvitationLink',
        privilegeId: privilege?._id,
      })
    }

    if (!response?.error) {
      closeModal()
      reset()
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await removeAdminUser({ adminId })
      if (!response.error) {
        closeModal()
      }
    } catch (error) {
      console.error('Failed to delete admin:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isDeleteMode) {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <AlertTriangle size={24} color="#ff9800" />
          <Typography variant="h6" fontWeight={600}>
            Delete Admin User
          </Typography>
        </Box>

        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone. This will permanently remove admin privileges and delete the
          account.
        </Alert>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Are you sure you want to delete this admin user?
        </Typography>

        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300',
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Name:</strong> {firstName} {lastName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Email:</strong> {email}
          </Typography>
          {privilege && (
            <Typography variant="body2">
              <strong>Privilege:</strong> {privilege?.name || privilege}
            </Typography>
          )}
        </Box>

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
            {isDeleting ? 'Deleting...' : 'Delete Admin'}
          </Button>
        </Box>
      </Box>
    )
  }

  if (isResendMode) {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          <Grid item size={12}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Resend invitation email to{' '}
              <strong>
                {firstName} {lastName}
              </strong>{' '}
              ({email})?
            </Typography>
          </Grid>
        </Grid>
        <Button
          startIcon={<Send size={18} />}
          variant="contained"
          type="submit"
          size="large"
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Resend Invitation'}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        <Grid item size={6}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            First Name
          </FormLabel>
          <Controller
            name="firstName"
            control={control}
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
        <Grid item size={6}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            Last Name
          </FormLabel>
          <Controller
            name="lastName"
            control={control}
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
            render={({ field }) => (
              <TextField
                size="small"
                placeholder="Enter email"
                variant="outlined"
                fullWidth
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isEditMode}
              />
            )}
          />
        </Grid>
        <Grid item size={12}>
          <FormLabel component="legend" sx={{ mb: 1 }}>
            Privilege
          </FormLabel>
          <Controller
            name="privilege"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.privilege} size="small">
                <Select
                  displayEmpty
                  fullWidth
                  renderValue={(selected) => {
                    if (!selected) {
                      return <InputLabel shrink={false}>Select privilege</InputLabel>
                    }
                    const privilegeName =
                      privilegesData?.data?.find((p) => p._id === selected)?.name || selected
                    return privilegeName
                  }}
                  {...field}
                >
                  {privilegesData?.data?.map((priv) => (
                    <MenuItem key={priv._id || priv} value={priv._id || priv}>
                      {priv.name || priv}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.privilege?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
      <Button
        startIcon={isAddMode ? <UserPlus size={18} /> : <RefreshCw size={18} />}
        variant="contained"
        type="submit"
        size="large"
        sx={{ mt: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : isAddMode ? 'Add Admin' : 'Update Admin'}
      </Button>
    </form>
  )
}

export default AdminUserModal

AdminUserModal.propTypes = {
  modalType: PropTypes.oneOf(['add', 'edit', 'delete', 'resend']).isRequired,
  adminId: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  privilege: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  status: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
}
