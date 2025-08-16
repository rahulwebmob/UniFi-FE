import { debounce } from 'lodash'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Search, FileText, ArrowLeft } from 'lucide-react'

import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  ButtonGroup,
} from '@mui/material'

import Style from '../educator-content/style'
import DeleteModal from '../courses/create-course/chapter/delete-modal'
import { ACTIVE_BUTTON_CSS, handleStatusColor } from '../common/common'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import OverflowableCell from '../../../../shared/components/ui-elements/mui-data-grid/overflowable-cell'
import {
  useGetAllWebinarQuery,
  useGetPastWebinarsQuery,
  useUpdateWebinarMutation,
  useGetWebinarsCountQuery,
} from '../../../../services/admin'

const WebinarTable = ({ columns, data, page, setPage }) => {
  const tableOptions = {
    enableRowSelection: false,
    getRowId: (row) => row.userId,
    enablePagination: false,
    enableBottomToolbar: false,
    enableFilters: false,
    muiTopToolbarProps: { sx: { display: 'none' } },
    muiBottomToolbarProps: { sx: { background: 'none' } },
    muiTableHeadCellProps: {
      sx: {
        '& .MuiIconButton-root': { display: 'none' },
      },
    },
  }

  return (
    <>
      <Style>
        <MuiReactTable
          columns={columns}
          rows={data?.data || []}
          materialReactProps={tableOptions}
        />
      </Style>
      {!!data?.data?.length && (
        <Box mt={2} textAlign="center">
          <PaginationComponent page={page} data={data} setPage={setPage} />
        </Box>
      )}
    </>
  )
}

