import { Box, Typography, IconButton, useTheme } from '@mui/material'
import { Canvas, IText, Rect, Circle, Triangle, Line, PencilBrush, Image as FImage } from 'fabric'
import { ArrowLeft } from 'lucide-react'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'

import ColorPicker from './color-picker'
import {
  DEFAULT_COLOR,
  DEFAULT_FILL_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_TEXT_FONT_SIZE,
  TEXT_DEFAULT_LEFT,
  TEXT_DEFAULT_TOP,
  CANVAS_MIN_WIDTH,
  CANVAS_MIN_HEIGHT,
  CANVAS_RESIZE_DELAY,
  IMAGE_SCALE_FACTOR,
  ERASER_WIDTH_MULTIPLIER,
  ICON_SIZE_MEDIUM,
  TOOLBAR_Z_INDEX,
  TOOL_IDS,
} from './constants'
import StrokeWidthPicker from './stroke-width-picker'
import TextInputModal from './text-input-modal'
import WhiteboardCanvas from './whiteboard-canvas'
import WhiteboardToolbar from './whiteboard-toolbar'

const Whiteboard = ({ onClose }) => {
  const theme = useTheme()
  const canvasRef = useRef(null)
  const fabricRef = useRef(null)
  const containerRef = useRef(null)
  const textModalRef = useRef(null)
  const fileInputRef = useRef(null)

  const [selectedTool, setSelectedTool] = useState(TOOL_IDS.SELECT)
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [fillColor, setFillColor] = useState(DEFAULT_FILL_COLOR)
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH)
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null)
  const [fillPickerAnchor, setFillPickerAnchor] = useState(null)
  const [strokePickerAnchor, setStrokePickerAnchor] = useState(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || fabricRef.current) {
      return
    }

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const width = rect.width || window.innerWidth - 100
    const height = rect.height || window.innerHeight * 0.7

    canvasRef.current.width = width
    canvasRef.current.height = height

    let canvas
    try {
      canvas = new Canvas(canvasRef.current, {
        backgroundColor: 'transparent',
        selection: true,
        preserveObjectStacking: true,
        width,
        height,
        stopContextMenu: true,
        fireRightClick: false,
      })
    } catch (error) {
      console.error('Failed to initialize Fabric.js canvas:', error)
      return
    }

    const updateCanvasSize = () => {
      if (!container || !canvas) {
        return
      }

      try {
        const newRect = container.getBoundingClientRect()
        const newWidth = Math.max(newRect.width || CANVAS_MIN_WIDTH, CANVAS_MIN_WIDTH)
        const newHeight = Math.max(newRect.height || CANVAS_MIN_HEIGHT, CANVAS_MIN_HEIGHT)

        if (canvas && canvas.setWidth && canvas.setHeight && canvas.lower && canvas.lower.el) {
          canvas.setWidth(newWidth)
          canvas.setHeight(newHeight)
          canvas.calcOffset()
          canvas.renderAll()
        }
      } catch (error) {
        console.warn('Canvas resize error:', error)
      }
    }

    // Delay the initial resize to ensure canvas is fully initialized
    setTimeout(() => {
      if (canvas && canvas.lower && canvas.lower.el) {
        updateCanvasSize()
      }
    }, CANVAS_RESIZE_DELAY)
    window.addEventListener('resize', updateCanvasSize)

    fabricRef.current = canvas

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      canvas.dispose()
      fabricRef.current = null
    }
  }, [])

  const handleTextModalOpen = useCallback(() => {
    textModalRef.current?.openModal()
  }, [])

  const handleAddText = useCallback(
    (text, isEditingText, textObj) => {
      if (!fabricRef.current) {
        return
      }

      if (isEditingText && textObj) {
        textObj.set('text', text)
        fabricRef.current.renderAll()
      } else {
        const newTextObj = new IText(text, {
          left: TEXT_DEFAULT_LEFT,
          top: TEXT_DEFAULT_TOP,
          fontSize: DEFAULT_TEXT_FONT_SIZE,
          fill: color,
          editable: true,
        })

        newTextObj.on('mousedblclick', () => {
          textModalRef.current?.setTextInput(newTextObj.text)
          textModalRef.current?.setIsEditing(true)
          textModalRef.current?.setTextObject(newTextObj)
          handleTextModalOpen()
        })

        fabricRef.current.add(newTextObj)
        fabricRef.current.setActiveObject(newTextObj)
        fabricRef.current.renderAll()
      }
    },
    [color, handleTextModalOpen],
  )

  const handleToolSelect = useCallback((tool) => {
    setSelectedTool(tool)
  }, [])

  const handleColorClick = useCallback((e) => {
    setColorPickerAnchor(e.currentTarget)
  }, [])

  const handleColorSelect = useCallback((newColor) => {
    setColor(newColor)
    setColorPickerAnchor(null)
  }, [])

  const handleFillToggle = useCallback((e) => {
    setFillPickerAnchor(e.currentTarget)
  }, [])

  const handleFillColorSelect = useCallback((newColor) => {
    setFillColor(newColor)
    setFillPickerAnchor(null)
  }, [])

  const handleStrokeClick = useCallback((e) => {
    setStrokePickerAnchor(e.currentTarget)
  }, [])

  const handleStrokeWidthChange = useCallback((newWidth) => {
    setStrokeWidth(newWidth)
  }, [])

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result
      const canvas = fabricRef.current

      if (!canvas) {
        return
      }

      // Direct approach - create an Image element first
      const imgElement = new window.Image()

      imgElement.onload = () => {
        try {
          // Create FabricImage from the loaded image element
          const fabricImg = new FImage(imgElement)

          // Calculate scale to fit
          const maxWidth = canvas.width * IMAGE_SCALE_FACTOR
          const maxHeight = canvas.height * IMAGE_SCALE_FACTOR
          const scaleX = maxWidth / imgElement.width
          const scaleY = maxHeight / imgElement.height
          const scale = Math.min(scaleX, scaleY, 1)

          // Configure the image
          fabricImg.set({
            scaleX: scale,
            scaleY: scale,
            left: (canvas.width - imgElement.width * scale) / 2,
            top: (canvas.height - imgElement.height * scale) / 2,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          })

          // Add to canvas
          canvas.add(fabricImg)
          canvas.setActiveObject(fabricImg)
          canvas.renderAll()
        } catch {
          //
        }
      }

      // Set the source to trigger load
      imgElement.src = dataUrl
    }

    reader.readAsDataURL(file)

    // Reset input
    e.target.value = ''
  }, [])

  const handleDownload = useCallback(() => {
    if (!fabricRef.current) {
      return
    }

    const canvas = fabricRef.current

    const originalBg = canvas.backgroundColor

    canvas.backgroundColor = 'white'
    canvas.renderAll()
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    })

    canvas.backgroundColor = originalBg
    canvas.renderAll()

    if (dataURL) {
      const link = document.createElement('a')
      link.download = `whiteboard-${Date.now()}.png`
      link.href = dataURL
      link.click()
    }
  }, [])

  const handleClear = useCallback(() => {
    if (!fabricRef.current) {
      return
    }
    fabricRef.current.clear()
    fabricRef.current.backgroundColor = 'transparent'
    fabricRef.current.renderAll()
  }, [])

  // Setup drawing tools
  const setupRectangle = useCallback(() => {
    if (!fabricRef.current) {
      return
    }
    const canvas = fabricRef.current
    let rect, isDown, origX, origY

    canvas.on('mouse:down', (o) => {
      if (o.target) {
        return
      }
      isDown = true
      const pointer = canvas.getPointer(o.e)
      origX = pointer.x
      origY = pointer.y
      rect = new Rect({
        left: origX,
        top: origY,
        fill: fillColor === 'transparent' ? '' : fillColor,
        stroke: color,
        strokeWidth,
        width: 0,
        height: 0,
        selectable: false,
      })
      canvas.add(rect)
    })

    canvas.on('mouse:move', (o) => {
      if (!isDown) {
        return
      }
      const pointer = canvas.getPointer(o.e)
      const width = Math.abs(origX - pointer.x)
      const height = Math.abs(origY - pointer.y)
      rect.set({
        width,
        height,
        left: Math.min(origX, pointer.x),
        top: Math.min(origY, pointer.y),
      })
      canvas.renderAll()
    })

    canvas.on('mouse:up', () => {
      if (rect) {
        rect.setCoords()
        rect.set({ selectable: true })
      }
      isDown = false
    })
  }, [color, strokeWidth, fillColor])

  const setupCircle = useCallback(() => {
    if (!fabricRef.current) {
      return
    }
    const canvas = fabricRef.current
    let circle, isDown, origX, origY

    canvas.on('mouse:down', (o) => {
      if (o.target) {
        return
      }
      isDown = true
      const pointer = canvas.getPointer(o.e)
      origX = pointer.x
      origY = pointer.y
      circle = new Circle({
        left: origX,
        top: origY,
        fill: fillColor === 'transparent' ? '' : fillColor,
        stroke: color,
        strokeWidth,
        radius: 0,
        selectable: false,
      })
      canvas.add(circle)
    })

    canvas.on('mouse:move', (o) => {
      if (!isDown) {
        return
      }
      const pointer = canvas.getPointer(o.e)
      const radius = Math.sqrt(Math.pow(origX - pointer.x, 2) + Math.pow(origY - pointer.y, 2)) / 2
      circle.set({
        radius,
        left: Math.min(origX, pointer.x),
        top: Math.min(origY, pointer.y),
      })
      canvas.renderAll()
    })

    canvas.on('mouse:up', () => {
      if (circle) {
        circle.setCoords()
        circle.set({ selectable: true })
      }
      isDown = false
    })
  }, [color, strokeWidth, fillColor])

  const setupTriangle = useCallback(() => {
    if (!fabricRef.current) {
      return
    }
    const canvas = fabricRef.current
    let triangle, isDown, origX, origY

    canvas.on('mouse:down', (o) => {
      if (o.target) {
        return
      }
      isDown = true
      const pointer = canvas.getPointer(o.e)
      origX = pointer.x
      origY = pointer.y
      triangle = new Triangle({
        left: origX,
        top: origY,
        fill: fillColor === 'transparent' ? '' : fillColor,
        stroke: color,
        strokeWidth,
        width: 0,
        height: 0,
        selectable: false,
      })
      canvas.add(triangle)
    })

    canvas.on('mouse:move', (o) => {
      if (!isDown) {
        return
      }
      const pointer = canvas.getPointer(o.e)
      const width = Math.abs(origX - pointer.x)
      const height = Math.abs(origY - pointer.y)
      triangle.set({
        width,
        height,
        left: Math.min(origX, pointer.x),
        top: Math.min(origY, pointer.y),
      })
      canvas.renderAll()
    })

    canvas.on('mouse:up', () => {
      if (triangle) {
        triangle.setCoords()
        triangle.set({ selectable: true })
      }
      isDown = false
    })
  }, [color, strokeWidth, fillColor])

  const setupLine = useCallback(() => {
    if (!fabricRef.current) {
      return
    }
    const canvas = fabricRef.current
    let line, isDown

    canvas.on('mouse:down', (o) => {
      if (o.target) {
        return
      }
      isDown = true
      const pointer = canvas.getPointer(o.e)
      const points = [pointer.x, pointer.y, pointer.x, pointer.y]
      line = new Line(points, {
        stroke: color,
        strokeWidth,
        selectable: false,
      })
      canvas.add(line)
    })

    canvas.on('mouse:move', (o) => {
      if (!isDown) {
        return
      }
      const pointer = canvas.getPointer(o.e)
      line.set({ x2: pointer.x, y2: pointer.y })
      canvas.renderAll()
    })

    canvas.on('mouse:up', () => {
      if (line) {
        line.setCoords()
        line.set({ selectable: true })
      }
      isDown = false
    })
  }, [color, strokeWidth])

  const setupText = useCallback(() => {
    if (!fabricRef.current) {
      return
    }
    const canvas = fabricRef.current

    canvas.on('mouse:down', (o) => {
      if (!o.target) {
        handleTextModalOpen()
      }
    })
  }, [handleTextModalOpen])

  // Handle tool changes
  useEffect(() => {
    if (!fabricRef.current) {
      return
    }
    const canvas = fabricRef.current

    canvas.isDrawingMode = false
    canvas.selection = false
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')

    canvas.getObjects().forEach((obj) => {
      obj.off('mousedown')
    })

    switch (selectedTool) {
      case TOOL_IDS.SELECT:
        canvas.selection = true
        canvas.getObjects().forEach((obj) => {
          if (obj.type === 'i-text') {
            // Remove any existing listeners
            obj.off('mousedblclick')
            // Add double-click listener for editing
            obj.on('mousedblclick', () => {
              textModalRef.current?.setTextInput(obj.text)
              textModalRef.current?.setIsEditing(true)
              textModalRef.current?.setTextObject(obj)
              handleTextModalOpen()
            })
          }
        })
        break

      case TOOL_IDS.PEN:
        canvas.isDrawingMode = true
        canvas.freeDrawingBrush = new PencilBrush(canvas)
        canvas.freeDrawingBrush.width = strokeWidth
        canvas.freeDrawingBrush.color = color
        break

      case TOOL_IDS.ERASER:
        canvas.isDrawingMode = true
        canvas.freeDrawingBrush = new PencilBrush(canvas)
        canvas.freeDrawingBrush.width = strokeWidth * ERASER_WIDTH_MULTIPLIER
        canvas.freeDrawingBrush.color = 'white'
        break

      case TOOL_IDS.RECTANGLE:
        setupRectangle()
        break

      case TOOL_IDS.CIRCLE:
        setupCircle()
        break

      case TOOL_IDS.TRIANGLE:
        setupTriangle()
        break

      case TOOL_IDS.LINE:
        setupLine()
        break

      case TOOL_IDS.TEXT:
        setupText()
        break

      default:
        break
    }
  }, [
    selectedTool,
    color,
    strokeWidth,
    setupRectangle,
    setupCircle,
    setupTriangle,
    setupLine,
    setupText,
    handleTextModalOpen,
  ])

  return (
    <Box
      sx={{
        maxWidth: 'calc(100vw - 32px)',
        height: '80vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 2,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton
          sx={{
            mr: 2,
            color: theme.palette.text.primary,
          }}
          onClick={onClose}
          aria-label="Go back to dashboard"
        >
          <ArrowLeft size={ICON_SIZE_MEDIUM} />
        </IconButton>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Whiteboard
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mt: 0.5,
            }}
          >
            Your digital whiteboard for every lesson.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: 'calc(100% - 95px)',
          width: '100%',
        }}
      >
        <WhiteboardCanvas ref={canvasRef} containerRef={containerRef} />

        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: TOOLBAR_Z_INDEX,
            width: 'calc(100% - 10px)',
            maxWidth: '800px',
            display: 'flex',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <WhiteboardToolbar
            selectedTool={selectedTool}
            onToolSelect={handleToolSelect}
            onColorClick={handleColorClick}
            onFillToggle={handleFillToggle}
            onStrokeClick={handleStrokeClick}
            onUpload={handleUpload}
            onDownload={handleDownload}
            onClear={handleClear}
            color={color}
            fillColor={fillColor}
            strokeWidth={strokeWidth}
          />
        </Box>

        <Box
          component="input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          sx={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </Box>

      <TextInputModal ref={textModalRef} onAddText={handleAddText} />

      <ColorPicker
        anchorEl={colorPickerAnchor}
        open={Boolean(colorPickerAnchor)}
        onClose={() => setColorPickerAnchor(null)}
        selectedColor={color}
        onColorSelect={handleColorSelect}
      />

      <ColorPicker
        anchorEl={fillPickerAnchor}
        open={Boolean(fillPickerAnchor)}
        onClose={() => setFillPickerAnchor(null)}
        selectedColor={fillColor}
        onColorSelect={handleFillColorSelect}
        showTransparent
      />

      <StrokeWidthPicker
        anchorEl={strokePickerAnchor}
        open={Boolean(strokePickerAnchor)}
        onClose={() => setStrokePickerAnchor(null)}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={handleStrokeWidthChange}
      />
    </Box>
  )
}

Whiteboard.propTypes = {
  onClose: PropTypes.func,
}

export default Whiteboard
