import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

import ContentPreview from '../content-preview'
import ApiResponseWrapper from '../../../api-middleware'
import { useGetChapterDetailsQuery, useGetParticularCourseQuery } from '../../../../../Services/education'

interface Lesson {
  _id: string
  title: string
  chapterId: string
  lessonType?: string
  isFree?: boolean
  durationInSeconds?: number
}

interface Chapter {
  _id: string
  title: string
  lessonList: Lesson[]
}

interface CourseData {
  _id: string
  title: string
  chapters: Chapter[]
  isCourseBought?: boolean
}

interface SelectedVideo {
  courseId: string
  chapterId: string
  lessonId: string
}

interface LocationState {
  chapterId?: string
  lessonId?: string
}

const handleFormatSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours}:${minutes}:${remainingSeconds}`
}

const Lessons: React.FC = () => {
  const theme = useTheme()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { t } = useTranslation('education')
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0)

  const {
    data: courseData,
    isLoading,
    error,
  } = useGetParticularCourseQuery({ courseId: id ?? '' }, { skip: !id })

  const { data } = useGetChapterDetailsQuery(
    {
      courseId: selectedVideo?.courseId ?? '',
      chapterId: selectedVideo?.chapterId ?? '',
      lessonId: selectedVideo?.lessonId ?? '',
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
    const { chapterId, lessonId } = (location.state as LocationState) ?? {}

    if (chapterId && lessonId && courseData?.data?.chapters) {
      const chapter = courseData.data.chapters.find(
        (ch: Chapter) => ch._id === chapterId,
      )
      const lessonIndex = chapter?.lessonList?.findIndex(
        (lesson: Lesson) => lesson._id === lessonId,
      )

      if (lessonIndex !== -1) {
        setSelectedVideo({ courseId: id ?? '', chapterId, lessonId })
        setSelectedVideoIndex(
          courseData.data.chapters
            .flatMap((ch: Chapter) => ch.lessonList)
            .findIndex((lesson: Lesson) => lesson._id === lessonId),
        )
      }
    } else if (courseData?.data?.chapters?.length > 0) {
      const firstChapter = courseData.data.chapters[0]
      const firstLesson = firstChapter.lessonList[0]

      setSelectedVideo({
        courseId: id ?? '',
        chapterId: firstChapter._id,
        lessonId: firstLesson._id,
      })
      setSelectedVideoIndex(0)
    }
  }, [location.state, courseData, id])

  const handleLessonNavigation = (direction: 'next' | 'previous') => {
    if (!courseData?.data?.chapters) return

    const maxIndex =
      courseData.data.chapters.flatMap((ch: Chapter) => ch.lessonList).length - 1
    let newIndex = selectedVideoIndex

    if (direction === 'next' && selectedVideoIndex < maxIndex) {
      newIndex = selectedVideoIndex + 1
    } else if (direction === 'previous' && selectedVideoIndex > 0) {
      newIndex = selectedVideoIndex - 1
    }

    const allLessons = courseData.data.chapters.flatMap((ch: Chapter) => ch.lessonList)
    const newLesson = allLessons[newIndex]

    if (newLesson) {
      setSelectedVideo({
        courseId: id ?? '',
        chapterId: newLesson.chapterId,
        lessonId: newLesson._id,
      })
      setSelectedVideoIndex(newIndex)
    }
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
            {courseData?.data?.title} {selectedVideoIndex}
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
                  (courseData?.data?.chapters?.flatMap((ch: Chapter) => ch.lessonList)
                    .length ?? 0) - 1
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
                {courseData?.data?.chapters?.map((chapter: Chapter, chapterIndex: number) => (
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
                      {chapter.lessonList?.map((lesson: Lesson, lessonIndex: number) => (
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
                                  courseId: id ?? '',
                                  chapterId: chapter._id,
                                  lessonId: lesson._id,
                                })
                                setSelectedVideoIndex(
                                  courseData?.data?.chapters
                                    ?.flatMap((ch: Chapter) => ch.lessonList)
                                    .findIndex((l: Lesson) => l._id === lesson._id) ?? 0,
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
                                    lesson.durationInSeconds,
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