const AllWebinars = ({ page, setPage }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const [status, setStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: webinarData } = useGetAllWebinarQuery(
    { page, searchTerm, pageSize: 10, ...(status ? { status } : {}) },
    { pollingInterval: 5000 },
  )

  const { data: webinarCount } = useGetWebinarsCountQuery(
    {},
    { pollingInterval: 5000 },
  )
  const [updateWebinar] = useUpdateWebinarMutation()

  const debouncedSearch = debounce((value) => {
    setPage(1)
    setSearchTerm(value)
  }, 700)

  const handleDeleteWebinar = async (id) => {
    await updateWebinar({ webinarId: id, isDeleted: true })
  }

  const columns = [
    {
      accessorKey: 'title',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.WEBINAR_NAME'),
      Cell: (tableProps) => {
        const { row, cell } = tableProps
        return (
          <Box display="flex" gap="10px" alignItems="center">
            <Box
              component="img"
              width="40px"
              height="40px"
              borderRadius="8px"
              src={row.original.thumbNail}
            />
            <OverflowableCell maxWidth={200} value={cell.getValue()} />
          </Box>
        )
      },
    },
    {
      accessorKey: 'category',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.CATEGORY'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return <Typography>{cell.getValue()?.join(', ') || '-'}</Typography>
      },
    },
    {
      accessorKey: 'scheduled',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.SCHEDULE'),
      Cell: (tableProps) => {
        const { row } = tableProps
        const { webinarScheduledObj } = row.original
        const joinDate = new Date(
          webinarScheduledObj?.join_date,
        ).toLocaleString()

        return webinarScheduledObj?.can_join ? (
          <Button
            color="primary"
            sx={{ textDecoration: 'underline' }}
            onClick={() => {
              void navigate(`/educator/educator-room/${row.original._id}`)
            }}
          >
            {t('EDUCATOR.WEBINAR.JOIN_NOW')}
          </Button>
        ) : (
          <Typography noWrap>{joinDate.toLocaleString() || '-'}</Typography>
        )
      },
    },
    {
      accessorKey: 'totalEnrolled',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.TOTAL_ENROLLMENT'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return <Typography>{Number(cell.getValue()) || '-'}</Typography>
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.CREATED_AT'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Typography noWrap>
            {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'status',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.STATUS'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Button color={handleStatusColor(cell.getValue())} variant="outlined">
            {cell.getValue() || '-'}
          </Button>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'view',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.VIEW'),
      Cell: (tableProps) => {
        const { row } = tableProps
        return (
          <Button
            color="primary"
            onClick={() => {
              void navigate('/educator/preview-webinar', {
                state: {
                  isPreview: true,
                  webinarId: row.original._id,
                },
              })
            }}
            sx={{ textDecoration: 'underline' }}
          >
            {t('EDUCATOR.WEBINAR.TABLE_HEADER.VIEW')}
          </Button>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'action',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.ACTION'),
      Cell: (tableProps) => {
        const { row } = tableProps
        const { webinarScheduledObj } = row.original
        return (
          <Box>
            <IconButton
              disabled={webinarScheduledObj?.can_join}
              onClick={() => {
                void navigate('/educator/edit-webinar', {
                  state: {
                    isPreview: false,
                    webinarId: row.original._id,
                  },
                })
              }}
            >
              <Edit size={16} />
            </IconButton>
            <DeleteModal
              handleDelete={() => handleDeleteWebinar(row.original._id)}
              message="webinar"
              isDisabled={webinarScheduledObj?.can_join}
            />
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
    <Box
      sx={{ backgroundColor: 'primary.light100', p: 1, borderRadius: '8px' }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap="10px"
        mb={1}
      >
        <ButtonGroup color="secondary">
          {['', 'published'].map((statusKey, index) => (
            <Button
              key={statusKey || 'all'}
              sx={status === statusKey ? ACTIVE_BUTTON_CSS : null}
              onClick={() => handleChangeStatus(statusKey)}
            >
              {
                [t('EDUCATOR.WEBINAR.ALL'), t('EDUCATOR.WEBINAR.PUBLISHED')][
                  index
                ]
              }{' '}
              (
              {
                webinarCount?.data?.[
                  ['allWebinarsCount', 'publishedWebinarsCount'][index]
                ]
              }
              )
            </Button>
          ))}
        </ButtonGroup>
        <TextField
          size="small"
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder={t('EDUCATOR.WEBINAR.SEARCH')}
          InputProps={{ startAdornment: <Search size={16} style={{ color: 'var(--mui-palette-action-disabled)' }} /> }}
        />
      </Box>
      <WebinarTable
        columns={columns}
        data={webinarData?.data}
        page={page}
        setPage={setPage}
      />
    </Box>
  )
}

const PastWebinars = ({ page, setPage }) => {
  const { t } = useTranslation('education')
  const { data } = useGetPastWebinarsQuery(
    { page, pageSize: 10 },
    { pollingInterval: 5000 },
  )

  const columns = [
    {
      accessorKey: 'title',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.WEBINAR_NAME'),
      Cell: (tableProps) => {
        const { row, cell } = tableProps
        return (
          <Box display="flex" gap="10px" alignItems="center">
            <Box
              component="img"
              width="40px"
              height="40px"
              borderRadius="8px"
              src={row.original.thumbNail}
            />
            <Typography>{cell.getValue() || '-'}</Typography>
          </Box>
        )
      },
    },
    {
      accessorKey: 'category',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.CATEGORY'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return <Typography>{cell.getValue()?.join(', ') || '-'}</Typography>
      },
    },
    {
      accessorKey: 'scheduledDate',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.SCHEDULE'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Typography>
            {new Date(cell.getValue()).toLocaleString() || '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.CREATED_AT'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Typography>
            {cell.getValue() ? new Date(cell.getValue()).toLocaleString() : '-'}
          </Typography>
        )
      },
    },
    {
      accessorKey: 'status',
      header: t('EDUCATOR.WEBINAR.TABLE_HEADER.STATUS'),
      Cell: (tableProps) => {
        const { cell } = tableProps
        return (
          <Button color={handleStatusColor(cell.getValue())} variant="outlined">
            {cell.getValue() || '-'}
          </Button>
        )
      },
      enableSorting: false,
    },
  ]

  return (
    <Box
      sx={{ backgroundColor: 'primary.light100', p: 1, borderRadius: '8px' }}
    >
      <WebinarTable
        columns={columns}
        data={data?.data}
        page={page}
        setPage={setPage}
      />
    </Box>
  )
}

const Webinar = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const [page, setPage] = useState(1)
  const [isLogs, setIsLogs] = useState(false)

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap">
        <Typography variant="h1" textTransform="capitalize">
          {isLogs ? t('EDUCATOR.WEBINAR.PAST') : t('EDUCATOR.WEBINAR.ALL')}{' '}
          {t('EDUCATOR.WEBINAR.WEBINARS')}
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button
            startIcon={isLogs ? <ArrowLeft size={16} /> : <FileText size={16} />}
            onClick={() => setIsLogs(!isLogs)}
            variant="contained"
          >
            {isLogs
              ? t('EDUCATOR.COMMON_KEYS.BACK')
              : t('EDUCATOR.WEBINAR.VIEW_LOGS')}
          </Button>
          <Button
            onClick={() => { void navigate('/educator/create-webinar') }}
            startIcon={<Plus size={16} />}
            variant="outlined"
          >
            {t('EDUCATOR.WEBINAR.CREATE_WEBINAR')}
          </Button>
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

export default Webinar
