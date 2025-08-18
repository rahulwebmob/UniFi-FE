import * as fabric from 'fabric'

import { ShapeTypes } from './constants'

const GenerateShape = (
  canvas,
  shape,
  strokeColor,
  fillColor,
  isHollow = true,
) => {
  canvas.isDrawingMode = false
  const strokeWidth = 5
  const fillValue = isHollow ? 'transparent' : fillColor

  if (shape === ShapeTypes.LINE) {
    const line = new fabric.Line([50, 100, 200, 200], {
      stroke: strokeColor,
      strokeWidth,
    })
    canvas.add(line)
  } else if (shape === ShapeTypes.SQUARE) {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: fillValue,
      width: 60,
      height: 60,
      angle: 90,
      stroke: strokeColor,
      strokeWidth,
    })
    canvas.add(rect)
  } else if (shape === ShapeTypes.RECTANGLE) {
    const rectangle = new fabric.Rect({
      left: 150,
      top: 150,
      fill: fillValue,
      width: 120,
      height: 60,
      stroke: strokeColor,
      strokeWidth,
    })
    canvas.add(rectangle)
  } else if (shape === ShapeTypes.TRIANGLE) {
    const triangle = new fabric.Triangle({
      left: 200,
      top: 150,
      fill: fillValue,
      width: 60,
      height: 60,
      stroke: strokeColor,
      strokeWidth,
    })
    canvas.add(triangle)
  } else if (shape === ShapeTypes.CIRCLE) {
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      stroke: strokeColor,
      strokeWidth,
      fill: fillValue,
    })
    canvas.add(circle)
  } else if (shape === ShapeTypes.OVAL) {
    const oval = new fabric.Ellipse({
      left: 100,
      top: 100,
      rx: 80,
      ry: 50,
      stroke: strokeColor,
      strokeWidth,
      fill: fillValue,
    })
    canvas.add(oval)
  }
}

export default GenerateShape
