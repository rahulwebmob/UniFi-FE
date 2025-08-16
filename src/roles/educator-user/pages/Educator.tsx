import type { TFunction } from 'i18next'

import * as yup from 'yup'
import  { useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { User, Check, Link2, FileText, GraduationCap } from 'lucide-react'

import {
  Box,
  Step,
  Button,
  Stepper,
  useTheme,
  StepLabel,
  Typography,
} from '@mui/material'

import About from './About/About'
import Links from './Links/Links'
import Document from './Document/Document'
import ThankYou from '../components/ThankYou'
import MainLogo from '../../../Assets/logo.svg'
import { urlRegexPatterns } from './constant/constant'
import Qualification from './Qualification/Qualification'
import EducatorLoginImage from '../../../Assets/educator-login.avif'
import { useLazyVerifyEducatorEmailQuery } from '../../../Services/admin'
import { useRegisterEducatorMutation } from '../../../Services/uploadProgress'
import {
  transformNaNToNull,
  handleAreAllFieldsFilled,
} from '../components/common/common'

const TEXT = (t: TFunction) => t('education:REGISTER_EDUCATOR.THANK_YOU_TEXT')

interface StepIconProps {
  active?: boolean
  completed?: boolean
  stepIndex?: number
}

const stepIcons = [User, GraduationCap, Link2, FileText]

const StepIcon = ({ active = false, completed = false, stepIndex = 0 }: StepIconProps) => {
  const theme = useTheme()
  const IconComponent = stepIcons[stepIndex] || User
  
  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: `2px solid ${
          completed 
            ? theme.palette.success.main
            : active 
            ? theme.palette.primary.main
            : theme.palette.grey[400]
        }`,
        backgroundColor: completed 
          ? theme.palette.success.main
          : active 
          ? theme.palette.primary.main
          : 'transparent',
        color: completed || active ? 'white' : theme.palette.grey[400],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: -1,
        mb: 2,
        '& > svg': {
          display: 'block',
        },
      }}
    >
      {completed ? <Check size={20} /> : <IconComponent size={20} />}
    </Box>
  )
}

