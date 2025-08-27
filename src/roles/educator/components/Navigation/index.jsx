import { Box, Tab, Tabs, Menu, useTheme, MenuItem, IconButton, useMediaQuery } from '@mui/material'
import { Menu as MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Navigation = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width:1024px)')
  const [anchorEl, setAnchorEl] = useState(null)

  const navItems = [
    { path: '/educator', label: 'Dashboard' },
    { path: '/educator/courses', label: 'Courses' },
    { path: '/educator/webinars', label: 'Webinars' },
    {
      path: '/educator/payment-history',
      label: 'Purchase History',
    },
  ]

  const currentPath = navItems.find((item) => item.path === location.pathname)?.path || false

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleChange = (path) => {
    if (location.pathname.includes('educator-room')) {
      // TODO: Replace with proper modal dialog
      // eslint-disable-next-line no-alert
      const userConfirmed = window.confirm('Are you sure you want to leave the webinar ?')
      if (userConfirmed) {
        void navigate(path)
        handleMenuClose()
      }
    } else {
      void navigate(path)
      handleMenuClose()
    }
  }

  return (
    <Box display="flex" alignItems="center">
      {isMobile ? (
        <>
          <IconButton onClick={handleMenuOpen} sx={{ color: 'text.primary' }}>
            <MenuIcon size={20} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {navItems.map((item) => (
              <MenuItem
                key={item.path}
                selected={currentPath === item.path}
                onClick={() => handleChange(item.path)}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <Tabs
          value={currentPath || false}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            border: 'none',
            '& .MuiButtonBase-root': {
              textTransform: 'none',
              fontWeight: 500,
              color: 'text.secondary',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'transparent',
            },
          }}
          onChange={(_, val) => handleChange(val)}
        >
          {navItems.map((item) => (
            <Tab key={item.path} value={item.path} label={item.label} />
          ))}
        </Tabs>
      )}
    </Box>
  )
}

Navigation.propTypes = {}

export default Navigation
