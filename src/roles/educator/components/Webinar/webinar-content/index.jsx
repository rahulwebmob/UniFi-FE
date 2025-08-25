import {
  Box,
  Card,
  Grid,
  Chip,
  alpha,
  Avatar,
  Button,
  Divider,
  Container,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material'
import { format } from 'date-fns'
import { Users, Calendar, Clock, ShoppingCart } from 'lucide-react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { getEducatorDetails } from '../../common/common'

const WebinarContent = ({ webinarData, isEdit, handlePurchase }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation('education')

  const renderEnrollButton = () => {
    if (!webinarData?.isWebinarBought && webinarData?.isPaid) {
      return (
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={isEdit}
          onClick={() => {
            if (!isEdit) {
              handlePurchase()
            }
          }}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            boxShadow: 'none',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          }}
          startIcon={<ShoppingCart size={20} />}
        >
          {t('EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.ENROLL_NOW')}
        </Button>
      )
    }

    return (
      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={isEdit || !webinarData?.webinarScheduledObj?.can_join}
        onClick={() => {
          if (!isEdit && webinarData?.webinarScheduledObj?.can_join) {
            navigate(`/dashboard/webinar/${webinarData?._id}`)
          }
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
            background: theme.palette.background.paper,
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

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="p"
                  sx={{
                    lineHeight: 1.7,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {webinarData?.description || '-'}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 3,
                  pb: 3,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar sx={{ backgroundColor: (theme) => theme.palette.grey[300] }}>
                    {getEducatorDetails(webinarData, 'avatarName')}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Hosted by
                    </Typography>
                    <Typography variant="body2">
                      {getEducatorDetails(webinarData, 'fullName')}
                    </Typography>
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Calendar size={18} />
                    <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                      {webinarData?.webinarScheduledObj?.join_date
                        ? format(
                            new Date(webinarData?.webinarScheduledObj?.join_date),
                            'dd MMM yyyy',
                          )
                        : 'Not scheduled'}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Clock size={18} />
                    <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                      {webinarData?.webinarScheduledObj?.join_date
                        ? format(new Date(webinarData?.webinarScheduledObj?.join_date), 'hh:mm a')
                        : '-'}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Users size={18} />
                    <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                      {webinarData?.totalEnrolled || 0} Enrolled
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {webinarData?.category &&
                Array.isArray(webinarData.category) &&
                webinarData.category.length > 0 && (
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {webinarData.category.map((cat) => (
                      <Chip key={cat} label={cat} size="small" color="primary" />
                    ))}
                  </Box>
                )}
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
                  background: theme.palette.background.paper,
                }}
              >
                {/* Thumbnail */}
                <Box
                  sx={{
                    width: '100%',
                    position: 'relative',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    overflow: 'hidden',
                    background: theme.palette.grey[100],
                  }}
                >
                  <CardMedia
                    component="img"
                    image={webinarData?.thumbNail}
                    alt={webinarData?.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
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
                      <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
                        FREE
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Schedule Info */}
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
                    <Calendar size={18} color={theme.palette.text.secondary} />
                    <Typography variant="body2" color="text.secondary">
                      {webinarData?.webinarScheduledObj?.join_date ? (
                        <>
                          <strong>
                            {format(
                              new Date(webinarData?.webinarScheduledObj?.join_date),
                              'EEEE, dd MMMM yyyy',
                            )}
                          </strong>{' '}
                          at{' '}
                          <strong>
                            {format(
                              new Date(webinarData?.webinarScheduledObj?.join_date),
                              'hh:mm a',
                            )}
                          </strong>
                        </>
                      ) : (
                        'Schedule to be announced'
                      )}
                    </Typography>
                  </Box>

                  {/* Price Section */}
                  {webinarData?.isPaid && !webinarData?.isWebinarBought && (
                    <Box mb={3}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
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
                          ${webinarData?.price || 0}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Enroll Button */}
                  {renderEnrollButton()}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Description Section */}
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            background: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            About this Webinar
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
              whiteSpace: 'pre-wrap',
            }}
          >
            {webinarData?.description || 'No description available'}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default WebinarContent

WebinarContent.propTypes = {
  isEdit: PropTypes.bool,
  handlePurchase: PropTypes.func,
  webinarData: PropTypes.oneOfType([PropTypes.object]).isRequired,
}

WebinarContent.defaultProps = {
  isEdit: true,
  handlePurchase: () => {},
}
