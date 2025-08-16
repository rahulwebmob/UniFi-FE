import { Pagination } from '@mui/material'

import * as Style from '../../../../roles/admin-user/components/tablestyle'

interface PaginationComponentProps {
  data: any
  page: number
  setPage: (page: number) => void
  disabled: boolean
  customStyle: any
  scrollToTop: () => void
}

const PaginationComponent = ({
  data,
  page,
  setPage,
  disabled,
  customStyle,
  scrollToTop,
}: PaginationComponentProps) => {
  const pageLimit = data?.count || 0
  const pageCount = Number.isNaN(pageLimit) ? 0 : Math.ceil(pageLimit / 10)

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
    scrollToTop()
  }
  return (
    <Style.PaginationBar>
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
    </Style.PaginationBar>
  )
}

export default PaginationComponent
