import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  Button,
  ButtonGroup,
  useTheme,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import CharacterCount from '../../../character-count'
import AddCategory from '../../../Webinar/create-webinar/add-category'

const BasicDetails = () => {
  const theme = useTheme()

  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Box>
      <Box mt={2}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={1} fontWeight={500}>
                Recorded Session Title{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>{' '}
                <CharacterCount
                  maxLength={100}
                  currentLength={(watch('title') || '').trim().length}
                />
              </Typography>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    control={control}
                    placeholder="Enter recorded session title"
                    size="small"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    fullWidth
                  />
                )}
              />

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Make your recorded session stand out with a compelling title that captures its
                essence
              </Typography>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={1} fontWeight={500}>
                Recorded Session Subtitle{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>{' '}
                <CharacterCount
                  maxLength={150}
                  currentLength={(watch('subtitle') || '').trim().length}
                />
              </Typography>
              <Controller
                name="subtitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    control={control}
                    placeholder="Enter a brief subtitle for your recorded session"
                    size="small"
                    error={!!errors.subtitle}
                    helperText={errors.subtitle?.message}
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth>
              <Typography variant="body1" mb={1} fontWeight={500}>
                Recorded Session Description{' '}
                <Typography variant="body1" color="error.main" component="span">
                  *
                </Typography>{' '}
                <CharacterCount
                  maxLength={1000}
                  currentLength={(watch('description') || '').trim().length}
                />
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    control={control}
                    placeholder="Provide a detailed description of your recorded session"
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
            size={12}
            sx={{
              '& .MuiChip-root': {
                border: '1px solid',
              },
            }}
          >
            <AddCategory />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth>
              <Box display="flex" alignItems="center" gap="10px" mt={1}>
                <Typography variant="body1" fontWeight={500}>
                  Pricing
                </Typography>
                <Controller
                  name="isPaid"
                  control={control}
                  defaultValue="free"
                  rules={{
                    required: 'Please select a pricing type',
                  }}
                  render={({ field: { onChange, value } }) => (
                    <ButtonGroup variant="outlined" sx={{ ml: 2 }}>
                      <Button
                        sx={{
                          backgroundColor: !value
                            ? 'primary.main'
                            : (theme) => theme.palette.background.paper,
                          color: !value ? (theme) => theme.palette.common.white : 'text.secondary',
                          borderColor: !value ? 'primary.main' : theme.palette.grey[300],
                          textTransform: 'none',
                          px: 3,
                          '&:hover': {
                            backgroundColor: !value ? 'primary.dark' : theme.palette.grey[50],
                            borderColor: !value ? 'primary.dark' : theme.palette.grey[400],
                          },
                        }}
                        onClick={() => onChange(false)}
                      >
                        Free
                      </Button>
                      <Button
                        sx={{
                          backgroundColor: value
                            ? 'primary.main'
                            : (theme) => theme.palette.background.paper,
                          color: value ? (theme) => theme.palette.common.white : 'text.secondary',
                          borderColor: value ? 'primary.main' : theme.palette.grey[300],
                          textTransform: 'none',
                          px: 3,
                          '&:hover': {
                            backgroundColor: value ? 'primary.dark' : theme.palette.grey[50],
                            borderColor: value ? 'primary.dark' : theme.palette.grey[400],
                          },
                        }}
                        onClick={() => onChange(true)}
                      >
                        Paid
                      </Button>
                    </ButtonGroup>
                  )}
                />
              </Box>
            </FormControl>
          </Grid>
          {watch('isPaid') && (
            <Grid size={6}>
              <FormControl fullWidth>
                <Typography variant="body1" mb={1} fontWeight={500}>
                  Add Price ($)
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
    </Box>
  )
}
export default BasicDetails
