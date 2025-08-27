import { Pagination } from '@mui/material'
import PropTypes from 'prop-types'

const PaginationComponent = ({
  data,
  page,
  setPage,
  disabled = false,
  customStyle = {},
  scrollToTop = () => {},
}) => {
  const pageLimit = data?.count || 0
  const pageCount = Number.isNaN(pageLimit) ? 0 : Math.ceil(pageLimit / 10)

  const handlePageChange = (_, newPage) => {
    setPage(newPage)
    scrollToTop()
  }
  return (
    <Pagination
      disabled={disabled}
      page={page}
      count={pageCount}
      onChange={handlePageChange}
      variant="text"
      color="primary"
      boundaryCount={4}
      size="medium"
      sx={{
        '& .MuiPaginationItem-root': {
          borderRadius: 1,
          fontWeight: 500,
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
          '&.Mui-selected': {
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
          },
        },
        '& .MuiPaginationItem-ellipsis': {
          opacity: 0.6,
        },
        '& .MuiPaginationItem-previousNext': {
          backgroundColor: (theme) => theme.palette.action.hover,
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.selected,
          },
        },
        ...customStyle,
      }}
    />
  )
}

PaginationComponent.propTypes = {
  data: PropTypes.shape({
    count: PropTypes.number,
  }),
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  customStyle: PropTypes.object,
  scrollToTop: PropTypes.func,
}

export default PaginationComponent
