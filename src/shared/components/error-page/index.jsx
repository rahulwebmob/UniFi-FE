import { Box, Button, styled, useTheme, Typography } from '@mui/material'
import { AlertTriangle } from 'lucide-react'
import PropTypes from 'prop-types'
import { useNavigate, useRouteError } from 'react-router-dom'

const ResetPasswordBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  padding: '20px',
})

const ErrorPage = ({ module = '' }) => {
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
          Oops, Something went wrong
        </Typography>
        <Typography variant="body1" mb={2}>
          Brace yourself till we get the error fixed. You may also refresh the page or try again
          later.
        </Typography>
        {module !== 'publicRoutes' && (
          <Button
            sx={{ borderRadius: '10px' }}
            color="primary"
            size="small"
            variant="contained"
            onClick={() => {
              navigate(module === 'admin' ? '/admin' : '/dashboard')
            }}
          >
            Go To Dashboard
          </Button>
        )}
      </Box>
    </ResetPasswordBox>
  )
}

ErrorPage.propTypes = {
  module: PropTypes.string,
}

export default ErrorPage
