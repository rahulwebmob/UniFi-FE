import { Pagination } from '@mui/material'

interface PaginationComponentProps {
  data?:
    | { totalPages?: number; count?: number; [key: string]: unknown }
    | null
    | undefined
  page: number
  setPage: (page: number) => void
  disabled?: boolean
  customStyle?: React.CSSProperties
  scrollToTop?: () => void
}

const PaginationComponent = ({
  data,
  page,
  setPage,
  disabled = false,
  customStyle = {},
  scrollToTop = () => {},
}: PaginationComponentProps) => {
  const pageLimit = data?.count || 0
  const pageCount = Number.isNaN(pageLimit) ? 0 : Math.ceil(pageLimit / 10)

  const handlePageChange = (_: unknown, newPage: number) => {
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
