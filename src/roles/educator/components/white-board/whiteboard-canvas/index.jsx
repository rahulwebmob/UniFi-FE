import { Box, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'

const WhiteboardCanvas = forwardRef(({ containerRef }, canvasRef) => {
  const theme = useTheme()

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.common.white,
        backgroundImage: `
          radial-gradient(circle, ${theme.palette.grey[300]} 0.9px, transparent 0.9px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        borderRadius: 1,
      }}
    >
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          display: 'block',
        }}
      />
    </Box>
  )
})

WhiteboardCanvas.displayName = 'WhiteboardCanvas'

WhiteboardCanvas.propTypes = {
  containerRef: PropTypes.object,
}

export default WhiteboardCanvas
