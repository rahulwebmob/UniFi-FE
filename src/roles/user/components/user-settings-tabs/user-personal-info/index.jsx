import { yupResolver } from '@hookform/resolvers/yup'
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
import { styled } from '@mui/material/styles'
import { Upload, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'

import { errorAlert } from '../../../../../redux/reducers/app-slice'
import { adminApi, useMyProfileMutation } from '../../../../../services/admin'
import ChangePassword from '../../../../../shared/components/auth-wrapper/change-password'
import { generateImageUrl } from '../../../../../utils/globalUtils'

const PersonalInfo = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const userState = useSelector((state) => state.user)
  const userData = userState.user
  const { profileImage, firstName, lastName } = userData ?? {}

  const [avatar, setAvatar] = useState({ file: null, image: null })
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
    if (profileImage) {
      const imageUrl = generateImageUrl(`${profileImage.folderName}/${profileImage.fileName}`)
      setAvatar((prev) => ({ ...prev, image: imageUrl }))
    } else {
      setAvatar((prev) => ({ ...prev, image: null }))
    }
  }, [profileImage])

  useEffect(() => {
    setValue('firstName', firstName ?? '')
    setValue('lastName', lastName ?? '')
  }, [firstName, lastName, setValue])

  const onSubmit = async (values) => {
    if (avatar.file) {
      const formData = new FormData()
      Object.keys(values).forEach((key) => {
        const typedKey = key
        if (values[typedKey] !== userData?.[key]) {
          formData.append(key, values[typedKey])
        }
      })
      formData.append('profile', avatar.file)

      const response = await editDetails(formData)
      if (!response.error) {
        dispatch(adminApi.util.invalidateTags(['Me']))
      }
    } else {
      const updateData = {}
      Object.keys(values).forEach((key) => {
        const typedKey = key
        if (values[typedKey] !== userData?.[key]) {
          updateData[typedKey] = values[typedKey]
        }
      })

      if (Object.keys(updateData).length > 0) {
        const response = await editDetails(updateData)
        if (!response.error) {
          dispatch(adminApi.util.invalidateTags(['Me']))
        }
      }
    }
  }

  const handleFormSubmit = (values) => {
    void onSubmit(values)
    return
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        return 'File size must be less than 5MB'
      }
      const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg']
      if (!allowedFormats.includes(file.type)) {
        return 'Only JPG, JPEG and PNG formats are allowed'
      }
      setAvatar({ file, image: URL.createObjectURL(file) })
      return ''
    }
    return ''
  }

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit(handleFormSubmit)(e)
        }}
      >
        <Box pb={3}>
          <Typography variant="h6" mb={2.5}>
            Personal Information
          </Typography>

          <Box mb={3} display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                position: 'relative',
              }}
            >
              <Avatar
                alt="Profile Picture"
                src={avatar.image ?? undefined}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: '1.5rem',
                  backgroundColor: theme.palette.primary[100],
                  color: theme.palette.primary.main,
                  boxShadow: theme.shadows[2],
                }}
                imgProps={{
                  crossOrigin: 'anonymous',
                }}
              >
                {firstName &&
                  lastName &&
                  firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
              </Avatar>

              <Box
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
                    boxShadow: theme.shadows[3],
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
              <Typography variant="body2" fontWeight={500} color="text.secondary" mb={0.5}>
                Profile Picture
              </Typography>
              <Typography variant="caption" color="text.secondary">
                JPG, JPEG or PNG. Max size 5MB
              </Typography>
            </Box>
          </Box>

          <Box display="grid" gridTemplateColumns={!matches ? '1fr 1fr' : '1fr'} gap={2.5} mb={1}>
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
            mt={1}
            startIcon={<Save size={18} />}
          >
            Save
          </Button>
        </Box>
      </form>

      <>
        <Divider mb={3} />
        <Box pb={3}>
          <Typography variant="h6" mb={2.5}>
            Change Password
          </Typography>
          <ChangePassword
            closeModal={() => {}}
            userEmail={userData?.email}
            headerName={null}
            isUserAdmin={false}
            resetPassword={undefined}
            isResetPassword={false}
          />
        </Box>
      </>
    </Box>
  )
}

export default PersonalInfo
