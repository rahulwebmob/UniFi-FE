import { Box, Typography, Chip, Button } from '@mui/material'
import { FileText } from 'lucide-react'
import { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { successAlert } from '../../../../../redux/reducers/app-slice'
import {
  useGetEducationPaymentsQuery,
  useLazyGetEducationInvoiceQuery,
} from '../../../../../services/education'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import MuiReactTable from '../../../../../shared/components/ui-elements/mui-react-table'
import { handleGeneratePdf } from '../../../../admin/helper/common'

const Payments = () => {
  const dispatch = useDispatch()

  const [getEducationInvoice] = useLazyGetEducationInvoiceQuery()
  const { data, isLoading, error } = useGetEducationPaymentsQuery({})

  const handleSuccessAlert = useCallback(
    () =>
      dispatch(
        successAlert({
          message: 'Invoice downloaded successfully',
        }),
      ),
    [dispatch],
  )

  const handleGetEducationInvoice = useCallback(
    (transactionId) => {
      handleGeneratePdf(
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
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original: item } = row
          let thumbnail = null
          let title = ''

          if (item.moduleType === 'course' && item.courseId) {
            const {
              thumbnail: courseThumbnail,
              thumbNail: courseThumbNail,
              title: courseTitle,
            } = item.courseId
            thumbnail = courseThumbnail || courseThumbNail || null
            title = courseTitle
          } else if (item.moduleType === 'webinar' && item.webinarId) {
            const {
              thumbnail: webinarThumbnail,
              thumbNail: webinarThumbNail,
              title: webinarTitle,
            } = item.webinarId
            thumbnail = webinarThumbnail || webinarThumbNail || null
            title = webinarTitle
          } else {
            title = `${item.moduleType} Payment`
          }

          return (
            <Box display="flex" alignItems="center" gap={1.5}>
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
              <Box minWidth={0} flex={1}>
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
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original: item } = row
          return (
            <Chip
              label={item.moduleType}
              size="small"
              variant="outlined"
              sx={{ textTransform: 'capitalize' }}
            />
          )
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original: item } = row
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
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original: item } = row
          return (
            <Typography variant="body2">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'actions',
        header: 'Invoice',
        enableSorting: false,
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original: item } = row
          return (
            <Button
              variant="text"
              startIcon={<FileText size={16} />}
              onClick={() => handleGetEducationInvoice(item._id)}
            >
              Invoice
            </Button>
          )
        },
      },
    ],
    [handleGetEducationInvoice],
  )

  return (
    <>
      <Typography variant="h6" mb={2.5}>
        Payment History
      </Typography>

      <Box>
        <ApiMiddleware isLoading={isLoading} error={error} isData={!!data?.length}>
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
              muiTableContainerProps: {
                sx: {
                  maxHeight: 'calc(100vh - 400px)',
                  minHeight: '300px',
                  '& .MuiPaper-root': {
                    maxHeight: '100%',
                  },
                },
              },
              muiTablePaperProps: {
                sx: {
                  boxShadow: 'none',
                },
              },
            }}
          />
        </ApiMiddleware>
      </Box>
    </>
  )
}

export default Payments
