import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material'
import {
  MousePointer,
  Square,
  Circle,
  Triangle,
  Type,
  Pencil,
  Eraser,
  Minus,
  Palette,
  Brush,
  Edit3,
  Upload,
  Download,
  Trash2,
} from 'lucide-react'
import PropTypes from 'prop-types'

import MuiCarousel from '../../../../../shared/components/ui-elements/mui-carousel'
import {
  TOOL_IDS,
  ICON_BUTTON_SIZE,
  TOOLBAR_HEIGHT,
  COLOR_INDICATOR_SIZE,
  ICON_SIZE_SMALL,
} from '../constants'

const TOOLS = [
  { id: TOOL_IDS.SELECT, icon: MousePointer, label: 'Select' },
  { id: TOOL_IDS.RECTANGLE, icon: Square, label: 'Rectangle' },
  { id: TOOL_IDS.CIRCLE, icon: Circle, label: 'Circle' },
  { id: TOOL_IDS.TRIANGLE, icon: Triangle, label: 'Triangle' },
  { id: TOOL_IDS.TEXT, icon: Type, label: 'Text' },
  { id: TOOL_IDS.PEN, icon: Pencil, label: 'Pen' },
  { id: TOOL_IDS.ERASER, icon: Eraser, label: 'Eraser' },
  { id: TOOL_IDS.LINE, icon: Minus, label: 'Line' },
]

const WhiteboardToolbar = ({
  selectedTool,
  onToolSelect,
  onColorClick,
  onFillToggle,
  onStrokeClick,
  onUpload,
  onDownload,
  onClear,
  color,
  fillColor,
  strokeWidth,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const iconButtonStyle = {
    color: theme.palette.common.white,
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    flexShrink: 0,
  }

  const renderToolButton = (tool) => {
    const Icon = tool.icon
    return (
      <IconButton
        key={tool.id}
        onClick={() => onToolSelect(tool.id)}
        sx={{
          ...iconButtonStyle,
          color:
            selectedTool === tool.id ? theme.palette.secondary.light : theme.palette.common.white,
          '&:hover': {
            backgroundColor: theme.palette.grey[700],
          },
        }}
        title={tool.label}
        aria-label={tool.label}
        aria-pressed={selectedTool === tool.id}
      >
        <Icon size={ICON_SIZE_SMALL} />
      </IconButton>
    )
  }

  const toolbarContent = [
    ...TOOLS.map(renderToolButton),
    <IconButton
      key="color-picker"
      onClick={onColorClick}
      sx={{
        ...iconButtonStyle,
        position: 'relative',
      }}
      title="Stroke Color"
      aria-label="Select stroke color"
    >
      <Palette size={ICON_SIZE_SMALL} />
      <Box
        sx={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: COLOR_INDICATOR_SIZE,
          height: COLOR_INDICATOR_SIZE,
          borderRadius: '50%',
          backgroundColor: color,
          border: `2px solid ${theme.palette.common.white}`,
        }}
      />
    </IconButton>,
    <IconButton
      key="fill-picker"
      onClick={onFillToggle}
      sx={{
        ...iconButtonStyle,
        position: 'relative',
      }}
      title="Fill Color"
      aria-label="Select fill color"
    >
      <Brush size={ICON_SIZE_SMALL} />
      <Box
        sx={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: COLOR_INDICATOR_SIZE,
          height: COLOR_INDICATOR_SIZE,
          borderRadius: '50%',
          backgroundColor: fillColor === 'transparent' ? 'transparent' : fillColor,
          border: `2px solid ${theme.palette.common.white}`,
        }}
      />
    </IconButton>,
    <IconButton
      key="stroke-picker"
      onClick={onStrokeClick}
      sx={{
        ...iconButtonStyle,
        position: 'relative',
      }}
      title={`Stroke Width: ${strokeWidth}px`}
      aria-label={`Select stroke width, current: ${strokeWidth} pixels`}
    >
      <Edit3 size={ICON_SIZE_SMALL} />
    </IconButton>,
    <IconButton
      key="upload"
      onClick={onUpload}
      sx={iconButtonStyle}
      title="Upload Image"
      aria-label="Upload an image to the whiteboard"
    >
      <Upload size={ICON_SIZE_SMALL} />
    </IconButton>,
    <IconButton
      key="download"
      onClick={onDownload}
      sx={iconButtonStyle}
      title="Download"
      aria-label="Download whiteboard as image"
    >
      <Download size={ICON_SIZE_SMALL} />
    </IconButton>,
    <IconButton
      key="clear"
      onClick={onClear}
      sx={iconButtonStyle}
      title="Clear All"
      aria-label="Clear all content from whiteboard"
    >
      <Trash2 size={ICON_SIZE_SMALL} />
    </IconButton>,
  ]

  if (isMobile) {
    return (
      <Box
        sx={{
          height: TOOLBAR_HEIGHT,
          backgroundColor: theme.palette.grey[800],
          display: 'flex',
          alignItems: 'center',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(10px)',
          width: isSmallMobile ? '100%' : 'auto',
          maxWidth: '600px',
          position: 'relative',
        }}
      >
        <MuiCarousel>
          <Box sx={{ display: 'flex', gap: 1, px: 3, alignItems: 'center', height: '100%' }}>
            {toolbarContent}
          </Box>
        </MuiCarousel>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: 56,
        backgroundColor: theme.palette.grey[800],
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        px: 2,
        zIndex: 10,
        gap: 1,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {toolbarContent}
    </Box>
  )
}

WhiteboardToolbar.propTypes = {
  selectedTool: PropTypes.string.isRequired,
  onToolSelect: PropTypes.func.isRequired,
  onColorClick: PropTypes.func.isRequired,
  onFillToggle: PropTypes.func.isRequired,
  onStrokeClick: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  fillColor: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
}

export default WhiteboardToolbar
