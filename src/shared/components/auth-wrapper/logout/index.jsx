import { Box, Button, Typography } from '@mui/material'
import { X, LogOut } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { signOut } from '../../../../redux/reducers/user-slice'
import { useLogoutMutation } from '../../../../services/admin'
import { useAdminLogoutMutation } from '../../../../services/onboarding'
import ModalBox from '../../ui-elements/modal-box'

const Logout = ({ component = null, type = 'user' }) => {
  const logoutRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [userLogout, userLogoutResult] = useLogoutMutation()
  const [adminLogout, adminLogoutResult] = useAdminLogoutMutation()

  const isLoading = userLogoutResult.isLoading || adminLogoutResult.isLoading

  const getLogoutFunction = () => {
    switch (type) {
      case 'admin':
        return adminLogout
      case 'user':
      default:
        return userLogout
    }
  }

  const handleCloseModal = () => {
    logoutRef.current?.closeModal()
  }

  const handleOpenModal = (event) => {
    event?.preventDefault()
    logoutRef.current?.openModal()
  }

  const handleLogout = async () => {
    try {
      const logout = getLogoutFunction()
      const response = await logout({})

      if (response?.data) {
        dispatch(signOut())
        await navigate('/')
        handleCloseModal()
      }
    } catch {
      //
    }
  }

  return (
    <>
      {component ? (
        <Box component="span" onClick={handleOpenModal} sx={{ cursor: 'pointer' }}>
          {component}
        </Box>
      ) : (
        <Button variant="contained" onClick={handleOpenModal}>
          Logout
        </Button>
      )}

      <ModalBox ref={logoutRef} size="sm">
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Are you sure you want to logout?
        </Typography>
        <Box mt={3} display="flex" gap="10px" justifyContent="flex-start">
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
            disabled={isLoading}
            startIcon={<X size={16} />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleLogout()
            }}
            startIcon={!isLoading && <LogOut size={16} />}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </Box>
      </ModalBox>
    </>
  )
}

const LogoutWrapper = Logout

Logout.propTypes = {
  component: PropTypes.element,
  type: PropTypes.oneOf(['user', 'admin']),
}

export default LogoutWrapper
