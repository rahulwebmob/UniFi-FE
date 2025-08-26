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
  useTheme,
} from '@mui/material'
import axios from 'axios'
import { CloudUpload, RotateCcw, Save } from 'lucide-react'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { errorAlert } from '../../../../../../../../redux/reducers/app-slice'
import {
  adminApi,
  useAddLessonMutation,
  useUpdateLessonMutation,
  useAddCourseChapterMutation,
  useGetAwsUrlForUploadMutation,
  useSuccessForVideoUploadMutation,
} from '../../../../../../../../services/admin'
import ModalBox from '../../../../../../../../shared/components/ui-elements/modal-box'
import { getFormatType, CHAPTER_CONFIG, handleFileChange } from '../../../../../common/common'
import UploadPrompt from '../../../upload-prompt'

const AddLesson = ({
  isEdit,
  lessonId,
  courseId,
  isChapter,
  chapterId,
  handleClose,
  defaultValues,
}) => {
  const { t } = useTranslation('education')
  const theme = useTheme()
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const uploadPrompt = useRef(null)
  const awsControllerRef = useRef(null)

  const { isCourseFree } = useFormContext()

  const [formData, setFormData] = useState({
    isFree: defaultValues?.isFree,
    lessonTitle: defaultValues?.lessonTitle,
  })
  const [errors, setErrors] = useState({})
  const [resource, setResource] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newChapterTitle, setNewChapterTitle] = useState('')

  const [updateLesson, { isLoading: isUpdateLessonLoading }] = useUpdateLessonMutation()
  const [addCourseChapter, { isLoading: isAddCourseChapterLoading }] = useAddCourseChapterMutation()
  const [addLesson, { isLoading: isAddLessonLoading }] = useAddLessonMutation()
  const [getAwsUrlForUpload] = useGetAwsUrlForUploadMutation()
  const [successForVideoUpload] = useSuccessForVideoUploadMutation()

  const isLoading = useMemo(
    () => isAddLessonLoading || isAddCourseChapterLoading || isUpdateLessonLoading,
    [isAddLessonLoading, isAddCourseChapterLoading, isUpdateLessonLoading],
  )

  useEffect(() => {
    setFormData({
      isFree: defaultValues?.isFree,
      lessonTitle: defaultValues?.lessonTitle,
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
    dispatch(adminApi.util.invalidateTags([{ type: 'Lessons', id: `${courseId}${id}` }]))
    setUploadProgress(0)
    handleReset()
    handleClose()
  }

  const handleClosePrompt = () => {
    if (awsControllerRef.current) {
      setUploadProgress(0)
      awsControllerRef.current.abort()
      dispatch(errorAlert({ message: t('EDUCATOR.ADD_CHAPTERS.UPLOAD_CANCELLED') }))
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
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
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
      // error handling
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

    if (isEdit) {
      form.append('lessonId', lessonId)
    }

    const id = isChapter ? newChapterId : chapterId

    const response = isEdit ? await updateLesson(form) : await addLesson(form)
    if (!response.error) {
      if (CHAPTER_CONFIG.VIDEO_EXTENSIONS.includes(fileExtension)) {
        uploadPrompt.current.closeModal()
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
    if (!response.error) {
      const newChapterId = response.data.response._id
      await handleAddLesson(newChapterId)
    }
  }

  const handleOnSubmit = async () => {
    const validationErrors = {}

    if (isChapter && !newChapterTitle.trim()) {
      validationErrors.chapterTitle = t('EDUCATOR.ADD_CHAPTERS.CHAPTER_TITLE_REQUIRED')
    }
    if (!formData.lessonTitle.trim()) {
      validationErrors.lessonTitle = t('EDUCATOR.ADD_CHAPTERS.LESSON_TITLE_REQUIRED')
    }
    if (!isEdit && !resource) {
      validationErrors.resource = t('EDUCATOR.ADD_CHAPTERS.RESOURCE_REQUIRED')
    }

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length) {
      return
    }

    if (isChapter) {
      await handleCreateChapter()
    } else {
      await handleAddLesson(chapterId)
    }
  }

  const renderForm = () => (
    <Grid container spacing={3}>
      {!isChapter && (
        <Grid size={12}>
          <Typography variant="h6" fontWeight={500}>
            {t('EDUCATOR.ADD_CHAPTERS.LESSON_DETAILS')}
          </Typography>
        </Grid>
      )}
      {isChapter && (
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <Typography variant="body1" mb={1} fontWeight={500}>
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
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={1} fontWeight={500}>
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
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <Tooltip title={t('EDUCATOR.ADD_CHAPTERS.UPLOAD_RESOURCE')}>
            <Typography variant="body1" mb={1} fontWeight={500} noWrap sx={{ maxWidth: '300px' }}>
              {t('EDUCATOR.ADD_CHAPTERS.UPLOAD_RESOURCE')}{' '}
              <Typography variant="body1" color="error.main" component="span">
                *
              </Typography>{' '}
            </Typography>
          </Tooltip>
          <Box
            sx={{
              p: 1.5,
              border: `2px dashed ${theme.palette.grey[300]}`,
              borderRadius: '12px',
              backgroundColor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.lighter || theme.palette.action.hover,
              },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={[...CHAPTER_CONFIG.VIDEO_EXTENSIONS, ...CHAPTER_CONFIG.DOCUMENT_EXTENSIONS]
                .map((ext) => `.${ext}`)
                .join(',')}
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, setErrors, setResource)}
            />
            <Button
              variant="contained"
              onClick={() => fileInputRef.current.click()}
              startIcon={<CloudUpload size={20} />}
              size="small"
            >
              {t('EDUCATOR.ADD_CHAPTERS.BROWSE')}
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{
                maxWidth: 200,
                fontStyle: resource?.name ? 'normal' : 'italic',
              }}
            >
              {resource?.name || defaultValues?.resource || 'No file selected'}
            </Typography>
          </Box>
        </FormControl>
        {errors.resource && (
          <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
            {errors.resource}
          </Typography>
        )}
      </Grid>
      {!isCourseFree && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body1" mb={1} fontWeight={500}>
            {t('EDUCATOR.ADD_CHAPTERS.LESSON_TYPE')}
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              row
              value={formData.isFree}
              onChange={(e) => handleChange('isFree', e.target.value === 'true')}
              sx={{
                py: 1,
              }}
            >
              <FormControlLabel
                value={false}
                control={<Radio color="primary" />}
                label={t('EDUCATOR.COMMON_KEYS.PAID')}
              />
              <FormControlLabel
                value
                control={<Radio color="primary" />}
                label={t('EDUCATOR.COMMON_KEYS.FREE')}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      )}
      {!isChapter && (
        <Grid size={12}>
          <Box display="flex" flexWrap="wrap" mt={1} gap={1}>
            <Button
              onClick={handleOnSubmit}
              variant="contained"
              color="primary"
              startIcon={<Save size={20} />}
              disabled={isLoading}
              endIcon={isLoading && <CircularProgress size="1em" />}
              size="small"
            >
              {t('EDUCATOR.ADD_CHAPTERS.SAVE_LESSON')}
            </Button>
            {isChapter ? (
              <Button variant="outlined" color="error" onClick={handleReset} size="small">
                {t('EDUCATOR.ADD_CHAPTERS.RESET')}
              </Button>
            ) : (
              <Button onClick={handleClose} variant="outlined" color="error" size="small">
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
          uploadPrompt.current.closeModal()
        }}
        size="md"
      >
        <UploadPrompt progress={uploadProgress} />
      </ModalBox>
    </Grid>
  )
  if (isChapter) {
    return (
      <Box>
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6">{t('EDUCATOR.ADD_CHAPTERS.CHAPTER_DETAILS')}</Typography>
          <Box display="flex" gap="10px" mt={1}>
            <Button
              onClick={handleOnSubmit}
              variant="contained"
              color="primary"
              startIcon={<Save size={20} />}
              disabled={isLoading}
              endIcon={isLoading && <CircularProgress size="1em" />}
              size="small"
            >
              {t('EDUCATOR.ADD_CHAPTERS.SAVE_CHAPTER')}
            </Button>
            <IconButton
              color="error"
              onClick={handleReset}
              sx={{
                border: `2px solid ${theme.palette.error.main}`,
                borderRadius: '8px',
                p: 1,
              }}
            >
              <RotateCcw size={20} />
            </IconButton>
          </Box>
        </Box>
        <Box p={3}>{renderForm()}</Box>
      </Box>
    )
  }

  return renderForm()
}

AddLesson.propTypes = {
  lessonId: PropTypes.string,
  isEdit: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  chapterId: PropTypes.string,
  defaultValues: PropTypes.oneOfType([PropTypes.object]),
  isChapter: PropTypes.bool,
  handleClose: PropTypes.func,
}

AddLesson.defaultProps = {
  defaultValues: {
    lessonTitle: '',
    resource: '',
    isFree: false,
  },
  lessonId: '',
  chapterId: '',
  isChapter: false,
  handleClose: () => {},
}

export default AddLesson
