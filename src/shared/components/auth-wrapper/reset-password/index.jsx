import { Box, Typography } from '@mui/material'
import { jwtDecode } from 'jwt-decode'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { signIn } from '../../../../redux/reducers/user-slice'
import {
  useCreatePasswordMutation,
  useEducatorResetPasswordMutation,
} from '../../../../services/admin'
import { useCreateAdminPasswordMutation } from '../../../../services/onboarding'
import ChangePassword from '../change-password'
import AuthWrapper from '../index'

const ResetPassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryParams = new URLSearchParams(window.location.search)
  const token = queryParams.get('token')

  const [resetUserPassword] = useCreatePasswordMutation()
  const [resetAdminPassword] = useCreateAdminPasswordMutation()
  const [educatorResetPassword] = useEducatorResetPasswordMutation()
  let user = null
  try {
    if (token) {
      user = jwtDecode(token)
    }
  } catch (error) {
    console.error('Invalid token:', error)
  }

  const handlePasswordReset = async (values) => {
    let response
    const formData = {
      password: values.password,
      confirmPassword: values.confirmPassword,
      token,
    }

    localStorage.setItem('token', token)
    if (user?.role === 'admin') {
      response = await resetAdminPassword(formData)
    } else if (user?.role === 'educator') {
      response = await educatorResetPassword(formData)
    } else {
      response = await resetUserPassword(formData)
    }

    if (!response?.error) {
      if (response?.data?.token) {
        localStorage.setItem('token', response?.data?.token)
        dispatch(signIn({ token: response?.data?.token }))
      } else {
        localStorage.removeItem('token')
      }

      setTimeout(() => {
        if (user?.role === 'admin') {
          navigate('/admin')
        } else if (user?.role === 'educator') {
          navigate('/educator')
        } else {
          navigate('/dashboard')
        }
      })
    }
  }
  useEffect(() => {
    if (!token) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
    localStorage.removeItem('token')
  }, [])

  return (
    <AuthWrapper type={user?.role}>
      <Box className="reset-password">
        {user && (
          <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: 'text.secondary' }}>
            Welcome back, {user.firstName} {user.lastName}! Please set up your new password to
            continue.
          </Typography>
        )}

        <ChangePassword
          isResetPassword
          headerName="Create New Password"
          userEmail={user?.email}
          resetPassword={handlePasswordReset}
        />
      </Box>
    </AuthWrapper>
  )
}

export default ResetPassword
