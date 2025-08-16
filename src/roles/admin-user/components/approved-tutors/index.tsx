import { debounce } from 'lodash'
import { User, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import React, { useMemo, useState } from 'react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

import { Box, Paper, alpha, Button, useTheme, InputBase, Typography } from '@mui/material'

import { useGetApprovedTutorQuery } from '../../../../Services/admin'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'

const ApprovedTtutors = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  const { data: ApprovedTutor } = useGetApprovedTutorQuery({
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
        Cell: ({ cell }) => (
          <Typography component="span">
            {`${cell?.row?.original?.firstName} ${cell?.row?.original?.lastName}`}
          </Typography>
        ),
      },
      { accessorKey: 'email', header: 'Email Address' },
      {
        accessorKey: 'expertise',
        header: 'Expertise',
        Cell: (props) => {
          const { original } = props?.row ?? {}
          return (
            <Typography>
              {original?.expertise?.length
                ? original.expertise.map((item) => item.category).join(', ')
                : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'lastLoginAt',
        header: 'Last Active',
        Cell: ({ cell }) => (
          <Typography component="span">
            {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : '-'}
          </Typography>
        ),
      },
      {
        accessorKey: 'approvedDate',
        header: 'Approved On',
        Cell: ({ cell }) => (
          <Typography component="span">
            {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : '-'}
          </Typography>
        ),
      },
      {
        accessorKey: 'approvedBy',
        header: 'Approved By',
        Cell: (props) => {
          const { original } = props?.row ?? {}
          const firstName = original?.approvedBy?.firstName ?? ''
          const lastName = original?.approvedBy?.lastName ?? ''
          return (
            <Typography>
              {firstName && lastName ? `${firstName} ${lastName}` : '-'}
            </Typography>
          )
        },
      },

      {
        accessorKey: 'action',
        header: 'Action',
        Cell: ({ cell }) => {
          const tutorId = cell.row.original._id
          return (
            <Box>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<User size={16} />}
                onClick={() => void navigate(`/admin/approved-tutors/${tutorId}`)}
                sx={{
                  textTransform: 'none',
                  borderRadius: 1,
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                View Profile
              </Button>
            </Box>
          )
        },
        enableSorting: false,
      },
    ],
    [navigate, theme.palette.primary.main],
  )

  const table = useMaterialReactTable({
    columns,
    data: ApprovedTutor?.data ?? [],
    getRowId: (row) => row.userId,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
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
      <Box
        sx={{
          display: { xs: 'column', sm: 'flex' },
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: alpha(theme.palette.grey[500], 0.08),
            borderRadius: 1.5,
            px: 2,
            py: 1,
            minWidth: 250,
            transition: 'all 0.2s',
            border: `1px solid transparent`,
            '&:hover': {
              bgcolor: alpha(theme.palette.grey[500], 0.12),
              borderColor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <Search size={20} style={{ color: 'text.secondary', marginRight: 12 }} />
          <InputBase
            placeholder="Search tutors..."
            onChange={(e) => debouncedSearch(e.target.value)}
            sx={{
              flex: 1,
              '& input': { fontSize: 14 },
            }}
          />
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
          overflow: 'hidden',
          background: theme.palette.background.light || theme.palette.grey[50],
          '& .MuiPaper-root': {
            boxShadow: 'none',
            background: 'transparent',
          },
          '& .MuiTableContainer-root': {
            background: 'transparent',
          },
          '& .MuiTableHead-root': {
            background: 'transparent',
            '& .MuiTableCell-head': {
              fontWeight: 600,
              fontSize: 14,
              color: theme.palette.text.primary,
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              background: 'transparent',
              py: 2,
            },
          },
          '& .MuiTableBody-root': {
            background: 'transparent',
            '& .MuiTableRow-root': {
              background: 'transparent',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transform: 'scale(1.002)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              },
              '& .MuiTableCell-root': {
                fontSize: 14,
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
              },
              '&:last-child .MuiTableCell-root': {
                borderBottom: 'none',
              },
            },
          },
          '& .MuiCheckbox-root': {
            color: theme.palette.primary.main,
          },
          '& .MuiTablePagination-root': {
            borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
          },
        }}
      >
        <MaterialReactTable table={table} />
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <PaginationComponent
          data={ApprovedTutor}
          page={page}
          setPage={setPage}
        />
      </Box>
    </Box>
  )
}

export default ApprovedTtutors
