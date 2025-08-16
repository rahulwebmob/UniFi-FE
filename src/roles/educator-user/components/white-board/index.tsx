import './style.css'

import * as fabric from 'fabric'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Type, Move, Pencil, Trash2, Download, RotateCcw } from 'lucide-react'

import { Box, Tooltip, useTheme, IconButton } from '@mui/material'

import Shapes from './shapes'
import UploadImage from './upload-image'
import ColorPicker from './color-picker'
import StrokePicker from './stroke-picker'
import { ToolBarSection } from '../styles'
import { SizeType, ColorTypes } from './constants'
import useWindowOpen from '../../../../Hooks/useWindowOpen'
import {
  updateCanvas,
  updateStrokeColor,
  updateStrokeWidth,
} from '../../../../redux/reducers/EducationSlice'

let canvas

const WhiteBoardToolbar = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation('application')
  const { strokeColor, eraserWidth, strokeWidth } = useSelector(
    (state) => state.education,
  )
  const [selectedTool, setSelectedTool] = useState('brush')
  const openWindow = useWindowOpen()

  useEffect(() => {
    canvas = new fabric.Canvas('canvas', {
      backgroundColor: 'white',
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
      canvas.dispose()
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
    const activeObjects = canvas.getActiveObjects()
    if (activeObjects.length) {
      activeObjects.forEach((object) => {
        canvas.remove(object)
      })
    }
  }

  const handleClearCanvas = () => {
    canvas.getObjects().forEach((obj) => {
      canvas.remove(obj)
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
      textInput.hiddenTextareaContainer = canvas.lowerCanvasEl.parentNode
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
    const dataURL = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.9,
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
    dispatch(updateCanvas(canvas))
  }, [dispatch])

  return (
    <Box
      className="toolSection"
      sx={{
        background: (thm) => thm.palette.primary.darker,
      }}
    >
      <Box className="toolField" p={1}>
        <ToolBarSection className="brushWidth">
          <Box display="flex">
            <Tooltip
              title={t('application:CONFERENCE.WHITE_BOARD.PENCIL_TOOL')}
              arrow
              placement="top"
            >
              <IconButton
                onClick={() => {
                  dispatch(updateStrokeColor(theme.palette.common.black))
                  canvas.isDrawingMode = true
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
          <Tooltip
            title={t('application:CONFERENCE.WHITE_BOARD.MOVE_TOOL')}
            arrow
            placement="top"
          >
            <IconButton
              onClick={() => {
                canvas.isDrawingMode = false
                setSelectedTool('hand')
              }}
              className={selectedTool === 'hand' ? 'activeTool' : ''}
            >
              <Move size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={t('application:CONFERENCE.WHITE_BOARD.TEXT_TOOL')}
            arrow
            placement="top"
          >
            <IconButton
              onClick={() => {
                handleAddInputField()
              }}
            >
              <Type size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={t('application:CONFERENCE.WHITE_BOARD.DELETE_TOOL')}
            arrow
            placement="top"
          >
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
          <Tooltip
            title={t('application:CONFERENCE.WHITE_BOARD.UPLOAD_IMAGE')}
            arrow
            placement="top"
          >
            <Box component="span">
              <UploadImage canvas={canvas} className="shapeIcon" />
            </Box>
          </Tooltip>
          <Tooltip
            title={t('application:CONFERENCE.WHITE_BOARD.DOWNLOAD')}
            arrow
            placement="top"
          >
            <IconButton
              onClick={() => {
                handleDownload()
              }}
            >
              <Download size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={t('application:CONFERENCE.WHITE_BOARD.CLEAR_CANVAS')}
            arrow
            placement="top"
          >
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
