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
      variant="outlined"
      color="primary"
      boundaryCount={4}
      size="medium"
      sx={customStyle}
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
