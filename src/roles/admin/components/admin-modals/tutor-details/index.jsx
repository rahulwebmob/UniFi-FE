import { Box, Grid, Chip, Link, Avatar, Button, Divider, Typography } from '@mui/material'
import { Play, Download } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  useWatchVideoQuery,
  useDownloadCVQuery,
  useViewTutorDetailQuery,
  useDeleteEducatorMutation,
  useReconsiderStatusMutation,
  useApproveEducatorStatusMutation,
} from '../../../../../services/admin'
import ModalBox from '../../../../../shared/components/ui-elements/modal-box'
import { downloadPdf } from '../../../helper/common'
import DeclineConfirmation from '../decline-tutor'

const ApplicantInfo = ({ tutor, onClose, filter }) => {
  const navigate = useNavigate()
  const [videoUrl, setVideoUrl] = useState(null)
  const [deleteUser, setDeleteUser] = useState()
  const openVideoModalRef = useRef(null)
  const confirmationRef = useRef(null)

  const { data } = useViewTutorDetailQuery(
    {
      educatorId: tutor?._id || '',
    },
    {
      skip: !tutor,
    },
  )

  const tutorDetails = data?.data
  const downloadCvResponse = useDownloadCVQuery(
    {
      educatorId: tutor?._id || '',
    },
    {
      skip: !tutor,
    },
  )
  const downloadCv = downloadCvResponse.data
  const watchVideoResponse = useWatchVideoQuery(
    {
      educatorId: tutor?._id || '',
    },
    {
      skip: !tutor,
    },
  )
  const watchVideo = watchVideoResponse.data

  const [tutorStatus] = useApproveEducatorStatusMutation()
  const [tutorDelete] = useDeleteEducatorMutation()
  const [reconsiderStatus] = useReconsiderStatusMutation()

  if (!tutor) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No tutor data available</Typography>
      </Box>
    )
  }

  const handleWatchVideo = () => {
    openVideoModalRef.current?.openModal()
    setVideoUrl(watchVideo?.url ?? null)
  }

  const openDeclineModal = (_id) => {
    confirmationRef.current?.openModal()
    setDeleteUser(_id)
  }

  const handleDecline = async (reason) => {
    if (deleteUser) {
      const response = await tutorStatus({
        educatorIds: [deleteUser],
        approval: false,
        declinedReason: reason,
      })
      if (response?.data) {
        confirmationRef.current?.closeModal()
        onClose()
      }
    }
  }

  const handleAccept = async (id) => {
    const response = await tutorStatus({
      educatorIds: [id],
      approval: true,
    })
    if (response?.data) {
      onClose()
    }
  }

  const handleDelete = async (id) => {
    const response = await tutorDelete({
      educatorId: id,
    })
    if (response?.data) {
      onClose()
    }
  }

  const handleBulkReconsider = async (id) => {
    const response = await reconsiderStatus({
      educatorId: id,
    })
    if (response?.data) {
      onClose()
    }
  }

  const LINK_FIELDS = [
    { field: 'linkedinUrl', label: 'LinkedIn' },
    { field: 'twitterUrl', label: 'Twitter' },
    { field: 'youtubeUrl', label: 'You Tube' },
    { field: 'websiteUrl', label: 'Website URL' },
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '70vh',
        maxHeight: '600px',
        '& .MuiChip-root': {
          color: (theme) => theme.palette.primary.main,
          borderColor: (theme) => theme.palette.primary.main,
        },
      }}
    >
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" gap={1} width="400px">
            {downloadCv?.url && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Download size={16} />}
                onClick={() => void downloadPdf(downloadCv.url)}
              >
                Download CV
              </Button>
            )}
            {watchVideo?.url && (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<Play size={16} />}
                onClick={handleWatchVideo}
              >
                Watch Video
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ mt: 2, borderColor: (theme) => theme.palette.divider }} />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 3,
          pb: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: (theme) => theme.palette.grey[100],
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: (theme) => theme.palette.grey[400],
            borderRadius: '4px',
            '&:hover': {
              background: (theme) => theme.palette.grey[500],
            },
          },
        }}
      >
        <Grid container spacing={3}>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              borderRight: { md: '1px solid' },
              pr: { md: 3 },
              borderColor: (theme) => theme.palette.divider,
            }}
          >
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" justifyContent="space-between" gap={2}>
                <Box display="flex" gap={2}>
                  <Avatar
                    alt="Olivia Rhye"
                    sx={{
                      background: (theme) => theme.palette.primary[100],
                      width: 56,
                      height: 56,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {tutorDetails?.firstName ?? '-'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {tutorDetails?.email ?? '-'}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {tutorDetails?.country ?? '-'}, {tutorDetails?.state ?? '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                  Executive Summary
                </Typography>
                <Typography variant="body1">{tutorDetails?.summary ?? '-'}</Typography>
              </Box>

              {!!tutorDetails?.expertise?.length && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, mb: 1 }}
                  >
                    Expertise
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {tutorDetails?.expertise.map((expertise) => (
                      <Chip
                        key={expertise._id || expertise.category}
                        label={expertise.category}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box mt={2} display="flex" gap={4} flexWrap="wrap">
                <Box>
                  <Typography variant="body1" color="text.secondary">
                    Company:
                  </Typography>
                  <Typography variant="body1">{tutorDetails?.company ?? '-'}</Typography>
                </Box>
                {!!tutorDetails?.experience && (
                  <Box>
                    <Typography variant="body1" color="text.secondary">
                      Experience
                    </Typography>
                    <Typography variant="body1">{tutorDetails?.experience} Years</Typography>
                  </Box>
                )}
              </Box>

              <Box>
                <Typography variant="body1" color="text.secondary">
                  Where did you hear about us?
                </Typography>
                <Typography variant="body1">{tutorDetails?.hau ?? '-'}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              {!!tutorDetails?.education?.length && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, mb: 1 }}
                  >
                    Education
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {tutorDetails?.education.map((education) => (
                      <Chip
                        label={`${education.degree ?? '-'}, ${education.field ?? '-'}`}
                        color="primary"
                        variant="outlined"
                        size="small"
                        key={education._id}
                        sx={{
                          borderRadius: '6px',
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {!!tutorDetails?.certifications?.length && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, mb: 1 }}
                  >
                    Certificates
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {tutorDetails?.certifications.map((certificate) => (
                      <Chip
                        label={`${certificate?.name ?? '-'},${certificate?.organization ?? '-'}`}
                        color="primary"
                        variant="filled"
                        size="small"
                        key={certificate._id}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                  Links
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {LINK_FIELDS.map(({ field, label }) => (
                    <Box key={field} display="flex" flexDirection="column" gap={0.5}>
                      <Typography variant="body2" color="textSecondary">
                        {label}
                      </Typography>
                      {tutorDetails?.[field] ? (
                        <Link
                          href={tutorDetails?.[field]}
                          target="_blank"
                          rel="noopener"
                          color="inherit"
                        >
                          {tutorDetails?.[field]}
                        </Link>
                      ) : (
                        <Typography variant="body2"> -</Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                  Profiles on other sites
                </Typography>
                {!!tutorDetails?.otherProfileUrls?.length &&
                  tutorDetails?.otherProfileUrls.map((url, idx) => (
                    <Link key={url} href={url} target="_blank" rel="noopener" color="inherit">
                      view {idx + 1}
                    </Link>
                  ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        gap={2}
        px={3}
        py={2}
        sx={{
          borderTop: `1px solid`,
          borderColor: (theme) => theme.palette.divider,
          background: (theme) => theme.palette.background.paper,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          size="medium"
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 500,
            py: 1,
            borderRadius: '6px',
          }}
          onClick={() =>
            filter === 'DECLINED' ? void handleDelete(tutor._id) : void openDeclineModal(tutor._id)
          }
        >
          {filter === 'DECLINED' ? 'Delete' : 'Decline'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 500,
            py: 1,
            borderRadius: '6px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
          }}
          onClick={() =>
            filter === 'DECLINED'
              ? void handleBulkReconsider(tutor._id)
              : void handleAccept(tutor._id)
          }
        >
          {filter === 'DECLINED' ? 'Reconsider' : 'Approve'}
        </Button>
      </Box>

      <ModalBox ref={openVideoModalRef} size="md">
        {videoUrl && <VideoPlayer videoUrl={videoUrl} />}
      </ModalBox>

      <ModalBox ref={confirmationRef}>
        <DeclineConfirmation
          onDelete={(data) => {
            void handleDecline(data)
          }}
          onClose={() => {
            confirmationRef.current?.closeModal()
            void navigate('education/tutor-applicants')
          }}
        />
      </ModalBox>
    </Box>
  )
}

ApplicantInfo.propTypes = {
  tutor: PropTypes.shape({
    _id: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  filter: PropTypes.string,
}

export default ApplicantInfo

const VideoPlayer = ({ videoUrl }) => (
  <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
    <Box
      component="video"
      controls
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <source src={videoUrl} type="video/mp4" />
      <track kind="captions" srcLang="en" label="English" />
      Your browser does not support the video tag.
    </Box>
  </Box>
)

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired,
}
