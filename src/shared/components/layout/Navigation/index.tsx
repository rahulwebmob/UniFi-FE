import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { X, Home, User, LogOut } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  Box,
  Badge,
  Drawer,
  useTheme,
  Typography,
  useMediaQuery,
} from '@mui/material'

import * as Style from './style'
import Logout from '../../auth-wrapper/logout'
import MainLogo from '../../../../Assets/logo.svg'
import UserProfile from '../../../../roles/end-user/components/my-profile/user-profile'

import type { RootState } from '../../../../redux/types'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('application')
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const { _id } = useSelector((state: RootState) => state.user.user ?? {})

  // menuBar always at top - no need to check
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  const notificationCount = [] as number[] // Notification count not available in user state

  const [activeLink, setActiveLink] = useState('Home')

  // Navbar is always at top

  // Removed iff function - no longer needed

  // Simplified navigation with only Home (Education) and Profile
  const navigationLinks = useMemo(
    () => [
      {
        id: 1,
        className: 'NavLink home',
        path: '/dashboard',
        onClick: () => { void navigate('/dashboard') },
        icon: <Home />,
        text: t('application:NAVIGATION.HOME'),
        shouldRenderBadge: false,
        hideItem: false,
        drawerItem: true,
      },
      {
        id: 2,
        className: 'NavLink profile',
        path: `/settings/profile/${_id}`,
        onClick: () => { void navigate(`/settings/profile/${_id}`) },
        icon: <User />,
        text: t('application:NAVIGATION.PROFILE'),
        shouldRenderBadge: false,
        hideItem: false,
        drawerItem: true,
      },
    ],
    [navigate, t, _id],
  )

  useEffect(() => {
    const navItemSelected = navigationLinks.find(
      (navItem) =>
        navItem?.path ===
        decodeURIComponent(location.pathname + location.search),
    )
    setActiveLink(navItemSelected?.text || 'Home')
  }, [location, navigationLinks])

  return (
    <Box
      sx={{
        whiteSpace: 'nowrap',
        padding: { sm: '0px 24px', xs: 'inherit' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'inherit',
        flexDirection: 'inherit',
        position: 'sticky',
        top: 0,
        bottom: 'inherit',
        left: 'inherit',
        transform: 'inherit',
        zIndex: 4,
        width: {
          xs: '100%',
          md: '100%',
        },
        backgroundColor:
          theme.palette.mode === 'light' ? 'primary.darker' : 'inherit',
        [theme.breakpoints.down('sm')]: {
          backgroundColor: 'primary.darker',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 'inherit',
          height: 'inherit',
          transform: 'inherit',
          width: '100%',
        },
      }}
    >
      {!matches && (
        <Box onClick={() => { void navigate('/dashboard') }} sx={{ cursor: 'pointer' }}>
          <img src={MainLogo} alt="Logo" style={{ width: 150, height: 45 }} />
        </Box>
      )}
      <Style.Navigation
        sx={{
          zIndex: 2,
          flexDirection: 'initial',
          backgroundColor: 'inherit',
          borderRadius: 0,
          margin: {
            sm: 0,
            xs: 0,
          },
          marginRight: 'inherit',
          marginLeft: 'inherit',
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'row',
            width: '100%',
            borderRadius: 0,
          },
          border: '',
          boxShadow: '',
        }}
      >
        {/* Logo is shown in the main navbar section above */}
        {navigationLinks.map(
          (link) =>
            !link.hideItem && (
              <Box
                key={link.id}
                className={`${link.className} ${activeLink === link.text ? 'active-nav' : ''}`}
                onClick={() => {
                  void link.onClick()
                }}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <Typography className="SvgIcon">
                  <Badge
                    color="error"
                    badgeContent={link.shouldRenderBadge || 0}
                    variant="dot"
                    overlap="circular"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    {link.icon}
                  </Badge>
                </Typography>
                {link?.text && (
                  <Typography variant="body1">{link.text}</Typography>
                )}
              </Box>
            ),
        )}
      </Style.Navigation>
      {!matches && (
        <Box className="profile">
          <UserProfile />
        </Box>
      )}
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <Style.MobileMenu>
          <Box
            display="flex"
            justifyContent="space-between"
            padding={2}
            sx={{ borderBottom: `1px solid ${theme.palette.primary[200]}` }}
          >
            <Typography variant="h4">Menu</Typography>
            <X onClick={() => setOpen(false)} style={{ cursor: 'pointer' }} />
          </Box>
          {navigationLinks.map(
            (link) =>
              link.drawerItem && (
                <Box
                  sx={{
                    cursor: 'pointer',
                  }}
                  key={link.id}
                  className={`${link.className} ${activeLink === link.text ? 'active-nav' : ''}`}
                  onClick={() => {
                    setOpen(false)
                    void link.onClick()
                  }}
                >
                  <Typography className="SvgIcon">
                    <Badge
                      color="error"
                      badgeContent={
                        link.shouldRenderBadge ? notificationCount.length : 0
                      }
                      variant="dot"
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      {link.icon}
                    </Badge>
                  </Typography>
                  <Typography variant="body1">{link.text}</Typography>
                </Box>
              ),
          )}
          <Logout
            component={
              <Box className="NavLink">
                <Typography className="SvgIcon">
                  <LogOut size={26} />
                </Typography>
                <Typography component="p">
                  {t('application:NAVIGATION.LOGOUT')}
                </Typography>
              </Box>
            }
            type={undefined}
          />
        </Style.MobileMenu>
      </Drawer>
    </Box>
  )
}

export default Navigation
