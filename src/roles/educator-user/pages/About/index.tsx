import React from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, type Control } from 'react-hook-form'

import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
} from '@mui/material'

import countries from '../../../../constants/countries'
import RequiredFieldIndicator from '../../../../shared/components/ui-elements/required-field-indicator'
import type { EducatorFormData } from '../../types/form-types'


interface AboutProps {
  control: Control<EducatorFormData>
}

const About = ({ control }: AboutProps) => {
  const { t } = useTranslation('education')

  return (
    <Box>
      <Grid container spacing={1.5}>
        {/* First Row - First Name and Last Name */}
        <Grid size={6}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {t('REGISTER_EDUCATOR.ABOUT_PAGE.FIRST_NAME')}
            <RequiredFieldIndicator />
          </Typography>
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                placeholder={t(
                  'REGISTER_EDUCATOR.ABOUT_PAGE.FIRST_NAME_PLACEHOLDER',
                )}
                size="small"
                fullWidth
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {t('REGISTER_EDUCATOR.ABOUT_PAGE.LAST_NAME')}
            <RequiredFieldIndicator />
          </Typography>
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                placeholder={t(
                  'REGISTER_EDUCATOR.ABOUT_PAGE.LAST_NAME_PLACEHOLDER',
                )}
                size="small"
                fullWidth
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Grid>

        {/* Second Row - Email (Full Width) */}
        <Grid size={12}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {t('REGISTER_EDUCATOR.ABOUT_PAGE.EMAIL')}
            <RequiredFieldIndicator />
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                placeholder={t(
                  'REGISTER_EDUCATOR.ABOUT_PAGE.EMAIL_PLACEHOLDER',
                )}
                size="small"
                fullWidth
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Grid>

        {/* Third Row - Country and State */}
        <Grid size={6}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {t('REGISTER_EDUCATOR.ABOUT_PAGE.COUNTRY')}
            <RequiredFieldIndicator />
          </Typography>
          <Controller
            name="country"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <TextField
                  select
                  size="small"
                  SelectProps={{
                    renderValue: (selected: unknown): React.ReactNode => {
                      if (!selected) {
                        return (
                          <Typography
                            component="p"
                            sx={{ color: 'text.secondary' }}
                          >
                            {t(
                              'REGISTER_EDUCATOR.ABOUT_PAGE.COUNTRY_PLACEHOLDER',
                            )}
                          </Typography>
                        )
                      }
                      return selected as string
                    },
                  }}
                  {...field}
                  slotProps={{
                    select: {
                      MenuProps: {
                        PaperProps: {
                          style: {
                            height: '175px',
                          },
                        },
                      },
                    },
                  }}
                >
                  {countries.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.html}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText>{error ? error.message : ''}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={6}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {t('REGISTER_EDUCATOR.ABOUT_PAGE.STATE')}
            <RequiredFieldIndicator />
          </Typography>
          <Controller
            name="state"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                variant="outlined"
                placeholder={t(
                  'REGISTER_EDUCATOR.ABOUT_PAGE.STATE_PLACEHOLDER',
                )}
                fullWidth
                size="small"
                error={!!error}
                helperText={error ? error.message : ''}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default About
