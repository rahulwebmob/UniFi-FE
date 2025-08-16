import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { useRef, useEffect } from 'react'
import {
  Video,
  FileText,
  ChevronDown,
  Clock,
  BookOpen,
  User,
  PlayCircle,
  DollarSign,
} from 'lucide-react'

import {
  Box,
  Card,
  Grid,
  Chip,
  Avatar,
  Button,
  Tooltip,
  Accordion,
  CardMedia,
  Container,
  Typography,
  CardContent,
  AccordionSummary,
  AccordionDetails,
  Divider,
  alpha,
  useTheme,
} from '@mui/material'

import ViewResource from '../create-course/view-resource'
import ModalBox from '../../../../../shared/components/ui-elements/modal-box'
// import { getEducatorDetails, handleFormatSeconds } from '../../../common'

const handleFormatSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours}:${minutes}:${remainingSeconds}`
}

const ContentView = ({ courseData, isEdit, handleOpenPremiumModal }) => {
  const previewRef = useRef()
  const navigate = useNavigate()
  const { t } = useTranslation('education')
  const theme = useTheme()

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

  const renderEnrollButton = () =>
    !courseData?.isCourseBought && courseData?.isPaid ? (
      <Button
        fullWidth
        disabled={isEdit}
        color="priamry"
        variant="contained"
        onClick={handleOpenPremiumModal}
      >
        {t(
          'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.ENROLL_NOW',
        )}
      </Button>
    ) : (
      <Button
        fullWidth
        disabled={isEdit}
        color="priamry"
        variant="contained"
        onClick={() => {
          void navigate(`/dashboard/course/${courseData?._id}/lessons`)
        }}
      >
        {t(
          'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.START_COURSE',
        )}
      </Button>
    )

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
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            background: 'white',
            borderRadius: 3,
            boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Grid
            container
            spacing={1}
            sx={{
              alignItems: 'center',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 7 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 2,
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                }}
              >
                {courseData?.title}
              </Typography>

              {courseData?.category?.length > 0 && (
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  {courseData.category.map((cat, index) => (
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

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.7,
                  mb: 3,
                }}
              >
                {courseData?.description || '-'}
              </Typography>
              <Box
                display="flex"
                gap={3}
                flexWrap="wrap"
                sx={{
                  pt: 2,
                  borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <BookOpen size={18} color={theme.palette.text.secondary} />
                  <Typography variant="body2" color="text.secondary">
                    {courseData?.totalChaptersCount || 0} Chapters
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <PlayCircle size={18} color={theme.palette.text.secondary} />
                  <Typography variant="body2" color="text.secondary">
                    {courseData?.totalLessonsCount || 0} Lessons
                  </Typography>
                </Box>
                {courseData?.totalDurationOfCourse && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Clock size={18} color={theme.palette.text.secondary} />
                    <Typography variant="body2" color="text.secondary">
                      {handleFormatSeconds(courseData.totalDurationOfCourse)}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box mt={3}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {t('education:EDUCATION_DASHBOARD.COMMON_KEYS.CREATED_BY')}
                </Typography>
                <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    }}
                    src={`${courseData?.educatorId?.firstName}${courseData?.educatorId?.lastName}`}
                  >
                    <User size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {courseData?.educatorId?.firstName}{' '}
                      {courseData?.educatorId?.lastName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6, lg: 5 }}
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-end"
            >
              <Card
                sx={{
                  width: { xs: '100%', md: '400px' },
                  p: 0,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '220px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    image={courseData?.thumbNail}
                    title={courseData?.title}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7) 100%)',
                    }}
                  />

                  {/* Free Badge */}
                  {!courseData?.isPaid && (
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

                <CardContent sx={{ p: 3 }}>
                  {/* Price Section - Only show for paid courses */}
                  {!courseData?.isCourseBought && courseData?.isPaid && (
                    <Box mb={3}>
                      <Typography
                        variant="caption"
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
                          mt: 0.5,
                        }}
                      >
                        ${courseData?.price}
                      </Typography>
                    </Box>
                  )}
                  {renderEnrollButton()}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            mb: 3,
            p: 3,
            background: 'white',
            borderRadius: 2,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.06)}`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: theme.palette.text.primary,
            }}
          >
            {t(
              'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.COURSE_CONTENT',
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore the complete curriculum with all chapters and lessons
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '100%', lg: '1fr 400px' },
            gap: 3,
          }}
        >
          <Box>
            {!!courseData?.chapters?.length &&
              courseData?.chapters?.map((chapter, chapterIndex) => (
                <Accordion
                  defaultExpanded={chapterIndex === 0}
                  key={chapter._id}
                  sx={{
                    mb: 2,
                    background: 'white',
                    borderRadius: 2,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.06)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ChevronDown size={20} />}
                    aria-controls={`panel-${chapter._id}-content`}
                    id={`panel-${chapter._id}-header`}
                    sx={{
                      background: alpha(theme.palette.primary.main, 0.03),
                      borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.05),
                      },
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        color: theme.palette.primary.main,
                        '&.Mui-expanded': {
                          transform: 'rotate(180deg)',
                        },
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: '0.875rem',
                          }}
                        >
                          {chapterIndex + 1}
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {chapter.title || '-'}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Chip
                          label={`${chapter?.totalLessons} ${chapter?.totalLessons === 1 ? 'Lesson' : 'Lessons'}`}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.75rem',
                            background: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.dark,
                          }}
                        />
                        {!!chapter?.totalDuration && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Clock size={14} />
                            {handleFormatSeconds(chapter.totalDuration)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {!!chapter?.lessonList.length &&
                      chapter?.lessonList?.map((lesson, lessonIndex) => (
                        <Box
                          key={lesson?._id}
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                          alignItems="center"
                          sx={{
                            px: 3,
                            py: 2,
                            borderBottom:
                              lessonIndex < chapter.lessonList.length - 1
                                ? `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
                                : 'none',
                            transition: 'background 0.2s',
                            '&:hover': {
                              background: alpha(
                                theme.palette.primary.main,
                                0.02,
                              ),
                            },
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            flex={1}
                          >
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background:
                                  lesson?.lessonType === 'pdf'
                                    ? alpha(theme.palette.warning.main, 0.1)
                                    : alpha(theme.palette.info.main, 0.1),
                                color:
                                  lesson?.lessonType === 'pdf'
                                    ? theme.palette.warning.main
                                    : theme.palette.info.main,
                              }}
                            >
                              {lesson?.lessonType === 'pdf' ? (
                                <FileText size={18} />
                              ) : (
                                <Video size={18} />
                              )}
                            </Box>
                            <Box flex={1}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                {lesson?.title || '-'}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Lesson {lessonIndex + 1}
                              </Typography>
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2}>
                            {lesson?.durationInSeconds && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                }}
                              >
                                <Clock size={14} />
                                {handleFormatSeconds(lesson?.durationInSeconds)}
                              </Typography>
                            )}
                            <ViewResource
                              isEdit={isEdit}
                              lessonDetail={{
                                ...lesson,
                                courseId: courseData._id,
                                isCourseBought: courseData.isCourseBought,
                              }}
                              handleOpenPremiumModal={handleOpenPremiumModal}
                            />
                          </Box>
                        </Box>
                      ))}
                  </AccordionDetails>
                </Accordion>
              ))}
          </Box>
          {courseData?.previewVideo && (
            <Box
              sx={{
                position: 'sticky',
                top: 20,
                height: 'fit-content',
              }}
            >
              <Box
                sx={{
                  background: 'white',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Course Preview
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Watch a preview of this course
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover .play-overlay': {
                      opacity: 1,
                    },
                  }}
                  onClick={() => previewRef.current.openModal()}
                >
                  <video
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                    src={courseData?.previewVideo}
                  >
                    <track kind="captions" />
                  </video>
                  <Box
                    className="play-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: alpha(theme.palette.common.black, 0.4),
                      opacity: 0.8,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: alpha(theme.palette.common.white, 0.9),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}
                    >
                      <PlayCircle
                        size={32}
                        color={theme.palette.primary.main}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
      <ModalBox ref={previewRef} size="lg">
        {renderPreview()}
      </ModalBox>
    </Box>
  )
}

export default ContentView
