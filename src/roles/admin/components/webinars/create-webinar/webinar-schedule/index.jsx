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
import { TimePicker } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Calendar, CalendarCheck, CalendarDays } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { handleMinTime, handleIsTodaySelected } from '../../../../../../utils/webinar-utils'

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
              Schedule Webinar
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
                  <ButtonGroup
                    sx={{
                      '& .MuiButton-root:not(:last-child)': {
                        borderRight: 'none',
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Calendar size={16} />}
                      sx={{
                        backgroundColor:
                          watch('scheduleType') === 'daily' ? 'primary.main' : 'transparent',
                        color: watch('scheduleType') === 'daily' ? 'white' : 'text.secondary',
                        borderColor: (theme) => theme.palette.grey[300],
                        '&:hover': {
                          backgroundColor:
                            watch('scheduleType') === 'daily' ? 'primary.dark' : 'action.hover',
                        },
                      }}
                      onClick={() => {
                        handleScheduleTypeChange('daily', onChange)
                      }}
                    >
                      Daily
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CalendarDays size={16} />}
                      sx={{
                        backgroundColor:
                          watch('scheduleType') === 'weekly' ? 'primary.main' : 'transparent',
                        color: watch('scheduleType') === 'weekly' ? 'white' : 'text.secondary',
                        borderColor: (theme) => theme.palette.grey[300],
                        '&:hover': {
                          backgroundColor:
                            watch('scheduleType') === 'weekly' ? 'primary.dark' : 'action.hover',
                        },
                      }}
                      onClick={() => {
                        handleScheduleTypeChange('weekly', onChange)
                      }}
                    >
                      Weekly
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CalendarCheck size={16} />}
                      sx={{
                        backgroundColor:
                          watch('scheduleType') === 'one time' ? 'primary.main' : 'transparent',
                        color: watch('scheduleType') === 'one time' ? 'white' : 'text.secondary',
                        borderColor: (theme) => theme.palette.grey[300],
                        '&:hover': {
                          backgroundColor:
                            watch('scheduleType') === 'one time' ? 'primary.dark' : 'action.hover',
                        },
                      }}
                      onClick={() => {
                        handleScheduleTypeChange('one time', onChange)
                      }}
                    >
                      One Time
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
                Date{' '}
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
                    enableAccessibleFieldDOMStructure={false}
                    slots={{
                      textField: TextField,
                    }}
                    slotProps={{
                      textField: {
                        placeholder: 'Select date',
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
              {errors?.startDate && (
                <Typography color="error">{errors?.startDate?.message}</Typography>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5} fontWeight={600}>
                Start Time{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>
              </Typography>
              <Controller
                name="startTime"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const handleChange = (newValue) => {
                    onChange(newValue)
                  }
                  return (
                    <TimePicker
                      ampm={false}
                      value={value ?? undefined}
                      minTime={
                        watch('scheduleType') === 'one time' &&
                        handleIsTodaySelected(watch('startDate') ?? null)
                          ? handleMinTime() || undefined
                          : undefined
                      }
                      onChange={handleChange}
                      enableAccessibleFieldDOMStructure={false}
                      slots={{
                        textField: TextField,
                      }}
                      slotProps={{
                        textField: {
                          placeholder: 'Select time',
                        },
                      }}
                    />
                  )
                }}
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
                End Time{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>
              </Typography>
              <Controller
                name="endTime"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const handleChange = (newValue) => {
                    onChange(newValue)
                  }
                  return (
                    <TimePicker
                      ampm={false}
                      minTime={
                        watch('scheduleType') === 'one time' &&
                        handleIsTodaySelected(watch('startDate') ?? null)
                          ? handleMinTime() || undefined
                          : undefined
                      }
                      value={value ?? undefined}
                      onChange={handleChange}
                      enableAccessibleFieldDOMStructure={false}
                      slots={{
                        textField: TextField,
                      }}
                      slotProps={{
                        textField: {
                          placeholder: 'Select time',
                        },
                      }}
                    />
                  )
                }}
              />
              {errors?.endTime && <Typography color="error">{errors?.endTime?.message}</Typography>}
            </FormControl>
          </Grid>
        </>
      ) : (
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={0.8}>
            {(defaultValues?.days || [])?.map((day, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={day.day}>
                <Controller
                  name={`days.${index}.selected`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label={<span style={{ textTransform: 'capitalize' }}>{day.day}</span>}
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
                      render={({ field: { onChange, value } }) => {
                        const handleChange = (newValue) => {
                          onChange(newValue)
                        }
                        return (
                          <TimePicker
                            sx={{
                              flexDirection: 'unset',
                            }}
                            ampm={false}
                            label="Start Time"
                            value={value ?? undefined}
                            onChange={handleChange}
                            enableAccessibleFieldDOMStructure={false}
                            slots={{
                              textField: TextField,
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                          />
                        )
                      }}
                    />
                    {errors?.days?.[index]?.startTime && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        {errors?.days?.[index]?.startTime?.message}
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Controller
                      name={`days.${index}.endTime`}
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        const handleChange = (newValue) => {
                          onChange(newValue)
                        }
                        return (
                          <TimePicker
                            label="End Time"
                            ampm={false}
                            value={value ?? undefined}
                            onChange={handleChange}
                            enableAccessibleFieldDOMStructure={false}
                            slots={{
                              textField: TextField,
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                              },
                            }}
                          />
                        )
                      }}
                    />
                    {errors?.days?.[index]?.endTime && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
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
