import { Box, Select, Tooltip, MenuItem, FormControl } from '@mui/material'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { SizeType } from './constants'

const StrokePicker = ({ setFunc, options, type }) => {
  const { fontSize, strokeWidth, eraserWidth } = useSelector((state) => state.education)

  const handleChange = (event) => {
    const selectedSize = parseInt(String(event.target.value), 10)
    setFunc(selectedSize)
  }

  const getTooltipTitle = () => {
    switch (type) {
      case SizeType.STROKE_WIDTH:
        return 'Select Stroke Width'
      case SizeType.FONT_SIZE:
        return 'Font Tool'
      case SizeType.ERAZER_WIDTH:
        return 'Select Eraser Size'
      default:
        return 'Select Size'
    }
  }

  const getValue = () => {
    if (type === SizeType.STROKE_WIDTH) {
      return strokeWidth
    }
    if (type === SizeType.FONT_SIZE) {
      return fontSize
    }
    return eraserWidth
  }

  return (
    <Box
      sx={{
        '& .MuiInputBase-root ': {
          background: 'none',
          padding: '0',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        },
      }}
    >
      <FormControl fullWidth>
        <Tooltip title={getTooltipTitle()} arrow placement="top">
          <Select
            labelId="size-select-label"
            id="size-select"
            value={getValue()}
            onChange={handleChange}
          >
            {options.map((size) => (
              <MenuItem key={size} value={size}>
                {size}px
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </FormControl>
    </Box>
  )
}

StrokePicker.propTypes = {
  setFunc: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
}

export default StrokePicker
