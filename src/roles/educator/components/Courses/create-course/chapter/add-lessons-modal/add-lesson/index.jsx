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
    <Grid container spacing={1}>
      {!isChapter && (
        <Grid item xs={12}>
          <Typography variant="p1">{t('EDUCATOR.ADD_CHAPTERS.LESSON_DETAILS')}</Typography>
        </Grid>
      )}
      {isChapter && (
        <Grid item xs={12} md={6}>
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
      <Grid item xs={12} md={6}>
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
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <Tooltip title={t('EDUCATOR.ADD_CHAPTERS.UPLOAD_RESOURCE')}>
            <Typography variant="body1" mb={0.5} noWrap sx={{ maxWidth: '300px' }}>
              {t('EDUCATOR.ADD_CHAPTERS.UPLOAD_RESOURCE')}{' '}
              <Typography variant="body1" color="error.main" component="span">
                *
              </Typography>{' '}
            </Typography>
          </Tooltip>
          <Box
            sx={{
              p: 0.1,
              border: '1px solid',
              borderColor: 'grey.400',
              borderRadius: '8px',
              display: 'flex',
              gap: '10px',
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
              sx={{ gap: '0' }}
              variant="contained"
              color="secondary"
              onClick={() => fileInputRef.current.click()}
              startIcon={<CloudUpload size={20} />}
            >
              {t('EDUCATOR.ADD_CHAPTERS.BROWSE')}
            </Button>
            <Typography variant="body2" mt={1} noWrap maxWidth={150}>
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
        <Grid item sm={12} md={6} mt={1.5}>
          <Typography variant="body1">{t('EDUCATOR.ADD_CHAPTERS.LESSON_TYPE')}</Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              row
              value={formData.isFree}
              onChange={(e) => handleChange('isFree', e.target.value === 'true')}
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
        <Grid item xs={12}>
          <Box display="flex" flexWrap="wrap" mt={1} gap={1}>
            <Button
              onClick={handleOnSubmit}
              variant="contained"
              color="primary"
              startIcon={<Save size={20} />}
              disabled={isLoading}
              endIcon={isLoading && <CircularProgress size="1em" />}
            >
              {t('EDUCATOR.ADD_CHAPTERS.SAVE_LESSON')}
            </Button>
            {isChapter ? (
              <Button variant="contained" color="error" onClick={handleReset}>
                {t('EDUCATOR.ADD_CHAPTERS.RESET')}
              </Button>
            ) : (
              <Button onClick={handleClose} variant="contained" color="error">
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
              sx={{ gap: '0' }}
              onClick={handleOnSubmit}
              variant="outlined"
              color="primary"
              startIcon={<Save size={20} />}
              disabled={isLoading}
              endIcon={isLoading && <CircularProgress size="1em" />}
            >
              {t('EDUCATOR.ADD_CHAPTERS.SAVE_CHAPTER')}
            </Button>
            <IconButton variant="contained" color="error" onClick={handleReset}>
              <RotateCcw size={20} />
            </IconButton>
          </Box>
        </Box>
        <Box
          p={2}
          sx={{
            background: (theme) => theme.palette.primary.light,
            borderRadius: '8px',
          }}
        >
          {renderForm()}
        </Box>
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
