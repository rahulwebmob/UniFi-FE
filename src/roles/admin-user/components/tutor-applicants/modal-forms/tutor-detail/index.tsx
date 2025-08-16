import { Play, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import React, { useRef, useState } from 'react'

import {
  Box,
  Grid,
  Chip,
  Link,
  Avatar,
  Button,
  Divider,
  Typography,
} from '@mui/material'

import { downloadPdf } from '../../common'
import DeclineConfirmation from '../decline-confirmation'
import ModalBox from '../../../../../../shared/components/ui-elements/modal-box'
import {
  useWatchVideoQuery,
  useDownloadCVQuery,
  useViewTutorDetailQuery,
  useDeleteEducatorMutation,
  useReconsiderStatusMutation,
  useApproveEducatorStatusMutation,
} from '../../../../../../services/admin'

const TutorDetail = ({ tutor, onClose, filter }) => {
  const navigate = useNavigate()
  const [videoUrl, setVideoUrl] = useState(null)
  const [deleteUser, setDeleteUser] = useState()
  const openVideoModalRef = useRef()
  const confirmationRef = useRef()

  const { data: tutorDetails } = useViewTutorDetailQuery({
    educatorId: tutor._id,
  })
  const { data: downloadCv } = useDownloadCVQuery({ educatorId: tutor._id })
  const { data: watchVedio } = useWatchVideoQuery({ educatorId: tutor._id })

  const [tutorStatus] = useApproveEducatorStatusMutation()
  const [tutorDelete] = useDeleteEducatorMutation()
  const [reconsiderStatus] = useReconsiderStatusMutation()

  const handleWatchVideo = () => {
    openVideoModalRef.current.openModal()
    setVideoUrl(watchVedio?.url)
  }

  const openDeclineModal = async (_id) => {
    confirmationRef.current.openModal()
    setDeleteUser(_id)
  }

  const handleDecline = async (reason) => {
    const payload = {
      educatorIds: [deleteUser],
      approval: false,
      ...(reason ? { declinedReason: reason } : {}),
    }
    const response = await tutorStatus(payload)
    if (!response.error) {
      confirmationRef.current.closeModal()
      onClose()
    }
  }

  const handleAccept = async (id) => {
    const payload = {
      educatorIds: [id],
      approval: true,
    }
    const response = await tutorStatus(payload)
    if (!response.error) {
      onClose()
    }
  }

  const handleDelete = async (id) => {
    const payload = {
      educatorIds: [id],
    }
    const response = await tutorDelete(payload)
    if (!response.error) {
      onClose()
    }
  }

  const handleBulkReconsider = async (id) => {
    const payload = {
      educatorIds: [id],
    }
    const response = await reconsiderStatus(payload)
    if (!response.error) {
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
        p: 3,
        '& .MuiChip-root': {
          color: (theme) => theme.palette.primary.main,
          borderColor: (theme) => theme.palette.primary.main,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography 
          variant="h5"
          sx={{
            fontWeight: 600,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          View Application
        </Typography>
        <Box display="flex" gap={1}>
          {downloadCv?.url && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Download size={16} />}
              onClick={() => void downloadPdf(downloadCv?.url)}
            >
              Download CV
            </Button>
          )}
          {watchVedio?.url && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Play size={16} />}
              onClick={handleWatchVideo}
            >
              Watch Video
            </Button>
          )}
        </Box>
      </Box>

      <Divider
        sx={{ mb: 3, borderColor: (theme) => theme.palette.divider }}
      />

      <Grid container spacing={3}>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            borderRight: { md: '1px solid' },
            pr: { md: 3 },
            borderColor: (theme) => theme.palette.divider,
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" justifyContent="space-between" gap={2} mb={2}>
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
                  <Typography 
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    {tutorDetails?.data?.firstName ?? '-'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {tutorDetails?.data?.email ?? '-'}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {tutorDetails?.data?.country ?? '-'},{' '}
                {tutorDetails?.data?.state ?? '-'}
              </Typography>
            </Box>

            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: 500, mb: 1 }}
              >
                Executive Summary
              </Typography>
              <Typography variant="body1">
                {tutorDetails?.data?.summary ?? '-'}
              </Typography>
            </Box>

            {!!tutorDetails?.data?.expertise?.length && (
              <Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontWeight: 500, mb: 1 }}
                >
                  Expertise
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {tutorDetails?.data?.expertise.map((expertise) => (
                    <Chip
                      label={expertise.category}
                      color="primary"
                      variant="outlined"
                      size="small"
                      key={expertise._id}
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box mt={1} display="flex" gap="100px" flexWrap="wrap">
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Company:
                </Typography>
                <Typography variant="body1">
                  {tutorDetails?.data?.company ?? '-'}
                </Typography>
              </Box>
              {!!tutorDetails?.data?.experience && (
                <Box>
                  <Typography variant="body1" color="text.secondary">
                    Experience
                  </Typography>
                  <Typography variant="body1">
                    {tutorDetails?.data?.experience} Years
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              <Typography variant="body1" color="text.secondary">
                Where did you hear about us?
              </Typography>
              <Typography variant="body1">
                {tutorDetails?.data?.hau ?? '-'}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column" gap={1}>
            {!!tutorDetails?.data?.education?.length && (
              <>
                <Typography variant="body1" color="text.secondary">
                  Education
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {tutorDetails?.data?.education.map((education) => (
                    <Chip
                      label={`${education.degree ?? '-'}, ${
                        education.field ?? '-'
                      }`}
                      color="primary"
                      variant="contained"
                      size="small"
                      key={education._id}
                    />
                  ))}
                </Box>
              </>
            )}

            {!!tutorDetails?.data?.certifications?.length && (
              <>
                <Typography variant="body1" color="text.secondary">
                  Certificates
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {tutorDetails?.data?.certifications.map((certificate) => (
                    <Chip
                      label={`${certificate?.name ?? '-'},${
                        certificate?.organization ?? '-'
                      }`}
                      color="primary"
                      variant="contained"
                      size="small"
                      key={certificate._id}
                    />
                  ))}
                </Box>
              </>
            )}

            <Typography variant="subtitle1">Links</Typography>
            {LINK_FIELDS.map(({ field, label }) => (
              <Box key={field} display="flex" flexDirection="column" gap={0.5}>
                <Typography variant="body1" color="textSecondary">
                  {label}
                </Typography>
                {tutorDetails?.data?.[field] ? (
                  <Link
                    href={tutorDetails?.data?.[field]}
                    target="_blank"
                    rel="noopener"
                    color="inherit"
                  >
                    {tutorDetails?.data?.[field]}
                  </Link>
                ) : (
                  <Typography> -</Typography>
                )}
              </Box>
            ))}

            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body1" color="textSecondary">
                Profiles on other sites
              </Typography>
              {tutorDetails?.data?.otherProfileUrls?.length ? (
                tutorDetails?.data?.otherProfileUrls.map((url, idx) => (
                  <Link
                    key={url.link}
                    href={url.link}
                    target="_blank"
                    rel="noopener"
                    color="inherit"
                  >
                    view {idx + 1}
                  </Link>
                ))
              ) : (
                <Typography variant="body2">-</Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box 
        display="flex" 
        justifyContent="space-between" 
        gap={2} 
        mt={4}
        pt={3}
        sx={{
          borderTop: `1px solid`,
          borderColor: (theme) => theme.palette.divider,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          size="large"
          sx={{ 
            flex: 1,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            borderRadius: '8px',
          }}
          onClick={() =>
            filter === 'DECLINED'
              ? void handleDelete(tutor._id)
              : void openDeclineModal(tutor._id)
          }
        >
          {filter === 'DECLINED' ? 'Delete' : 'Decline'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ 
            flex: 1,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            borderRadius: '8px',
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
            confirmationRef.current.closeModal()
            void navigate('education/tutor-applicants')
          }}
        />
      </ModalBox>
    </Box>
  )
}

export default TutorDetail

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
      <track kind="captions" src={videoUrl} srcLang="en" label="English" />
      Your browser does not support the video tag.
    </Box>
  </Box>
)
