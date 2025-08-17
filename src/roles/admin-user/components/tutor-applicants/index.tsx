import React from 'react'
import { debounce } from 'lodash'
import { useRef, useMemo, useState, useCallback } from 'react'
import {
  Eye,
  Search,
  XCircle,
  PlusCircle,
  CheckCircle,
  MoreVertical,
} from 'lucide-react'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table'

import {
  Box,
  Tab,
  Menu,
  Tabs,
  alpha,
  Button,
  MenuItem,
  useTheme,
  InputBase,
  IconButton,
  Typography,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import ApprovedTtutors from '../approved-tutors'
import TutorDetailModal from './modal-forms/tutor-detail'
import InviteTutorForm from './modal-forms/invite-tutor-form'
import { APPLICANTS_TAB, APPLICANTS_FILTER } from './constant'
import DeclineConfirmation from './modal-forms/decline-confirmation'
import ModalBox from '../../../../shared/components/ui-elements/modal-box'
import PaginationComponent from '../../../../shared/components/ui-elements/pagination-component'
import {
  useReconsiderStatusMutation,
  useApproveEducatorStatusMutation,
  useGetEducationTutorApplicationQuery,
} from '../../../../services/admin'

// Interface definitions
interface Expertise {
  category: string
  [key: string]: unknown
}

interface TutorData {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  expertise?: Expertise[]
  userId?: string
  declinedReason?: string
  [key: string]: unknown
}

interface TutorApiResponse {
  data: TutorData[]
  count?: number
  [key: string]: unknown
}

interface TutorApplicantsProps {
  type?: string
}

interface ModalRef {
  openModal: () => void
  closeModal: () => void
}

interface StatusPayload {
  educatorIds: string[]
  approval?: boolean
  declinedReason?: string
}

// CellProps interface removed - not used

// Helper functions
const HELPER = {
  getDateFormatWithoutTime: (date: string | Date | null | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString()
  },
  capitalizeFirst: (str: string | null | undefined) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },
}

