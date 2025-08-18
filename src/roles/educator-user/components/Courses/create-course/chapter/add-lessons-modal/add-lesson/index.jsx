import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
  Box,
  Grid,
  Radio,
  Button,
  TextField,
  IconButton,
  RadioGroup,
  Typography,
  FormControl,
  CircularProgress,
  FormControlLabel,
  Tooltip,
} from '@mui/material'
import {
  adminApi,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useAddCourseChapterMutation,
  useGetAwsUrlForUploadMutation,
  useSuccessForVideoUploadMutation,
} from '../../../../../../../../services/admin'
import { useTranslation } from 'react-i18next'
import { errorAlert } from '../../../../../../../../redux/reducers/app-slice'
import { Upload, Save, RotateCcw } from 'lucide-react'
import ModalBox from '../../../../../../../../shared/components/ui-elements/modal-box'
import { useDispatch } from 'react-redux'
import {
  getFormatType,
  CHAPTER_CONFIG,
  handleFileChange,
} from '../../../../../common/common'
import { useFormContext } from 'react-hook-form'
import UploadPrompt from '../../../upload-prompt'

const AddLesson = ({
  isEdit = false,
  lessonId = '',
  courseId = '',
  isChapter = false,
  chapterId = '',
  handleClose = () => {},
  defaultValues = {
    lessonTitle: '',
    resource: '',
    isFree: false,
  },
}) => {
  const { t } = useTranslation('education')
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const uploadPrompt = useRef(null)
  const awsControllerRef = useRef(null)

  const { isCourseFree } = useFormContext()

  const [formData, setFormData] = useState({
    isFree: defaultValues.isFree,
    lessonTitle: defaultValues.lessonTitle,
  })
  const [errors, setErrors] = useState({})
  const [resource, setResource] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newChapterTitle, setNewChapterTitle] = useState('')

  const [updateLesson, { isLoading: isUpdateLessonLoading }] =
    useUpdateLessonMutation()
  const [addCourseChapter, { isLoading: isAddCourseChapterLoading }] =
    useAddCourseChapterMutation()
  const [addLesson, { isLoading: isAddLessonLoading }] = useAddLessonMutation()
  const [getAwsUrlForUpload] = useGetAwsUrlForUploadMutation()
  const [successForVideoUpload] = useSuccessForVideoUploadMutation()

  const isLoading = useMemo(
    () =>
      isAddLessonLoading || isAddCourseChapterLoading || isUpdateLessonLoading,
    [isAddLessonLoading, isAddCourseChapterLoading, isUpdateLessonLoading],
  )

  useEffect(() => {
    setFormData({
      isFree: defaultValues.isFree,
      lessonTitle: defaultValues.lessonTitle,
    })
  }, [defaultValues])

  const handleReset = () => {
    setFormData({
      lessonTitle: '',
      isFree: false,
    })
    setErrors({})
    setResource(null)
    setNewChapterTitle('')
    uploadPrompt.current?.closeModal()
  }

  const handleOnSuccess = (id) => {
    dispatch(
      adminApi.util.invalidateTags([
        { type: 'Lessons', id: `${courseId}${id}` },
      ]),
    )
    setUploadProgress(0)
    handleReset()
    handleClose()
  }

  const handleClosePrompt = () => {
    if (awsControllerRef.current) {
      setUploadProgress(0)
      awsControllerRef.current.abort()
      dispatch(
        errorAlert({ message: t('EDUCATOR.ADD_CHAPTERS.UPLOAD_CANCELLED') }),
      )
      uploadPrompt.current?.closeModal()
    }
  }

  const handleVideoUpload = async (lessonResponse, id, fileExtension) => {
    uploadPrompt.current?.openModal()
    awsControllerRef.current = new AbortController()
    try {
      const res = await getAwsUrlForUpload({
        courseId,
        chapterId: id,
        lessonId: lessonResponse.data.data._id,
      })

      if (!('error' in res)) {
        const awsResponse = await axios.put(res?.data?.url, resource, {
          headers: {
            'Content-Type': getFormatType(fileExtension),
          },
          signal: awsControllerRef?.current?.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              ((progressEvent.loaded || 0) * 100) / (progressEvent.total || 1),
            )
            setUploadProgress(percentCompleted)
          },
        })

        if (awsResponse.status === 200) {
          const result = await successForVideoUpload({
            lessonId: lessonResponse.data.data._id,
            courseId,
            chapterId: id,
          })

          if (!('error' in result)) {
            handleOnSuccess(id)
          } else {
            handleClosePrompt()
          }
        }
      } else {
        handleClosePrompt()
      }
    } catch (error) {
      console.error('Upload error:', error)
      handleClosePrompt()
    }
  }

  const handleAddLesson = async (newChapterId) => {
    const form = new FormData()
    form.append('courseId', courseId)
    form.append('chapterId', newChapterId)
    form.append('isFree', String(isCourseFree || formData.isFree))
    form.append('title', formData.lessonTitle)

    const fileExtension = resource?.name?.split('.').pop()?.toLowerCase() || ''

    if (resource) {
      if (CHAPTER_CONFIG.VIDEO_EXTENSIONS.includes(fileExtension)) {
        form.append('videoFileName', resource.name)
      } else if (CHAPTER_CONFIG.DOCUMENT_EXTENSIONS.includes(fileExtension)) {
        form.append('pdf', resource)
      }
    }

    if (isEdit) form.append('lessonId', lessonId)

    const id = isChapter ? newChapterId : chapterId

    const response = isEdit ? await updateLesson(form) : await addLesson(form)
    if (!('error' in response)) {
      if (CHAPTER_CONFIG.VIDEO_EXTENSIONS.includes(fileExtension)) {
        uploadPrompt.current?.closeModal()
        handleVideoUpload(response, id, fileExtension)
      } else {
        handleOnSuccess(id)
      }
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateChapter = async () => {
    const response = await addCourseChapter({
      courseId,
      title: newChapterTitle,
    })
    if (!('error' in response)) {
      const newChapterId = response.data.response._id
      await handleAddLesson(newChapterId)
    }
  }

  const handleOnSubmit = async () => {
    const validationErrors = {}

    if (isChapter && !newChapterTitle.trim()) {
      validationErrors.chapterTitle = t(
        'EDUCATOR.ADD_CHAPTERS.CHAPTER_TITLE_REQUIRED',
      )
    }
    if (!formData.lessonTitle.trim()) {
      validationErrors.lessonTitle = t(
        'EDUCATOR.ADD_CHAPTERS.LESSON_TITLE_REQUIRED',
      )
    }
    if (!isEdit && !resource) {
      validationErrors.resource = t('EDUCATOR.ADD_CHAPTERS.RESOURCE_REQUIRED')
    }

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length) return

    if (isChapter) {
      await handleCreateChapter()
    } else {
      await handleAddLesson(chapterId)
    }
  }

  const renderForm = () => {
    return (
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {!isChapter && (
          <Grid size={12}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1rem', md: '1.125rem' },
                mb: 1,
              }}
            >
              {t('EDUCATOR.ADD_CHAPTERS.LESSON_DETAILS')}
            </Typography>
          </Grid>
        )}
        {isChapter && (
          <Grid item size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 500,
                }}
              >
                {t('EDUCATOR.ADD_CHAPTERS.CHAPTER_TITLE')}{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>{' '}
              </Typography>
              <TextField
                placeholder={t(
                  'EDUCATOR.ADD_CHAPTERS.CHAPTER_TITLE_PLACEHOLDER',
                )}
                size="small"
                fullWidth
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                error={!!errors.chapterTitle}
                helperText={errors.chapterTitle}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  },
                }}
              />
            </FormControl>
          </Grid>
        )}
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 500,
              }}
            >
              {t('EDUCATOR.ADD_CHAPTERS.LESSON_TITLE')}{' '}
              <Typography variant="body1" color="error.main" component="span">
                *
              </Typography>{' '}
            </Typography>
            <TextField
              value={formData.lessonTitle}
              onChange={(e) => handleChange('lessonTitle', e.target.value)}
              placeholder={t('EDUCATOR.ADD_CHAPTERS.LESSON_TITLE')}
              size="small"
              error={!!errors.lessonTitle}
              helperText={errors.lessonTitle}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: { xs: '0.875rem', md: '1rem' },
                },
              }}
            />
          </FormControl>
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <Tooltip title={t('EDUCATOR.ADD_CHAPTERS.UPLOAD_RESOURCE')}>
              <Typography
                variant="body1"
                noWrap
                sx={{
                  maxWidth: '300px',
                  mb: 1,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 500,
                }}
              >
                {t('EDUCATOR.ADD_CHAPTERS.UPLOAD_RESOURCE')}{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>{' '}
              </Typography>
            </Tooltip>
            <Box
              sx={{
                p: { xs: 1, md: 1.5 },
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, md: 2 },
                backgroundColor: theme.palette.background.default,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={[
                  ...CHAPTER_CONFIG.VIDEO_EXTENSIONS,
                  ...CHAPTER_CONFIG.DOCUMENT_EXTENSIONS,
                ]
                  .map((ext) => `.${ext}`)
                  .join(',')}
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e, setErrors, setResource)}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<Upload size={18} />}
                sx={{
                  textTransform: 'none',
                  fontSize: { xs: '0.813rem', md: '0.875rem' },
                  py: { xs: 0.75, md: 1 },
                  px: { xs: 2, md: 3 },
                }}
              >
                {t('EDUCATOR.ADD_CHAPTERS.BROWSE')}
              </Button>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  maxWidth: { xs: 100, sm: 150, md: 200 },
                  fontSize: { xs: '0.75rem', md: '0.813rem' },
                  color: theme.palette.text.secondary,
                }}
              >
                {defaultValues.resource || resource?.name}
              </Typography>
            </Box>
          </FormControl>
          {errors.resource && (
            <Typography color="error" variant="body2" mt={1}>
              {errors.resource}
            </Typography>
          )}
        </Grid>
        {!isCourseFree && (
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 500,
              }}
            >
              {t('EDUCATOR.ADD_CHAPTERS.LESSON_TYPE')}
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                row
                value={formData.isFree}
                onChange={(e) =>
                  handleChange('isFree', e.target.value === 'true')
                }
              >
                <FormControlLabel
                  value={false}
                  control={<Radio color="secondary" />}
                  label={t('EDUCATOR.COMMON_KEYS.PAID')}
                />
                <FormControlLabel
                  value={true}
                  control={<Radio color="secondary" />}
                  label={t('EDUCATOR.COMMON_KEYS.FREE')}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
        {!isChapter && (
          <Grid item size={12}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{ xs: 1, md: 2 }}
              mt={{ xs: 2, md: 3 }}
            >
              <Button
                onClick={handleOnSubmit}
                variant="contained"
                color="primary"
                startIcon={<Save size={18} />}
                disabled={isLoading}
                fullWidth={theme.breakpoints.down('sm') ? true : false}
                endIcon={isLoading && <CircularProgress size="1em" />}
                sx={{
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  py: { xs: 1, md: 1.25 },
                  px: { xs: 3, md: 4 },
                  fontWeight: 500,
                }}
              >
                {t('EDUCATOR.ADD_CHAPTERS.SAVE_LESSON')}
              </Button>
              {isChapter ? (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReset}
                  fullWidth={theme.breakpoints.down('sm') ? true : false}
                  sx={{
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    py: { xs: 1, md: 1.25 },
                    px: { xs: 3, md: 4 },
                  }}
                >
                  {t('EDUCATOR.ADD_CHAPTERS.RESET')}
                </Button>
              ) : (
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="error"
                  fullWidth={theme.breakpoints.down('sm') ? true : false}
                  sx={{
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    py: { xs: 1, md: 1.25 },
                    px: { xs: 3, md: 4 },
                  }}
                >
                  {t('EDUCATOR.ADD_CHAPTERS.CLOSE')}
                </Button>
              )}
            </Box>
          </Grid>
        )}
        <ModalBox
          ref={uploadPrompt}
          onCloseModal={() => {
            handleClosePrompt()
            uploadPrompt.current?.closeModal()
          }}
        >
          <UploadPrompt progress={uploadProgress} />
        </ModalBox>
      </Grid>
    )
  }

  if (isChapter) {
    return (
      <Box>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          mb={{ xs: 2, md: 3 }}
          gap={2}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              fontWeight: 600,
            }}
          >
            {t('EDUCATOR.ADD_CHAPTERS.CHAPTER_DETAILS')}
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              onClick={handleOnSubmit}
              variant="outlined"
              color="primary"
              startIcon={<Save size={18} />}
              disabled={isLoading}
              endIcon={isLoading && <CircularProgress size="1em" />}
              sx={{
                textTransform: 'none',
                fontSize: { xs: '0.875rem', md: '1rem' },
                py: { xs: 0.75, md: 1 },
                px: { xs: 2, md: 3 },
              }}
            >
              {t('EDUCATOR.ADD_CHAPTERS.SAVE_CHAPTER')}
            </Button>
            <IconButton
              color="error"
              onClick={handleReset}
              sx={{
                p: { xs: 0.75, md: 1 },
              }}
            >
              <RotateCcw size={18} />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            background: theme.palette.action.hover,
            borderRadius: { xs: 2, md: 3 },
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {renderForm()}
        </Box>
      </Box>
    )
  }

  return renderForm()
}

export default AddLesson
