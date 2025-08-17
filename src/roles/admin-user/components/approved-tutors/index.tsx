import type { ChangeEvent } from 'react'

import { debounce } from 'lodash'
import { useMemo, useState } from 'react'
import { User, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table'

import {
  Box,
  alpha,
  Button,
  useTheme,
  InputBase,
  Typography,
} from '@mui/material'

import { useGetApprovedTutorQuery } from '../../../../services/admin'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'

interface Expertise {
  category: string
}

interface ApprovedBy {
  firstName: string
  lastName: string
}

interface TutorData {
  _id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  expertise?: Expertise[]
  lastLoginAt?: string
  approvedDate?: string
  approvedBy?: ApprovedBy
}

interface ApprovedTutorResponse {
  data: TutorData[]
  totalPages?: number
  count?: number
  [key: string]: unknown
}

const ApprovedTtutors: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  const { data: ApprovedTutor } = useGetApprovedTutorQuery({
    page,
    pageSize: 10,
    search,
  }) as { data: ApprovedTutorResponse | undefined }

  const debouncedSearch = debounce((value: string) => {
    setPage(1)
    setSearch(value)
  }, 700)

  const columns = useMemo<MRT_ColumnDef<TutorData>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Name',
        Cell: ({ row }) => (
          <Typography component="span">
            {`${row.original.firstName} ${row.original.lastName}`}
          </Typography>
        ),
      },
      { accessorKey: 'email', header: 'Email Address' },
      {
        accessorKey: 'expertise',
        header: 'Expertise',
        Cell: ({ row }) => {
          const { original } = row
          return (
            <Typography>
              {original.expertise?.length
                ? original.expertise.map((item) => item.category).join(', ')
                : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'lastLoginAt',
        header: 'Last Active',
        Cell: ({ cell }) => {
          const value = cell.getValue() as string | undefined
          return (
            <Typography component="span">
              {value ? new Date(value).toLocaleString() : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'approvedDate',
        header: 'Approved On',
        Cell: ({ cell }) => {
          const value = cell.getValue() as string | undefined
          return (
            <Typography component="span">
              {value ? new Date(value).toLocaleString() : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'approvedBy',
        header: 'Approved By',
        Cell: ({ row }) => {
          const { original } = row
          const firstName = original.approvedBy?.firstName ?? ''
          const lastName = original.approvedBy?.lastName ?? ''
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
        Cell: ({ row }) => {
          const tutorId = row.original._id
          return (
            <Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<User size={16} />}
                onClick={() =>
                  void navigate(`/admin/approved-tutors/${tutorId}`)
                }
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
        },
        enableSorting: false,
      },
    ],
    [navigate],
  )

  const table = useMaterialReactTable({
    columns,
    data: ApprovedTutor?.data ?? [],
    getRowId: (row: TutorData) => row.userId,
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
          <Search
            size={20}
            style={{ color: 'text.secondary', marginRight: 12 }}
          />
          <InputBase
            placeholder="Search tutors..."
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              debouncedSearch(e.target.value)
            }
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
          data={ApprovedTutor || { totalPages: 0 }}
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
