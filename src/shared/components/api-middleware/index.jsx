import React from 'react'

import Loading from '../loading'
import NoDataFound from '../no-data-found'
import LoadingIssue from '../loading-error'

const ApiMiddleware = ({
  children,
  error,
  isData,
  isLoading,
  text,
  description,
}) => {
  if (isLoading) {
    return <Loading />
  }

  const errorStatus =
    error && 'status' in error && typeof error.status === 'number'
      ? error.status
      : undefined

  if (errorStatus === 500) {
    return <LoadingIssue />
  }

  if (!isData) {
    return <NoDataFound title={text} description={description} />
  }

  return <>{children}</>
}

export default ApiMiddleware