import {
  Box,
  Menu,
  Stack,
  AppBar,
  Avatar,
  Divider,
  Toolbar,
  MenuItem,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { User, LogOut } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState } from 'react'

import LogoutWrapper from '../../../../../shared/components/auth-wrapper/logout'
import CustomSvgIcon from '../../../../../shared/components/custom-svg-icon'

const AdminHeader = ({ user, onDrawerToggle, onProfileSettings }) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    onProfileSettings()
    handleMenuClose()
  }

  const renderUserProfile = () => (
    <Box display="flex" alignItems="center" gap={1.5} onClick={handleMenuOpen}>
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

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        color: 'text.primary',
        boxShadow: theme.shadows[1],
        backgroundColor: 'background.paper',
        borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <IconButton edge="start" onClick={onDrawerToggle}>
          <CustomSvgIcon icon="drawer" />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={2} alignItems="center">
          {renderUserProfile()}
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
          >
            <MenuItem sx={{ gap: 1.5 }} onClick={handleProfileClick}>
              <User size={16} />
              <ListItemText primary="Profile Settings" />
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <LogoutWrapper
              type="admin"
              component={
                <MenuItem sx={{ gap: 1.5, color: 'error.main' }}>
                  <LogOut size={16} />
                  <ListItemText primary="Logout" color="" />
                </MenuItem>
              }
            />
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

AdminHeader.propTypes = {
  user: PropTypes.object.isRequired,
  drawerCollapsed: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  onProfileSettings: PropTypes.func.isRequired,
}

export default AdminHeader
