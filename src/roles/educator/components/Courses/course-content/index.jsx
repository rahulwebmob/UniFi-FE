import {
  Box,
  Card,
  Grid,
  Chip,
  Avatar,
  Button,
  Divider,
  Accordion,
  CardMedia,
  Container,
  Typography,
  CardContent,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
} from '@mui/material'
import { Video, Users, Clock, BookOpen, ChevronDown, ShoppingCart } from 'lucide-react'
import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import ModalBox from '../../../../../shared/components/ui-elements/modal-box'
import { getEducatorDetails, handleFormatSeconds } from '../../common/common'
import ViewResource from '../create-course/view-resource'

const CourseContentDetails = ({ courseData, isEdit = true, handlePurchase = () => {} }) => {
  const theme = useTheme()
  const previewRef = useRef()
  const descriptionModalRef = useRef()
  const navigate = useNavigate()

  const handleSticky = (reset = false) => {
    const elements = document.querySelectorAll('.GridLogoHide')

    elements.forEach((element) => {
      if (reset) {
        element.style.overflow = ''
      } else {
        element.style.overflow = 'unset'
      }
    })
  }

  window.addEventListener('popstate', () => {
    handleSticky(true)
  })

  const renderEnrollButton = () => {
    if (!courseData?.isCourseBought && courseData?.isPaid) {
      return (
        <Button
          fullWidth
          color="primary"
          variant="contained"
          startIcon={<ShoppingCart size={20} />}
          onClick={() => {
            if (!isEdit) {
              handlePurchase()
            }
          }}
        >
          Enroll Now
        </Button>
      )
    }

    return (
      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={() => {
          if (!isEdit) {
            navigate(`/dashboard/course/${courseData?._id}/lessons`)
          }
        }}
      >
        Start Course
      </Button>
    )
  }

  useEffect(() => {
    handleSticky()

    return () => {
      handleSticky(true)
    }
  }, [])

  const renderPreview = () => (
    <video
      width="100%"
      height="100%"
      title="modal-preview-video"
      src={courseData?.previewVideo}
      allowFullScreen
      frameBorder="0"
      controls
      autoPlay
      muted
    >
      <track kind="captions" />
    </video>
  )

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
        {/* Clean Header Section */}
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
                {courseData?.title}
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
                  {courseData?.description || '-'}
                </Typography>
                {courseData?.description && courseData.description.length > 300 && (
                  <Button
                    onClick={() => descriptionModalRef.current.openModal()}
                    sx={{
                      mt: 1,
                      p: 0,
                      minWidth: 'auto',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    View More
                  </Button>
                )}
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
                    {getEducatorDetails(courseData, 'avatarName')}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created by
                    </Typography>
                    <Typography variant="body2">
                      {getEducatorDetails(courseData, 'fullName')}
                    </Typography>
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <BookOpen size={18} />
                    <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                      {courseData.totalChaptersCount || 0} Chapters
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Video size={18} />
                    <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                      {courseData.totalLessonsCount || 0} Lessons
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Clock size={18} />
                    <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                      {handleFormatSeconds(courseData.totalDurationOfCourse) || 0} Total
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Users size={18} />
                    <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                      {courseData.totalPurchased || 0} Enrolled
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {courseData?.category &&
                Array.isArray(courseData.category) &&
                courseData.category.length > 0 && (
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {courseData.category.map((cat) => (
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
                    image={courseData?.thumbNail}
                    alt={courseData?.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3 }}>
                  {courseData?.isPaid && !courseData?.isCourseBought ? (
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
                        ${courseData?.price || 0}
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
                        {!courseData?.isCourseBought ? 'FREE' : 'PAID'}
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
          Course Content
        </Typography>
        <Typography
          component="p"
          sx={{
            mb: 3,
            opacity: 0.6,
          }}
        >
          All the chapters and lessons are listed below.
        </Typography>

        <Box
          sx={{
            display: { xs: 'flex', lg: 'grid' },
            flexDirection: { xs: 'column', lg: 'unset' },
            gridTemplateColumns: { lg: '1fr 380px' },
            gap: 3,
          }}
        >
          {/* Chapters Accordion */}
          <Box>
            {courseData?.chapters?.length > 0 &&
              courseData.chapters.map((chapter, chapterIndex) => (
                <Accordion
                  key={chapter._id}
                  defaultExpanded
                  sx={{
                    mb: 2,
                    backgroundColor: 'background.paper',
                    boxShadow: (theme) => theme.customShadows.primary,
                    borderRadius: '12px !important',
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                    '& .MuiAccordionSummary-root': {
                      borderRadius: 0,
                    },
                    '&.Mui-expanded': {
                      margin: '0 0 16px 0',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ChevronDown size={20} />}
                    sx={{
                      backgroundColor: theme.palette.grey[100],
                      '&:hover': {
                        backgroundColor: theme.palette.grey[200],
                      },
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                      sx={{ flexWrap: 'nowrap' }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} flex={1}>
                        <Box
                          sx={{
                            width: { xs: 28, sm: 32 },
                            height: { xs: 28, sm: 32 },
                            minWidth: { xs: 28, sm: 32 },
                            borderRadius: '8px',
                            backgroundColor: 'primary.main',
                            color: (theme) => theme.palette.common.white,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          }}
                        >
                          {chapterIndex + 1}
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: '0.9rem', sm: '1.05rem' },
                            color: 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: { xs: 'nowrap', md: 'normal' },
                            maxWidth: { xs: '150px', sm: 'none' },
                          }}
                        >
                          {chapter.title || '-'}
                        </Typography>
                      </Box>

                      <Box
                        display="flex"
                        alignItems="center"
                        gap={{ xs: 1, sm: 1.5 }}
                        mr={{ xs: 2, sm: 3 }}
                        flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
                        justifyContent="flex-end"
                      >
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Video size={14} />
                          <Typography
                            variant="body2"
                            fontStyle="italic"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                          >
                            {chapter?.totalLessons}
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                              {' '}
                              {chapter?.totalLessons === 1 ? 'lesson' : 'lessons'}
                            </Box>
                          </Typography>
                        </Box>
                        {!!chapter?.totalDuration && (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: { xs: 'none', sm: 'block' } }}
                            >
                              •
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Clock size={14} />
                              <Typography
                                variant="body2"
                                fontStyle="italic"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                              >
                                {handleFormatSeconds(chapter.totalDuration)}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    {chapter?.lessonList?.length > 0 &&
                      chapter.lessonList.map((lesson, lessonIndex) => (
                        <Box
                          key={lesson?._id}
                          sx={{
                            px: { xs: 2, sm: 3 },
                            py: { xs: 2, sm: 2.5 },
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                            justifyContent: 'space-between',
                            borderTop: (theme) =>
                              `1px solid ${alpha(theme.palette.common.black, 0.06)}`,
                            transition: 'background-color 0.2s ease',
                            gap: { xs: 1.5, sm: 2 },
                            '&:first-of-type': {
                              borderTop: 'none',
                            },
                            '&:hover': {
                              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.02),
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1.5} flex={1}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: 'text.primary',
                                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: { xs: 'normal', sm: 'normal' },
                              }}
                            >
                              {lessonIndex + 1}. {lesson?.title || '-'}
                            </Typography>
                          </Box>

                          <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            sx={{
                              justifyContent: { xs: 'space-between', sm: 'flex-end' },
                            }}
                          >
                            <ViewResource
                              isEdit={isEdit}
                              lessonDetail={{
                                ...lesson,
                                courseId: courseData._id,
                                isCourseBought: courseData.isCourseBought,
                              }}
                              handlePurchase={handlePurchase}
                            />
                            {!!lesson?.durationInSeconds && (
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={0.5}
                                sx={{ minWidth: { xs: '60px', sm: 'auto' } }}
                              >
                                <Clock size={14} />
                                <Typography
                                  variant="caption"
                                  fontStyle="italic"
                                  color="text.secondary"
                                  sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' } }}
                                >
                                  {handleFormatSeconds(lesson.durationInSeconds)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                  </AccordionDetails>
                </Accordion>
              ))}
          </Box>

          {/* Preview Video Section */}
          {courseData?.previewVideo && (
            <Box
              sx={{
                position: { xs: 'relative', lg: 'sticky' },
                top: { xs: 0, lg: 20 },
                height: 'fit-content',
                backgroundColor: (theme) => theme.palette.background.paper,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: (theme) => theme.shadows[2],
                mb: { xs: 3, lg: 0 },
              }}
            >
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <video
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  src={courseData?.previewVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <track kind="captions" />
                </video>
              </Box>
            </Box>
          )}
        </Box>
      </Container>

      <ModalBox ref={previewRef} size="lg">
        {renderPreview()}
      </ModalBox>

      {/* Description Modal */}
      <ModalBox ref={descriptionModalRef} size="md">
        <Typography variant="h5" mb={2}>
          Course Description
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {courseData?.description}
        </Typography>
      </ModalBox>
    </Box>
  )
}

export default CourseContentDetails

CourseContentDetails.propTypes = {
  isEdit: PropTypes.bool,
  handlePurchase: PropTypes.func,
  courseData: PropTypes.oneOfType([PropTypes.object]).isRequired,
}
