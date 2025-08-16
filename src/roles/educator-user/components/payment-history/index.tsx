import React, { useState } from 'react'
import { FileDown } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Box, Button, Typography } from '@mui/material'

import Style from '../educator-content/style'
import { handleGeneratePdf } from '../common/common'
import { exportToCSV } from '../../../../utils/globalUtils'
import { successAlert } from '../../../../redux/reducers/AppSlice'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import {
  useGetPaymentHistoryQuery,
  useLazyGenerateInvoiceQuery,
} from '../../../../services/admin'

const PaymentHistory = () => {
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
      Cell: (tableProps) => {
        const { cell } = tableProps
        return <Typography>{cell.getValue() ? `#${cell.getValue()}` : '-'}</Typography>
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
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Typography>
            {cell.getValue() ? `$ ${cell.getValue()}` : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'view',
      header: t('education:EDUCATOR.PAYMENT_HISTORY.DOWNLOAD'),
      Cell: (tableProps) => {
        const { row } = tableProps
        return (
          <Button
            startIcon={<FileDown size={16} />}
            onClick={() => {
              void handleGeneratePdf(
                row.original._id,
                generateInvoice,
                handleSuccessAlert,
              )
            }}
            sx={{ textDecoration: 'underline' }}
          >
            {t('education:EDUCATOR.PAYMENT_HISTORY.DOWNLOAD')}
          </Button>
        )
      },
    },
  ]

  const tableOptions = {
    enableRowSelection: false,
    getRowId: (row) => row.userId,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enablePagination: false,
    enableBottomToolbar: false,
    enableFilters: false,
    muiTopToolbarProps: {
      sx: {
        display: 'none',
      },
    },
    muiBottomToolbarProps: {
      sx: {
        background: 'none',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        '& .MuiTableSortLabel-icon': {
          display: 'none',
        },
        '& .MuiIconButton-root': {
          display: 'none',
        },
      },
    },
  }

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h1" textTransform="capitalize">
          {t('education:EDUCATOR.PAYMENT_HISTORY.HEADING')}
        </Typography>
        <Typography variant="body1">
          {t('education:EDUCATOR.PAYMENT_HISTORY.SUB_HEADING')}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: 'primary.light100',
          p: 1,
          borderRadius: '8px',
        }}
      >
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h6" textTransform="capitalize">
              {t('education:EDUCATOR.PAYMENT_HISTORY.PURCHASE_HISTORY')}
            </Typography>
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

          <Box>
            <Style>
              <MuiReactTable
                columns={columns}
                rows={data?.data || []}
                materialReactProps={tableOptions}
              />
            </Style>

            <Box mt={2} textAlign="center">
              {!!data?.data?.length && (
                <PaginationComponent
                  page={page}
                  data={data}
                  setPage={setPage}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentHistory
