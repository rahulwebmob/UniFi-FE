import * as yup from 'yup'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'

import { styled } from '@mui/material/styles'
import {
  Box,
  Button,
  Avatar,
  Divider,
  useTheme,
  TextField,
  Typography,
  FormControl,
  useMediaQuery,
} from '@mui/material'

import { generateImageUrl } from '../../../../../utils/globalUtils'
import { errorAlert } from '../../../../../redux/reducers/app-slice'
import { adminApi, useMyProfileMutation } from '../../../../../services/admin'
import ChangePassword from '../../../../admin-user/components/profile/ChangePassword'

import type { RootState } from '../../../../../redux/types'

interface PersonalInfoData {
  profileImage?: {
    folderName: string
    fileName: string
  }
  firstName?: string
  lastName?: string
  [key: string]: unknown
}

interface FormValues {
  firstName: string
  lastName: string
}

interface AvatarState {
  file: File | null
  image: string | null
}

const PersonalInfo = () => {
  const theme = useTheme()
  const { t } = useTranslation('application')
  const dispatch = useDispatch()
  const userState = useSelector((state: RootState) => state.user)
  const userData = userState.user as PersonalInfoData | undefined
  const { profileImage, firstName, lastName } = userData ?? {}

  console.log(profileImage, firstName, lastName)

  const [avatar, setAvatar] = useState<AvatarState>({ file: null, image: null })
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  const [editDetails] = useMyProfileMutation()

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  })

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
    if (profileImage) {
      const imageUrl = generateImageUrl(
        profileImage.folderName,
        profileImage.fileName,
      )
      setAvatar((prev) => ({ ...prev, image: imageUrl }))
    } else {
      setAvatar((prev) => ({ ...prev, image: null }))
    }
  }, [profileImage])

  useEffect(() => {
    setValue('firstName', firstName ?? '')
    setValue('lastName', lastName ?? '')
  }, [firstName, lastName, setValue])

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData()
    Object.keys(values).forEach((key) => {
      const typedKey = key as keyof FormValues
      if (values[typedKey] !== userData?.[key]) {
        formData.append(key, values[typedKey])
      }
    })
    if (avatar.file) {
      formData.append('profile', avatar.file)
    }

    const response = await editDetails(formData)
    if (!response.error) {
      dispatch(adminApi.util.invalidateTags(['Me']))
    }
  }

  const handleFormSubmit = (values: FormValues) => {
    void onSubmit(values)
    return
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        return t('application:PROFILE.ERROR_FILE_SIZE')
      }
      const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg']
      if (!allowedFormats.includes(file.type)) {
        return t('application:PROFILE.ERROR_FILE_TYPE')
      }
      setAvatar({ file, image: URL.createObjectURL(file) })
      return ''
    }
    return ''
  }

  return (
    <Box>
      <form
        className="editname-form"
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit(handleFormSubmit)(e)
        }}
      >
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

          {/* Avatar Edit Section */}
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                position: 'relative',
              }}
            >
              <Avatar
                alt={t('application:PROFILE.PROFILE_PICTURE')}
                src={avatar.image}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: '1.5rem',
                  backgroundColor: theme.palette.primary[100],
                  color: theme.palette.primary.main,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                imgProps={{
                  crossOrigin: 'anonymous',
                }}
              >
                {firstName &&
                  lastName &&
                  firstName.charAt(0).toUpperCase() +
                    lastName.charAt(0).toUpperCase()}
              </Avatar>

              <Box
                className="imgUpload"
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                }}
              >
                <Button
                  component="label"
                  variant="contained"
                  size="small"
                  sx={{
                    minWidth: 'auto',
                    p: 0.5,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <Upload size={16} color={theme.palette.common.white} />
                  <VisuallyHiddenInput
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => {
                      const error = handleFileChange(e)
                      if (error) {
                        dispatch(
                          errorAlert({
                            message: error,
                          }),
                        )
                      }
                    }}
                  />
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  mb: 0.5,
                }}
              >
                {t('application:PROFILE.PROFILE_PICTURE')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                JPG, JPEG or PNG. Max size 5MB
              </Typography>
            </Box>
          </Box>

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
                    placeholder={t(
                      'application:PROFILE.PLACEHOLDER_FIRST_NAME',
                    )}
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
      <>
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
            closeModal={undefined}
            userEmail={undefined}
            headerName={undefined}
            isUserAdmin={undefined}
            resetPassword={undefined}
            isResetPassword={undefined}
          />
        </Box>
      </>
    </Box>
  )
}

export default PersonalInfo