const validationSchema = (t: TFunction) => [
  yup.object({
    firstName: yup
      .string()
      .trim()
      .required(t('REGISTER_EDUCATOR.VALIDATION.NAME_REQUIRED')),
    lastName: yup
      .string()
      .trim()
      .required(t('REGISTER_EDUCATOR.VALIDATION.LAST_NAME_REQUIRED')),
    email: yup
      .string()
      .trim()
      .email(t('REGISTER_EDUCATOR.VALIDATION.INVALID_EMAIL'))
      .required(t('REGISTER_EDUCATOR.VALIDATION.EMAIL_REQUIRED')),
    country: yup
      .string()
      .trim()
      .required(t('REGISTER_EDUCATOR.VALIDATION.COUNTRY_REQUIRED')),
    state: yup
      .string()
      .trim()
      .required(t('REGISTER_EDUCATOR.VALIDATION.STATE_REQUIRED')),
  }),
  yup.object({
    summary: yup
      .string()
      .trim()
      .required(t('REGISTER_EDUCATOR.VALIDATION.EXECUTIVE_SUMMARY_REQUIRED')),
    company: yup.string().trim(),
    experience: yup
      .number()
      .notRequired()
      .transform(transformNaNToNull)
      .min(0, t('REGISTER_EDUCATOR.VALIDATION.EXPERIENCE_MORE_THAN_ONE_YEAR'))
      .max(99.99, t('REGISTER_EDUCATOR.VALIDATION.NOT_EXCEED_99_YEARS')),
    expertise: yup.array().of(yup.object({ category: yup.string().trim() })),
    education: yup.array().of(
      yup.object().shape({
        degree: yup
          .string()
          .trim()
          .test(
            'degree-required-if-field',
            t('REGISTER_EDUCATOR.VALIDATION.DEGREE_REQUIRED'),
            (value, ctx) => {
              const { field } = ctx.parent as { field?: string }
              if (typeof field === 'string' && field.trim().length) {
                return typeof value === 'string' && value.trim().length
              }
              return true
            },
          ),
        field: yup
          .string()
          .trim()
          .test(
            'field-required-if-degree',
            t('REGISTER_EDUCATOR.VALIDATION.FIELD_OF_STUDY_REQUIRED'),
            (value, ctx) => {
              const { degree } = ctx.parent as { degree?: string }
              if (typeof degree === 'string' && degree.trim().length) {
                return typeof value === 'string' && value.trim().length
              }
              return true
            },
          ),
      }),
    ),
    certifications: yup.array().of(
      yup.object().shape({
        name: yup
          .string()
          .trim()
          .test(
            'name-required-if-org',
            t('REGISTER_EDUCATOR.VALIDATION.ISSUING_ORGANIZATION_REQUIRED'),
            (value, ctx) => {
              const { organization } = ctx.parent as { organization?: string }
              if (
                typeof organization === 'string' &&
                organization.trim().length
              ) {
                return typeof value === 'string' && value.trim().length
              }
              return true
            },
          ),
        organization: yup
          .string()
          .trim()
          .test(
            'org-required-if-name',
            t('REGISTER_EDUCATOR.VALIDATION.ISSUING_ORGANIZATION_REQUIRED'),
            (value, ctx) => {
              const { name } = ctx.parent as { name?: string }
              if (typeof name === 'string' && name.trim().length) {
                return typeof value === 'string' && value.trim().length
              }
              return true
            },
          ),
      }),
    ),
  }),
  yup.object({
    linkedinUrl: yup
      .string()
      .trim()
      .matches(urlRegexPatterns.linkedIn, {
        message: t('REGISTER_EDUCATOR.VALIDATION.VALIDATE_LINKEDIN_URL'),
        excludeEmptyString: true,
      }),
    twitterUrl: yup
      .string()
      .trim()
      .matches(urlRegexPatterns.twitter, {
        message: t('REGISTER_EDUCATOR.VALIDATION.VALIDATE_TWITTER_URL'),
        excludeEmptyString: true,
      })
      .required(t('REGISTER_EDUCATOR.VALIDATION.TWITTER_URL_REQUIRED')),
    youtubeUrl: yup
      .string()
      .trim()
      .matches(urlRegexPatterns.youtube, {
        message: t('REGISTER_EDUCATOR.VALIDATION.VALIDATE_YOUTUBE_URL'),
        excludeEmptyString: true,
      }),
    websiteUrl: yup
      .string()
      .trim()
      .matches(urlRegexPatterns.website, {
        message: t('REGISTER_EDUCATOR.VALIDATION.VALIDATE_WEBSITE_URL'),
        excludeEmptyString: true,
      }),
    otherProfileUrls: yup.array().of(
      yup.object().shape({
        link: yup
          .string()
          .trim()
          .matches(urlRegexPatterns.website, {
            message: t('REGISTER_EDUCATOR.VALIDATION.VALIDATE_WEBSITE_URL'),
            excludeEmptyString: true,
          }),
      }),
    ),
  }),
  yup.object({
    cv: yup
      .mixed()
      .notRequired()
      .test(
        'fileSize',
        t('REGISTER_EDUCATOR.VALIDATION.CV_LESS_THAN_500'),
        (value) => {
          if (!value) return true
          const fileSize = value.size / (1024 * 1024)
          return fileSize <= 50
        },
      )
      .test(
        'fileType',
        t('REGISTER_EDUCATOR.VALIDATION.CV_FORMAT'),
        (value) => {
          if (!value) return true
          const allowedExtensions = ['pdf', 'doc', 'docx']
          const fileExtension = value.name.split('.').pop().toLowerCase()
          return allowedExtensions.includes(fileExtension)
        },
      ),
    video: yup
      .mixed()
      .notRequired()
      .test(
        'fileSize',
        t('REGISTER_EDUCATOR.VALIDATION.VIDEO_LESS_THAN_200'),
        (value) => {
          if (!value) return true
          const fileSize = value.size / (1024 * 1024)
          return fileSize <= 200
        },
      )
      .test(
        'fileType',
        t('REGISTER_EDUCATOR.VALIDATION.VIDEO_FORMAT'),
        (value: any) => {
          if (!value) return true
          const allowedExtensions = ['mp4', 'mov', 'webm']
          const fileExtension = (value as File).name.split('.').pop()?.toLowerCase() ?? ''
          return allowedExtensions.includes(fileExtension)
        },
      ),
    hau: yup
      .string()
      .trim()
      .required(t('REGISTER_EDUCATOR.VALIDATION.HUA_REQUIRED')),
  }),
]

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  state: '',
  summary: '',
  company: '',
  experience: 0,
  expertise: [{ category: '' }],
  education: [{ degree: '', field: '' }],
  certifications: [{ name: '', organization: '' }],
  linkedinUrl: '',
  twitterUrl: '',
  youtubeUrl: '',
  websiteUrl: '',
  otherProfileUrls: [{ link: '' }],
  cv: null,
  video: null,
  hau: 'Social Media',
}

