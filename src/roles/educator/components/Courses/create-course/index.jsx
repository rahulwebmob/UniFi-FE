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
} from '@mui/material'
import { Check, Circle, CircleCheck, Loader2 } from 'lucide-react'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { updateShowPrompt } from '../../../../../redux/reducers/education-slice'
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
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: theme.palette.success.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <Check size={18} />
      </Box>
    )
  }

  if (active) {
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <CircleCheck size={20} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: `2px solid ${theme.palette.grey[400]}`,
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Circle size={16} color={theme.palette.grey[400]} />
    </Box>
  )
}

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
}

const CreateCourse = ({
  isEdit = false,
  courseId = '',
  isPreview = false,
  isPublished = false,
  currentStep = 0,
  defaultValues = {
    title: '',
    subtitle: '',
    description: '',
    category: [],
    isPaid: true,
    price: null,
    image: '',
    video: '',
  },
}) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation('education')

  const [isDraft, setIsDraft] = useState(false)
  const [hasLessons, setHasLessons] = useState({})
  const [previousVideo, setPreviousVideo] = useState(null)
  const [previousImage, setPreviousImage] = useState(null)
  const [activeStep, setActiveStep] = useState(currentStep)
  const [initialData, setInitialData] = useState(defaultValues)
  const [currentCourseId, setCurrentCourseId] = useState(courseId)
  const [categories, setCategories] = useState(defaultValues?.category)
  const [isCourseFree, setIsCourseFree] = useState(!defaultValues?.isPaid)

  const [updateCourse, { isLoading: isUpdateLoading }] = useUpdateCourseMutation()
  const [createCourse, { isLoading: isCreateLoading }] = useCreateCourseMutation()
  const [addCourseMetaData, { isLoading: isMetaDataLoading }] = useAddCourseMetaDataMutation()

  const stepsConfig = (t) => [
    {
      label: t('EDUCATOR.CREATE_COURSE.BASIC_DETAILS'),
      description: t('EDUCATOR.CREATE_COURSE.BASIC_DETAILS_DESCRIPTION'),
      buttonLabel: t('EDUCATOR.CREATE_COURSE.CONTINUE'),
    },
    {
      label: t('EDUCATOR.CREATE_COURSE.SETUP_COURSE'),
      description: t('EDUCATOR.CREATE_COURSE.SETUP_COURSE_DESCRIPTION'),
      buttonLabel: t('EDUCATOR.CREATE_COURSE.CONTINUE'),
    },
    {
      label: t('EDUCATOR.CREATE_COURSE.ADD_CHAPTERS'),
      description: t('EDUCATOR.CREATE_COURSE.ADD_CHAPTERS_DESCRIPTION'),
      buttonLabel: t('EDUCATOR.CREATE_COURSE.PREVIEW'),
    },
    {
      label: t('EDUCATOR.CREATE_COURSE.PREVIEW_COURSE'),
      description: t('EDUCATOR.CREATE_COURSE.PREVIEW_COURSE_DESCRIPTION'),
      buttonLabel: t('EDUCATOR.CREATE_COURSE.PUBLISH'),
    },
  ]

  const shouldNotPreview = useMemo(
    () =>
      (isPublished && activeStep === stepsConfig(t).length - 1) ||
      (activeStep === stepsConfig(t).length - 2 &&
        !Object.values(hasLessons).length &&
        Object.values(hasLessons).every((count) => count)),
    [hasLessons, activeStep, isPublished, t],
  )

  const isLoading = useMemo(
    () => isUpdateLoading || isCreateLoading || isMetaDataLoading,
    [isUpdateLoading, isCreateLoading, isMetaDataLoading],
  )

  const validationSchemas = [
    // Schema for Basic Details
    yup.object({
      title: yup
        .string()
        .trim()
        .required(t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.TITLE_IS_REQUIRED'))
        .max(100, t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.MAXIMUM_100_CHARACTERS')),
      subtitle: yup
        .string()
        .trim()
        .required(t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.SUBTITLE_IS_REQUIRED'))
        .max(150, t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.MAXIMUM_150_CHARACTERS')),
      description: yup
        .string()
        .trim()
        .required(t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.DESCRIPTION_IS_REQUIRED'))
        .max(1000, t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.MAXIMUM_1000_CHARACTERS')),
      category: yup
        .array()
        .of(yup.string().trim())
        .min(1, t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.AT_LEAST_ONE_CATEGORY'))
        .max(5, t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.MAXIMUM_5_CATEGORIES')),
      isPaid: yup.bool(),
      price: yup.lazy((_, schemaValues) =>
        schemaValues?.originalValue?.isPaid
          ? yup
              .number()
              .transform(transformNaNToNull)
              .required(t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICE_IS_REQUIRED'))
              .positive(t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICE_IS_REQUIRED'))
              .max(1000, t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICE_CANNOT_EXCEED_1000'))
          : yup.number().nullable().transform(transformNaNToNull),
      ),
    }),
    // Schema for Meta Data
    yup.object({
      image: yup
        .mixed()
        .test(
          'file-type',
          t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.IMAGE_MUST_BE_A_JPG_JPEG_PNG'),
          (value) => {
            if (!value || !(value instanceof File)) {
              return true
            }
            const allowedExtensions = ['jpg', 'jpeg', 'png']
            const fileExtension = value.name.split('.').pop()?.toLowerCase()
            return allowedExtensions.includes(fileExtension || '')
          },
        )
        .test(
          'file-validation',
          t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.IMAGE_REQUIRED_AND_LESS_THAN_50MB'),
          (value) => {
            const isFile = value instanceof File
            if (isEdit && !isFile && value?.trim?.()) {
              return true
            }
            if (isFile) {
              const fileSizeValid = value.size <= 50 * 1024 * 1024
              const allowedExtensions = ['jpg', 'jpeg', 'png']
              const fileExtension = value.name.split('.').pop()?.toLowerCase()
              const fileTypeValid = allowedExtensions.includes(fileExtension || '')
              return fileSizeValid && fileTypeValid
            }
            return false
          },
        ),
      video: yup
        .mixed()
        .test('file-type', t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.VIDEO_FORMAT_MSG'), (value) => {
          if (!value || !(value instanceof File)) {
            return true
          }
          const allowedExtensions = ['mp4', 'mov', 'webm', 'mkv']
          const fileExtension = value.name.split('.').pop()?.toLowerCase()
          return allowedExtensions.includes(fileExtension || '')
        })
        .test(
          'file-validation',
          t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.VIDEO_REQUIRED_AND_LESS_THAN_200MB'),
          (value) => {
            const isFile = value instanceof File
            if (isEdit && !isFile && value?.trim?.()) {
              return true
            }
            if (isFile) {
              const fileSizeValid = value.size <= 200 * 1024 * 1024
              const allowedExtensions = ['mp4', 'mov', 'webm', 'mkv']
              const fileExtension = value.name.split('.').pop()?.toLowerCase()
              const fileTypeValid = allowedExtensions.includes(fileExtension || '')
              return fileSizeValid && fileTypeValid
            }
            return false
          },
        ),
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
    dispatch(updateShowPrompt(form.formState.isDirty))
  }, [form.formState.isDirty, dispatch])

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/educator')
    } else {
      setActiveStep((prev) => prev - 1)
    }
  }

  const handleBasicDetailsSubmit = async (data) => {
    setIsCourseFree(!data.isPaid)
    const [updatedFields, isIdentical] = getUpdatedFields(data, initialData, ['image', 'video'])

    if (isIdentical && !isDraft) {
      setActiveStep((prev) => prev + 1)
      return
    }

    const payload = {
      ...updatedFields,
      ...(!isDraft ? updatedFields : data),
      saveAsDraft: isDraft,
      isPaid: data.isPaid,
    }

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
    } catch (error) {
      console.error('Error submitting basic details:', error)
    }
  }

  const handleMetaData = async (data) => {
    const { image, video } = data
    const formData = new FormData()
    formData.append('courseId', currentCourseId)
    if (isDraft) {
      formData.append('saveAsDraft', 'true')
    }

    if (image && isNewFile(image, previousImage)) {
      formData.append('image', image)
    }

    if (video && isNewFile(video, previousVideo)) {
      formData.append('video', video)
    }

    if (!isNewFile(image, previousImage) && !isNewFile(video, previousVideo) && !isDraft) {
      setActiveStep((prev) => prev + 1)
      return
    }

    try {
      const response = await addCourseMetaData(formData)

      if (!response.error) {
        if (image && isNewFile(image, previousImage)) {
          setPreviousImage(image)
        }
        if (video && isNewFile(video, previousVideo)) {
          setPreviousVideo(video)
        }

        if (!isDraft) {
          setActiveStep((prev) => prev + 1)
        }
        setIsDraft(false)
      }
    } catch (error) {
      console.error('Error submitting metadata:', error)
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
        return <Typography>Unknown step</Typography>
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
      return t('EDUCATOR.CREATE_COURSE.PREVIEW')
    }
    if (isEdit) {
      return t('EDUCATOR.CREATE_COURSE.EDIT')
    }
    return t('EDUCATOR.CREATE_COURSE.CREATE')
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <FormProvider
        {...form}
        {...{
          categories,
          courseId: currentCourseId,
          savedValues: defaultValues,
          isCourseFree,
          setHasLessons,
          setCategories,
        }}
      >
        {activeStep !== 3 && (
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                color: theme.palette.text.primary,
              }}
            >
              {handleGetTitle()} {t('EDUCATOR.CREATE_COURSE.COURSE')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.875rem', md: '1rem' },
              }}
            >
              {t('EDUCATOR.CREATE_COURSE.DESCRIPTION')}
            </Typography>
          </Box>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Stepper Section */}
          {activeStep !== 3 && (
            <Grid item size={{ xs: 12, md: 3 }}>
              <Box
                sx={{
                  background: theme.palette.background.paper,
                  borderRadius: { xs: 2, md: 3 },
                  p: { xs: 2, md: 3 },
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[1],
                  position: { md: 'sticky' },
                  top: { md: 24 },
                }}
              >
                <Stepper
                  activeStep={activeStep}
                  orientation="vertical"
                  sx={{
                    '& .MuiStepContent-root': {
                      borderLeft: `2px solid ${theme.palette.divider}`,
                      borderRight: '0',
                      marginRight: '0',
                      marginLeft: '21px',
                      paddingLeft: { xs: 2, md: 3 },
                      paddingRight: 0,
                    },
                    '& .MuiStepConnector-root': {
                      marginLeft: '16px',
                      marginRight: '0',
                    },
                    '& .MuiStepConnector-line': {
                      borderColor: theme.palette.divider,
                      borderLeftWidth: '2px',
                      borderRightWidth: '0',
                    },
                  }}
                >
                  {stepsConfig(t).map((step) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={StepIcon}
                        sx={{
                          textAlign: 'left',
                          '& .MuiStepLabel-label': {
                            fontWeight: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            '&.Mui-active': {
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                            },
                            '&.Mui-completed': {
                              color: theme.palette.success.main,
                              fontWeight: 600,
                            },
                          },
                        }}
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent
                        sx={{
                          textAlign: 'left',
                          mt: 1,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: '0.75rem', md: '0.813rem' },
                            lineHeight: 1.6,
                          }}
                        >
                          {step.description}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Grid>
          )}

          {/* Form Section */}
          <Grid item size={{ xs: 12, md: activeStep !== 3 ? 9 : 12 }}>
            <Box
              sx={{
                background: theme.palette.background.paper,
                borderRadius: { xs: 2, md: 3 },
                p: { xs: 2, sm: 3, md: 4 },
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                minHeight: { xs: 400, md: 500 },
              }}
            >
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {renderStepContent(activeStep)}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    mt: { xs: 3, md: 4 },
                    pt: { xs: 2, md: 3 },
                    borderTop: `1px solid ${theme.palette.divider}`,
                    gap: 2,
                  }}
                >
                  {!isPreview && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      fullWidth={theme.breakpoints.down('sm') ? true : false}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: theme.palette.divider,
                        px: { xs: 2, md: 3 },
                        py: { xs: 1, md: 1.25 },
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        borderRadius: 2,
                        minWidth: { sm: 120 },
                        '&:hover': {
                          borderColor: theme.palette.text.secondary,
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                      disabled={isLoading}
                      onClick={handleBack}
                    >
                      {activeStep === 0
                        ? t('EDUCATOR.CREATE_COURSE.BACK_TO_DASHBOARD')
                        : t('EDUCATOR.CREATE_COURSE.BACK')}
                    </Button>
                  )}
                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    width={{ xs: '100%', sm: 'auto' }}
                  >
                    {!isPublished && (
                      <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        onClick={() => setIsDraft(true)}
                        disabled={isLoading}
                        fullWidth={theme.breakpoints.down('sm') ? true : false}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 500,
                          px: { xs: 2, md: 3 },
                          py: { xs: 1, md: 1.25 },
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          borderRadius: 2,
                          minWidth: { sm: 140 },
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        {t('EDUCATOR.CREATE_COURSE.SAVE_AS_DRAFT')}
                      </Button>
                    )}
                    {!shouldNotPreview && (
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        fullWidth={theme.breakpoints.down('sm') ? true : false}
                        startIcon={isLoading && <Loader2 className="animate-spin" size={20} />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          px: { xs: 3, md: 4 },
                          py: { xs: 1, md: 1.25 },
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          borderRadius: 2,
                          minWidth: { sm: 140 },
                          boxShadow: theme.shadows[2],
                          '&:hover': {
                            boxShadow: theme.shadows[4],
                          },
                        }}
                      >
                        {isLoading
                          ? t('EDUCATOR.CREATE_COURSE.SUBMITTING')
                          : stepsConfig(t)?.[activeStep]?.buttonLabel}
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

CreateCourse.propTypes = {
  isEdit: PropTypes.bool,
  courseId: PropTypes.string,
  isPreview: PropTypes.bool,
  isPublished: PropTypes.bool,
  currentStep: PropTypes.number,
  defaultValues: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.array,
    isPaid: PropTypes.bool,
    price: PropTypes.number,
    image: PropTypes.string,
    video: PropTypes.string,
  }),
}

export default CreateCourse
