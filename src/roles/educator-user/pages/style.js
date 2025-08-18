import { styled } from '@mui/material/styles'

export const MainForm = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  '& .mainComponent': {
    minHeight: '300px',
    padding: '4px',
    overflowY: 'auto',
    overflowX: 'hidden',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary[100],
    },
  },
  '& .star': {
    color: theme.palette.error.main,
  },
  '& .UploadFiles': {
    position: 'relative',
    border: '1px solid ',
    borderColor: theme.palette.primary[100],
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '10px',
    width: '100%',
    height: 140,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.primary.light,
    cursor: 'pointer',
    textAlign: 'center',
    '&:hover': {
      bgcolor: 'action.hover',
    },
  },
  '& .link': {
    cursor: 'pointer',
    transition: 'color 0.3s',
    color: theme.palette.primary.main,
    '&:hover': { textDecoration: 'underline' },
  },
}))

export const EducationForm = styled('div')(({ theme }) => ({
  width: '100%',
  marginBottom: '24px',
  marginTop: '16px',
  background: theme.palette.primary.light,
  paddingTop: '16px',
  paddingBottom: '16px',
  borderRadius: '8px',
  '& .MuiStepConnector-root': {
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)',
  },
  '& .MuiStepConnector-root .MuiStepConnector-line': {
    borderColor: theme.palette.divider,
  },
  '& .Mui-active .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
  '& .Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
}))

export default {
  EducationForm,
  MainForm,
}
