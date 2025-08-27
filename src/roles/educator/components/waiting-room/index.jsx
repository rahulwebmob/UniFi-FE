import { Box, Button, Typography } from '@mui/material'
import Lottie from 'lottie-react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Spinner from '../../../../assets/spinner.json'
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
      void navigate('/dashboard')
    }
  }, [data, isLoading, navigate])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 50px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: (theme) => theme.palette.primary.light,
          borderRadius: '8px',
          padding: { xs: '16px', sm: '32px', md: '48px' },
          boxShadow: 3,
          textAlign: 'center',
          maxWidth: '600px',
          width: '90%',
          '& .lottie svg': {
            height: '150px !important',
          },
        }}
      >
        <Lottie className="lottie" animationData={Spinner} loop />
        <Typography component="p" color="secondary">
          Please wait while we prepare your webinar room...
        </Typography>

        <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleInit()}>
          Join Now
        </Button>
      </Box>
    </Box>
  )
}

WaitingRoom.propTypes = {
  handleInit: PropTypes.func.isRequired,
}

export default WaitingRoom
