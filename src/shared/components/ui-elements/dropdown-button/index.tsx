// import { useSelector } from 'react-redux' // Uncomment if selector is needed
import { ChevronRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'

import {
  Menu,
  Button,
  MenuItem,
  useTheme,
  TextField,
  Typography,
} from '@mui/material'

interface DropdownMenuItem {
  name: string
  onClick: (
    subItemName?: string,
    component?: React.ReactNode,
    isFullWidthRequired?: boolean,
  ) => void
  options?: {
    name: string
    component?: React.ReactNode
    isFullWidthRequired?: boolean
  }[]
}

interface DropdownButtonProps {
  buttonName: string | object
  menuItems: DropdownMenuItem[]
  showSelectedItem?: boolean
  element?: React.ReactElement
  defaultValue?: { item?: string; subItem?: string } | string | null
  [key: string]: unknown
}

const DropdownButton = ({
  buttonName,
  menuItems,
  showSelectedItem = false,
  element = null,
  defaultValue = null,
  ...props
}: DropdownButtonProps) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [nestedAnchorEl, setNestedAnchorEl] = useState(null)
  const [selectedItem, setSelectedItem] = useState(defaultValue?.item)
  const [selectedSubItem, setSelectedSubItem] = useState(defaultValue?.subItem)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const [textValue, setTextValue] = useState('')
  // const { direction } = useSelector((state) => state.app.language) // Uncomment if direction is needed
  const open = Boolean(anchorEl)
  const theme = useTheme()
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    event.preventDefault()
    setIsSubMenuOpen(false)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNestedClick = (event: React.MouseEvent<HTMLElement>, itemName: string) => {
    setNestedAnchorEl(event.currentTarget)
    setSelectedItem(itemName)
    setSelectedSubItem(null)
    setIsSubMenuOpen(true)
  }

  const handleNestedClose = () => {
    setNestedAnchorEl(null)
    setSelectedItem(null)
    setIsSubMenuOpen(false)
  }

  const getValue = () => {
    const foundItem = menuItems.find((item) => item.name === selectedItem)
    if (foundItem?.options) {
      if (selectedSubItem) {
        return selectedSubItem
      }
      return textValue || `Select ${buttonName}`
    }
    if (selectedItem) {
      return selectedItem
    }
    return `Select ${buttonName}`
  }

  useEffect(() => {
    if (selectedSubItem) {
      setTextValue(selectedSubItem)
    } else if (
      selectedItem &&
      !menuItems.find((item) => item.name === selectedItem)?.options
    ) {
      setTextValue(selectedItem)
    }
  }, [selectedItem, selectedSubItem, menuItems])

  const renderElement = () => {
    const Component = element || Button
    return (
      <Component
        id="dropdown-button"
        aria-controls={open ? 'dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        {...props}
      >
        {showSelectedItem ? (
          <TextField
            type="text"
            fullWidth
            size="small"
            label={buttonName}
            value={getValue()}
          />
        ) : (
          buttonName
        )}
      </Component>
    )
  }

  return (
    <>
      {renderElement()}
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'dropdown-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiList-root': {
            padding: 0,
            '& .MuiMenuItem-root': {
              ':hover': {
                background: theme.palette.primary[200],
              },
            },
          },
        }}
      >
        {menuItems.map((item) => [
          <MenuItem
            key={item.name}
            onClick={(e) => {
              if (item.options) {
                handleNestedClick(e, item.name)
              } else {
                setSelectedItem(item.name)
                setSelectedSubItem(null)
                item.onClick()
                handleClose()
              }
            }}
          >
            <Typography component="p"> {item.name}</Typography>
            {item.options && (
              <span
                style={{
                  marginLeft: 'auto',
                  marginRight: 0,
                }}
              >
                <ChevronRight
                  style={{
                    transform: 'none',
                  }}
                />
              </span>
            )}
          </MenuItem>,

          item.options && selectedItem === item.name && isSubMenuOpen && (
            <Menu
              anchorEl={nestedAnchorEl}
              open={Boolean(nestedAnchorEl)}
              onClose={handleNestedClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={{
                '& .MuiList-root': {
                  padding: 0,
                  '& .MuiMenuItem-root': {
                    ':hover': {
                      background: theme.palette.primary[200],
                    },
                  },
                },
              }}
            >
              {item.options.map((option) => (
                <MenuItem
                  onClick={() => {
                    setSelectedSubItem(option.name)
                    item.onClick(
                      option.name,
                      option.component,
                      !!option.isFullWidthRequired,
                    )
                    handleClose()
                  }}
                  key={option.name}
                >
                  <Typography component="p"> {option.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          ),
        ])}
      </Menu>
    </>
  )
}

export default DropdownButton
