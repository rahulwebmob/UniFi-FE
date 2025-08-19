import { Box, alpha, Button, useTheme, InputBase, Typography } from '@mui/material'
import { debounce } from 'lodash'
import { User, Search } from 'lucide-react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import PropTypes from 'prop-types'
import { useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetApprovedTutorQuery } from '../../../../services/admin'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'

// Extracted Cell components to fix react/no-unstable-nested-components
const NameCell = ({ row }) => (
  <Typography component="span">{`${row.original.firstName} ${row.original.lastName}`}</Typography>
)

NameCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

const ExpertiseCell = ({ row }) => {
  const { original } = row
  return (
    <Typography>
      {original.expertise?.length
        ? original.expertise.map((item) => item.category).join(', ')
        : '-'}
    </Typography>
  )
}

ExpertiseCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      expertise: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
  }).isRequired,
}

const DateCell = ({ cell }) => {
  const value = cell.getValue()
  return <Typography component="span">{value ? new Date(value).toLocaleString() : '-'}</Typography>
}

DateCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
}

const ApprovedByCell = ({ row }) => {
  const { original } = row
  const firstName = original.approvedBy?.firstName ?? ''
  const lastName = original.approvedBy?.lastName ?? ''
  return <Typography>{firstName && lastName ? `${firstName} ${lastName}` : '-'}</Typography>
}

ApprovedByCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      approvedBy: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
}

const ActionCell = ({ row, navigate }) => {
  const tutorId = row.original._id
  return (
    <Box>
      <Button
        variant="contained"
        size="small"
        startIcon={<User size={16} />}
        onClick={() => void navigate(`/admin/approved-tutors/${tutorId}`)}
        sx={{
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        }}
      >
        View Profile
      </Button>
    </Box>
  )
}

ActionCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
}

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

  const renderActionCell = useCallback(
    ({ row }) => <ActionCell row={row} navigate={navigate} />,
    [navigate],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Name',
        Cell: NameCell,
      },
      { accessorKey: 'email', header: 'Email Address' },
      {
        accessorKey: 'expertise',
        header: 'Expertise',
        Cell: ExpertiseCell,
      },
      {
        accessorKey: 'lastLoginAt',
        header: 'Last Active',
        Cell: DateCell,
      },
      {
        accessorKey: 'approvedDate',
        header: 'Approved On',
        Cell: DateCell,
      },
      {
        accessorKey: 'approvedBy',
        header: 'Approved By',
        Cell: ApprovedByCell,
      },
      {
        accessorKey: 'action',
        header: 'Action',
        Cell: renderActionCell,
        enableSorting: false,
      },
    ],
    [renderActionCell],
  )

  const table = useMaterialReactTable({
    columns,
    data: ApprovedTutor?.data ?? [],
    getRowId: (row) => row._id,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
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

      <MaterialReactTable table={table} />

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <PaginationComponent
          data={ApprovedTutor}
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

export default ApprovedTtutors
