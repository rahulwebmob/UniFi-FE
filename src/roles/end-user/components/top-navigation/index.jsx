import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Settings, CreditCard, LayoutDashboard } from 'lucide-react'

import {
  Box,
  List,
  AppBar,
  Button,
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

import MainLogo from '../../../../assets/logo.svg'
import CustomSvgIcon from '../../../../shared/components/custom-svg-icon'

const TopNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [mobileOpen, setMobileOpen] = useState(false)

  const { user } = useSelector((state) => state.user)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileClick = () => {
    void navigate(`/settings/profile/${user._id}`)
    setMobileOpen(false)
  }

  const handleNavigation = (path) => {
    void navigate(path)
    setMobileOpen(false)
  }

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: theme.palette.primary[100],
              color: 'primary.main',
            }}
          >
            {user.firstName?.charAt(0) ?? 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation('/dashboard')}
            selected={
              location.pathname === '/dashboard' ||
              location.pathname.startsWith('/dashboard/course') ||
              location.pathname.startsWith('/dashboard/webinar')
            }
            sx={{
              mx: 1,
              borderRadius: 1,
              '&.Mui-selected': {
                backgroundColor: `${theme.palette.primary.main}08`,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}12`,
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                cursor: 'pointer',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LayoutDashboard
                size={20}
                style={{ color: 'var(--mui-palette-text-secondary)' }}
              />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              void navigate(`/settings/profile/${user._id}?tab=payments`)
            }}
            selected={
              location.pathname.includes('profile') &&
              location.search.includes('payments')
            }
            sx={{
              mx: 1,
              borderRadius: 1,
              '&.Mui-selected': {
                backgroundColor: `${theme.palette.primary.main}08`,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}12`,
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                cursor: 'pointer',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CreditCard
                size={20}
                style={{ color: 'var(--mui-palette-text-secondary)' }}
              />
            </ListItemIcon>
            <ListItemText primary="Payments" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              void navigate(`/settings/profile/${user._id}`)
            }}
            selected={
              location.pathname.includes('profile') &&
              !location.search.includes('payments')
            }
            sx={{
              mx: 1,
              borderRadius: 1,
              '&.Mui-selected': {
                backgroundColor: `${theme.palette.primary.main}08`,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}12`,
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                cursor: 'pointer',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Settings
                size={20}
                style={{ color: 'var(--mui-palette-text-secondary)' }}
              />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Bottom Actions */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.grey[200]}` }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Mail size={16} />}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            borderColor: theme.palette.grey[300],
          }}
        >
          Contact Support
        </Button>
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.grey[300]}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Mobile Menu Button - Always before logo */}
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

          {/* Logo Section - Always visible */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
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
                letterSpacing: '0.5px',
                fontSize: { xs: '16px', sm: '18px' },
                color: 'text.primary',
              }}
            >
              UNICITIZENS
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3, ml: 2 }}>
              <Typography
                component="a"
                variant="body1"
                onClick={() => {
                  void navigate('/dashboard')
                }}
                sx={{
                  color:
                    location.pathname === '/dashboard' ||
                    location.pathname.startsWith('/dashboard/course') ||
                    location.pathname.startsWith('/dashboard/webinar')
                      ? 'primary.main'
                      : 'text.secondary',
                  fontWeight:
                    location.pathname === '/dashboard' ||
                    location.pathname.startsWith('/dashboard/course') ||
                    location.pathname.startsWith('/dashboard/webinar')
                      ? 600
                      : 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Dashboard
              </Typography>
              <Typography
                component="a"
                variant="body1"
                onClick={() => {
                  void navigate(`/settings/profile/${user._id}?tab=payments`)
                }}
                sx={{
                  color:
                    location.pathname.includes('profile') &&
                    location.search.includes('payments')
                      ? 'primary.main'
                      : 'text.secondary',
                  fontWeight:
                    location.pathname.includes('profile') &&
                    location.search.includes('payments')
                      ? 600
                      : 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Payments
              </Typography>
              <Typography
                component="a"
                variant="body1"
                onClick={() => {
                  void navigate(`/settings/profile/${user._id}`)
                }}
                sx={{
                  color:
                    location.pathname.includes('profile') &&
                    !location.search.includes('payments')
                      ? 'primary.main'
                      : 'text.secondary',
                  fontWeight:
                    location.pathname.includes('profile') &&
                    !location.search.includes('payments')
                      ? 600
                      : 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Settings
              </Typography>
            </Box>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* Contact Support Button - Desktop Only */}
            {!isMobile && (
              <Button
                variant="outlined"
                startIcon={<Mail size={16} />}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                  fontWeight: 500,
                  p: 1,
                  borderColor: theme.palette.grey[300],
                  borderWidth: '1px',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: theme.palette.grey[400],
                  },
                }}
              >
                Contact Support
              </Button>
            )}

            {/* User Profile - Desktop Only */}
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
                    backgroundColor: theme.palette.grey[300],
                    color: 'text.primary',
                  }}
                >
                  <Typography variant="caption">
                    {user.firstName?.charAt(0) ?? 'U'}
                  </Typography>
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer - Opens from left */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
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
        {drawer}
      </Drawer>
    </>
  )
}

export default TopNavigation
