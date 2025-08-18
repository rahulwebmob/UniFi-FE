import React from 'react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Clock, Calendar, ArrowRight } from 'lucide-react'

import {
  Box,
  Card,
  Button,
  Avatar,
  Typography,
  CardContent,
} from '@mui/material'

import CategoryList from '../category-list'

const WebinarCard = ({ webinar, isPurchased }) => {
  const { t } = useTranslation('education')
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
          flexDirection: 'row',
          borderRadius: '12px',
          boxShadow: (thm) => thm.shadows[1],
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          overflow: 'hidden',
          backgroundColor: (thm) => thm.palette.background.paper,
          height: '150px',
          minWidth: '380px',
          width: '380px',
          flexShrink: 0,
          '&:hover': {
            boxShadow: (thm) => thm.shadows[4],
          },
        }}
      >
        <Box
          sx={{
            width: '180px',
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
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: (thm) => thm.palette.grey[100],
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
            {/* Badges */}
            {webinar.webinarScheduledObj?.can_join ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: (theme) => theme.palette.error.main,
                  color: 'white',
                  px: 0.5,
                  py: 0.2,
                  borderRadius: '3px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.3,
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    animation: 'pulse 1.5s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.3 },
                      '100%': { opacity: 1 },
                    },
                  }}
                />
                LIVE
              </Box>
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
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
            component="p"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              color: 'text.primary',
              mb: 0.5,
              fontSize: '0.9rem',
            }}
          >
            {webinar.title}
          </Typography>

          {/* Educator Info */}
          {webinar.educatorDetail && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.75,
              }}
            >
              <Avatar
                src={webinar.educatorDetail.profilePic}
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: (thm) => thm.palette.primary.light,
                  fontSize: '0.6rem',
                }}
              >
                {webinar.educatorDetail.firstName?.[0].toUpperCase()}
              </Avatar>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: (thm) => thm.palette.text.secondary,
                }}
              >
                {webinar.educatorDetail.firstName}{' '}
                {webinar.educatorDetail.lastName}
              </Typography>
            </Box>
          )}

          {/* Date and Time */}
          {webinar.webinarScheduledObj?.join_date && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.75,
              }}
            >
              <Calendar
                size={12}
                style={{ color: 'var(--mui-palette-text-secondary)' }}
              />
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                {format(
                  new Date(webinar.webinarScheduledObj.join_date),
                  'MMM dd, yyyy',
                )}
                {' at '}
                {format(
                  new Date(webinar.webinarScheduledObj.join_date),
                  'h:mm a',
                )}
              </Typography>
            </Box>
          )}

          {categoryArray.length > 0 && (
            <CategoryList chips={categoryArray} isPurchased maxVisible={2} />
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: webinar.webinarScheduledObj?.can_join
                ? 'space-between'
                : 'flex-start',
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick()
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: 'primary.main',
                  fontSize: '0.75rem',
                }}
              >
                View webinar
              </Typography>
              <ArrowRight size={16} />
            </Box>

            {webinar.webinarScheduledObj?.can_join && (
              <Button
                size="small"
                variant="contained"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  py: 0.5,
                  px: 2,
                  backgroundColor: (theme) => theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.error.dark,
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleJoinWebinar()
                }}
              >
                Join Now
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Non-purchased webinar card (grid view)
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
        backgroundColor: (thm) => thm.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid',
        borderColor: (thm) => thm.palette.grey[200],
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          borderColor: (thm) => thm.palette.primary.light,
        },
      }}
    >
      {/* Image Container with 16:9 aspect ratio */}
      <Box
        sx={{
          width: '100%',
          paddingTop: '56.25%', // 16:9 aspect ratio
          position: 'relative',
          backgroundColor: (thm) => thm.palette.grey[100],
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
          onError={(e) => {
            e.target.src = '/placeholder-webinar.jpg'
          }}
        />

        {/* Live/Upcoming Badge - Top Right */}
        {webinar.webinarScheduledObj?.can_join ? (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: (theme) => theme.palette.error.main,
              color: 'white',
              px: 1,
              py: 0.3,
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'white',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.3 },
                  '100%': { opacity: 1 },
                },
              }}
            />
            LIVE
          </Box>
        ) : !webinar.isPaid ? (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: (theme) => theme.palette.success.main,
              color: 'white',
              px: 1,
              py: 0.3,
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Free
          </Box>
        ) : null}

        {/* Educator Info - Top Left */}
        {webinar.educatorDetail && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '20px',
              px: 1,
              py: 0.4,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <Avatar
              src={webinar.educatorDetail.profilePic}
              sx={{
                width: 18,
                height: 18,
                backgroundColor: (thm) => thm.palette.primary.light,
                fontSize: '0.6rem',
              }}
            >
              {webinar.educatorDetail.firstName?.[0].toUpperCase()}
            </Avatar>
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: (thm) => thm.palette.text.primary,
                pr: 0.5,
              }}
            >
              {webinar.educatorDetail.firstName}{' '}
              {webinar.educatorDetail.lastName}
            </Typography>
          </Box>
        )}

        {/* Categories Overlay - Bottom */}
        {categoryArray.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <CategoryList
              chips={categoryArray}
              isPurchased={false}
              maxVisible={3}
            />
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
            lineHeight: 1.3,
            color: (thm) => thm.palette.text.primary,
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

        {/* Description */}
        {webinar.description && (
          <Typography
            sx={{
              fontSize: '0.75rem',
              lineHeight: 1.4,
              color: (thm) => thm.palette.text.secondary,
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              opacity: 0.8,
            }}
          >
            {webinar.description}
          </Typography>
        )}

        {/* Date and Time */}
        {webinar.webinarScheduledObj?.join_date && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 1.5,
              backgroundColor: (thm) => thm.palette.grey[50],
              borderRadius: '8px',
              p: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Calendar
                size={14}
                style={{ color: 'var(--mui-palette-text-secondary)' }}
              />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {format(
                  new Date(webinar.webinarScheduledObj.join_date),
                  'MMM dd, yyyy',
                )}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock
                size={14}
                style={{ color: 'var(--mui-palette-text-secondary)' }}
              />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {format(
                  new Date(webinar.webinarScheduledObj.join_date),
                  'h:mm a',
                )}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Bottom Section */}
        <Box>
          {/* Enrollment Count for Paid */}
          {webinar.isPaid && (webinar.totalEnrolled ?? 0) > 0 && (
            <Typography
              sx={{
                fontSize: '0.65rem',
                color: (thm) => thm.palette.text.secondary,
                mb: 1,
                opacity: 0.7,
              }}
            >
              {webinar.totalEnrolled}{' '}
              {t('EDUCATION_DASHBOARD.MAIN_PAGE.ENROLLED')}
            </Typography>
          )}

          {/* Price and CTA Row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: webinar.isPaid ? 'space-between' : 'center',
              gap: 1,
            }}
          >
            {/* Price */}
            {webinar.isPaid && webinar.price ? (
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: (thm) => thm.palette.text.primary,
                  lineHeight: 1,
                }}
              >
                ${webinar.price}
              </Typography>
            ) : null}

            {/* CTA Button */}
            {webinar.webinarScheduledObj?.can_join ? (
              <Button
                variant="contained"
                size="small"
                fullWidth={!webinar.isPaid}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  px: 2,
                  py: 0.6,
                  borderRadius: '6px',
                  minWidth: 'auto',
                  backgroundColor: (theme) => theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.error.dark,
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleJoinWebinar()
                }}
              >
                {t('EDUCATION_DASHBOARD.COMMON_KEYS.JOIN_NOW')}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                fullWidth={!webinar.isPaid}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  px: 2,
                  py: 0.6,
                  borderRadius: '6px',
                  minWidth: 'auto',
                  backgroundColor: (thm) =>
                    webinar.isPaid
                      ? thm.palette.primary.main
                      : thm.palette.success.main,
                  '&:hover': {
                    backgroundColor: (thm) =>
                      webinar.isPaid
                        ? thm.palette.primary.dark
                        : thm.palette.success.dark,
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCardClick()
                }}
              >
                {webinar.isPaid && !webinar.isWebinarBought
                  ? t('EDUCATION_DASHBOARD.COMMON_KEYS.BUY_NOW')
                  : webinar.isPaid
                    ? t('EDUCATION_DASHBOARD.MAIN_PAGE.VIEW_DETAILS')
                    : t('EDUCATION_DASHBOARD.COMMON_KEYS.REGISTER_FREE')}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default WebinarCard
