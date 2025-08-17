import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Box, Tooltip, Typography } from '@mui/material'

import ApiMiddleware from '../../../../../shared/components/api-middleware'
import { successAlert } from '../../../../../redux/reducers/app-slice'
import { handleGeneratePdf } from '../../../../admin-user/components/common'
import {
  useGetEducationPaymentsQuery,
  useLazyGetEducationInvoiceQuery,
} from '../../../../../services/education'
import type { PaymentHistory } from '../../../../../types/api.types'

const EducationPayments = () => {
  const { t } = useTranslation('application')
  const dispatch = useDispatch()

  const [getEducationInvoice] = useLazyGetEducationInvoiceQuery()
  const { data, isLoading, error } = useGetEducationPaymentsQuery({})

  console.log(data)

  const getDisplayName = (item: PaymentHistory): string => {
    return item.description || `${item.itemType} Payment`
  }

  const handleSuccessAlert = () =>
    dispatch(
      successAlert({
        message: t('application:PROFILE.SUBSCRIPTION.MESSAGE_SUCCESS_INVOICE'),
      }),
    )

  const educationInvoiceWrapper = (params: { transactionId: string }) => {
    const result = getEducationInvoice({ invoiceId: params.transactionId })
    return result as unknown as {
      unwrap: () => Promise<{ error: boolean; data: string }>
    }
  }

  return (
    <Box p={1.5} height="100%">
      <ApiMiddleware
        isLoading={isLoading}
        error={error}
        isData={!!data?.length}
      >
        {data?.map((item: PaymentHistory) => {
          const displayName = getDisplayName(item)
          return (
            <Box
              key={item.id}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {item.itemType}
                  </Typography>
                </Box>
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
                    <Tooltip title={displayName}>
                      <Typography component="p">{displayName}</Typography>
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
                          item.id,
                          educationInvoiceWrapper,
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
                      ({item.itemType})
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
                <Box>
                  ${item.amount} {item.currency}
                </Box>
              </Box>
            </Box>
          )
        })}
      </ApiMiddleware>
    </Box>
  )
}

export default EducationPayments
