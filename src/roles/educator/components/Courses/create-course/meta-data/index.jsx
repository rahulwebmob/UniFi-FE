import { Typography, Box, Grid, FormControl, useTheme } from '@mui/material'
import { Image, Video } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const MetaData = () => {
  const { t } = useTranslation('education')
  const theme = useTheme()
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={1} fontWeight={500}>
            {t('EDUCATOR.SETUP_COURSE.COURSE_IMAGE')}
            <Typography variant="body1" color="error.main" component="span">
              *
            </Typography>
          </Typography>
          <Box
            sx={{
              border: `2px dashed ${theme.palette.grey[300]}`,
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '16px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'background.paper',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.lighter || theme.palette.action.hover,
              },
            }}
          >
            <Controller
              name="image"
              control={control}
              defaultValue=""
              rules={{
                required: t('EDUCATOR.SETUP_COURSE.COURSE_IMAGE_REQUIRED'),
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    style={{
                      position: 'absolute',
                      opacity: '0',
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                    onChange={(event) => onChange(event.target.files[0])}
                  />
                  <Image size={48} color={theme.palette.primary.main} />
                  <Typography
                    noWrap
                    variant="body1"
                    sx={{
                      color: 'text.primary',
                      width: '200px',
                      height: 'max-content',
                    }}
                  >
                    {value?.name || value}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ mt: 2, mb: 1 }}>
                    {t('EDUCATOR.SETUP_COURSE.CLICK_TO_UPLOAD_OR_DRAG_DROP')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('EDUCATOR.SETUP_COURSE.IMAGE_FORMAT_GUIDELINES')}
                  </Typography>
                  {errors.image && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.image.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {t('EDUCATOR.SETUP_COURSE.COURSE_IMAGE_UPLOAD_GUIDELINES')}
          </Typography>
        </FormControl>
      </Grid>
      <Grid size={12}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={1} fontWeight={500}>
            {t('EDUCATOR.SETUP_COURSE.PREVIEW_VIDEO')}
            <Typography variant="body1" color="error.main" component="span">
              *
            </Typography>
          </Typography>
          <Box
            sx={{
              border: `2px dashed ${theme.palette.grey[300]}`,
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '16px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'background.paper',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.lighter || theme.palette.action.hover,
              },
            }}
          >
            <Controller
              name="video"
              control={control}
              defaultValue=""
              rules={{
                required: t('EDUCATOR.SETUP_COURSE.PREVIEW_VIDEO_REQUIRED'),
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <input
                    type="file"
                    accept=".mp4,.mov,.webm,.mkv"
                    style={{
                      position: 'absolute',
                      opacity: '0',
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                    onChange={(event) => onChange(event.target.files[0])}
                  />
                  <Video size={48} color={theme.palette.primary.main} />
                  <Typography variant="body1" sx={{ color: 'text.primary', width: '200px' }} noWrap>
                    {value?.name || value}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ mt: 2, mb: 1 }}>
                    {t('EDUCATOR.SETUP_COURSE.CLICK_TO_UPLOAD_OR_DRAG_DROP')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('EDUCATOR.SETUP_COURSE.VIDEO_FORMAT_GUIDELINES')}
                  </Typography>
                  {errors.video && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.video.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {t('EDUCATOR.SETUP_COURSE.VIDEO_UPLOAD_GUIDELINES')}
          </Typography>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default MetaData
