import React from 'react'
import { Plus, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
import { Controller, useFieldArray } from 'react-hook-form'

import {
  Box,
  Grid,
  Button,
  Divider,
  TextField,
  Typography,
  FormControl,
} from '@mui/material'
// import RequiredFieldIndicator from '../../../shared/components/layout/RequiredFieldIndicator/RequiredFieldIndicator'

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
  const { t } = useTranslation('education')

  return (
    <Box mb={2}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <Typography variant="body1">
              {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.EXECUTIVE_SUMMARY')}
              {/* <RequiredFieldIndicator /> */}
            </Typography>
            <Controller
              name="summary"
              control={control}
              rules={{ required: 'Executive Summary is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={t(
                    'REGISTER_EDUCATOR.QUALIFICATION_PAGE.EXECUTIVE_SUMMARY_PLACEHOLDER',
                  )}
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
            <Typography variant="body1">
              {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.COMPANY')}
            </Typography>
            <Controller
              name="company"
              control={control}
              rules={{ required: 'Company name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={t(
                    'REGISTER_EDUCATOR.QUALIFICATION_PAGE.COMPANY_PLACEHOLDER',
                  )}
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
            <Typography variant="body1">
              {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.YOE')}
            </Typography>
            <Controller
              name="experience"
              control={control}
              render={({ field, fieldState }) => (
                <NumericFormat
                  customInput={TextField}
                  {...field}
                  type="number"
                  placeholder={t(
                    'REGISTER_EDUCATOR.QUALIFICATION_PAGE.YOE_PLACEHOLDER',
                  )}
                  size="small"
                  allowNegative={false}
                  decimalScale={2}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
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
      <Grid sx={12}>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
        >
          <Typography component="p" color="black.main700">
            {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.EXPERTISE')}
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
            {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.ADD_LABEL')}
          </Button>
        </Box>

        {expertiseFields.map((f, index) => (
          <Grid
            container
            spacing={1}
            key={f.id}
            mb={expertiseFields?.length > 1 ? 1 : 0}
          >
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
                  {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.REMOVE_LABEL')}
                </Button>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
              <FormControl fullWidth>
                <Typography variant="body1">
                  {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.CATEGORY')}
                </Typography>
                <Controller
                  name={`expertise.${index}.category`}
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder={t(
                        'REGISTER_EDUCATOR.QUALIFICATION_PAGE.CATEGORY_PLACEHOLDER',
                      )}
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
      <Grid sx={12}>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
        >
          <Typography component="p" color="black.main700">
            {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.EDUCATION')}
          </Typography>
          <Button
            startIcon={<Plus size={16} />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => addEducation({ degree: '', fos: '' })}
            sx={{
              height: '32px',
              fontSize: '0.875rem',
            }}
          >
            {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.ADD_LABEL')}
          </Button>
        </Box>

        {educationFields.map((f, index) => (
          <Grid
            container
            spacing={1}
            key={f.id}
            mb={educationFields?.length > 1 ? 1 : 0}
          >
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
                  {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.REMOVE_LABEL')}
                </Button>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <Typography variant="body1">
                  {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.DEGREE')}
                </Typography>
                <Controller
                  name={`education.${index}.degree`}
                  control={control}
                  rules={{ required: 'Degree is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder={t(
                        'REGISTER_EDUCATOR.QUALIFICATION_PAGE.DEGREE_PLACEHOLDER',
                      )}
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
                <Typography variant="body1">
                  {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.FIELD_OF_STUDY')}
                </Typography>
                <Controller
                  name={`education.${index}.field`}
                  control={control}
                  rules={{ required: 'Field of study is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder={t(
                        'REGISTER_EDUCATOR.QUALIFICATION_PAGE.FIELD_OF_STUDY',
                      )}
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
      <Grid sx={12}>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
        >
          <Typography component="p" color="black.main700">
            {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.CERTIFICATES')}
          </Typography>
          <Button
            startIcon={<Plus size={16} />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => addCertificate({ name: '', issueOrg: '' })}
            sx={{
              height: '32px',
              fontSize: '0.875rem',
            }}
          >
            {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.ADD_LABEL')}
          </Button>
        </Box>
        {certificateFields.map((f, index) => (
          <Grid
            container
            spacing={1}
            key={f.id}
            mb={certificateFields?.length > 1 ? 1 : 0}
          >
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
                  {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.REMOVE_LABEL')}
                </Button>
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
              <FormControl fullWidth>
                <Typography variant="body1">
                  {t('REGISTER_EDUCATOR.QUALIFICATION_PAGE.NAME')}
                </Typography>
                <Controller
                  name={`certifications.${index}.name`}
                  control={control}
                  rules={{ required: 'Certificate name is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder={t(
                        'REGISTER_EDUCATOR.QUALIFICATION_PAGE.CERTIFICATES_NAME_PLACEHOLDER',
                      )}
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
                <Typography variant="body1">
                  {t(
                    'REGISTER_EDUCATOR.QUALIFICATION_PAGE.ISSUING_ORGANIZATION',
                  )}
                </Typography>
                <Controller
                  name={`certifications.${index}.organization`}
                  control={control}
                  rules={{ required: 'Issuing organization is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder={t(
                        'REGISTER_EDUCATOR.QUALIFICATION_PAGE.ISSUING_ORGANIZATION_PLACEHOLDER',
                      )}
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

export default Qualification
