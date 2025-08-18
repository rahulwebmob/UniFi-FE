import { NavLink } from 'react-router-dom'
import { FileText, DollarSign, CheckSquare } from 'lucide-react'

import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'

import { NavbarContainer } from './style'
import useWindowOpen from '../../../../hooks/useWindowOpen'

const Navbar = ({ open }) => {
  const openWindowFunction = useWindowOpen()
  const educationList = [
    {
      label: 'Tutor Applications',
      to: '/admin/tutor-applicants',
      permissionName: '',
      icon: <FileText size={20} />,
      showItem: true,
    },
    {
      label: 'Approved Tutors',
      to: '/admin/approved-tutors',
      permissionName: '',
      icon: <CheckSquare size={20} />,
      showItem: true,
    },
    {
      label: 'Transactions Logs',
      to: '/admin/invoices',
      permissionName: 'transactions',
      icon: <DollarSign size={20} />,
      showItem: true,
    },
  ]

  const renderByType = (eachItem) => {
    const listItemProps = eachItem.to
      ? {
          component: NavLink,
          to: eachItem.to,
        }
      : {}

    return (
      <ListItem
        key={eachItem.label}
        {...listItemProps}
        style={{ cursor: `${eachItem.link && 'pointer'}`, padding: '0' }}
        onClick={() => {
          if (eachItem.link && typeof eachItem.link === 'string') {
            openWindowFunction(eachItem.link)
          }
        }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {eachItem.icon}
          </ListItemIcon>
          <ListItemText
            primary={eachItem.label}
            sx={{ opacity: open ? 1 : 0 }}
          />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <NavbarContainer>
      {educationList.map((eachItem) => (
        <Box key={eachItem.label}>{renderByType(eachItem)}</Box>
      ))}
    </NavbarContainer>
  )
}

export default Navbar
