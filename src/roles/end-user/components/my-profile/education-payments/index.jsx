import { useMemo, useCallback } from 'react'
import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Box, Typography, Chip, useTheme, Button } from '@mui/material'

import ApiMiddleware from '../../../../../shared/components/api-middleware'
import MuiReactTable from '../../../../../shared/components/ui-elements/mui-react-table'
import { successAlert } from '../../../../../redux/reducers/app-slice'
import { handleGeneratePdf } from '../../../../admin-user/components/common'
import {
  useGetEducationPaymentsQuery,
  useLazyGetEducationInvoiceQuery,
} from '../../../../../services/education'

const EducationPayments = () => {
  const theme = useTheme()
  const { t } = useTranslation('application')
  const dispatch = useDispatch()

  const [getEducationInvoice] = useLazyGetEducationInvoiceQuery()
  const { data, isLoading, error } = useGetEducationPaymentsQuery({})

  const handleSuccessAlert = useCallback(
    () =>
      dispatch(
        successAlert({
          message: t(
            'application:PROFILE.SUBSCRIPTION.MESSAGE_SUCCESS_INVOICE',
          ),
        }),
      ),
    [dispatch, t],
  )

  const handleGetEducationInvoice = useCallback(
    (transactionId) => {
      void handleGeneratePdf(
        transactionId,
        (params) =>
          getEducationInvoice({
            invoiceId: params.transactionId,
          }),
        handleSuccessAlert,
      )
    },
    [getEducationInvoice, handleSuccessAlert],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'content',
        header: 'Content',
        Cell: ({ row }) => {
          const item = row.original
          let thumbnail = null
          let title = ''

          if (item.moduleType === 'course' && item.courseId) {
            thumbnail =
              item.courseId.thumbnail || item.courseId.thumbNail || null
            title = item.courseId.title
          } else if (item.moduleType === 'webinar' && item.webinarId) {
            thumbnail =
              item.webinarId.thumbnail || item.webinarId.thumbNail || null
            title = item.webinarId.title
          } else {
            title = `${item.moduleType} Payment`
          }

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 60,
                  height: 40,
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: (theme) => theme.palette.grey[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="thumbnail"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {item.moduleType}
                  </Typography>
                )}
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>
              </Box>
            </Box>
          )
        },
      },
      {
        accessorKey: 'moduleType',
        header: 'Content Type',
        Cell: ({ row }) => {
          const item = row.original
          return (
            <Chip
              label={item.moduleType}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ textTransform: 'capitalize' }}
            />
          )
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        Cell: ({ row }) => {
          const item = row.original
          return (
            <Typography variant="body2" fontWeight="medium">
              ${item.amount} {item.currency || 'USD'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        Cell: ({ row }) => {
          const item = row.original
          return (
            <Typography variant="body2">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'actions',
        header: 'Invoice',
        enableSorting: false,
        Cell: ({ row }) => {
          const item = row.original
          return (
            <Button
              variant="text"
              color="primary"
              startIcon={<FileText size={16} />}
              onClick={() => handleGetEducationInvoice(item._id)}
            >
              {t('application:PROFILE.SUBSCRIPTION.INVOICE')}
            </Button>
          )
        },
      },
    ],
    [t, handleGetEducationInvoice],
  )

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2.5,
          color: theme.palette.text.primary,
        }}
      >
        {t('application:PROFILE.EDUCATION_PAYMENTS')}
      </Typography>

      <Box>
        <ApiMiddleware
          isLoading={isLoading}
          error={error}
          isData={!!data?.length}
        >
          <MuiReactTable
            columns={columns}
            rows={data || []}
            materialReactProps={{
              enableTopToolbar: false,
              enableBottomToolbar: false,
              enablePagination: false,
              enableSorting: true,
              enableColumnActions: false,
              enableColumnFilters: false,
              enableDensityToggle: false,
              enableFullScreenToggle: false,
              enableHiding: false,
            }}
          />
        </ApiMiddleware>
      </Box>
    </>
  )
}

export default EducationPayments
