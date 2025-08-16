import { styled } from '@mui/material/styles'

const ReviewDetail = styled('div')(({ theme }) => ({
  '& .MuiTypography-root': {
    fontWeight: '100',
  },
  '& .MuiTypography-h5': {
    fontSize: '1em',
    fontWeight: '600',
  },
  '& .BillingDetail': {
    display: 'flex',
    justifyContent: 'space-between',
  },
  '& .SavedBilling': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    marginBottom: '5px',
    '& .savedDetail': {
      color: theme.palette.success.main,
      fontSize: '1em',
      '& .subtotal': {
        textDecoration: 'line-through',
      },
    },
  },
  '& .TotalBilling': {
    display: 'flex',
    justifyContent: 'space-between',
  },
  '& .CoupanCode': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
}))
const ReviewBox = styled('div')(() => ({}))

export { ReviewBox, ReviewDetail }
