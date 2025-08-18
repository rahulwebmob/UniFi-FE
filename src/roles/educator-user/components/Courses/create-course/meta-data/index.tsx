import React from 'react'
import { ImageIcon, VideoIcon } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Typography, Box, Grid, FormControl, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

const MetaData: React.FC = () => {
  const { t } = useTranslation('education')
  const theme = useTheme()
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Grid container spacing={1}>
      <Grid item size={12}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={0.5} fontWeight={600}>
            {t('EDUCATOR.SETUP_COURSE.COURSE_IMAGE')}
            <Typography variant="body1" color="error.main" component="span">
              *
            </Typography>
          </Typography>
          <Box
            sx={{
              border: '2px solid',
              borderStyle: 'dotted',
              borderColor: theme.palette.divider,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '10px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.palette.action.hover,
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              '&:hover': {
                bgcolor: theme.palette.action.selected,
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
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) onChange(file)
                    }}
                  />
                  <ImageIcon
                    size={40}
                    color={theme.palette.primary.main}
                  />
                  <Typography
                    noWrap
                    variant="body1"
                    sx={{
                      color: 'text.primary',
                      width: '200px',
                      height: 'max-content',
                      mt: 1,
                    }}
                  >
                    {typeof value === 'object' && value && 'name' in value 
                      ? (value as File).name 
                      : value || ''}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {t('EDUCATOR.SETUP_COURSE.CLICK_TO_UPLOAD_OR_DRAG_DROP')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('EDUCATOR.SETUP_COURSE.IMAGE_FORMAT_GUIDELINES')}
                  </Typography>
                  {errors.image && (
                    <Typography component="p" variant="caption" color="error">
                      {errors.image.message as string}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t('EDUCATOR.SETUP_COURSE.COURSE_IMAGE_UPLOAD_GUIDELINES')}
          </Typography>
        </FormControl>
      </Grid>
      <Grid item size={12}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={0.5} fontWeight={600}>
            {t('EDUCATOR.SETUP_COURSE.PREVIEW_VIDEO')}
            <Typography variant="body1" color="error.main" component="span">
              *
            </Typography>
          </Typography>
          <Box
            sx={{
              border: '2px solid',
              borderStyle: 'dotted',
              borderColor: theme.palette.divider,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '10px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.palette.action.hover,
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              '&:hover': {
                bgcolor: theme.palette.action.selected,
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
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) onChange(file)
                    }}
                  />
                  <VideoIcon
                    size={40}
                    color={theme.palette.primary.main}
                  />
                  <Typography
                    variant="body1"
                    sx={{ 
                      color: 'text.primary', 
                      width: '200px',
                      mt: 1,
                    }}
                    noWrap
                  >
                    {typeof value === 'object' && value && 'name' in value 
                      ? (value as File).name 
                      : value || ''}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {t('EDUCATOR.SETUP_COURSE.CLICK_TO_UPLOAD_OR_DRAG_DROP')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('EDUCATOR.SETUP_COURSE.VIDEO_FORMAT_GUIDELINES')}
                  </Typography>
                  {errors.video && (
                    <Typography variant="caption" color="error">
                      {errors.video.message as string}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t('EDUCATOR.SETUP_COURSE.VIDEO_UPLOAD_GUIDELINES')}
          </Typography>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default MetaData