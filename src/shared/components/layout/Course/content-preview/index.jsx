import { Box, useTheme } from '@mui/material'
import PropTypes from 'prop-types'

import useAesDecoder from '../../../../../hooks/useAesDecoder'

const CourseContent = ({ type, url }) => {
  const theme = useTheme()

  // Decrypt the URL if it's encrypted
  const decryptedUrl = useAesDecoder(url)

  const renderNormalVideo = () => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.grey[900],
      }}
    >
      <video
        width="100%"
        height="100%"
        src={decryptedUrl}
        controls
        autoPlay
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      >
        <track kind="captions" />
      </video>
    </Box>
  )

  const renderDocument = () => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.grey[100],
      }}
    >
      <iframe
        height="100%"
        width="100%"
        src={decryptedUrl}
        allow="autoplay"
        title="Document Viewer"
        frameBorder="0"
        allowFullScreen
        style={{
          background: 'white',
        }}
      />
    </Box>
  )

  const renderContent = () => {
    switch (type) {
      case 'video':
        return renderNormalVideo()
      case 'doc':
      case 'pdf':
      default:
        return renderDocument()
    }
  }

  return !!decryptedUrl && <Box sx={{ width: '100%', height: '100%' }}>{renderContent()}</Box>
}

CourseContent.propTypes = {
  type: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default CourseContent
