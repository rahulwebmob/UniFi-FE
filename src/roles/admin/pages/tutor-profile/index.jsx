import { Box, Chip, Avatar, Button, Typography, ButtonGroup } from '@mui/material'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useDownloadCVQuery, useViewTutorDetailQuery } from '../../../../services/admin'
import Courses from '../../components/tutor-profile-tabs/courses'
import Webinars from '../../components/tutor-profile-tabs/webinars'
import { downloadPdf } from '../../helper/common'

const LIST_TYPE_OPTIONS = [
  { name: 'Courses', value: 'BS', component: () => <Courses /> },
  { name: 'Webinars', value: 'CF', component: () => <Webinars /> },
]

const TutorProfile = () => {
  const { id } = useParams()
  const { data: tutorDetails } = useViewTutorDetailQuery({ educatorId: id }, { skip: !id })
  const { data: DownloadCv } = useDownloadCVQuery({ educatorId: id }, { skip: !id })

  const [listType, setListType] = useState('BS')
  const selectedComponent = LIST_TYPE_OPTIONS.find((item) => item.value === listType)?.component

  return (
    <Box>
      <Box mb={3}>
        <Typography
          variant="h4"
          sx={{
            mb: 0.5,
          }}
        >
          Tutor Profile
        </Typography>
        <Typography component="p" color="text.secondary">
          View detailed information about the tutor
        </Typography>
      </Box>

      <Box
        p={4}
        mb={4}
        sx={{
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
          background: (theme) => theme.palette.background.light,
          borderRadius: '12px',
          border: `1px solid`,
          borderColor: (theme) => theme.palette.divider,
        }}
      >
        <Box flex={1} minWidth={300}>
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <Avatar
              alt="OL"
              sx={{
                width: 80,
                height: 80,
                background: (theme) => theme.palette.primary[100],
                color: (theme) => theme.palette.primary.main,
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
            />
            <Box>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {tutorDetails?.data?.firstName || '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tutorDetails?.data?.email || '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {tutorDetails?.data?.country || '-'}, {tutorDetails?.data?.state || '-'}
              </Typography>
            </Box>
          </Box>

          <Box mb={3}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
              Executive Summary
            </Typography>
            <Typography
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
                lineHeight: 1.6,
              }}
            >
              {tutorDetails?.data?.summary || '-'}
            </Typography>
          </Box>

          {!!tutorDetails?.data?.expertise?.length && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                Expertise
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {tutorDetails?.data?.expertise?.map((expertise) => (
                  <Chip
                    key={expertise._id || expertise.category}
                    label={expertise.category}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Box width={360}>
          <Box
            p={3}
            mb={3}
            sx={{
              background: (theme) => theme.palette.background.default,
              borderRadius: '12px',
              border: `1px solid`,
              borderColor: (theme) => theme.palette.divider,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Total Earning
            </Typography>
            <Typography variant="h6" color="success.main">
              $
              {!Number.isNaN(tutorDetails?.data?.totalEarnings)
                ? tutorDetails?.data?.totalEarnings?.toFixed(2)
                : '0.00'}
            </Typography>
          </Box>

          <Box
            p={3}
            sx={{
              background: (theme) => theme.palette.background.default,
              borderRadius: '12px',
              border: `1px solid`,
              borderColor: (theme) => theme.palette.divider,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {(() => {
              const socialLinks = [
                { label: 'LinkedIn', url: tutorDetails?.data?.linkedinUrl },
                { label: 'Twitter', url: tutorDetails?.data?.twitterUrl },
                { label: 'Website', url: tutorDetails?.data?.websiteUrl },
              ]

              return (
                <>
                  {socialLinks.map(({ label, url }) => (
                    <Box
                      key={label}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1">{label}</Typography>
                      {url ? (
                        <Typography
                          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                          color="primary"
                          onClick={() => window.open(url, '_blank')}
                        >
                          View
                        </Typography>
                      ) : (
                        <Typography variant="body2">-</Typography>
                      )}
                    </Box>
                  ))}

                  <Box>
                    <Typography variant="body1" mb={0.5}>
                      Other profiles
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      {tutorDetails?.data?.otherProfileUrls?.length ? (
                        tutorDetails?.data?.otherProfileUrls.map((url, index) => (
                          <Typography
                            key={url}
                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                            color="primary"
                            onClick={() => window.open(url, '_blank')}
                          >
                            View {index + 1}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2">-</Typography>
                      )}
                    </Box>
                  </Box>
                </>
              )
            })()}
          </Box>

          {!!DownloadCv?.url && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Download size={16} />}
              sx={{ mt: 2, alignSelf: 'flex-start' }}
              onClick={() => DownloadCv?.url && downloadPdf(DownloadCv.url)}
            >
              Download CV
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          mb: 2,
          borderRadius: '12px',
        }}
      >
        <ButtonGroup variant="outlined">
          {LIST_TYPE_OPTIONS.map((item) => (
            <Button
              key={item.value}
              onClick={() => setListType(item.value)}
              variant={listType === item.value ? 'contained' : 'outlined'}
            >
              {item.name}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Box
        p={4}
        sx={{
          background: (theme) => theme.palette.background.light,
          borderRadius: '12px',
          border: `1px solid`,
          borderColor: (theme) => theme.palette.divider,
        }}
      >
        {selectedComponent()}
      </Box>
    </Box>
  )
}

TutorProfile.propTypes = {}

export default TutorProfile
