import { styled } from '@mui/material/styles'
import { Box, Button, Container } from '@mui/material'

export const StyledDashboard = styled(Box)(({ theme }) => ({
  padding: 16,
  borderRadius: 8,
  background: theme.palette.primary.light,
  '& .MuiTypography-root': {
    fontFamily: 'Inter',
  },
}))

export const StyledContainer = styled(Container)({
  width: '100%',
  maxWidth: 1400,
})

export const CardContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.light,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  marginTop: 16,
  padding: 16,
  borderRadius: '16px',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}))

export const StyledCard = styled(Box)(({ theme }) => ({
  flex: '1 1 calc(50% - 8px)',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  marginBottom: '8px',
  padding: 16,
  minHeight: 235,
  borderRadius: 16,
  border: `2px dotted ${theme.palette.primary.main}`,
  justifyContent: 'space-between',
}))

export const StyledButton = styled(Button)({
  width: '100%',
})
