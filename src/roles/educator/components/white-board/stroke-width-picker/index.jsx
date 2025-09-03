import { Box, Popover, Slider, Typography, useTheme } from '@mui/material'
import PropTypes from 'prop-types'

import { STROKE_PICKER_WIDTH, MIN_STROKE_WIDTH, MAX_STROKE_WIDTH } from '../constants'

const StrokeWidthPicker = ({ anchorEl, open, onClose, strokeWidth, onStrokeWidthChange }) => {
  const theme = useTheme()

  const handleChange = (event, newValue) => {
    onStrokeWidthChange(newValue)
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      slotProps={{
        paper: {
          sx: {
            mt: -1,
          },
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          width: STROKE_PICKER_WIDTH,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            color: theme.palette.text.primary,
          }}
        >
          Stroke Width: {strokeWidth}px
        </Typography>
        <Slider
          value={strokeWidth}
          onChange={handleChange}
          min={MIN_STROKE_WIDTH}
          max={MAX_STROKE_WIDTH}
        />
      </Box>
    </Popover>
  )
}

StrokeWidthPicker.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  onStrokeWidthChange: PropTypes.func.isRequired,
}

export default StrokeWidthPicker
