import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, useTheme, Typography } from '@mui/material'

import NoDataIcon from '../../../Assets/svgicons/no-data.svg?react'

interface NoDataFoundProps {
  title?: string
  description?: string
  isTable?: boolean
}

const NoDataFound: React.FC<NoDataFoundProps> = ({ title, description, isTable = false }) => {
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
      <Typography variant="h5" mb={1} fontWeight={600}>
        {title ?? t('application:UI.NO_DATA_FOUND.TITLE')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description ?? t('application:UI.NO_DATA_FOUND.DESCRIPTION')}
      </Typography>
    </Box>
  )
}
export default NoDataFound
