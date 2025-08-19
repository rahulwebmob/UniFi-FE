import { Box, Chip, Typography, useTheme } from '@mui/material'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useGetAllCoursesDetailsQuery } from '../../../../../../services/admin'
import PaginationComponent from '../../../../../../shared/components/ui-elements/pagination-component'

// Extracted Cell components
const ThumbnailCell = ({ cell, theme }) => {
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
}

ThumbnailCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.object.isRequired,
}

const TitleCell = ({ cell }) => (
  <Typography sx={{ fontWeight: 500 }}>{cell.getValue() || '-'}</Typography>
)

TitleCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
}

const DescriptionCell = ({ cell }) => {
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
}

DescriptionCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
}

const CategoryCell = ({ cell }) => {
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
}

CategoryCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
}

const PriceCell = ({ cell, theme }) => {
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
}

PriceCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
  theme: PropTypes.object.isRequired,
}

const PurchasesCell = ({ cell }) => {
  const purchased = cell.getValue()
  return (
    <Typography variant="body2">
      {purchased || 0} {purchased === 1 ? 'purchase' : 'purchases'}
    </Typography>
  )
}

PurchasesCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
}

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

  const renderThumbnailCell = useCallback(
    ({ cell }) => <ThumbnailCell cell={cell} theme={theme} />,
    [theme],
  )

  const renderPriceCell = useCallback(
    ({ cell }) => <PriceCell cell={cell} theme={theme} />,
    [theme],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'thumbNail',
        header: 'Thumbnail',
        size: 100,
        Cell: renderThumbnailCell,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 200,
        Cell: TitleCell,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 250,
        Cell: DescriptionCell,
      },
      {
        accessorKey: 'category',
        header: 'Categories',
        size: 200,
        Cell: CategoryCell,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 100,
        Cell: renderPriceCell,
      },
      {
        accessorKey: 'totalPurchased',
        header: 'Purchases',
        size: 120,
        Cell: PurchasesCell,
      },
    ],
    [renderThumbnailCell, renderPriceCell],
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

// No props to validate for this component
Courses.propTypes = {}

export default Courses
