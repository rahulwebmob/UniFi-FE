import { Box, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import useManualPolling from '../../../../hooks/useManualPolling'
import { useEducatorAuthQuery } from '../../../../services/admin'
import Footer from '../../../../shared/components/footer'
import Header from '../Header'

const EducatorLayout = () => {
  const theme = useTheme()
  const { isFullscreen } = useSelector((state) => state.app)

  const { refetch } = useEducatorAuthQuery(undefined)

  useManualPolling(refetch, 3000)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[50],
      }}
    >
      {!isFullscreen && <Header />}

      {/* Main Content */}
      <Box
        p={{
          xs: 2,
          sm: 3,
          md: 4,
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      {!isFullscreen && <Footer />}
    </Box>
  )
}

export default EducatorLayout
