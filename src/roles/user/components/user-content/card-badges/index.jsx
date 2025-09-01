import { Box, Typography } from '@mui/material'
import { Crown, Gift, Star } from 'lucide-react'
import PropTypes from 'prop-types'

const BaseBadge = ({ children, backgroundColor, color, icon, sx = {} }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor,
      color,
      px: 1.2,
      py: 0.4,
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      ...sx,
    }}
  >
    {icon}
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        fontSize: '0.7rem',
      }}
    >
      {children}
    </Typography>
  </Box>
)

BaseBadge.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.node,
  sx: PropTypes.object,
}

export const FreeBadge = ({ sx = {} }) => (
  <BaseBadge
    backgroundColor={(theme) => theme.palette.success.main}
    color={(theme) => theme.palette.success.contrastText}
    icon={<Gift size={14} />}
    sx={sx}
  >
    FREE
  </BaseBadge>
)

FreeBadge.propTypes = {
  sx: PropTypes.object,
}

export const OwnedBadge = ({ sx = {} }) => (
  <BaseBadge
    backgroundColor={(theme) => theme.palette.accent.golden}
    color="#000"
    icon={<Crown size={14} />}
    sx={sx}
  >
    OWNED
  </BaseBadge>
)

OwnedBadge.propTypes = {
  sx: PropTypes.object,
}

export const PremiumBadge = ({ sx = {} }) => (
  <BaseBadge
    backgroundColor={(theme) => theme.palette.info.main}
    color={(theme) => theme.palette.info.contrastText}
    icon={<Star size={14} />}
    sx={sx}
  >
    PREMIUM
  </BaseBadge>
)

PremiumBadge.propTypes = {
  sx: PropTypes.object,
}

export const LiveBadge = ({ sx = {} }) => {
  const pulsingDot = (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: '#fff',
        animation: 'pulse 1.5s infinite',
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.3 },
          '100%': { opacity: 1 },
        },
      }}
    />
  )

  return (
    <BaseBadge
      backgroundColor={(theme) => theme.palette.error.main}
      color={(theme) => theme.palette.error.contrastText}
      icon={pulsingDot}
      sx={sx}
    >
      LIVE
    </BaseBadge>
  )
}

LiveBadge.propTypes = {
  sx: PropTypes.object,
}
