import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Grid,
  Step,
  Button,
  Stepper,
  useTheme,
  StepLabel,
  Typography,
  StepContent,
  CircularProgress,
} from '@mui/material'
import { CheckCircle, ArrowLeft, Save, Eye } from 'lucide-react'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useAddCourseMetaDataMutation,
} from '../../../../../services/admin'
import { isNewFile, getUpdatedFields, transformNaNToNull } from '../../common/common'
import PreviewCourse from '../preview-course'

import BasicDetails from './basic-details'
import Chapter from './chapter'
import MetaData from './meta-data'

const StepIcon = ({ active = false, completed = false }) => {
  const theme = useTheme()

  if (completed) {
    return (
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: theme.palette.success.main,
            opacity: 0.1,
            zIndex: -1,
          },
        }}
      >
        <CheckCircle size={22} color={theme.palette.common.white} strokeWidth={2.5} />
      </Box>
    )
  }

  if (active) {
    return (
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          position: 'relative',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            '50%': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            },
            '100%': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: theme.palette.primary.main,
            opacity: 0.15,
            zIndex: -1,
          },
        }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: (theme) => theme.palette.background.paper,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: `2px solid ${theme.palette.grey[300]}`,
        backgroundColor: theme.palette.grey[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: theme.palette.grey[400],
        }}
      />
    </Box>
  )
}

const stepsConfig = () => [
  {
    label: 'Basic Details',
    description: 'Enter the fundamental information about your course',
    buttonLabel: 'Continue',
  },
  {
    label: 'Setup Course',
    description: 'Upload course images and preview video',
    buttonLabel: 'Continue',
  },
  {
    label: 'Add Chapters',
    description: 'Organize your course content into chapters',
    buttonLabel: 'Preview',
  },
  {
    label: 'Preview Recorded Session',
    description: 'Review your recorded session before publishing',
    buttonLabel: 'Publish',
  },
]

