import { Person } from '@mui/icons-material'
import { Box, Avatar, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import LiveBadge from '../../../shared/components/live-badge'

import Peers from './Peers'
import { CarouselItem, VideoPlaceholder, styles } from './styles'
import WebinarMedia from './webinar-media'

const Learning = ({
  isHost,
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
          background: (theme) => theme.palette.primary.light100,
        }}
      >
        <Person />
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
      return 'calc(100vh - 270px)'
    }
    if (isFullscreen) {
      return 'calc(100vh - 150px)'
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
        <Box sx={styles.container}>
          <Box sx={styles.videoContainer}>
            <WebinarMedia stream={stream} isMirror={isHost && isLocalScreenOn} />
          </Box>
        </Box>
        <Typography variant="body1" sx={styles.label}>
          {label}
        </Typography>
      </CarouselItem>
    )
  }

  return (
    <Box p={1}>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSecondaryScreen ? 'space-between' : 'center',
        }}
      >
        {renderSecondaryScreen()}
        {areUsersInRoom && <Peers isHost={isHost} usersInRoom={usersInRoom} />}
      </Box>

      <VideoPlaceholder
        isFullscreen={isFullscreen}
        sx={{ height: streamHeight, position: 'relative' }}
      >
        <LiveBadge />
        <Box sx={styles.container}>
          <Box sx={styles.videoContainer}>
            {hasAudio && (
              <WebinarMedia stream={remoteStream.producer.audio.stream} mediaType="audio" />
            )}

            {renderMainScreen()}
            <Typography variant="p" sx={styles.label}>
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

Learning.defaultProps = {
  isHost: false,
}

export default Learning
