import { styled } from '@mui/material/styles'
import TableRow from '@mui/material/TableRow'
import InputBase from '@mui/material/InputBase'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 400,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: '0',
    borderBottom: `2px solid ${theme.palette.primary[200]}`,
    position: 'sticky',
    top: '0',
    zIndex: '1',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    maxHeight: '500px',
    overFlow: 'auto',
    minWidth: '120px',
    [`&.${tableCellClasses.body}:nth-child(2)`]: {
      minWidth: '200px',
    },
    [`&.${tableCellClasses.body}:nth-child(3)`]: {
      minWidth: '250px',
    },
    [`&.${tableCellClasses.body}:nth-child(5)`]: {
      minWidth: '190px',
    },
  },
  '&.MuiTableCell-alignRight': {
    textAlign: 'right',
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.grey[50],
  },
  '&:hover': {
    backgroundColor: theme.palette.primary[50],
    transform: 'scale(1.01)',
    boxShadow: '0 2px 8px rgba(17, 66, 98, 0.08)',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const DeleteModal = styled('div')(() => ({
  '& .delete-modal': {
    display: 'flex',
    flexDirection: 'column',
    padding: '15px',
    borderRadius: '6px',
    width: '300px',
    '& .MuiBox-root': {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '10px',
    },
  },
}))

const TableWrapper = styled('div')(({ theme }) => ({
  '& .Nodata': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
  '& .editname-form': {
    display: 'flex',
    flexDirection: 'column',
    padding: '15px',
  },
  '& .MuiInputBase-root.MuiOutlinedInput-root ': {},

  '& .MuiInputBase-input': {
    '&.Mui-disabled': {
      opacity: '.4',
    },
  },
  '& .delete-modal': {
    padding: '20px',
    background: theme.palette.common.white,
    display: ' flex',
    flexDirection: 'column',
    justifyContent: ' center',
    alignItems: ' center',
    '& .MuiTypography-h6': {
      marginBottom: ' 24px',
      color: theme.palette.error.main,
    },
  },

  '& .Selectbox': {
    borderRadius: '4px',
    padding: '5px 10px',
  },
}))

const ChangePassword = styled('div')(() => ({
  '& .MuiInputBase-root.MuiOutlinedInput-root ': {},
}))

const PartnerListBox = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: '20px',
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(17, 66, 98, 0.08)',
  },
  '& .MuiTableCell-root': {
    padding: '0px 16px;',
    height: '45px',
  },
  '& .PartnerDropDown': {
    '& .MuiPopper-root': {
      zIndex: '1',
    },
  },
}))
const PartnerListView = styled('div')(() => ({
  padding: ' 15px',
  border: '1px solid',
  borderRadius: '8px',
  '& .MuiTableCell-root': {
    width: '301px',
  },
  '& .MuiTypography-h4': {
    fontSize: '1.375em',
    marginBottom: '18px',
    fontWeight: ' 400',
  },
}))
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})
const PaginationBar = styled('div')(() => ({
  '& .MuiPagination-root': {
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
}))

const Userdetail = styled('div')(({ theme }) => ({
  '& .main-box': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& .inside-box': {
      display: 'flex',
      width: '400px',
      justifyContent: 'center',
      padding: '10px',
      borderRadius: '4px',
    },
    '& .MuiAvatar-root': {
      height: '200px',
      width: '200px',
      fontSize: '6.25em',
    },
  },
  '& .settings-box': {
    cursor: 'pointer',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    display: 'flex',
    width: '400px',
    padding: '10px',
    background: theme.palette.primary[100],
    borderRadius: '4px',
    marginTop: '20px',
  },
  '& .inner-settings-box': {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '10px',
  },

  '& .custom-icon-button': {
    marginBottom: '2rem',
  },
}))

const BorderBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  marginBottom: '25px',
  '& .tabs': {
    width: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    borderRadius: '8px',
    background: theme.palette.primary[100],
    '& svg': {
      fontSize: '2.5em',
    },
  },
}))

const ButtonProfile = styled('div')(() => ({
  position: 'relative',
  '& .MuiButtonBase-root': {
    cursor: 'pointer',
    right: '4px',
    fontSize: '1.125em',
    padding: '2px 4px',
    borderRadius: '2px',
  },
}))
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  marginLeft: 0,
  width: '180px',
  height: '44px',
  [theme.breakpoints.up(600)]: {
    width: '240px',
  },
}))
const MaterialTable = styled('div')(({ theme }) => ({
  '& .MuiPaper-root': {
    background: theme.palette.background.paper,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(17, 66, 98, 0.08)',

    '& .MuiTableRow-root': {
      transition: 'all 0.2s ease',
      '& .MuiTableCell-head': {
        background: `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper})`,
        fontWeight: '600',
        color: theme.palette.primary.main,
        borderBottom: `2px solid ${theme.palette.primary[200]}`,
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
      background: theme.palette.primary[100],
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  fontSize: '1.125em',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
  },
  borderRadius: '30px',
}))
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))
const Twitter = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '16px',
}))
export {
  Search,
  Twitter,
  BorderBox,
  Userdetail,
  DeleteModal,
  TableWrapper,
  PaginationBar,
  ButtonProfile,
  MaterialTable,
  StyledTableRow,
  ChangePassword,
  PartnerListBox,
  StyledTableCell,
  PartnerListView,
  StyledInputBase,
  SearchIconWrapper,
  VisuallyHiddenInput,
}
