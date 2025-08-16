import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { Save, RotateCcw, CloudUpload } from 'lucide-react'
import React, { useRef, useMemo, useState, useEffect } from 'react'

import {
  Box,
  Grid,
  Radio,
  Button,
  Tooltip,
  useTheme,
  TextField,
  RadioGroup,
  Typography,
  FormControl,
  CircularProgress,
  FormControlLabel,
} from '@mui/material'

import UploadPrompt from '../../../upload-prompt'
import { errorAlert } from '../../../../../../../../redux/reducers/app-slice'
import ModalBox from '../../../../../../../../shared/components/ui-elements/modal-box'
import {
  getFormatType,
  CHAPTER_CONFIG,
  handleFileChange,
} from '../../../../../common/common'
import {
  adminApi,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useAddCourseChapterMutation,
  useGetAwsUrlForUploadMutation,
  useSuccessForVideoUploadMutation,
} from '../../../../../../../../services/admin'

const AddLesson = ({
  isEdit,
  lessonId,
  courseId,
  isChapter,
  chapterId,
  handleClose,
  defaultValues = { isFree: false, lessonTitle: '', resource: '' },
}) => {
  const theme = useTheme()
  const { t } = useTranslation('education')
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const uploadPrompt = useRef(null)
  const awsControllerRef = useRef(null)

  const { isCourseFree } = useFormContext()

  const [formData, setFormData] = useState({
    isFree: defaultValues?.isFree ?? false,
    lessonTitle: defaultValues?.lessonTitle ?? '',
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
      isFree: defaultValues?.isFree || false,
      lessonTitle: defaultValues?.lessonTitle || '',
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
    uploadPrompt.current.closeModal()
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
      uploadPrompt.current.closeModal()
    }
  }

  const handleVideoUpload = async (lessonResponse, id, fileExtension) => {
    uploadPrompt.current.openModal()
    awsControllerRef.current = new AbortController()
    try {
      // Step 1: Get AWS URL for upload
      const res = await getAwsUrlForUpload({
        courseId,
        chapterId: id,
        lessonId: lessonResponse.data.data._id,
      })

      if (!res.error) {
        // Step 2: Upload video to AWS using Axios
        const awsResponse = await axios.put(res?.data?.url, resource, {
          headers: {
            'Content-Type': getFormatType(fileExtension),
          },
          signal: awsControllerRef?.current?.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            )
            setUploadProgress(percentCompleted)
          },
        })

        // Step 3: Notify backend of successful upload
        if (awsResponse.status === 200) {
          const result = await successForVideoUpload({
            lessonId: lessonResponse.data.data._id,
            courseId,
            chapterId: id,
          })

          if (!result.error) {
            handleOnSuccess(id)
          } else {
            handleClosePrompt()
          }
        }
      } else {
        handleClosePrompt()
      }
    } catch {
      //
    }
  }

  const handleAddLesson = async (newChapterId) => {
    const form = new FormData()
    form.append('courseId', courseId)
    form.append('chapterId', newChapterId)
    form.append('isFree', isCourseFree || formData.isFree)
    form.append('title', formData.lessonTitle)

    const fileExtension = resource?.name?.split('.').pop().toLowerCase()

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
    if (!response.error) {
      if (CHAPTER_CONFIG.VIDEO_EXTENSIONS.includes(fileExtension)) {
        uploadPrompt.current.closeModal()
        void handleVideoUpload(response, id, fileExtension)
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
    if (!response.error) {
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

  const renderForm = () => (
    <Grid container spacing={2.5}>
      {!isChapter && (
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {t('EDUCATOR.ADD_CHAPTERS.LESSON_DETAILS')}
          </Typography>
        </Grid>
      )}
      {isChapter && (
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <Typography variant="body1" mb={0.5}>
              {t('EDUCATOR.ADD_CHAPTERS.CHAPTER_TITLE')}{' '}
              <Typography variant="body1" color="error.main" component="span">
                *
              </Typography>{' '}
            </Typography>
            <TextField
              placeholder={t('EDUCATOR.ADD_CHAPTERS.CHAPTER_TITLE_PLACEHOLDER')}
              size="small"
              fullWidth
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              error={!!errors.chapterTitle}
              helperText={errors.chapterTitle}
            />
          </FormControl>
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: isChapter ? 6 : 12, md: isChapter ? 6 : 6 }}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={0.5}>
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
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: isChapter ? 6 : 12, md: 6 }}>
        <FormControl fullWidth>
          <Tooltip title={t('EDUCATOR.ADD_CHAPTERS.UPLOAD_RESOURCE')}>
            <Typography
              variant="body1"
              mb={0.5}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: { xs: 'normal', sm: 'nowrap' },
                maxWidth: { xs: '100%', sm: '300px' },
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
              p: 1.5,
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: theme.palette.grey[50],
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.background.paper,
              },
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
              color="primary"
              size="small"
              onClick={() => fileInputRef.current.click()}
              startIcon={<CloudUpload size={16} />}
              sx={{
                textTransform: 'none',
                flexShrink: 0,
              }}
            >
              {t('EDUCATOR.ADD_CHAPTERS.BROWSE')}
            </Button>
            {(defaultValues.resource || resource?.name) && (
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {defaultValues.resource || resource?.name}
              </Typography>
            )}
          </Box>
        </FormControl>
        {errors.resource && (
          <Typography variant="caption" color="error" mt={1}>
            {errors.resource}
          </Typography>
        )}
      </Grid>
      {!isCourseFree && (
        <Grid size={{ xs: 12, sm: 6 }} mt={{ xs: 1, sm: 1.5 }}>
          <Typography variant="body1">
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
                value
                control={<Radio color="secondary" />}
                label={t('EDUCATOR.COMMON_KEYS.FREE')}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      )}
      {!isChapter && (
        <Grid size={{ xs: 12 }}>
          <Box display="flex" flexWrap="wrap" mt={2} gap={1}>
            <Button
              onClick={() => {
                void handleOnSubmit()
              }}
              variant="contained"
              color="primary"
              startIcon={<Save size={16} />}
              disabled={isLoading}
              sx={{ textTransform: 'none' }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                t('EDUCATOR.ADD_CHAPTERS.SAVE_LESSON')
              )}
            </Button>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              {t('EDUCATOR.ADD_CHAPTERS.CLOSE')}
            </Button>
          </Box>
        </Grid>
      )}
      <ModalBox
        ref={uploadPrompt}
        onCloseModal={() => {
          handleClosePrompt()
          uploadPrompt.current.closeModal()
        }}
      >
        <UploadPrompt progress={uploadProgress} />
      </ModalBox>
    </Grid>
  )
  if (isChapter)
    return (
      <Box>
        <Box mb={2}>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, fontWeight: 600 }}
          >
            {t('EDUCATOR.ADD_CHAPTERS.CHAPTER_DETAILS')}
          </Typography>
        </Box>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            background: theme.palette.background.paper,
            borderRadius: { xs: '8px', sm: '12px' },
            border: `1px solid ${theme.palette.grey[200]}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {renderForm()}
          <Grid size={{ xs: 12 }}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              mt={3}
              gap={1}
            >
              <Button
                onClick={() => {
                  void handleOnSubmit()
                }}
                variant="contained"
                color="primary"
                startIcon={<Save size={16} />}
                disabled={isLoading}
                sx={{
                  textTransform: 'none',
                  flex: { xs: '1', sm: 'none' },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  t('EDUCATOR.ADD_CHAPTERS.SAVE_CHAPTER')
                )}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleReset}
                startIcon={<RotateCcw size={16} />}
                sx={{
                  textTransform: 'none',
                  flex: { xs: '1', sm: 'none' },
                  borderColor: theme.palette.grey[300],
                  '&:hover': {
                    borderColor: theme.palette.grey[400],
                    backgroundColor: theme.palette.grey[50],
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Box>
      </Box>
    )

  return renderForm()
}

export default AddLesson
