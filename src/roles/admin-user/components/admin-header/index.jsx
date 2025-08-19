import {
  Box,
  Avatar,
  Toolbar,
  MenuItem,
  IconButton,
  Typography,
  ListItemIcon,
  Menu as MuiMenu,
} from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import { Menu, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import LogoutWrapper from '../../../../shared/components/auth-wrapper/logout'

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const AdminHeader = ({ open, position, handleDrawerOpen }) => {
  const { user } = useSelector((state) => state.user)
  const { firstName, lastName, email } = user

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position={position} open={open}>
      <Toolbar sx={{ backgroundColor: (theme) => theme.palette.primary.dark }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <Menu />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: '700', fontSize: '1.625em' }}
        />

        <Box display="flex" alignItems="center">
          <Avatar alt="Profile Picture" sx={{ backgroundColor: 'background.light' }}>
            {firstName[0].toUpperCase() + lastName[0].toUpperCase()}
          </Avatar>
          <Box ml={1} style={{ cursor: 'pointer', color: 'white.main' }} onClick={handleClick}>
            <Typography>
              {firstName} {lastName}
            </Typography>
            <Typography>{email}</Typography>
          </Box>
          <MuiMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <LogoutWrapper
              type="admin"
              component={
                <MenuItem>
                  <ListItemIcon>
                    <LogOut size={20} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              }
            />
          </MuiMenu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader
