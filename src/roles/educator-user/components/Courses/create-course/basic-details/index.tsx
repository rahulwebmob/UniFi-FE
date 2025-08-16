import React from 'react'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
import { Controller, useFormContext } from 'react-hook-form'

import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  FormControl,
  ButtonGroup,
} from '@mui/material'

import CharacterCount from '../../../character-count'
import { ACTIVE_BUTTON_CSS } from '../../../common/common'
import AddCategory from '../../../webinar/create-webinar/add-category'

const BasicDetails = () => {
  const { t } = useTranslation('education')

  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Box>
      <Box mt={2}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                {t('EDUCATOR.BASIC_DETAILS.COURSE_TITLE')}{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>{' '}
                <CharacterCount
                  maxLength={100}
                  currentLength={watch('title').trim().length}
                />
              </Typography>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    control={control}
                    placeholder={t('EDUCATOR.BASIC_DETAILS.TITLE_PLACEHOLDER')}
                    size="small"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    fullWidth
                  />
                )}
              />

              <Typography variant="body1" mb={0.5} color="text.secondary">
                {t('EDUCATOR.BASIC_DETAILS.IMAGE_DESCRIPTION')}
              </Typography>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={0.5}>
                {t('EDUCATOR.BASIC_DETAILS.COURSE_SUBTITLE')}{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>{' '}
                <CharacterCount
                  maxLength={150}
                  currentLength={watch('subtitle').trim().length}
                />
              </Typography>
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
              <Typography variant="body1" mb={0.5}>
                {t('EDUCATOR.BASIC_DETAILS.COURSE_DESCRIPTION')}{' '}
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    control={control}
                    placeholder={t(
                      'EDUCATOR.BASIC_DETAILS.CATEGORY_DESCRIPTION',
                    )}
                    multiline
                    rows={5}
                    variant="outlined"
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
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
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" gap="10px" mt={1}>
                <Typography variant="body1" mb={0.5} fontWeight={600}>
                  {t('EDUCATOR.BASIC_DETAILS.PRICING')} :
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
                  {t('EDUCATOR.BASIC_DETAILS.ADD_PRICE')} :
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
    </Box>
  )
}
export default BasicDetails
