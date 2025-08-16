import React from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Info,
  User,
  Clock,
  Users,
  Video,
  MapPin,
  Calendar,
  DollarSign,
} from 'lucide-react'

import {
  Box,
  Card,
  Grid,
  Chip,
  alpha,
  Paper,
  Avatar,
  Button,
  Divider,
  useTheme,
  Container,
  CardMedia,
  Typography,
} from '@mui/material'

import { getEducatorDetails } from '../../common/common'
import { getLocaleByLanguageCode } from '../../../../../utils/globalUtils'

const WebinarContent = ({ webinarData, isEdit, handleOpenPremiumModal }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { t, i18n } = useTranslation('education')
  const locale = getLocaleByLanguageCode(i18n.language)

  const renderEnrollButton = () =>
    !webinarData?.isWebinarBought && webinarData?.isPaid ? (
      <Button
        fullWidth
        disabled={isEdit}
        variant="contained"
        size="large"
        onClick={handleOpenPremiumModal}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          py: 1.5,
          boxShadow: 'none',
          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          '&:hover': {
            boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
          },
        }}
      >
        {t('EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.ENROLL_NOW')}
      </Button>
    ) : (
      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={isEdit || !webinarData?.webinarScheduledObj?.can_join}
        onClick={() => {
          void navigate(`/dashboard/webinar/${webinarData?._id}`)
        }}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          py: 1.5,
          boxShadow: 'none',
          background: webinarData?.webinarScheduledObj?.can_join
            ? `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
            : theme.palette.grey[400],
          '&:hover': {
            boxShadow: webinarData?.webinarScheduledObj?.can_join
              ? `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`
              : 'none',
          },
        }}
      >
        {webinarData?.webinarScheduledObj?.can_join
          ? t('EDUCATION_DASHBOARD.COMMON_KEYS.JOIN_NOW')
          : t('EDUCATION_DASHBOARD.COMMON_KEYS.MEETING_WILL_START_SOON')}
      </Button>
    )

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'EEEE, dd MMMM yyyy', { locale })
  }

  const formatTime = (dateString) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'hh:mm a', { locale })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
      }}
    >
      <Container
        sx={{
          width: '100%',
          py: 4,
          '@media (min-width:1200px)': { maxWidth: '1400px' },
        }}
        maxWidth="lg"
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            background: 'white',
            borderRadius: 3,
            boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 2,
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                }}
              >
                {webinarData?.title}
              </Typography>

              {webinarData?.subtitle && (
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 400,
                    mb: 3,
                  }}
                >
                  {webinarData?.subtitle}
                </Typography>
              )}

              {/* Categories */}
              {webinarData?.category?.length > 0 && (
                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  {webinarData.category.map((cat, index) => (
                    <Chip
                      key={index}
                      label={cat.category || cat}
                      size="small"
                      sx={{
                        background: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        borderRadius: '6px',
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.15),
                        },
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Webinar Info */}
              <Box display="flex" flexDirection="column" gap={2} mb={3}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Calendar size={20} color={theme.palette.primary.main} />
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(webinarData?.webinarScheduledObj?.join_date)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Clock size={20} color={theme.palette.primary.main} />
                  <Typography variant="body1" fontWeight={500}>
                    {formatTime(webinarData?.webinarScheduledObj?.join_date)}
                  </Typography>
                  {webinarData?.duration && (
                    <Chip
                      label={`${webinarData.duration} mins`}
                      size="small"
                      sx={{
                        ml: 1,
                        height: 24,
                        background: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                      }}
                    />
                  )}
                </Box>

                {webinarData?.location && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <MapPin size={20} color={theme.palette.primary.main} />
                    <Typography variant="body1">
                      {webinarData.location}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Instructor Info */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {t('EDUCATION_DASHBOARD.COMMON_KEYS.CREATED_BY')}
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mt={1}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    }}
                  >
                    {getEducatorDetails(webinarData, 'avatarName') || (
                      <User size={24} />
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {getEducatorDetails(webinarData, 'fullName')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Webinar Host
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Enrollment Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card
                sx={{
                  p: 0,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  background: 'white',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 240,
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': {
                      '& .webinar-image': {
                        transform: 'scale(1.05)',
                      },
                      '& .image-overlay': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    className="webinar-image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    image={webinarData?.thumbNail}
                    title={webinarData?.title}
                  />

                  {/* Hover Overlay */}
                  <Box
                    className="image-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0.2)} 0%, ${alpha(theme.palette.common.black, 0.7)} 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        textAlign: 'center',
                        color: 'white',
                      }}
                    >
                      <Video size={48} style={{ marginBottom: 8 }} />
                      <Typography variant="body2" fontWeight={600}>
                        Click to Join Webinar
                      </Typography>
                    </Box>
                  </Box>

                  {/* Live Badge */}
                  {webinarData?.webinarScheduledObj?.can_join && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: alpha(theme.palette.success.main, 0.9),
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        zIndex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'white',
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 },
                          },
                        }}
                      />
                      <Typography variant="caption" fontWeight={600}>
                        LIVE NOW
                      </Typography>
                    </Box>
                  )}

                  {/* Free Badge */}
                  {!webinarData?.isPaid && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                        color: 'white',
                        px: 2.5,
                        py: 1,
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        zIndex: 1,
                        boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.4)}`,
                      }}
                    >
                      <DollarSign size={16} style={{ marginRight: 2 }} />
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{ letterSpacing: 0.5 }}
                      >
                        FREE
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Attendees Info */}
                  {webinarData?.maxAttendees && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{
                        mb: 3,
                        p: 1.5,
                        background: alpha(theme.palette.grey[100], 0.5),
                        borderRadius: 1,
                      }}
                    >
                      <Users size={18} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        Limited to <strong>{webinarData.maxAttendees}</strong>{' '}
                        attendees
                      </Typography>
                    </Box>
                  )}

                  {/* Price Section - Only show for paid webinars */}
                  {!webinarData?.isWebinarBought && webinarData?.isPaid && (
                    <Box mb={3}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                        >
                          Price
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                          }}
                        >
                          ${webinarData?.price}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Action Button */}
                  {renderEnrollButton()}

                  {/* Additional Info */}
                  {webinarData?.isPaid && !webinarData?.isWebinarBought && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mt={2}
                      justifyContent="center"
                    >
                      <Info size={14} color={theme.palette.text.secondary} />
                      <Typography variant="caption" color="text.secondary">
                        Secure payment • Instant access
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Description Section */}
        {webinarData?.description && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: 'white',
              borderRadius: 3,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.06)}`,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              About this Webinar
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}
            >
              {webinarData?.description}
            </Typography>

            {/* Key Takeaways if available */}
            {webinarData?.keyTakeaways &&
              webinarData.keyTakeaways.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                    }}
                  >
                    What You&apos;ll Learn
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {webinarData.keyTakeaways.map((item, index) => (
                      <Box component="li" key={index} sx={{ mb: 1 }}>
                        <Typography variant="body1" color="text.secondary">
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
          </Paper>
        )}
      </Container>
    </Box>
  )
}

export default WebinarContent
