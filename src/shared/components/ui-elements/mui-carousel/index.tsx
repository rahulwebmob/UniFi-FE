import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useRef, useState, useEffect } from 'react'

import { Box, alpha, useTheme, IconButton } from '@mui/material'

interface MuiCarouselProps {
  children: React.ReactNode
}

const MuiCarousel: React.FC<MuiCarouselProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const theme = useTheme()

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    const handleResize = () => checkScroll()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [children])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      const currentScroll = scrollRef.current.scrollLeft
      const targetScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      })

      setTimeout(checkScroll, 300)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        '&.bg-active': {
          '::after': {
            content: '""',
            width: '150px',
            height: '100%',
            top: 0,
            right: 0,
            position: 'absolute',
            pointerEvents: 'none',
            background: `linear-gradient(270deg, ${alpha(
              theme.palette.background.default,
              0.4,
            )} 50.04%, ${alpha(theme.palette.background.default, 0)} 100%)`,
            zIndex: 1,
          },
          [theme.breakpoints.down('sm')]: {
            '::after': {
              display: 'none',
            },
          },
        },
      }}
      className={canScrollLeft || canScrollRight ? 'bg-active' : ''}
    >
      <Box
        ref={scrollRef}
        onScroll={checkScroll}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {children}
      </Box>

      {canScrollLeft && (
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'background.paper',
            boxShadow: 1,
            zIndex: 2,
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
        >
          <ChevronLeft size={20} />
        </IconButton>
      )}

      {canScrollRight && (
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'background.paper',
            boxShadow: 1,
            zIndex: 2,
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
        >
          <ChevronRight size={20} />
        </IconButton>
      )}
    </Box>
  )
}

export default MuiCarousel
