import { styled } from '@mui/material'

export const GridContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gridColumnGap: '20px',
  gridRowGap: '20px',
  justifyContent: 'center',
  alignContent: 'center',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gridColumnGap: '24px',
    gridRowGap: '24px',
  },
}))

export const CourseCard = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '16px',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.grey[200]}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(17, 66, 98, 0.12)',
    borderColor: theme.palette.primary[200],
  },
}))
