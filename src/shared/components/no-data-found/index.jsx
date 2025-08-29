import { Box, useTheme, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import NoDataIcon from '../../../assets/svgicons/no-data.svg?react'

const NoDataFound = ({ title = undefined, description = undefined, isTable = false }) => {
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
        minHeight: isTable ? '400px' : '300px',
        py: isTable ? 8 : 4,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <NoDataIcon
          fill={theme.palette.primary.light}
          style={{
            maxWidth: '150px',
            height: 'auto',
          }}
        />
      </Box>
      <Typography variant="h5" mb={1}>
        {title ?? "There's no data available."}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description ?? 'Please try changing your filters or search for something else.'}
      </Typography>
    </Box>
  )
}
NoDataFound.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  isTable: PropTypes.bool,
}

export default NoDataFound
