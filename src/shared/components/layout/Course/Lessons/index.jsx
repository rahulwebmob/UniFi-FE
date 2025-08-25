import {
  Box,
  Grid,
  Chip,
  Button,
  useTheme,
  Accordion,
  Container,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Lock,
  Video,
  Clock,
  FileText,
  BookOpen,
  PlayCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import {
  useGetChapterDetailsQuery,
  useGetParticularCourseQuery,
} from '../../../../../services/education'
import ApiResponseWrapper from '../../../api-middleware'
import CourseContent from '../content-preview'

const handleFormatSeconds = (seconds) => {
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

const Lessons = () => {
  const theme = useTheme()
  const { id } = useParams()
  const location = useLocation()
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)

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
      skip: !(selectedVideo?.courseId && selectedVideo?.chapterId && selectedVideo?.lessonId),
    },
  )

  useEffect(() => {
    const { chapterId, lessonId } = location.state ?? {}

    if (chapterId && lessonId && courseData?.data?.chapters) {
      const chapter = courseData.data.chapters.find((ch) => ch._id === chapterId)
      const lessonIndex = chapter?.lessonList?.findIndex((lesson) => lesson._id === lessonId) ?? -1

      if (lessonIndex !== -1) {
        setSelectedVideo({ courseId: id ?? '', chapterId, lessonId })
        setSelectedVideoIndex(
          courseData.data.chapters
            .flatMap((ch) => ch.lessonList || [])
            .filter((lesson) => lesson !== undefined)
            .findIndex((lesson) => lesson._id === lessonId),
        )
      }
    } else if (courseData?.data?.chapters?.length && courseData.data.chapters.length > 0) {
      const firstChapter = courseData.data.chapters[0]
      const firstLesson = firstChapter.lessonList?.[0]

      if (firstLesson && firstLesson._id && firstChapter._id) {
        setSelectedVideo({
          courseId: id ?? '',
          chapterId: firstChapter._id,
          lessonId: firstLesson._id,
        })
      }
      setSelectedVideoIndex(0)
    }
  }, [location.state, courseData, id])

  const handleLessonNavigation = (direction) => {
    if (!courseData?.data?.chapters) {
      return
    }

    const maxIndex =
      courseData.data.chapters
        .flatMap((ch) => ch.lessonList || [])
        .filter((lesson) => lesson !== undefined).length - 1
    let newIndex = selectedVideoIndex

    if (direction === 'next' && selectedVideoIndex < maxIndex) {
      newIndex = selectedVideoIndex + 1
    } else if (direction === 'previous' && selectedVideoIndex > 0) {
      newIndex = selectedVideoIndex - 1
    }

    const allLessons = courseData.data.chapters
      .flatMap((ch) => ch.lessonList || [])
      .filter((lesson) => lesson !== undefined)
    const newLesson = allLessons[newIndex]

    if (newLesson && newLesson._id) {
      setSelectedVideo({
        courseId: id ?? '',
        chapterId: newLesson.chapterId,
        lessonId: newLesson._id,
      })
      setSelectedVideoIndex(newIndex)
    }
  }

  const totalLessons =
    courseData?.data?.chapters
      ?.flatMap((ch) => ch.lessonList || [])
      .filter((lesson) => lesson !== undefined).length || 0

  const getCurrentLesson = () => {
    if (!courseData?.data?.chapters || !selectedVideo) {
      return null
    }
    const allLessons = courseData.data.chapters
      .flatMap((ch) => ch.lessonList || [])
      .filter((lesson) => lesson !== undefined)
    return allLessons[selectedVideoIndex] || null
  }

  const getCurrentChapter = () => {
    if (!courseData?.data?.chapters || !selectedVideo) {
      return null
    }
    return courseData.data.chapters.find((ch) => ch._id === selectedVideo.chapterId)
  }

  const currentLesson = getCurrentLesson()
  const currentChapter = getCurrentChapter()

  return (
    <ApiResponseWrapper error={error} isLoading={isLoading} isData={!!courseData?.data}>
      <Box
        sx={{
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Clean Header Section */}
          <Box
            sx={{
              p: 4,
              mb: 4,
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 2,
              }}
            >
              {courseData?.data?.title}
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              gap={3}
              flexWrap="wrap"
              sx={{
                pb: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box display="flex" alignItems="center" gap={0.5}>
                <BookOpen size={18} />
                <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                  {currentChapter?.title || 'Chapter'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={0.5}>
                <PlayCircle size={18} />
                <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                  Lesson {selectedVideoIndex + 1} of {totalLessons}
                </Typography>
              </Box>

              {typeof currentLesson?.durationInSeconds === 'number' && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Clock size={18} />
                  <Typography pl={1} variant="body2" fontStyle="italic" color="text.secondary">
                    {handleFormatSeconds(currentLesson.durationInSeconds)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Video Player Section */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                }}
              >
                {/* Current Lesson Title */}
                <Box
                  sx={{
                    p: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          currentLesson?.lessonType === 'video' ? 'primary.main' : 'warning.main',
                        color: 'white',
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
                        {currentLesson?.lessonType === 'video' ? 'Video Lesson' : 'Document'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Video/Content Container */}
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: '#000',
                    aspectRatio: '16/9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <CourseContent
                    url={data?.data?.url ?? ''}
                    type={data?.data?.contentType ?? ''}
                    key={data?.data?.url ?? ''}
                  />
                </Box>

                {/* Navigation Controls */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.grey[50],
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => handleLessonNavigation('previous')}
                      disabled={selectedVideoIndex === 0}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: { xs: '48px', sm: 'auto' },
                        px: { xs: 1, sm: 3 },
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ChevronLeft size={20} />
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Previous</Box>
                      </Box>
                    </Button>

                    <Box textAlign="center" flex={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                        }}
                      >
                        {selectedVideoIndex + 1} / {totalLessons} Lessons
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      onClick={() => handleLessonNavigation('next')}
                      disabled={selectedVideoIndex === totalLessons - 1}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: { xs: '48px', sm: 'auto' },
                        px: { xs: 1, sm: 3 },
                        py: 1.5,
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Next Lesson</Box>
                        <ChevronRight size={20} />
                      </Box>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Course Content Sidebar */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box
                sx={{
                  position: 'sticky',
                  top: 20,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  maxHeight: 'calc(100vh - 120px)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'primary.main',
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
                  {courseData?.data?.chapters?.map((chapter, chapterIndex) => (
                    <Accordion
                      key={chapter._id}
                      defaultExpanded
                      sx={{
                        mb: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
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
                                color: 'white',
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
                                {chapter?.lessonList?.length || 0}
                                <Box
                                  component="span"
                                  sx={{ display: { xs: 'none', sm: 'inline' } }}
                                >
                                  {' '}
                                  {chapter?.lessonList?.length === 1 ? 'lesson' : 'lessons'}
                                </Box>
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ p: 0 }}>
                        {chapter.lessonList?.map((lesson, lessonIndex) => {
                          const isSelected = lesson._id === selectedVideo?.lessonId
                          const isLocked = !lesson?.isFree && !courseData?.data?.isCourseBought

                          return (
                            <Box
                              key={lesson._id}
                              sx={{
                                px: { xs: 2, sm: 3 },
                                py: { xs: 2, sm: 2.5 },
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'stretch', sm: 'center' },
                                justifyContent: 'space-between',
                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                                backgroundColor: isSelected
                                  ? 'rgba(25, 118, 210, 0.08)'
                                  : 'transparent',
                                transition: 'background-color 0.2s ease',
                                gap: { xs: 1.5, sm: 2 },
                                opacity: isLocked ? 0.5 : 1,
                                '&:first-of-type': {
                                  borderTop: 'none',
                                },
                                '&:hover': {
                                  backgroundColor: isLocked
                                    ? 'transparent'
                                    : 'rgba(25, 118, 210, 0.02)',
                                },
                              }}
                              onClick={() => {
                                if (!isLocked) {
                                  setSelectedVideo({
                                    courseId: id ?? '',
                                    chapterId: chapter._id ?? '',
                                    lessonId: lesson._id ?? '',
                                  })
                                  setSelectedVideoIndex(
                                    courseData?.data?.chapters
                                      ?.flatMap((ch) => ch.lessonList || [])
                                      .filter((l) => l !== undefined)
                                      .findIndex((l) => l._id === lesson._id) ?? 0,
                                  )
                                }
                              }}
                            >
                              <Box display="flex" alignItems="center" gap={1.5} flex={1}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: isSelected ? 600 : 500,
                                    color: isSelected ? 'primary.main' : 'text.primary',
                                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: { xs: 'normal', sm: 'normal' },
                                  }}
                                >
                                  {lessonIndex + 1}. {lesson?.title || '-'}
                                </Typography>
                                {isLocked && (
                                  <Lock size={14} color={theme.palette.text.secondary} />
                                )}
                              </Box>

                              <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                sx={{
                                  justifyContent: { xs: 'space-between', sm: 'flex-end' },
                                }}
                              >
                                {lesson?.lessonType && (
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    {lesson.lessonType === 'video' ? (
                                      <Video size={14} />
                                    ) : (
                                      <FileText size={14} />
                                    )}
                                    <Typography
                                      variant="caption"
                                      fontStyle="italic"
                                      color="text.secondary"
                                      sx={{ fontSize: '0.75rem' }}
                                    >
                                      {lesson.lessonType === 'video' ? 'Video' : 'Document'}
                                    </Typography>
                                  </Box>
                                )}
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
                                      sx={{ fontSize: '0.75rem' }}
                                    >
                                      {handleFormatSeconds(lesson.durationInSeconds)}
                                    </Typography>
                                  </Box>
                                )}
                                {lesson?.isFree === true && !courseData?.data?.isCourseBought && (
                                  <Chip
                                    label="Free"
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.7rem',
                                      backgroundColor: 'success.light',
                                      color: 'success.main',
                                      '& .MuiChip-label': {
                                        px: 1,
                                      },
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                          )
                        })}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ApiResponseWrapper>
  )
}

export default Lessons
