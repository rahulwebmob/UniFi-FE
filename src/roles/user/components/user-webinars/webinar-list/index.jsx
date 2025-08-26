import { Box, Grid } from '@mui/material'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useGetAllWebinarsQuery } from '../../../../../services/education'
import NoDataFound from '../../../../../shared/components/no-data-found'
import MuiCarousel from '../../../../../shared/components/ui-elements/mui-carousel'
import { iff } from '../../../../../utils/globalUtils'
import ContentSkeleton from '../../user-content/content-skeleton'
import WebinarCard from '../webinar-card'

const WebinarList = ({ page, searchTerm, isPurchased, selectedCategory, setIsLoadMore }) => {
  const { t } = useTranslation('education')
  const [list, setList] = useState([])
  const [count, setCount] = useState(0)
  const [hasInitialData, setHasInitialData] = useState(false)

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
      setHasInitialData(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, isPurchased])

  useEffect(() => {
    if (isSuccess && data?.data) {
      const webinars = data.data?.webinars ?? []
      const totalCount = data.data?.count ?? 0

      if (page === 1) {
        setList(webinars)
        setCount(totalCount)
        setHasInitialData(true)
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

  const shouldShowSkeleton = !hasInitialData && isFetching

  if (isPurchased) {
    return (
      <MuiCarousel>
        {shouldShowSkeleton ? (
          <ContentSkeleton isPurchased />
        ) : list.length > 0 ? (
          <>
            {list.map((item) => (
              <Box key={item._id} sx={{ minWidth: 420, maxWidth: 420, px: 1 }}>
                <WebinarCard webinar={item} isPurchased />
              </Box>
            ))}
          </>
        ) : (
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
            <NoDataFound description={t('EDUCATION_DASHBOARD.MAIN_PAGE.TAKE_FIRST_STEP_WEBINAR')} />
          </Box>
        )}
      </MuiCarousel>
    )
  }

  return (
    <>
      {iff(
        shouldShowSkeleton,
        <Grid container spacing={3}>
          <ContentSkeleton isPurchased={false} />
        </Grid>,
        !list.length ? (
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
        ) : (
          <Grid container spacing={3}>
            {list.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={item._id}>
                <WebinarCard webinar={item} isPurchased={false} />
              </Grid>
            ))}
          </Grid>
        ),
      )}
    </>
  )
}

WebinarList.propTypes = {
  page: PropTypes.number.isRequired,
  searchTerm: PropTypes.string,
  isPurchased: PropTypes.bool,
  selectedCategory: PropTypes.string,
  setIsLoadMore: PropTypes.func,
}

WebinarList.defaultProps = {
  searchTerm: '',
  isPurchased: false,
  selectedCategory: '',
  setIsLoadMore: null,
}

export default WebinarList
