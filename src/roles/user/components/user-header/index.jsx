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
import { Settings, CreditCard, Home } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

import MainLogo from '../../../../assets/logo.svg'
import CustomSvgIcon from '../../../../shared/components/custom-svg-icon'

const UserHeader = () => {
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
      path: '/dashboard',
      isActive: () =>
        location.pathname === '/dashboard' ||
        location.pathname.startsWith('/dashboard/course') ||
        location.pathname.startsWith('/dashboard/webinar'),
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      path: `/settings/profile/${user._id}?tab=payments`,
      isActive: () => location.pathname.includes('profile') && location.search.includes('payments'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: `/settings/profile/${user._id}`,
      isActive: () =>
        location.pathname.includes('profile') && !location.search.includes('payments'),
    },
  ]

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    navigate(`/settings/profile/${user._id}`)
    handleMenuClose()
  }

  const handleNavigation = (path) => {
    navigate(path)
    handleMenuClose()
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
        {user.firstName?.charAt(0) ?? 'U'}
      </Avatar>
      <Box sx={{ lineHeight: 0.5 }}>
        <Typography variant="body2" fontWeight={600}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.email}
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
        onClick={() => navigate(item.path)}
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
              onClick={handleProfileClick}
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
        <Box px={2} py={1}>
          {renderUserProfile()}
        </Box>

        <Divider />

        {navigationItems.map((item) => {
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
        })}
      </Menu>
    </>
  )
}

export default UserHeader
