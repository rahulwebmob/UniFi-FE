import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { signIn } from '../../redux/reducers/user-slice'

const PrivateRoute = ({ children, module }) => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const location = useLocation()

  const redirectToLogin = () => {
    if (module === 'educator') {
      return <Navigate to="/educator/login" />
    }
    if (module === 'admin') {
      return <Navigate to="/admin/login" />
    }
    return <Navigate to="/" />
  }

  if (!user && localStorage.getItem('token')) {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(
        signIn({
          token,
        }),
      )
    }
  }

  if (!user && !localStorage.getItem('token')) {
    return redirectToLogin()
  }

  // Role-based access control and redirection
  if (user?.role === 'admin') {
    // Admin users can only access admin routes
    if (!location.pathname.includes('/admin')) {
      return <Navigate to="/admin" />
    }
  }

  if (user?.role === 'educator') {
    // Educator users can only access educator routes
    if (!location.pathname.includes('/educator')) {
      return <Navigate to="/educator" />
    }
  }

  if (user?.role === 'user') {
    // Regular users can only access dashboard and settings routes
    if (!location.pathname.includes('/dashboard') && !location.pathname.includes('/settings')) {
      return <Navigate to="/dashboard" />
    }
  }

  return children
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
  module: PropTypes.string,
}

export default PrivateRoute
