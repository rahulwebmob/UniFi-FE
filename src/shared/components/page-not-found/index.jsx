import { Box, Button, useTheme, Typography } from '@mui/material'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'

import PageNotFoundLogo from '../../../assets/svgicons/page-not-found.svg?react'

const PageNotFound = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        background: theme.palette.background.default,
        width: '100%',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          '& .device-bg': {
            fill: `${theme.palette.primary.main}40`,
          },
          '& .dot-dark, & .bar-dark, & .circle-dark': {
            fill: theme.palette.primary.light,
            opacity: 0.6,
          },
          '& .dot-accent, & .outline-accent, & .text-404': {
            fill: theme.palette.primary.light,
            stroke: theme.palette.primary.light,
          },
          '& .hand-accent': {
            fill: theme.palette.primary.light,
            stroke: theme.palette.primary.main,
            opacity: 0.9,
          },
        }}
      >
        <PageNotFoundLogo style={{ maxWidth: '300px', height: 'auto' }} />
      </Box>
      <Box my={1}>
        <Typography variant="h3" mb={1}>
          {t('application:UI.PAGE_NOT_FOUND.OOPS_PAGE_NOT_FOUND')}
        </Typography>
        <Typography component="p" color="text.secondary">
          {t('application:UI.PAGE_NOT_FOUND.GOING_BACK_TO_HOMEPAGE')}
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          void navigate('/')
        }}
      >
        Home
      </Button>
    </Box>
  )
}
export default PageNotFound
