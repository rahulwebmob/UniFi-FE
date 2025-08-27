import {
  Box,
  Chip,
  Menu,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  TextField,
  Typography,
  IconButton,
  ButtonGroup,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { debounce } from 'lodash'
import { Edit, Plus, Search, Trash2, BookOpen, ArrowRight, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  useGetAllCoursesQuery,
  useUpdateCourseMutation,
  useGetCoursesCountQuery,
} from '../../../../services/admin'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'

const Courses = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)

  const [updateCourse] = useUpdateCourseMutation()

  const { data: coursesData } = useGetAllCoursesQuery(
    {
      page,
      searchTerm,
      pageSize: 10,
      ...(status && { status }),
    },
    {
      pollingInterval: 5000,
    },
  )

  const { data: courseCount } = useGetCoursesCountQuery(
    {},
    {
      pollingInterval: 5000,
    },
  )

  const debouncedSearch = debounce((value) => {
    setPage(1)
    setSearchTerm(value)
  }, 700)

  const _handleStatusColor = (value) => {
    switch (value) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      default:
        return 'primary'
    }
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const handleDeleteCourse = async (id) => {
    await updateCourse({ courseId: id })
    handleCloseMenu()
  }

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const columns = [
    {
      accessorKey: 'title',
      header: 'Course Name',
      size: 300,
      Cell: (tableProps) => {
        const { row, cell } = tableProps
        const theme = useTheme()
        return (
          <Box display="flex" gap={2} alignItems="center">
            {row.original.thumbNail ? (
              <Box
                component="img"
                width="40px"
                height="40px"
                borderRadius="8px"
                src={row.original.thumbNail}
                sx={{ objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: theme.palette.grey[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BookOpen size={20} color={theme.palette.grey[400]} />
              </Box>
            )}
            <Tooltip title={String(cell.getValue() || '-')} arrow>
              <Typography
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '240px',
                }}
              >
                {String(cell.getValue() || '-')}
              </Typography>
            </Tooltip>
          </Box>
        )
      },
    },

    {
      accessorKey: 'category',
      header: 'Expertise',
      Cell: (tableProps) => {
        const { cell } = tableProps
        const categories = cell.getValue()
        return (
          <Tooltip title={Array.isArray(categories) ? categories.join(', ') : '-'} arrow>
            <Typography
              variant="body1"
              sx={{
                width: '100%',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                boxSizing: 'border-box',
              }}
            >
              {Array.isArray(categories) && categories.length > 0 ? categories.join(', ') : '-'}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created On',
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Typography style={{ whiteSpace: 'pre-line' }}>
            {cell.getValue() ? new Date(String(cell.getValue())).toLocaleString() : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'totalPurchased',
      header: 'Total Purchased',
      Cell: (tableProps) => {
        const { cell } = tableProps
        return <Typography>{String(cell.getValue() || '-')}</Typography>
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      Cell: (tableProps) => {
        const { cell } = tableProps
        const courseStatus = String(cell.getValue() || '')
        const handleStatusColor = (value) => {
          switch (value) {
            case 'published':
              return 'success'
            case 'draft':
              return 'warning'
            default:
              return 'primary'
          }
        }
        return (
          <Chip
            label={courseStatus || '-'}
            color={handleStatusColor(courseStatus)}
            size="small"
            sx={{
              textTransform: 'capitalize',
            }}
          />
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'view',
      header: 'View Course',
      size: 140,
      Cell: (tableProps) => {
        const { row } = tableProps
        const navigate = useNavigate()
        return (
          <Button
            size="small"
            variant="contained"
            endIcon={<ArrowRight size={16} />}
            onClick={() => {
              void navigate('/educator/preview-course', {
                state: { courseId: row?.original?._id, isPreview: true },
              })
            }}
            disabled={row?.original?.status === 'draft'}
            sx={{
              textTransform: 'none',
              width: 150,
            }}
          >
            View Course
          </Button>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 80,
      Cell: (tableProps) => {
        const { row, table } = tableProps
        const handleOpenMenu = table.options.meta?.handleOpenMenu
        return (
          <Box display="flex" justifyContent="center">
            <IconButton size="small" onClick={(e) => handleOpenMenu(e, row.original)}>
              <MoreVertical size={18} />
            </IconButton>
          </Box>
        )
      },
      enableSorting: false,
    },
  ]

  const tableOptions = {
    getRowId: (row) => row._id || '',
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enableStickyHeader: true,
    muiTableContainerProps: {
      sx: {
        height: '100%',
        maxHeight: '100%',
      },
    },
    meta: {
      handleOpenMenu,
    },
  }

  const handleChangeStatus = (value) => {
    setPage(1)
    setStatus(value)
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
              }}
            >
              All Courses
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, md: 0 } }}>
              Manage and track all your courses in one place
            </Typography>
          </Box>
          <Button
            startIcon={<Plus size={18} />}
            onClick={() => {
              navigate('/educator/create-course')
            }}
            variant="contained"
          >
            Create Course
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: 'background.light',
          p: 2,
          borderRadius: '12px',
          border: `1px solid ${theme.palette.grey[200]}`,
          boxShadow: (theme) => theme.customShadows.primary,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 320px)',
          overflow: 'hidden',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap="10px"
          mb={2}
        >
          <ButtonGroup variant="outlined">
            <Button
              sx={{
                backgroundColor: status === '' ? 'primary.main' : theme.palette.background.paper,
                color: status === '' ? 'primary.contrastText' : 'text.secondary',
                borderColor: status === '' ? 'primary.main' : theme.palette.grey[300],
                '&:hover': {
                  backgroundColor: status === '' ? 'primary.dark' : theme.palette.grey[50],
                  borderColor: status === '' ? 'primary.dark' : theme.palette.grey[400],
                },
              }}
              onClick={() => handleChangeStatus('')}
            >
              All ({courseCount?.data?.courseCount || 0})
            </Button>
            <Button
              sx={{
                backgroundColor:
                  status === 'published' ? 'primary.main' : theme.palette.background.paper,
                color: status === 'published' ? 'primary.contrastText' : 'text.secondary',
                borderColor: status === 'published' ? 'primary.main' : theme.palette.grey[300],
                '&:hover': {
                  backgroundColor: status === 'published' ? 'primary.dark' : theme.palette.grey[50],
                  borderColor: status === 'published' ? 'primary.dark' : theme.palette.grey[400],
                },
              }}
              onClick={() => handleChangeStatus('published')}
            >
              Published ({courseCount?.data?.publishedCourseCount || 0})
            </Button>
            <Button
              sx={{
                backgroundColor:
                  status === 'draft' ? 'primary.main' : theme.palette.background.paper,
                color: status === 'draft' ? 'primary.contrastText' : 'text.secondary',
                borderColor: status === 'draft' ? 'primary.main' : theme.palette.grey[300],
                '&:hover': {
                  backgroundColor: status === 'draft' ? 'primary.dark' : theme.palette.grey[50],
                  borderColor: status === 'draft' ? 'primary.dark' : theme.palette.grey[400],
                },
              }}
              onClick={() => setStatus('draft')}
            >
              Draft ({courseCount?.data?.draftCourseCount || 0})
            </Button>
          </ButtonGroup>
          <TextField
            size="small"
            onChange={(e) => {
              debouncedSearch(e.target.value)
            }}
            placeholder="Search courses..."
            sx={{
              minWidth: 250,
              backgroundColor: theme.palette.background.paper,
            }}
            InputProps={{
              startAdornment: (
                <Search size={16} style={{ marginRight: 8, color: theme.palette.grey[500] }} />
              ),
            }}
          />
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
            rows={coursesData?.data?.courses || []}
            materialReactProps={tableOptions}
            returnTableInstance={false}
          />
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          {!!coursesData?.data?.courses.length && (
            <PaginationComponent page={page} data={coursesData?.data} setPage={setPage} />
          )}
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            void navigate('/educator/update-course', {
              state: { courseId: selectedRow?._id, isPreview: false },
            })
            handleCloseMenu()
          }}
        >
          <ListItemIcon>
            <Edit size={16} style={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <ListItemText
            primary="Edit Course"
            primaryTypographyProps={{
              style: { color: theme.palette.primary.main },
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedRow?._id) {
              handleDeleteCourse(selectedRow._id)
            }
          }}
        >
          <ListItemIcon>
            <Trash2 size={16} style={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete Course"
            primaryTypographyProps={{
              style: { color: theme.palette.error.main },
            }}
          />
        </MenuItem>
      </Menu>
    </Box>
  )
}

Courses.propTypes = {}

export default Courses
