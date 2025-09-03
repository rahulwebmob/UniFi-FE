import { Box, Avatar, Typography } from '@mui/material'
import { User } from 'lucide-react'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import LiveBadge from '../../../shared/components/live-badge'

import Peers from './Peers'
import { CarouselItem, VideoPlaceholder, styles } from './styles'
import WebinarMedia from './webinar-media'

const Learning = ({
  isHost = false,
  mediaStatus,
  usersInRoom,
  remoteStream,
  localVideoStream,
  localScreenStream,
}) => {
  const { isFullscreen } = useSelector((state) => state.app)
  const { isVideo: isLocalVideoOn, isScreen: isLocalScreenOn } = mediaStatus
  const producer = remoteStream?.producer || {}
  const areUsersInRoom = !!usersInRoom?.length
  const hasScreen = !!producer?.screen
  const hasVideo = !!producer?.video
  const hasAudio = !!producer?.audio

  const isSecondaryScreen =
    (isHost && isLocalVideoOn && isLocalScreenOn) || (hasVideo && hasScreen && !isHost)

  const renderAvatar = () => (
    <Box sx={styles.wrapper}>
      <Avatar
        alt="Host"
        sx={{
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, #2a2a32 0%, #3a3a45 100%)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <User size={40} style={{ color: '#e0e0e0' }} />
      </Avatar>
    </Box>
  )

  const displayName = useMemo(() => {
    if (isHost) {
      return 'You'
    }
    if (remoteStream?.firstName) {
      return `${remoteStream.firstName}'s screen ( Host )`
    }
    return 'No Host Yet'
  }, [isHost, remoteStream])

  const streamHeight = useMemo(() => {
    if (isFullscreen && areUsersInRoom) {
      return 'calc(100vh - 3200px)'
    }
    if (isFullscreen) {
      return 'calc(100vh - 200px)'
    }
    if (areUsersInRoom) {
      return 'calc(100vh - 360px)'
    }
    return 'calc(100vh - 250px)'
  }, [isFullscreen, areUsersInRoom])

  const renderMainScreen = () => {
    if (isHost && isLocalScreenOn) {
      return <WebinarMedia stream={localScreenStream} />
    }

    if (isHost && isLocalVideoOn) {
      return <WebinarMedia stream={localVideoStream} isMirror />
    }

    if (!isHost && hasScreen) {
      return <WebinarMedia stream={producer?.screen?.stream} />
    }

    if (!isHost && hasVideo) {
      return <WebinarMedia stream={producer?.video?.stream} />
    }

    return renderAvatar()
  }

  const renderSecondaryScreen = () => {
    if (!isSecondaryScreen) {
      return null
    }

    const isLocal = isHost && isLocalVideoOn
    const stream = isLocal ? localVideoStream : producer?.video?.stream
    const label = isLocal ? 'You’re video' : `${remoteStream?.firstName} (Host)`

    return (
      <CarouselItem>
        <Box
          sx={{
            ...styles.container,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Box sx={styles.videoContainer}>
            <WebinarMedia stream={stream} isMirror={isHost && isLocalScreenOn} />
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{
            ...styles.label,
            fontSize: '12px',
          }}
        >
          {label}
        </Typography>
      </CarouselItem>
    )
  }

  return (
    <Box p={2} sx={{ background: 'transparent' }}>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSecondaryScreen ? 'space-between' : 'center',
          marginBottom: 2,
        }}
      >
        {renderSecondaryScreen()}
        {areUsersInRoom && <Peers isHost={isHost} usersInRoom={usersInRoom} />}
      </Box>

      <VideoPlaceholder
        isFullscreen={isFullscreen}
        sx={{
          height: streamHeight,
          position: 'relative',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <LiveBadge />
        <Box sx={styles.container}>
          <Box sx={styles.videoContainer}>
            {hasAudio && (
              <WebinarMedia stream={remoteStream.producer.audio.stream} mediaType="audio" />
            )}

            {renderMainScreen()}
            <Typography
              variant="body2"
              sx={{
                ...styles.label,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              {displayName}
            </Typography>
          </Box>
        </Box>
      </VideoPlaceholder>
    </Box>
  )
}

Learning.propTypes = {
  isHost: PropTypes.bool,
  usersInRoom: PropTypes.oneOfType([PropTypes.object]).isRequired,
  mediaStatus: PropTypes.oneOfType([PropTypes.object]).isRequired,
  remoteStream: PropTypes.oneOfType([PropTypes.object]).isRequired,
  localVideoStream: PropTypes.oneOfType([PropTypes.object]).isRequired,
  localScreenStream: PropTypes.oneOfType([PropTypes.object]).isRequired,
}

export default Learning
