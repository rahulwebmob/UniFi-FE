import React from 'react'

import { Box, Card, Grid, Skeleton } from '@mui/material'

import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'

interface ContentSkeletonProps {
  isPurchased?: boolean
}

const ContentSkeleton: React.FC<ContentSkeletonProps> = ({ isPurchased }) => {
  if (isPurchased) {
    // Horizontal skeleton for purchased cards - wrapped in carousel
    return (
      <MuiCarousel>
        {[1, 2, 3, 4, 5, 6].map((value) => (
          <Box key={value} sx={{ minWidth: 420, maxWidth: 420, px: 1 }}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'row',
                borderRadius: '12px',
                overflow: 'hidden',
                height: '150px',
                width: '100%',
                border: '1px solid',
                borderColor: (theme) => theme.palette.grey[200],
                backgroundColor: 'white',
              }}
            >
              {/* Image skeleton */}
              <Box sx={{ width: '180px', flexShrink: 0, p: 1.5 }}>
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                  }}
                />
              </Box>

              {/* Content skeleton */}
              <Box
                sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}
              >
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '1.2rem', width: '70%', mb: 1 }}
                />
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: 80, height: 24, borderRadius: '20px' }}
                  />
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: 60, height: 24, borderRadius: '20px' }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '0.875rem', width: '30%' }}
                />
              </Box>
            </Card>
          </Box>
        ))}
      </MuiCarousel>
    )
  }

  // Vertical skeleton for non-purchased cards - wrapped in Grid items
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={value}>
          <Card
            sx={{
              height: '100%', // Take full height like actual cards
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: (theme) => theme.palette.grey[200],
              backgroundColor: 'white',
            }}
          >
            {/* Image skeleton with 16:9 aspect ratio */}
            <Box
              sx={{
                width: '100%',
                paddingTop: '56.25%', // 16:9 aspect ratio
                position: 'relative',
                backgroundColor: (theme) => theme.palette.grey[100],
              }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>

            {/* Content skeleton */}
            <Box
              sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {/* Title */}
              <Skeleton
                variant="text"
                sx={{ fontSize: '1.1rem', width: '80%', mb: 1 }}
              />

              {/* Description */}
              <Skeleton
                variant="text"
                sx={{ fontSize: '0.875rem', width: '100%' }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: '0.875rem', width: '90%', mb: 2 }}
              />

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Footer */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '1.5rem', width: 60 }}
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ width: 80, height: 32, borderRadius: '6px' }}
                />
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </>
  )
}

export default ContentSkeleton
