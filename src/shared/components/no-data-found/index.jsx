import { Box, useTheme, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import NoDataIcon from '../../../assets/svgicons/no-data.svg?react'

const NoDataFound = ({ title, description, isTable = false }) => {
  const theme = useTheme()
  const { t } = useTranslation('application')

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
        {title ?? t('application:UI.NO_DATA_FOUND.TITLE')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description ?? t('application:UI.NO_DATA_FOUND.DESCRIPTION')}
      </Typography>
    </Box>
  )
}
NoDataFound.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  isTable: PropTypes.bool,
}

NoDataFound.defaultProps = {
  title: undefined,
  description: undefined,
  isTable: false,
}

export default NoDataFound
