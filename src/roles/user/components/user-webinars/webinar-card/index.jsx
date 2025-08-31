import { Box, Card, Button, Avatar, Typography } from '@mui/material'
import { format } from 'date-fns'
import { Clock, Calendar, ArrowRight, Video, ShoppingCart } from 'lucide-react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import LiveBadge from '../../../../../shared/components/live-badge'
import CategoryList from '../../user-content/category-list'

const WebinarCard = ({ webinar, isPurchased = false }) => {
  const navigate = useNavigate()

  const handleShowWebinar = () => {
    navigate(`/dashboard/webinar/${webinar._id}/webinar-details`)
  }

  const categoryArray = webinar.category
    ? Array.isArray(webinar.category)
      ? webinar.category
      : [webinar.category]
    : []

  const getButtonText = () => {
    const canJoin = webinar.webinarScheduledObj?.can_join
    const { isPaid } = webinar

    if (canJoin) {
      return 'Join Now'
    }
    if (isPurchased) {
      return 'View Webinar'
    }
    if (isPaid) {
      return 'Enroll Now'
    }
    return 'View Webinar'
  }

  const renderActionButton = () => {
    const { isPaid } = webinar
    const canJoin = webinar.webinarScheduledObj?.can_join

    const buttonText = getButtonText()
    const showVideoIcon = canJoin
    const showCartIcon = isPaid && !isPurchased
    const showArrowIcon = (isPurchased || !isPaid) && !canJoin
    const isFullWidth = !isPaid || isPurchased

    return (
      <Button
        variant="contained"
        size="small"
        fullWidth={isFullWidth}
        startIcon={
          showVideoIcon ? <Video size={16} /> : showCartIcon ? <ShoppingCart size={16} /> : null
        }
        endIcon={showArrowIcon ? <ArrowRight size={16} /> : null}
      >
        {buttonText}
      </Button>
    )
  }

  return (
    <Card
      onClick={handleShowWebinar}
      sx={{
        height: '100%',
        borderRadius: '12px',
        boxShadow: (theme) => theme.customShadows.primary,
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

        {webinar.webinarScheduledObj?.can_join && (
          <LiveBadge
            sx={{ top: 10, right: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}
          />
        )}

        {!webinar.isPaid && !webinar.isWebinarBought && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: webinar.webinarScheduledObj?.can_join ? 70 : 10,
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
        )}

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
            <CategoryList chips={categoryArray} maxVisible={3} />
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
            {webinar.isPaid && webinar.price && !isPurchased ? (
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

            {renderActionButton()}
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
