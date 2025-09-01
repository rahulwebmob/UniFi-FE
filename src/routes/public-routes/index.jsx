import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

import { signIn, signOut } from '../../redux/reducers/user-slice'
import ScrollToTop from '../../shared/components/scroll-to-top'

const PublicRoutes = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { user } = useSelector((state) => state.user)

  const [checkedAuth, setCheckedAuth] = useState(false)

  // const [logoutMutation] = useLogouMutationByType(user?.role)

  const queryParams = new URLSearchParams(window.location.search)
  const tokenInQueryParams = queryParams.get('token')

  const iff = (condition, then, otherwise) => (condition ? then : otherwise)

  const isAdminPath = location.pathname.includes('admin/login')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!user && !tokenInQueryParams && token) {
      dispatch(signIn({ token }))
    }

    if (user) {
      const shouldStayLoggedIn =
        (isAdminPath && user.role === 'admin') || (!isAdminPath && user.role === 'user')

      if (!shouldStayLoggedIn) {
        // logoutMutation()
        dispatch(signOut())
      }
    }

    setCheckedAuth(true)
  }, [location.pathname, user, dispatch, isAdminPath, tokenInQueryParams])

  if (checkedAuth && user) {
    return <Navigate to={`/${iff(user?.role === 'admin', 'admin', 'dashboard')}`} />
  }

  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export default PublicRoutes
