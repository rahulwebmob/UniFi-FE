import { Box, Tooltip, IconButton } from '@mui/material'
import { Minus, Square, Circle, Triangle, RectangleHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'

import { ShapeTypes } from './constants'
import GenerateShape from './generate-shape'

const Shapes = () => {
  const canvasId = useSelector((state) => state.education.canvasId)
  const { fillColor, strokeColor } = useSelector((state) => state.education)

  // Get fabric canvas instance
  const getFabricCanvas = () => {
    if (!canvasId) {
      return null
    }
    return window.__fabric_canvas__ || null
  }

  return (
    <Box>
      <Tooltip title="Line" arrow placement="top">
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) {
              GenerateShape(canvas, ShapeTypes.LINE, strokeColor, fillColor)
            }
          }}
        >
          <Minus size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Square" arrow placement="top">
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) {
              GenerateShape(canvas, ShapeTypes.SQUARE, strokeColor, fillColor)
            }
          }}
        >
          <Square size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Rectangle" arrow placement="top">
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) {
              GenerateShape(canvas, ShapeTypes.RECTANGLE, strokeColor, fillColor)
            }
          }}
        >
          <RectangleHorizontal size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Triangle" arrow placement="top">
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) {
              GenerateShape(canvas, ShapeTypes.TRIANGLE, strokeColor, fillColor)
            }
          }}
        >
          <Triangle size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Circle" arrow placement="top">
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) {
              GenerateShape(canvas, ShapeTypes.CIRCLE, strokeColor, fillColor)
            }
          }}
        >
          <Circle size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Oval" arrow placement="top">
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) {
              GenerateShape(canvas, ShapeTypes.OVAL, strokeColor, fillColor)
            }
          }}
        >
          <Circle size={24} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default Shapes
