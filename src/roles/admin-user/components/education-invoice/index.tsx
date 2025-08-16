import { FileDown } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMemo, useState, useCallback } from 'react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table'

import { Box, Chip, alpha, Button, useTheme, Typography } from '@mui/material'

import { handleGeneratePdf } from '../common'
import { successAlert } from '../../../../redux/reducers/app-slice'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import {
  useGetEducationAdminInvoiceQuery,
  useLazyDownloadAdminInvoiceQuery,
} from '../../../../services/admin'

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

const EducationInvoice: React.FC = () => {
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
        _id: item._id,
        amount: item.amount,
        createdAt: item.createdAt,
        moduleType: item.moduleType,
        userEmail: item.userId?.email,
        lastName: item.userId?.lastName,
        firstName: item.userId?.firstName,
        educatorEmail: item.educatorId?.email,
        userId: item._id,
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
          const moduleType = cell.getValue<string>()
          return moduleType ? (
            <Chip
              label={moduleType}
              size="small"
              sx={{
                textTransform: 'capitalize',
                fontWeight: 500,
                borderRadius: '6px',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            />
          ) : (
            <Typography component="span">-</Typography>
          )
        },
      },
      {
        accessorKey: 'amount',
        header: 'Purchase Amount',
        Cell: (tableProps) => {
          const { cell } = tableProps
          const amount = cell.getValue<number>()
          return (
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              {amount ? `$${amount}` : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Purchased Time',
        Cell: (tableProps) => {
          const { cell } = tableProps
          const value = cell.getValue<string>()
          return (
            <Typography>
              {value ? new Date(value).toLocaleString() : '-'}
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
              variant="contained"
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
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Download
            </Button>
          )
        },
        enableSorting: false,
      },
    ],
    [
      downloadAdminInvoice,
      handleSuccessAlert,
      theme.palette.primary.main,
      theme.palette.success.main,
    ],
  )

  const table = useMaterialReactTable({
    columns,
    data: columnsList ?? [],
    getRowId: (row) => row.userId,
    enablePagination: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableGlobalFilter: false,
    enableHiding: false,
  })

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            color: theme.palette.primary.main,
          }}
        >
          Invoices
        </Typography>
        <Typography component="p" color="text.secondary">
          Manage and download transaction invoices
        </Typography>
      </Box>

      <MaterialReactTable table={table} />

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <PaginationComponent
          data={data}
          page={page}
          setPage={setPage}
          disabled={undefined}
          customStyle={undefined}
          scrollToTop={undefined}
        />
      </Box>
    </Box>
  )
}

export default EducationInvoice
