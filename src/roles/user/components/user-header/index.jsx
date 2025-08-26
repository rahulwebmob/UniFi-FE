import {
  Box,
  List,
  AppBar,
  Avatar,
  Drawer,
  Toolbar,
  ListItem,
  useTheme,
  IconButton,
  Typography,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  ListItemButton,
} from '@mui/material'
import { Settings, CreditCard, LayoutDashboard } from 'lucide-react'
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

  const [mobileOpen, setMobileOpen] = useState(false)

  const { user } = useSelector((state) => state.user)

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileClick = () => {
    navigate(`/settings/profile/${user._id}`)
    setMobileOpen(false)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  const renderNavigationItem = (item) => {
    const isActive = item.isActive()
    const Icon = item.icon

    return (
      <ListItem key={item.id} disablePadding>
        <ListItemButton
          onClick={() => handleNavigation(item.path)}
          selected={isActive}
          sx={{
            mx: 1,
            borderRadius: 1,
            '&.Mui-selected': {
              backgroundColor: (theme) => `${theme.palette.primary.main}08`,
              '&:hover': {
                backgroundColor: (theme) => `${theme.palette.primary.main}12`,
              },
            },
            '&:hover': {
              backgroundColor: 'action.hover',
              cursor: 'pointer',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon size={20} style={{ color: 'var(--mui-palette-text-secondary)' }} />
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    )
  }

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

  const renderUserProfile = () => (
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar
        sx={{
          width: 48,
          height: 48,
          backgroundColor: (theme) => theme.palette.primary[100],
          color: 'primary.main',
        }}
      >
        {user.firstName?.charAt(0) ?? 'U'}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  )

  const renderDrawer = () => (
    <Box height="100%" display="flex" flexDirection="column">
      <Box
        p={2}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        {renderUserProfile()}
      </Box>

      <List pt={2} sx={{ flex: 1 }}>
        {navigationItems.map(renderNavigationItem)}
      </List>
    </Box>
  )

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
          fontWeight: 700,
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
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              color: 'text.primary',
              display: { xs: 'inline-flex', md: 'none' },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <CustomSvgIcon icon="drawer" />
          </IconButton>

          {renderLogo()}

          {!isMobile && (
            <Box display="flex" gap={3} ml={2}>
              {navigationItems.map(renderDesktopNavItem)}
            </Box>
          )}

          <Box flexGrow={1} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
            }}
          >
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
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    backgroundColor: (theme) => theme.palette.grey[300],
                    color: 'text.primary',
                  }}
                >
                  <Typography variant="caption">{user.firstName?.charAt(0) ?? 'U'}</Typography>
                </Avatar>
                <Typography variant="body2" fontWeight={500}>
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {renderDrawer()}
      </Drawer>
    </>
  )
}

export default UserHeader
