import { Box, TextField, Typography, Chip, IconButton, Menu, MenuItem } from '@mui/material'
import { debounce } from 'lodash'
import { Search, User, Edit2, Shield, Trash2, MoreVertical } from 'lucide-react'
import { useMemo, useState, useRef } from 'react'

import { useGetPlatformUsersQuery } from '../../../../services/admin'
import ApiMiddleware from '../../../../shared/components/api-middleware'
import ModalBox from '../../../../shared/components/ui-elements/modal-box'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import PlatformUserModal from '../../components/admin-modals/platform-user'

const PlatformUsers = () => {
  const modalRef = useRef()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const {
    data: platformUsers,
    isLoading,
    error,
  } = useGetPlatformUsersQuery({
    page,
    pageSize: 10,
    search,
  })

  const debouncedSearch = debounce((value) => {
    setPage(1)
    setSearch(value)
  }, 700)

  const handleMenuClick = (event, user) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOpenModal = (type) => {
    setModalType(type)
    handleMenuClose()
    modalRef.current?.openModal()
  }

  const renderModal = () => {
    if (!selectedUser) {
      return null
    }

    return (
      <PlatformUserModal
        modalType={modalType}
        userId={selectedUser._id}
        firstName={selectedUser.firstName}
        lastName={selectedUser.lastName}
        email={selectedUser.email}
        closeModal={() => modalRef.current?.closeModal()}
      />
    )
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Name',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original } = row
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <User size={16} />
              <Typography variant="body2">
                {`${original?.firstName || ''} ${original?.lastName || ''}`.trim() || '-'}
              </Typography>
            </Box>
          )
        },
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return <Typography variant="body2">{cell.getValue() || '-'}</Typography>
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original } = row
          const roleColors = {
            admin: 'error',
            user: 'primary',
            educator: 'success',
          }
          return (
            <Chip
              label={original?.role || 'user'}
              size="small"
              color={roleColors[original?.role] || 'default'}
              icon={original?.role === 'admin' ? <Shield size={14} /> : null}
            />
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original } = row
          return (
            <Chip
              label={original?.status || 'active'}
              size="small"
              color={original?.status === 'active' ? 'success' : 'default'}
              variant="outlined"
            />
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined Date',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Typography variant="body2">
              {cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : '-'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'lastLoginAt',
        header: 'Last Active',
        Cell: (tableProps) => {
          const { cell } = tableProps
          return (
            <Typography variant="body2" color="text.secondary">
              {cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : 'Never'}
            </Typography>
          )
        },
      },
      {
        accessorKey: 'action',
        header: 'Actions',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original } = row
          return (
            <>
              <IconButton size="small" onClick={(e) => handleMenuClick(e, original)}>
                <MoreVertical size={16} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && selectedUser?._id === original._id}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleOpenModal('edit')}>
                  <Edit2 size={14} style={{ marginRight: 8 }} />
                  Edit
                </MenuItem>
                <MenuItem onClick={() => handleOpenModal('delete')}>
                  <Trash2 size={14} style={{ marginRight: 8 }} />
                  Delete
                </MenuItem>
              </Menu>
            </>
          )
        },
        enableSorting: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [anchorEl, selectedUser],
  )

  return (
    <ApiMiddleware
      error={error}
      isLoading={isLoading}
      isData
      text="No Users Found"
      description="There are no platform users at the moment."
    >
      <Box>
        <Box mb={3}>
          <Typography variant="h4" mb={0.5}>
            Platform Users
          </Typography>
          <Typography color="text.secondary">Manage all platform users and their roles</Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 1,
            backgroundColor: (theme) => theme.palette.background.light,
            boxShadow: (theme) => theme.customShadows.primary,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',

              mb: 3,
            }}
          >
            <TextField
              size="small"
              placeholder="Search users..."
              onChange={(e) => debouncedSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
              }}
              sx={{ width: 250 }}
            />
          </Box>

          <MuiReactTable
            columns={columns}
            rows={platformUsers?.data ?? []}
            height="auto"
            materialReactProps={{
              enableRowSelection: false,
              enableColumnActions: false,
              enableDensityToggle: false,
              enableFullScreenToggle: false,
            }}
          />

          <Box mt={2} display="flex" justifyContent="center">
            <PaginationComponent data={platformUsers} page={page} setPage={setPage} />
          </Box>
        </Box>
      </Box>

      <ModalBox ref={modalRef}>{renderModal()}</ModalBox>
    </ApiMiddleware>
  )
}

export default PlatformUsers
