import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Minus, Square, Circle, Triangle, RectangleHorizontal } from 'lucide-react'

import { Box, Tooltip, IconButton } from '@mui/material'

import { ShapeTypes } from './constants'
import GenerateShape from './generate-shape'

const Shapes = () => {
  const { t } = useTranslation('application')
  const canvas = useSelector((state) => state.education.canvas)
  const { fillColor, strokeColor } = useSelector((state) => state.education)

  return (
    <Box>
      <Tooltip
        title={t('CONFERENCE.WHITE_BOARD.SHAPES.LINE')}
        arrow
        placement="top"
      >
        <IconButton
          onClick={() => {
            GenerateShape(canvas, ShapeTypes.LINE, strokeColor, fillColor)
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
            GenerateShape(canvas, ShapeTypes.SQUARE, strokeColor, fillColor)
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
            GenerateShape(canvas, ShapeTypes.RECTANGLE, strokeColor, fillColor)
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
            GenerateShape(canvas, ShapeTypes.TRIANGLE, strokeColor, fillColor)
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
            GenerateShape(canvas, ShapeTypes.CIRCLE, strokeColor, fillColor)
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
            GenerateShape(canvas, ShapeTypes.OVAL, strokeColor, fillColor)
          }}
        >
          <Circle size={24} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default Shapes
