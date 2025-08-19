import { Box, Avatar, Typography } from '@mui/material'
import { User } from 'lucide-react'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'
import { styles, CarouselItem } from '../styles'

const PeerCarouselItem = ({ label }) => (
  <CarouselItem>
    <Box sx={{ ...styles.container }}>
      <Box sx={styles.videoContainer}>
        <Box sx={styles.wrapper}>
          <Avatar alt={label} sx={{ background: (theme) => theme.palette.primary[100] }}>
            <User size={20} />
          </Avatar>
        </Box>
      </Box>
    </Box>
    <Typography variant="body1" sx={styles.label}>
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
