import {
  Box,
  Tab,
  Menu,
  Tabs,
  Button,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { debounce } from 'lodash'
import { Eye, Search, XCircle, PlusCircle, CheckCircle, MoreVertical } from 'lucide-react'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import React, { useRef, useMemo, useState } from 'react'

import {
  useReconsiderStatusMutation,
  useApproveEducatorStatusMutation,
  useGetEducationTutorApplicationQuery,
} from '../../../../services/admin'
import ModalBox from '../../../../shared/components/ui-elements/modal-box'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import DeclineConfirmation from '../../components/admin-modals/decline-tutor'
import InviteTutorForm from '../../components/admin-modals/invite-tutor'
import TutorDetailModal from '../../components/admin-modals/tutor-details'
import { APPLICANTS_TAB, APPLICANTS_FILTER } from '../../helper/constant'

const TutorApplicants = () => {
  const inviteModalRef = useRef(null)
  const viewModalRef = useRef(null)
  const confirmationRef = useRef(null)
  const [viewTutorData, setViewTutorData] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [rowSelection, setRowSelection] = useState({})
  const [deleteUser, setDeleteUser] = useState()

  const { data: tutorData } = useGetEducationTutorApplicationQuery({
    page,
    pageSize: 10,
    filter,
    ...(search ? { search } : {}),
  })

  const [tutorStatus] = useApproveEducatorStatusMutation()
  const [reconsiderStatus, { isLoading }] = useReconsiderStatusMutation()

  const debouncedSearch = debounce((value) => {
    setPage(1)
    setSearch(value)
  }, 700)

  const handleViewButton = (tutor) => {
    setViewTutorData(tutor)
    viewModalRef.current?.openModal()
  }

  const handleCheckboxAccept = async () => {
    const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[key])

    if (selectedIds.length > 0) {
      await tutorStatus({
        educatorIds: selectedIds,
        approval: true,
      })
    }
    setRowSelection({})
  }

  const handleDecline = async (reason) => {
    if (deleteUser) {
      await tutorStatus({
        educatorIds: [deleteUser],
        approval: false,
        declinedReason: reason,
      })
    } else {
      const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[key])

      if (selectedIds.length > 0) {
        await tutorStatus({
          educatorIds: selectedIds,
          approval: false,
          declinedReason: reason,
        })
      }
    }
    setRowSelection({})
    confirmationRef.current?.closeModal()
  }

  const openDeclineConfirmation = (tutor) => {
    confirmationRef.current?.openModal()
    if (tutor) {
      setDeleteUser(tutor._id)
    } else {
      setDeleteUser(undefined)
    }
  }

  const handleAccept = async (tutor) => {
    await tutorStatus({
      educatorIds: [tutor._id],
      approval: true,
    })
  }

  const handleCheckboxReconsider = async (tutor) => {
    await reconsiderStatus({
      educatorId: tutor._id,
    })
  }

  const handleBulkReconsider = async () => {
    const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[key])

    for (const educatorId of selectedIds) {
      await reconsiderStatus({
        educatorId,
      })
    }
    setRowSelection({})
  }

  const columns = useMemo(() => {
    switch (filter) {
      case APPLICANTS_FILTER.ALL:
        return [
          {
            accessorKey: 'firstName',
            header: 'Name',
            Cell: (tableProps) => {
              const { row } = tableProps
              const { original } = row
              const firstName = original.firstName ?? ''
              const lastName = original.lastName ?? ''
              return (
                <Typography>
                  {firstName || lastName ? `${firstName} ${lastName}`.trim() : '-'}
                </Typography>
              )
            },
          },
          {
            accessorKey: 'email',
            header: 'Email Address',
            Cell: (tableProps) => {
              const { cell } = tableProps
              return <Typography>{cell.getValue() || '-'}</Typography>
            },
          },
          {
            accessorKey: 'expertise',
            header: 'Expertise',
            Cell: (tableProps) => {
              const { row } = tableProps
              const { original } = row
              return (
                <Typography>
                  {original.expertise?.length
                    ? original.expertise.map((item) => item.category).join(', ')
                    : '-'}
                </Typography>
              )
            },
          },
          {
            accessorKey: 'application',
            header: 'Application',
            Cell: (tableProps) => {
              const { row, table } = tableProps
              const { original } = row
              const handleViewButton = table.options.meta?.handleViewButton
              return (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Eye size={16} />}
                  onClick={() => handleViewButton(original)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 1,
                  }}
                >
                  View
                </Button>
              )
            },
            enableSorting: false,
          },
          {
            accessorKey: 'action',
            header: 'Action',
            Cell: (tableProps) => {
              const { row, table } = tableProps
              const { original } = row
              const handleAccept = table.options.meta?.handleAccept
              const openDeclineConfirmation = table.options.meta?.openDeclineConfirmation
              const [anchorEl, setAnchorEl] = React.useState(null)
              const open = Boolean(anchorEl)

              const handleClick = (event) => {
                setAnchorEl(event.currentTarget)
              }

              const handleClose = () => {
                setAnchorEl(null)
              }

              const handleApprove = () => {
                handleAccept(original)
                handleClose()
              }

              const handleReject = () => {
                openDeclineConfirmation(original)
                handleClose()
              }

              return (
                <Box>
                  <IconButton
                    aria-label="more"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertical size={18} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleApprove} sx={{ color: 'success.main' }}>
                      <ListItemIcon sx={{ color: 'success.main' }}>
                        <CheckCircle size={18} />
                      </ListItemIcon>
                      <ListItemText primary="Approve" />
                    </MenuItem>
                    <MenuItem onClick={handleReject} sx={{ color: 'error.main' }}>
                      <ListItemIcon sx={{ color: 'error.main' }}>
                        <XCircle size={18} />
                      </ListItemIcon>
                      <ListItemText primary="Decline" />
                    </MenuItem>
                  </Menu>
                </Box>
              )
            },
            enableSorting: false,
          },
        ]

      case APPLICANTS_FILTER.DECLINED:
        return [
          {
            accessorKey: 'firstName',
            header: 'Name',
            Cell: (tableProps) => {
              const { row } = tableProps
              const { original } = row
              const firstName = original.firstName ?? ''
              const lastName = original.lastName ?? ''
              return (
                <Typography>
                  {firstName || lastName ? `${firstName} ${lastName}`.trim() : '-'}
                </Typography>
              )
            },
          },
          {
            accessorKey: 'email',
            header: 'Email Address',
            Cell: (tableProps) => {
              const { cell } = tableProps
              return <Typography>{cell.getValue() || '-'}</Typography>
            },
          },
          {
            accessorKey: 'expertise',
            header: 'Expertise',
            Cell: (tableProps) => {
              const { row } = tableProps
              const { original } = row
              return (
                <Typography>
                  {original.expertise?.length
                    ? original.expertise.map((item) => item.category).join(', ')
                    : '-'}
                </Typography>
              )
            },
          },
          {
            accessorKey: 'application',
            header: 'Application',
            Cell: (tableProps) => {
              const { row, table } = tableProps
              const { original } = row
              const handleViewButton = table.options.meta?.handleViewButton
              return (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Eye size={16} />}
                  onClick={() => handleViewButton(original)}
                >
                  Viewqwe
                </Button>
              )
            },
            enableSorting: false,
          },
          {
            accessorKey: 'declinedReason',
            header: 'Declined Reason',
            Cell: (tableProps) => {
              const { cell } = tableProps
              return <Typography>{cell.getValue() || '-'}</Typography>
            },
          },
          {
            accessorKey: 'action',
            header: 'Action',
            Cell: (tableProps) => {
              const { row, table } = tableProps
              const { original } = row
              const handleCheckboxReconsider = table.options.meta?.handleCheckboxReconsider
              const isLoading = table.options.meta?.isLoading
              return (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isLoading}
                  onClick={() => {
                    handleCheckboxReconsider(original)
                  }}
                >
                  Reconsider
                </Button>
              )
            },
            enableSorting: false,
          },
        ]

      default:
        return []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const table = useMaterialReactTable({
    columns,
    data: tutorData?.data ?? [],
    enableRowSelection: true,
    getRowId: (row) => row.userId || row._id,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enablePagination: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableGlobalFilter: false,
    enableHiding: false,
    meta: {
      handleViewButton,
      handleAccept,
      openDeclineConfirmation,
      handleCheckboxReconsider,
      isLoading,
    },
  })

  const renderActionButtons = () => {
    switch (filter) {
      case APPLICANTS_FILTER.ALL: {
        return (
          <Box display="flex" justifyContent="flex-end" gap="10px">
            <Button
              variant="contained"
              color="success"
              onClick={() => handleCheckboxAccept()}
              startIcon={<CheckCircle size={16} />}
            >
              Approve Selected
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => openDeclineConfirmation()}
              startIcon={<XCircle size={16} />}
            >
              Decline Selected
            </Button>
          </Box>
        )
      }
      case APPLICANTS_FILTER.DECLINED: {
        return (
          <Box display="flex" justifyContent="flex-end" gap="10px">
            <Button
              variant="contained"
              color="success"
              disabled={isLoading}
              onClick={() => handleBulkReconsider()}
            >
              Reconsider
            </Button>
          </Box>
        )
      }

      default:
        return null
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box mb={3}>
          <Typography variant="h4" mb={0.5}>
            Tutor Applications
          </Typography>
          <Typography component="p" color="text.secondary">
            Review and manage tutor applications efficiently
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: 'column', sm: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Tabs value={filter} onChange={(_, newValue) => setFilter(newValue)}>
            {APPLICANTS_TAB.map((item) => (
              <Tab key={item.key} value={item.key} label={item.name} />
            ))}
          </Tabs>

          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              size="small"
              placeholder="Search tutors..."
              onChange={(e) => debouncedSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} style={{ marginRight: 8 }} />,
              }}
              sx={{ minWidth: 250 }}
            />
            <Button
              startIcon={<PlusCircle size={16} />}
              variant="contained"
              onClick={() => inviteModalRef.current?.openModal()}
            >
              Invite Tutor
            </Button>
          </Box>
        </Box>

        {!!Object.keys(rowSelection).length && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 2,
            }}
          >
            {renderActionButtons()}
          </Box>
        )}
      </Box>

      <MaterialReactTable table={table} />

      <Box mt={2} display="flex" justifyContent="center">
        <PaginationComponent data={tutorData} page={page} setPage={setPage} />
      </Box>

      <ModalBox ref={inviteModalRef} title="Invite Tutor">
        <InviteTutorForm
          onClose={() => {
            inviteModalRef.current?.closeModal()
          }}
        />
      </ModalBox>

      <ModalBox size="lg" ref={viewModalRef} title="Tutor Details">
        <TutorDetailModal
          tutor={viewTutorData}
          onClick={handleViewButton}
          filter={filter}
          onClose={() => {
            viewModalRef.current?.closeModal()
          }}
        />
      </ModalBox>

      <ModalBox ref={confirmationRef}>
        <DeclineConfirmation
          onDelete={(data) => {
            handleDecline(data)
          }}
          onClose={() => {
            confirmationRef.current?.closeModal()
          }}
        />
      </ModalBox>
    </Box>
  )
}

export default TutorApplicants
