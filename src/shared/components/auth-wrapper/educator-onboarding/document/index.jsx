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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('education')

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {t('REGISTER_EDUCATOR.DOCUMENT_PAGE.UPLOAD_CV')}
        </Typography>
        <Controller
          name="cv"
          control={control}
          defaultValue={null}
          rules={{ required: 'CV is required' }}
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value?.name || ''}
              placeholder={t('REGISTER_EDUCATOR.DOCUMENT_PAGE.ACCEPTED_FILE_TYPE')}
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
          {t('REGISTER_EDUCATOR.DOCUMENT_PAGE.UPLOAD_VIDEO')}
        </Typography>
        <Controller
          name="video"
          control={control}
          defaultValue={null}
          rules={{ required: 'Sample work/video is required' }}
          render={({ field: { onChange, value } }) => (
            <TextField
              value={value?.name || ''}
              placeholder={t('REGISTER_EDUCATOR.DOCUMENT_PAGE.VIDEO_FILE_FORMAT')}
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
          {t('REGISTER_EDUCATOR.DOCUMENT_PAGE.HEARING_PLATFORM')}
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
              placeholder={t('REGISTER_EDUCATOR.DOCUMENT_PAGE.HEARING_PLATFORM_PLACEHOLDER')}
              fullWidth
              size="small"
              error={!!errors.hau}
              helperText={errors.hau?.message ? String(errors.hau.message) : undefined}
            >
              <MenuItem value="Social Media">
                {t('REGISTER_EDUCATOR.DOCUMENT_PAGE.SOCIAL_MEDIA')}
              </MenuItem>
              <MenuItem value="Referral">{t('REGISTER_EDUCATOR.DOCUMENT_PAGE.REFERRAL')}</MenuItem>
              <MenuItem value="Job Portal">
                {t('REGISTER_EDUCATOR.DOCUMENT_PAGE.JOB_PORTAL')}
              </MenuItem>
              <MenuItem value="Company Website">
                {t('REGISTER_EDUCATOR.DOCUMENT_PAGE.COMPANY_WEBSITE')}
              </MenuItem>
              <MenuItem value="Email Campaign">
                {t('REGISTER_EDUCATOR.DOCUMENT_PAGE.EMAIL')}
              </MenuItem>
              <MenuItem value="Educational Conference">
                {t('REGISTER_EDUCATOR.DOCUMENT_PAGE.EDUCATIONAL_CONFERENCE')}
              </MenuItem>
              <MenuItem value="Other">{t('REGISTER_EDUCATOR.DOCUMENT_PAGE.OTHER')}</MenuItem>
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
