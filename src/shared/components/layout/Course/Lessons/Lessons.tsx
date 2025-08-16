import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Video, FileText, ChevronDown } from 'lucide-react'

import {
  Box,
  Grid,
  Button,
  useTheme,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'

// import { handleFormatSeconds } from '../../../../../roles/educator-user/components/common/common'
import ContentPreview from '../content-preview'
import ApiResponseWrapper from '../../../api-middleware'
import {
  useGetChapterDetailsQuery,
  useGetParticularCourseQuery,
} from '../../../../../Services/education'

const handleFormatSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours}:${minutes}:${remainingSeconds}`
}

const Lessons = () => {
  const theme = useTheme()
  const { id } = useParams()
  const location = useLocation()
  const { t } = useTranslation('education')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)

  const {
    data: courseData,
    isLoading,
    error,
  } = useGetParticularCourseQuery({ courseId: id }, { skip: !id })

  const { data } = useGetChapterDetailsQuery(
    {
      courseId: selectedVideo?.courseId,
      chapterId: selectedVideo?.chapterId,
      lessonId: selectedVideo?.lessonId,
    },
    {
      skip: !(
        selectedVideo?.courseId &&
        selectedVideo?.chapterId &&
        selectedVideo?.lessonId
      ),
    },
  )

  useEffect(() => {
    const { chapterId, lessonId } = location.state || {}

    if (chapterId && lessonId && courseData?.data?.chapters) {
      const chapter = courseData.data.chapters.find(
        (ch) => ch._id === chapterId,
      )
      const lessonIndex = chapter?.lessonList?.findIndex(
        (lesson) => lesson._id === lessonId,
      )

      if (lessonIndex !== -1) {
        setSelectedVideo({ courseId: id, chapterId, lessonId })
        setSelectedVideoIndex(
          courseData.data.chapters
            .flatMap((ch) => ch.lessonList)
            .findIndex((lesson) => lesson._id === lessonId),
        )
      }
    } else if (courseData?.data?.chapters?.length > 0) {
      const firstChapter = courseData.data.chapters[0]
      const firstLesson = firstChapter.lessonList[0]

      setSelectedVideo({
        courseId: id,
        chapterId: firstChapter._id,
        lessonId: firstLesson._id,
      })
      setSelectedVideoIndex(0)
    }
  }, [location.state, courseData, id])

  const handleLessonNavigation = (direction) => {
    const maxIndex =
      courseData.data.chapters.flatMap((ch) => ch.lessonList).length - 1
    let newIndex = selectedVideoIndex

    if (direction === 'next' && selectedVideoIndex < maxIndex) {
      newIndex = selectedVideoIndex + 1
    } else if (direction === 'previous' && selectedVideoIndex > 0) {
      newIndex = selectedVideoIndex - 1
    }

    const newLesson = courseData.data.chapters.flatMap((ch) => ch.lessonList)[
      newIndex
    ]

    setSelectedVideo({
      courseId: id,
      chapterId: newLesson.chapterId,
      lessonId: newLesson._id,
    })
    setSelectedVideoIndex(newIndex)
  }

  return (
    <ApiResponseWrapper
      error={error}
      isLoading={isLoading}
      isData={!!courseData?.data}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" mb={2}>
          <Typography className="bookmap" variant="h2">
            {courseData?.data?.title} {selectedVideoIndex?._id}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 8, xl: 8 }}>
            <Box width="100%">
              <ContentPreview
                url={data?.data?.url}
                type={data?.data?.contentType}
                key={data?.data?.url}
              />
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleLessonNavigation('previous')}
                disabled={selectedVideoIndex === 0}
              >
                {t('EDUCATION_DASHBOARD.COURSE_DETAILS.LESSONS.PREVIOUS')}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleLessonNavigation('next')}
                disabled={
                  selectedVideoIndex ===
                  courseData?.data?.chapters?.flatMap((ch) => ch.lessonList)
                    .length -
                    1
                }
              >
                {t('EDUCATION_DASHBOARD.COURSE_DETAILS.LESSONS.NEXT')}
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 4, xl: 4 }}>
            <Box
              sx={{
                background: theme.palette.primary.darker,
                height: 'calc(100vh - 200px)',
                overflow: 'auto',
                borderRadius: '12px',
              }}
            >
              <Box
                sx={{
                  '& .MuiPaper-root': {
                    background: 'none',
                    border: `1px solid ${theme.palette.primary[100]}`,
                  },
                  '& .MuiAccordion-root ': {
                    '& .Mui-expanded': {
                      margin: '10px 0',
                    },
                  },
                  '& .MuiAccordionDetails-root': {
                    padding: '0px 12px 8px',
                  },
                }}
              >
                {courseData?.data?.chapters?.map((chapter, chapterIndex) => (
                  <Accordion key={chapter._id} defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ChevronDown />}
                      aria-controls={`panel-${chapterIndex}-content`}
                      id={`panel-${chapterIndex}-header`}
                    >
                      <Typography variant="body1" component="p">
                        {t(
                          'EDUCATION_DASHBOARD.COURSE_DETAILS.LESSONS.CHAPTER',
                        )}{' '}
                        {chapterIndex + 1}: {chapter.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {chapter.lessonList?.map((lesson, lessonIndex) => (
                        <Box
                          key={lesson._id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          gap="12px"
                          flexWrap="wrap"
                          sx={{
                            p: 1,
                            borderRadius: '8px',
                            backgroundColor:
                              lesson._id === selectedVideo?.lessonId
                                ? 'primary.light100'
                                : 'inherit',
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap="12px"
                            width="100%"
                            sx={{
                              cursor:
                                lesson?.isFree ||
                                courseData?.data?.isCourseBought
                                  ? 'pointer'
                                  : 'not-allowed',
                            }}
                            onClick={() => {
                              if (
                                lesson?.isFree ||
                                courseData?.data?.isCourseBought
                              ) {
                                setSelectedVideo({
                                  courseId: id,
                                  chapterId: chapter?._id,
                                  lessonId: lesson?._id,
                                })
                                setSelectedVideoIndex(
                                  courseData?.data?.chapters
                                    .flatMap((ch) => ch.lessonList)
                                    .findIndex((l) => l._id === lesson._id),
                                )
                              }
                            }}
                          >
                            <Typography variant="body2">
                              {lessonIndex < 9 && '0'}
                              {lessonIndex + 1}
                            </Typography>
                            {lesson?.lessonType === 'video' ? (
                              <Video size={20} />
                            ) : (
                              <FileText size={20} />
                            )}
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              width="100%"
                              flexWrap="wrap"
                              gap="12px"
                            >
                              <Typography
                                variant="body1"
                                color="secondary.main"
                              >
                                {lesson?.title}
                              </Typography>
                              {lesson?.durationInSeconds && (
                                <Typography color="secondary.main">
                                  {handleFormatSeconds(
                                    lesson?.durationInSeconds,
                                  )}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ApiResponseWrapper>
  )
}

export default Lessons
