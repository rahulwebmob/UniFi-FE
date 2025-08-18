import { useParams } from 'react-router-dom'

// import Messages from '@Components/Chat/Messages/Messages' // TODO: Messages component needs to be implemented or imported correctly
import { Box, useTheme } from '@mui/material'

// Stub implementation for chat query hook
const useFetchChatsQuery = (...args) => {
  // Mark parameters as used with void operator
  void args
  return {
    isFetching: false,
    data: [],
    error: null,
  }
}

const WebinarRoom = () => {
  const { roomId } = useParams()
  const theme = useTheme()
  const { isFetching } = useFetchChatsQuery(
    {
      roomId,
      isGroup: true,
      isWebinarGroup: true,
    },
    {
      skip: !roomId,
    },
  )

  return (
    !isFetching && (
      <Box
        sx={{
          [theme.breakpoints.down('md')]: { width: '100%' },
          width: '400px',
        }}
      >
        {/* TODO: Messages component needs to be implemented */}
        <div>Webinar chat will be implemented here</div>
      </Box>
    )
  )
}

export default WebinarRoom
