import {
  Box,
  Fade,
  List,
  Menu,
  Zoom,
  Badge,
  Stack,
  alpha,
  AppBar,
  Avatar,
  Drawer,
  Divider,
  Toolbar,
  Tooltip,
  ListItem,
  MenuItem,
  useTheme,
  IconButton,
  Typography,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  ListItemButton,
} from '@mui/material'
import { User, LogOut, Receipt, CheckCircle, ChevronRight, GraduationCap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import MainLogo from '../../../../assets/logo.svg'
import LogoutWrapper from '../../../../shared/components/auth-wrapper/logout'
import CustomSvgIcon from '../../../../shared/components/custom-svg-icon'
import AdminProfileSettings from '../profile-settings'

const DRAWER_WIDTH = 280
const DRAWER_WIDTH_COLLAPSED = 85

const ModernAdminLayout = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.user)
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  const [mobileOpen, setMobileOpen] = useState(false)
  const [drawerCollapsed, setDrawerCollapsed] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)

  useEffect(() => {
    // Navigate to tutor applicants by default if on root admin path
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      void navigate('/admin/tutor-applicants', { replace: true })
    }
  }, [location.pathname, navigate])

  const navigationItems = [
    {
      id: 'applicants',
      label: 'Tutor Applicants',
      icon: <GraduationCap size={22} />,
      path: '/admin/tutor-applicants',
    },
    {
      id: 'approved',
      label: 'Approved Tutors',
      icon: <CheckCircle size={22} />,
      path: '/admin/approved-tutors',
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: <Receipt size={22} />,
      path: '/admin/invoices',
    },
  ]

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setDrawerCollapsed(!drawerCollapsed)
    }
  }

  const handleNavigation = (path) => {
    void navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileSettings = () => {
    setProfileDialogOpen(true)
    handleMenuClose()
  }

  const renderNavItem = (item) => {
    const isActive =
      location.pathname === item.path ||
      (item.path !== '/admin' && location.pathname.startsWith(item.path))

    return (
      <ListItem key={item.id} disablePadding sx={{ mb: 0.5, px: 1.5 }}>
        <Tooltip
          title={drawerCollapsed && !isMobile ? item.label : ''}
          placement="right"
          arrow
          TransitionComponent={Zoom}
        >
          <ListItemButton
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 1.5,
              height: 56,
              position: 'relative',
              px: drawerCollapsed && !isMobile ? 2 : 2.5,
              bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
              color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
              '&:hover': {
                bgcolor: isActive
                  ? alpha(theme.palette.primary.main, 0.18)
                  : alpha(theme.palette.grey[500], 0.1),
                transform: 'translateX(2px)',
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
              },
              justifyContent: drawerCollapsed && !isMobile ? 'center' : 'flex-start',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: drawerCollapsed && !isMobile ? 'auto' : 40,
                color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                transition: 'color 0.2s',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </Box>
            </ListItemIcon>

            <Fade in={!drawerCollapsed || isMobile}>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: 0,
                }}
                sx={{
                  display: drawerCollapsed && !isMobile ? 'none' : 'block',
                  my: 0,
                }}
              />
            </Fade>

            {item.badge !== undefined && (!drawerCollapsed || isMobile) && (
              <Fade in={!drawerCollapsed || isMobile}>
                <Badge
                  badgeContent={item.badge}
                  color={item.badgeColor ?? 'primary'}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: 11,
                      height: 20,
                      minWidth: 20,
                      fontWeight: 700,
                    },
                  }}
                />
              </Fade>
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    )
  }

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        position: 'relative',
      }}
    >
      {/* Toggle Button */}
      {!isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          size="small"
          sx={{
            position: 'absolute',
            right: -12,
            top: 22,
            zIndex: 1200,
            width: 24,
            height: 24,
            color: 'text.secondary',
            bgcolor: 'background.paper',
            border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '&:hover': {
              bgcolor: 'background.paper',
              transform: 'scale(1.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            },
            transition: 'all 0.2s',
          }}
        >
          {drawerCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
          )}
        </IconButton>
      )}

      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: drawerCollapsed && !isMobile ? 'center' : 'flex-start',
          minHeight: 70,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={drawerCollapsed && !isMobile ? 0 : 1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={MainLogo}
              alt="Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          <Fade in={!drawerCollapsed || isMobile}>
            <Box sx={{ display: drawerCollapsed && !isMobile ? 'none' : 'block' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: 18,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: -0.5,
                }}
              >
                Admin Portal
              </Typography>
            </Box>
          </Fade>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: alpha(theme.palette.grey[500], 0.08) }} />

      {/* Navigation */}
      <List sx={{ flex: 1, py: 2 }}>{navigationItems.map(renderNavItem)}</List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: {
            xs: '100%',
            lg: `calc(100% - ${drawerCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH}px)`,
          },
          ml: {
            xs: 0,
            lg: drawerCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          bgcolor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ px: { xs: 1.5, sm: 2, md: 3 }, minHeight: { xs: 60, sm: 70 } }}>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { lg: 'none' },
              color: 'text.primary',
            }}
          >
            <CustomSvgIcon icon="drawer" />
          </IconButton>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Profile with Name and Dropdown */}
            <Box
              onClick={handleMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                px: 2,
                py: 1,
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: 14,
                  fontWeight: 700,
                  background: theme.palette.background.light,
                }}
              >
                {!user.profileImage &&
                  user &&
                  `${user.firstName?.[0]?.toUpperCase() ?? ''}${user.lastName?.[0]?.toUpperCase() ?? ''}`}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography color="text.primary" variant="body2" fontWeight={600}>
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
              <ChevronRight
                size={20}
                style={{
                  color: 'text.secondary',
                  transform: anchorEl ? 'rotate(90deg)' : 'rotate(270deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </Box>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{
                mt: 1,
                '& .MuiPaper-root': {
                  minWidth: 220,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>

              <MenuItem
                onClick={handleProfileSettings}
                sx={{
                  px: 2,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <User size={16} />
                </ListItemIcon>
                <ListItemText primary="Profile Settings" />
              </MenuItem>

              <Divider sx={{ my: 0.5 }} />

              <LogoutWrapper
                type="admin"
                component={
                  <MenuItem
                    sx={{
                      px: 2,
                      py: 1.5,
                      color: theme.palette.error.main,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LogOut size={16} style={{ color: theme.palette.error.main }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                }
              />
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: {
            lg: drawerCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
          },
          flexShrink: { lg: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              border: 'none',
              overflow: 'visible',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            lg: `calc(100% - ${drawerCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH}px)`,
          },
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 60, sm: 70 } }} />
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>

      {/* Profile Settings Dialog */}
      <AdminProfileSettings
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        userData={user}
      />
    </Box>
  )
}

export default ModernAdminLayout
