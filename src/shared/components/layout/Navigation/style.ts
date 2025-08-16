import { styled } from '@mui/material/styles'

export const Navigation = styled('div')(({ theme, isBiggerGap }) => ({
  display: 'flex',
  gap: isBiggerGap ? '20px' : '10px',
  padding: '12px 8px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    gap: 0,
    justifyContent: 'space-around',
  },

  '& .NavLink.active-nav': {
    color: theme.palette.text.primary,
    position: 'relative',
    '::after': {
      content: "''",
      width: '24px',
      height: '2px',
      background: theme.palette.primary.main,
      position: 'absolute',
      bottom: '-4px',
      left: '0',
      right: '0',
      margin: '0 auto',
    },
    '& svg': {
      '& path': { fill: theme.palette.primary.main },
    },
  },
  '& .NavLink': {
    color: theme.palette.secondary.main,

    '&:hover': {
      color: theme.palette.primary.main,
    },

    '& .SvgIcon svg': {
      fill: theme.palette.secondary.main,
      fontSize: '1.25em',
      verticalAlign: 'middle',
      height: '26px',
      width: '24px',
    },
  },
  '& .dropdownnews': {
    margin: '0',
  },
}))
export const MobileMenu = styled('div')(({ theme }) => ({
  background: theme.palette.primary.darker,
  minWidth: '240px',
  height: '100%',

  '& .NavLink': {
    display: 'flex',
    padding: '16px',
    alignItems: 'center',
    gap: '16px',
    color: theme.palette.secondary.main,
    '& .SvgIcon': {
      svg: {
        fill: theme.palette.secondary.main,
      },
    },
  },
  '& .NavLink.active-nav': {
    color: theme.palette.text.primary,
    position: 'relative',
    '::after': {
      content: "''",
      width: '24px',
      height: '2px',
      background: theme.palette.primary.main,
      position: 'absolute',
      bottom: '0px',
      left: '18px',
      margin: '0 auto',
      [theme.breakpoints.down('sm')]: {
        width: '1px',
        height: '29px',
        background: theme.palette.primary.main,
        top: '18px',
        borderRight: `3px solid ${theme.palette.primary.main}`,
        left: '0',
      },
    },
    '& svg': {
      '& path': { fill: theme.palette.primary.main },
    },
  },
}))
export default { Navigation, MobileMenu }
