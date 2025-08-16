import React, { useState } from 'react'
import { Settings } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box, Grid, Menu, Avatar, MenuItem, ListItemIcon } from '@mui/material'

import { generateImageUrl } from '../../../../../utils/globalUtils'

interface UserState {
  user: {
    firstName: string
    lastName: string
    profileImage?: {
      folderName: string
      fileName: string
    }
    _id: string
  }
}

interface RootState {
  user: UserState['user']
}

const UserProfile = () => {
  const { t } = useTranslation('application')
  const { firstName, lastName, profileImage, _id } = useSelector(
    (state: RootState) => state.user,
  )
  const navigate = useNavigate()
  const imageUrl = generateImageUrl(
    profileImage?.folderName,
    profileImage?.fileName,
  )
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // const handleButtonName = () => {
  //   if (!isBasicSubscribed && !isQPNewsSubscribed && !isQINNewsSubscribed) {
  //     return 'Try Premium'
  //   }
  //   return 'Update Premium'
  // }

  return (
    <Grid
      item
      xs={3}
      sx={{
        display: 'flex',
        alignItem: 'center',
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
