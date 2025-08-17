import { Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'

import { Box, useTheme } from '@mui/material'

import { styles } from '../styles'

interface WebinarMediaProps {
  stream: unknown
  mediaType?: string
  isMirror?: boolean
}

const WebinarMedia = ({
  stream,
  mediaType = 'video',
  isMirror = false,
}: WebinarMediaProps) => {
  const theme = useTheme()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioError, setAudioError] = useState(false)

  const setMediaRef = (node: HTMLVideoElement | HTMLAudioElement | null) => {
    if (node) {
      if (stream && node.srcObject !== stream) {
        node.srcObject = stream as MediaStream
        node.autoplay = true
        if (mediaType === 'video') {
          node.muted = true
          if ('playsInline' in node) {
            ;(node as HTMLVideoElement).playsInline = true
          }
        }
        node.onloadedmetadata = async () => {
          try {
            await node.play()
            if (mediaType === 'audio') setAudioError(false)
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
        await audioRef.current?.play()
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
            onClick={() => {
              void handleEnableAudio()
            }}
            style={{
              zIndex: 1,
              top: '10px',
              left: '10px',
              cursor: 'pointer',
              position: 'absolute',
            }}
          >
            <Volume2 size={16} style={{ color: theme.palette.primary.main }} />{' '}
            Host is speaking – Tap to enable audio
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

export default WebinarMedia
