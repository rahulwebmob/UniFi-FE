import { Box, Grid, Button, Typography, FormControl, IconButton } from '@mui/material'
import { Plus, CloudUpload, X } from 'lucide-react'
import { useRef } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

const getErrorMessage = (error) => {
  if (!error) {
    return ''
  }
  if (typeof error === 'string') {
    return error
  }
  if (typeof error.message === 'string') {
    return error.message
  }
  return ''
}

const WebinarMetaData = () => {
  const fileInputRefs = useRef([])

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
              my: 1,
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
              Upload Resource
              <Typography display="inline-block" component="span" color="text.secondary">
                (doc, docx, pdf)
              </Typography>
            </Typography>
            <Button
              startIcon={<Plus size={16} />}
              onClick={() => addResource({ file: '' })}
              variant="outlined"
              disabled={resourceFields?.length > 4}
              color="primary"
              size="small"
            >
              Add More Resources
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
              <Box key={field.id}>
                <Box display="flex" gap="8px" alignItems="center">
                  <Controller
                    name={`resources.${index}.file`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Box
                          sx={{
                            p: 1.5,
                            border: (theme) => `2px dashed ${theme.palette.grey[300]}`,
                            borderRadius: '12px',
                            backgroundColor: 'background.paper',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flex: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: (theme) => theme.palette.primary.main,
                              backgroundColor: (theme) =>
                                theme.palette.primary.lighter || theme.palette.action.hover,
                            },
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              gap: '0',
                              maxWidth: 'fit-content',
                            }}
                            startIcon={<CloudUpload size={16} />}
                            onClick={() => fileInputRefs.current[index]?.click()}
                          >
                            <input
                              ref={(el) => {
                                fileInputRefs.current[index] = el
                              }}
                              type="file"
                              accept=".doc,.docx,.pdf"
                              style={{ display: 'none' }}
                              onChange={(event) => {
                                const file = event.target.files?.[0]
                                if (file) {
                                  onChange(file)
                                }
                              }}
                            />
                            Browse
                          </Button>
                          <Typography variant="body2" sx={{ color: 'text.primary', flex: 1 }}>
                            {value?.name || value || 'No file selected'}
                          </Typography>
                        </Box>
                        {!!resourceFields?.length && (
                          <IconButton
                            color="error"
                            onClick={() => {
                              removeResource(index)
                            }}
                          >
                            <X size={20} />
                          </IconButton>
                        )}
                      </>
                    )}
                  />
                </Box>
                {errors.resources?.[index]?.file && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {getErrorMessage(errors.resources[index]?.file)}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <Typography variant="body1" mb={0.5} fontWeight={600}>
            Upload Thumbnail{' '}
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
                    border: (theme) => `2px dashed ${theme.palette.grey[300]}`,
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
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        onChange(file)
                      }
                    }}
                    style={{
                      position: 'absolute',
                      opacity: '0',
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                  />
                  <CloudUpload size={40} style={{ color: 'var(--mui-palette-primary-main)' }} />
                  <Typography variant="body1" color="primary">
                    Drag and drop files here
                  </Typography>
                  <Typography variant="body1">PNG, JPG, JPEG</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {value?.name || value || 'No file selected'}
                  </Typography>
                </Box>
                {errors.image && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {getErrorMessage(errors.image)}
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
