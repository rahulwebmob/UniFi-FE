import React from 'react'

import { Box } from '@mui/material'

import useAesDecoder from '../../../../../Hooks/useAesDecoder'

interface ContentPreviewProps {
  type: string
  url: string
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ type, url }) => {
  // Decrypt the URL if it's encrypted
  const decryptedUrl = useAesDecoder(url)

  console.log(url,'url',type)
  const renderNormalVideo = () => (
    <Box
      sx={{
        background: (t) => t.palette.primary.dark,
        p: 1,
        height: 'calc(100vh - 200px)',
      }}
    >
      <video width="100%" height="100%" src={decryptedUrl} controls autoPlay>
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
        src={decryptedUrl}
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

  return !!decryptedUrl && <>{renderContent()}</>
}

export default ContentPreview