const TutorApplicants = ({ type }: TutorApplicantsProps) => {
  const theme = useTheme()
  const inviteModalRef = useRef<ModalRef>(null)
  const viewModalRef = useRef<ModalRef>(null)
  const confirmationRef = useRef<ModalRef>(null)
  const [viewTutorData, setViewTutorData] = useState<TutorData | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [deleteUser, setDeleteUser] = useState<string | undefined>()

  const { data: tutorData } = useGetEducationTutorApplicationQuery({
    page,
    pageSize: 10,
    filter,
    ...(search ? { search } : {}),
  }) as { data: TutorApiResponse | undefined }

  const [tutorStatus] = useApproveEducatorStatusMutation()
  const [reconsiderStatus, { isLoading }] = useReconsiderStatusMutation()

  const debouncedSearch = debounce((value: string) => {
    setPage(1)
    setSearch(value)
  }, 700)

  const handleViewButton = useCallback((tutor: TutorData) => {
    setViewTutorData(tutor)
    viewModalRef.current?.openModal()
  }, [])

  const handleCheckboxAccept = async () => {
    const filterData = tutorData?.data.filter(
      (_, index) => rowSelection[index.toString()],
    )
    const AcceptedIds = filterData?.map((item) => item._id) ?? []
    const payload: StatusPayload = {
      educatorIds: AcceptedIds,
      approval: true,
    }
    await tutorStatus(payload)
    setRowSelection({})
  }

  const handleDecline = async (reason: string) => {
    const payload: StatusPayload = {
      educatorIds: [],
      approval: false,
      declinedReason: reason,
    }
    if (deleteUser) {
      payload.educatorIds = [deleteUser]
    } else {
      const filterData = tutorData?.data.filter(
        (_, index) => rowSelection[index.toString()],
      )
      const DeclinedIds = filterData?.map((item) => item._id) ?? []
      payload.educatorIds = DeclinedIds
    }
    setRowSelection({})
    const response = (await tutorStatus(payload)) as { error?: unknown }
    if (!response.error) {
      confirmationRef.current?.closeModal()
    }
  }

  const openDeclineConfirmation = useCallback((tutor?: TutorData) => {
    confirmationRef.current?.openModal()
    if (tutor) {
      setDeleteUser(tutor._id)
    } else {
      setDeleteUser(undefined)
    }
  }, [])

  const handleAccept = useCallback(
    async (tutor: TutorData) => {
      const payload: StatusPayload = {
        educatorIds: [tutor._id],
        approval: true,
      }
      await tutorStatus(payload)
    },
    [tutorStatus],
  )

  const handleCheckboxReconsider = useCallback(
    async (tutor: TutorData) => {
      const payload = {
        educatorIds: [tutor._id],
      }
      await reconsiderStatus(payload)
    },
    [reconsiderStatus],
  )

  const handleBulkReconsider = async () => {
    const filterData = tutorData?.data.filter(
      (_, index) => rowSelection[index.toString()],
    )
    const selectedIds = filterData?.map((item) => item._id) ?? []
    const payload = {
      educatorIds: selectedIds,
    }
    await reconsiderStatus(payload)
    setRowSelection({})
  }

  const columns = useMemo<MRT_ColumnDef<TutorData>[]>(() => {
    switch (filter) {
      case APPLICANTS_FILTER.ALL:
        return [
          {
            accessorKey: 'firstName',
            header: 'Name',
            Cell: (props) => {
              const { original } = props.row
              const firstName = original.firstName ?? ''
              const lastName = original.lastName ?? ''
              return (
                <Typography>
                  {firstName || lastName
                    ? `${firstName} ${lastName}`.trim()
                    : '-'}
                </Typography>
              )
            },
          },
          {
            accessorKey: 'email',
            header: 'Email Address',
            Cell: ({ cell }) => (
              <Typography>{cell.getValue<string>() || '-'}</Typography>
            ),
          },
          {
            accessorKey: 'expertise',
            header: 'Expertise',
            Cell: (props) => {
              const { original } = props.row
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
            Cell: (props) => {
              const { original } = props.row
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Eye size={16} />}
                    onClick={() => handleViewButton(original)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              )
            },
            enableSorting: false,
          },
          {
            accessorKey: 'action',
            header: 'Action',
            Cell: (props) => {
              const { original } = props.row
              const [anchorEl, setAnchorEl] =
                React.useState<null | HTMLElement>(null)
              const open = Boolean(anchorEl)

              const handleClick = (event: React.MouseEvent<HTMLElement>) => {
                setAnchorEl(event.currentTarget)
              }

              const handleClose = () => {
                setAnchorEl(null)
              }

              const handleApprove = () => {
                void handleAccept(original)
                handleClose()
              }

              const handleReject = () => {
                void openDeclineConfirmation(original)
                handleClose()
              }

              return (
                <Box>
                  <IconButton
                    size="small"
                    onClick={handleClick}
                    sx={{ color: 'text.secondary' }}
                  >
                    <MoreVertical size={18} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        minWidth: 150,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <MenuItem onClick={handleApprove}>
                      <ListItemIcon>
                        <CheckCircle size={16} color="green" />
                      </ListItemIcon>
                      <ListItemText>Approve</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleReject}>
                      <ListItemIcon>
                        <XCircle size={16} color="red" />
                      </ListItemIcon>
                      <ListItemText>Reject</ListItemText>
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
            Cell: ({ cell }) => (
              <Typography>{cell.getValue<string>() || '-'}</Typography>
            ),
          },
          {
            accessorKey: 'email',
            header: 'Email Address',
            Cell: ({ cell }) => (
              <Typography>{cell.getValue<string>() || '-'}</Typography>
            ),
          },
          {
            accessorKey: 'expertise',
            header: 'Expertise',
            Cell: (props) => {
              const { original } = props.row
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
            Cell: (props) => {
              const { original } = props.row
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
            accessorKey: 'declinedReason',
            header: 'Declined Reason',
            Cell: ({ cell }) => (
              <Typography>{cell.getValue<string>() || '-'}</Typography>
            ),
          },
          {
            accessorKey: 'action',
            header: 'Action',
            Cell: (props) => {
              const { original } = props.row
              return (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isLoading}
                  onClick={() => {
                    void handleCheckboxReconsider(original)
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
  }, [
    filter,
    isLoading,
    handleAccept,
    handleCheckboxReconsider,
    handleViewButton,
    openDeclineConfirmation,
  ])

  const table = useMaterialReactTable({
    columns,
    data: tutorData?.data ?? [],
    enableRowSelection: true,
    getRowId: (row) => row.userId! || row._id,
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
  })

  const renderActionButtons = () => {
    switch (filter) {
      case APPLICANTS_FILTER.ALL: {
        return (
          <Box display="flex" justifyContent="flex-end" gap="10px">
            <Button
              variant="contained"
              color="success"
              onClick={() => void handleCheckboxAccept()}
              startIcon={<CheckCircle size={16} />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
              }}
            >
              Approve Selected
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => void openDeclineConfirmation()}
              startIcon={<XCircle size={16} />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
              }}
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
              onClick={() => void handleBulkReconsider()}
              sx={{
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                },
              }}
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
        <Box
          sx={{
            display: { xs: 'column', sm: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: theme.palette.primary.main,
              }}
            >
              {HELPER.capitalizeFirst(type)} Tutors
              {!type && ' Applications'}
            </Typography>
            <Typography component="p" color="text.secondary">
              Review and manage tutor applications efficiently
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {!type && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'background.paper',
                  borderRadius: '8px',
                  border: (thm) => `1px solid ${thm.palette.grey[300]}`,
                  px: 2,
                  py: 1,
                  minWidth: 250,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: (thm) => thm.palette.primary[300],
                  },
                  '&:focus-within': {
                    borderColor: (thm) => thm.palette.primary.main,
                    boxShadow: (thm) =>
                      `0 0 0 3px ${thm.palette.primary.main}15`,
                  },
                }}
              >
                <Search
                  size={20}
                  style={{
                    color: 'var(--mui-palette-text-secondary)',
                    marginRight: 12,
                  }}
                />
                <InputBase
                  placeholder="Search tutors..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  sx={{
                    flex: 1,
                    '& input': {
                      fontSize: '0.875rem',
                      '&::placeholder': {
                        color: (thm) => thm.palette.text.secondary,
                        opacity: 0.5,
                      },
                    },
                  }}
                />
              </Box>
            )}
            {!type && (
              <Button
                startIcon={<PlusCircle size={16} />}
                variant="contained"
                onClick={() => inviteModalRef.current?.openModal()}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                }}
              >
                Invite Tutor
              </Button>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: { xs: 'column', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {!type ? (
            <Tabs
              value={filter}
              onChange={(e, newValue: string) => setFilter(newValue)}
              sx={{
                minHeight: 40,
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
                '& .MuiTab-root': {
                  minHeight: 40,
                  textTransform: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  mr: 2,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
              }}
            >
              {APPLICANTS_TAB.map((item: { key: string; name: string }) => (
                <Tab
                  key={item.key}
                  value={item.key}
                  label={item.name}
                  sx={{
                    px: 2,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      borderRadius: 1,
                    },
                  }}
                />
              ))}
            </Tabs>
          ) : (
            <div />
          )}

          <Box>
            {!!Object.keys(rowSelection).length && renderActionButtons()}
          </Box>
        </Box>
      </Box>

      {type !== 'Approved' ? (
        <MaterialReactTable table={table} />
      ) : (
        <ApprovedTtutors />
      )}

      {!type && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <PaginationComponent data={tutorData} page={page} setPage={setPage} />
        </Box>
      )}

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
          onDelete={(data: string) => {
            void handleDecline(data)
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
