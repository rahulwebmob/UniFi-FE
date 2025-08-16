import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, useTheme, Typography } from '@mui/material'

import NoDataIcon from '../../../Assets/svgicons/no-data.svg?react'

interface NoDataFoundProps {
  title?: string
  description?: string
}

const NoDataFound: React.FC<NoDataFoundProps> = ({ title, description }) => {
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
        minHeight: '100%',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

          }}
        >
          <NoDataIcon
            fill={theme.palette.primary.light}
            style={{
              maxWidth: '200px',
              height: 'auto',
            }}
          />
        </Box>
        <Typography variant="h3" mb={1}>
          {title ?? t('application:UI.NO_DATA_FOUND.TITLE')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description ?? t('application:UI.NO_DATA_FOUND.DESCRIPTION')}
        </Typography>
      </Box>
    </Box>
  )
}
export default NoDataFound
