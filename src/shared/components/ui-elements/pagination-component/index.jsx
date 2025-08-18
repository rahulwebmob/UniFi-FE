import { Pagination } from '@mui/material'

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

  const handlePageChange = (_newPage) => {
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

export default PaginationComponent
