import { Box, Typography, useTheme } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useGetAllCoursesDetailsQuery } from '../../../../../services/admin'
import PaginationComponent from '../../../../../shared/components/ui-elements/pagination-component'

const Courses = () => {
  const theme = useTheme()
  const { id } = useParams()
  const [page, setPage] = useState(1)

  const { data: coursesDetails } = useGetAllCoursesDetailsQuery(
    {
      educatorId: id || '',
      page,
      limit: 10,
    },
    {
      skip: !id,
    },
  )

  const coursesData = coursesDetails?.data?.courses ?? []

  const columns = useMemo(
    () => [
      {
        accessorKey: 'thumbNail',
        header: 'Thumbnail',
        size: 100,
        Cell: (tableProps) => {
          const { cell } = tableProps
          const thumbnail = cell.getValue()
          return (
            <Box
              component="img"
              src={thumbnail || ''}
              alt="Course thumbnail"
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
        accessorKey: 'price',
        header: 'Price',
        size: 100,
        Cell: (tableProps) => {
          const { cell } = tableProps
          const price = cell.getValue()
          return (
            <Typography
              variant="p"
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
        accessorKey: 'totalPurchased',
        header: 'Purchases',
        size: 120,
        Cell: (tableProps) => {
          const { cell } = tableProps
          const purchases = cell.getValue()
          return (
            <Typography variant="body2">
              {purchases || 0} {purchases === 1 ? 'purchase' : 'purchases'}
            </Typography>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data: coursesData,
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
          mb: 2,
        }}
      >
        Courses
      </Typography>

      <MaterialReactTable table={table} />
      {coursesDetails?.data && (
        <Box mt={2} display="flex" justifyContent="center">
          <PaginationComponent data={coursesDetails.data} page={page} setPage={setPage} />
        </Box>
      )}
    </Box>
  )
}

// No props to validate for this component
Courses.propTypes = {}

export default Courses
