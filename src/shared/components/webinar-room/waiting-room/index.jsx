import { Box, Button, Typography, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useGetParticularWebinarDetailQuery } from '../../../../services/education'

const WaitingRoom = ({ handleInit }) => {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useGetParticularWebinarDetailQuery(
    { webinarId: roomId },
    { skip: !roomId },
  )

  useEffect(() => {
    const webinarData = data
    if (!isLoading && !webinarData?.data?.webinarScheduledObj?.can_join) {
      navigate('/dashboard')
    }
  }, [data, isLoading, navigate])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 300px)',
      }}
    >
      <Box
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 1,
          backgroundColor: (theme) => theme.palette.background.light,
          boxShadow: (theme) => theme.customShadows.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <CircularProgress
            size={40}
            thickness={4}
            sx={{
              color: 'primary.main',
            }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5,
          }}
        >
          Getting Ready
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4,
          }}
        >
          We&apos;re preparing your webinar room. This will just take a moment.
        </Typography>

        <Button variant="contained" size="large" onClick={() => handleInit()}>
          Join Webinar
        </Button>
      </Box>
    </Box>
  )
}

WaitingRoom.propTypes = {
  handleInit: PropTypes.func.isRequired,
}

export default WaitingRoom
