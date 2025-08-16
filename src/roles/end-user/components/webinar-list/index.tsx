import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { de, fr, it, ja, pt, arSA, enUS } from 'date-fns/locale'

import { Box } from '@mui/material'

import { GridContainer } from '../style'
import WebinarCard from '../webinar-card'
import ContentSkeleton from '../content-skeleton'
import NoDataFound from '../../../../shared/components/no-data-found'
import { useGetAllWebinarsQuery } from '../../../../services/education'
import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'

const iff = <T,>(condition: boolean, trueCase: T, falseCase: T): T =>
  condition ? trueCase : falseCase

const getLocaleByLanguageCode = (languageCode: string) => {
  const localeMap = { ar: arSA, jp: ja, en: enUS, de, fr, pt, it }
  return localeMap[languageCode as keyof typeof localeMap]
}

interface WebinarItem {
  _id: string
  title?: string
  description?: string
  thumbNail?: string
  price?: number
  category?: string | string[]
  webinarScheduledObj?: {
    join_date?: string
    can_join?: boolean
    [key: string]: unknown
  }
  isPaid?: boolean
  isWebinarBought?: boolean
  totalEnrolled?: number
  educatorDetail?: {
    firstName?: string
    lastName?: string
    profilePic?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}


interface WebinarListProps {
  page: number
  searchTerm?: string
  isPurchased?: boolean
  setIsLoadMore?: (value: boolean) => void
  selectedCategory?: string
}

const WebinarList = ({
  page,
  searchTerm,
  isPurchased,
  selectedCategory,
}: WebinarListProps) => {
  const { t, i18n } = useTranslation('education')
  const [list, setList] = useState<WebinarItem[]>([])
  const [count, setCount] = useState(0)
  const locale = getLocaleByLanguageCode(i18n.language)

  const { data, isLoading, isFetching, isSuccess } = useGetAllWebinarsQuery(
    {
      page,
      searchTerm,
      isPurchased,
      pageSize: 20,
      categories: selectedCategory,
    },
    {
      pollingInterval: 5000,
    },
  ) as { data?: { data?: { webinars?: WebinarItem[], count?: number } }, isLoading: boolean, isFetching: boolean, isSuccess: boolean }

  useEffect(() => {
    if (isSuccess && !isFetching) {
      if (data?.data?.webinars?.length) {
        setList((prev) =>
          page === 1
            ? data.data.webinars ?? []
            : [...prev, ...(data.data.webinars ?? [])],
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

  if (isPurchased)
    return (
      <MuiCarousel>
        {iff(
          isLoading,
          <ContentSkeleton isPurchased />,
          iff(
            !!list.length,
              list.map((item) => (
                <WebinarCard
                  key={item._id}
                  webinar={item}
                  isPurchased
                  locale={locale}
                />
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
                    'EDUCATION_DASHBOARD.MAIN_PAGE.TAKE_FIRST_STEP_WEBINAR',
                  )}
                />
              </Box>,
            ),
          )}
        </MuiCarousel>
    )

  return (
    <>
      {iff(
        isLoading,
        <GridContainer>
          <ContentSkeleton isPurchased={false} />
        </GridContainer>,
        !list.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <NoDataFound />
          </Box>
        ) : (
          <GridContainer>
            {list.map((item) => (
              <WebinarCard
                key={item._id}
                webinar={item}
                isPurchased={false}
                locale={locale}
              />
            ))}
          </GridContainer>
        ),
      )}
    </>
  )
}

export default WebinarList
