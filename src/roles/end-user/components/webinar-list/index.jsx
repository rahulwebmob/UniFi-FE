import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useGetAllWebinarsQuery } from '../../../../services/education'
import NoDataFound from '../../../../shared/components/no-data-found'
import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'
import ContentSkeleton from '../content-skeleton'
import { GridContainer } from '../style'
import WebinarCard from '../webinar-card'

const WebinarList = ({ page, searchTerm, isPurchased, selectedCategory }) => {
  const { t } = useTranslation('education')
  const [list, setList] = useState([])
  const [count, setCount] = useState(0)

  const { data, isLoading, isFetching, isSuccess } = useGetAllWebinarsQuery(
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
    if (isSuccess && !isFetching) {
      if (data?.data?.webinars?.length) {
        setList((prev) =>
          page === 1 ? (data.data?.webinars ?? []) : [...prev, ...(data.data?.webinars ?? [])],
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
        ) : list.length > 0 ? (
          <>
            {list.map((item) => (
              <WebinarCard key={item._id} webinar={item} isPurchased />
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

  return isLoading ? (
    <GridContainer>
      <ContentSkeleton isPurchased={false} />
    </GridContainer>
  ) : !list.length ? (
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
    <GridContainer>
      {list.map((item) => (
        <WebinarCard key={item._id} webinar={item} isPurchased />
      ))}
    </GridContainer>
  )
}

WebinarList.propTypes = {
  page: PropTypes.number.isRequired,
  searchTerm: PropTypes.string,
  isPurchased: PropTypes.bool,
  selectedCategory: PropTypes.string,
}

WebinarList.defaultProps = {
  searchTerm: '',
  isPurchased: false,
  selectedCategory: '',
}

export default WebinarList
