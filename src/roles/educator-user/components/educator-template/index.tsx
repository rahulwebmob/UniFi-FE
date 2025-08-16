import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Box, useTheme, useMediaQuery } from '@mui/material'

import Header from '../Header'
import Footer from '../Footer'
import LANGUAGES from '../../../../Constants/LANGUAGES'
import { useEducatorAuthQuery } from '../../../../Services/admin'
import useManualPolling from '../../../../Hooks/useManualPolling'
import { updateLanguage } from '../../../../Redux/Reducers/AppSlice'

const EducatorTemplate = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { isFullscreen } = useSelector((state) => state.app)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { refetch } = useEducatorAuthQuery()

  useManualPolling(refetch, 3000)
  const iff = (condition, then, otherwise) => (condition ? then : otherwise)

  useEffect(() => {
    if (user?.language) dispatch(updateLanguage(LANGUAGES[user?.language]))
  }, [user?.language, dispatch])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[50],
      }}
    >
      {/* Header */}
      {!isFullscreen && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            display: 'flex',
            padding: '12px 24px',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          }}
        >
          <Header />
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          margin: '0 auto',
          padding: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Footer */}
      {!isFullscreen && <Footer />}
    </Box>
  )
}

export default EducatorTemplate
