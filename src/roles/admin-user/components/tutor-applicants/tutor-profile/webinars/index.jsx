import moment from 'moment-timezone'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

import { Box, Chip, Typography, useTheme } from '@mui/material'

import { useGetWebinarDetailsQuery } from '../../../../../../services/admin'
import PaginationComponent from '../../../../../../shared/components/ui-elements/pagination-component'

const Webinars = () => {
  const theme = useTheme()
  const { id } = useParams()
  const [page, setPage] = useState(1)

  const { data: webinarDetails } = useGetWebinarDetailsQuery(
    {
      educatorId: id || '',
      page,
      limit: 10,
    },
    {
      skip: !id,
    },
  )

  const webinarsData = webinarDetails?.webinars ?? []

  const columns = useMemo(
    () => [
      {
        accessorKey: 'thumbnail',
        header: 'Thumbnail',
        size: 100,
        Cell: ({ row }) => {
          const thumbnail = row.original.thumbnail || row.original.thumbNail
          return thumbnail ? (
            <Box
              component="img"
              src={thumbnail}
              alt="Webinar thumbnail"
              sx={{
                width: 80,
                height: 60,
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          ) : (
            <Box
              sx={{
                width: 80,
                height: 60,
                backgroundColor: theme.palette.grey[200],
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                No Image
              </Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 200,
        Cell: ({ cell }) => (
          <Typography sx={{ fontWeight: 500 }}>
            {cell.getValue() || '-'}
          </Typography>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 250,
        Cell: ({ cell }) => {
          const description = cell.getValue()
          return (
            <Typography
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={description}
            >
              {description || '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'category',
        header: 'Categories',
        size: 200,
        Cell: ({ cell }) => {
          const categories = cell.getValue()
          return categories?.length ? (
            <Box display="flex" gap={0.5} flexWrap="wrap">
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size="small"
                  variant="filled"
                  color="primary"
                  sx={{
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2">-</Typography>
          )
        },
      },
      {
        accessorKey: 'startDate',
        header: 'Schedule',
        size: 180,
        Cell: ({ row }) => {
          const { startDate, startTime, endTime } = row.original

          if (!startDate) {
            return <Typography variant="body2">-</Typography>
          }

          const date = moment(startDate).format('MM/DD/YYYY')
          const timeRange =
            startTime && endTime
              ? `${startTime} - ${endTime}`
              : startTime || '-'

          return (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {date}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {timeRange}
              </Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 100,
        Cell: ({ cell }) => {
          const price = cell.getValue()
          return (
            <Typography
              sx={{
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              ${price || 0}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'totalEnrolled',
        header: 'Enrollments',
        size: 120,
        Cell: ({ cell }) => {
          const enrolled = cell.getValue()
          return (
            <Typography variant="body2">
              {enrolled || 0} {enrolled === 1 ? 'enrollment' : 'enrollments'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        Cell: ({ cell }) => {
          const status = cell.getValue()
          const getStatusColor = () => {
            switch (status?.toLowerCase()) {
              case 'completed':
                return 'success'
              case 'expired':
                return 'error'
              case 'scheduled':
                return 'info'
              case 'live':
                return 'warning'
              default:
                return 'default'
            }
          }
          return (
            <Chip
              label={status || '-'}
              size="small"
              color={getStatusColor()}
              sx={{
                textTransform: 'capitalize',
                fontWeight: 500,
                borderRadius: '6px',
              }}
            />
          )
        },
      },
    ],
    [theme],
  )

  const table = useMaterialReactTable({
    columns,
    data: webinarsData,
    getRowId: (row) => row._id,
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
    enableRowSelection: false,
    muiTableProps: {
      sx: {
        tableLayout: 'fixed',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
      },
    },
  })

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: theme.palette.text.primary,
        }}
      >
        Webinars
      </Typography>

      {webinarsData.length > 0 ? (
        <>
          <MaterialReactTable table={table} />
          {webinarDetails && webinarDetails.count && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <PaginationComponent
                data={{
                  count: webinarDetails.count,
                  totalPages:
                    webinarDetails.totalPages ||
                    Math.ceil(webinarDetails.count / 10),
                }}
                page={page}
                setPage={setPage}
              />
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No webinars available
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default Webinars
