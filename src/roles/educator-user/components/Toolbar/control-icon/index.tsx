import { type ReactNode } from 'react'

import { Box, Typography } from '@mui/material'

import { ControlButton } from '../../styles'

const iff = (condition: boolean, then: string, otherwise: string): string =>
  condition ? then : otherwise

interface ControlIconProps {
  icon: ReactNode
  label: string
  onClick: () => void
  disabled: boolean
  isActive?: boolean
  isRecording?: boolean
}

const ControlIcon = ({
  icon,
  label,
  onClick,
  disabled,
  isActive = false,
  isRecording = false,
}: ControlIconProps) => (
  <ControlButton
    onClick={onClick}
    disabled={disabled}
    sx={{
      transition: 'all 0.3s ease-in-out',
      '&:hover svg': {
        fill: (theme) =>
          isRecording ? theme.palette.error.main : theme.palette.primary.main,
      },
      '&:hover .MuiTypography-root': {
        color: (theme) =>
          isRecording ? theme.palette.error.main : theme.palette.primary.main,
      },
    }}
  >
    <Box
      textAlign="center"
      sx={{
        svg: {
          fill: (theme) =>
            iff(
              isActive && isRecording,
              theme.palette.error.main,
              iff(
                isActive,
                theme.palette.primary.main,
                theme.palette.grey[500],
              ),
            ) as string,
        },
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="body2"
      sx={{
        minWidth: '80px',
        color: (theme) =>
          iff(
            isActive && isRecording,
            theme.palette.error.main,
            iff(
              isActive,
              theme.palette.primary.main,
              theme.palette.text.secondary,
            ),
          ) as string,
      }}
    >
      {label}
    </Typography>
  </ControlButton>
)

export default ControlIcon
