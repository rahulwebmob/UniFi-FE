import { styled } from '@mui/material/styles'

export const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '72vh',

  '& .custom-shape-divider-top': {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    overflow: 'hidden',
    lineHeight: '0',
  },
  '& .custom-shape-divider-top svg': {
    position: ' relative',
    display: 'block',
    width: 'calc(100% + 1.3px)',
    height: '250px',
    transform: 'rotateY(180deg)',
  },
  '& .custom-shape-divider-top .shape-fill': {
    fill: theme.palette.error.main,
  },
  svg: {
    fontSize: '9em',
    color: theme.palette.grey.light,
  },
  '& .MuiTypography-h2': {
    textAlign: 'center',
    color: theme.palette.grey.light,
  },
  '& .Backhome': {
    background: theme.palette.error.main,
    color: theme.palette.common.white,
    padding: '10px 26px',
    display: 'block',
    margin: '30px 0 0px 0',
    fontSize: '1.125em',
  },
}))
export default { Wrapper }
