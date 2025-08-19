import { Box, Menu, Avatar, MenuItem, Typography, ListItemIcon, useMediaQuery } from '@mui/material'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import MainLogo from '../../../../assets/logo.svg'
import LogoutWrapper from '../../../../shared/components/auth-wrapper/logout'
import Navigation from '../Navigation'

const Header = () => {
  const { t } = useTranslation('education')
  const isMobile = useMediaQuery('(max-width:1024px)')
  const user = useSelector((state) => state.user.user)
  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''

  const [anchorEl, setAnchorEl] = useState(null)

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src={MainLogo}
            alt="UniCitizens"
            sx={{
              height: { xs: 32, sm: 40 },
              width: { xs: 32, sm: 40 },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 3.84,
              fontSize: { xs: '16px', sm: '18px' },
              color: 'text.primary',
            }}
          >
            UNICITIZENS
          </Typography>
        </Box>
      </Box>
      {!isMobile && <Navigation />}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
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
            <Typography variant="body2" noWrap sx={{ color: 'text.primary' }}>
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

Header.propTypes = {}

export default Header
