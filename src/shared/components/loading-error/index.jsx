import { Box, useTheme, Typography } from '@mui/material'

import LodingIssueIcon from '../../../assets/svgicons/loading-issue.svg?react'

const LoadingError = () => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        width: '100%',
        minHeight: '400px',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .background': {
              fill: theme.palette.primary.dark,
            },
          }}
        >
          <LodingIssueIcon
            fill={theme.palette.primary.main}
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        </Box>
        <Typography variant="h3" mb={1} mt={1}>
          We had some trouble loading this page.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please try refreshing the page or check your internet connectivity,
        </Typography>
      </Box>
    </Box>
  )
}

export default LoadingError
