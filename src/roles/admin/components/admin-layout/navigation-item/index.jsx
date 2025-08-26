import {
  Box,
  Fade,
  alpha,
  Tooltip,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'

const NavigationItem = ({ item, isActive, drawerCollapsed, isMobile, onNavigate }) => {
  const theme = useTheme()

  const handleClick = () => {
    onNavigate(item.path)
  }

  const listItemButton = (
    <ListItemButton
      onClick={handleClick}
      sx={{
        mx: 1.5,
        my: 0.5,
        borderRadius: 1.5,
        height: 48,
        transition: 'all 0.2s',
        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
        color: isActive ? 'primary.main' : 'text.secondary',

        ...(drawerCollapsed &&
          !isMobile && {
            mx: 0.75,
            justifyContent: 'center',
          }),
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: drawerCollapsed && !isMobile ? 'auto' : 42,
          color: 'inherit',
        }}
      >
        {item.icon}
      </ListItemIcon>

      <Fade in={!drawerCollapsed || isMobile}>
        <ListItemText
          primary={item.label}
          sx={{
            display: drawerCollapsed && !isMobile ? 'none' : 'block',
            '& .MuiListItemText-primary': {
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
            },
          }}
        />
      </Fade>

      {isActive && (!drawerCollapsed || isMobile) && (
        <Box
          sx={{
            width: 4,
            height: 24,
            bgcolor: 'primary.main',
            borderRadius: 1,
            ml: 'auto',
          }}
        />
      )}
    </ListItemButton>
  )

  return drawerCollapsed && !isMobile ? (
    <Tooltip title={item.label} placement="right">
      {listItemButton}
    </Tooltip>
  ) : (
    listItemButton
  )
}

NavigationItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  drawerCollapsed: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func.isRequired,
}

export default NavigationItem
