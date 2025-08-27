import { Box, Chip, Button, Typography } from '@mui/material'
import { FileDown, Calendar } from 'lucide-react'
import { useMemo, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { successAlert } from '../../../../redux/reducers/app-slice'
import {
  useGetEducationAdminInvoiceQuery,
  useLazyDownloadAdminInvoiceQuery,
} from '../../../../services/admin'
import ApiMiddleware from '../../../../shared/components/api-middleware'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import { generateInvoicePdf } from '../../../../utils/globalUtils'

const AdminInvoices = () => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)

  const [downloadAdminInvoice] = useLazyDownloadAdminInvoiceQuery()
  const { data, isLoading, error } = useGetEducationAdminInvoiceQuery({ page, pageSize: 10 })

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
        message: 'Invoice downloaded successfully.',
      }),
    )
  }, [dispatch])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Purchased By',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { firstName, lastName } = row.original
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2">
                {`${firstName || ''} ${lastName || ''}`.trim() || '-'}
              </Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'userEmail',
        header: 'User Email',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2">{cell.getValue() || '-'}</Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'educatorEmail',
        header: 'Educator Email',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2">{cell.getValue() || '-'}</Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'moduleType',
        header: 'Purchase Type',
        Cell: (tableProps) => {
          const { cell } = tableProps
          const moduleType = cell.getValue()
          return moduleType ? (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Chip label={moduleType} size="small" color="primary" />
            </Box>
          ) : (
            <Typography variant="body2">-</Typography>
          )
        },
      },
      {
        accessorKey: 'amount',
        header: 'Purchase Amount',
        Cell: (tableProps) => {
          const { cell } = tableProps
          const amount = cell.getValue()
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2" fontWeight={600} color="success.main">
                {amount ? `$${amount}` : '-'}
              </Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Purchased Time',
        Cell: (tableProps) => {
          const { cell } = tableProps
          const value = cell.getValue()
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Calendar size={14} />
              <Typography variant="body2">
                {value ? new Date(value).toLocaleDateString() : '-'}
              </Typography>
            </Box>
          )
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
              startIcon={<FileDown size={14} />}
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

  return (
    <ApiMiddleware
      error={error}
      isLoading={isLoading}
      isData={!!columnsList?.length}
      text="No Invoices Found"
      description="There are no invoices available at the moment."
    >
      <Box>
        <Box mb={3}>
          <Typography variant="h4" mb={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              Invoices
            </Box>
          </Typography>
          <Typography color="text.secondary">Manage and download transaction invoices</Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 1,
            backgroundColor: (theme) => theme.palette.background.light,
            boxShadow: (theme) => theme.customShadows.primary,
          }}
        >
          <MuiReactTable
            columns={columns}
            rows={columnsList ?? []}
            height="auto"
            materialReactProps={{
              getRowId: (row) => row.userId || '',
              enableColumnActions: false,
              enableDensityToggle: false,
              enableFullScreenToggle: false,
              meta: {
                downloadAdminInvoice,
                handleSuccessAlert,
              },
            }}
          />

          <Box mt={2} display="flex" justifyContent="center">
            <PaginationComponent
              data={{ count: data?.data?.count }}
              page={page}
              setPage={setPage}
            />
          </Box>
        </Box>
      </Box>
    </ApiMiddleware>
  )
}

export default AdminInvoices
