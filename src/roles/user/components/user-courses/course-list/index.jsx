import { Box, Grid } from '@mui/material'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import { useGetAllCoursesQuery } from '../../../../../services/education'
import NoDataFound from '../../../../../shared/components/no-data-found'
import MuiCarousel from '../../../../../shared/components/ui-elements/mui-carousel'
import ContentSkeleton from '../../user-content/content-skeleton'
import CourseCard from '../course-card'

const CourseList = ({ page, searchTerm, isPurchased, selectedCategory, setIsLoadMore }) => {
  const [list, setList] = useState([])
  const [count, setCount] = useState(0)
  const [hasInitialized, setHasInitialized] = useState(false)

  const { data, isSuccess, isFetching } = useGetAllCoursesQuery({
    page,
    searchTerm,
    isPurchased,
    pageSize: 20,
    categories: selectedCategory,
  })

  useEffect(() => {
    if (isSuccess && data?.data) {
      const courses = data.data?.courses ?? []
      const totalCount = data.data?.count ?? 0

      if (page === 1) {
        setList(courses)
        setCount(totalCount)
        setHasInitialized(true)
      } else if (courses.length > 0) {
        setList((prev) => {
          const existingIds = new Set(prev.map((item) => item._id))
          const newItems = courses.filter((item) => !existingIds.has(item._id))
          return [...prev, ...newItems]
        })
        setCount(totalCount)
      }
    } else if (isSuccess && !data?.data) {
      setHasInitialized(true)
    }
  }, [data, isSuccess, page, searchTerm, selectedCategory, isPurchased])

  useEffect(() => {
    if (setIsLoadMore) {
      const hasMore = list?.length < count && count > 0
      setIsLoadMore(hasMore)
    }
  }, [count, list?.length, setIsLoadMore])

  const isInitialLoad =
    (page === 1 && isFetching && !hasInitialized) || (!hasInitialized && page === 1)
  const showContent = hasInitialized
  const showNoData = hasInitialized && !list.length && !isFetching

  if (isPurchased) {
    return (
      <MuiCarousel>
        {isInitialLoad ? (
          <ContentSkeleton isPurchased />
        ) : showContent && list.length ? (
          <>
            {list.map((item) => (
              <Box key={item._id} sx={{ minWidth: 420, maxWidth: 420, px: 1 }}>
                <CourseCard course={item} isPurchased />
              </Box>
            ))}
          </>
        ) : showNoData ? (
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
            <NoDataFound description="Take the first step by enrolling in a course" title="" />
          </Box>
        ) : null}
      </MuiCarousel>
    )
  }

  return isInitialLoad ? (
    <Grid container spacing={3}>
      <ContentSkeleton isPurchased={false} />
    </Grid>
  ) : showContent ? (
    list.length ? (
      <Grid container spacing={3}>
        {list.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={item._id}>
            <CourseCard course={item} isPurchased={false} />
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

CourseList.propTypes = {
  page: PropTypes.number.isRequired,
  searchTerm: PropTypes.string,
  isPurchased: PropTypes.bool,
  selectedCategory: PropTypes.string,
  setIsLoadMore: PropTypes.func,
}

CourseList.defaultProps = {
  searchTerm: '',
  isPurchased: false,
  selectedCategory: '',
  setIsLoadMore: null,
}

export default CourseList
