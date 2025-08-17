import { Outlet } from 'react-router-dom'
import { useRef, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, useTheme } from '@mui/material'

import Footer from '../footer'
import TopNavigation from '../top-navigation'
import LANGUAGES from '../../../../constants/languages'
import { useLoggedUserQuery } from '../../../../services/admin'
import { loggedIn } from '../../../../redux/reducers/user-slice'
import type { User } from '../../../../redux/reducers/user-slice'
import { updateLanguage } from '../../../../redux/reducers/app-slice'
import ScrollToTop from '../../../../shared/components/scroll-to-top'

interface RootState {
  app: {
    isFullscreen: boolean
  }
}

import type { Language } from '../../../../redux/reducers/app-slice'

interface UserAppearance {
  language: string
}

interface LoggedUser {
  appearance?: UserAppearance
  [key: string]: unknown
}

const DashboardLayout = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const containerRef = useRef<HTMLElement>(null)
  const { data: loggedUser } = useLoggedUserQuery(undefined) as {
    data?: LoggedUser
  }

  const { isFullscreen } = useSelector((state: RootState) => state.app)

  const updateUser = useCallback(() => {
    // Theme and font size settings removed - no longer needed
    // Menu position is always top now - no need to update
    // Settings the application language
    if (loggedUser?.appearance?.language) {
      const languagesTyped = LANGUAGES as unknown as Record<string, Language>
      const selectedLang = languagesTyped[loggedUser.appearance.language]
      dispatch(updateLanguage(selectedLang))
    }

    // Refresh timer setting removed - no longer needed

    // Settings the user details
    if (loggedUser) {
      dispatch(
        loggedIn({
          loggedUser: loggedUser as unknown as User,
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
