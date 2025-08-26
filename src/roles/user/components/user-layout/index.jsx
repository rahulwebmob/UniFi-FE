import { Box } from '@mui/material'
import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { loggedIn } from '../../../../redux/reducers/user-slice'
import { useLoggedUserQuery } from '../../../../services/admin'
import Footer from '../../../../shared/components/footer'
import ScrollToTop from '../../../../shared/components/scroll-to-top'
import TopNavigation from '../user-header'

const DashboardLayout = () => {
  const dispatch = useDispatch()
  const { data: loggedUser } = useLoggedUserQuery()

  const { isFullscreen } = useSelector((state) => state.app)

  const updateUser = useCallback(() => {
    if (loggedUser) {
      dispatch(loggedIn({ loggedUser }))
    }
  }, [loggedUser, dispatch])

  useEffect(() => {
    updateUser()
  }, [loggedUser, updateUser])

  return (
    <Box>
      <ScrollToTop />
      {!isFullscreen && <TopNavigation />}

      <Box p={{ xs: 2, sm: 3, md: 4 }}>
        <Outlet />
      </Box>

      {!isFullscreen && <Footer />}
    </Box>
  )
}

export default DashboardLayout
