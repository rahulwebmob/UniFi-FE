import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FormProvider } from 'react-hook-form'
import { Check, Circle, CheckCircle } from 'lucide-react'
import React, { useMemo, useState, useEffect } from 'react'

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
import { updateShowPrompt } from '../../../../../Redux/Reducers/EducationSlice'
import {
  isNewFile,
  getUpdatedFields,
  transformNaNToNull,
} from '../../common/common'
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useAddCourseMetaDataMutation,
} from '../../../../../Services/admin'

interface StepIconProps {
  active?: boolean
  completed?: boolean
}

const StepIcon = ({ active, completed }: StepIconProps) => {
  if (completed) {
    return <Check size={32} color="green" />
  } else if (active) {
    return <CheckCircle size={32} color="green" />
  } else {
    return <Circle size={32} color="black" />
  }
}

interface StepConfig {
  label: string
  description: string
  buttonLabel: string
}

const stepsConfig = (t: any): StepConfig[] => [
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
  defaultValues?: any
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
  const [hasLesons, setHasLessons] = useState({})
  const [previousVideo, setPreviousVideo] = useState(null)
  const [previousImage, setPreviousImage] = useState(null)
  const [activeStep, setActiveStep] = useState(currentStep)
  const [initialData, setInitialData] = useState(defaultValues)
  const [currentCourseId, setCurrentCourseId] = useState(courseId)
  const [categories, setCategories] = useState(defaultValues?.category)
  const [isCourseFree, setIsCourseFree] = useState(!defaultValues?.isPaid)

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
        schemaValues?.originalValue?.isPaid
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
            const fileExtension = value.name.split('.').pop().toLowerCase()
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
            const fileExtension = value.name.split('.').pop().toLowerCase()
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

  const handleBasicDetailsSubmit = async (data) => {
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
    const payload = {
      ...updatedFields,
      isPaid: data.isPaid,
      saveAsDraft: isDraft,
      ...(!isDraft ? updatedFields : data),
    }

    // checks if course is free
    if (!data.isPaid) delete payload.price

    try {
      const response = currentCourseId
        ? await updateCourse({ ...payload, courseId: currentCourseId })
        : await createCourse(payload)

      if (!response?.error) {
        setInitialData((prev) => ({ ...prev, ...data }))
        if (!currentCourseId) setCurrentCourseId(response?.data?.data?._id)
        if (!isDraft) setActiveStep((prev) => prev + 1)
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
    if (isDraft) formData.append('saveAsDraft', true)

    if (isNewFile(image, previousImage)) {
      formData.append('image', image)
    }

    if (isNewFile(video, previousVideo)) {
      formData.append('video', video)
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
        if (isNewFile(image, previousImage)) setPreviousImage(image)
        if (isNewFile(video, previousVideo)) setPreviousVideo(video)

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
        return 'Unknown step'
    }
  }

  const onSubmit = async (data) => {
    if (activeStep === 0) await handleBasicDetailsSubmit(data)
    if (activeStep === 1) await handleMetaData(data)
    if (activeStep === 2) await handlePreview()
    if (activeStep === 3) await handlePublish()
  }

  const handleGetTitle = () => {
    if (isPreview) return t('EDUCATOR.CREATE_COURSE.PREVIEW')
    if (isEdit) return t('EDUCATOR.CREATE_COURSE.EDIT')
    return t('EDUCATOR.CREATE_COURSE.CREATE')
  }

  return (
    <Box
      sx={{
        '& .MuiTypography-root': {
          fontFamily: 'inter',
        },
      }}
    >
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
          <Box>
            <Typography variant="h1">
              {handleGetTitle()} {t('EDUCATOR.CREATE_COURSE.COURSE')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('EDUCATOR.CREATE_COURSE.DESCRIPTION')}
            </Typography>
          </Box>
        )}

        <Grid container sx={{ mt: 3 }}>
          {/* Stepper Section */}
          {activeStep !== 3 && (
            <Grid
              size={{ xs: 12, md: 3 }}
              sx={{
                background: theme.palette.primary.light,
                borderRadius: '8px',
                p: 2,
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
                    borderLeft: `5px solid ${theme.palette.common.white}`,
                    borderRight: '0',
                    marginRight: '0',
                  },
                  '& .MuiStepConnector-root': {
                    borderLeft: `5px solid ${theme.palette.common.white}`,
                    borderRight: '0',
                    marginRight: '0',
                  },
                  '& .MuiStepConnector-line': {
                    borderLeft: '0',
                  },
                }}
              >
                {stepsConfig(t).map((step) => (
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
                      <Typography variant="body2" color="secondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Grid>
          )}
          {/* Form Section */}
          <Grid size={{ md: activeStep !== 3 ? 9 : 12 }}>
            <Box sx={{ px: activeStep !== 3 ? 3 : 0 }}>
              <form onSubmit={(e) => { void form.handleSubmit((data) => { void onSubmit(data) })(e) }}>
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
                      variant="contained"
                      color="secondary"
                      sx={{
                        textTransform: 'none',
                      }}
                      disabled={isLoading}
                      onClick={handleBack}
                    >
                      {activeStep === 0
                        ? t('EDUCATOR.CREATE_COURSE.BACK_TO_DASHBOARD')
                        : t('EDUCATOR.CREATE_COURSE.BACK')}
                    </Button>
                  )}
                  <Box display="flex" gap="10px">
                    {!isPublished && (
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setIsDraft(true)
                        }}
                        disabled={isLoading}
                      >
                        {t('EDUCATOR.CREATE_COURSE.SAVE_AS_DRAFT')}
                      </Button>
                    )}
                    {!shouldNotPreview && (
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        startIcon={isLoading && <CircularProgress size="1em" />}
                      >
                        {isLoading
                          ? t('EDUCATOR.CREATE_COURSE.SUBMITTING')
                          : stepsConfig(t)?.[activeStep]?.buttonLabel ?? t('EDUCATOR.CREATE_COURSE.CONTINUE')}
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
