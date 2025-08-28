import { Box, useTheme } from '@mui/material'
import { VolumeIcon } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'

import { styles } from '../styles'

const WebinarMedia = ({ stream, mediaType, isMirror }) => {
  const theme = useTheme()
  const audioRef = useRef(null)
  const [audioError, setAudioError] = useState(false)

  const setMediaRef = (node) => {
    if (node) {
      if (stream && node.srcObject !== stream) {
        node.srcObject = stream
        node.autoplay = true
        if (mediaType === 'video') {
          node.muted = true
          node.playsInline = true
        }
        node.onloadedmetadata = async () => {
          try {
            await node.play()
            if (mediaType === 'audio') {
              setAudioError(false)
            }
          } catch (error) {
            console.error(`Error playing ${mediaType} stream:`, error)
            if (mediaType === 'audio') {
              setAudioError(true)
            }
          }
        }
      }
    }
  }

  const handleEnableAudio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setAudioError(false)
      } catch (error) {
        console.error('Error enabling audio:', error)
      }
    }
  }

  if (mediaType === 'audio') {
    return (
      <>
        <audio
          ref={(node) => {
            audioRef.current = node
            setMediaRef(node)
          }}
        >
          <track kind="captions" />
        </audio>
        {audioError && (
          <Box
            onClick={handleEnableAudio}
            style={{
              zIndex: 1,
              top: '10px',
              left: '10px',
              cursor: 'pointer',
              position: 'absolute',
            }}
          >
            <VolumeIcon style={{ color: theme.palette.primary.main }} /> Host is speaking – Tap to
            enable audio
          </Box>
        )}
      </>
    )
  }

  return (
    <video
      ref={setMediaRef}
      style={{ ...styles.videoStream, transform: isMirror ? 'scaleX(-1)' : '' }}
    >
      <track kind="captions" />
    </video>
  )
}

WebinarMedia.propTypes = {
  isMirror: PropTypes.bool,
  mediaType: PropTypes.oneOf(['video', 'audio']),
  stream: PropTypes.oneOfType([PropTypes.object]),
}

WebinarMedia.defaultProps = {
  stream: null,
  isMirror: false,
  mediaType: 'video',
}

export default WebinarMedia
