import { debounce } from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Search, BookOpen } from 'lucide-react'

import {
  Box,
  Button,
  Tooltip,
  useTheme,
  TextField,
  Typography,
  IconButton,
  ButtonGroup,
} from '@mui/material'

import Style from '../educator-content/style'
import { ACTIVE_BUTTON_CSS } from '../common/common'
import DeleteModal from './create-course/chapter/delete-modal'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
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

  const handleStatusColor = (value) => {
    switch (value) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      default:
        return 'pirmary.main'
    }
  }

  const handleDeleteCourse = async (id) => {
    await updateCourse({ courseId: id, isDeleted: true })
  }

  const columns = [
    {
      accessorKey: 'title',
      header: t('EDUCATOR.COURSES.COURSE_NAME'),
      Cell: (tableProps) => {
        const { row, cell } = tableProps
        return (
          <Box display="flex" gap="10px" alignItems="center">
            {row.original.thumbNail ? (
              <Box
                component="img"
                width="40px"
                height="40px"
                borderRadius="8px"
                src={row.original.thumbNail}
              />
            ) : (
              <Typography
                component="span"
                sx={{
                  width: '40px',
                  height: '40px',
                  padding: '7px',
                  borderRadius: '25px',
                  border: '1px solid',
                  borderColor: theme.palette.grey.light,
                  '& svg': {
                    width: '100%',
                    height: '100%',
                    color: theme.palette.grey.light,
                    fill: theme.palette.grey.light,
                    stroke: theme.palette.grey.light,
                  },
                }}
              >
                <BookOpen size={24} />
              </Typography>
            )}
            <Typography>{cell.getValue() || '-'}</Typography>
          </Box>
        )
      },
    },

    {
      accessorKey: 'category',
      header: t('EDUCATOR.COURSES.EXPERTISE'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Tooltip title={cell.getValue().join(', ') || '-'} arrow>
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
              {cell.getValue().join(', ') || '-'}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('EDUCATOR.COURSES.CREATED_ON'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Typography style={{ whiteSpace: 'pre-line' }}>
            {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'totalPurchased',
      header: t('EDUCATOR.COURSES.TOTAL_PURCHASED'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return <Typography>{cell.getValue() || '-'}</Typography>
      },
    },
    {
      accessorKey: 'status',
      header: t('EDUCATOR.COURSES.STATUS'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Box>
            <Button
              color={handleStatusColor(cell.getValue())}
              variant="outlined"
            >
              {cell.getValue() || '-'}
            </Button>
          </Box>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'view',
      header: t('EDUCATOR.COURSES.VIEW_COURSE'),
      Cell: (tableProps) => {
        const { row } = tableProps
        return (
          <Button
            onClick={() => {
              void navigate('/educator/preview-course', {
                state: { courseId: row?.original?._id, isPreview: true },
              })
            }}
            disabled={row?.original?.status === 'draft'}
          >
            {t('EDUCATOR.COURSES.VIEW_COURSE')}
          </Button>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'action',
      header: t('EDUCATOR.COURSES.ACTION'),
      Cell: (tableProps) => {
        const { row } = tableProps
        return (
          <Box>
            <IconButton>
              <Edit
                size={16}
                onClick={() => {
                  void navigate('/educator/update-course', {
                    state: { courseId: row?.original?._id, isPreview: false },
                  })
                }}
                style={{ cursor: 'pointer' }}
              />
            </IconButton>
            <DeleteModal
              handleDelete={() => handleDeleteCourse(row?.original?._id)}
              message="course"
            />
          </Box>
        )
      },
      enableSorting: false,
    },
  ]

  const tableOptions = {
    enableRowSelection: false,
    getRowId: (row) => row.userId,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enablePagination: false,
    enableBottomToolbar: false,
    enableFilters: false,
    muiTopToolbarProps: {
      sx: {
        display: 'none',
      },
    },
    muiBottomToolbarProps: {
      sx: {
        background: 'none',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        '& .MuiIconButton-root': {
          display: 'none',
        },
      },
    },
  }

  const handleChangeStatus = (value) => {
    setPage(1)
    setStatus(value)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap">
        <Typography variant="h1" textTransform="capitalize">
          {t('EDUCATOR.COURSES.ALL_COURSES')}
        </Typography>
        <Button
          startIcon={<Plus size={16} />}
          onClick={() => { void navigate('/educator/create-course') }}
          variant="outlined"
        >
          {t('EDUCATOR.COURSES.CREATE_COURSES')}
        </Button>
      </Box>
      <Box
        sx={{
          backgroundColor: 'primary.light100',
          p: 1,
          borderRadius: '8px',
        }}
      >
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap="10px"
            mb={1}
          >
            <ButtonGroup color="secondary">
              <Button
                sx={status === '' ? ACTIVE_BUTTON_CSS : null}
                onClick={() => handleChangeStatus('')}
              >
                {t('EDUCATOR.COURSES.ALL')} ({courseCount?.data?.courseCount})
              </Button>
              <Button
                sx={status === 'published' ? ACTIVE_BUTTON_CSS : null}
                onClick={() => handleChangeStatus('published')}
              >
                {t('EDUCATOR.COURSES.PUBLISHED')} (
                {courseCount?.data?.publishedCourseCount})
              </Button>
              <Button
                sx={status === 'draft' ? ACTIVE_BUTTON_CSS : null}
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
                startAdornment: <Search size={16} style={{ color: 'var(--mui-palette-action-disabled)' }} />,
              }}
            />
          </Box>
          <Box>
            <Style>
              <MuiReactTable
                columns={columns}
                rows={coursesData?.data?.courses || []}
                materialReactProps={tableOptions}
              />
            </Style>
            <Box mt={2} textAlign="center">
              {!!coursesData?.data?.courses.length && (
                <PaginationComponent
                  page={page}
                  data={coursesData?.data}
                  setPage={setPage}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Courses
