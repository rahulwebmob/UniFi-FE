import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { SelectChangeEvent } from '@mui/material'
import { Box, Select, Tooltip, MenuItem, FormControl } from '@mui/material'

import type { RootState } from '../../../../redux/types'
import { SizeType } from './constants'

interface StrokePickerProps {
  setFunc: (value: number) => void
  options: number[]
  type: string
}

const StrokePicker: React.FC<StrokePickerProps> = ({
  setFunc,
  options,
  type,
}) => {
  const { t } = useTranslation('application')
  const { fontSize, strokeWidth, eraserWidth } = useSelector(
    (state: RootState) => state.education,
  )

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedSize = parseInt(String(event.target.value), 10)
    setFunc(selectedSize)
  }

  const getTooltipTitle = (): string => {
    switch (type) {
      case SizeType.STROKE_WIDTH:
        return t('CONFERENCE.WHITE_BOARD.SELECT_STROKE_WIDTH')
      case SizeType.FONT_SIZE:
        return t('CONFERENCE.WHITE_BOARD.FONT_TOOL')
      case SizeType.ERAZER_WIDTH:
        return t('CONFERENCE.WHITE_BOARD.SELECT_ERASER_SIZE')
      default:
        return t('CONFERENCE.WHITE_BOARD.SELECT_SIZE')
    }
  }

  const getValue = (): number => {
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
            {options.map((size: number) => (
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

export default StrokePicker
