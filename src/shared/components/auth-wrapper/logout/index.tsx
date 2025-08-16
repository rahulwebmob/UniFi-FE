import type { ReactNode } from 'react'

import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Typography } from '@mui/material'

import ModalBox from '../../ui-elements/modal-box'
import LANGUAGES from '../../../../Constants/LANGUAGES'
import { signOut } from '../../../../Redux/Reducers/UserSlice'
import { updateLanguage } from '../../../../Redux/Reducers/AppSlice'
import { useAdminLogoutMutation } from '../../../../Services/onboarding'
import {
  useLogoutMutation,
  useEducatorLogoutMutation,
} from '../../../../Services/admin'

interface LogoutProps {
  component?: ReactNode
  type?: string
}

interface ModalBoxRef {
  openModal: () => void
  closeModal: () => void
}

const Logout: React.FC<LogoutProps> = ({ component, type }) => {
  const logoutRef = useRef<ModalBoxRef | null>(null)
  const { t } = useTranslation('application')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Call all hooks unconditionally
  const [userLogout] = useLogoutMutation()
  const [educatorLogout] = useEducatorLogoutMutation()
  const [adminLogout] = useAdminLogoutMutation()

  // Select the appropriate logout function based on type
  const getLogoutFunction = () => {
    switch (type) {
      case 'educator':
        return educatorLogout
      case 'admin':
        return adminLogout
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
    const logout = getLogoutFunction()
    const response = await logout()
    if (response && 'data' in response) {
      dispatch(signOut())
      handleLanguageChange()
      void navigate('/')
    }
  }

  return (
    <>
      {component ? (
        <Box component="span" onClick={() => { logoutRef.current?.openModal() }}>
          {component}
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => { logoutRef.current?.openModal() }}
        >
          {t('application:PROFILE.LOGOUT')}
        </Button>
      )}

      <ModalBox ref={logoutRef} title={null} size="xs">
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {t('application:PROFILE.LOGOUT_DESC')}
        </Typography>
        <Box mt={3} display="flex" gap="10px" justifyContent="flex-start">
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ fontWeight: 600, textTransform: 'capitalize' }}
            onClick={() => { logoutRef.current?.closeModal() }}
          >
            {t('application:MISCELLANEOUS.CANCEL')}
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{ fontWeight: 600, textTransform: 'capitalize' }}
            onClick={() => { void handleLogout() }}
          >
            {t('application:PROFILE.LOGOUT')}
          </Button>
        </Box>
      </ModalBox>
    </>
  )
}

export default Logout
