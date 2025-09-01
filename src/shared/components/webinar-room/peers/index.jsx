import { Box, Avatar, Typography } from '@mui/material'
import { User } from 'lucide-react'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'
import { styles, CarouselItem } from '../styles'

const PeerCarouselItem = ({ label }) => (
  <CarouselItem>
    <Box
      sx={{
        ...styles.container,
        position: 'relative',
        padding: '8px',
      }}
    >
      <Box
        sx={{
          ...styles.videoContainer,
          padding: '12px',
        }}
      >
        <Box sx={styles.wrapper}>
          <Avatar
            alt={label}
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #2a2a32 0%, #3a3a45 100%)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            }}
          >
            <User size={20} style={{ color: '#e0e0e0' }} />
          </Avatar>
        </Box>
      </Box>
    </Box>
    <Typography
      variant="body1"
      sx={{
        ...styles.label,
        fontSize: '0.6rem',
      }}
    >
      {label}
    </Typography>
  </CarouselItem>
)

PeerCarouselItem.propTypes = {
  label: PropTypes.string.isRequired,
}

const Peers = ({ usersInRoom, isHost }) => {
  const filteredUsers = useMemo(
    () => usersInRoom.filter((user) => user.role !== 'educator'),
    [usersInRoom],
  )

  return (
    <Box display="flex">
      <Box sx={{ margin: '0 auto' }}>
        <Box
          sx={{
            '& .MuiTabs-root': { display: 'grid' },
            '& .MuiTabs-flexContainer': { display: 'inline-flex' },
          }}
        >
          <MuiCarousel>
            {!isHost && <PeerCarouselItem label="You" />}
            {filteredUsers.map((user) => (
              <PeerCarouselItem key={user._id} label={user.firstName} />
            ))}
          </MuiCarousel>
        </Box>
      </Box>
    </Box>
  )
}

Peers.propTypes = {
  usersInRoom: PropTypes.array.isRequired,
  isHost: PropTypes.bool.isRequired,
}

export default Peers
