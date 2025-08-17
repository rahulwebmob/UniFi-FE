import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FileDown, DollarSign } from 'lucide-react'
import { type MRT_ColumnDef } from 'material-react-table'

import { Box, Chip, Button, useTheme, Typography } from '@mui/material'

import { exportToCSV } from '../../../../utils/globalUtils'
import { successAlert } from '../../../../redux/reducers/app-slice'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import {
  useGetPaymentHistoryQuery,
  useLazyGenerateInvoiceQuery,
} from '../../../../services/admin'

interface PaymentData {
  transactionId?: string
  createdAt?: string
  amount?: number
  _id?: string
  userId?: string
  [key: string]: unknown
}

const PaymentHistory = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation(['education', 'application'])

  const [page, setPage] = useState(1)
  const [rowSelection, setRowSelection] = useState({})

  const [generateInvoice] = useLazyGenerateInvoiceQuery()
  const { data } = useGetPaymentHistoryQuery(
    { page, pageSize: 10 },
    {
      pollingInterval: 10000,
    },
  )

  const handleSuccessAlert = () => {
    dispatch(
      successAlert({
        message: t('application:PROFILE.SUBSCRIPTION.MESSAGE_SUCCESS_INVOICE'),
      }),
    )
  }

  const columns: MRT_ColumnDef<PaymentData>[] = [
    {
      accessorKey: 'transactionId',
      header: t('education:EDUCATOR.PAYMENT_HISTORY.ID'),
      size: 150,
      Cell: ({ cell }) => {
        return (
          <Chip
            label={cell.getValue() ? `#${cell.getValue()}` : '-'}
            size="small"
            sx={{
              backgroundColor: theme.palette.grey[100],
              fontWeight: 600,
            }}
          />
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('education:EDUCATOR.PAYMENT_HISTORY.PAYMENT_ON'),
      Cell: ({ cell }) => {
        return (
          <Typography style={{ whiteSpace: 'pre-line' }}>
            {cell.getValue()
              ? new Date(String(cell.getValue())).toLocaleString()
              : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: t('education:EDUCATOR.PAYMENT_HISTORY.AMOUNT'),
      size: 120,
      Cell: ({ cell }) => {
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <DollarSign size={16} color={theme.palette.success.main} />
            <Typography
              sx={{
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              {String(cell.getValue() || '-')}
            </Typography>
          </Box>
        )
      },
    },
    {
      accessorKey: 'view',
      header: t('education:EDUCATOR.PAYMENT_HISTORY.DOWNLOAD'),
      size: 140,
      Cell: ({ row }) => {
        return (
          <Button
            size="small"
            variant="contained"
            startIcon={<FileDown size={16} />}
            onClick={() => {
              void (async () => {
                try {
                  const result = generateInvoice({
                    transactionId: row.original._id || '',
                  })
                  if ('unwrap' in result) {
                    const response = await result.unwrap()
                    if (!response.error) {
                      const div = document.createElement('div')
                      div.innerHTML = String(response.data || '')
                      const html2pdf = (await import('html2pdf.js')).default
                      html2pdf()
                        .from(div)
                        .set({
                          margin: 10,
                          filename: `Invoice_${row.original._id}.pdf`,
                          html2canvas: { scale: 2 },
                          jsPDF: { orientation: 'portrait' },
                        })
                        .save()
                        .then(() => {
                          handleSuccessAlert()
                        })
                    }
                  }
                } catch (error) {
                  console.error('Error generating PDF:', error)
                }
              })()
            }}
            sx={{
              textTransform: 'none',
            }}
          >
            Download
          </Button>
        )
      },
      enableSorting: false,
    },
  ]

  const tableOptions = {
    getRowId: (row: PaymentData) => row._id || row.userId || '',
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enableStickyHeader: true,
    muiTableContainerProps: {
      sx: {
        height: 'calc(100vh - 450px)',
        maxHeight: 'calc(100vh - 450px)',
      },
    },
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          Payment History
        </Typography>
        <Typography component="p" color="text.secondary">
          Track your earnings and payment transactions
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: 'background.light',
          p: 2,
          borderRadius: '12px',
          border: `1px solid ${theme.palette.grey[200]}`,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 280px)',
          overflow: 'hidden',
        }}
      >
        <Box
          display="flex"
          alignItems="right"
          justifyContent="flex-end"
          mb={2}
          sx={{ flexShrink: 0 }}
        >
          {!!data?.length && (
            <Box display="flex" gap="10px">
              <Button
                size="small"
                variant="outlined"
                onClick={() => exportToCSV(data || [], 'InvoiceLog.csv')}
              >
                {t('education:EDUCATOR.PAYMENT_HISTORY.EXPORT_LOG')}
              </Button>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <MuiReactTable<PaymentData>
            columns={columns}
            rows={data || []}
            materialReactProps={tableOptions}
          />
        </Box>
        <Box mt={2} textAlign="center" sx={{ flexShrink: 0 }}>
          {!!data?.length && (
            <PaginationComponent page={page} data={{ data: data }} setPage={setPage} />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentHistory
