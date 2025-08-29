import { Box, Card, Grid, Skeleton } from '@mui/material'
import PropTypes from 'prop-types'

import MuiCarousel from '../../../../../shared/components/ui-elements/mui-carousel'

const ContentSkeleton = ({ isPurchased = false }) => {
  if (isPurchased) {
    return (
      <MuiCarousel>
        {[1, 2, 3, 4, 5, 6].map((value) => (
          <Box key={value} sx={{ minWidth: 420, maxWidth: 420, px: 1 }}>
            <Card
              sx={{
                display: 'flex',
                borderRadius: 1.5,
                overflow: 'hidden',
                height: 150,
                width: '100%',
                border: 1,
                borderColor: (theme) => theme.palette.grey[200],
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
              <Box sx={{ width: 180, flexShrink: 0, p: 1.5 }}>
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 1,
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: (theme) => theme.typography.h6.fontSize, width: '70%', mb: 1 }}
                />
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: 80, height: 24, borderRadius: 2.5 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: 60, height: 24, borderRadius: 2.5 }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: (theme) => theme.typography.body2.fontSize, width: '30%' }}
                />
              </Box>
            </Card>
          </Box>
        ))}
      </MuiCarousel>
    )
  }

  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={value}>
          <Card
            sx={{
              height: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: (theme) => theme.palette.grey[200],
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                width: '100%',
                paddingTop: '56.25%',
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

            <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Skeleton
                variant="text"
                sx={{ fontSize: (theme) => theme.typography.h6.fontSize, width: '80%', mb: 1 }}
              />

              <Skeleton
                variant="text"
                sx={{ fontSize: (theme) => theme.typography.body2.fontSize, width: '100%' }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: (theme) => theme.typography.body2.fontSize, width: '90%', mb: 2 }}
              />

              <Box sx={{ flexGrow: 1 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Skeleton
                  variant="text"
                  sx={{ fontSize: (theme) => theme.typography.h6.fontSize, width: 60 }}
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

ContentSkeleton.propTypes = {
  isPurchased: PropTypes.bool,
}

export default ContentSkeleton
