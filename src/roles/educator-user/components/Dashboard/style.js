import { styled } from '@mui/material/styles'
import { Box, Button, Container } from '@mui/material'

export const StyledContainer = styled(Container)(({ theme }) => ({
  width: '100%',
  maxWidth: 1400,
  backgroundColor: theme.palette.background.light,
}))

export const CardContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 24,
  marginTop: 32,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: 16,
  },
}))

export const StyledCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  textAlign: 'center',
  alignItems: 'center',
  minHeight: 250,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  justifyContent: 'space-between',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
}))

export const StyledButton = styled(Button)(() => ({
  width: '100%',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  borderRadius: 8,
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
}))
