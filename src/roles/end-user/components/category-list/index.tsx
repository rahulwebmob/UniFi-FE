import type { Theme } from '@mui/material/styles'

import { Box, Tooltip } from '@mui/material'

interface CategoryListProps {
  chips: string[]
  containerWidth?: number
  isPurchased?: boolean
  maxVisible?: number
}

const CategoryList = ({
  chips,
  containerWidth,
  isPurchased,
  maxVisible = 2,
}: CategoryListProps) => {
  // If we have more chips than maxVisible, show one less to make room for "+N more"
  const hasMore = chips.length > maxVisible
  const visibleCount = hasMore ? maxVisible - 1 : chips.length
  const remainingCount = chips.length - visibleCount

  // Style based on context - white text for overlay, bordered for regular
  const isOnImage = !isPurchased && containerWidth === undefined

  const chipStyle = isOnImage
    ? {
        // Style for categories on image overlay with blur
        fontSize: '11px',
        fontWeight: 500,
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        px: 1,
        py: 0.25,
        borderRadius: '20px',
        whiteSpace: 'nowrap' as const,
        display: 'inline-block',
      }
    : {
        // Original bordered style for purchased cards
        fontSize: '12px',
        fontWeight: 400,
        color: (theme: Theme) => theme.palette.text.secondary,
        border: (theme: Theme) => `1px solid ${theme.palette.grey[300]}`,
        backgroundColor: 'transparent',
        px: 1.25,
        py: 0.375,
        borderRadius: '30px',
        whiteSpace: 'nowrap' as const,
        display: 'inline-block',
      }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        alignItems: 'center',
        flexWrap: 'nowrap', // Force single row
        overflow: 'hidden',
      }}
    >
      {chips.slice(0, visibleCount).map((label, index) => (
        <Box key={`${label}-${index}`} sx={chipStyle}>
          {label}
        </Box>
      ))}
      {remainingCount > 0 && (
        <Tooltip title={chips.slice(visibleCount).join(', ')}>
          <Box
            sx={{
              ...chipStyle,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: isOnImage
                  ? 'rgba(0, 0, 0, 0.6)'
                  : (theme: Theme) => theme.palette.grey[100],
              },
            }}
          >
            +{remainingCount} more
          </Box>
        </Tooltip>
      )}
    </Box>
  )
}

export default CategoryList
