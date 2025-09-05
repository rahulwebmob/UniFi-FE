import {
  Box,
  AppBar,
  Avatar,
  Toolbar,
  useTheme,
  IconButton,
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material'
import { Home, LogOut, BookOpen, Presentation, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

import MainLogo from '../../../../assets/logo.svg'
import LogoutWrapper from '../../../../shared/components/auth-wrapper/logout'
import CustomSvgIcon from '../../../../shared/components/custom-svg-icon'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const { user } = useSelector((state) => state.user)

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/educator',
      isActive: () => location.pathname === '/educator',
    },
    {
      id: 'courses',
      label: 'Recorded Sessions',
      icon: BookOpen,
      path: '/educator/courses',
      isActive: () => location.pathname.includes('/courses'),
    },
    {
      id: 'webinars',
      label: 'Live Sessions',
      icon: Presentation,
      path: '/educator/webinars',
      isActive: () => location.pathname.includes('/webinars'),
    },
    {
      id: 'payment-history',
      label: 'Purchase History',
      icon: CreditCard,
      path: '/educator/payment-history',
      isActive: () => location.pathname.includes('/payment-history'),
    },
  ]

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNavigation = (path) => {
    if (location.pathname.includes('educator-room')) {
      // eslint-disable-next-line no-alert
      const userConfirmed = window.confirm('Are you sure you want to leave the live session ?')
      if (userConfirmed) {
        navigate(path)
        handleMenuClose()
      }
    } else {
      navigate(path)
      handleMenuClose()
    }
  }

  const renderUserProfile = () => (
    <Box display="flex" alignItems="center" gap={1.5}>
      <Avatar
        sx={{
          width: 36,
          height: 36,
          backgroundColor: (theme) => theme.palette.primary[100],
          color: 'primary.main',
        }}
      >
        {user?.firstName?.charAt(0) ?? 'E'}
      </Avatar>
      <Box sx={{ lineHeight: 0.5 }}>
        <Typography variant="body2" fontWeight={600}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
    </Box>
  )

  const renderDesktopNavItem = (item) => {
    const isActive = item.isActive()

    return (
      <Typography
        key={item.id}
        component="a"
        onClick={() => handleNavigation(item.path)}
        sx={{
          color: isActive ? 'primary.main' : 'text.secondary',
          fontWeight: isActive ? 600 : 500,
          textDecoration: 'none',
          cursor: 'pointer',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        {item.label}
      </Typography>
    )
  }

  const renderLogo = () => (
    <Box display="flex" alignItems="center" mr={4}>
      <Box
        component="img"
        src={MainLogo}
        alt="UniCitizens"
        sx={{
          height: { xs: 32, sm: 40 },
          width: { xs: 32, sm: 40 },
          mr: 1.5,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          letterSpacing: 3.84,
          fontSize: { xs: '16px', sm: '18px' },
          color: 'text.primary',
        }}
      >
        UNICITIZENS
      </Typography>
    </Box>
  )

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
          boxShadow: theme.shadows[1],
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {renderLogo()}

          {!isMobile && (
            <Box display="flex" gap={3} ml={2}>
              {navigationItems.map(renderDesktopNavItem)}
            </Box>
          )}

          <Box flexGrow={1} />

          {isMobile && (
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: 'text.primary',
              }}
            >
              <CustomSvgIcon icon="drawer" />
            </IconButton>
          )}

          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={handleMenuOpen}
            >
              {renderUserProfile()}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        {isMobile && [
          <Box key="profile" px={2} py={1}>
            {renderUserProfile()}
          </Box>,
          <Divider key="divider1" />,
          ...navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = item.isActive()

            return (
              <MenuItem
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  py: 1.5,
                  px: 2,
                  gap: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  color: isActive ? 'primary.main' : 'text.primary',
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive ? 'action.selected' : 'transparent',
                }}
              >
                <Icon size={18} />
                <Typography variant="body2">{item.label}</Typography>
              </MenuItem>
            )
          }),
          <Divider key="divider2" sx={{ my: 0.5 }} />,
        ]}

        <LogoutWrapper
          type="educator"
          component={
            <MenuItem
              sx={{
                py: 1.5,
                px: 2,
                gap: 1.5,
                display: 'flex',
                alignItems: 'center',
                color: 'error.main',
                '&:hover': {
                  backgroundColor: (theme) =>
                    theme.palette.error.lighter || 'rgba(211, 47, 47, 0.04)',
                  color: 'error.main',
                },
              }}
            >
              <LogOut size={18} />
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          }
        />
      </Menu>
    </>
  )
}

export default Header
