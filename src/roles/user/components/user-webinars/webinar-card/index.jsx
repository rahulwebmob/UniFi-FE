import { Box, Card, Button, Avatar, Typography, CardContent } from '@mui/material'
import { format } from 'date-fns'
import { Clock, Calendar, ArrowRight, Video, ShoppingCart } from 'lucide-react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import LiveBadge from '../../../../../shared/components/live-badge'
import CategoryList from '../../user-content/category-list'

const WebinarCard = ({ webinar, isPurchased = false }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    void navigate(`/dashboard/webinar/${webinar._id}/webinar-details`)
  }

  const handleJoinWebinar = () => {
    if (webinar.webinarScheduledObj?.can_join) {
      void navigate(`/dashboard/webinar/${webinar._id}`)
    }
  }

  const categoryArray = webinar.category
    ? Array.isArray(webinar.category)
      ? webinar.category
      : [webinar.category]
    : []

  if (isPurchased) {
    return (
      <Card
        onClick={handleCardClick}
        sx={{
          display: 'flex',
          borderRadius: 1.5,
          boxShadow: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          overflow: 'hidden',
          height: 150,
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: 180,
            flexShrink: 0,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: 'grey.100',
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src={webinar.thumbNail ?? '/placeholder-webinar.jpg'}
              alt={webinar.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {webinar.webinarScheduledObj?.can_join ? (
              <LiveBadge sx={{ top: 4, right: 4, px: 0.5, py: 0.2, borderRadius: '3px' }} />
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: (theme) => theme.palette.error.contrastText,
                  px: 0.7,
                  py: 0.3,
                  borderRadius: '3px',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  fontStyle: 'italic',
                }}
              >
                Starting soon
              </Box>
            )}
          </Box>
        </Box>

        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            pl: 0,
            '&:last-child': { pb: 2 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              mb: 1,
              maxWidth: '200px',
            }}
          >
            {webinar.title}
          </Typography>

          {webinar.webinarScheduledObj?.join_date && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.75,
              }}
            >
              <Calendar size={12} sx={{ color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                {format(new Date(webinar.webinarScheduledObj.join_date), 'MMM dd, yyyy')}
                {' at '}
                {format(new Date(webinar.webinarScheduledObj.join_date), 'h:mm a')}
              </Typography>
            </Box>
          )}

          {!!categoryArray.length && (
            <CategoryList chips={categoryArray} isPurchased maxVisible={2} />
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: 'primary.main',
              }}
            >
              View webinar
            </Typography>
            <ArrowRight size={16} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        borderRadius: '12px',
        boxShadow: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <Box
        sx={{
          width: '100%',
          paddingTop: '56.25%',
          position: 'relative',
          backgroundColor: 'grey.100',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={webinar.thumbNail ?? '/placeholder-webinar.jpg'}
          alt={webinar.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />

        {webinar.webinarScheduledObj?.can_join ? (
          <LiveBadge
            sx={{ top: 10, right: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}
          />
        ) : !webinar.isPaid ? (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: (theme) => theme.palette.success.main,
              color: (theme) => theme.palette.error.contrastText,
              px: 1,
              py: 0.3,
              borderRadius: '4px',
              fontSize: (theme) => theme.typography.caption.fontSize,
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Free
          </Box>
        ) : null}

        {!!webinar.educatorId && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              display: 'flex',
              gap: 0.5,
              backgroundColor: 'background.paper',
              borderRadius: '20px',
              px: 1,
              py: 0.4,
              boxShadow: 1,
            }}
          >
            <Avatar
              sx={{
                width: 18,
                height: 18,
                backgroundColor: 'grey.300',
                fontSize: '0.6rem',
              }}
            >
              {webinar.educatorId.firstName?.[0]?.toUpperCase() || 'E'}
            </Avatar>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                pr: 0.5,
              }}
            >
              {webinar.educatorId.firstName || 'Educator'} {webinar.educatorId.lastName || ''}
            </Typography>
          </Box>
        )}

        {!!categoryArray.length && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <CategoryList chips={categoryArray} isPurchased={false} maxVisible={3} />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            mb: 0.75,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {webinar.title}
        </Typography>

        {webinar.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              opacity: 0.8,
            }}
          >
            {webinar.description}
          </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />

        {webinar.webinarScheduledObj?.join_date && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: 1.5,
              py: 1,
            }}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              <Calendar size={14} />
              <Typography color="text.secondary" variant="body2">
                {format(new Date(webinar.webinarScheduledObj.join_date), 'MMM dd, yyyy')}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Clock size={14} />
              <Typography color="text.secondary" variant="body2">
                {format(new Date(webinar.webinarScheduledObj.join_date), 'h:mm a')}
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: webinar.isPaid ? 'space-between' : 'center',
              gap: 1,
            }}
          >
            {webinar.isPaid && webinar.price ? (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'success.main',
                }}
              >
                ${webinar.price}
              </Typography>
            ) : null}

            {webinar.webinarScheduledObj?.can_join ? (
              <Button
                variant="contained"
                size="small"
                fullWidth={!webinar.isPaid}
                startIcon={<Video size={16} />}
                onClick={(e) => {
                  e.stopPropagation()
                  handleJoinWebinar()
                }}
              >
                Join Now
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                fullWidth={!webinar.isPaid}
                startIcon={
                  webinar.isPaid && !webinar.isWebinarBought ? <ShoppingCart size={16} /> : null
                }
                endIcon={
                  webinar.isPaid && webinar.isWebinarBought ? (
                    <ArrowRight size={16} />
                  ) : !webinar.isPaid ? (
                    <ArrowRight size={16} />
                  ) : null
                }
                onClick={(e) => {
                  e.stopPropagation()
                  handleCardClick()
                }}
              >
                {webinar.isPaid && !webinar.isWebinarBought
                  ? 'Buy Now'
                  : webinar.isPaid
                    ? 'View Details'
                    : 'View Details'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

WebinarCard.propTypes = {
  webinar: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbNail: PropTypes.string,
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    isPaid: PropTypes.bool,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalEnrolled: PropTypes.number,
    isWebinarBought: PropTypes.bool,
    webinarScheduledObj: PropTypes.shape({
      can_join: PropTypes.bool,
      join_date: PropTypes.string,
    }),
    educatorId: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }).isRequired,
  isPurchased: PropTypes.bool,
}

export default WebinarCard
