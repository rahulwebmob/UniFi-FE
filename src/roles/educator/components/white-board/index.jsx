import './style.css'

import { Box, Tooltip, useTheme, IconButton } from '@mui/material'
import * as fabric from 'fabric'
import { Type, Move, Pencil, Trash2, Download, RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useWindowOpen from '../../../../hooks/useWindowOpen'
import {
  updateCanvasId,
  updateStrokeColor,
  updateStrokeWidth,
} from '../../../../redux/reducers/education-slice'
import { ToolBarSection } from '../styles'

import ColorPicker from './color-picker'
import { SizeType, ColorTypes } from './constants'
import Shapes from './shapes'
import StrokePicker from './stroke-picker'
import UploadImage from './upload-image'

let canvas = null

const WhiteBoardToolbar = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { strokeColor, eraserWidth, strokeWidth } = useSelector((state) => state.education)
  const [selectedTool, setSelectedTool] = useState('brush')
  const openWindow = useWindowOpen()

  useEffect(() => {
    canvas = new fabric.Canvas('canvas', {
      backgroundColor: (theme) => theme.palette.background.paper,
    })

    canvas.isDrawingMode = true
    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
    }
    canvas.freeDrawingBrush.color = strokeColor
    canvas.setHeight(window.innerHeight * 0.75)
    canvas.setWidth(window.innerWidth * 0.6)
    canvas.freeDrawingBrush.width = strokeWidth

    return () => {
      canvas?.dispose()
    }
  }, [strokeWidth, strokeColor])

  useEffect(() => {
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = strokeWidth
    }
  }, [strokeWidth])

  useEffect(() => {
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = strokeColor
    }
  }, [strokeColor])

  useEffect(() => {
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = eraserWidth
    }
  }, [eraserWidth])

  const handleDeleteObject = () => {
    if (!canvas) {
      return
    }
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length) {
      activeObjects.forEach((object) => {
        canvas?.remove(object)
      })
    }
  }

  const handleClearCanvas = () => {
    if (!canvas) {
      return
    }
    canvas.getObjects().forEach((obj) => {
      canvas?.remove(obj)
    })
    canvas.renderAll()
  }

  const handleAddInputField = () => {
    if (canvas) {
      canvas.isDrawingMode = false
      const textInput = new fabric.IText('Type Here', {
        left: 50,
        top: 50,
        fontSize: 30,
        fontFamily: 'arial black',
      })
      textInput.hiddenTextareaContainer = canvas.lowerCanvasEl?.parentNode
      canvas.add(textInput)
      canvas.setActiveObject(textInput)
      textInput.enterEditing()
      textInput.selectAll()

      setTimeout(() => {
        if (textInput.hiddenTextarea) {
          textInput.hiddenTextarea.focus()
        }
      }, 0)
    }
  }

  const handleDownload = () => {
    if (!canvas) {
      return
    }
    const dataURL = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.9,
      multiplier: 1,
    })
    const imageLink = document.createElement('a')
    if (typeof imageLink.download === 'string') {
      imageLink.href = dataURL
      imageLink.download = 'canvas.jpg'
      document.body.appendChild(imageLink)
      imageLink.click()
      document.body.removeChild(imageLink)
    } else {
      openWindow(dataURL)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete') {
        handleDeleteObject()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    dispatch(updateCanvasId(canvas?.toJSON() || null))
  }, [dispatch])

  return (
    <Box
      className="toolSection"
      sx={{
        background: (thm) => thm.palette.primary.dark,
      }}
    >
      <Box className="toolField" p={1}>
        <ToolBarSection className="brushWidth">
          <Box display="flex">
            <Tooltip title="Pencil Tool" arrow placement="top">
              <IconButton
                onClick={() => {
                  dispatch(updateStrokeColor(theme.palette.text.primary))
                  if (canvas) {
                    canvas.isDrawingMode = true
                  }
                  setSelectedTool('brush')
                }}
                className={selectedTool === 'brush' ? 'activeTool' : ''}
                sx={{ p: 0 }}
              >
                <Pencil size={24} />
              </IconButton>
            </Tooltip>
            <ColorPicker type={ColorTypes.STROKE_COLOR} />
          </Box>
          <StrokePicker
            setFunc={updateStrokeWidth}
            type={SizeType.STROKE_WIDTH}
            options={[1, 5, 10, 15, 20, 25]}
          />
        </ToolBarSection>
        <ToolBarSection>
          <Tooltip title="Move Tool" arrow placement="top">
            <IconButton
              onClick={() => {
                if (canvas) {
                  canvas.isDrawingMode = false
                }
                setSelectedTool('hand')
              }}
              className={selectedTool === 'hand' ? 'activeTool' : ''}
            >
              <Move size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Text Tool" arrow placement="top">
            <IconButton
              onClick={() => {
                handleAddInputField()
              }}
            >
              <Type size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Tool" arrow placement="top">
            <IconButton
              color="error"
              onClick={() => {
                handleDeleteObject()
              }}
            >
              <Trash2 size={24} />
            </IconButton>
          </Tooltip>
        </ToolBarSection>
        <ToolBarSection>
          <Shapes />
        </ToolBarSection>
        <ToolBarSection>
          <Tooltip title="Upload Image" arrow placement="top">
            <Box component="span">
              <UploadImage />
            </Box>
          </Tooltip>
          <Tooltip title="Download" arrow placement="top">
            <IconButton
              onClick={() => {
                handleDownload()
              }}
            >
              <Download size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear Canvas" arrow placement="top">
            <IconButton
              onClick={() => {
                handleClearCanvas()
              }}
              color="warning"
            >
              <RotateCcw size={24} />
            </IconButton>
          </Tooltip>
        </ToolBarSection>
      </Box>
    </Box>
  )
}

const WhiteBoard = () => (
  <Box className="whiteboard">
    <WhiteBoardToolbar />
    <Box sx={{ width: '100%' }}>
      <Box className="canvasField">
        <canvas id="canvas" style={{ width: '100%' }} />
      </Box>
    </Box>
  </Box>
)

export default WhiteBoard
