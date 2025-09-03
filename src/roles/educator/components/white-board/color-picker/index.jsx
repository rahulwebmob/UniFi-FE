import { Box, Popover, Typography, useTheme } from '@mui/material'
import PropTypes from 'prop-types'

import {
  PREDEFINED_COLORS,
  COLOR_PICKER_WIDTH,
  COLOR_SWATCH_SIZE,
  COLOR_INPUT_FALLBACK,
} from '../constants'

const ColorPicker = ({
  anchorEl,
  open,
  onClose,
  selectedColor,
  onColorSelect,
  showTransparent = false,
}) => {
  const theme = useTheme()

  const handleColorSelect = (color) => {
    onColorSelect(color)
    onClose()
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
    >
      <Box
        sx={{
          p: 2,
          width: COLOR_PICKER_WIDTH,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            color: theme.palette.text.primary,
          }}
        >
          Select Color
        </Typography>
        {showTransparent && (
          <Box
            onClick={() => handleColorSelect('transparent')}
            sx={{
              width: '100%',
              height: 30,
              mb: 1,
              backgroundColor: 'white',
              backgroundImage: `linear-gradient(45deg, ${theme.palette.grey[400]} 25%, transparent 25%), linear-gradient(-45deg, ${theme.palette.grey[400]} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${theme.palette.grey[400]} 75%), linear-gradient(-45deg, transparent 75%, ${theme.palette.grey[400]} 75%)`,
              backgroundSize: '10px 10px',
              backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
              border:
                selectedColor === 'transparent'
                  ? `2px solid ${theme.palette.primary.main}`
                  : `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: theme.palette.text.primary,
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            No Fill
          </Box>
        )}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {PREDEFINED_COLORS.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorSelect(color)}
              sx={{
                width: COLOR_SWATCH_SIZE,
                height: COLOR_SWATCH_SIZE,
                backgroundColor: color,
                border:
                  selectedColor === color
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
          ))}
        </Box>
        <Box
          component="input"
          type="color"
          value={selectedColor === 'transparent' ? COLOR_INPUT_FALLBACK : selectedColor}
          onChange={(e) => handleColorSelect(e.target.value)}
          sx={{
            width: '100%',
            height: 32,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            cursor: 'pointer',
            backgroundColor: theme.palette.background.paper,
          }}
        />
      </Box>
    </Popover>
  )
}

ColorPicker.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  showTransparent: PropTypes.bool,
}

export default ColorPicker
