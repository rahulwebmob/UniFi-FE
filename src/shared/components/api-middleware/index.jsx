import PropTypes from 'prop-types'

import Loading from '../loading'
import LoadingIssue from '../loading-error'
import NoDataFound from '../no-data-found'

const ApiMiddleware = ({
  children,
  error = null,
  isData,
  isLoading,
  text = undefined,
  description = undefined,
}) => {
  if (isLoading) {
    return <Loading />
  }

  const errorStatus =
    error && 'status' in error && typeof error.status === 'number' ? error.status : undefined

  if (errorStatus === 500) {
    return <LoadingIssue />
  }

  if (!isData) {
    return <NoDataFound title={text} description={description} />
  }

  return children
}

ApiMiddleware.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  isData: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  text: PropTypes.string,
  description: PropTypes.string,
}

export default ApiMiddleware
