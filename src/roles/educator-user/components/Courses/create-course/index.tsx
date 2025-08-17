import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { Check, Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FormProvider } from 'react-hook-form'
import { useMemo, useState, useEffect } from 'react'

import type { CreateCourseFormData, DataObject } from '../../../../../types'
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

import Chapter from './chapter'
import MetaData from './meta-data'
import BasicDetails from './basic-details'
import PreviewCourse from '../preview-course'
import { updateShowPrompt } from '../../../../../redux/reducers/education-slice'
import {
  isNewFile,
  getUpdatedFields,
  transformNaNToNull,
} from '../../common/common'
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useAddCourseMetaDataMutation,
} from '../../../../../services/admin'

interface StepIconProps {
  active?: boolean
  completed?: boolean
}

const StepIcon = ({ active, completed }: StepIconProps) => {
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
        }}
      >
        <Check size={18} color="white" strokeWidth={3} />
      </Box>
    )
  } else if (active) {
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
          boxShadow: `0 0 0 4px ${theme.palette.primary.main}20`,
        }}
      >
        <Circle size={8} color="white" fill="white" />
      </Box>
    )
  } else {
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `2px solid ${theme.palette.grey[300]}`,
          backgroundColor: 'transparent',
        }}
      />
    )
  }
}

interface StepConfig {
  label: string
  description: string
  buttonLabel: string
}

