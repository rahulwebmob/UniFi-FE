import { Box, Card, Button, Avatar, Typography } from '@mui/material'
import { format } from 'date-fns'
import { Clock, Calendar, ArrowRight, Video, ShoppingCart } from 'lucide-react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { FreeBadge, LiveBadge, OwnedBadge, PremiumBadge } from '../../user-content/card-badges'
import CategoryList from '../../user-content/category-list'

const WebinarCard = ({ webinar }) => {
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
    const { isPaid, isWebinarBought } = webinar

    if (canJoin && isWebinarBought) {
      return 'Join Now'
    }
    if (isWebinarBought) {
      return 'View Webinar'
    }
    if (isPaid) {
      return 'Enroll Now'
    }
    return 'View Webinar'
  }

  const renderActionButton = () => {
    const { isPaid, isWebinarBought } = webinar
    const canJoin = webinar.webinarScheduledObj?.can_join

    const buttonText = getButtonText()
    const showVideoIcon = canJoin && isWebinarBought
    const showCartIcon = isPaid && !isWebinarBought
    const showArrowIcon = (isWebinarBought || !isPaid) && !canJoin && !showCartIcon
    const isFullWidth = !isPaid || isWebinarBought

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

        {webinar?.isWebinarBought && <OwnedBadge />}

        {!webinar?.isWebinarBought && webinar.isPaid && <PremiumBadge />}

        {webinar.webinarScheduledObj?.can_join && (
          <LiveBadge sx={{ top: webinar.isPaid ? 45 : !webinar.isWebinarBought ? 45 : 10 }} />
        )}

        {!webinar?.isWebinarBought && !webinar.isPaid && !webinar.isWebinarBought && <FreeBadge />}

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
            {webinar.isPaid && webinar.price && !webinar?.isWebinarBought ? (
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
