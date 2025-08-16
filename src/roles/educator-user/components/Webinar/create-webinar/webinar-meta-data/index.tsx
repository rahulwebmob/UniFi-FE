import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, CloudUpload } from 'lucide-react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

import { Box, Grid, Button, Typography, FormControl } from '@mui/material'


const WebinarMetaData = () => {
  const fileInputRefs = useRef([])
  const { t } = useTranslation('education')

  const {
    control,
    formState: { errors },
  } = useFormContext()

  const {
    fields: resourceFields,
    append: addResource,
    remove: removeResource,
  } = useFieldArray({
    control,
    name: 'resources',
  })

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Typography
              variant="body1"
              mb={0.5}
              fontWeight={600}
              display="flex"
              alignItems="center"
              gap="2px"
            >
              {t('EDUCATOR.WEBINAR_META_DATA.UPLOAD_RESOURCE')}
              <Typography display="inline-block" color="text.secondary">
                {t('EDUCATOR.WEBINAR_META_DATA.RESOURCE_TYPE')}
              </Typography>
            </Typography>
            <Button
              startIcon={<Plus size={16} />}
              onClick={() => addResource({ file: '' })}
              variant="label"
              disabled={resourceFields?.length > 4}
              color="primary.main"
              sx={{ width: 'fit-content', marginLeft: 'auto' }}
            >
              {t('EDUCATOR.WEBINAR_META_DATA.ADD_MORE_RESOURCES')}
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {resourceFields.map((field, index) => (
              <Box
                key={field.id}
                display="grid"
                gridTemplateColumns="1fr 60px"
                gap="8px"
              >
                <Controller
                  key={field.id}
                  name={`resources.${index}.file`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Box
                        sx={{
                          backgroundColor: 'primary.light100',
                          p: 0.7,
                          border: '1px solid',
                          borderColor: 'primary.main200',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            gap: '0',
                            maxWidth: 'fit-content',
                          }}
                          startIcon={<CloudUpload size={16} />}
                          onClick={() => fileInputRefs.current[index].click()}
                        >
                          <input
                            ref={(el) => {
                              fileInputRefs.current[index] = el
                            }}
                            type="file"
                            accept=".doc,.docx,.pdf"
                            style={{ display: 'none' }}
                            onChange={(event) =>
                              onChange(event.target.files[0])
                            }
                          />
                          {t('EDUCATOR.WEBINAR_META_DATA.BROWSE')}
                        </Button>
                        <Typography
                          variant="body2 "
                          sx={{ color: 'text.primary' }}
                        >
                          {value.name || value}
                        </Typography>
                      </Box>
                      {!!resourceFields?.length && (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => {
                            removeResource(index)
                          }}
                          sx={{ float: 'right' }}
                        >
                          {t('EDUCATOR.COMMON_KEYS.REMOVE')}
                        </Button>
                      )}

                      {errors.resources?.[index]?.file && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                          {errors.resources?.[index]?.file?.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Box>
            ))}
          </Box>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={0.5} fontWeight={600}>
            {t('EDUCATOR.WEBINAR_META_DATA.UPLOAD_THUMBNAIL')}{' '}
            <Typography variant="body1" color="error.main" component="span">
              *
            </Typography>
          </Typography>
          <Controller
            name="image"
            control={control}
            defaultValue=""
            rules={{ required: 'Thumbnail"" is required' }}
            render={({ field: { onChange, value } }) => (
              <>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'primary.light',
                    borderRadius: '8px',
                    padding: '16px',
                    width: '100%',
                    height: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(event) => onChange(event.target.files[0])}
                    style={{
                      position: 'absolute',
                      opacity: '0',
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                  />
                  <CloudUpload
                    size={40}
                    style={{ color: 'var(--mui-palette-primary-main)' }}
                  />
                  <Typography variant="body1" color="primary">
                    {t('EDUCATOR.WEBINAR_META_DATA.DRAG_DROP')}
                  </Typography>
                  <Typography variant="body1">
                    {t('EDUCATOR.WEBINAR_META_DATA.PNG_JPG_JPEG')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {value.name || value}
                  </Typography>
                </Box>
                {errors.image && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.image.message}
                  </Typography>
                )}
              </>
            )}
          />
        </FormControl>
      </Grid>
    </>
  )
}

export default WebinarMetaData
