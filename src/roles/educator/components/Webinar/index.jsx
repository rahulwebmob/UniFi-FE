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
import {
  Edit,
  Plus,
  Video,
  Search,
  Trash2,
  FileText,
  ArrowLeft,
  ArrowRight,
  MoreVertical,
} from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  useGetAllWebinarQuery,
  useGetPastWebinarsQuery,
  useUpdateWebinarMutation,
  useGetWebinarsCountQuery,
} from '../../../../services/admin'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'

const WebinarTable = ({ columns, data, page, setPage }) => {
  const tableOptions = {
    getRowId: (row) => row._id,
    enableStickyHeader: true,
    muiTableContainerProps: {
      sx: {
        height: '100%',
        maxHeight: '100%',
      },
    },
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <MuiReactTable columns={columns} rows={data.data || []} materialReactProps={tableOptions} />
      </Box>
      <Box mt={2} textAlign="center" sx={{ flexShrink: 0 }}>
        {!!data.data?.length && <PaginationComponent page={page} data={data} setPage={setPage} />}
      </Box>
    </Box>
  )
}

WebinarTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.shape({
    data: PropTypes.array,
  }).isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
}

const AllWebinars = ({ page, setPage }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const [status, setStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)

  const { data: webinarData } = useGetAllWebinarQuery(
    {
      page,
      search: searchTerm,
      pageSize: 10,
      ...(status ? { status } : {}),
    },
    { pollingInterval: 5000 },
  )

  const { data: webinarCount } = useGetWebinarsCountQuery({}, { pollingInterval: 5000 })
  const [updateWebinar] = useUpdateWebinarMutation()

  const debouncedSearch = debounce((value) => {
    setPage(1)
    setSearchTerm(value)
  }, 700)

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const handleDeleteWebinar = async (id) => {
    await updateWebinar({ webinarId: id })
    handleCloseMenu()
  }

  const handleOpenMenu = (event, row) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const columns = [
    {
      accessorKey: 'title',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.WEBINAR_NAME'),
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
                <Video size={20} color={theme.palette.grey[400]} />
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
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.CATEGORY'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        const categories = cell.getValue()
        const categoryText = Array.isArray(categories) ? categories.join(', ') : '-'
        return (
          <Tooltip title={categoryText} arrow>
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
              {categoryText}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: 'scheduled',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.SCHEDULE'),
      Cell: (tableProps) => {
        const { row } = tableProps
        const { t } = useTranslation('education')
        const navigate = useNavigate()
        const { webinarScheduledObj } = row.original
        const joinDate = webinarScheduledObj?.join_date
          ? new Date(webinarScheduledObj.join_date).toLocaleString()
          : '-'

        return webinarScheduledObj?.can_join ? (
          <Chip
            label={t('EDUCATOR.WEBINAR.JOIN_NOW')}
            color="success"
            size="small"
            onClick={() => {
              void navigate(`/educator/educator-room/${row.original._id}`)
            }}
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
            }}
          />
        ) : (
          <Typography style={{ whiteSpace: 'pre-line' }}>{joinDate || '-'}</Typography>
        )
      },
    },
    {
      accessorKey: 'totalEnrolled',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.TOTAL_ENROLLMENT'),
      Cell: (tableProps) => {
        const { row } = tableProps
        return <Typography>{row.original.totalEnrolled || '-'}</Typography>
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.CREATED_AT'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        const dateValue = cell.getValue()
        return (
          <Typography style={{ whiteSpace: 'pre-line' }}>
            {dateValue ? new Date(dateValue).toLocaleString() : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'status',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.STATUS'),
      size: 120,
      Cell: (tableProps) => {
        const { row } = tableProps
        const { status } = row.original
        const handleStatusColor = (value) => {
          switch (value) {
            case 'published':
              return 'success'
            case 'draft':
              return 'warning'
            case 'scheduled':
              return 'info'
            default:
              return 'default'
          }
        }
        return (
          <Chip
            label={status || '-'}
            color={handleStatusColor(status || '')}
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
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.VIEW_WEBINAR'),
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
              void navigate('/educator/preview-webinar', {
                state: {
                  isPreview: true,
                  webinarId: row.original._id,
                },
              })
            }}
            disabled={row?.original?.status === 'draft'}
            sx={{
              textTransform: 'none',
            }}
          >
            View Webinar
          </Button>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'action',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.ACTION'),
      size: 80,
      Cell: (tableProps) => {
        const { row } = tableProps
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

  const handleChangeStatus = (value) => {
    setPage(1)
    setStatus(value)
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.light',
          p: 2,
          borderRadius: '12px',
          border: `1px solid ${theme.palette.grey[200]}`,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 280px)',
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
          sx={{ flexShrink: 0 }}
        >
          <ButtonGroup
            sx={{
              '& .MuiButton-root:not(:last-child)': { borderRight: 'none' },
            }}
          >
            {['', 'published'].map((statusKey, index) => (
              <Button
                key={statusKey || 'all'}
                sx={{
                  backgroundColor: status === statusKey ? 'primary.main' : 'transparent',
                  color: status === statusKey ? 'white' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: status === statusKey ? 'primary.dark' : 'action.hover',
                  },
                }}
                onClick={() => handleChangeStatus(statusKey)}
              >
                {[t('EDUCATOR.WEBINAR.ALL'), t('EDUCATOR.WEBINAR.PUBLISHED')][index]} (
                {webinarCount?.data?.[['allWebinarsCount', 'publishedWebinarsCount'][index]]})
              </Button>
            ))}
          </ButtonGroup>
          <TextField
            size="small"
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder={t('EDUCATOR.WEBINAR.SEARCH')}
            InputProps={{
              startAdornment: (
                <Search size={16} style={{ color: 'var(--mui-palette-action-disabled)' }} />
              ),
            }}
          />
        </Box>
        <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <WebinarTable
            columns={columns}
            data={webinarData || { data: [] }}
            page={page}
            setPage={setPage}
          />
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
            void navigate('/educator/edit-webinar', {
              state: {
                isPreview: false,
                webinarId: selectedRow?._id,
              },
            })
            handleCloseMenu()
          }}
          disabled={selectedRow?.webinarScheduledObj?.can_join}
        >
          <ListItemIcon>
            <Edit size={16} />
          </ListItemIcon>
          <ListItemText>Edit Webinar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedRow?._id) {
              void handleDeleteWebinar(selectedRow._id)
            }
          }}
          sx={{ color: 'error.main' }}
          disabled={selectedRow?.webinarScheduledObj?.can_join}
        >
          <ListItemIcon>
            <Trash2 size={16} color="currentColor" />
          </ListItemIcon>
          <ListItemText>Delete Webinar</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

