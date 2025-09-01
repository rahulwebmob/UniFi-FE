import { Box, Toolbar, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { LayoutDashboard, Receipt, Users, UserCog } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import AdminProfileSettings from '../admin-settings'

import AdminHeader from './admin-header'
import NavigationDrawer from './navigation-drawer'
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from './navigation-drawer/constants'

const AdminLayout = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.user)
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const profileSettingsRef = useRef(null)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [drawerCollapsed, setDrawerCollapsed] = useState(false)

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [location.pathname, navigate])

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={22} />,
      path: '/admin/dashboard',
    },
    // {
    //   id: 'applicants',
    //   label: 'Tutor Applicants',
    //   icon: <GraduationCap size={22} />,
    //   path: '/admin/tutor-applicants',
    // },
    // {
    //   id: 'approved',
    //   label: 'Approved Tutors',
    //   icon: <CheckCircle size={22} />,
    //   path: '/admin/approved-tutors',
    // },
    {
      id: 'users',
      label: 'Platform Users',
      icon: <Users size={22} />,
      path: '/admin/platform-users',
    },
    {
      id: 'admins',
      label: 'Admin Users',
      icon: <UserCog size={22} />,
      path: '/admin/admin-users',
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
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleProfileSettings = () => {
    profileSettingsRef.current?.openModal()
  }

  const isItemActive = (item) =>
    location.pathname === item.path ||
    (item.path !== '/admin' && location.pathname.startsWith(item.path))

  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AdminHeader
        user={user}
        drawerCollapsed={drawerCollapsed}
        isMobile={isMobile}
        onDrawerToggle={handleDrawerToggle}
        onProfileSettings={handleProfileSettings}
      />

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
        <NavigationDrawer
          navigationItems={navigationItems}
          mobileOpen={mobileOpen}
          drawerCollapsed={drawerCollapsed}
          isMobile={isMobile}
          isActive={isItemActive}
          onDrawerToggle={handleDrawerToggle}
          onNavigate={handleNavigation}
        />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            lg: `calc(100% - ${drawerCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH}px)`,
          },
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 60, sm: 70 } }} />
        <Box p={{ xs: 1.5, sm: 2, md: 3 }}>
          <Outlet />
        </Box>
      </Box>

      <AdminProfileSettings
        ref={profileSettingsRef}
        userData={user}
        onClose={() => profileSettingsRef.current?.closeModal()}
      />
    </Box>
  )
}

export default AdminLayout
