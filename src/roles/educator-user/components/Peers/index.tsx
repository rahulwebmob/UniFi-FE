import { User } from 'lucide-react'
import React, { useMemo } from 'react'

import { Box, Avatar, Typography } from '@mui/material'

import { styles, CarouselItem } from '../styles'
import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'

const PeerCarouselItem = ({ label }) => (
  <CarouselItem>
    <Box sx={{ ...styles.container }}>
      <Box sx={styles.videoContainer}>
        <Box sx={styles.wrapper}>
          <Avatar
            alt={label}
            sx={{ background: (theme) => theme.palette.primary[100] }}
          >
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

export default Peers
