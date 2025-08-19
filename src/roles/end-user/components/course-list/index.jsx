import { Box, Grid } from '@mui/material'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useGetAllCoursesQuery } from '../../../../services/education'
import NoDataFound from '../../../../shared/components/no-data-found'
import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'
import ContentSkeleton from '../content-skeleton'
import CourseCard from '../course-card'

const iff = (condition, trueCase, falseCase) => (condition ? trueCase : falseCase)

const CourseList = ({ page, searchTerm, isPurchased, selectedCategory }) => {
  const { t } = useTranslation('education')

  const [list, setList] = useState([])
  const [count, setCount] = useState(0)

  const { data, isFetching, isSuccess, isLoading } = useGetAllCoursesQuery({
    page,
    searchTerm,
    isPurchased,
    pageSize: 20,
    categories: selectedCategory,
  })

  useEffect(() => {
    if (isSuccess && !isFetching) {
      if (data?.data?.courses?.length) {
        setList((prev) =>
          page === 1 ? (data.data?.courses ?? []) : [...prev, ...(data.data?.courses ?? [])],
        )
        setCount(data.data?.count ?? 0)
      } else {
        setList([])
        setCount(0)
      }
    }
  }, [data, isFetching, isSuccess, page])

  useEffect(() => {
    // if (list?.length < count) {
    //   setIsLoadMore(true)
    // } else {
    //   setIsLoadMore(false)
    // }
  }, [count, list])

  if (isPurchased) {
    return (
      <MuiCarousel>
        {isLoading ? (
          <ContentSkeleton isPurchased />
        ) : list.length ? (
          <>
            {list.map((item) => (
              <Box key={item._id} sx={{ minWidth: 420, maxWidth: 420, px: 1 }}>
                <CourseCard course={item} isPurchased />
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
            <NoDataFound
              description={t('EDUCATION_DASHBOARD.MAIN_PAGE.TAKE_FIRST_STEP_COURSE')}
              title={undefined}
            />
          </Box>
        )}
      </MuiCarousel>
    )
  }

  return (
    <>
      {iff(
        isFetching,
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
                <CourseCard course={item} isPurchased={false} />
              </Grid>
            ))}
          </Grid>
        ),
      )}
    </>
  )
}

export default CourseList
