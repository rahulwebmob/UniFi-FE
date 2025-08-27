import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Step, Button, Stepper, useTheme, StepLabel, Typography } from '@mui/material'
import { User, Check, Link2, FileText, GraduationCap } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import EducatorLoginImage from '../../../../assets/educator-login.avif'
import MainLogo from '../../../../assets/logo.svg'
import { transformNaNToNull } from '../../../../roles/educator/components/common/common'
import ThankYou from '../../../../roles/educator/components/ThankYou'
import { useLazyVerifyEducatorEmailQuery } from '../../../../services/admin'
import { useRegisterEducatorMutation } from '../../../../services/uploadProgress'

import About from './about'
import Document from './document'
import Links from './links'
import Qualification from './qualification'

const urlRegexPatterns = {
  linkedIn: /^https:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[A-Za-z0-9-]+\/?$/,
  twitter: /^https:\/\/(www\.)?x\.com\/[A-Za-z0-9_]{1,15}\/?$/,
  website: /^https:\/\/([A-Za-z0-9-]+\.)*[A-Za-z0-9-]+\.[A-Za-z]{2,}(?::\d{1,5})?(\/\S*)?$/,
  youtube:
    /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/(?:(?:watch\?v=|embed\/|v\/)|@[\w-]+)?([A-Za-z0-9_-]{11})(\S*)?$/,
  facebookUrl:
    /^https:\/\/(www\.)?facebook\.com\/(?:people\/[A-Za-z0-9-.]+\/\d+|profile\.php\?id=\d+|[A-Za-z0-9.]{5,})\/?$/,
}

const TEXT =
  'Thank you for registering as an educator. We will review your application and get back to you soon.'

const stepIcons = [User, GraduationCap, Link2, FileText]

// Extracted StepIcon component
const StepIcon = ({ active = false, completed = false, stepIndex = 0 }) => {
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
        color: completed || active ? theme.palette.common.white : theme.palette.grey[400],
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

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  stepIndex: PropTypes.number,
}

// Wrapper function to avoid nested components
const createStepIconWrapper = (activeStep, index) => {
  const StepIconWrapper = () => (
    <StepIcon active={activeStep === index} completed={activeStep > index} stepIndex={index} />
  )
  StepIconWrapper.displayName = 'StepIconWrapper'
  return StepIconWrapper
}

