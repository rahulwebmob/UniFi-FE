import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  alpha,
  Button,
  Dialog,
  Divider,
  useTheme,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  FormControl,
  DialogContent,
  useMediaQuery,
} from '@mui/material'
import { X } from 'lucide-react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'

import { signIn } from '../../../../redux/reducers/user-slice'
import { useEditAdminProfileMutation } from '../../../../services/onboarding'
import ChangePassword from '../../../../shared/components/auth-wrapper/change-password'

const AdminSettings = ({ open, onClose, userData }) => {
  const theme = useTheme()
  const { t } = useTranslation('application')
  const dispatch = useDispatch()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  const [updateName] = useEditAdminProfileMutation()

  const schemaResolver = yupResolver(
    yup.object().shape({
      firstName: yup
        .string()
        .trim()
        .required(t('application:PROFILE.VALIDATION_FIRSTNAME_REQ'))
        .max(100, t('application:PROFILE.VALIDATION_FIRSTNAME_MAX')),
      lastName: yup
        .string()
        .trim()
        .required(t('application:PROFILE.VALIDATION_LASTNAME_REQ'))
        .max(100, t('application:PROFILE.VALIDATION_LASTNAME_MAX')),
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
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={matches}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: matches ? 0 : 3,
          overflow: 'visible',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h5"
          component="span"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {t('application:PROFILE.PROFILE_SETTINGS')}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: alpha(theme.palette.grey[500], 0.1),
            },
          }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          {/* Personal Information Section */}
          <Box sx={{ pb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2.5,
                color: theme.palette.text.primary,
              }}
            >
              {t('application:PROFILE.PERSONAL_INFO')}
            </Typography>

            <Box display="grid" gridTemplateColumns={!matches ? '1fr 1fr' : '1fr'} gap={2.5}>
              <FormControl fullWidth>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 0.5,
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {t('application:PROFILE.FIRST_NAME')}
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
                      placeholder={t('application:PROFILE.PLACEHOLDER_FIRST_NAME')}
                      {...field}
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
              </FormControl>

              <FormControl fullWidth>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 0.5,
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {t('application:PROFILE.LAST_NAME')}
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
                      placeholder={t('application:PROFILE.PLACEHOLDER_LAST_NAME')}
                      {...field}
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
              </FormControl>
            </Box>

            <Button size="medium" type="submit" variant="contained">
              {t('application:MISCELLANEOUS.SAVE')}
            </Button>
          </Box>
        </form>

        {/* Change Password Section */}
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ pb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2.5,
              color: theme.palette.text.primary,
            }}
          >
            {t('application:PROFILE.CHANGE_PASSWORD')}
          </Typography>
          <ChangePassword
            closeModal={onClose}
            userEmail={userData?.email}
            headerName={null}
            isUserAdmin
            resetPassword={() => {}}
            isResetPassword={false}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

AdminSettings.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
}

export default AdminSettings
