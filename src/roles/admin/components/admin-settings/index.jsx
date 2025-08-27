import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  FormControl,
  useMediaQuery,
} from '@mui/material'
import { Save } from 'lucide-react'
import PropTypes from 'prop-types'
import { forwardRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'

import { signIn } from '../../../../redux/reducers/user-slice'
import { useEditAdminProfileMutation } from '../../../../services/onboarding'
import ChangePassword from '../../../../shared/components/auth-wrapper/change-password'
import ModalBox from '../../../../shared/components/ui-elements/modal-box'

const AdminSettings = forwardRef(({ userData, onClose }, ref) => {
  const dispatch = useDispatch()
  const matches = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const [updateName] = useEditAdminProfileMutation()

  const schemaResolver = yupResolver(
    yup.object().shape({
      firstName: yup
        .string()
        .trim()
        .required('First name is required')
        .max(100, 'First name cannot exceed 100 characters'),
      lastName: yup
        .string()
        .trim()
        .required('Last name is required')
        .max(100, 'Last name cannot exceed 100 characters'),
    }),
  )

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: schemaResolver,
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  useEffect(() => {
    if (userData) {
      setValue('firstName', userData.firstName ?? '')
      setValue('lastName', userData.lastName ?? '')
    }
  }, [userData, setValue])

  const onSubmit = async (values) => {
    const response = await updateName({ ...values, update: 'name' })
    if (
      !response.error &&
      response.data &&
      typeof response.data === 'object' &&
      response.data !== null &&
      !Array.isArray(response.data) &&
      'token' in response.data
    ) {
      const responseData = response.data
      const newToken = responseData.token
      localStorage.removeItem('token')
      localStorage.setItem('token', newToken)
      dispatch(signIn({ token: newToken }))
      if (onClose) {
        onClose()
      }
      if (ref?.current) {
        ref.current.closeModal()
      }
    }
  }

  return (
    <ModalBox
      ref={ref}
      title="Admin Profile Settings"
      size="lg"
      fullScreen={matches}
      onCloseModal={onClose}
    >
      <Box>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <Box pb={3}>
            <Typography variant="h6" mb={2.5}>
              Personal Information
            </Typography>

            <Box display="grid" gridTemplateColumns={!matches ? '1fr 1fr' : '1fr'} gap={2.5}>
              <FormControl fullWidth>
                <Typography variant="body2" mb={0.5} fontWeight={500} color="text.secondary">
                  First Name
                </Typography>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      size="small"
                      variant="outlined"
                      fullWidth
                      placeholder="Enter your first name"
                      {...field}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <Typography variant="body2" mb={0.5} fontWeight={500} color="text.secondary">
                  Last Name
                </Typography>
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      size="small"
                      variant="outlined"
                      fullWidth
                      placeholder="Enter your last name"
                      {...field}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </FormControl>
            </Box>

            <Button
              size="medium"
              type="submit"
              variant="contained"
              startIcon={<Save size={18} />}
              sx={{ mt: 2.5 }}
            >
              Save
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" mb={2.5}>
            Reset Password
          </Typography>
          <ChangePassword
            closeModal={() => {
              if (onClose) {
                onClose()
              }
              if (ref?.current) {
                ref.current.closeModal()
              }
            }}
            userEmail={userData?.email}
            headerName={null}
            isUserAdmin
            resetPassword={() => {}}
            isResetPassword={false}
          />
        </Box>
      </Box>
    </ModalBox>
  )
})

AdminSettings.displayName = 'AdminSettings'

AdminSettings.propTypes = {
  onClose: PropTypes.func,
  userData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
}

export default AdminSettings
