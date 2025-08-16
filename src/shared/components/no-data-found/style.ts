import { styled } from '@mui/material/styles'

export const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '80vh',
  svg: {
    fontSize: '9em',
    color: theme.palette.grey[300],
  },
  '& .MuiTypography-h2': {
    textAlign: 'center',
    color: theme.palette.grey[300],
  },
}))
export default { Wrapper }
