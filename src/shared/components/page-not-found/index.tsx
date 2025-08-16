import React from 'react'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Typography } from '@mui/material'

import PageNotFoundLogo from '../../../Assets/svgicons/page-not-found.svg?react'

const PageNotFound = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        background: (theme) => theme.palette.background.default,
        width: '100%',
        height: '100vh',
      }}
    >
      <PageNotFoundLogo style={{ maxWidth: '300px', height: 'auto' }} />
      <Box my={1}>
        <Typography variant="h1" mb={1}>
          {t('application:UI.PAGE_NOT_FOUND.OOPS_PAGE_NOT_FOUND')}
        </Typography>
        <Typography component="p" color="text.secondary">
          {t('application:UI.PAGE_NOT_FOUND.GOING_BACK_TO_HOMEPAGE')}
        </Typography>
      </Box>
      <Button variant="contained" size="small" onClick={() => { void navigate('/') }}>
        Home
      </Button>
    </Box>
  )
}
export default PageNotFound
