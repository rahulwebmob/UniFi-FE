// Tool IDs
export const TOOL_IDS = {
  SELECT: 'select',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  TRIANGLE: 'triangle',
  TEXT: 'text',
  PEN: 'pen',
  ERASER: 'eraser',
  LINE: 'line',
}

// Note: These colors can be accessed from theme.palette in components
// We're keeping them here for non-component usage
export const PREDEFINED_COLORS = [
  '#000000', // Black
  '#114262', // UniCitizens Deep Blue (Primary)
  '#208544', // UniCitizens Green (Secondary)
  '#4F9DD1', // UniCitizens Sky Blue (Info)
  '#D2312A', // UniCitizens Red (Error)
  '#F59E0B', // Amber (Warning)
  '#27488F', // UniCitizens Navy
  '#87A3B6', // UniCitizens Light Blue
  '#FFD700', // Golden
  '#6B7280', // Gray 500
  '#374151', // Gray 700
  '#9CA3AF', // Gray 400
]

// Default values
export const DEFAULT_COLOR = '#000000'
export const DEFAULT_FILL_COLOR = 'transparent'
export const DEFAULT_STROKE_WIDTH = 2
export const DEFAULT_TEXT_FONT_SIZE = 20
export const COLOR_INPUT_FALLBACK = '#000000'

// Size constants
export const ICON_BUTTON_SIZE = 40
export const TOOLBAR_HEIGHT = 56
export const COLOR_INDICATOR_SIZE = 12
export const COLOR_SWATCH_SIZE = 30
export const COLOR_PICKER_WIDTH = 240
export const STROKE_PICKER_WIDTH = 200

// Canvas defaults
export const CANVAS_MIN_WIDTH = 800
export const CANVAS_MIN_HEIGHT = 500
export const CANVAS_RESIZE_DELAY = 200

// Text positioning
export const TEXT_DEFAULT_LEFT = 100
export const TEXT_DEFAULT_TOP = 100

// Stroke width limits
export const MIN_STROKE_WIDTH = 1
export const MAX_STROKE_WIDTH = 20
export const ERASER_WIDTH_MULTIPLIER = 2

// Image upload
export const IMAGE_SCALE_FACTOR = 0.8
export const ACCEPTED_IMAGE_TYPES = 'image/*'

// Icon sizes
export const ICON_SIZE_SMALL = 18
export const ICON_SIZE_MEDIUM = 20

// Z-index values
export const TOOLBAR_Z_INDEX = 1000
