import React from 'react'

import { Box } from '@mui/material'

// import useAesDecoder from '../../../../../hooks/useAesDecoder'

interface ContentPreviewProps {
  type: string
  url: string
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ type, url }) => {
  const renderNormalVideo = () => (
    <Box
      sx={{
        background: (t) => t.palette.primary.dark,
        p: 1,
        height: 'calc(100vh - 200px)',
      }}
    >
      <video width="100%" height="100%" src={url} controls autoPlay>
        <track kind="captions" />
      </video>
    </Box>
  )

  const renderDocument = () => (
    <Box
      sx={{
        '&:not(:has(.restrict)) iframe': {
          minHeight: 'auto',
          height: 'calc(100vh - 244px)',
        },
      }}
    >
      <iframe
        height="100%"
        width="100%"
        src={url}
        allow="autoplay"
        title="Unicitizens"
        frameBorder="0"
        allowFullScreen
      />
    </Box>
  )

  const renderContent = () => {
    switch (type) {
      case 'video':
        return renderNormalVideo()
      case 'doc':
      default:
        return renderDocument()
    }
  }

  return !!url && <>{renderContent()}</>
}

export default ContentPreview
