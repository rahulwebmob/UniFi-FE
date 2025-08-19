import { Box, Grid, Menu, Avatar, MenuItem, ListItemIcon } from '@mui/material'
import { Settings } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { generateImageUrl } from '../../../../../utils/globalUtils'

const UserProfile = () => {
  const { t } = useTranslation('application')
  const { firstName, lastName, profileImage, _id } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const imageUrl = generateImageUrl(`${profileImage?.folderName}/${profileImage?.fileName}`)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: {
          xs: 'column',
          lg: 'row',
        },
        gap: { xs: '20px', lg: '20px' },
      }}
    >
      <Box
        className="user-profile"
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <Avatar
          alt={t('application:PROFILE.PROFILE_PICTURE')}
          src={imageUrl}
          sx={{
            height: '35px',
            width: '35px',
          }}
        >
          {firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}
        </Avatar>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleClose()
            void navigate(`/settings/profile/${_id}`)
          }}
        >
          <ListItemIcon>
            <Settings size={16} />
          </ListItemIcon>
          {t('application:PROFILE.PROFILE')}
        </MenuItem>
      </Menu>
    </Grid>
  )
}

export default UserProfile
