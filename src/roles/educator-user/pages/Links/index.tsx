import { useTranslation } from 'react-i18next'
import { XCircle, PlusCircle } from 'lucide-react'
import { Controller, type Control, useFieldArray } from 'react-hook-form'

import {
  Box,
  Grid,
  TextField,
  IconButton,
  Typography,
  FormControl,
} from '@mui/material'

import RequiredFieldIndicator from '../../../../shared/components/ui-elements/required-field-indicator'
import type { EducatorFormData } from '../../types/form-types'

interface LinksProps {
  control: Control<EducatorFormData>
}

const Links = ({ control }: LinksProps) => {
  const { t } = useTranslation('education')

  const {
    fields: webUrlFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'otherProfileUrls',
  })

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <FormControl fullWidth>
            <Typography variant="body1">
              {t('REGISTER_EDUCATOR.LINKS_PAGE.LINKEDIN')}
            </Typography>
            <Controller
              name="linkedinUrl"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={t('REGISTER_EDUCATOR.LINKS_PAGE.HTTPS')}
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
              {t('REGISTER_EDUCATOR.LINKS_PAGE.TWITTER')}
              <RequiredFieldIndicator />
            </Typography>
            <Controller
              name="twitterUrl"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={t('REGISTER_EDUCATOR.LINKS_PAGE.HTTPS')}
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
              {t('REGISTER_EDUCATOR.LINKS_PAGE.YOUTUBE')}
            </Typography>
            <Controller
              name="youtubeUrl"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={t('REGISTER_EDUCATOR.LINKS_PAGE.HTTPS')}
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
              {t('REGISTER_EDUCATOR.LINKS_PAGE.WEBSITE_URL')}
            </Typography>
            <Controller
              name="websiteUrl"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={t('REGISTER_EDUCATOR.LINKS_PAGE.HTTPS')}
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body1">
            {t('REGISTER_EDUCATOR.LINKS_PAGE.PROFILES_ON_OTHER_SITES.LABEL')}
          </Typography>
          {webUrlFields.map((f, index) => (
            <Box display="flex" alignItems="center" key={f.id}>
              <Grid size={{ xs: 10, sm: 11, lg: 11 }}>
                <FormControl fullWidth>
                  <Controller
                    name={`otherProfileUrls.${index}.link`}
                    control={control}
                    rules={{
                      required: t(
                        'REGISTER_EDUCATOR.LINKS_PAGE.PROFILES_ON_OTHER_SITES.VALIDATION',
                      ),
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        placeholder={t('REGISTER_EDUCATOR.LINKS_PAGE.HTTPS')}
                        size="small"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid
                size={{ xs: 2, sm: 1, lg: 1 }}
                container
                justifyContent="flex-end"
              >
                {index === 0 ? (
                  <IconButton
                    onClick={() => append({ link: '' })}
                    color="primary"
                  >
                    <PlusCircle size={32} />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => remove(index)}
                    color="error"
                    aria-label="delete"
                  >
                    <XCircle size={32} />
                  </IconButton>
                )}
              </Grid>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Links