AllWebinars.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
}

const PastWebinars = ({ page, setPage }) => {
  const theme = useTheme()
  const { t } = useTranslation('education')
  const { data } = useGetPastWebinarsQuery({ page, pageSize: 10 }, { pollingInterval: 5000 })

  const columns = [
    {
      accessorKey: 'title',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.WEBINAR_NAME'),
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
                <Video size={20} color={theme.palette.grey[400]} />
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
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.CATEGORY'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        const categories = cell.getValue()
        const categoryText = Array.isArray(categories) ? categories.join(', ') : '-'
        return (
          <Tooltip title={categoryText} arrow>
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
              {categoryText}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: 'scheduledDate',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.SCHEDULE'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        const dateValue = cell.getValue()
        return (
          <Typography style={{ whiteSpace: 'pre-line' }}>
            {dateValue ? new Date(dateValue).toLocaleString() : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.CREATED_AT'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        const dateValue = cell.getValue()
        return (
          <Typography style={{ whiteSpace: 'pre-line' }}>
            {dateValue ? new Date(dateValue).toLocaleString() : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'status',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.STATUS'),
      size: 120,
      Cell: (tableProps) => {
        const { row } = tableProps
        const { status } = row.original
        const handleStatusColor = (value) => {
          switch (value) {
            case 'completed':
              return 'success'
            case 'cancelled':
              return 'error'
            default:
              return 'default'
          }
        }
        return (
          <Chip
            label={status || '-'}
            color={handleStatusColor(status || '')}
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
  ]

  return (
    <Box
      sx={{
        backgroundColor: 'background.light',
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${theme.palette.grey[200]}`,
        height: 'calc(100vh - 280px)',
        overflow: 'hidden',
      }}
    >
      <WebinarTable
        columns={columns}
        data={data?.data || { data: [] }}
        page={page}
        setPage={setPage}
      />
    </Box>
  )
}

PastWebinars.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
}

const Webinar = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const [page, setPage] = useState(1)
  const [isLogs, setIsLogs] = useState(false)

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
              {isLogs ? 'Past' : 'All'} Webinars
            </Typography>
            <Typography component="p" color="text.secondary">
              {isLogs ? 'View your completed webinar history' : 'Manage and schedule your webinars'}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Button
              startIcon={isLogs ? <ArrowLeft size={16} /> : <FileText size={16} />}
              onClick={() => setIsLogs(!isLogs)}
              variant="outlined"
            >
              {isLogs ? t('EDUCATOR.COMMON_KEYS.BACK') : t('EDUCATOR.WEBINAR.VIEW_LOGS')}
            </Button>
            <Button
              onClick={() => {
                void navigate('/educator/create-webinar')
              }}
              startIcon={<Plus size={16} />}
              variant="contained"
            >
              {t('EDUCATOR.WEBINAR.CREATE_WEBINAR')}
            </Button>
          </Box>
        </Box>
      </Box>
      {isLogs ? (
        <PastWebinars page={page} setPage={setPage} />
      ) : (
        <AllWebinars page={page} setPage={setPage} />
      )}
    </Box>
  )
}

Webinar.propTypes = {}

export default Webinar