const Educator = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const { language } = useSelector((state) => state.app)

  // Responsive breakpoints - same as auth-wrapper
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  // const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  const [mp4, setMp4File] = useState(null)
  const [cvFile, setCvFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [activeStep, setCurrentStep] = useState(0)
  const [showThankYou, setShowThankYou] = useState(false)
  const [thankYouText, setThankYouText] = useState('')

  const [verifyEducatorEmail] = useLazyVerifyEducatorEmailQuery()
  const [registerTutor, { isLoading }] = useRegisterEducatorMutation()

  const { control, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(validationSchema(t)?.[activeStep]),
    defaultValues,
  })

  const steps = {
    0: {
      name: t('REGISTER_EDUCATOR.ABOUT'),
      component: <About control={control} />,
    },
    1: {
      name: t('REGISTER_EDUCATOR.QUALIFICATION'),
      component: <Qualification control={control} />,
    },
    2: {
      name: t('REGISTER_EDUCATOR.LINKS'),
      component: <Links control={control} />,
    },
    3: {
      name: t('REGISTER_EDUCATOR.DOCUMENTS'),
      component: (
        <Document
          control={control}
          errors={formState.errors}
          setCvFile={setCvFile}
          setMp4File={setMp4File}
        />
      ),
    },
  }

  const onSubmit = async (data: any) => {
    if (activeStep === 0) {
      const emailResponse = await verifyEducatorEmail({ email: data.email })

      if (emailResponse?.error) {
        setError('email', {
          type: 'manual',
          message: t('REGISTER_EDUCATOR.EDUCATOR_ALREADY_EXISTS'),
        })
        return
      }
    }

    if (activeStep === Object.keys(steps).length - 1) {
      const formData = new FormData()
      Object.keys(data).forEach((name) => {
        if (
          data[name] &&
          !(data[name]?.length === 1 && data[name]?.[0] === '')
        ) {
          if (name === 'cv') {
            formData.append(name, cvFile)
          } else if (name === 'video') {
            formData.append(name, mp4)
          } else if (name === 'otherProfileUrls') {
            const nonEmptyLinks = (data[name] as {link?: string}[]).filter(
              (urlObject) => urlObject.link,
            )
            if (nonEmptyLinks.length) {
              formData.append(name, JSON.stringify(nonEmptyLinks))
            }
          } else if (typeof data[name] === 'object') {
            if (handleAreAllFieldsFilled(data[name]))
              formData.append(name, JSON.stringify(data[name]))
          } else {
            formData.append(name, data[name])
          }
        }
        return null
      })
      formData.append('language', language?.value)
      const response = await registerTutor({
        data: formData,
        onUploadProgress: (event: { loaded: number; total: number }) => {
          const percent = Math.round((event.loaded * 100) / event.total)
          setProgress(percent)
        },
      })
      if (!response?.error) {
        setThankYouText(TEXT(t))
        setShowThankYou(true)
      }
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  // Render header - same structure as auth-wrapper login
  const renderHeader = () => (
    <Box display="flex" alignItems="center">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 1 }}
        >
          <img src={MainLogo} alt="Logo" style={{ width: 80, height: 80 }} />
        </Box>
        <Typography
          variant="h6"
          fontWeight={700}
          textAlign="center"
          sx={{
            letterSpacing: 3.84,
            mb: 1,
          }}
        >
          UNICITIZENS
        </Typography>
        <Typography
          component="p"
          fontWeight={400}
          textAlign="center"
          mb={2}
          sx={{ opacity: 0.8 }}
        >
          {t('REGISTER_EDUCATOR.APPLICATION_FORM_DETAIL')}
        </Typography>
      </Box>
    </Box>
  )

  // Show ThankYou component if form is successfully submitted
  if (showThankYou) {
    return <ThankYou text={thankYouText} />
  }

  return (
    // Outer wrapper - same as auth-wrapper
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        [theme.breakpoints.down('md')]: {
          overflow: 'hidden',
        },
      }}
    >
      {/* Container - same as auth-wrapper */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1600,
          margin: '0 auto',
          px: { xs: 0, sm: 2, md: 3, lg: 4 },
          [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
            px: 0,
          },
        }}
      >
        {/* Main content box - same as auth-wrapper */}
        <Box
          sx={{
            display: 'flex',
            borderRadius: 2.5,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            minHeight: 700,
            height: '80vh',
            maxHeight: 900,
            [theme.breakpoints.down('md')]: {
              flexDirection: 'column',
              height: '100vh',
              minHeight: '100vh',
              boxShadow: 'none',
              borderRadius: 0,
              overflow: 'visible',
            },
          }}
        >
          {/* Left Side - Image - same as auth-wrapper */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: theme.palette.background.paper,
              [theme.breakpoints.down('md')]: {
                display: 'none',
              },
            }}
          >
            <img
              src={EducatorLoginImage}
              alt="Educator Portal"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                maxWidth: 800,
              }}
            />
          </Box>

          {/* Right Side - Form - same as auth-wrapper */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: 5,
              overflow: 'hidden',
              [theme.breakpoints.down('md')]: {
                padding: 3,
                height: '100%',
              },
              [theme.breakpoints.down('sm')]: {
                padding: 2,
              },
            }}
          >
            {/* Form content wrapper - same as auth-wrapper */}
            <Box
              sx={{
                width: '100%',
                maxWidth: 680,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                [theme.breakpoints.down('xs')]: {
                  maxWidth: '100%',
                },
              }}
            >
              {/* Fixed Header */}
              {renderHeader()}

              {/* Fixed Title */}
              <Typography
                variant="h5"
                fontWeight={600}
                textAlign="center"
                mb={3}
              >
                {t('REGISTER_EDUCATOR.APPLICATION_FORM')}
              </Typography>

              {/* Fixed Stepper */}
              <Box sx={{ mb: 3 }}>
                <Stepper 
                  activeStep={activeStep} 
                  alternativeLabel

                >
                  {Object.values(steps).map((step, index) => (
                    <Step key={step.name}>
                      <StepLabel
                        slots={{
                          stepIcon: () => (
                            <StepIcon
                              active={activeStep === index}
                              completed={activeStep > index}
                              stepIndex={index}
                            />
                          )
                        }}
                      >
                        {step.name}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Scrollable Form Content */}
              <Box
                component="form"
                onSubmit={(e) => { void handleSubmit((data) => { void onSubmit(data) })(e) }}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Form content - scrollable */}
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    mb: 3,
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'grey.100',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'grey.400',
                      borderRadius: '3px',
                      '&:hover': {
                        backgroundColor: 'grey.500',
                      },
                    },
                  }}
                >
                  {steps[activeStep]?.component}
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  {activeStep > 0 && (
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled={formState.isSubmitting}
                      onClick={handleBack}
                    >
                      {t('REGISTER_EDUCATOR.COMMON_KEYS.BACK')}
                    </Button>
                  )}
                  <Button
                    disabled={formState.isSubmitting}
                    variant="contained"
                    fullWidth
                    type="submit"
                  >
                    {formState.isSubmitting
                      ? `${t('REGISTER_EDUCATOR.COMMON_KEYS.SUBMITTING')}${
                          isLoading ? ` ${progress}%` : ''
                        }`
                      : activeStep === 3
                      ? t('REGISTER_EDUCATOR.COMMON_KEYS.SUBMIT')
                      : t('REGISTER_EDUCATOR.COMMON_KEYS.CONTINUE')}
                  </Button>
                </Box>

                {/* Login Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, fontSize: 14 }}
                  >
                    {t('REGISTER_EDUCATOR.ALREADY_AN_EDUCATOR')}{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      onClick={() => { void navigate('/educator/login') }}
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: 14,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {t('REGISTER_EDUCATOR.LOGIN')}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Educator