const CreateCourse = ({
  isEdit = false,
  courseId = '',
  isPreview = false,
  isPublished = false,
  currentStep = 0,
  defaultValues = {
    title: '',
    image: '',
    video: '',
    price: null,
    subtitle: '',
    isPaid: true,
    category: [],
    description: '',
  },
}) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [isDraft, setIsDraft] = useState(false)
  const [hasLesons, setHasLessons] = useState({})
  const [previousVideo, setPreviousVideo] = useState(null)
  const [previousImage, setPreviousImage] = useState(null)
  const [activeStep, setActiveStep] = useState(currentStep || 0)
  const [initialData, setInitialData] = useState(defaultValues)

  const [currentCourseId, setCurrentCourseId] = useState(courseId)
  const [categories, setCategories] = useState(defaultValues?.category)
  const [isCourseFree, setIsCourseFree] = useState(!defaultValues?.isPaid)

  const [updateCourse, { isLoading: isUpdateLoading }] = useUpdateCourseMutation()
  const [createCourse, { isLoading: isCreateLoading }] = useCreateCourseMutation()
  const [addCourseMetaData, { isLoading: isMetaDataLoading }] = useAddCourseMetaDataMutation()

  const shouldNotPreview = useMemo(
    () =>
      (isPublished && activeStep === stepsConfig().length - 1) ||
      (activeStep === stepsConfig().length - 2 &&
        !Object.values(hasLesons).length &&
        Object.values(hasLesons).every((count) => count)),
    [hasLesons, activeStep, isPublished],
  )

  const isLoading = useMemo(
    () => isUpdateLoading || isCreateLoading || isMetaDataLoading,
    [isUpdateLoading, isCreateLoading, isMetaDataLoading],
  )

  const validationSchemas = [
    // Schema for Basic Details
    yup.object({
      title: yup.string().trim().required('Title is required').max(100, 'Maximum 100 characters'),
      subtitle: yup
        .string()
        .trim()
        .required('Subtitle is required')
        .max(150, 'Maximum 150 characters'),
      description: yup
        .string()
        .trim()
        .required('Description is required')
        .max(1000, 'Maximum 1000 characters'),
      category: yup
        .array()
        .of(yup.string().trim())
        .min(1, 'At least one category is required')
        .max(5, 'Maximum 5 categories'),
      isPaid: yup.bool(),
      price: yup.lazy((_, schemaValues) =>
        schemaValues?.originalValue?.isPaid
          ? yup
              .number()
              .transform(transformNaNToNull)
              .required('Price is required')
              .positive('Price must be positive')
              .max(1000, 'Price cannot exceed 1000')
          : yup.number().nullable().transform(transformNaNToNull),
      ),
    }),
    // Schema for Meta Data
    yup.object({
      image: yup
        .mixed()
        .test('file-type', 'Image must be a JPG, JPEG, or PNG file', (value) => {
          if (!value || !(value instanceof File)) {
            return true
          }
          const allowedExtensions = ['jpg', 'jpeg', 'png']
          const fileExtension = value.name.split('.').pop().toLowerCase()
          return allowedExtensions.includes(fileExtension)
        })
        .test('file-validation', 'Image is required and must be less than 50MB', (value) => {
          const isFile = value instanceof File
          if (isEdit && !isFile && value.trim()) {
            return true
          }
          if (isFile) {
            const fileSizeValid = value.size <= 50 * 1024 * 1024
            const allowedExtensions = ['jpg', 'jpeg', 'png']
            const fileExtension = value.name.split('.').pop().toLowerCase()
            const fileTypeValid = allowedExtensions.includes(fileExtension)
            return fileSizeValid && fileTypeValid
          }
          return false
        }),
      video: yup
        .mixed()
        .test('file-type', 'Video must be MP4, MOV, WEBM or MKV format', (value) => {
          if (!value || !(value instanceof File)) {
            return true
          }
          const allowedExtensions = ['mp4', 'mov', 'webm', 'mkv']
          const fileExtension = value.name.split('.').pop().toLowerCase()
          return allowedExtensions.includes(fileExtension)
        })
        .test('file-validation', 'Video is required and must be less than 200MB', (value) => {
          const isFile = value instanceof File
          if (isEdit && !isFile && value.trim()) {
            return true
          }
          if (isFile) {
            const fileSizeValid = value.size <= 200 * 1024 * 1024
            const allowedExtensions = ['mp4', 'mov', 'webm', 'mkv']
            const fileExtension = value.name.split('.').pop().toLowerCase()
            const fileTypeValid = allowedExtensions.includes(fileExtension)
            return fileSizeValid && fileTypeValid
          }
          return false
        }),
    }),

    // Schema for non-required steps
    yup.object({}),
    yup.object({}),
  ]

  const form = useForm({
    resolver: yupResolver(validationSchemas[activeStep]),
    defaultValues,
  })

  useEffect(() => {
    // dispatch(updateShowPrompt(form.formState.isDirty))
  }, [form.formState.isDirty])

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/educator')
    } else {
      setActiveStep((prev) => prev - 1)
    }
  }

  const handleBasicDetailsSubmit = async (data) => {
    // checks if data is identical
    setIsCourseFree(!data.isPaid)
    const [updatedFields, isIdentical] = getUpdatedFields(data, initialData, ['image', 'video'])

    if (isIdentical && !isDraft) {
      setActiveStep((prev) => prev + 1)
      return
    }

    // payload
    const payload = {
      ...updatedFields,
      isPaid: data.isPaid,
      saveAsDraft: isDraft,
      ...(!isDraft ? updatedFields : data),
    }

    // checks if course is free
    if (!data.isPaid) {
      delete payload.price
    }

    try {
      const response = currentCourseId
        ? await updateCourse({ ...payload, courseId: currentCourseId })
        : await createCourse(payload)

      if (!response?.error) {
        setInitialData((prev) => ({ ...prev, ...data }))
        if (!currentCourseId) {
          setCurrentCourseId(response?.data?.data?._id)
        }
        if (!isDraft) {
          setActiveStep((prev) => prev + 1)
        }
      }

      setIsDraft(false)
    } catch {
      // error
    }
  }

  const handleMetaData = async (data) => {
    const { image, video } = data
    const formData = new FormData()
    formData.append('courseId', currentCourseId)
    if (isDraft) {
      formData.append('saveAsDraft', true)
    }

    if (isNewFile(image, previousImage)) {
      formData.append('image', image)
    }

    if (isNewFile(video, previousVideo)) {
      formData.append('video', video)
    }
    if (!isNewFile(image, previousImage) && !isNewFile(video, previousVideo) && !isDraft) {
      setActiveStep((prev) => prev + 1)
      return
    }

    try {
      const response = await addCourseMetaData(formData)

      if (!response.error) {
        if (isNewFile(image, previousImage)) {
          setPreviousImage(image)
        }
        if (isNewFile(video, previousVideo)) {
          setPreviousVideo(video)
        }

        if (!isDraft) {
          setActiveStep((prev) => prev + 1)
        }

        setIsDraft(false)
      }
    } catch {
      // error
    }
  }

  const handlePreview = async () => {
    if (isDraft) {
      await updateCourse({
        status: 'draft',
        courseId: currentCourseId,
      })
      setIsDraft(false)
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handlePublish = async () => {
    if (isDraft) {
      await updateCourse({
        status: 'draft',
        courseId: currentCourseId,
      })
      setIsDraft(false)
    } else {
      const response = await updateCourse({
        status: 'published',
        courseId: currentCourseId,
      })
      if (!response.error) {
        navigate('/educator/courses')
      }
    }
  }

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <BasicDetails />
      case 1:
        return <MetaData />
      case 2:
        return <Chapter />
      case 3:
        return <PreviewCourse />
      default:
        return null
    }
  }

  const onSubmit = async (data) => {
    if (activeStep === 0) {
      await handleBasicDetailsSubmit(data)
    }
    if (activeStep === 1) {
      await handleMetaData(data)
    }
    if (activeStep === 2) {
      await handlePreview()
    }
    if (activeStep === 3) {
      await handlePublish()
    }
  }

  const handleGetTitle = () => {
    if (isPreview) {
      return 'Preview'
    }
    if (isEdit) {
      return 'Edit'
    }
    return 'Create'
  }

  return (
    <Box>
      <FormProvider
        {...form}
        categories={categories}
        courseId={currentCourseId}
        savedValues={defaultValues}
        isCourseFree={isCourseFree}
        setHasLessons={setHasLessons}
        setCategories={setCategories}
      >
        {activeStep !== 3 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {handleGetTitle()} Course
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create comprehensive courses with chapters and lessons
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          {/* Stepper Section */}
          {activeStep !== 3 && (
            <Grid
              size={{ xs: 12, md: 3 }}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.background.light,
                border: (theme) => `1px solid ${theme.palette.grey[200]}`,
                boxShadow: (theme) => theme.customShadows.primary,
                minHeight: '380px',
                '& .MuiStepLabel-root': {
                  '.Mui-active ': {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                sx={{
                  position: 'sticky',
                  top: 0,
                  '& .MuiStepContent-root': {
                    borderLeft: `2px solid ${theme.palette.grey[300]}`,
                    marginLeft: '16px',
                    paddingLeft: '20px',
                  },
                  '& .MuiStepConnector-root': {
                    marginLeft: '16px',
                  },
                  '& .MuiStepConnector-line': {
                    borderLeft: `2px solid ${theme.palette.grey[300]}`,
                  },
                }}
              >
                {stepsConfig().map((step) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={StepIcon}
                      sx={{
                        textAlign: 'left',
                      }}
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent
                      sx={{
                        textAlign: 'left',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          mt: 0.5,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Grid>
          )}
          <Grid size={{ xs: 12, md: activeStep !== 3 ? 9 : 12 }}>
            <Box
              sx={{
                ...(activeStep !== 3 && {
                  p: 3,
                  mb: 4,
                  borderRadius: 1,
                  backgroundColor: (theme) => theme.palette.background.light,
                  border: (theme) => `1px solid ${theme.palette.grey[200]}`,
                  boxShadow: (theme) => theme.customShadows.primary,
                }),
              }}
            >
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {renderStepContent(activeStep)}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    mt: 2,
                    gap: '10px',
                  }}
                >
                  {!isPreview && (
                    <Button
                      variant="outlined"
                      startIcon={<ArrowLeft size={18} />}
                      disabled={isLoading}
                      onClick={handleBack}
                    >
                      {activeStep === 0 ? 'Back to Dashboard' : 'Back'}
                    </Button>
                  )}
                  <Box display="flex" gap="10px">
                    {!isPublished && (
                      <Button
                        type="submit"
                        variant="outlined"
                        startIcon={<Save size={18} />}
                        onClick={() => {
                          setIsDraft(true)
                        }}
                        disabled={isLoading}
                      >
                        Save as Draft
                      </Button>
                    )}
                    {!shouldNotPreview && (
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        startIcon={
                          isLoading ? (
                            <CircularProgress size="1em" />
                          ) : activeStep === 2 ? (
                            <Eye size={18} />
                          ) : null
                        }
                      >
                        {isLoading
                          ? 'Submitting...'
                          : stepsConfig()?.[activeStep]?.buttonLabel || 'Continue'}
                      </Button>
                    )}
                  </Box>
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  )
}

export default CreateCourse

CreateCourse.propTypes = {
  isEdit: PropTypes.bool,
  isPreview: PropTypes.bool,
  courseId: PropTypes.string,
  isPublished: PropTypes.bool,
  currentStep: PropTypes.number,
  defaultValues: PropTypes.oneOfType([PropTypes.object]),
}

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
}
