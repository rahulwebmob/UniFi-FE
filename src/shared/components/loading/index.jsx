import { Box, useTheme } from '@mui/material'
import Lottie from 'lottie-react'

import LoadingLogo from '../../../assets/loading-logo.json'

const Loading = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          '& div': {
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          '& svg': {
            maxWidth: '400px',
            g: {
              '.FileLoading': {
                fill: theme.palette.primary.light,
                // stroke: theme.palette.primary.main,
              },
            },
          },
        }}
      >
        <Lottie animationData={LoadingLogo} loop />
      </Box>
    </Box>
  )
}

export default Loading
