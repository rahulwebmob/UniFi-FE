import { Box, Button, TextField, Typography } from '@mui/material'
import { debounce } from 'lodash'
import { Search, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetApprovedTutorQuery } from '../../../../services/admin'
import ApiMiddleware from '../../../../shared/components/api-middleware'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'

const ApprovedTutors = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const {
    data: ApprovedTutor,
    isLoading,
    error,
  } = useGetApprovedTutorQuery({
    page,
    pageSize: 10,
    search,
  })

  const debouncedSearch = debounce((value) => {
    setPage(1)
    setSearch(value)
  }, 700)

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Name',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original } = row
          return (
            <Typography variant="body2">
              {`${original?.firstName || ''} ${original?.lastName || ''}`.trim() || '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return <Typography variant="body2">{cell.getValue() || '-'}</Typography>
        },
      },
      {
        accessorKey: 'expertise',
        header: 'Expertise',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original } = row
          return (
            <Typography variant="body2">
              {original?.expertise?.length
                ? original?.expertise?.map((item) => item.category).join(', ')
                : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'lastLoginAt',
        header: 'Last Active',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2">
                {cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : '-'}
              </Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'approvedDate',
        header: 'Approved On',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2">
                {cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : '-'}
              </Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'approvedBy',
        header: 'Approved By',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original } = row
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2">
                {original?.approvedBy
                  ? `${original?.approvedBy?.firstName || ''} ${original?.approvedBy?.lastName || ''}`.trim()
                  : '-'}
              </Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original } = row
          const tutorId = original._id
          return (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<User size={14} />}
              onClick={() => navigate(`/admin/approved-tutors/${tutorId}`)}
            >
              View Profile
            </Button>
          )
        },
        enableSorting: false,
      },
    ],
    [navigate],
  )

  return (
    <ApiMiddleware
      error={error}
      isLoading={isLoading}
      isData={!!ApprovedTutor?.data?.length}
      text="No Approved Tutors Found"
      description="There are no approved tutors at the moment."
    >
      <Box>
        <Box mb={3}>
          <Typography variant="h4" mb={0.5}>
            Approved Tutors
          </Typography>
          <Typography color="text.secondary">Manage and view approved tutors</Typography>
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <TextField
              size="small"
              placeholder="Search tutors..."
              onChange={(e) => debouncedSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
              }}
              sx={{ width: 250 }}
            />
          </Box>

          <MuiReactTable
            columns={columns}
            rows={ApprovedTutor?.data ?? []}
            height="auto"
            materialReactProps={{
              enableRowSelection: false,
              enableColumnActions: false,
              enableDensityToggle: false,
              enableFullScreenToggle: false,
            }}
          />

          <Box mt={2} display="flex" justifyContent="center">
            <PaginationComponent data={ApprovedTutor} page={page} setPage={setPage} />
          </Box>
        </Box>
      </Box>
    </ApiMiddleware>
  )
}

export default ApprovedTutors
