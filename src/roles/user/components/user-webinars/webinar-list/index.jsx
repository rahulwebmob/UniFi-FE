import { Box, Grid, useTheme, useMediaQuery } from '@mui/material'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import { useGetAllWebinarsQuery } from '../../../../../services/education'
import NoDataFound from '../../../../../shared/components/no-data-found'
import MuiCarousel from '../../../../../shared/components/ui-elements/mui-carousel'
import ContentSkeleton from '../../user-content/content-skeleton'
import WebinarCard from '../webinar-card'

const WebinarList = ({
  page,
  searchTerm = '',
  isPurchased = false,
  selectedCategory = '',
  setIsLoadMore = null,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const [list, setList] = useState([])
  const [count, setCount] = useState(0)
  const [hasInitialized, setHasInitialized] = useState(false)

  const { data, isFetching, isSuccess } = useGetAllWebinarsQuery(
    {
      page,
      search: searchTerm,
      isPurchased,
      limit: 20,
      categories: selectedCategory,
    },
    {
      pollingInterval: 5000,
    },
  )

  useEffect(() => {
    if (page === 1) {
      setHasInitialized(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, isPurchased])

  useEffect(() => {
    if (isSuccess) {
      const webinars = data?.data?.webinars ?? []
      const totalCount = data?.data?.count ?? 0

      if (page === 1) {
        setList(webinars)
        setCount(totalCount)
        setHasInitialized(true)
      } else if (webinars.length > 0) {
        setList((prev) => {
          const existingIds = new Set(prev.map((item) => item._id))
          const newItems = webinars.filter((item) => !existingIds.has(item._id))
          return [...prev, ...newItems]
        })
        setCount(totalCount)
      }
    }
  }, [data, isSuccess, page])

  useEffect(() => {
    if (setIsLoadMore) {
      const hasMore = list?.length < count && count > 0
      setIsLoadMore(hasMore)
    }
  }, [count, list?.length, setIsLoadMore])

  // Only show skeleton on very first load, not during polling
  const isInitialLoad = !hasInitialized && isFetching
  // Always show content once we have initialized
  const showContent = hasInitialized || list.length > 0
  // Only show no data when we're sure there's no data and not fetching

  if (isPurchased) {
    // Don't render anything until we have initialized
    if (!hasInitialized && isFetching) {
      return (
        <MuiCarousel>
          <ContentSkeleton isPurchased />
        </MuiCarousel>
      )
    }

    // Once initialized, always show the same structure
    if (list.length === 0) {
      return (
        <MuiCarousel>
          <Box
            sx={{
              '&.MuiTabs-flexContainer': {
                display: 'inline',
              },
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              '& .MuiBox-root': {
                minHeight: 'auto',
                height: 'auto',
              },
              svg: {
                width: '107px',
              },
              '& .MuiTypography-h3': {
                display: 'none',
              },
            }}
          >
            <NoDataFound description="Take the First Step Toward Success – Purchase a Webinar Today." />
          </Box>
        </MuiCarousel>
      )
    }

    return (
      <MuiCarousel>
        {list.map((item) => (
          <Box
            key={item._id}
            sx={{
              minWidth: isMobile ? '100%' : isTablet ? 380 : 460,
              maxWidth: isMobile ? '100%' : isTablet ? 380 : 460,
              px: isMobile ? 0.5 : 1,
              py: 1,
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <WebinarCard webinar={item} isPurchased />
          </Box>
        ))}
      </MuiCarousel>
    )
  }

  return isInitialLoad ? (
    <Grid container spacing={3}>
      <ContentSkeleton isPurchased={false} />
    </Grid>
  ) : showContent ? (
    list.length ? (
      <Grid container spacing={2}>
        {list.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={item._id}>
            <WebinarCard webinar={item} isPurchased={false} />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <NoDataFound />
      </Box>
    )
  ) : null
}

WebinarList.propTypes = {
  page: PropTypes.number.isRequired,
  searchTerm: PropTypes.string,
  isPurchased: PropTypes.bool,
  selectedCategory: PropTypes.string,
  setIsLoadMore: PropTypes.func,
}

export default WebinarList
