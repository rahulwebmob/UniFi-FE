import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const LiveBadge = ({ sx = {} }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: (theme) => theme.palette.error.main,
      color: (theme) => theme.palette.error.contrastText,
      px: 1,
      py: 0.3,
      borderRadius: '6px',
      fontSize: (theme) => theme.typography.caption.fontSize,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      zIndex: 10,
      ...sx,
    }}
  >
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: (theme) => theme.palette.common.white,
        animation: 'pulse 1.5s infinite',
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.3 },
          '100%': { opacity: 1 },
        },
      }}
    />
    LIVE
  </Box>
)

LiveBadge.propTypes = {
  sx: PropTypes.object,
}

export default LiveBadge
