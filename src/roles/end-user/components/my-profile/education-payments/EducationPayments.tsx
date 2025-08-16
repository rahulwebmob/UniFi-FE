import React from 'react'
import { dispatch } from 'd3'
import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Box, Tooltip, Typography } from '@mui/material'

import ApiMiddleware from 'src/shared/components/api-middleware'

interface EducationDetails {
  _id: string
  thumbNail?: string
  title?: string
  webinarId?: string
  courseId?: string
}

interface EducationPayment {
  _id: string
  moduleType: 'webinar' | 'course'
  webinarId?: EducationDetails
  courseId?: EducationDetails
  amount?: number
  createdAt?: string
}

interface EducationPaymentsData {
  data?: EducationPayment[]
}

type LazyGetEducationInvoiceQuery = (params: { transactionId: string }) => Promise<{ unwrap: () => Promise<{ error: boolean; data: string }> }>

import { successAlert } from '../../../../../redux/reducers/AppSlice'
import { handleGeneratePdf } from '../../../../../roles/admin-user/components/common'
import {
  useGetEducationPaymentsQuery,
  useLazyGetEducationInvoiceQuery,
} from '../../../../../services/education'

const EducationPayments = () => {
  const { t } = useTranslation('application')

  const [getEducationPayments] = useLazyGetEducationInvoiceQuery() as [LazyGetEducationInvoiceQuery]
  const { data, isLoading, isError } = useGetEducationPaymentsQuery() as { data?: EducationPaymentsData, isLoading: boolean, isError: boolean }

  const handleDetails = (purchase: EducationPayment): EducationDetails | undefined => {
    const moduleType = purchase.moduleType
    return moduleType === 'webinar'
      ? purchase.webinarId
      : purchase.courseId
  }

  const handleSuccessAlert = () =>
    dispatch(
      successAlert({
        message: t('application:PROFILE.SUBSCRIPTION.MESSAGE_SUCCESS_INVOICE'),
      }),
    )

  return (
    <Box p={1.5} height="100%">
      <ApiMiddleware isLoading={isLoading} isError={isError}>
      {data?.data?.map((item: EducationPayment) => {
        const details = handleDetails(item)
        const thumbNail = details?.thumbNail
        const title = details?.title
        return (
          <Box
            key={item._id}
            sx={{
              display: { sm: 'grid', xs: 'block' },
              gridAutoFlow: 'column',
              gridTemplateColumns: '120px 1fr 100px',
              gap: 2,
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box>
              <Box
                sx={{
                  borderRadius: 1,
                  width: 120,
                  height: 70,
                  overflow: 'hidden',
                  backgroundColor: (theme) => theme.palette.grey[100],
                  backgroundImage: thumbNail ? `url(${thumbNail})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </Box>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <Box>
                  <Tooltip title={title ?? '-'}>
                    <Typography component="p">{title ?? '-'}</Typography>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    display: {
                      xs: 'content',
                      sm: 'content',
                      md: 'grid',
                    },
                    gridAutoFlow: 'column',
                    justifyContent: 'flex-start',
                    gap: '16px',
                  }}
                >
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{
                      cursor: 'pointer',
                      '& svg': {
                        fill: (theme) => theme.palette.primary.main,
                        marginRight: '4px',
                        verticalAlign: 'sub',
                      },
                    }}
                    onClick={() => {
                      void handleGeneratePdf(
                        item._id,
                        getEducationPayments,
                        handleSuccessAlert,
                      )
                    }}
                  >
                    <FileText size={16} />{' '}
                    {t('application:PROFILE.SUBSCRIPTION.INVOICE')}
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {' '}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : '-'}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textTransform="capitalize"
                  >
                    ({item.moduleType})
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                textAlign: 'right',
              }}
              textTransform="capitalize"
            >
              <Box>{item.amount ? `$${item.amount}` : '-'}</Box>
            </Box>
          </Box>
          )
        })}
      </ApiMiddleware>
    </Box>
  )
}

export default EducationPayments
