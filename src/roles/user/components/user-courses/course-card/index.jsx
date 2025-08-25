import { Box, Card, Button, Avatar, useTheme, Typography, CardContent } from '@mui/material'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import CategoryList from '../../user-content/category-list'

const CourseCard = ({ course, isPurchased }) => {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleCardClick = () => {
    void navigate(`/dashboard/course/${course._id}/course-details`)
  }

  const categoryArray = course.category
    ? Array.isArray(course.category)
      ? course.category
      : [course.category]
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
          height: '150px',
          width: '100%',
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
            }}
          >
            <Box
              component="img"
              src={course.thumbNail ?? '/placeholder-course.jpg'}
              alt={course.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
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
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              color: 'text.primary',
              mb: 1.5,
              maxWidth: '200px',
            }}
          >
            {course.title}
          </Typography>

          {categoryArray.length > 0 && (
            <CategoryList chips={categoryArray} isPurchased={isPurchased} maxVisible={3} />
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
              View course
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
        backgroundColor: (thm) => thm.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: (thm) => thm.palette.grey[200],
      }}
    >
      <Box
        sx={{
          width: '100%',
          paddingTop: '56.25%',
          position: 'relative',
          backgroundColor: (thm) => thm.palette.grey[100],
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={course.thumbNail ?? '/placeholder-course.jpg'}
          alt={course.title}
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
            e.target.src = '/placeholder-course.jpg'
          }}
        />

        {!course.isPaid && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: theme.palette.success.main,
              color: theme.palette.success.contrastText,
              px: 1,
              py: 0.3,
              borderRadius: '4px',
              fontWeight: theme.typography.fontWeightBold,
              display: 'inline-block',
            }}
          >
            FREE
          </Typography>
        )}

        {!!course.educatorId && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              display: 'flex',
              gap: 0.5,
              backgroundColor: (thm) => thm.palette.background.paper,
              borderRadius: '20px',
              px: 1,
              py: 0.4,
              boxShadow: (thm) => thm.shadows[1],
            }}
          >
            <Avatar
              sx={{
                width: 18,
                height: 18,
                backgroundColor: (theme) => theme.palette.grey[300],
                fontSize: '0.6rem',
              }}
            >
              {course.educatorId.firstName?.[0]?.toUpperCase() || 'E'}
            </Avatar>
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: (thm) => thm.palette.text.primary,
                pr: 0.5,
              }}
            >
              {course.educatorId.firstName || 'Educator'} {course.educatorId.lastName || ''}
            </Typography>
          </Box>
        )}

        {categoryArray.length > 0 && (
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
          {course.title}
        </Typography>

        {course.description && (
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
            {course.description}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: course.isPaid ? 'space-between' : 'center',
              gap: 1,
            }}
          >
            {course.isPaid && course.price ? (
              <Box>
                <Typography
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: (thm) => thm.palette.success.main,
                  }}
                >
                  ${course.price}
                </Typography>
                {!!course.totalPurchased && course.totalPurchased > 0 && (
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      color: (thm) => thm.palette.text.secondary,
                      mt: 0.25,
                      fontWeight: 600,
                    }}
                  >
                    {course.totalPurchased} students
                  </Typography>
                )}
              </Box>
            ) : null}

            <Button
              variant="contained"
              size="small"
              fullWidth={!course.isPaid}
              startIcon={course.isPaid ? <ShoppingCart size={16} /> : null}
              endIcon={course.isPaid ? null : <ArrowRight size={16} />}
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick()
              }}
            >
              {course.isPaid ? 'Enroll Now' : 'Start Free Course'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbNail: PropTypes.string,
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    isPaid: PropTypes.bool,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalPurchased: PropTypes.number,
    educatorId: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }).isRequired,
  isPurchased: PropTypes.bool,
}

CourseCard.defaultProps = {
  isPurchased: false,
}

export default CourseCard