const stepsConfig = (t: (key: string) => string): StepConfig[] => [
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

interface CreateCourseProps {
  isEdit?: boolean
  courseId?: string
  isPreview?: boolean
  isPublished?: boolean
  currentStep?: number
  defaultValues?: Record<string, unknown>
}

const CreateCourse = ({
  isEdit = false,
  courseId,
  isPreview = false,
  isPublished = false,
  currentStep = 0,
  defaultValues = {},
}: CreateCourseProps) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation('education')

  const [isDraft, setIsDraft] = useState(false)
  const [hasLesons] = useState({})
  const [previousVideo, setPreviousVideo] = useState<File | string | null>(null)
  const [previousImage, setPreviousImage] = useState<File | string | null>(null)
  const [activeStep, setActiveStep] = useState(currentStep)
  const [initialData, setInitialData] = useState<DataObject>(
    defaultValues as DataObject,
  )
  const [currentCourseId, setCurrentCourseId] = useState(courseId)
  const [, setIsCourseFree] = useState(!defaultValues?.isPaid)

  const [updateCourse, { isLoading: isUpdateLoading }] =
    useUpdateCourseMutation()
  const [createCourse, { isLoading: isCreateLoading }] =
    useCreateCourseMutation()
  const [addCourseMetaData, { isLoading: isMetaDataLoading }] =
    useAddCourseMetaDataMutation()

  const shouldNotPreview = useMemo(
    () =>
      (isPublished && activeStep === stepsConfig(t).length - 1) ||
      (activeStep === stepsConfig(t).length - 2 &&
        !Object.values(hasLesons).length &&
        Object.values(hasLesons).every((count) => count)),
    [hasLesons, activeStep, isPublished, t],
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
        .max(
          100,
          t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.MAXIMUM_100_CHARACTERS'),
        ),
      subtitle: yup
        .string()
        .trim()
        .required(t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.SUBTITLE_IS_REQUIRED'))
        .max(
          150,
          t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.MAXIMUM_150_CHARACTERS'),
        ),
      description: yup
        .string()
        .trim()
        .required(
          t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.DESCRIPTION_IS_REQUIRED'),
        )
        .max(
          1000,
          t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.MAXIMUM_1000_CHARACTERS'),
        ),
      category: yup
        .array()
        .of(yup.string().trim())
        .min(1, t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.AT_LEAST_ONE_CATEGORY'))
        .max(5, t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.MAXIMUM_5_CATEGORIES')),
      isPaid: yup.bool(),
      price: yup.lazy((_, schemaValues) =>
        (schemaValues as { originalValue?: { isPaid?: boolean } })
          ?.originalValue?.isPaid
          ? yup
              .number()
              .transform(transformNaNToNull)
              .required(
                t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICE_IS_REQUIRED'),
              )
              .positive(
                t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICE_IS_REQUIRED'),
              )
              .max(
                1000,
                t(
                  'EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICE_CANNOT_EXCEED_1000',
                ),
              )
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
            if (!value || !(value instanceof File)) return true
            const allowedExtensions = ['jpg', 'jpeg', 'png']
            const fileExtension =
              value.name.split('.').pop()?.toLowerCase() || ''
            return allowedExtensions.includes(fileExtension)
          },
        )
        .test(
          'file-validation',
          t(
            'EDUCATOR.BASIC_DETAILS.VALIDATIONS.IMAGE_REQUIRED_AND_LESS_THAN_50MB',
          ),
          (value) => {
            const isFile = value instanceof File
            if (
              isEdit &&
              !isFile &&
              typeof value === 'string' &&
              value.trim()
            ) {
              return true
            }
            if (isFile) {
              const fileSizeValid = value.size <= 50 * 1024 * 1024
              const allowedExtensions = ['jpg', 'jpeg', 'png']
              const fileExtension =
                value.name.split('.').pop()?.toLowerCase() || ''
              const fileTypeValid = allowedExtensions.includes(fileExtension)
              return fileSizeValid && fileTypeValid
            }
            return false
          },
        ),
      video: yup
        .mixed()
        .test(
          'file-type',
          t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.VIDEO_FORMAT_MSG'),
          (value) => {
            if (!value || !(value instanceof File)) return true
            const allowedExtensions = ['mp4', 'mov', 'webm', 'mkv']
            const fileExtension =
              value.name.split('.').pop()?.toLowerCase() || ''
            return allowedExtensions.includes(fileExtension)
          },
        )
        .test(
          'file-validation',
          t(
            'EDUCATOR.BASIC_DETAILS.VALIDATIONS.VIDEO_REQUIRED_AND_LESS_THAN_200MB',
          ),
          (value) => {
            const isFile = value instanceof File
            if (
              isEdit &&
              !isFile &&
              typeof value === 'string' &&
              value.trim()
            ) {
              return true
            }
            if (isFile) {
              const fileSizeValid = value.size <= 200 * 1024 * 1024
              const allowedExtensions = ['mp4', 'mov', 'webm', 'mkv']
              const fileExtension =
                value.name.split('.').pop()?.toLowerCase() || ''
              const fileTypeValid = allowedExtensions.includes(fileExtension)
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
    if (activeStep === 0) void navigate('/educator')
    else setActiveStep((prev) => prev - 1)
  }

  const handleBasicDetailsSubmit = async (data: CreateCourseFormData) => {
    // checks if data is identical
    setIsCourseFree(!data.isPaid)
    const [updatedFields, isIdentical] = getUpdatedFields(data, initialData, [
      'image',
      'video',
    ])

    if (isIdentical && !isDraft) {
      setActiveStep((prev) => prev + 1)
      return
    }

    // payload
    const payload: Partial<CreateCourseFormData> & { saveAsDraft?: boolean } = {
      ...updatedFields,
      isPaid: data.isPaid,
      saveAsDraft: isDraft,
      ...(!isDraft ? updatedFields : data),
    }

    // checks if course is free
    if (!data.isPaid && 'price' in payload) {
      const { price, ...payloadWithoutPrice } = payload
      void price // Mark as used
      Object.assign(payload, payloadWithoutPrice)
    }

    try {
      const response = currentCourseId
        ? await updateCourse({ ...payload, courseId: currentCourseId })
        : await createCourse(payload)

      if (!response?.error) {
        setInitialData((prev) => ({ ...prev, ...data }))
        if (
          !currentCourseId &&
          response?.data &&
          typeof response.data === 'object' &&
          response.data !== null &&
          'data' in response.data &&
          response.data.data &&
          typeof response.data.data === 'object' &&
          '_id' in (response.data.data as object)
        ) {
          setCurrentCourseId((response.data.data as { _id: string })._id)
        }
        if (!isDraft) setActiveStep((prev) => prev + 1)
      }

      setIsDraft(false)
    } catch {
      // error
    }
  }

  const handleMetaData = async (data: CreateCourseFormData) => {
    const { image, video } = data
    const formData = new FormData()
    formData.append('courseId', currentCourseId || '')
    if (isDraft) formData.append('saveAsDraft', 'true')

    if (isNewFile(image, previousImage)) {
      formData.append('image', image as File)
    }

    if (isNewFile(video, previousVideo)) {
      formData.append('video', video as File)
    }
    if (
      !isNewFile(image, previousImage) &&
      !isNewFile(video, previousVideo) &&
      !isDraft
    ) {
      setActiveStep((prev) => prev + 1)
      return
    }

    try {
      const response = await addCourseMetaData(formData)

      if (!response.error) {
        if (isNewFile(image, previousImage))
          setPreviousImage(image as File | string | null)
        if (isNewFile(video, previousVideo))
          setPreviousVideo(video as File | string | null)

        if (!isDraft) setActiveStep((prev) => prev + 1)

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
    } else setActiveStep((prevActiveStep) => prevActiveStep + 1)
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
      if (!response.error) void navigate('/educator/courses')
    }
  }

  const renderStepContent = (stepIndex: number) => {
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
        return 'Unknown step'
    }
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    if (activeStep === 0)
      await handleBasicDetailsSubmit(data as CreateCourseFormData)
    if (activeStep === 1) await handleMetaData(data as CreateCourseFormData)
    if (activeStep === 2) await handlePreview()
    if (activeStep === 3) await handlePublish()
  }

  const handleGetTitle = () => {
    if (isPreview) return t('EDUCATOR.CREATE_COURSE.PREVIEW')
    if (isEdit) return t('EDUCATOR.CREATE_COURSE.EDIT')
    return t('EDUCATOR.CREATE_COURSE.CREATE')
  }

  return (
    <Box>
      <FormProvider {...form}>
        {activeStep !== 3 && (
          <Box mb={3}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              {handleGetTitle()} {t('EDUCATOR.CREATE_COURSE.COURSE')}
            </Typography>
            <Typography component="p" color="text.secondary">
              {t('EDUCATOR.CREATE_COURSE.DESCRIPTION')}
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          {/* Stepper Section */}
          {activeStep !== 3 && (
            <Grid
              size={{ xs: 12, md: 3 }}
              sx={{
                position: { xs: 'relative', md: 'sticky' },
                top: { xs: 0, md: 20 },
                height: 'fit-content',
                mb: { xs: 3, md: 0 },
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'background.light',
                  borderRadius: { xs: '8px', md: '12px' },
                  p: { xs: 2, md: 3 },
                  border: `1px solid ${theme.palette.grey[200]}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Stepper
                  activeStep={activeStep}
                  orientation="vertical"
                  sx={{
                    '& .MuiStepContent-root': {
                      borderLeft: `2px solid ${theme.palette.grey[200]}`,
                      borderRight: '0',
                      marginLeft: '16px',
                      paddingLeft: '20px',
                    },
                    '& .MuiStepConnector-root': {
                      marginLeft: '16px',
                    },
                    '& .MuiStepConnector-line': {
                      borderLeft: `2px solid ${theme.palette.grey[200]}`,
                      minHeight: '20px',
                    },
                    '& .Mui-completed .MuiStepConnector-line': {
                      borderLeftColor: theme.palette.success.main,
                    },
                  }}
                >
                  {stepsConfig(t).map((step) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={StepIcon}
                        sx={{
                          '& .MuiStepLabel-label': {
                            fontWeight: 500,
                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                            '&.Mui-active': {
                              fontWeight: 600,
                              color: theme.palette.primary.main,
                            },
                            '&.Mui-completed': {
                              fontWeight: 500,
                              color: theme.palette.success.main,
                            },
                          },
                        }}
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            display: { xs: 'none', sm: 'block' },
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
          <Grid size={{ xs: 12, md: activeStep !== 3 ? 9 : 12 }}>
            <Box
              sx={{
                backgroundColor: 'background.light',
                borderRadius: activeStep !== 3 ? '12px' : 0,
                p: activeStep !== 3 ? 3 : 0,
                border:
                  activeStep !== 3
                    ? `1px solid ${theme.palette.grey[200]}`
                    : 'none',
              }}
            >
              <form
                onSubmit={(e) => {
                  void form.handleSubmit((data) => {
                    void onSubmit(data)
                  })(e)
                }}
              >
                {renderStepContent(activeStep)}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    mt: 3,
                    pt: 3,
                    borderTop:
                      activeStep !== 3
                        ? `1px solid ${theme.palette.grey[200]}`
                        : 'none',
                    gap: 2,
                  }}
                >
                  {!isPreview && (
                    <Button
                      variant="outlined"
                      disabled={isLoading}
                      onClick={handleBack}
                      sx={{
                        textTransform: 'none',
                        borderColor: theme.palette.grey[300],
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: theme.palette.grey[400],
                          backgroundColor: theme.palette.grey[50],
                        },
                      }}
                    >
                      {activeStep === 0
                        ? t('EDUCATOR.CREATE_COURSE.BACK_TO_DASHBOARD')
                        : t('EDUCATOR.CREATE_COURSE.BACK')}
                    </Button>
                  )}
                  <Box display="flex" gap={2}>
                    {!isPublished && (
                      <Button
                        type="submit"
                        variant="outlined"
                        onClick={() => {
                          setIsDraft(true)
                        }}
                        disabled={isLoading}
                        sx={{
                          textTransform: 'none',
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
                        startIcon={
                          isLoading && (
                            <CircularProgress
                              size={16}
                              sx={{ color: 'inherit' }}
                            />
                          )
                        }
                        sx={{
                          textTransform: 'none',
                          minWidth: 120,
                        }}
                      >
                        {isLoading
                          ? t('EDUCATOR.CREATE_COURSE.SUBMITTING')
                          : (stepsConfig(t)?.[activeStep]?.buttonLabel ??
                            t('EDUCATOR.CREATE_COURSE.CONTINUE'))}
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
