import {
  Box,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Paper,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import {
  Pencil,
  Eraser,
  Type,
  Square,
  Circle,
  Minus,
  Download,
  Trash2,
  Undo2,
  Redo2,
  Move,
  Upload,
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'

const WhiteBoard = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const fileInputRef = useRef(null)

  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [history, setHistory] = useState([])
  const [historyStep, setHistoryStep] = useState(-1)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const [textInput, setTextInput] = useState('')
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 600

    const context = canvas.getContext('2d')
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = color
    context.lineWidth = strokeWidth
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)

    contextRef.current = context

    // Save initial state
    // saveToHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update context when tool settings change
  useEffect(() => {
    if (!contextRef.current) {
      return
    }

    contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    contextRef.current.lineWidth = tool === 'eraser' ? strokeWidth * 3 : strokeWidth
    contextRef.current.globalCompositeOperation =
      tool === 'eraser' ? 'destination-out' : 'source-over'
  }, [color, strokeWidth, tool])

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const imageData = canvas.toDataURL()
    const newHistory = history.slice(0, historyStep + 1)
    newHistory.push(imageData)

    // Limit history to 50 steps
    if (newHistory.length > 50) {
      newHistory.shift()
    }

    setHistory(newHistory)
    setHistoryStep(newHistory.length - 1)
  }, [history, historyStep])

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1
      setHistoryStep(newStep)

      const img = new Image()
      img.src = history[newStep]
      img.onload = () => {
        const context = contextRef.current
        const canvas = canvasRef.current
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
      }
    }
  }

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1
      setHistoryStep(newStep)

      const img = new Image()
      img.src = history[newStep]
      img.onload = () => {
        const context = contextRef.current
        const canvas = canvasRef.current
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
      }
    }
  }

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX || e.touches[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches[0]?.clientY) - rect.top

    if (tool === 'move') {
      setIsPanning(true)
      setLastPanPoint({
        x: e.clientX || e.touches[0]?.clientX,
        y: e.clientY || e.touches[0]?.clientY,
      })
      canvas.style.cursor = 'grabbing'
      return
    }

    if (tool === 'text') {
      setTextPosition({ x, y })
      setShowTextDialog(true)
      return
    }

    setStartPos({ x, y })
    setIsDrawing(true)

    const context = contextRef.current
    context.beginPath()
    context.moveTo(x, y)
  }

  const draw = (e) => {
    const canvas = canvasRef.current

    if (tool === 'move' && isPanning) {
      const currentX = e.clientX || e.touches[0]?.clientX
      const currentY = e.clientY || e.touches[0]?.clientY
      const deltaX = currentX - lastPanPoint.x
      const deltaY = currentY - lastPanPoint.y

      const context = contextRef.current
      context.translate(deltaX, deltaY)
      setPanOffset({ x: panOffset.x + deltaX, y: panOffset.y + deltaY })
      setLastPanPoint({ x: currentX, y: currentY })

      // Redraw canvas with new transform
      const img = new Image()
      img.src = canvas.toDataURL()
      img.onload = () => {
        context.clearRect(-panOffset.x - deltaX, -panOffset.y - deltaY, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
      }
      return
    }

    if (!isDrawing || tool === 'text') {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX || e.touches[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches[0]?.clientY) - rect.top

    const context = contextRef.current

    if (tool === 'pen' || tool === 'eraser') {
      context.lineTo(x, y)
      context.stroke()
    } else if (tool === 'line' || tool === 'rectangle' || tool === 'circle') {
      // Clear and redraw for shapes
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      context.putImageData(imageData, 0, 0)

      context.beginPath()

      if (tool === 'line') {
        context.moveTo(startPos.x, startPos.y)
        context.lineTo(x, y)
        context.stroke()
      } else if (tool === 'rectangle') {
        const width = x - startPos.x
        const height = y - startPos.y
        context.strokeRect(startPos.x, startPos.y, width, height)
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2))
        context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
        context.stroke()
      }
    }
  }

  const stopDrawing = () => {
    if (tool === 'move') {
      setIsPanning(false)
      const canvas = canvasRef.current
      if (canvas) {
        canvas.style.cursor = 'grab'
      }
      return
    }

    if (isDrawing && tool !== 'text') {
      saveToHistory()
    }
    setIsDrawing(false)
  }

  const addText = () => {
    if (textInput.trim()) {
      const context = contextRef.current
      context.font = `${strokeWidth * 5}px Arial`
      context.fillStyle = color
      context.fillText(textInput, textPosition.x, textPosition.y)
      saveToHistory()
      setTextInput('')
      setShowTextDialog(false)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = contextRef.current
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const context = contextRef.current
        const canvas = canvasRef.current

        // Calculate scaling to fit image
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1)

        const x = (canvas.width - img.width * scale) / 2
        const y = (canvas.height - img.height * scale) / 2

        context.drawImage(img, x, y, img.width * scale, img.height * scale)
        saveToHistory()
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const colors = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ffa500',
    '#800080',
  ]

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Canvas */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          mb: 2,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            cursor: tool === 'move' ? 'grab' : 'crosshair',
            touchAction: 'none',
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </Paper>

      {/* Toolbar at bottom center */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
        }}
      >
        {/* Drawing Tools */}
        <ToggleButtonGroup
          value={tool}
          exclusive
          onChange={(e, newTool) => newTool && setTool(newTool)}
          size="small"
        >
          <ToggleButton value="move" sx={{ color: 'primary.main' }}>
            <Tooltip title="Move">
              <Move size={20} />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="pen" sx={{ color: 'primary.main' }}>
            <Tooltip title="Pen">
              <Pencil size={20} />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="eraser" sx={{ color: 'primary.main' }}>
            <Tooltip title="Eraser">
              <Eraser size={20} />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="line" sx={{ color: 'primary.main' }}>
            <Tooltip title="Line">
              <Minus size={20} />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="rectangle" sx={{ color: 'primary.main' }}>
            <Tooltip title="Rectangle">
              <Square size={20} />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="circle" sx={{ color: 'primary.main' }}>
            <Tooltip title="Circle">
              <Circle size={20} />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="text" sx={{ color: 'primary.main' }}>
            <Tooltip title="Text">
              <Type size={20} />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Color Picker */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {colors.map((c) => (
            <Box
              key={c}
              onClick={() => setColor(c)}
              sx={{
                width: 24,
                height: 24,
                backgroundColor: c,
                border: c === color ? '2px solid #1976d2' : '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            />
          ))}
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Stroke Width */}
        <Box sx={{ width: 120, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Size:
          </Typography>
          <Slider
            value={strokeWidth}
            onChange={(e, value) => setStrokeWidth(value)}
            min={1}
            max={20}
            size="small"
            sx={{ color: 'primary.main' }}
          />
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Undo">
            <IconButton
              onClick={undo}
              disabled={historyStep <= 0}
              size="small"
              sx={{ color: 'primary.main' }}
            >
              <Undo2 size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Redo">
            <IconButton
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              size="small"
              sx={{ color: 'primary.main' }}
            >
              <Redo2 size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Upload Image">
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              size="small"
              sx={{ color: 'primary.main' }}
            >
              <Upload size={20} />
            </IconButton>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />

          <Tooltip title="Download">
            <IconButton onClick={downloadCanvas} size="small" sx={{ color: 'primary.main' }}>
              <Download size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Clear All">
            <IconButton onClick={clearCanvas} size="small" sx={{ color: 'error.main' }}>
              <Trash2 size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Text Input Dialog */}
      <Dialog open={showTextDialog} onClose={() => setShowTextDialog(false)}>
        <DialogTitle>Add Text</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Enter text"
            fullWidth
            variant="outlined"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addText()
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTextDialog(false)}>Cancel</Button>
          <Button onClick={addText} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default WhiteBoard
