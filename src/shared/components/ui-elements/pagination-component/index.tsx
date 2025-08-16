import React from 'react'

import { Pagination } from '@mui/material'

import * as Style from '../../../../roles/admin-user/components/tablestyle'

const PaginationComponent = ({
  data,
  page,
  setPage,
  disabled,
  customStyle,
  scrollToTop,
}) => {
  const pageLimit = data?.count || 0
  const pageCount = Number.isNaN(pageLimit) ? 0 : Math.ceil(pageLimit / 10)

  const handlePageChange = (_, newPage) => {
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
