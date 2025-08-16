import React from 'react'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
import { Controller, useFormContext } from 'react-hook-form'

import {
  Box,
  Grid,
  Button,
  useTheme,
  TextField,
  Typography,
  ButtonGroup,
  FormControl,
} from '@mui/material'

import CharacterCount from '../../../character-count'
import AddCategory from '../../../Webinar/create-webinar/add-category'

const BasicDetails = () => {
  const theme = useTheme()
  const { t } = useTranslation('education')

  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        {t('EDUCATOR.CREATE_COURSE.BASIC_DETAILS')}
      </Typography>
      <Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('EDUCATOR.BASIC_DETAILS.COURSE_TITLE')}
                  <Typography
                    color="error.main"
                    component="span"
                    sx={{ ml: 0.5 }}
                  >
                    *
                  </Typography>
                </Typography>
                <CharacterCount
                  maxLength={100}
                  currentLength={watch('title')?.trim()?.length ?? 0}
                />
              </Box>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    control={control}
                    placeholder={t('EDUCATOR.BASIC_DETAILS.TITLE_PLACEHOLDER')}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                )}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                {t('EDUCATOR.BASIC_DETAILS.IMAGE_DESCRIPTION')}
              </Typography>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('EDUCATOR.BASIC_DETAILS.COURSE_SUBTITLE')}
                  <Typography
                    color="error.main"
                    component="span"
                    sx={{ ml: 0.5 }}
                  >
                    *
                  </Typography>
                </Typography>
                <CharacterCount
                  maxLength={150}
                  currentLength={watch('subtitle')?.trim()?.length ?? 0}
                />
              </Box>
              <Controller
                name="subtitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    control={control}
                    placeholder={t(
                      'EDUCATOR.BASIC_DETAILS.SUBTITLE_DESCRIPTION',
                    )}
                    size="small"
                    error={!!errors.subtitle}
                    helperText={errors.subtitle?.message}
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('EDUCATOR.BASIC_DETAILS.COURSE_DESCRIPTION')}
                  <Typography
                    color="error.main"
                    component="span"
                    sx={{ ml: 0.5 }}
                  >
                    *
                  </Typography>
                </Typography>
                <CharacterCount
                  maxLength={1000}
                  currentLength={watch('description')?.trim()?.length ?? 0}
                />
              </Box>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    control={control}
                    placeholder={t(
                      'EDUCATOR.BASIC_DETAILS.CATEGORY_DESCRIPTION',
                    )}
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Box mb={1}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('EDUCATOR.BASIC_DETAILS.ADD_CATEGORY')}
                  <Typography
                    color="error.main"
                    component="span"
                    sx={{ ml: 0.5 }}
                  >
                    *
                  </Typography>
                </Typography>
              </Box>
              <AddCategory />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  {t('EDUCATOR.BASIC_DETAILS.PRICING_TYPE')}
                </Typography>
                <Controller
                  name="isPaid"
                  control={control}
                  defaultValue="free"
                  rules={{
                    required: t(
                      'EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICING_TYPE_REQUIRED',
                    ),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <ButtonGroup
                      sx={{
                        '& .MuiButton-root:not(:last-child)': {
                          borderRight: 'none',
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          backgroundColor: !value
                            ? 'primary.main'
                            : 'transparent',
                          color: !value ? 'white' : 'text.secondary',
                          borderColor: theme.palette.grey[300],
                          '&:hover': {
                            backgroundColor: !value
                              ? 'primary.dark'
                              : 'action.hover',
                          },
                        }}
                        onClick={() => onChange(false)}
                      >
                        {t('EDUCATOR.COMMON_KEYS.FREE')}
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          backgroundColor: value
                            ? 'primary.main'
                            : 'transparent',
                          color: value ? 'white' : 'text.secondary',
                          borderColor: theme.palette.grey[300],
                          '&:hover': {
                            backgroundColor: value
                              ? 'primary.dark'
                              : 'action.hover',
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  {t('EDUCATOR.BASIC_DETAILS.ADD_PRICE')}
                </Typography>
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: t(
                      'EDUCATOR.BASIC_DETAILS.VALIDATIONS.PRICE_REQUIRED',
                    ),
                  }}
                  render={({ field, fieldState }) => (
                    <NumericFormat
                      {...field}
                      customInput={TextField}
                      placeholder="$ 0.00"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  )
}
export default BasicDetails
