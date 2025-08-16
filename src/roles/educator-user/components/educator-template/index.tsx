import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Box, useTheme, useMediaQuery } from '@mui/material'

import Header from '../header'
import Footer from '../footer'
import LANGUAGES from '../../../../constants/LANGUAGES'
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
        justifyContent: 'space-between',
        height: '100vh',
      }}
    >
      {/* Header */}
      <Box>
        {!isFullscreen && (
          <Box
            sx={{
              height: '60px',
              display: 'flex',
              padding: '5px 24px',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.palette.primary[100],
            }}
          >
            <Header />
          </Box>
        )}

        {/* Main Content */}
        <Box
          sx={{
            overflowY: 'auto',
            height: iff(
              isFullscreen,
              '100vh',
              isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 100px)',
            ),
            p: 3,
            pb: isMobile ? 8 : 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Footer */}
      {!isFullscreen && (
        <Box
          sx={{
            position: isMobile ? 'static' : 'fixed',
            left: '0',
            bottom: '0',
            width: '100%',
            backgroundColor: theme.palette.background.default,
            zIndex: 1000,
          }}
        >
          <Footer />
        </Box>
      )}
    </Box>
  )
}

export default EducatorTemplate
