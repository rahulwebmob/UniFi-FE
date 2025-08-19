import { Box, Button, Typography } from '@mui/material'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import LANGUAGES from '../../../../constants/languages'
import { updateLanguage } from '../../../../redux/reducers/app-slice'
import { signOut } from '../../../../redux/reducers/user-slice'
import { useLogoutMutation, useEducatorLogoutMutation } from '../../../../services/admin'
import { useAdminLogoutMutation } from '../../../../services/onboarding'
import ModalBox from '../../ui-elements/modal-box'

const Logout = ({ component, type }) => {
  const logoutRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation('application')

  const [userLogout, userLogoutResult] = useLogoutMutation()
  const [adminLogout, adminLogoutResult] = useAdminLogoutMutation()
  const [educatorLogout, educatorLogoutResult] = useEducatorLogoutMutation()

  const isLoading =
    userLogoutResult.isLoading || educatorLogoutResult.isLoading || adminLogoutResult.isLoading

  const getLogoutFunction = () => {
    switch (type) {
      case 'educator':
        return educatorLogout
      case 'admin':
        return adminLogout
      case 'user':
      default:
        return userLogout
    }
  }

  const handleLanguageChange = () => {
    const item = 'ENGLISH'
    const lang = LANGUAGES[item]
    dispatch(updateLanguage({ ...lang, value: item }))
  }

  const handleLogout = async () => {
    try {
      const logout = getLogoutFunction()
      const response = await logout({})

      if (response?.data) {
        dispatch(signOut())
        handleLanguageChange()
        await navigate('/')
        handleCloseModal()
      }
    } catch {
      //
    }
  }

  const handleOpenModal = (event) => {
    event?.preventDefault()
    logoutRef.current?.openModal()
  }

  const handleCloseModal = () => {
    logoutRef.current?.closeModal()
  }

  return (
    <>
      {component ? (
        <Box component="span" onClick={handleOpenModal} sx={{ cursor: 'pointer' }}>
          {component}
        </Box>
      ) : (
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          {t('application:PROFILE.LOGOUT')}
        </Button>
      )}

      <ModalBox ref={logoutRef} size="xs">
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {t('application:PROFILE.LOGOUT_DESC')}
        </Typography>
        <Box mt={3} display="flex" gap="10px" justifyContent="flex-start">
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ fontWeight: 600, textTransform: 'capitalize' }}
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            {t('application:MISCELLANEOUS.CANCEL')}
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{ fontWeight: 600, textTransform: 'capitalize' }}
            onClick={() => {
              handleLogout()
            }}
          >
            {isLoading ? 'Logging out...' : t('application:PROFILE.LOGOUT')}
          </Button>
        </Box>
      </ModalBox>
    </>
  )
}

const LogoutWrapper = Logout

export default LogoutWrapper
