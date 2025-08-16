import type { ReactNode } from 'react';

import React from 'react'

import Loading from '../loading/Loading'
import NoDataFound from '../no-data-found'
import LoadingIssue from '../loading-error/LoadingError'

interface ApiMiddlewareProps {
  children: ReactNode
  error?: { status?: number }
  isData: boolean
  isLoading: boolean
  text?: string
  description?: string
}

const ApiMiddleware: React.FC<ApiMiddlewareProps> = ({
  children,
  error,
  isData,
  isLoading,
  text,
  description,
}) => {
  const iff = <T,>(condition: boolean, then: T, otherwise: T): T => (condition ? then : otherwise)

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        iff(
          error?.status === 500,
          <LoadingIssue />,
          iff(
            !isData,
            <NoDataFound title={text} description={description} />,
            children,
          ),
        )
      )}
    </>
  )
}

export default ApiMiddleware
