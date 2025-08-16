import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import {
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Clock,
  BookOpen,
  PlayCircle,
  Lock,
} from 'lucide-react'

import {
  Box,
  Grid,
  Chip,
  Button,
  useTheme,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
  alpha,
  Container,
  Paper,
} from '@mui/material'

import ContentPreview from '../content-preview'
import ApiResponseWrapper from '../../../api-middleware'
import {
  useGetChapterDetailsQuery,
  useGetParticularCourseQuery,
} from '../../../../../Services/education'

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

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

const Lessons: React.FC = () => {
  const theme = useTheme()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
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
      courseData.data.chapters.flatMap((ch: Chapter) => ch.lessonList).length -
      1
    let newIndex = selectedVideoIndex

    if (direction === 'next' && selectedVideoIndex < maxIndex) {
      newIndex = selectedVideoIndex + 1
    } else if (direction === 'previous' && selectedVideoIndex > 0) {
      newIndex = selectedVideoIndex - 1
    }

    const allLessons = courseData.data.chapters.flatMap(
      (ch: Chapter) => ch.lessonList,
    )
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

  const totalLessons =
    courseData?.data?.chapters?.flatMap((ch: Chapter) => ch.lessonList)
      .length || 0

  const getCurrentLesson = () => {
    if (!courseData?.data?.chapters || !selectedVideo) return null
    const allLessons = courseData.data.chapters.flatMap(
      (ch: Chapter) => ch.lessonList,
    )
    return allLessons[selectedVideoIndex]
  }

  const getCurrentChapter = () => {
    if (!courseData?.data?.chapters || !selectedVideo) return null
    return courseData.data.chapters.find(
      (ch: Chapter) => ch._id === selectedVideo.chapterId,
    )
  }

  const currentLesson = getCurrentLesson()
  const currentChapter = getCurrentChapter()

  return (
    <ApiResponseWrapper
      error={error}
      isLoading={isLoading}
      isData={!!courseData?.data}
    >
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Header Section */}
          <Box
            sx={{
              mb: 3,
              p: 3,
              background: 'white',
              borderRadius: 3,
              boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                {courseData?.data?.title}
              </Typography>

              <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={1}>
                  <BookOpen size={18} color={theme.palette.text.secondary} />
                  <Typography variant="body2" color="text.secondary">
                    {currentChapter?.title || 'Chapter'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <PlayCircle size={18} color={theme.palette.text.secondary} />
                  <Typography variant="body2" color="text.secondary">
                    Lesson {selectedVideoIndex + 1} of {totalLessons}
                  </Typography>
                </Box>

                {currentLesson?.durationInSeconds && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Clock size={18} color={theme.palette.text.secondary} />
                    <Typography variant="body2" color="text.secondary">
                      {handleFormatSeconds(currentLesson.durationInSeconds)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Video Player Section */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                {/* Current Lesson Title */}
                <Box
                  sx={{
                    p: 2.5,
                    background: alpha(theme.palette.primary.main, 0.03),
                    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          currentLesson?.lessonType === 'video'
                            ? alpha(theme.palette.info.main, 0.1)
                            : alpha(theme.palette.warning.main, 0.1),
                        color:
                          currentLesson?.lessonType === 'video'
                            ? theme.palette.info.main
                            : theme.palette.warning.main,
                      }}
                    >
                      {currentLesson?.lessonType === 'video' ? (
                        <Video size={20} />
                      ) : (
                        <FileText size={20} />
                      )}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {currentLesson?.title || 'Loading...'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {currentLesson?.lessonType === 'video'
                          ? 'Video Lesson'
                          : 'Document'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Video/Content Container */}
                <Box
                  sx={{
                    width: '100%',
                    background: theme.palette.grey[900],
                    aspectRatio: '16/9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <ContentPreview
                    url={data?.data?.url}
                    type={data?.data?.contentType}
                    key={data?.data?.url}
                  />
                </Box>

                {/* Navigation Controls */}
                <Box
                  sx={{
                    p: 3,
                    background: alpha(theme.palette.grey[50], 0.5),
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Button
                        variant="outlined"
                        size="large"
                        fullWidth
                        startIcon={<ChevronLeft size={20} />}
                        onClick={() => handleLessonNavigation('previous')}
                        disabled={selectedVideoIndex === 0}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                          color: theme.palette.primary.main,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            background: alpha(theme.palette.primary.main, 0.04),
                          },
                          '&.Mui-disabled': {
                            opacity: 0.5,
                          },
                        }}
                      >
                        Previous
                      </Button>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box textAlign="center">
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 600,
                          }}
                        >
                          {selectedVideoIndex + 1} / {totalLessons} Lessons
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        endIcon={<ChevronRight size={20} />}
                        onClick={() => handleLessonNavigation('next')}
                        disabled={selectedVideoIndex === totalLessons - 1}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          boxShadow: 'none',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                          },
                          '&.Mui-disabled': {
                            opacity: 0.5,
                          },
                        }}
                      >
                        Next Lesson
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Course Content Sidebar */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  position: 'sticky',
                  top: 20,
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                  maxHeight: 'calc(100vh - 120px)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: 'white',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Course Content
                  </Typography>
                  <Box display="flex" gap={3}>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {courseData?.data?.chapters?.length || 0} Chapters
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {totalLessons} Lessons
                    </Typography>
                  </Box>
                </Box>

                {/* Chapters List */}
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: theme.palette.grey[100],
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: theme.palette.grey[400],
                      borderRadius: '3px',
                      '&:hover': {
                        background: theme.palette.grey[500],
                      },
                    },
                  }}
                >
                  {courseData?.data?.chapters?.map(
                    (chapter: Chapter, chapterIndex: number) => (
                      <Accordion
                        key={chapter._id}
                        defaultExpanded={
                          chapter._id === selectedVideo?.chapterId
                        }
                        sx={{
                          background: 'white',
                          boxShadow: 'none',
                          '&:before': {
                            display: 'none',
                          },
                          '& .MuiAccordionSummary-root': {
                            minHeight: 60,
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ChevronDown size={20} />}
                          sx={{
                            background: alpha(theme.palette.primary.main, 0.04),
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                            '&:hover': {
                              background: alpha(
                                theme.palette.primary.main,
                                0.06,
                              ),
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
                            alignItems="center"
                            gap={2}
                            width="100%"
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: alpha(
                                  theme.palette.primary.main,
                                  0.1,
                                ),
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                fontSize: '0.875rem',
                              }}
                            >
                              {chapterIndex + 1}
                            </Box>
                            <Box flex={1}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                {chapter.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {chapter.lessonList?.length || 0} Lessons
                              </Typography>
                            </Box>
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 0 }}>
                          {chapter.lessonList?.map(
                            (lesson: Lesson, lessonIndex: number) => {
                              const isSelected =
                                lesson._id === selectedVideo?.lessonId
                              const isLocked =
                                !lesson?.isFree &&
                                !courseData?.data?.isCourseBought

                              return (
                                <Box
                                  key={lesson._id}
                                  sx={{
                                    px: 2,
                                    py: 1.5,
                                    cursor: isLocked
                                      ? 'not-allowed'
                                      : 'pointer',
                                    borderLeft: isSelected
                                      ? `3px solid ${theme.palette.primary.main}`
                                      : '3px solid transparent',
                                    background: isSelected
                                      ? alpha(theme.palette.primary.main, 0.08)
                                      : 'white',
                                    transition: 'all 0.2s',
                                    opacity: isLocked ? 0.5 : 1,
                                    '&:hover': {
                                      background: isLocked
                                        ? 'white'
                                        : isSelected
                                          ? alpha(
                                              theme.palette.primary.main,
                                              0.1,
                                            )
                                          : alpha(
                                              theme.palette.primary.main,
                                              0.04,
                                            ),
                                    },
                                    borderBottom:
                                      lessonIndex <
                                      chapter.lessonList.length - 1
                                        ? `1px solid ${alpha(theme.palette.grey[200], 0.5)}`
                                        : 'none',
                                  }}
                                  onClick={() => {
                                    if (!isLocked) {
                                      setSelectedVideo({
                                        courseId: id ?? '',
                                        chapterId: chapter._id,
                                        lessonId: lesson._id,
                                      })
                                      setSelectedVideoIndex(
                                        courseData?.data?.chapters
                                          ?.flatMap(
                                            (ch: Chapter) => ch.lessonList,
                                          )
                                          .findIndex(
                                            (l: Lesson) => l._id === lesson._id,
                                          ) ?? 0,
                                      )
                                    }
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1.5}
                                  >
                                    <Box
                                      sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: isSelected
                                          ? theme.palette.primary.main
                                          : lesson?.lessonType === 'video'
                                            ? alpha(
                                                theme.palette.info.main,
                                                0.1,
                                              )
                                            : alpha(
                                                theme.palette.warning.main,
                                                0.1,
                                              ),
                                        color: isSelected
                                          ? 'white'
                                          : lesson?.lessonType === 'video'
                                            ? theme.palette.info.main
                                            : theme.palette.warning.main,
                                        transition: 'all 0.2s',
                                      }}
                                    >
                                      {isLocked ? (
                                        <Lock size={16} />
                                      ) : lesson?.lessonType === 'video' ? (
                                        <Video size={16} />
                                      ) : (
                                        <FileText size={16} />
                                      )}
                                    </Box>

                                    <Box flex={1}>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: isSelected ? 600 : 500,
                                          color: isSelected
                                            ? theme.palette.primary.main
                                            : theme.palette.text.primary,
                                          mb: 0.5,
                                        }}
                                      >
                                        {lesson?.title}
                                      </Typography>
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                      >
                                        {lesson?.durationInSeconds && (
                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={0.5}
                                          >
                                            <Clock
                                              size={12}
                                              color={
                                                theme.palette.text.secondary
                                              }
                                            />
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                            >
                                              {handleFormatSeconds(
                                                lesson.durationInSeconds,
                                              )}
                                            </Typography>
                                          </Box>
                                        )}
                                        {lesson?.isFree &&
                                          !courseData?.data?.isCourseBought && (
                                            <Chip
                                              label="Free"
                                              size="small"
                                              sx={{
                                                height: 16,
                                                fontSize: '0.65rem',
                                                background: alpha(
                                                  theme.palette.success.main,
                                                  0.1,
                                                ),
                                                color:
                                                  theme.palette.success.main,
                                                '& .MuiChip-label': {
                                                  px: 1,
                                                },
                                              }}
                                            />
                                          )}
                                      </Box>
                                    </Box>

                                    {isSelected && (
                                      <PlayCircle
                                        size={18}
                                        color={theme.palette.primary.main}
                                      />
                                    )}
                                  </Box>
                                </Box>
                              )
                            },
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ),
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ApiResponseWrapper>
  )
}

export default Lessons
