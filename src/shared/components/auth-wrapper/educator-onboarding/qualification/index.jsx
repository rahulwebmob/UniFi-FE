import { Box, Grid, Button, Divider, TextField, Typography, FormControl } from '@mui/material'
import { Plus, Minus } from 'lucide-react'
import PropTypes from 'prop-types'
import { Controller, useFieldArray } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

const Qualification = ({ control }) => {
  const {
    fields: expertiseFields,
    append: addExpertise,
    remove: removeExpertise,
  } = useFieldArray({
    control,
    name: 'expertise',
  })

  const {
    fields: educationFields,
    append: addEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'education',
  })

  const {
    fields: certificateFields,
    append: addCertificate,
    remove: removeCertificate,
  } = useFieldArray({
    control,
    name: 'certifications',
  })

  return (
    <Box mb={2}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <Typography variant="body1">
              Executive Summary
              {/* <RequiredFieldIndicator /> */}
            </Typography>
            <Controller
              name="summary"
              control={control}
              rules={{ required: 'Executive Summary is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Tell us a little bit about yourself..."
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <FormControl fullWidth>
            <Typography variant="body1">Company</Typography>
            <Controller
              name="company"
              control={control}
              rules={{ required: 'Company name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder="Company name"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <FormControl fullWidth>
            <Typography variant="body1">Years of experience</Typography>
            <Controller
              name="experience"
              control={control}
              render={({ field, fieldState }) => (
                <NumericFormat
                  {...field}
                  customInput={TextField}
                  type="text"
                  placeholder="10"
                  size="small"
                  allowNegative={false}
                  decimalScale={2}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0)
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Divider
        sx={{
          borderColor: (theme) => theme.palette.primary[100],
          my: 2,
          width: '100%',
        }}
      />
      <Grid size={{ xs: 12 }}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography component="p" color="black.main700">
            Expertise
          </Typography>
          <Button
            startIcon={<Plus size={16} />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => addExpertise({ category: '' })}
            sx={{
              height: '32px',
              fontSize: '0.875rem',
            }}
          >
            Add More
          </Button>
        </Box>

        {expertiseFields.map((f, index) => (
          <Grid container spacing={1} key={f.id} mb={expertiseFields?.length > 1 ? 1 : 0}>
            {!!index && (
              <Grid size={{ xs: 12 }} textAlign="right">
                <Button
                  startIcon={<Minus size={16} />}
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => removeExpertise(index)}
                  sx={{
                    height: '32px',
                    fontSize: '0.875rem',
                  }}
                >
                  Remove
                </Button>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
              <FormControl fullWidth>
                <Typography variant="body1">Category</Typography>
                <Controller
                  name={`expertise.${index}.category`}
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder="Ex: Finance"
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Divider
        sx={{
          borderColor: (theme) => theme.palette.primary[100],
          my: 2,
          width: '100%',
        }}
      />
      <Grid size={{ xs: 12 }}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography component="p" color="black.main700">
            Education
          </Typography>
          <Button
            startIcon={<Plus size={16} />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => addEducation({ degree: '', field: '' })}
            sx={{
              height: '32px',
              fontSize: '0.875rem',
            }}
          >
            Add More
          </Button>
        </Box>

        {educationFields.map((f, index) => (
          <Grid container spacing={1} key={f.id} mb={educationFields?.length > 1 ? 1 : 0}>
            {!!index && (
              <Grid size={{ xs: 12 }} textAlign="right">
                <Button
                  startIcon={<Minus size={16} />}
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => removeEducation(index)}
                  sx={{
                    height: '32px',
                    fontSize: '0.875rem',
                  }}
                >
                  Remove
                </Button>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <Typography variant="body1">Degree</Typography>
                <Controller
                  name={`education.${index}.degree`}
                  control={control}
                  rules={{ required: 'Degree is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder="Ex: Bachelor's"
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
              <FormControl fullWidth>
                <Typography variant="body1">Field of study</Typography>
                <Controller
                  name={`education.${index}.field`}
                  control={control}
                  rules={{ required: 'Field of study is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder="Field of study"
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Divider
        sx={{
          borderColor: (theme) => theme.palette.primary[100],
          my: 2,
          width: '100%',
        }}
      />
      <Grid size={{ xs: 12 }}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography component="p" color="black.main700">
            Certificates
          </Typography>
          <Button
            startIcon={<Plus size={16} />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => addCertificate({ name: '', organization: '' })}
            sx={{
              height: '32px',
              fontSize: '0.875rem',
            }}
          >
            Add More
          </Button>
        </Box>
        {certificateFields.map((f, index) => (
          <Grid container spacing={1} key={f.id} mb={certificateFields?.length > 1 ? 1 : 0}>
            {!!index && (
              <Grid size={{ xs: 12 }} textAlign="right">
                <Button
                  startIcon={<Minus size={16} />}
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => removeCertificate(index)}
                  sx={{
                    height: '32px',
                    fontSize: '0.875rem',
                  }}
                >
                  Remove
                </Button>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
              <FormControl fullWidth>
                <Typography variant="body1">Name</Typography>
                <Controller
                  name={`certifications.${index}.name`}
                  control={control}
                  rules={{ required: 'Certificate name is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder="Ex: Microsoft certified network associate"
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <Typography variant="body1">Issuing organization</Typography>
                <Controller
                  name={`certifications.${index}.organization`}
                  control={control}
                  rules={{ required: 'Issuing organization is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder="Ex: Microsoft"
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

Qualification.propTypes = {
  control: PropTypes.object.isRequired,
}

export default Qualification
