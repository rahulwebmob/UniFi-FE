import React, { useRef } from 'react'
import { Paintbrush } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, InputBase } from '@mui/material'

import { ColorTypes } from './constants'
import {
  updateFillColor,
  updateStrokeColor,
} from '../../../../redux/reducers/education-slice'

const ColorPicker = ({ type }) => {
  const colorInputRef = useRef(null)
  const dispatch = useDispatch()
  const { fillColor, strokeColor } = useSelector((state) => state.education)

  const handleColorChange = (e) => {
    if (type === ColorTypes.FILL_COLOR) {
      dispatch(updateFillColor(e.target.value))
    } else {
      dispatch(updateStrokeColor(e.target.value))
    }
  }

  const handleBoxClick = () => {
    colorInputRef.current.click()
  }

  return (
    <Box display="flex" alignItems="center">
      {type === ColorTypes.FILL_COLOR && <Paintbrush size={20} />}
      <InputBase
        inputRef={colorInputRef}
        type="color"
        value={type === ColorTypes.FILL_COLOR ? fillColor : strokeColor}
        onClick={handleBoxClick}
        onChange={handleColorChange}
        sx={{
          marginLeft: '3px',
          width: '30px',
          background: 'none',
        }}
      />
    </Box>
  )
}

export default ColorPicker
