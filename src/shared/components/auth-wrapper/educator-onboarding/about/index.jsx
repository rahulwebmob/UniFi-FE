import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'

import countries from '../../../../../constants/countries'
import RequiredFieldIndicator from '../../../ui-elements/required-field-indicator'

const About = ({ control }) => (
  <Box>
    <Grid container spacing={1.5}>
      {/* First Row - First Name and Last Name */}
      <Grid size={6}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          First Name
          <RequiredFieldIndicator />
        </Typography>
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              placeholder="Enter your first name"
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
          Last Name
          <RequiredFieldIndicator />
        </Typography>
        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              placeholder="Enter your last name"
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
          Email
          <RequiredFieldIndicator />
        </Typography>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              placeholder="Enter your email address"
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
          Country
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
                  renderValue: (selected) => {
                    if (!selected) {
                      return (
                        <Typography component="p" sx={{ color: 'text.secondary' }}>
                          Select Country
                        </Typography>
                      )
                    }
                    return selected
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
          State
          <RequiredFieldIndicator />
        </Typography>
        <Controller
          name="state"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              variant="outlined"
              placeholder="Enter your state"
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

About.propTypes = {
  control: PropTypes.object.isRequired,
}

export default About
