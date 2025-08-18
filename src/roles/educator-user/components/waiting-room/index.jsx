import Lottie from 'lottie-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'

import { Box, Button, Typography } from '@mui/material'

import Spinner from '../../../../assets/spinner.json'
import { useGetParticularWebinarDetailQuery } from '../../../../services/education'

const WaitingRoom = ({ handleInit }) => {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const { t } = useTranslation('education')

  const { data, isLoading } = useGetParticularWebinarDetailQuery(
    { webinarId: roomId },
    { skip: !roomId },
  )

  useEffect(() => {
    const webinarData = data
    if (!isLoading && !webinarData?.data?.webinarScheduledObj?.can_join)
      void navigate('/dashboard')
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
          {t('EDUCATION_DASHBOARD.MAIN_PAGE.WAITING_ROOM')}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => handleInit()}
        >
          {t('EDUCATION_DASHBOARD.COMMON_KEYS.JOIN_NOW')}
        </Button>
      </Box>
    </Box>
  )
}

export default WaitingRoom
