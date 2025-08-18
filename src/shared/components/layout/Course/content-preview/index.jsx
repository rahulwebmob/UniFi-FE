import { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react'

import { Box, Paper, alpha, Tooltip, useTheme, IconButton } from '@mui/material'

import useAesDecoder from '../../../../../hooks/useAesDecoder'

const ContentPreview = ({ type, url }) => {
  const theme = useTheme()
  const [zoomLevel, setZoomLevel] = useState(100)
  const [rotation, setRotation] = useState(0)

  // Decrypt the URL if it's encrypted
  const decryptedUrl = useAesDecoder(url)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50))
  }

  const handleResetZoom = () => {
    setZoomLevel(100)
    setRotation(0)
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

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
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Zoom Controls */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.5,
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Tooltip title="Zoom Out">
          <IconButton
            size="small"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ZoomOut size={18} />
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            background: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 1,
            minWidth: 60,
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: theme.palette.primary.main,
          }}
        >
          {zoomLevel}%
        </Box>

        <Tooltip title="Zoom In">
          <IconButton
            size="small"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 200}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ZoomIn size={18} />
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            width: 1,
            height: 24,
            background: theme.palette.divider,
            mx: 0.5,
          }}
        />

        <Tooltip title="Rotate">
          <IconButton
            size="small"
            onClick={handleRotate}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <RotateCw size={18} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Reset">
          <IconButton
            size="small"
            onClick={handleResetZoom}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Maximize2 size={18} />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* PDF Viewer Container */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.grey[100],
          '&::-webkit-scrollbar': {
            width: '10px',
            height: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[200],
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[400],
            borderRadius: '5px',
            '&:hover': {
              background: theme.palette.grey[500],
            },
          },
        }}
      >
        <Box
          sx={{
            transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: 'transform 0.3s ease',
            width: zoomLevel > 100 ? `${zoomLevel}%` : '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
              boxShadow:
                zoomLevel > 100 ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
            }}
          />
        </Box>
      </Box>
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

  return (
    !!decryptedUrl && (
      <Box sx={{ width: '100%', height: '100%' }}>{renderContent()}</Box>
    )
  )
}

export default ContentPreview
