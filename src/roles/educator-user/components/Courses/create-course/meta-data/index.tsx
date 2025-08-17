import { Image, Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'

import { Box, Grid, useTheme, Typography, FormControl } from '@mui/material'

const MetaData = () => {
  const theme = useTheme()
  const { t } = useTranslation('education')
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        {t('EDUCATOR.CREATE_COURSE.SETUP_COURSE')}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {t('EDUCATOR.SETUP_COURSE.COURSE_IMAGE')}
              <Typography color="error.main" component="span" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Typography>
            <Box
              sx={{
                border: `2px dashed ${theme.palette.grey[300]}`,
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '10px',
                width: '100%',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.paper,
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '08',
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
                      onChange={(event) => {
                        const files = event.target.files
                        if (files && files[0]) {
                          onChange(files[0])
                        }
                      }}
                    />
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main + '10',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        border: `2px solid ${theme.palette.primary.main + '20'}`,
                      }}
                    >
                      <Image size={32} color={theme.palette.primary.main} />
                    </Box>
                    {value && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 1.5,
                          backgroundColor: theme.palette.success.main + '10',
                          borderRadius: '8px',
                          border: `1px solid ${theme.palette.success.main + '30'}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.success.main,
                            fontWeight: 600,
                          }}
                        >
                          ✓ {value?.name || value}
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        mb: 1,
                      }}
                    >
                      {t('EDUCATOR.SETUP_COURSE.CLICK_TO_UPLOAD_OR_DRAG_DROP')}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ opacity: 0.8 }}
                    >
                      {t('EDUCATOR.SETUP_COURSE.IMAGE_FORMAT_GUIDELINES')}
                    </Typography>
                    {errors.image && (
                      <Typography variant="caption" color="error">
                        {errors.image.message as string}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1 }}
            >
              {t('EDUCATOR.SETUP_COURSE.COURSE_IMAGE_UPLOAD_GUIDELINES')}
            </Typography>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {t('EDUCATOR.SETUP_COURSE.PREVIEW_VIDEO')}
              <Typography color="error.main" component="span" sx={{ ml: 0.5 }}>
                *
              </Typography>
            </Typography>
            <Box
              sx={{
                border: `2px dashed ${theme.palette.grey[300]}`,
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '10px',
                width: '100%',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.paper,
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '08',
                  borderColor: theme.palette.primary.main,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
                      onChange={(event) => {
                        const files = event.target.files
                        if (files && files[0]) {
                          onChange(files[0])
                        }
                      }}
                    />
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main + '10',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        border: `2px solid ${theme.palette.primary.main + '20'}`,
                      }}
                    >
                      <Video size={32} color={theme.palette.primary.main} />
                    </Box>
                    {value && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 1.5,
                          backgroundColor: theme.palette.success.main + '10',
                          borderRadius: '8px',
                          border: `1px solid ${theme.palette.success.main + '30'}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.success.main,
                            fontWeight: 600,
                          }}
                        >
                          ✓ {value?.name || value}
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        mb: 1,
                      }}
                    >
                      {t('EDUCATOR.SETUP_COURSE.CLICK_TO_UPLOAD_OR_DRAG_DROP')}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ opacity: 0.8 }}
                    >
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
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1 }}
            >
              {t('EDUCATOR.SETUP_COURSE.VIDEO_UPLOAD_GUIDELINES')}
            </Typography>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MetaData
