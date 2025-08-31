import { Box, TextField, Typography, Chip, IconButton, Menu, MenuItem, Button } from '@mui/material'
import { debounce } from 'lodash'
import { Search, UserCog, Edit2, Trash2, MoreVertical, UserPlus, Send, Shield } from 'lucide-react'
import { useMemo, useState, useRef } from 'react'

import { useGetAdminsQuery } from '../../../../services/admin'
import ApiMiddleware from '../../../../shared/components/api-middleware'
import ModalBox from '../../../../shared/components/ui-elements/modal-box'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import AdminUserModal from '../../components/admin-modals/admin-user'

const AdminUsers = () => {
  const modalRef = useRef()
  const [pageNo, setPageNo] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const {
    data: adminUsers,
    isLoading,
    error,
  } = useGetAdminsQuery({
    pageNo,
    limit: 10,
    search,
  })

  const debouncedSearch = debounce((value) => {
    setPageNo(1)
    setSearch(value)
  }, 700)

  const handleMenuClick = (event, admin) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedAdmin(admin)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOpenModal = (type) => {
    setModalType(type)
    handleMenuClose()
    modalRef.current?.openModal()
  }

  const handleAddAdmin = () => {
    setModalType('add')
    setSelectedAdmin(null)
    modalRef.current?.openModal()
  }

  const renderModal = () => {
    if (!modalType) {
      return null
    }

    return (
      <AdminUserModal
        modalType={modalType}
        adminId={selectedAdmin?._id}
        firstName={selectedAdmin?.firstName}
        lastName={selectedAdmin?.lastName}
        email={selectedAdmin?.email}
        privilege={selectedAdmin?.privilege}
        status={selectedAdmin?.status}
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
              <UserCog size={16} />
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
        accessorKey: 'privilege',
        header: 'Privilege',
        Cell: (tableProps) => {
          const { row } = tableProps
          const { original } = row
          return (
            <Chip
              label={original?.privilege?.name || 'N/A'}
              size="small"
              color="secondary"
              icon={<Shield size={14} />}
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
          const statusColor = {
            active: 'success',
            pending: 'warning',
            inactive: 'default',
          }
          return (
            <Chip
              label={original?.status || 'pending'}
              size="small"
              color={statusColor[original?.status] || 'default'}
              variant="outlined"
            />
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created Date',
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
                open={Boolean(anchorEl) && selectedAdmin?._id === original._id}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleOpenModal('edit')}>
                  <Edit2 size={14} style={{ marginRight: 8 }} />
                  Edit
                </MenuItem>
                {original.status === 'active' ? (
                  <MenuItem onClick={() => handleOpenModal('delete')}>
                    <Trash2 size={14} style={{ marginRight: 8 }} />
                    Delete
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => handleOpenModal('resend')}>
                    <Send size={14} style={{ marginRight: 8 }} />
                    Resend Invitation
                  </MenuItem>
                )}
              </Menu>
            </>
          )
        },
        enableSorting: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [anchorEl, selectedAdmin],
  )

  return (
    <ApiMiddleware
      error={error}
      isLoading={!isLoading}
      isData
      text="No Admin Users Found"
      description="There are no admin users at the moment."
    >
      <Box>
        <Box mb={3}>
          <Typography variant="h4" mb={0.5}>
            Admin Users
          </Typography>
          <Typography color="text.secondary">
            Manage administrator accounts and privileges
          </Typography>
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
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Button variant="contained" startIcon={<UserPlus size={18} />} onClick={handleAddAdmin}>
              Add Admin
            </Button>
            <TextField
              size="small"
              placeholder="Search admins..."
              onChange={(e) => debouncedSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
              }}
              sx={{ width: 250 }}
            />
          </Box>

          <MuiReactTable
            columns={columns}
            rows={adminUsers?.data ?? []}
            height="auto"
            materialReactProps={{
              enableRowSelection: false,
              enableColumnActions: false,
              enableDensityToggle: false,
              enableFullScreenToggle: false,
            }}
          />

          <Box mt={2} display="flex" justifyContent="center">
            <PaginationComponent data={adminUsers} page={pageNo} setPage={setPageNo} />
          </Box>
        </Box>
      </Box>

      <ModalBox ref={modalRef}>{renderModal()}</ModalBox>
    </ApiMiddleware>
  )
}

export default AdminUsers
