import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'

import { Box, Grid } from '@mui/material'

import CourseCard from '../course-card'
import ContentSkeleton from '../content-skeleton'
import NoDataFound from '../../../../shared/components/no-data-found'
import { useGetAllCoursesQuery } from '../../../../services/education'
import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'

const iff = <T,>(condition: boolean, trueCase: T, falseCase: T): T =>
  condition ? trueCase : falseCase

interface CourseListProps {
  page: number
  searchTerm?: string
  isPurchased?: boolean
  setIsLoadMore?: (value: boolean) => void
  selectedCategory?: string
}

const CourseList: React.FC<CourseListProps> = ({
  page,
  searchTerm,
  isPurchased,
  selectedCategory,
}) => {
  const { t } = useTranslation('education')
  interface Course {
    _id: string
    title?: string
    description?: string
    [key: string]: unknown
  }

  const [list, setList] = useState<Course[]>([])
  const [count, setCount] = useState(0)

  const { data, isFetching, isSuccess, isLoading } = useGetAllCoursesQuery({
    page,
    searchTerm,
    isPurchased,
    pageSize: 20,
    categories: selectedCategory,
  }) as { data?: { data?: { courses?: Course[], count?: number } }, isFetching: boolean, isSuccess: boolean, isLoading: boolean }

  useEffect(() => {
    if (isSuccess && !isFetching) {
      if (data?.data?.courses?.length) {
        setList((prev) =>
          page === 1 ? (data.data.courses ?? []) : [...prev, ...(data.data.courses ?? [])],
        )
        setCount(data.data.count ?? 0)
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
        {iff(
          isLoading,
          <ContentSkeleton isPurchased />,
          iff(
            !!list.length,
            list.map((item) => (
              <Box key={item._id} sx={{ minWidth: 420, maxWidth: 420, px: 1 }}>
                <CourseCard course={item} isPurchased />
              </Box>
            )),
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
                description={t(
                  'EDUCATION_DASHBOARD.MAIN_PAGE.TAKE_FIRST_STEP_COURSE',
                )}
                title={undefined}
              />
            </Box>,
          ),
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <NoDataFound title={undefined} description={undefined} />
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
