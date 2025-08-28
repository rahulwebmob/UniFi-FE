import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import { ControlButton } from '../../styles'

const iff = (condition, then, otherwise) => (condition ? then : otherwise)

const ControlIcon = ({ icon, label, onClick, disabled, isActive = false, isRecording = false }) => (
  <ControlButton
    onClick={onClick}
    disabled={disabled}
    sx={{
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px)',
      },
      '& svg': {
        width: '20px',
        height: '20px',
        stroke: iff(
          isActive && isRecording,
          '#ff4444',
          iff(isActive, '#64b5f6', '#e0e0e0'),
        ),
        strokeWidth: 2,
        transition: 'all 0.2s ease',
      },
      '&:hover svg': {
        stroke: isRecording ? '#ff6b6b' : (isActive ? '#7ec8ff' : '#ffffff'),
        filter: isActive ? 'drop-shadow(0 2px 6px rgba(100, 181, 246, 0.3))' : 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1))',
      },
      '& .MuiTypography-root': {
        fontSize: '11px',
        fontWeight: isActive ? 500 : 400,
        letterSpacing: '0.2px',
        color: iff(
          isActive && isRecording,
          '#ff6b6b',
          iff(isActive, '#64b5f6', '#e0e0e0'),
        ),
        transition: 'all 0.2s ease',
        textAlign: 'center',
      },
      '&:hover .MuiTypography-root': {
        color: isRecording ? '#ff6b6b' : (isActive ? '#7ec8ff' : '#ffffff'),
      },
    }}
  >
    {icon}
    <Typography variant="caption">
      {label}
    </Typography>
  </ControlButton>
)

ControlIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  isRecording: PropTypes.bool,
}

export default ControlIcon
