import { Box, Chip, Typography, useTheme } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useGetAllCoursesDetailsQuery } from '../../../../../../services/admin'
import PaginationComponent from '../../../../../../shared/components/ui-elements/pagination-component'

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
        Cell: ({ cell }) => {
          const thumbnail = cell.getValue()
          return thumbnail ? (
            <Box
              component="img"
              src={thumbnail}
              alt="Course thumbnail"
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
          <Typography sx={{ fontWeight: 500 }}>{cell.getValue() || '-'}</Typography>
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
                  variant="outlined"
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
        accessorKey: 'totalPurchased',
        header: 'Purchases',
        size: 120,
        Cell: ({ cell }) => {
          const purchased = cell.getValue()
          return (
            <Typography variant="body2">
              {purchased || 0} {purchased === 1 ? 'purchase' : 'purchases'}
            </Typography>
          )
        },
      },
    ],
    [theme],
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
          fontWeight: 600,
          mb: 2,
          color: theme.palette.text.primary,
        }}
      >
        Courses
      </Typography>

      {coursesData.length > 0 ? (
        <>
          <MaterialReactTable table={table} />
          {coursesDetails?.data && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <PaginationComponent data={coursesDetails.data} page={page} setPage={setPage} />
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
            No courses available
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default Courses
