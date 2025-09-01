import { Box, Typography } from '@mui/material'
import { jwtDecode } from 'jwt-decode'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { updateUser } from '../../../../redux/reducers/user-slice'
import { useCreatePasswordMutation } from '../../../../services/admin'
import { useCreateAdminPasswordMutation } from '../../../../services/onboarding'
import ChangePassword from '../change-password'
import AuthWrapper from '../index'

const ResetPassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [resetUserPassword] = useCreatePasswordMutation()
  const [resetAdminPassword] = useCreateAdminPasswordMutation()

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

    try {
      if (user?.role === 'admin') {
        response = await resetAdminPassword(formData).unwrap()
      } else {
        response = await resetUserPassword(formData).unwrap()
      }

      const newToken = response?.token || response?.data?.token

      if (newToken) {
        localStorage.setItem('token', newToken)
        dispatch(updateUser({ token: newToken }))

        setTimeout(() => {
          if (user?.role === 'admin') {
            navigate('/admin')
          } else {
            navigate('/dashboard')
          }
        }, 100)
      } else {
        localStorage.removeItem('token')
        navigate('/')
      }
    } catch {
      //
    }
  }

  useEffect(() => {
    if (!token || !user) {
      navigate('/')
    }
  }, [token, user, navigate])

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
