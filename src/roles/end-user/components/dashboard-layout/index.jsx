import { Box, useTheme } from '@mui/material'
import { useRef, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import LANGUAGES from '../../../../constants/languages'
import { updateLanguage } from '../../../../redux/reducers/app-slice'
import { loggedIn } from '../../../../redux/reducers/user-slice'
import { useLoggedUserQuery } from '../../../../services/admin'
import ScrollToTop from '../../../../shared/components/scroll-to-top'
import Footer from '../footer'
import TopNavigation from '../top-navigation'

const DashboardLayout = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const containerRef = useRef(null)
  const { data: loggedUser } = useLoggedUserQuery(undefined)

  const { isFullscreen } = useSelector((state) => state.app)

  const updateUser = useCallback(() => {
    // Theme and font size settings removed - no longer needed
    // Menu position is always top now - no need to update
    // Settings the application language
    if (loggedUser?.appearance?.language) {
      const languagesTyped = LANGUAGES
      const selectedLang = languagesTyped[loggedUser.appearance.language]
      dispatch(updateLanguage(selectedLang))
    }

    // Refresh timer setting removed - no longer needed

    // Settings the user details
    if (loggedUser) {
      dispatch(
        loggedIn({
          loggedUser,
        }),
      )
    }
  }, [loggedUser, dispatch])

  useEffect(() => {
    updateUser()
  }, [loggedUser, updateUser])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <ScrollToTop />
      {/* Top Navigation Bar */}
      {!isFullscreen && <TopNavigation />}

      {/* Main Content Container */}
      <Box
        ref={containerRef}
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

export default DashboardLayout
