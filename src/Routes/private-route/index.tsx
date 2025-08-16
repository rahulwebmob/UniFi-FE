import type { ReactNode } from 'react';

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { signIn } from '../../Redux/Reducers/UserSlice'
import { initializeSocket } from '../../Services/sockets'

interface PrivateRouteProps {
  children: ReactNode
  module: string
}

const PrivateRoute = ({ children, module }: PrivateRouteProps) => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const location = useLocation()

  const isOnboardingRouteAccessible = () => {
    const splitRoute = location.pathname.split('/')

    return (
      user?.privilege?.permissions[`${splitRoute[splitRoute.length - 1]}`] !==
      'X'
    )
  }

  const premiumRoutes = () => {
    const { isBasicSubscribed, isQPNewsSubscribed, isQINNewsSubscribed } =
      user.subscription
    const splitRoute = location.pathname.split('/')
    const route = splitRoute[splitRoute.length - 1]
    if (route === 'layout' || route === 'fundamental-data')
      return !isBasicSubscribed
    if (route === 'qp-news') return !isQPNewsSubscribed
    if (route === 'qin-news') return !isQINNewsSubscribed
    return false
  }

  const redirectToLogin = () => {
    if (module === 'educator') {
      return <Navigate to="/educator/login" />
    }
    if (module === 'admin') {
      return <Navigate to="/admin/login" />
    }
    return <Navigate to="/" />
  }

  // page reload logic
  if (!user && localStorage.getItem('token')) {
    const token = localStorage.getItem('token')
    // Sign in and initialize sockets
    if (token) {
      dispatch(
        signIn({
          token,
        }),
      )
      if (module === 'user') initializeSocket(token)
      if (module === 'educator') initializeSocket(token, false)
    }
  }


  if (!user && !localStorage.getItem('token')) {
    return redirectToLogin()
  }
  // Limited access for admin user.
  if (
    user?.role === 'admin' &&
    location.pathname.includes('/admin') &&
    !isOnboardingRouteAccessible()
  ) {
    return <Navigate to="/admin" />
  }
  // Ends here

  // revoke premium access for application user.
  if (
    user?.role === 'user' &&
    (location.pathname.includes('/dashboard') ||
      location.pathname.includes('/settings'))
  ) {
    if (premiumRoutes()) {
      return <Navigate to="/dashboard" />
    }
  }
  // Ends here

  if (user?.role === 'admin' && !location.pathname.includes('/admin')) {
    return <Navigate to="/admin" />
  }

  if (user?.role === 'educator' && !location.pathname.includes('/educator')) {
    return <Navigate to="/educator" />
  }

  if (
    user?.role === 'user' &&
    !location.pathname.includes('/dashboard') &&
    !location.pathname.includes('/settings')
  ) {
    return <Navigate to="/dashboard" />
  }

  return children
}


export default PrivateRoute
