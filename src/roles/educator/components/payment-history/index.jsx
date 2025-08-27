import { Box, Chip, Button, useTheme, Typography } from '@mui/material'
import { FileDown, DollarSign, Download } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { successAlert } from '../../../../redux/reducers/app-slice'
import { useGetPaymentHistoryQuery, useLazyGenerateInvoiceQuery } from '../../../../services/admin'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import { exportToCSV } from '../../../../utils/globalUtils'

const PaymentHistory = () => {
  const dispatch = useDispatch()

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
        message: 'Invoice downloaded successfully.',
      }),
    )
  }

  const columns = [
    {
      accessorKey: 'transactionId',
      header: 'Transaction ID',
      size: 150,
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Chip
            label={cell.getValue() ? `#${cell.getValue()}` : '-'}
            size="small"
            color="primary"
          />
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Payment Date',
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Typography>
            {cell.getValue() ? new Date(String(cell.getValue())).toLocaleString() : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      size: 120,
      Cell: (tableProps) => {
        const { cell } = tableProps
        const theme = useTheme()
        return (
          <Box display="flex" alignItems="center">
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
      header: 'Invoice',
      size: 140,
      Cell: (tableProps) => {
        const { row, table } = tableProps
        const generateInvoice = table.options.meta?.generateInvoice
        const handleSuccessAlert = table.options.meta?.handleSuccessAlert
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
                    if (response.data) {
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
    getRowId: (row) => row._id || row.userId || '',
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enableStickyHeader: true,
    muiTableContainerProps: {
      sx: {
        height: '100%',
        maxHeight: '100%',
      },
    },
    meta: {
      generateInvoice,
      handleSuccessAlert,
    },
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
          }}
        >
          Payment History
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, md: 0 } }}>
          Track your earnings and payment transactions
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: 'background.light',
          p: 2,
          borderRadius: '12px',
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          boxShadow: (theme) => theme.customShadows.primary,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 320px)',
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
          {!!data?.data?.data?.length && (
            <Box display="flex" gap="10px">
              <Button
                size="small"
                variant="contained"
                startIcon={<Download size={16} />}
                onClick={() => exportToCSV(data?.data?.data || [], 'InvoiceLog.csv')}
              >
                Export Log
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
          <MuiReactTable
            columns={columns}
            rows={data?.data?.data || []}
            materialReactProps={tableOptions}
            returnTableInstance={false}
          />
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          {!!data?.data?.data?.length && (
            <PaginationComponent page={page} data={data?.data} setPage={setPage} />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentHistory
