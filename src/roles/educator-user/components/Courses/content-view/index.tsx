import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { useRef, useEffect } from 'react'
import { Video, FileText, ChevronDown } from 'lucide-react'

import {
  Box,
  Card,
  Grid,
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
        color="secondary"
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
        color="secondary"
        variant="contained"
        onClick={() => { void navigate(`/dashboard/course/${courseData?._id}/lessons`) }}
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
        padding: 2,
        borderRadius: '8px',
        background: (theme) => theme.palette.primary.light,
        '& .MuiTypography-root': {
          fontFamily: 'inter',
        },
      }}
    >
      <Container
        sx={{
          width: '100%',
          '@media (min-width:1200px)': { maxWidth: '1400px' },
        }}
        maxWidth="lg"
      >
        <Grid
          sx={{
            padding: 2,
            background: (theme) => theme.palette.primary.light,
            borderRadius: '8px',
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
            <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
              <Typography variant="h1" mb={2}>
                {courseData?.title}
              </Typography>

              <Tooltip title={courseData?.description || '-'} arrow>
                <Typography
                  variant="body1"
                  color="secondary"
                  sx={{
                    width: '100%',
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                    boxSizing: 'border-box',
                  }}
                  my={2}
                >
                  {courseData?.description || '-'}
                </Typography>
              </Tooltip>
              <Box mt={1}>
                <Typography component="p" color="secondary" display="block">
                  {t('education:EDUCATION_DASHBOARD.COMMON_KEYS.CREATED_BY')}
                </Typography>
                <Box
                  display="inline-flex"
                  alignItems="center"
                  gap="3px"
                  sx={{
                    background: (theme) => theme.palette.primary.light,
                    padding: 1,
                    borderRadius: '8px',
                  }}
                >
                  <Avatar sx={{ width: '30px', height: '30px' }}>
                    <Typography variant="body2">
                      {/* {getEducatorDetails(courseData, 'avatarName')} */}
                    </Typography>
                  </Avatar>
                  <Typography variant="body1" color="primary">
                    {/* {getEducatorDetails(courseData, 'fullName')} */}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6, lg: 6 }}
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <Card
                sx={{
                  width: { xs: 'auto', md: '450px' },
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid ',
                  borderColor: (theme) => theme.palette.primary[100],
                  background: 'none',
                }}
              >
                <Box sx={{ width: '100%', height: '222px' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                    image={courseData?.thumbNail}
                    title={t(
                      'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.COURSE_THUMBNAIL',
                    )}
                  />
                </Box>

                <CardContent sx={{ p: 0, my: 1 }}>
                  <Typography
                    component="p"
                    fontWeight={600}
                    mb={1}
                    display="block"
                  >
                    {courseData?.title || '-'}
                  </Typography>
                </CardContent>
                {!courseData?.isCourseBought && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    my={1}
                  >
                    <Typography component="p">
                      {t(
                        'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.COURSE_PRICE',
                      )}
                    </Typography>
                    <Typography component="p" fontWeight={600}>
                      {courseData.isPaid
                        ? `$${courseData?.price}`
                        : t('education:EDUCATION_DASHBOARD.COMMON_KEYS.FREE')}
                    </Typography>
                  </Box>
                )}
                {/* enroll button */}
                {renderEnrollButton()}
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Box my={2}>
          <Typography variant="h4" fontWeight={600}>
            {t(
              'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.COURSE_CONTENT',
            )}
          </Typography>
          <Typography variant="body2" color="secondary">
            {!!courseData?.totalChaptersCount &&
              `${courseData.totalChaptersCount} ${t(
                'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.CHAPTERS',
              )} • `}
            {!!courseData?.totalLessonsCount &&
              `${courseData.totalLessonsCount} ${
                courseData.totalLessonsCount === 1
                  ? t(
                      'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.LESSON',
                    )
                  : t(
                      'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.LESSONS',
                    )
              }`}
            {!!courseData?.totalDurationOfCourse &&
              ` • ${handleFormatSeconds(courseData.totalDurationOfCourse)} ${t(
                'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.TOTAL_LENGTH',
              )}`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '100%', md: '1fr 434px' },
            columnGap: '20px',
          }}
        >
          <Box
            sx={{
              background: (theme) => theme.palette.primary.light,
              borderRadius: '8px',
              padding: '10px',
              '& .MuiPaper-root.Mui-expanded': {
                margin: '5px 0',
              },
              '& .MuiAccordion-root ': {
                '& .Mui-expanded': {
                  minHeight: '48px',
                  margin: 0,
                  gap: '5px',
                },
              },
            }}
          >
            {!!courseData?.chapters?.length &&
              courseData?.chapters?.map((chapter, chapterIndex) => (
                <Accordion
                  defaultExpanded
                  key={chapter._id}
                  sx={{
                    background: 'none',
                    boxShadow: 'none',
                    borderRadius: '8px',
                    '& .MuiAccordionSummary-content': {
                      margin: '6px 0',
                    },
                    '& .MuiCollapse-wrapper ': {
                      padding: '0 10px 0 10px',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ChevronDown size={16} />}
                    aria-controls={`panel-${chapter._id}-content`}
                    id={`panel-${chapter._id}-header`}
                    sx={{
                      background: (theme) => theme.palette.primary[100],
                      borderRadius: '4px',
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        order: -1,
                        marginRight: '10px',
                        margin: '0px',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Typography component="p">
                        {`${t(
                          'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.CHAPTER',
                        )} ${chapterIndex + 1}. ${chapter.title || '-'}`}
                      </Typography>
                      <Typography component="p" color="text.secondary">
                        {chapter?.totalLessons}
                        {chapter?.totalLessons === 1
                          ? ` ${t(
                              'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.LESSON',
                            )}`
                          : ` ${t(
                              'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.LESSONS',
                            )}`}
                        {!!chapter?.totalDuration &&
                          ` • ${handleFormatSeconds(chapter.totalDuration)}`}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  {!!chapter?.lessonList.length &&
                    chapter?.lessonList?.map((lesson, lessonIndex) => (
                      <AccordionDetails key={lesson?._id}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                          alignItems="center"
                          sx={{
                            borderBottom: '1px solid',
                            borderColor: (theme) => theme.palette.primary.light,
                            padding: '10px 0',
                            flexWrap: 'wrap',
                            gap: '10px',
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap="10px"
                            sx={{
                              svg: {
                                color: (theme) => theme.palette.grey.light,
                              },
                            }}
                          >
                            {lesson?.lessonType === 'pdf' ? (
                              <FileText size={20} />
                            ) : (
                              <Video size={20} />
                            )}
                            <Tooltip
                              title={`${t(
                                'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.LESSON',
                              )} ${lessonIndex + 1}. ${lesson?.title || '-'}`}
                              arrow
                            >
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                noWrap
                                sx={{
                                  whiteSpace: { xs: 'unset', sm: 'nowrap' },
                                  width: {
                                    xs: '100%',
                                    sm: '300px',
                                  },
                                }}
                              >
                                {`${t(
                                  'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.LESSON',
                                )} ${lessonIndex + 1}. ${lesson?.title || '-'}`}
                              </Typography>
                            </Tooltip>
                          </Box>
                          <ViewResource
                            isEdit={isEdit}
                            lessonDetail={{
                              ...lesson,
                              courseId: courseData._id,
                              isCourseBought: courseData.isCourseBought,
                            }}
                            handleOpenPremiumModal={handleOpenPremiumModal}
                          />

                          <Box
                            display="flex"
                            gap="12px"
                            alignItems="center"
                            justifyContent="end"
                            minWidth={90}
                            maxWidth={100}
                          >
                            <Typography
                              variant="body1"
                              noWrap
                              color="text.secondary"
                            >
                              {lesson?.durationInSeconds &&
                                handleFormatSeconds(lesson?.durationInSeconds)}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    ))}
                </Accordion>
              ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
          >
            <Box sx={{ position: 'sticky', bottom: '0' }}>
              <Typography
                component="p"
                component="p"
                mb={1}
                textAlign="start"
                sx={{ width: '100%' }}
              >
                {t(
                  'education:EDUCATION_DASHBOARD.COURSE_DETAILS.CONTENT_VIEW.PREVIEW_VIDEO',
                )}
              </Typography>
              <Box
                p={1}
                sx={{
                  background: (theme) => theme.palette.primary.light,
                  borderRadius: '10px',
                }}
              >
                <Box onClick={() => previewRef.current.openModal()}>
                  {renderPreview()}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      <ModalBox ref={previewRef} size="lg">
        {renderPreview()}
      </ModalBox>
    </Box>
  )
}

export default ContentView
