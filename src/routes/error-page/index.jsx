import { Box, Button, styled, useTheme, Typography } from '@mui/material'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useRouteError } from 'react-router-dom'

const ResetPasswordBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  padding: '20px',
})

const ErrorPage = ({ module }) => {
  const { t } = useTranslation(['application'])
  const theme = useTheme()
  const error = useRouteError()
  const navigate = useNavigate()
  console.error(error)

  return (
    <ResetPasswordBox>
      <Box className="PartnersForm" sx={{ textAlign: 'center' }}>
        <AlertTriangle
          color={theme.palette.primary.main}
          style={{ width: '70px', height: '70px' }}
        />
        <Typography variant="h3" mt={2} mb={2}>
          {t('application:UI.ERROR_PAGE.HEADING')}
        </Typography>
        <Typography variant="body1" mb={2}>
          {t('application:UI.ERROR_PAGE.BODY')}
        </Typography>
        {module !== 'publicRoutes' && (
          <Button
            sx={{ borderRadius: '10px' }}
            color="primary"
            size="small"
            variant="contained"
            onClick={() => {
              void navigate(module === 'admin' ? '/admin' : '/dashboard')
            }}
          >
            {t('application:UI.ERROR_PAGE.GO_TO_DASHBOARD')}
          </Button>
        )}
      </Box>
    </ResetPasswordBox>
  )
}

export default ErrorPage
