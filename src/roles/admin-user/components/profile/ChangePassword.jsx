import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  FormControl,
  useMediaQuery,
  InputAdornment,
} from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'

import { updateUser } from '../../../../redux/reducers/user-slice'
import { useResetPasswordMutation } from '../../../../services/admin'
import { useEditAdminProfileMutation } from '../../../../services/onboarding'

const ChangePassword = ({
  closeModal,
  userEmail,
  headerName,
  isUserAdmin,
  resetPassword,
  isResetPassword,
}) => {
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    currentPassword: false,
    confirmPassword: false,
  })

  const dispatch = useDispatch()
  const { t } = useTranslation('application')
  const matches = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const isPasswordMissing = useSelector((state) => state.user?.user?.isPasswordMissing ?? false)

  const [resetUserPassword] = useResetPasswordMutation()
  const [updateAdminPassword] = useEditAdminProfileMutation()

  const schemaResolver =
    isResetPassword || isPasswordMissing
      ? yup.object().shape({
          password: yup
            .string()
            .trim()
            .required(t('application:PROFILE.VALIDATION_NEW_PASSWORD'))
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_+\-~()`{}[\]:;"'<>/?.,|\\]).{8,}$/,
              t('application:PROFILE.VALIDATION_PASSWORD_MATCH'),
            ),
          confirmPassword: yup
            .string()
            .trim()
            .required(t('application:PROFILE.VALIDATION_CONFIRM_PASSWORD'))
            .oneOf(
              [yup.ref('password')],
              t('application:PROFILE.VALIDATION_CONFIRM_PASSWORD_MATCH'),
            ),
        })
      : yup.object().shape({
          currentPassword: yup
            .string()
            .trim()
            .required(t('application:PROFILE.VALIDATION_PASSWORD'))
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_+\-~()`{}[\]:;"'<>/?.,|\\]).{8,}$/,
              t('application:PROFILE.VALIDATION_PASSWORD_MATCH'),
            ),
          password: yup
            .string()
            .trim()
            .required(t('application:PROFILE.VALIDATION_NEW_PASSWORD'))
            .notOneOf(
              [yup.ref('currentPassword'), null],
              t('application:PROFILE.VALIDATION_DIFFERENT_PASSWORD'),
            )
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_+\-~()`{}[\]:;"'<>/?.,|\\]).{8,}$/,
              t('application:PROFILE.VALIDATION_PASSWORD_MATCH'),
            ),
          confirmPassword: yup
            .string()
            .trim()
            .required(t('application:PROFILE.VALIDATION_CONFIRM_PASSWORD'))
            .oneOf(
              [yup.ref('password')],
              t('application:PROFILE.VALIDATION_CONFIRM_PASSWORD_MATCH'),
            ),
        })

  const defaultValues = isPasswordMissing
    ? { password: '', confirmPassword: '' }
    : { currentPassword: '', password: '', confirmPassword: '' }

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaResolver),
    defaultValues,
  })

  const onSubmit = async (values) => {
    let response
    if (isUserAdmin) {
      response = await updateAdminPassword({ ...values, update: 'password' })
    } else if (!isResetPassword) {
      response = await resetUserPassword({
        newPassword: values.password,
        currentPassword: values.currentPassword,
        confirmPassword: values.confirmPassword,
      })
      if (isPasswordMissing) {
        dispatch(updateUser({ isPasswordMissing: false }))
      }
    }
    if (!response?.error) {
      closeModal()
      reset()
      if (
        !isUserAdmin &&
        !isResetPassword &&
        response?.data &&
        typeof response.data === 'object' &&
        response.data !== null &&
        'token' in response.data
      ) {
        const responseData = response.data
        localStorage.setItem('token', responseData.token)

        // After successful password reset, logout the user
        setTimeout(() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }, 1500) // Give user 1.5 seconds to see success before redirect
      }
    }
    resetPassword?.(values)
  }

  return (
    <Box>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        {!!headerName && (
          <Typography variant="h6" className="profileTitle">
            {t('application:PROFILE.CHANGE_PASSWORD')}
          </Typography>
        )}

        <Box
          className="reset-password"
          display="grid"
          gridTemplateColumns={!matches ? '1fr 1fr' : '1fr'}
          gap="16px"
        >
          {isResetPassword ? (
            <FormControl fullWidth>
              <Typography
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.secondary,
                }}
              >
                Email
              </Typography>
              <TextField
                variant="outlined"
                type="email"
                size="small"
                fullWidth
                value={userEmail || ''}
                autoComplete="email"
                disabled
              />
            </FormControl>
          ) : (
            !isPasswordMissing && (
              <FormControl fullWidth>
                <Typography
                  sx={{
                    mb: 0.5,
                    fontWeight: 500,
                    color: (theme) => theme.palette.text.secondary,
                  }}
                >
                  {t('application:PROFILE.CURRENT_PASSWORD')}
                  <Typography variant="body1" color="error.main" component="span">
                    *
                  </Typography>
                </Typography>
                <Controller
                  name="currentPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      placeholder={t('application:PROFILE.ENTERYOUR_CURRENTPASSWORD')}
                      variant="outlined"
                      type={showPassword.currentPassword ? 'text' : 'password'}
                      fullWidth
                      size="small"
                      {...field}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" id="currentPassword">
                            <IconButton
                              className="custom-icon-button"
                              onClick={() =>
                                setShowPassword({
                                  ...showPassword,
                                  currentPassword: !showPassword.currentPassword,
                                })
                              }
                            >
                              {showPassword.currentPassword ? (
                                <Eye size={18} />
                              ) : (
                                <EyeOff size={18} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword?.message}
                      autoComplete="current-password"
                    />
                  )}
                />
              </FormControl>
            )
          )}
          <Box>
            <FormControl fullWidth>
              <Typography
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color: (theme) => theme.palette.text.secondary,
                }}
              >
                {t('application:PROFILE.NEWPASSWORD')}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>
              </Typography>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    placeholder={t('application:PROFILE.ENTERYOUR_NEWPASSWORD')}
                    variant="outlined"
                    type={showPassword.newPassword ? 'text' : 'password'}
                    fullWidth
                    size="small"
                    {...field}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" id="password">
                          <IconButton
                            className="custom-icon-button"
                            onClick={() =>
                              setShowPassword({
                                ...showPassword,
                                newPassword: !showPassword.newPassword,
                              })
                            }
                          >
                            {showPassword.newPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    autoComplete="new-password"
                  />
                )}
              />
            </FormControl>
          </Box>
          <FormControl fullWidth>
            <Typography
              sx={{
                mb: 0.5,
                fontWeight: 500,
                color: (theme) => theme.palette.text.secondary,
              }}
            >
              {t('application:PROFILE.CURRENT_CONFIRMNEWPASSWORD')}
              <Typography variant="body1" color="error.main" component="span">
                *
              </Typography>
            </Typography>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  placeholder={t('application:PROFILE.ENTERYOUR_CONFIRMPASSWORD')}
                  variant="outlined"
                  size="small"
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  fullWidth
                  {...field}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          className="custom-icon-button"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              confirmPassword: !showPassword.confirmPassword,
                            })
                          }
                        >
                          {showPassword.confirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  autoComplete="new-password"
                />
              )}
            />
          </FormControl>
        </Box>
        <Button
          size="small"
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: 1,
            textTransform: 'none',
          }}
        >
          {t('application:MISCELLANEOUS.SAVE')}
        </Button>
      </form>
    </Box>
  )
}

ChangePassword.propTypes = {
  closeModal: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
  headerName: PropTypes.string,
  isUserAdmin: PropTypes.bool,
  resetPassword: PropTypes.func,
  isResetPassword: PropTypes.bool,
}

export default ChangePassword
