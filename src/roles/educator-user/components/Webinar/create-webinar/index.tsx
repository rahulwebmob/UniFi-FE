import * as yup from 'yup'
import moment from 'moment-timezone'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useMemo, useState, useEffect } from 'react'
import { parse, format, isAfter, isBefore } from 'date-fns'
import { useForm, Controller, FormProvider } from 'react-hook-form'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  FormControl,
  ButtonGroup,
  CircularProgress,
} from '@mui/material'

import AddCategory from './add-category'
import PreviewWebinar from '../preview-webinar'
import WebinarSchedule from './webinar-schedule'
import WebinarMetaData from './webinar-meta-data'
import CharacterCount from '../../character-count'
import { errorAlert } from '../../../../../Redux/Reducers/AppSlice'
import { updateShowPrompt } from '../../../../../Redux/Reducers/EducationSlice'
import {
  useCreateWebinarMutation,
  useUpdateWebinarMutation,
} from '../../../../../Services/admin'
import {
  iff,
  convHMtoUtc,
  convDateToUtc,
  handleMinTime,
  getLocalTimezone,
  ACTIVE_BUTTON_CSS,
  transformNaNToNull,
} from '../../common/common'

const CreateWebinar = ({
  isEdit,
  isPreview,
  isPublished,
  savedDetails,
  defaultValues,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation('education')

  const [previewMode, setPreviewMode] = useState(isPreview)
  const [webinarData, setWebinarData] = useState({ ...savedDetails })
  const [categories, setCategories] = useState(defaultValues?.category)
  const [scheduleType, setScheduleType] = useState(
    defaultValues?.scheduleType || 'daily',
  )

  const [createWebinar, { isLoading: isCreateLoading }] =
    useCreateWebinarMutation()
  const [updateWebinar, { isLoading: isUpdateLoading }] =
    useUpdateWebinarMutation()

  const isLoading = useMemo(
    () => isCreateLoading || isUpdateLoading,
    [isCreateLoading, isUpdateLoading],
  )

  const validateTimeComparison = (isEndTime) =>
    yup
      .date()
      .required(
        isEndTime
          ? t('EDUCATOR.CREATE_WEBINAR.VALIDATION.END_TIME_REQUIRED')
          : t('EDUCATOR.CREATE_WEBINAR.VALIDATION.START_TIME_REQUIRED'),
      )
      .test(
        'min-start-time',
        t('EDUCATOR.CREATE_WEBINAR.VALIDATION.MIN_START_END_TIME'),
        (value, ctx) => {
          if (ctx.parent.scheduleType !== 'one time') return true
          if (isEndTime) return true
          if (!ctx.parent.startDate) return true

          const minTime = handleMinTime()
          const start = parse(
            format(value, 'HH:mm'),
            'HH:mm',
            new Date(ctx.parent.startDate),
          )
          return (
            isAfter(start, minTime) || start.getTime() === minTime.getTime()
          )
        },
      )
      .test(
        'end-time-greater',
        t('EDUCATOR.CREATE_WEBINAR.VALIDATION.END_TIME_AFTER_START'),
        (value, ctx) => {
          if (!isEndTime) return true
          const start = parse(
            format(ctx.parent.startTime, 'HH:mm'),
            'HH:mm',
            new Date(),
          )
          const end = parse(format(value, 'HH:mm'), 'HH:mm', new Date())
          return isBefore(start, end)
        },
      )

  const validationSchema = yup.object({
    title: yup
      .string()
      .trim()
      .required(t('EDUCATOR.CREATE_WEBINAR.VALIDATION.TITLE_REQUIRED'))
      .max(200, t('EDUCATOR.CREATE_WEBINAR.VALIDATION.200_CHARACTER_ALLOWED')),

    description: yup
      .string()
      .trim()
      .required(t('EDUCATOR.CREATE_WEBINAR.VALIDATION.DESCRIPTION_REQUIRED'))
      .max(
        1000,
        t('EDUCATOR.CREATE_WEBINAR.VALIDATION.1000_CHARACTER_ALLOWED'),
      ),

    category: yup
      .array()
      .of(
        yup
          .string()
          .required(t('EDUCATOR.CREATE_WEBINAR.VALIDATION.EACH_ITEM_STRING')),
      )
      .min(1, t('EDUCATOR.CREATE_WEBINAR.VALIDATION.ONE_CATEGORY_REQUIRED'))
      .max(5, t('EDUCATOR.CREATE_WEBINAR.VALIDATION.MAXIMUM_5_CATEGORIES')),

    scheduleType: yup
      .string()
      .required(t('EDUCATOR.CREATE_WEBINAR.VALIDATION.SCHEDULE_TYPE_REQUIRED')),

    resources: yup
      .array()
      .max(5, t('EDUCATOR.CREATE_WEBINAR.VALIDATION.MAX_5_RESOURCE_ALLOWED'))
      .of(
        yup.object().shape({
          file: yup
            .mixed()
            .test(
              'file-type',
              t('EDUCATOR.CREATE_WEBINAR.VALIDATION.FILE_FORMAT'),
              (value) => {
                if (!value || !(value instanceof File)) return true
                const allowedExtensions = [
                  'doc',
                  'docx',
                  'pdf',
                  'jpg',
                  'jpeg',
                  'png',
                ]
                const fileExtension = value.name.split('.').pop().toLowerCase()
                return allowedExtensions.includes(fileExtension)
              },
            )
            .test(
              'file-validation',
              t('EDUCATOR.CREATE_WEBINAR.VALIDATION.FILE_REQUIRED'),
              (value) => {
                const isFile = value instanceof File
                if (isEdit && !isFile && value?.trim()) {
                  return true
                }
                if (isFile) {
                  const fileSizeValid = value.size <= 20 * 1024 * 1024
                  const allowedExtensions = [
                    'doc',
                    'docx',
                    'pdf',
                    'jpeg',
                    'png',
                    'mp4',
                    'mov',
                    'webm',
                  ]
                  const fileExtension = value.name
                    .split('.')
                    .pop()
                    .toLowerCase()
                  const fileTypeValid =
                    allowedExtensions.includes(fileExtension)
                  return fileSizeValid && fileTypeValid
                }
                return false
              },
            ),
        }),
      ),

    image: yup
      .mixed()
      .required(t('EDUCATOR.CREATE_WEBINAR.VALIDATION.THUMBNAIL_REQUIRED'))
      .test(
        'file-type',
        t('EDUCATOR.CREATE_WEBINAR.VALIDATION.IMAGE_FORMAT'),
        (value) => {
          if (!value || !(value instanceof File)) return true
          const allowedExtensions = ['png', 'jpg', 'jpeg']
          const fileExtension = value.name.split('.').pop().toLowerCase()
          return allowedExtensions.includes(fileExtension)
        },
      )
      .test(
        'file-validation',
        t('EDUCATOR.CREATE_WEBINAR.VALIDATION.LESS_THAN_200'),
        (value) => {
          const isFile = value instanceof File
          if (isEdit && !isFile && value.trim()) {
            return true
          }
          if (isFile) {
            const fileSizeValid = value.size <= 20 * 1024 * 1024
            const allowedExtensions = ['png', 'jpg', 'jpeg']
            const fileExtension = value.name.split('.').pop().toLowerCase()
            const fileTypeValid = allowedExtensions.includes(fileExtension)
            return fileSizeValid && fileTypeValid
          }
          return false
        },
      ),

    isPaid: yup.bool(),

    price: yup.lazy((_, schemaValues) =>
      schemaValues?.originalValue?.isPaid
        ? yup
            .number()
            .transform(transformNaNToNull)
            .required(t('EDUCATOR.CREATE_WEBINAR.VALIDATION.PRICE_REQUIRED'))
            .positive(t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICE_IS_REQUIRED'))
            .max(
              1000,
              t('EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICE_CANNOT_EXCEED_1000'),
            )
        : yup.number().nullable().transform(transformNaNToNull),
    ),

    ...(scheduleType === 'weekly'
      ? {
          days: yup
            .array()
            .of(
              yup.object().shape({
                day: yup.string().required(),
                selected: yup.boolean(),
                startTime: yup
                  .date()
                  .nullable()
                  .test(
                    'start-time-required',
                    t('EDUCATOR.CREATE_WEBINAR.VALIDATION.START_TIME_REQUIRED'),
                    (value, ctx) => {
                      const { selected } = ctx.parent
                      if (selected && !value) {
                        return false
                      }
                      return true
                    },
                  ),
                endTime: yup
                  .date()
                  .nullable()
                  .test(
                    'end-time-required',
                    t('EDUCATOR.CREATE_WEBINAR.VALIDATION.END_TIME_REQUIRED'),
                    (value, ctx) => {
                      const { selected, startTime } = ctx.parent
                      if (selected && !value) {
                        return false
                      }
                      if (selected && startTime && !value) {
                        return false
                      }
                      return true
                    },
                  )
                  .test(
                    'end-time-greater',
                    t(
                      'EDUCATOR.CREATE_WEBINAR.VALIDATION.END_TIME_AFTER_START',
                    ),
                    (value, ctx) => {
                      const { startTime } = ctx.parent
                      if (!startTime || !value) return true
                      const start = parse(
                        format(startTime, 'HH:mm'),
                        'HH:mm',
                        new Date(),
                      )
                      const end = parse(
                        format(value, 'HH:mm'),
                        'HH:mm',
                        new Date(),
                      )
                      return isBefore(start, end)
                    },
                  ),
              }),
            )
            .test(
              'at-least-one-day-selected',
              t('EDUCATOR.CREATE_WEBINAR.VALIDATION.ONE_DAY_SELECTED'),
              (days) => days.some((day) => day.selected),
            ),
        }
      : {
          startDate: yup
            .date()
            .min(
              moment().startOf('day').toISOString(),
              t(
                'EDUCATOR.CREATE_WEBINAR.VALIDATION.START_DATE_BEFORE_CURRENT_DATE',
              ),
            )
            .required(
              t('EDUCATOR.CREATE_WEBINAR.VALIDATION.START_DATE_REQUIRED'),
            ),
          startTime: validateTimeComparison(false),
          endTime: validateTimeComparison(true),
        }),
  })

  const form = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  })

  const { watch, control, handleSubmit } = form

  const onError = () => {
    if (previewMode)
      dispatch(
        errorAlert({
          message: 'Invalid schedule time. Please edit the form.',
        }),
      )
  }

  const onSubmit = async (data) => {
    const payload = { ...data }
    setWebinarData((prev) => ({ ...prev, ...payload }))

    if (!previewMode && !isEdit) {
      setPreviewMode(true)
      return
    }

    const formData = new FormData()

    if (isEdit) {
      const remoteSavedFile = savedDetails.resources
      if (remoteSavedFile?.length) {
        const currentResources = payload.resources
          .map(({ file }) => (file instanceof File ? null : file))
          .filter(Boolean)

        const currentSet = new Set(currentResources)

        const removed = remoteSavedFile.filter(
          (fileName) => !currentSet.has(fileName),
        )

        if (removed.length) {
          payload.removeResources = removed
        }
      }
    }

    if (scheduleType === 'weekly') {
      const deletedFields = ['startTime', 'endTime', 'startDate']
      deletedFields.forEach((key) => delete payload[key])
    } else {
      delete payload.days
    }

    if (!payload.isPaid) delete payload.price
    if (webinarData._id) formData.append('webinarId', webinarData._id)

    formData.append('status', 'published')

    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'image') {
        if (value instanceof File) formData.append('image', value)
      } else if (key === 'resources') {
        value.forEach((res) => {
          if (res.file instanceof File) formData.append('resources', res.file)
        })
      } else if (key === 'removeResources') {
        formData.append(key, JSON.stringify(value))
      } else if (['startTime', 'endTime'].includes(key)) {
        formData.append(key, convHMtoUtc(value))
      } else if (key === 'startDate') {
        formData.append(key, convDateToUtc(value, payload.startTime))
      } else if (key === 'days') {
        const updatedDays = value.map((day) => ({
          ...day,
          startTime: day.startTime ? convHMtoUtc(day.startTime) : null,
          endTime: day.endTime ? convHMtoUtc(day.endTime) : null,
        }))
        formData.append(key, JSON.stringify(updatedDays))
        formData.append('timezone', getLocalTimezone())
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value)
      }
    })

    try {
      const response = isEdit
        ? await updateWebinar(formData)
        : await createWebinar(formData)

      if (!response.error) {
        if (isEdit) setPreviewMode(true)
        else void navigate('/educator/webinars')
      }
    } catch {
      //
    }
  }

  const renderForm = () => (
    <Box
      sx={{
        '& .MuiButton-root': {
          ':hover': {
            background: (theme) => theme.palette.common.white,
            color: (theme) => theme.palette.text.primary,
          },
        },
      }}
    >
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <Typography variant="body1" mb={0.5}>
              {t('EDUCATOR.CREATE_WEBINAR.ADD_TITLE')}{' '}
              <Typography variant="body1" color="error.main" component="span">
                *
              </Typography>{' '}
              <CharacterCount
                maxLength={200}
                currentLength={watch('title').trim().length}
              />
            </Typography>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={t('EDUCATOR.CREATE_WEBINAR.TITLE_PLACEHOLDER')}
                  size="small"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <Typography variant="body1" mb={0.5} fontWeight={600}>
              {t('EDUCATOR.CREATE_WEBINAR.ABOUT_WEBINAR')}{' '}
              <Typography variant="body1" color="error.main" component="span">
                *
              </Typography>{' '}
              <CharacterCount
                maxLength={1000}
                currentLength={watch('description').trim().length}
              />
            </Typography>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={t(
                    'EDUCATOR.CREATE_WEBINAR.DESCRIPTION_PLACEHOLDER',
                  )}
                  multiline
                  rows={5}
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid
          size={{ xs: 12 }}
          sx={{
            '& .MuiChip-root': {
              border: '1px solid',
            },
          }}
        >
          <AddCategory />
        </Grid>

        <WebinarSchedule />
        <WebinarMetaData />
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <Box display="flex" alignItems="center" gap="80px" mt={1}>
              <Typography variant="body1" mb={0.5} fontWeight={600}>
                {t('EDUCATOR.CREATE_WEBINAR.PRICING')}
              </Typography>
              <Controller
                name="isPaid"
                control={control}
                defaultValue="free"
                rules={{ required: 'Pricing Type" is required' }}
                render={({ field: { onChange, value } }) => (
                  <ButtonGroup color="secondary" variant="contained">
                    <Button
                      sx={{
                        ...(!value && ACTIVE_BUTTON_CSS),
                        '&:first-of-type': {
                          borderTopRightRadius: '0',
                          borderBottomRightRadius: '0',
                          borderTopLeftRadius: '4px',
                          borderBottomLeftRadius: '4px',
                        },
                      }}
                      onClick={() => onChange(false)}
                    >
                      {t('EDUCATOR.COMMON_KEYS.FREE')}
                    </Button>
                    <Button
                      sx={{
                        ...(value && ACTIVE_BUTTON_CSS),
                        '&:last-of-type': {
                          borderTopRightRadius: '4px',
                          borderBottomRightRadius: '4px',
                          borderTopLeftRadius: '0',
                          borderBottomLeftRadius: '0',
                        },
                      }}
                      onClick={() => onChange(true)}
                    >
                      {t('EDUCATOR.COMMON_KEYS.PAID')}
                    </Button>
                  </ButtonGroup>
                )}
              />
            </Box>
          </FormControl>
        </Grid>
        {watch('isPaid') && (
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5} fontWeight={600}>
                {t('EDUCATOR.CREATE_WEBINAR.ADD_PRICE')}{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>
                :
              </Typography>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: 'Price is required',
                }}
                render={({ field, fieldState }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    placeholder="$ 0.00"
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                  />
                )}
              />
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Box>
  )

  const renderStepContent = () =>
    previewMode ? (
      <PreviewWebinar webinarData={webinarData} isTdSkip={isPreview} />
    ) : (
      renderForm()
    )

  useEffect(() => {
    dispatch(updateShowPrompt(form.formState.isDirty))
  }, [form.formState.isDirty, dispatch])

  return (
    <FormProvider
      {...form}
      isEdit={isEdit}
      categories={categories}
      scheduleType={scheduleType}
      defaultValues={defaultValues}
      setCategories={setCategories}
      setScheduleType={setScheduleType}
    >
      {!isPreview && (
        <Box>
          <Typography variant="h1">
            {isEdit
              ? t('EDUCATOR.CREATE_WEBINAR.EDIT')
              : t('EDUCATOR.CREATE_WEBINAR.CREATE')}{' '}
            {t('EDUCATOR.CREATE_WEBINAR.WEBINAR')}
          </Typography>
          <Typography component="p">
            {t('EDUCATOR.CREATE_WEBINAR.WEBINAR_DATA')}
          </Typography>
        </Box>
      )}
      <Box mt={2} component="form" onSubmit={(e) => { void handleSubmit((data) => { void onSubmit(data) }, onError)(e) }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {renderStepContent()}
          {!isPreview && (
            <Box mt={5} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="secondary"
                disabled={isLoading}
                onClick={() => {
                  if (previewMode) {
                    setPreviewMode(false)
                  } else {
                    void navigate('/educator')
                  }
                }}
              >
                {previewMode
                  ? t('EDUCATOR.COMMON_KEYS.BACK')
                  : t('EDUCATOR.CREATE_WEBINAR.BACK_TO_DASHBOARD')}
              </Button>
              <Box display="flex" gap="10px">
                {(!isPublished || !previewMode) && (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    startIcon={isLoading && <CircularProgress size="1em" />}
                  >
                    {isLoading
                      ? iff(isEdit, 'Submitting...', 'Publishing...')
                      : iff(
                          !previewMode,
                          t('EDUCATOR.CREATE_COURSE.CONTINUE'),
                          t('EDUCATOR.CREATE_COURSE.PUBLISH'),
                        )}
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </LocalizationProvider>
      </Box>
    </FormProvider>
  )
}

export default CreateWebinar
