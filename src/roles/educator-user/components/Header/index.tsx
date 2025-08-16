import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { LogOut, ChevronDown } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Box,
  Menu,
  Avatar,
  Select,
  MenuItem,
  Typography,
  FormControl,
  ListItemIcon,
  useMediaQuery,
} from '@mui/material'

import Navigation from '../navigation'
import MainLogo from '../../../../Assets/logo.svg'
import LANGUAGES from '../../../../constants/LANGUAGES'
import { setLangCookie } from '../../../../Utils/globalUtils'
import { updateToken } from '../../../../Redux/Reducers/UserSlice'
import { useLanguageChangeMutation } from '../../../../Services/admin'
import LogoutWrapper from '../../../../shared/components/auth-wrapper/logout'

const languageList = Object.values(LANGUAGES)

const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation('education')
  const isMobile = useMediaQuery('(max-width:1024px)')
  const { language } = useSelector((state) => state.app)
  const user = useSelector((state) => state.user.user)
  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedValue, setSelectedValue] = useState('')

  const [languageChange] = useLanguageChangeMutation()

  const isWebinarRoute = location.pathname.includes('educator-room')

  const handleLanguageChange = async (event) => {
    const selectedLang = languageList.find(
      (lang) => lang.code === event.target.value,
    )
    if (selectedLang) {
      setSelectedValue(selectedLang?.code)
      const res = await languageChange({
        language: selectedLang.label?.toUpperCase(),
      })
      if (!res.error) {
        setLangCookie(selectedLang.value)
        if (res?.data?.token) {
          const newToken = res?.data?.token
          dispatch(updateToken({ token: newToken }))
          setTimeout(() => {
            window.location.replace(`${window.location.origin}/educator`)
          }, 0)
        }
      }
    }
  }

  useEffect(() => {
    if (language) {
      setTimeout(() => {
        setSelectedValue(language?.code)
      }, 500)
    }
  }, [language])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {isMobile && <Navigation />}
        <img src={MainLogo} alt="Logo" style={{ width: 130, height: 40 }} />
      </Box>
      {!isMobile && <Navigation />}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {!isWebinarRoute && (
          <FormControl>
            <Select
              value={selectedValue}
              onChange={(e) => { void handleLanguageChange(e) }}
              disableUnderlined
              defaultValue="Please select"
              MenuProps={{
                sx: {
                  '.MuiMenuItem-root': {
                    fontSize: '1em',
                    width: '105px',
                  },
                },
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                '& .MuiSelect-icon': {
                  color: 'white',
                  marginRight: 1,
                },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                color: 'white',
              }}
              IconComponent={ChevronDown}
            >
              {languageList?.map((lang) => (
                <MenuItem value={lang.code} key={lang.code}>
                  <Box sx={{ display: 'flex', gap: 1 }}>

                    <Typography>{lang.code}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Box>
          <Box
            onClick={handleClick}
            display="flex"
            alignItems="center"
            gap="5px"
            sx={{ cursor: 'pointer' }}
          >
            <Avatar
              alt="Profile Picture"
              className="AvatarGroup"
              sx={{ width: '30px', height: '30px' }}
            >
              <Typography variant="body2">
                {firstName[0]?.toUpperCase() + lastName[0]?.toUpperCase()}
              </Typography>
            </Avatar>
            <Typography variant="body2" noWrap>
              {firstName} {lastName}
            </Typography>
          </Box>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <LogoutWrapper
            type="educator"
            component={
              <MenuItem>
                <ListItemIcon>
                  <LogOut size={20} />
                </ListItemIcon>
                {t('EDUCATOR.HEADER.LOGOUT')}
              </MenuItem>
            }
          />
        </Menu>
      </Box>
    </>
  )
}

export default Header
