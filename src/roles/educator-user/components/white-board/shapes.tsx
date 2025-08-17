import * as fabric from 'fabric'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Minus,
  Square,
  Circle,
  Triangle,
  RectangleHorizontal,
} from 'lucide-react'

import { Box, Tooltip, IconButton } from '@mui/material'

import { ShapeTypes } from './constants'
import GenerateShape from './generate-shape'
import type { RootState } from '../../../../redux/types'

const Shapes = () => {
  const { t } = useTranslation('application')
  const canvasId = useSelector((state: RootState) => state.education.canvasId)
  const { fillColor, strokeColor } = useSelector((state: RootState) => state.education)
  
  // Get fabric canvas instance
  const getFabricCanvas = () => {
    if (!canvasId) return null
    return (window as unknown as { __fabric_canvas__?: fabric.Canvas }).__fabric_canvas__ || null
  }

  return (
    <Box>
      <Tooltip
        title={t('CONFERENCE.WHITE_BOARD.SHAPES.LINE')}
        arrow
        placement="top"
      >
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) GenerateShape(canvas as unknown as fabric.Canvas, ShapeTypes.LINE, strokeColor, fillColor)
          }}
        >
          <Minus size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={t('CONFERENCE.WHITE_BOARD.SHAPES.SQUARE')}
        arrow
        placement="top"
      >
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) GenerateShape(canvas as unknown as fabric.Canvas, ShapeTypes.SQUARE, strokeColor, fillColor)
          }}
        >
          <Square size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={t('CONFERENCE.WHITE_BOARD.SHAPES.RECTANGLE')}
        arrow
        placement="top"
      >
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) GenerateShape(canvas as unknown as fabric.Canvas, ShapeTypes.RECTANGLE, strokeColor, fillColor)
          }}
        >
          <RectangleHorizontal size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={t('CONFERENCE.WHITE_BOARD.SHAPES.TRIANGLE')}
        arrow
        placement="top"
      >
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) GenerateShape(canvas as unknown as fabric.Canvas, ShapeTypes.TRIANGLE, strokeColor, fillColor)
          }}
        >
          <Triangle size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={t('CONFERENCE.WHITE_BOARD.SHAPES.CIRCLE')}
        arrow
        placement="top"
      >
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) GenerateShape(canvas as unknown as fabric.Canvas, ShapeTypes.CIRCLE, strokeColor, fillColor)
          }}
        >
          <Circle size={24} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={t('CONFERENCE.WHITE_BOARD.SHAPES.OVAL')}
        arrow
        placement="top"
      >
        <IconButton
          onClick={() => {
            const canvas = getFabricCanvas()
            if (canvas) GenerateShape(canvas as unknown as fabric.Canvas, ShapeTypes.OVAL, strokeColor, fillColor)
          }}
        >
          <Circle size={24} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default Shapes