const validationSchema = [
  yup.object().shape({
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    email: yup.string().trim().email('Invalid email address').required('Email is required'),
    country: yup.string().trim().required('Country is required'),
    state: yup.string().trim().required('State is required'),
  }),
  yup.object().shape({
    summary: yup.string().trim().required('Executive summary is required'),
    company: yup.string().trim(),
    experience: yup
      .number()
      .notRequired()
      .transform(transformNaNToNull)
      .min(0, 'Experience must be at least 0 years')
      .max(99.99, 'Experience cannot exceed 99 years'),
    expertise: yup.array().of(yup.object().shape({ category: yup.string().trim() })),
    education: yup.array().of(
      yup.object().shape({
        degree: yup
          .string()
          .trim()
          .test(
            'degree-required-if-field',
            'Degree is required when field is provided',
            function (value) {
              const { field } = this.parent
              if (typeof field === 'string' && field.trim().length > 0) {
                return typeof value === 'string' && value.trim().length > 0
              }
              return true
            },
          ),
        field: yup
          .string()
          .trim()
          .test(
            'field-required-if-degree',
            'Field of study is required when degree is provided',
            function (value) {
              const { degree } = this.parent
              if (typeof degree === 'string' && degree.trim().length > 0) {
                return typeof value === 'string' && value.trim().length > 0
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
          .test('name-required-if-org', 'Issuing organization is required', function (value) {
            const { organization } = this.parent
            if (typeof organization === 'string' && organization.trim().length > 0) {
              return typeof value === 'string' && value.trim().length > 0
            }
            return true
          }),
        organization: yup
          .string()
          .trim()
          .test('org-required-if-name', 'Issuing organization is required', function (value) {
            const { name } = this.parent
            if (typeof name === 'string' && name.trim().length > 0) {
              return typeof value === 'string' && value.trim().length > 0
            }
            return true
          }),
      }),
    ),
  }),
  yup.object().shape({
    linkedinUrl: yup.string().trim().matches(urlRegexPatterns.linkedIn, {
      message: 'Please enter a valid LinkedIn URL',
      excludeEmptyString: true,
    }),
    twitterUrl: yup
      .string()
      .trim()
      .matches(urlRegexPatterns.twitter, {
        message: 'Please enter a valid X (Twitter) URL',
        excludeEmptyString: true,
      })
      .required('Twitter URL is required.'),
    youtubeUrl: yup.string().trim().matches(urlRegexPatterns.youtube, {
      message: 'Please enter a valid YouTube URL',
      excludeEmptyString: true,
    }),
    websiteUrl: yup.string().trim().matches(urlRegexPatterns.website, {
      message: 'Please enter a valid website URL',
      excludeEmptyString: true,
    }),
    otherProfileUrls: yup.array().of(
      yup.object().shape({
        link: yup.string().trim().matches(urlRegexPatterns.website, {
          message: 'Please enter a valid website URL',
          excludeEmptyString: true,
        }),
      }),
    ),
  }),
  yup.object().shape({
    cv: yup
      .mixed()
      .nullable()
      .notRequired()
      .test('fileSize', 'CV must be less than 50MB', (value) => {
        if (!value) {
          return true
        }
        const fileSize = value.size / (1024 * 1024)
        return fileSize <= 50
      })
      .test('fileType', 'CV must be PDF, DOC or DOCX format', (value) => {
        if (!value) {
          return true
        }
        const allowedExtensions = ['pdf', 'doc', 'docx']
        const fileExtension = value.name.split('.').pop()?.toLowerCase() ?? ''
        return allowedExtensions.includes(fileExtension)
      }),
    video: yup
      .mixed()
      .nullable()
      .notRequired()
      .test('fileSize', 'Video must be less than 200MB', (value) => {
        if (!value) {
          return true
        }
        const fileSize = value.size / (1024 * 1024)
        return fileSize <= 200
      })
      .test('fileType', 'Video must be MP4, MOV or WEBM format', (value) => {
        if (!value) {
          return true
        }
        const allowedExtensions = ['mp4', 'mov', 'webm']
        const fileExtension = value.name.split('.').pop()?.toLowerCase() ?? ''
        return allowedExtensions.includes(fileExtension)
      }),
    hau: yup.string().trim().required('How did you hear about us is required'),
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
  const { language } = useSelector((state) => state.app)

  const [mp4, setMp4File] = useState(null)
  const [cvFile, setCvFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [activeStep, setCurrentStep] = useState(0)
  const [showThankYou, setShowThankYou] = useState(false)
  const [thankYouText, setThankYouText] = useState('')

  const [verifyEducatorEmail] = useLazyVerifyEducatorEmailQuery()
  const [registerTutor, { isLoading }] = useRegisterEducatorMutation()

  const { control, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(validationSchema[activeStep]),
    defaultValues,
  })

  const steps = {
    0: {
      name: 'About',
      component: <About control={control} />,
    },
    1: {
      name: 'Qualification',
      component: <Qualification control={control} />,
    },
    2: {
      name: 'Links',
      component: <Links control={control} />,
    },
    3: {
      name: 'Document',
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

  const onSubmit = async (data) => {
    if (activeStep === 0) {
      const emailResponse = await verifyEducatorEmail({ email: data.email })

      if (emailResponse?.error) {
        setError('email', {
          type: 'manual',
          message: 'Educator with this email already exist. Please use another email.',
        })
        return
      }
    }

    if (activeStep === Object.keys(steps).length - 1) {
      const formData = new FormData()
      Object.keys(data).forEach((name) => {
        const key = name
        const value = data[key]

        // Skip null, undefined, or empty values
        if (value === null || value === undefined || value === '') {
          return
        }

        // Handle file fields
        if (name === 'cv') {
          if (cvFile) {
            formData.append(name, cvFile)
          }
        } else if (name === 'video') {
          if (mp4) {
            formData.append(name, mp4)
          }
        }
        // Handle special array fields
        else if (name === 'otherProfileUrls') {
          const nonEmptyLinks = value.filter(
            (urlObject) => urlObject.link && urlObject.link.trim() !== '',
          )
          if (nonEmptyLinks.length > 0) {
            formData.append(name, JSON.stringify(nonEmptyLinks))
          }
        }
        // Handle expertise array
        else if (name === 'expertise') {
          const nonEmptyExpertise = value.filter(
            (item) => item.category && item.category.trim() !== '',
          )
          if (nonEmptyExpertise.length > 0) {
            formData.append(name, JSON.stringify(nonEmptyExpertise))
          }
        }
        // Handle education array
        else if (name === 'education') {
          const nonEmptyEducation = value.filter(
            (item) =>
              (item.degree && item.degree.trim() !== '') ||
              (item.field && item.field.trim() !== ''),
          )
          if (nonEmptyEducation.length > 0) {
            formData.append(name, JSON.stringify(nonEmptyEducation))
          }
        }
        // Handle certifications array
        else if (name === 'certifications') {
          const nonEmptyCerts = value.filter(
            (item) =>
              (item.name && item.name.trim() !== '') ||
              (item.organization && item.organization.trim() !== ''),
          )
          if (nonEmptyCerts.length > 0) {
            formData.append(name, JSON.stringify(nonEmptyCerts))
          }
        }
        // Handle other arrays
        else if (Array.isArray(value)) {
          const filteredArray = value.filter((item) => {
            if (typeof item === 'object' && item !== null) {
              // Check if at least one property has a value
              return Object.values(item).some(
                (val) => val !== '' && val !== null && val !== undefined,
              )
            }
            return item !== '' && item !== null && item !== undefined
          })
          if (filteredArray.length > 0) {
            formData.append(name, JSON.stringify(filteredArray))
          }
        }
        // Handle regular string/number values
        else if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          formData.append(name, String(value))
        }
        // Handle other objects (should not stringify to [object Object])
        else if (typeof value === 'object' && value !== null) {
          formData.append(name, JSON.stringify(value))
        }
      })
      formData.append('language', language?.value || 'ENGLISH')
      const response = await registerTutor({
        data: formData,
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / (event.total || 1))
          setProgress(percent)
        },
      })
      if (!response?.error) {
        setThankYouText(TEXT)
        setShowThankYou(true)
      }
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const renderHeader = () => (
    <Box display="flex" alignItems="center">
      <Box display="flex" flexDirection="column" justifyContent="center" width="100%">
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
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
        <Typography component="p" fontWeight={400} textAlign="center" mb={2} sx={{ opacity: 0.8 }}>
          Please provide the details below to help us better understand you.
        </Typography>
      </Box>
    </Box>
  )

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
              <Typography variant="h5" textAlign="center" mb={3}>
                Application Form
              </Typography>

              {/* Fixed Stepper */}
              <Box sx={{ mb: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {Object.values(steps).map((step, index) => (
                    <Step key={step.name}>
                      <StepLabel
                        slots={{
                          stepIcon: createStepIconWrapper(activeStep, index),
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
                onSubmit={(e) => {
                  void handleSubmit(onSubmit)(e)
                }}
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
                      Back
                    </Button>
                  )}
                  <Button
                    disabled={formState.isSubmitting}
                    variant="contained"
                    fullWidth
                    type="submit"
                  >
                    {formState.isSubmitting
                      ? `Submitting...${isLoading ? ` ${progress}%` : ''}`
                      : activeStep === 3
                        ? 'Submit'
                        : 'Continue'}
                  </Button>
                </Box>

                {/* Login Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary, fontSize: 14 }}
                  >
                    Already an Educator?{' '}
                    <Typography
                      component="span"
                      variant="body2"
                      onClick={() => {
                        void navigate('/educator/login')
                      }}
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
                      Login
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
