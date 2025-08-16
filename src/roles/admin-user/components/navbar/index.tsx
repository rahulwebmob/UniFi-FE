import { NavLink } from 'react-router-dom'
import { FileText, DollarSign, CheckSquare } from 'lucide-react'

import { Box, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material'

import { NavbarContainer } from './style'
import useWindowOpen from '../../../../Hooks/useWindowOpen'

interface NavbarProps {
  open: boolean
}

interface NavItem {
  label: string
  to?: string
  permissionName: string
  icon: React.ReactNode
  showItem: boolean
  link?: string
}

const Navbar = ({ open }: NavbarProps) => {
  const openWindow = useWindowOpen('')
  const educationList: NavItem[] = [
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

  const renderByType = (eachItem: NavItem) => (
    <ListItem
      key={eachItem.label}
      component={eachItem.to ? NavLink : undefined}
      to={eachItem.to || undefined}
      style={{ cursor: `${eachItem.link && 'pointer'}`, padding: '0' }}
      onClick={() => {
        if (eachItem.link) {
          openWindow(eachItem.link)
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
        <ListItemText primary={eachItem.label} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  )

  return (
    <NavbarContainer>
      {educationList.map((eachItem) => (
        <Box key={eachItem.label}>{renderByType(eachItem)}</Box>
      ))}
    </NavbarContainer>
  )
}

export default Navbar
