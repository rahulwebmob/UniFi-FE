import  { useState } from 'react'
import { FileDown, DollarSign } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Box, Button, Chip, Typography, useTheme } from '@mui/material'

import { handleGeneratePdf } from '../common/common'
import { exportToCSV } from '../../../../Utils/globalUtils'
import { successAlert } from '../../../../Redux/Reducers/AppSlice'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import {
  useGetPaymentHistoryQuery,
  useLazyGenerateInvoiceQuery,
} from '../../../../Services/admin'

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

  const columns = [
    {
      accessorKey: 'transactionId',
      header: t('education:EDUCATOR.PAYMENT_HISTORY.ID'),
      size: 150,
      Cell: (tableProps) => {
        const { cell } = tableProps
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
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Typography style={{ whiteSpace: 'pre-line' }}>
            {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: t('education:EDUCATOR.PAYMENT_HISTORY.AMOUNT'),
      size: 120,
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <DollarSign size={16} color={theme.palette.success.main} />
            <Typography
              sx={{
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              {cell.getValue() || '-'}
            </Typography>
          </Box>
        )
      },
    },
    {
      accessorKey: 'view',
      header: t('education:EDUCATOR.PAYMENT_HISTORY.DOWNLOAD'),
      size: 140,
      Cell: (tableProps) => {
        const { row } = tableProps
        return (
          <Button
            size="small"
            variant="contained"
            startIcon={<FileDown size={16} />}
            onClick={() => {
              void handleGeneratePdf(
                row.original._id,
                generateInvoice,
                handleSuccessAlert,
              )
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
    getRowId: (row) => row.userId,
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
          {!!data?.data?.length && (
            <Box display="flex" gap="10px">
              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  exportToCSV(
                    'InvoiceLog',
                    columns.filter((item) => item.accessorKey !== 'view'),
                    data?.data,
                  )
                }
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
          <MuiReactTable
            columns={columns}
            rows={data?.data || []}
            materialReactProps={tableOptions}
          />
        </Box>
        <Box mt={2} textAlign="center" sx={{ flexShrink: 0 }}>
          {!!data?.data?.length && (
            <PaginationComponent page={page} data={data} setPage={setPage} />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentHistory
