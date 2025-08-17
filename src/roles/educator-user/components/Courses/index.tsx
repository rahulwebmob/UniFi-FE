import { debounce } from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Edit,
  Plus,
  Search,
  Trash2,
  BookOpen,
  ArrowRight,
  MoreVertical,
} from 'lucide-react'

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

import type { MRT_ColumnDef } from 'material-react-table'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'

interface CourseTableData {
  thumbNail?: string
  title?: string
  status?: string
  _id?: string
  category?: string[]
  createdAt?: string
  totalPurchased?: number
  [key: string]: unknown
}

import {
  useGetAllCoursesQuery,
  useUpdateCourseMutation,
  useGetCoursesCountQuery,
} from '../../../../services/admin'

const Courses = () => {
  const theme = useTheme()
  const { t } = useTranslation('education')
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [selectedRow, setSelectedRow] = useState<CourseTableData | null>(null)

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

  const debouncedSearch = debounce((value: string) => {
    setPage(1)
    setSearchTerm(value)
  }, 700)

  const handleStatusColor = (value: string) => {
    switch (value) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      default:
        return 'primary'
    }
  }

  const handleDeleteCourse = async (id: string) => {
    await updateCourse({ courseId: id, isDeleted: true })
    handleCloseMenu()
  }

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: CourseTableData,
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const columns: MRT_ColumnDef<CourseTableData>[] = [
    {
      accessorKey: 'title',
      header: t('EDUCATOR.COURSES.COURSE_NAME'),
      size: 300,
      Cell: ({ row, cell }) => {
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
      header: t('EDUCATOR.COURSES.EXPERTISE'),
      Cell: ({ cell }) => {
        const categories = cell.getValue() as string[] | undefined
        return (
          <Tooltip
            title={Array.isArray(categories) ? categories.join(', ') : '-'}
            arrow
          >
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
              {Array.isArray(categories) ? categories.join(', ') : '-'}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('EDUCATOR.COURSES.CREATED_ON'),
      Cell: ({ cell }) => {
        return (
          <Typography style={{ whiteSpace: 'pre-line' }}>
            {cell.getValue()
              ? new Date(String(cell.getValue())).toLocaleString()
              : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'totalPurchased',
      header: t('EDUCATOR.COURSES.TOTAL_PURCHASED'),
      Cell: ({ cell }) => {
        return <Typography>{String(cell.getValue() || '-')}</Typography>
      },
    },
    {
      accessorKey: 'status',
      header: t('EDUCATOR.COURSES.STATUS'),
      size: 120,
      Cell: ({ cell }) => {
        const courseStatus = String(cell.getValue() || '')
        return (
          <Chip
            label={courseStatus || '-'}
            color={handleStatusColor(courseStatus)}
            size="small"
            sx={{
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          />
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'view',
      header: t('EDUCATOR.COURSES.VIEW_COURSE'),
      size: 140,
      Cell: ({ row }) => {
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
      header: t('EDUCATOR.COURSES.ACTION'),
      size: 80,
      Cell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <IconButton
              size="small"
              onClick={(e) => handleOpenMenu(e, row.original)}
            >
              <MoreVertical size={18} />
            </IconButton>
          </Box>
        )
      },
      enableSorting: false,
    },
  ]

  const tableOptions = {
    getRowId: (row: CourseTableData) => row._id || '',
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enableStickyHeader: true,
    muiTableContainerProps: {
      sx: {
        height: '100%',
        maxHeight: '100%',
      },
    },
  }

  const handleChangeStatus = (value: string) => {
    setPage(1)
    setStatus(value)
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          mb={2}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              All Courses
            </Typography>
            <Typography component="p" color="text.secondary">
              Manage and track all your courses in one place
            </Typography>
          </Box>
          <Button
            startIcon={<Plus size={16} />}
            onClick={() => {
              void navigate('/educator/create-course')
            }}
            variant="contained"
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            {t('EDUCATOR.COURSES.CREATE_COURSES')}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          p: 2,
          borderRadius: '12px',
          border: (thm) => `1px solid ${thm.palette.grey[200]}`,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 280px)',
          overflow: 'hidden',
          backgroundColor: 'background.light',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap="10px"
          mb={2}
          sx={{ flexShrink: 0 }}
        >
          <ButtonGroup
            sx={{
              '& .MuiButton-root:not(:last-child)': { borderRight: 'none' },
            }}
          >
            <Button
              sx={{
                backgroundColor: status === '' ? 'primary.main' : 'transparent',
                color: status === '' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor:
                    status === '' ? 'primary.dark' : 'action.hover',
                },
              }}
              onClick={() => handleChangeStatus('')}
            >
              {t('EDUCATOR.COURSES.ALL')} ({courseCount?.data?.courseCount})
            </Button>
            <Button
              sx={{
                backgroundColor:
                  status === 'published' ? 'primary.main' : 'transparent',
                color: status === 'published' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor:
                    status === 'published' ? 'primary.dark' : 'action.hover',
                },
              }}
              onClick={() => handleChangeStatus('published')}
            >
              {t('EDUCATOR.COURSES.PUBLISHED')} (
              {courseCount?.data?.publishedCourseCount})
            </Button>
            <Button
              sx={{
                backgroundColor:
                  status === 'draft' ? 'primary.main' : 'transparent',
                color: status === 'draft' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor:
                    status === 'draft' ? 'primary.dark' : 'action.hover',
                },
              }}
              onClick={() => setStatus('draft')}
            >
              {t('EDUCATOR.COURSES.DRAFT')} (
              {courseCount?.data?.draftCourseCount})
            </Button>
          </ButtonGroup>
          <TextField
            size="small"
            onChange={(e) => {
              debouncedSearch(e.target.value)
            }}
            placeholder={t('EDUCATOR.COURSES.SEARCH')}
            InputProps={{
              startAdornment: (
                <Search
                  size={16}
                  style={{ color: 'var(--mui-palette-action-disabled)' }}
                />
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
          <MuiReactTable<CourseTableData>
            columns={columns}
            rows={coursesData?.data?.courses || []}
            materialReactProps={tableOptions}
            localization={{}}
            returnTableInstance={false}
          />
        </Box>
        <Box mt={2} textAlign="center" sx={{ flexShrink: 0 }}>
          {!!coursesData?.data?.courses.length && (
            <PaginationComponent
              page={page}
              data={coursesData?.data}
              setPage={setPage}
            />
          )}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            void navigate('/educator/update-course', {
              state: { courseId: selectedRow?._id, isPreview: false },
            })
            handleCloseMenu()
          }}
        >
          <ListItemIcon>
            <Edit size={16} />
          </ListItemIcon>
          <ListItemText>Edit Course</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedRow?._id) {
              void handleDeleteCourse(selectedRow._id)
            }
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Trash2 size={16} color="currentColor" />
          </ListItemIcon>
          <ListItemText>Delete Course</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Courses
