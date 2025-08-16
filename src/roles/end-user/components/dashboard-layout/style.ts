import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const GridLogo = styled(Box)(({ theme, isBasicSubscribed }) => {
  const commonStyle = {
    overflow: 'hidden',
    width: '100%',
    flexGrow: 1,
    '& .ViewAll': {
      display: ' flex',
      justifyContent: 'space-between',
      '& .MuiTypography-title': {
        fontSize: '1em',
        fontStyle: ' normal',
        fontWeight: ' 700',
        lineHeight: '160%',
      },
      '& .MuiTypography-p': {
        color: theme.palette.error.main,
        fontSize: '0.875em',
        fontStyle: ' normal',
        fontWeight: '500',
        lineHeight: '160%',
        texTransform: 'uppercase',
      },
    },
  }

  if (isBasicSubscribed) {
    return commonStyle
  }
  return { ...commonStyle, padding: isBasicSubscribed ? '24px' : 0 }
})
export const AdGrid = styled('div')(({ theme }) => ({
  width: '100%',
  '& .react-resizable-handle': {
    zIndex: '3',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  },
}))

export default {
  GridLogo,
  AdGrid,
}
