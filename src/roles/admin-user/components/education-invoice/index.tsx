import { FileDown } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMemo, useState, useCallback } from 'react'
import { MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'

import { Box, Paper, alpha, Button, useTheme, Typography } from '@mui/material'

import { handleGeneratePdf } from '../common'
import { successAlert } from '../../../../Redux/Reducers/AppSlice'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import {
  useGetEducationAdminInvoiceQuery,
  useLazyDownloadAdminInvoiceQuery,
} from '../../../../Services/admin'

interface InvoiceUser {
  email?: string
  lastName?: string
  firstName?: string
}

interface InvoiceItem {
  _id: string
  amount: number
  createdAt: string
  moduleType: string
  userId: InvoiceUser
  educatorId: InvoiceUser
}

interface InvoiceData {
  data: InvoiceItem[]
  totalPages?: number
}

interface ProcessedInvoice {
  _id: string
  amount: number
  createdAt: string
  moduleType: string
  userEmail?: string
  lastName?: string
  firstName?: string
  educatorEmail?: string
  userId?: string
}

const EducationInvoice = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const { t } = useTranslation('application')

  const [downloadAdminInvoice] = useLazyDownloadAdminInvoiceQuery()
  const { data } = useGetEducationAdminInvoiceQuery({ page, pageSize: 10 }) as { 
    data: InvoiceData | undefined 
  }

  const columnsList = useMemo<ProcessedInvoice[] | undefined>(
    () =>
      data?.data.map((item) => ({
        _id: item?._id,
        amount: item?.amount,
        createdAt: item?.createdAt,
        moduleType: item?.moduleType,
        userEmail: item?.userId?.email,
        lastName: item?.userId?.lastName,
        firstName: item?.userId?.firstName,
        educatorEmail: item?.educatorId?.email,
        userId: item?._id
      })),
    [data?.data],
  )

  const handleSuccessAlert = useCallback(() => {
    dispatch(
      successAlert({
        message: t('application:PROFILE.SUBSCRIPTION.MESSAGE_SUCCESS_INVOICE'),
      }),
    )
  }, [dispatch, t])

  const columns = useMemo<MRT_ColumnDef<ProcessedInvoice>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Purchased By',
        Cell: (tableProps) => {
          const { row } = tableProps
          return (
            <Typography component="span">{`${row.original.firstName ?? '-'} ${
              row.original.lastName ?? '-'
            }`}</Typography>
          )
        },
      },
      {
        accessorKey: 'userEmail',
        header: 'User Email',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Typography component="span">{cell.getValue() ?? '-'}</Typography>
          )
        },
      },
      {
        accessorKey: 'educatorEmail',
        header: 'Educator Email',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Typography component="span">{cell.getValue() ?? '-'}</Typography>
          )
        },
      },
      {
        accessorKey: 'moduleType',
        header: 'Purchase Type',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Typography
              sx={{
                textTransform: 'capitalize',
              }}
              component="span"
            >
              {cell.getValue() ?? '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'amount',
        header: 'Purchase Amount',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Typography component="span">
              {cell.getValue() ? `$${cell.getValue()}` : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Purchased Time',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Typography>
              {cell?.getValue()
                ? new Date(cell?.getValue()).toLocaleString()
                : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        Cell: (tableProps) => {
          const { row } = tableProps
          return (
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDown size={16} />}
              onClick={() =>
                void handleGeneratePdf(
                  row.original._id,
                  downloadAdminInvoice,
                  handleSuccessAlert,
                )
              }
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                fontWeight: 500,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              Download
            </Button>
          )
        },
        enableSorting: false,
      },
    ],
    [downloadAdminInvoice, handleSuccessAlert, theme.palette.primary.main],
  )

  const table = useMaterialReactTable({
    columns,
    data: columnsList ?? [],
    getRowId: (row) => row.userId,
    enablePagination: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableGlobalFilter: false,
    enableHiding: false,
    muiTopToolbarProps: {
      sx: {
        display: 'none',
      },
    },
    muiTablePaperProps: {
      sx: {
        boxShadow: 'none',
        background: 'transparent',
      },
    },
    muiBottomToolbarProps: {
      sx: {
        display: 'none',
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: 'fixed',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 600,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: 14,
      },
    },
  })

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
          background: theme.palette.background.paper,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Invoices
          </Typography>
          <Typography component="p" color="text.secondary">
            Manage and download transaction invoices
          </Typography>
        </Box>
      </Paper>

      <Paper>
        <MaterialReactTable table={table} />
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <PaginationComponent data={data} page={page} setPage={setPage} disabled={undefined} customStyle={undefined} scrollToTop={undefined} />
      </Box>
    </Box>
  )
}

export default EducationInvoice
