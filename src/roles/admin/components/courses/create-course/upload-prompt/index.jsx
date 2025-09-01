import { Box, Typography, LinearProgress } from '@mui/material'
import { Video } from 'lucide-react'
import PropTypes from 'prop-types'

const UploadPrompt = ({ progress }) => (
  <Box
    elevation={3}
    sx={{
      p: 1,
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
      borderRadius: '10px',
    }}
  >
    <Video size={50} />

    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        component="p"
        sx={{
          color: (theme) => theme.palette.text.primary,
          fontWeight: 600,
          mb: 1,
        }}
      >
        Upload in Progress
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: (theme) => theme.palette.text.secondary,
          mb: 2,
        }}
      >
        Uploading your video. Please don&apos;t perform any action during this process.
      </Typography>
      <Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: '12px',
            borderRadius: '6px',
            '& .MuiLinearProgress-bar': {
              backgroundColor: (theme) => theme.palette.primary.main,
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            textAlign: 'right',
            marginTop: '8px',
          }}
        >
          {`${progress}%`}
        </Typography>
      </Box>
    </Box>
  </Box>
)

UploadPrompt.propTypes = {
  progress: PropTypes.number.isRequired,
}

export default UploadPrompt
