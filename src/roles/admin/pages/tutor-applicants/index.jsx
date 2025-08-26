import {
  Box,
  Tab,
  Tabs,
  Button,
  TextField,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { debounce } from 'lodash'
import {
  Eye,
  Search,
  XCircle,
  PlusCircle,
  CheckCircle,
  RefreshCw,
  MoreVertical,
} from 'lucide-react'
import React, { useRef, useMemo, useState } from 'react'

import {
  useReconsiderStatusMutation,
  useApproveEducatorStatusMutation,
  useGetEducationTutorApplicationQuery,
} from '../../../../services/admin'
import ApiMiddleware from '../../../../shared/components/api-middleware'
import ModalBox from '../../../../shared/components/ui-elements/modal-box'
import MuiReactTable from '../../../../shared/components/ui-elements/mui-react-table'
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

  const {
    data: tutorData,
    isLoading,
    error,
  } = useGetEducationTutorApplicationQuery({
    page,
    pageSize: 10,
    filter,
    ...(search ? { search } : {}),
  })

  const [tutorStatus] = useApproveEducatorStatusMutation()
  const [reconsiderStatus, { isLoading: reconsiderLoading }] = useReconsiderStatusMutation()

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
                <Typography variant="body2">
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
              return <Typography variant="body2">{cell.getValue() || '-'}</Typography>
            },
          },
          {
            accessorKey: 'expertise',
            header: 'Expertise',
            Cell: (tableProps) => {
              const { row } = tableProps
              const { original } = row
              return (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography variant="body2">
                    {original.expertise?.length
                      ? original.expertise.map((item) => item.category).join(', ')
                      : '-'}
                  </Typography>
                </Box>
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
                  startIcon={<Eye size={14} />}
                  onClick={() => handleViewButton(original)}
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
                    <MenuItem onClick={handleApprove}>
                      <ListItemIcon>
                        <CheckCircle size={18} />
                      </ListItemIcon>
                      <ListItemText primary="Approve" />
                    </MenuItem>
                    <MenuItem onClick={handleReject}>
                      <ListItemIcon>
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
                <Typography variant="body2">
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
              return <Typography variant="body2">{cell.getValue() || '-'}</Typography>
            },
          },
          {
            accessorKey: 'expertise',
            header: 'Expertise',
            Cell: (tableProps) => {
              const { row } = tableProps
              const { original } = row
              return (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography variant="body2">
                    {original.expertise?.length
                      ? original.expertise.map((item) => item.category).join(', ')
                      : '-'}
                  </Typography>
                </Box>
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
                  startIcon={<Eye size={14} />}
                  onClick={() => handleViewButton(original)}
                >
                  View
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
              return (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography variant="body2">{cell.getValue() || '-'}</Typography>
                </Box>
              )
            },
          },
          {
            accessorKey: 'createdAt',
            header: 'Applied On',
            Cell: (tableProps) => {
              const { cell } = tableProps
              const value = cell.getValue()
              return (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography variant="body2">
                    {value ? new Date(value).toLocaleDateString() : '-'}
                  </Typography>
                </Box>
              )
            },
          },
          {
            accessorKey: 'action',
            header: 'Action',
            Cell: (tableProps) => {
              const { row, table } = tableProps
              const { original } = row
              const handleCheckboxReconsider = table.options.meta?.handleCheckboxReconsider
              const reconsiderLoading = table.options.meta?.reconsiderLoading
              return (
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  disabled={reconsiderLoading}
                  startIcon={<RefreshCw size={14} />}
                  onClick={() => handleCheckboxReconsider(original)}
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
  }, [filter])

  const renderActionButtons = () => {
    switch (filter) {
      case APPLICANTS_FILTER.ALL: {
        return (
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => void handleCheckboxAccept()}
              startIcon={<CheckCircle size={14} />}
            >
              Approve Selected
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => void openDeclineConfirmation()}
              startIcon={<XCircle size={14} />}
            >
              Decline Selected
            </Button>
          </Box>
        )
      }
      case APPLICANTS_FILTER.DECLINED: {
        return (
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={reconsiderLoading}
              onClick={() => void handleBulkReconsider()}
              startIcon={<RefreshCw size={14} />}
            >
              Reconsider Selected
            </Button>
          </Box>
        )
      }

      default:
        return null
    }
  }

  return (
    <ApiMiddleware
      error={error}
      isLoading={isLoading}
      isData={!!tutorData?.data?.length}
      text="No Tutor Applications Found"
      description="There are no tutor applications at the moment."
    >
      <Box>
        <Box mb={3}>
          <Typography variant="h4" mb={0.5}>
            Tutor Applications
          </Typography>
          <Typography color="text.secondary">Review and manage tutor applications</Typography>
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
                  startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
                }}
                sx={{ width: 250 }}
              />
              <Button
                startIcon={<PlusCircle size={14} />}
                variant="contained"
                onClick={() => inviteModalRef.current?.openModal()}
              >
                Invite Tutor
              </Button>
            </Box>
          </Box>

          {!!Object.keys(rowSelection).length && <Box mb={2}>{renderActionButtons()}</Box>}

          <MuiReactTable
            columns={columns}
            rows={tutorData?.data ?? []}
            materialReactProps={{
              enableRowSelection: true,
              getRowId: (row) => row.userId || row._id,
              onRowSelectionChange: setRowSelection,
              state: { rowSelection },
              enableColumnActions: false,
              enableDensityToggle: false,
              enableFullScreenToggle: false,
              muiTableContainerProps: {
                sx: {
                  maxHeight: 'calc(100vh - 350px)',
                },
              },
              meta: {
                handleViewButton,
                handleAccept,
                openDeclineConfirmation,
                handleCheckboxReconsider,
                reconsiderLoading,
              },
            }}
          />

          <Box mt={2} display="flex" justifyContent="center">
            <PaginationComponent data={tutorData} page={page} setPage={setPage} />
          </Box>
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
              void handleDecline(data)
            }}
            onClose={() => {
              confirmationRef.current?.closeModal()
            }}
          />
        </ModalBox>
      </Box>
    </ApiMiddleware>
  )
}

export default TutorApplicants
