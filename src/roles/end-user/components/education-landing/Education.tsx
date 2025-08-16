import { Box, Typography } from '@mui/material'

import AllContent from '../all-content'
import PurchasedContent from '../purchased-content'

const EducationLanding = () => (
    <Box sx={{ width: '100%' }}>
      <>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Overview
          </Typography>
          <Typography
            component="p"
            color="text.secondary"
          >
            View and access your purchased courses or webinars anytime,
            anywhere.
          </Typography>
        </Box>

        <PurchasedContent />
      </>

      <AllContent />
    </Box>
  )

export default EducationLanding
