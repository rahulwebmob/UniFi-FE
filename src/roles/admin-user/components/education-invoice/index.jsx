import { Box, Chip, alpha, Button, useTheme, Typography } from '@mui/material'
import { FileDown } from 'lucide-react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { successAlert } from '../../../../redux/reducers/app-slice'
import {
  useGetEducationAdminInvoiceQuery,
  useLazyDownloadAdminInvoiceQuery,
} from '../../../../services/admin'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import { generateInvoicePdf } from '../../../../utils/globalUtils'

const EducationInvoice = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const { t } = useTranslation('application')

  const [downloadAdminInvoice] = useLazyDownloadAdminInvoiceQuery()
  const { data } = useGetEducationAdminInvoiceQuery({ page, pageSize: 10 })

  const columnsList = useMemo(
    () =>
      data?.data?.data?.map((item) => ({
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
    [data?.data?.data],
  )

  const handleSuccessAlert = useCallback(() => {
    dispatch(
      successAlert({
        message: t('application:PROFILE.SUBSCRIPTION.MESSAGE_SUCCESS_INVOICE'),
      }),
    )
  }, [dispatch, t])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Purchased By',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { firstName, lastName } = row.original
          return <Typography>{`${firstName || ''} ${lastName || ''}`.trim() || '-'}</Typography>
        },
      },
      {
        accessorKey: 'userEmail',
        header: 'User Email',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return <Typography>{cell.getValue() || '-'}</Typography>
        },
      },
      {
        accessorKey: 'educatorEmail',
        header: 'Educator Email',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return <Typography>{cell.getValue() || '-'}</Typography>
        },
      },
      {
        accessorKey: 'moduleType',
        header: 'Purchase Type',
        Cell: (tableProps) => {
          const { cell } = tableProps
          const theme = useTheme()
          const moduleType = cell.getValue()
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
          const theme = useTheme()
          const amount = cell.getValue()
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
          const value = cell.getValue()
          return <Typography>{value ? new Date(value).toLocaleString() : '-'}</Typography>
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        Cell: (tableProps) => {
          const { row, table } = tableProps
          const downloadAdminInvoice = table.options.meta?.downloadAdminInvoice
          const handleSuccessAlert = table.options.meta?.handleSuccessAlert
          return (
            <Button
              variant="contained"
              size="small"
              startIcon={<FileDown size={16} />}
              onClick={() => {
                void (async () => {
                  try {
                    const result = downloadAdminInvoice({
                      transactionId: row.original._id,
                    })
                    if ('unwrap' in result) {
                      const response = await result.unwrap()
                      if (response.data) {
                        await generateInvoicePdf(
                          response.data,
                          row.original._id,
                          handleSuccessAlert,
                          (error) => {
                            console.error('Error generating PDF:', error)
                          },
                        )
                      }
                    }
                  } catch (error) {
                    console.error('Error downloading invoice:', error)
                  }
                })()
              }}
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
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data: columnsList ?? [],
    getRowId: (row) => row.userId || '',
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
    meta: {
      downloadAdminInvoice,
      handleSuccessAlert,
    },
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
          data={
            data?.data
              ? {
                  count: data.data.count,
                  totalPages: Math.ceil(data.data.count / 10),
                }
              : undefined
          }
          page={page}
          setPage={setPage}
          disabled={false}
          customStyle={{}}
          scrollToTop={() => window.scrollTo(0, 0)}
        />
      </Box>
    </Box>
  )
}

export default EducationInvoice
