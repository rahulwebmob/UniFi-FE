import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  InputAdornment,
} from '@mui/material'
import { CloudUpload } from 'lucide-react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'

import RequiredFieldIndicator from '../../../ui-elements/required-field-indicator'

const Document = ({ control, errors, setCvFile, setMp4File }) => {
  const handleFileChange = (event, onChange, type) => {
    const selectedFile = event?.target?.files?.[0]
    if (type === 'cv') {
      setCvFile(selectedFile)
    } else {
      setMp4File(selectedFile)
    }
    onChange(selectedFile)
  }

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Upload CV
        </Typography>
        <Controller
          name="cv"
          control={control}
          defaultValue={null}
          rules={{ required: 'CV is required' }}
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value?.name || ''}
              placeholder="PDF , DOC and DOCX (max. 50 MB)"
              size="small"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CloudUpload size={16} />}
                      component="label"
                      sx={{ minWidth: 'auto' }}
                    >
                      Upload
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        hidden
                        onChange={(event) => handleFileChange(event, onChange, 'cv')}
                      />
                    </Button>
                  </InputAdornment>
                ),
              }}
              error={!!errors.cv}
              helperText={errors.cv?.message ? String(errors.cv.message) : undefined}
            />
          )}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Upload a sample work/video
        </Typography>
        <Controller
          name="video"
          control={control}
          defaultValue={null}
          rules={{ required: 'Sample work/video is required' }}
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value?.name || ''}
              placeholder="MP4, MOV, WEBM (max. 200 MB)"
              size="small"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CloudUpload size={16} />}
                      component="label"
                      sx={{ minWidth: 'auto' }}
                    >
                      Upload
                      <input
                        type="file"
                        accept=".mp4,.mov,.webm"
                        hidden
                        onChange={(event) => handleFileChange(event, onChange, 'mp4')}
                      />
                    </Button>
                  </InputAdornment>
                ),
              }}
              error={!!errors.video}
              helperText={errors.video?.message ? String(errors.video.message) : undefined}
            />
          )}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mb: 1 }}>
        <Typography variant="body1">
          Where did you hear about us?
          <RequiredFieldIndicator />
        </Typography>
        <Controller
          name="hau"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              variant="outlined"
              placeholder="Select an option"
              fullWidth
              size="small"
              error={!!errors.hau}
              helperText={errors.hau?.message ? String(errors.hau.message) : undefined}
            >
              <MenuItem value="Social Media">Social Media</MenuItem>
              <MenuItem value="Referral">Referral</MenuItem>
              <MenuItem value="Job Portal">Job Portal</MenuItem>
              <MenuItem value="Company Website">Company Website</MenuItem>
              <MenuItem value="Email Campaign">Email Campaign</MenuItem>
              <MenuItem value="Educational Conference">Educational Conference</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          )}
        />
      </FormControl>
    </Box>
  )
}

Document.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setCvFile: PropTypes.func.isRequired,
  setMp4File: PropTypes.func.isRequired,
}

export default Document
