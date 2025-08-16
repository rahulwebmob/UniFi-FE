import React, { useRef, useState, useEffect } from 'react'

import { Tooltip, Typography } from '@mui/material'

const OverflowableCell = ({ value, maxWidth }) => {
  const textRef = useRef(null)
  const [isOverflowed, setIsOverflowed] = useState(false)

  const checkOverflow = () => {
    const element = textRef.current
    if (element) {
      setIsOverflowed(element.scrollWidth > element.clientWidth)
    }
  }

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => {
      window.removeEventListener('resize', checkOverflow)
    }
  }, [value, maxWidth])

  const renderCellContent = () => (
    <Typography
      variant="body1"
      ref={textRef}
      sx={{
        maxWidth,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {value || '-'}
    </Typography>
  )

  return isOverflowed ? (
    <Tooltip title={value} placement="top" arrow>
      {renderCellContent()}
    </Tooltip>
  ) : (
    renderCellContent()
  )
}

export default OverflowableCell
