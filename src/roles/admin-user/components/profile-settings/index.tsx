import * as yup from 'yup'
import { X } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
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

import ChangePassword from '../profile/ChangePassword'
import { signIn } from '../../../../Redux/Reducers/UserSlice'
import { useEditAdminProfileMutation } from '../../../../Services/onboarding'

interface UserData {
  _id?: string
  firstName?: string
  lastName?: string
  email?: string
  [key: string]: unknown
}

interface AdminProfileSettingsProps {
  open: boolean
  onClose: () => void
  userData: UserData | null
}

const AdminProfileSettings: React.FC<AdminProfileSettingsProps> = ({ open, onClose, userData }) => {
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
      setValue('firstName', userData?.firstName ?? '')
      setValue('lastName', userData?.lastName ?? '')
    }
  }, [userData, setValue])

  const onSubmit = async (values) => {
    const response = await updateName({ ...values, update: 'name' })
    if (!response.error) {
      const newToken = response?.data?.token
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

            <Box
              display="grid"
              gridTemplateColumns={!matches ? '1fr 1fr' : '1fr'}
              gap={2.5}
            >
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
                      error={!!errors?.firstName}
                      helperText={errors?.firstName?.message}
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
                      error={!!errors?.lastName}
                      helperText={errors?.lastName?.message}
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

            <Button
              size="medium"
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1,
                borderRadius: '8px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                },
              }}
            >
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
            resetPassword={false}
            isResetPassword={false}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AdminProfileSettings