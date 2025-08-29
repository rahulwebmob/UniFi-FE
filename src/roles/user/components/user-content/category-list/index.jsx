import { Box, Tooltip, alpha } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

const CategoryList = ({
  chips,
  containerWidth = undefined,
  isPurchased = false,
  maxVisible = 2,
}) => {
  const [visibleCount, setVisibleCount] = useState(maxVisible)
  const containerRef = useRef(null)
  const chipsRef = useRef([])

  const isOnImage = !isPurchased && containerWidth === undefined

  useEffect(() => {
    const calculateVisibleChips = () => {
      if (!containerRef.current || chips.length === 0) {
        return
      }

      const container = containerRef.current
      const containerMaxWidth = container.offsetWidth
      const moreButtonWidth = 80
      const gap = 4
      let totalWidth = 0
      let count = 0

      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.visibility = 'hidden'
      tempContainer.style.whiteSpace = 'nowrap'
      document.body.appendChild(tempContainer)

      for (let i = 0; i < chips.length; i++) {
        const tempChip = document.createElement('span')
        tempChip.style.cssText = isOnImage
          ? 'font-size: 0.75rem; padding: 2px 8px;'
          : 'font-size: 0.75rem; padding: 3px 10px;'
        tempChip.textContent = chips[i]
        tempContainer.appendChild(tempChip)

        const chipWidth = tempChip.offsetWidth
        tempContainer.removeChild(tempChip)

        const willNeedMore = i < chips.length - 1
        const availableWidth = willNeedMore
          ? containerMaxWidth - moreButtonWidth - count * gap
          : containerMaxWidth - count * gap

        if (totalWidth + chipWidth <= availableWidth) {
          totalWidth += chipWidth
          count++
        } else {
          break
        }
      }

      document.body.removeChild(tempContainer)

      setVisibleCount(Math.max(1, Math.min(count, chips.length)))
    }

    calculateVisibleChips()

    const handleResize = () => calculateVisibleChips()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [chips, isOnImage, containerWidth])

  const remainingCount = chips.length - visibleCount

  const chipStyle = isOnImage
    ? {
        fontSize: (theme) => theme.typography.caption.fontSize,
        fontWeight: (theme) => theme.typography.fontWeightMedium,
        color: (theme) => theme.palette.common.white,
        backgroundColor: (theme) => alpha(theme.palette.common.black, 0.4),
        backdropFilter: 'blur(8px)',
        border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
        px: 1,
        py: 0.25,
        borderRadius: '20px',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }
    : {
        fontSize: (theme) => theme.typography.caption.fontSize,
        fontWeight: (theme) => theme.typography.fontWeightRegular,
        color: (theme) => theme.palette.text.secondary,
        border: (theme) => `1px solid ${theme.palette.grey[300]}`,
        backgroundColor: 'transparent',
        px: 1.25,
        py: 0.375,
        borderRadius: '30px',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        gap: 0.5,
        alignItems: 'center',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        width: '100%',
        maxWidth: containerWidth || '100%',
      }}
    >
      {chips.slice(0, visibleCount).map((label, index) => (
        <Box
          key={label}
          ref={(el) => (chipsRef.current[index] = el)}
          sx={{
            ...chipStyle,
            flexShrink: 0,
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </Box>
      ))}
      {remainingCount > 0 && (
        <Tooltip title={chips.slice(visibleCount).join(', ')} placement="top" arrow>
          <Box
            sx={{
              ...chipStyle,
              cursor: 'pointer',
              flexShrink: 0,
              '&:hover': {
                backgroundColor: isOnImage
                  ? (theme) => alpha(theme.palette.common.black, 0.6)
                  : (theme) => theme.palette.grey[100],
              },
            }}
          >
            +{remainingCount}
          </Box>
        </Tooltip>
      )}
    </Box>
  )
}

CategoryList.propTypes = {
  chips: PropTypes.arrayOf(PropTypes.string).isRequired,
  containerWidth: PropTypes.number,
  isPurchased: PropTypes.bool,
  maxVisible: PropTypes.number,
}

export default CategoryList
