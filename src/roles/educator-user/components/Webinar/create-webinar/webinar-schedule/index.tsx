import React from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'

import { TimePicker } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import {
  Box,
  Grid,
  Button,
  Checkbox,
  TextField,
  Typography,
  ButtonGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material'

import {
  handleMinTime,
  ACTIVE_BUTTON_CSS,
  handleIsTodaySelected,
} from '../../../common/common'

const WebinarSchedule = () => {
  const {
    watch,
    isEdit,
    control,
    scheduleType,
    defaultValues,
    setScheduleType,
    formState: { errors },
  } = useFormContext()

  const handleScheduleTypeChange = async (type, onChange) => {
    onChange(type)
    setScheduleType(type)
  }

  const { t } = useTranslation('education')

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <Box
            display="flex"
            gap={isEdit ? '5px' : '14px'}
            flexWrap="wrap"
            alignItems="center"
            mt={1}
          >
            <Typography variant="body1" mb={0.5} fontWeight={600}>
              {t('EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.SCHEDULE_WEBINAR')}
            </Typography>
            {isEdit ? (
              <Typography
                variant="body1"
                mb={0.5}
                fontWeight={600}
                sx={{
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                : {scheduleType}
              </Typography>
            ) : (
              <Controller
                name="scheduleType"
                control={control}
                render={({ field: { onChange } }) => (
                  <ButtonGroup sx={{ '& .MuiButton-root:not(:last-child)': { borderRight: 'none' } }}>
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: watch('scheduleType') === 'daily' ? 'primary.main' : 'transparent',
                        color: watch('scheduleType') === 'daily' ? 'white' : 'text.secondary',
                        borderColor: (theme) => theme.palette.grey[300],
                        '&:hover': {
                          backgroundColor: watch('scheduleType') === 'daily' ? 'primary.dark' : 'action.hover',
                        },
                      }}
                      onClick={() => {
                        void handleScheduleTypeChange('daily', onChange)
                      }}
                    >
                      {t('EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.DAILY')}
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: watch('scheduleType') === 'weekly' ? 'primary.main' : 'transparent',
                        color: watch('scheduleType') === 'weekly' ? 'white' : 'text.secondary',
                        borderColor: (theme) => theme.palette.grey[300],
                        '&:hover': {
                          backgroundColor: watch('scheduleType') === 'weekly' ? 'primary.dark' : 'action.hover',
                        },
                      }}
                      onClick={() => {
                        void handleScheduleTypeChange('weekly', onChange)
                      }}
                    >
                      {t('EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.WEEKLY')}
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: watch('scheduleType') === 'one time' ? 'primary.main' : 'transparent',
                        color: watch('scheduleType') === 'one time' ? 'white' : 'text.secondary',
                        borderColor: (theme) => theme.palette.grey[300],
                        '&:hover': {
                          backgroundColor: watch('scheduleType') === 'one time' ? 'primary.dark' : 'action.hover',
                        },
                      }}
                      onClick={() => {
                        void handleScheduleTypeChange('one time', onChange)
                      }}
                    >
                      {t('EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.ONE_TIME')}
                    </Button>
                  </ButtonGroup>
                )}
              />
            )}
          </Box>
        </FormControl>
      </Grid>
      {scheduleType !== 'weekly' ? (
        <>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5} fontWeight={600}>
                {t('EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.DATE')}{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>
              </Typography>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    minDate={handleMinTime()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t(
                          'EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.DATE_PLACEHOLDER',
                        )}
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                )}
              />
              {errors?.startDate && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors?.startDate?.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5} fontWeight={600}>
                {t('EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.START_TIME')}{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>
              </Typography>
              <Controller
                name="startTime"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TimePicker
                    ampm={false}
                    value={value}
                    minTime={
                      watch('scheduleType') === 'one time' &&
                      handleIsTodaySelected(watch('startDate'))
                        ? handleMinTime()
                        : null
                    }
                    onChange={(newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        placeholder={t(
                          'EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.TIME_PLACEHOLDER',
                        )}
                        {...params}
                      />
                    )}
                  />
                )}
              />
              {errors?.startTime && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors?.startTime?.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5} fontWeight={600}>
                {t('EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.END_TIME')}{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>
              </Typography>
              <Controller
                name="endTime"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TimePicker
                    ampm={false}
                    minTime={
                      watch('scheduleType') === 'one time' &&
                      handleIsTodaySelected(watch('startDate'))
                        ? handleMinTime()
                        : null
                    }
                    value={value}
                    onChange={(newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        placeholder={t(
                          'EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.TIME_PLACEHOLDER',
                        )}
                        {...params}
                      />
                    )}
                  />
                )}
              />
              {errors?.endTime && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors?.endTime?.message}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </>
      ) : (
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={0.8}>
            {defaultValues.days.map((day, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={day.day}>
                <Controller
                  name={`days.${index}.selected`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label={
                        <span style={{ textTransform: 'capitalize' }}>
                          {t(
                            `EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.${day.day.toUpperCase()}`,
                          )}
                        </span>
                      }
                    />
                  )}
                />
                <Grid
                  container
                  spacing={0.5}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      flexDirection: 'unset',
                    },
                  }}
                >
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Controller
                      name={`days.${index}.startTime`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TimePicker
                          sx={{
                            flexDirection: 'unset',
                          }}
                          ampm={false}
                          label={t(
                            'EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.START_TIME',
                          )}
                          value={value}
                          onChange={(newValue) => onChange(newValue)}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                        />
                      )}
                    />
                    {errors?.days?.[index]?.startTime && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors?.days?.[index]?.startTime?.message}
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Controller
                      name={`days.${index}.endTime`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TimePicker
                          label={t(
                            'EDUCATOR.CREATE_WEBINAR.SCHEDULE_WEBINAR.END_TIME',
                          )}
                          ampm={false}
                          value={value}
                          onChange={(newValue) => onChange(newValue)}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                        />
                      )}
                    />
                    {errors?.days?.[index]?.endTime && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors?.days?.[index]?.endTime?.message}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
      {errors?.days?.root?.message && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {errors?.days?.root?.message}
        </Typography>
      )}
    </>
  )
}

export default WebinarSchedule
