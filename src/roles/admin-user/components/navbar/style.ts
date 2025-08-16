import { styled } from '@mui/material'

export const NavbarContainer = styled('div')(({ theme }) => ({
  maxHeight: 'calc(100vh - 40px)',
  '& .MuiList-root': {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
  },
  '& .MuiListItem-root': {
    margin: '0 auto 10px',
    cursor: 'pointer',
    width: '228px',
    padding: '8px',
    color: theme.palette.common.white,
    borderRadius: '8px',
    '& .MuiListItemIcon-root': {
      '& svg': {
        color: theme.palette.common.white,
        fontSize: '1.5em',
        path: {
          stroke: theme.palette.common.white,
        },
      },
    },
  },
  '& .MuiListItemText-root': {
    margin: '0px',
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
      fontSize: '1em',
      fontWeight: '400',
      lineHeight: '18.17px',
    },
  },
}))
export default { NavbarContainer }
