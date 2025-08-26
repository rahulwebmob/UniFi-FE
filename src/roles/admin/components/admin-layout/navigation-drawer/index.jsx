import { Box, List, Fade, Stack, Drawer, Divider, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ChevronRight } from 'lucide-react'
import PropTypes from 'prop-types'

import MainLogo from '../../../../../assets/logo.svg'
import NavigationItem from '../navigation-item'

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from './constants'

const NavigationDrawer = ({
  navigationItems,
  mobileOpen,
  drawerCollapsed,
  isMobile,
  isActive,
  onDrawerToggle,
  onNavigate,
}) => {
  const theme = useTheme()

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {!isMobile && (
        <IconButton
          onClick={onDrawerToggle}
          size="small"
          sx={{
            top: 22,
            width: 24,
            right: -12,
            height: 24,
            zIndex: 1200,
            position: 'absolute',
            color: 'primary.main',
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[1],
          }}
        >
          <ChevronRight
            size={16}
            style={{ transform: drawerCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
          />
        </IconButton>
      )}

      <Box
        sx={{
          p: 2,
          minHeight: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: drawerCollapsed && !isMobile ? 'center' : 'flex-start',
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
                  letterSpacing: 3.84,
                  fontSize: { xs: '16px', sm: '18px' },
                  color: 'text.primary',
                }}
              >
                UNICITIZENS
              </Typography>
            </Box>
          </Fade>
        </Stack>
      </Box>

      <Divider />

      <List sx={{ flex: 1, py: 2 }}>
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={isActive(item)}
            drawerCollapsed={drawerCollapsed}
            isMobile={isMobile}
            onNavigate={onNavigate}
          />
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>

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
        {drawerContent}
      </Drawer>
    </>
  )
}

NavigationDrawer.propTypes = {
  navigationItems: PropTypes.array.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  drawerCollapsed: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isActive: PropTypes.func.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
}

export default NavigationDrawer
