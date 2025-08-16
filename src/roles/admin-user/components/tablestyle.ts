import { Box, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const ButtonProfile = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
}))

export const TableWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}))
