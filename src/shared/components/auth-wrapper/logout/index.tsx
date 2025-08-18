import type { TFunction } from 'i18next'
import type { Dispatch } from '@reduxjs/toolkit'
import type { MouseEvent, ReactElement } from 'react'
import type { NavigateFunction } from 'react-router-dom'

import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Typography } from '@mui/material'

import ModalBox from '../../ui-elements/modal-box'
import LANGUAGES from '../../../../constants/languages'
import { signOut } from '../../../../redux/reducers/user-slice'
import { updateLanguage } from '../../../../redux/reducers/app-slice'
import { useAdminLogoutMutation } from '../../../../services/onboarding'
import {
  useLogoutMutation,
  useEducatorLogoutMutation,
} from '../../../../services/admin'

import type { Language } from '../../../../constants/languages'

type UserType = 'educator' | 'admin' | 'user'

interface LogoutProps {
  component?: ReactElement
  type?: UserType
}

interface ModalBoxRef {
  openModal: () => void
  closeModal: () => void
}

const Logout: React.FC<LogoutProps> = ({ component, type }) => {
  const logoutRef = useRef<ModalBoxRef | null>(null)
  const dispatch: Dispatch = useDispatch()
  const navigate: NavigateFunction = useNavigate()
  const { t }: { t: TFunction } = useTranslation('application')

  const [userLogout, userLogoutResult] = useLogoutMutation()
  const [adminLogout, adminLogoutResult] = useAdminLogoutMutation()
  const [educatorLogout, educatorLogoutResult] = useEducatorLogoutMutation()

  const isLoading =
    userLogoutResult.isLoading ||
    educatorLogoutResult.isLoading ||
    adminLogoutResult.isLoading

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
    const item: keyof typeof LANGUAGES = 'ENGLISH'
    const lang: Language = LANGUAGES[item]
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

  const handleOpenModal = (event?: MouseEvent<HTMLElement>): void => {
    event?.preventDefault()
    logoutRef.current?.openModal()
  }

  const handleCloseModal = () => {
    logoutRef.current?.closeModal()
  }

  return (
    <>
      {component ? (
        <Box
          component="span"
          onClick={handleOpenModal}
          sx={{ cursor: 'pointer' }}
        >
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
