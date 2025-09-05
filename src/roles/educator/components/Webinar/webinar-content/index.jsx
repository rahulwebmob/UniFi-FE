import {
  Box,
  Card,
  Grid,
  Chip,
  Avatar,
  Button,
  Divider,
  Container,
  CardMedia,
  Typography,
  useTheme,
  CardContent,
} from '@mui/material'
import { format } from 'date-fns'
import { Users, Calendar, Clock, ShoppingCart } from 'lucide-react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import LiveBadge from '../../../../../shared/components/live-badge'
import { getEducatorDetails } from '../../common/common'

const WebinarContent = ({ webinarData, isEdit = true, handlePurchase = () => {} }) => {
  const theme = useTheme()
  const navigate = useNavigate()

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
          startIcon={<ShoppingCart size={20} />}
        >
          Enroll Now
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
      >
        {webinarData?.webinarScheduledObj?.can_join ? 'Join Now' : 'Meeting will start soon'}
      </Button>
    )
  }

  return (
    <Box
      sx={{
        p: 2,
        minHeight: '100vh',
        borderRadius: '12px',
        backgroundColor: 'background.light',
        boxShadow: (theme) => theme.customShadows.primary,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1500px' }}>
        <Box
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 1,
            backgroundColor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.primary,
          }}
        >
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
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

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 1,
                  backgroundColor: 'background.paper',
                  boxShadow: (theme) => theme.customShadows.primary,
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
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
                      objectFit: 'cover',
                    }}
                  />
                  {webinarData?.webinarScheduledObj?.can_join && (
                    <LiveBadge sx={{ top: 16, right: 16 }} />
                  )}
                </Box>

                <CardContent sx={{ p: 3 }}>
                  {webinarData?.isPaid && !webinarData?.isWebinarBought ? (
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="p" color="text.secondary">
                        One-time payment
                      </Typography>
                      <Typography variant="h5" color="primary">
                        ${webinarData?.price || 0}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="p" color="text.secondary">
                        Full access
                      </Typography>
                      <Typography variant="h5" color="success.main">
                        {!webinarData?.isWebinarBought ? 'FREE' : 'PAID'}
                      </Typography>
                    </Box>
                  )}
                  {renderEnrollButton()}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Typography
          variant="h5"
          sx={{
            mb: 1,
          }}
        >
          Live Session Details
        </Typography>
        <Typography
          component="p"
          sx={{
            mb: 3,
            opacity: 0.6,
          }}
        >
          Information about this live session
        </Typography>
        <Box
          sx={{
            p: 4,
            borderRadius: 1,
            backgroundColor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.primary,
          }}
        >
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
