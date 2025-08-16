import React from 'react'
import { Image, Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'

import { Box, Grid, Typography, FormControl } from '@mui/material'

const MetaData = () => {
  const { t } = useTranslation('education')
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={0.5} fontWeight={600}>
            {t('EDUCATOR.SETUP_COURSE.COURSE_IMAGE')}
            <Typography variant="body1" color="error.main" component="span">
              *
            </Typography>
          </Typography>
          <Box
            sx={{
              border: '2px solid ',
              borderStyle: 'dotted',
              borderColor: (theme) => theme.palette.primary[100],
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '10px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: (theme) => theme.palette.primary.light,
              cursor: 'pointer',
              textAlign: 'center',
              '&:hover': {
                bgcolor: 'action.hover',
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
                  <Image
                    size={40}
                    style={{
                      color: (theme) => theme.palette.primary.light,
                    }}
                  />
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
                  <Typography variant="body1" color="primary">
                    {t('EDUCATOR.SETUP_COURSE.CLICK_TO_UPLOAD_OR_DRAG_DROP')}
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    {t('EDUCATOR.SETUP_COURSE.IMAGE_FORMAT_GUIDELINES')}
                  </Typography>
                  {errors.image && (
                    <Typography component="p" component="p" color="error">
                      {errors.image.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
          <Typography variant="body2" color="black.main700">
            {t('EDUCATOR.SETUP_COURSE.COURSE_IMAGE_UPLOAD_GUIDELINES')}
          </Typography>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={0.5} fontWeight={600}>
            {t('EDUCATOR.SETUP_COURSE.PREVIEW_VIDEO')}
            <Typography variant="body1" color="error.main" component="span">
              *
            </Typography>
          </Typography>
          <Box
            sx={{
              border: '2px solid ',
              borderStyle: 'dotted',
              borderColor: (theme) => theme.palette.primary[100],
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '10px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: (theme) => theme.palette.primary.light,
              cursor: 'pointer',
              textAlign: 'center',
              '&:hover': {
                bgcolor: 'action.hover',
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
                  <Video
                    size={40}
                    style={{
                      color: (theme) => theme.palette.primary.light,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.primary', width: '200px' }}
                    noWrap
                  >
                    {value?.name || value}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {t('EDUCATOR.SETUP_COURSE.CLICK_TO_UPLOAD_OR_DRAG_DROP')}
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    {t('EDUCATOR.SETUP_COURSE.VIDEO_FORMAT_GUIDELINES')}
                  </Typography>
                  {errors.video && (
                    <Typography variant="caption" color="error">
                      {errors.video.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
          <Typography variant="body2" color="black.main700">
            {t('EDUCATOR.SETUP_COURSE.VIDEO_UPLOAD_GUIDELINES')}
          </Typography>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default MetaData
