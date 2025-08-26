import { Box, Chip, Typography, useTheme } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import moment from 'moment-timezone'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useGetWebinarDetailsQuery } from '../../../../../services/admin'
import PaginationComponent from '../../../../../shared/components/ui-elements/pagination-component'

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
        Cell: (tableProps) => {
          const { row } = tableProps
          const thumbnail = row.original.thumbnail || row.original.thumbNail
          return (
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
          )
        },
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 200,
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Typography variant="p" fontWeight={500}>
              {cell.getValue() || '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 250,
        Cell: (tableProps) => {
          const { cell } = tableProps
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
        accessorKey: 'startDate',
        header: 'Schedule',
        size: 180,
        Cell: (tableProps) => {
          const { row } = tableProps
          const { startDate, startTime, endTime } = row.original

          if (!startDate) {
            return <Typography variant="body2">-</Typography>
          }

          const date = moment(startDate).format('MM/DD/YYYY')
          const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : startTime || '-'

          return (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
        Cell: (tableProps) => {
          const { cell } = tableProps
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
        Cell: (tableProps) => {
          const { cell } = tableProps
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
        Cell: (tableProps) => {
          const { cell } = tableProps
          const status = cell.getValue()
          return <Chip label={status || '-'} size="small" color="primary" />
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
            <Box mt={2} display="flex" justifyContent="center">
              <PaginationComponent
                data={{
                  count: webinarDetails.count,
                  totalPages: webinarDetails.totalPages || Math.ceil(webinarDetails.count / 10),
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
          <Typography color="text.secondary">No webinars available</Typography>
        </Box>
      )}
    </Box>
  )
}

// No props to validate for this component
Webinars.propTypes = {}

export default Webinars
