import { styled } from '@mui/material/styles'

export default styled('div')(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'none',
    '& .MuiDivider-root': {
      background: theme.palette.primary.default,
    },

    '& .MuiTableRow-root': {
      background: 'none !important',
      '& .MuiTableCell-head': {
        background: theme.palette.primary[100],
        fontWeight: '100',
      },
    },
    '& td[data-pinned="true"]': {
      background: theme.palette.background.default,
    },
    '& td[data-pinned="true"]:before': {
      background: theme.palette.background.default,
    },
    '& th[data-pinned="true"]:before': {
      background: theme.palette.background.default,
    },
    '& .MuiTableContainer-root': {
      padding: '0',
    },
    '& .MuiTable-root': {
      background: 'none',
    },
    '& thead.MuiTableHead-root': {
      background: theme.palette.primary.light,
    },
    '& .MuiTableCell-body': {
      fontWeight: 100,
      whitespace: 'nowrap',
    },
  },
}))
