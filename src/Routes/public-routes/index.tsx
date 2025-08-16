import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

import ScrollToTop from '../../shared/components/scroll-to-top'
import { signIn, signOut } from '../../redux/reducers/user-slice'
import type { RootState } from '../../redux/types'

const PublicRoutes: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { user } = useSelector((state: RootState) => state.user)

  const [checkedAuth, setCheckedAuth] = useState(false)

  // const [logoutMutation] = useLogouMutationByType(user?.role)

  const queryParams = new URLSearchParams(window.location.search)
  const tokenInQueryParams = queryParams.get('token')

  const iff = <T, U>(condition: boolean, then: T, otherwise: U): T | U => (condition ? then : otherwise)

  const isEducatorPath = /\/educator\/(login|onboarding)/.test(
    location.pathname,
  )
  const isAdminPath = location.pathname.includes('admin/login')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!user && !tokenInQueryParams && token) {
      dispatch(signIn({ token }))
    }

    if (user) {
      const shouldStayLoggedIn =
        (isEducatorPath && user.role === 'educator') ||
        (isAdminPath && user.role === 'admin') ||
        (!isEducatorPath && !isAdminPath && user.role === 'user')

      if (!shouldStayLoggedIn) {
        // logoutMutation()
        dispatch(signOut())
      }
    }

    setCheckedAuth(true)
  }, [
    location.pathname,
    user,
    dispatch,
    isAdminPath,
    isEducatorPath,
    tokenInQueryParams,
  ])

  if (checkedAuth && user) {
    return (
      <Navigate
        to={`/${iff(
          user?.role === 'admin',
          'admin',
          user?.role === 'educator' ? 'educator' : 'dashboard',
        )}`}
      />
    )
  }

  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export default PublicRoutes
