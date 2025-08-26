import { Box, Typography } from '@mui/material'

import AllContent from '../../components/user-content/all-content'
import PurchasedContent from '../../components/user-content/purchased-content'

const EducationLanding = () => (
  <Box>
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4">Overview</Typography>
      <Typography component="p" color="text.secondary">
        View and access your purchased courses or webinars anytime, anywhere.
      </Typography>
    </Box>

    <PurchasedContent />
    <AllContent />
  </Box>
)

export default EducationLanding
