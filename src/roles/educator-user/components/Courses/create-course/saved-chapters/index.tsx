import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Button,
  TextField,
  Accordion,
  Typography,
  IconButton,
  AccordionDetails,
  AccordionSummary,
  useTheme,
} from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { GripVertical, ChevronDown, ChevronUp, Edit, Plus } from 'lucide-react'
import {
  useListChapersQuery,
  useSortLessonMutation,
  useUpdateLessonMutation,
  useSortChaptersMutation,
  useUpdateChapterMutation,
  useGetLessonsDetailsQuery,
} from '../../../../../../services/admin'
import { useTranslation } from 'react-i18next'
import DeleteModal from '../chapter/delete-modal'
import AddLessonsModal from '../chapter/add-lessons-modal'
import ViewResource from '../view-resource'

interface Chapter {
  _id: string
  title: string
  [key: string]: unknown
}

interface Lesson {
  _id: string
  title: string
  file?: string
  isFree?: boolean
  [key: string]: unknown
}

interface SavedChaptersProps {
  courseId?: string
}

interface LessonsListProps {
  courseId: string
  chapterId: string
}

interface FormContextType {
  setHasLessons?: (value: React.SetStateAction<Record<string, number>>) => void
  [key: string]: unknown
}

const SavedChapters: React.FC<SavedChaptersProps> = ({ courseId }) => {
  const { t } = useTranslation('education')
  const theme = useTheme()
  const { setHasLessons } = useFormContext<FormContextType>()

  const [chapters, setChapters] = useState<Chapter[]>([])
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [isEditingChapter, setIsEditingChapter] = useState<string | null>(null)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({})

  const [sortChapters] = useSortChaptersMutation()
  const [updateChapter] = useUpdateChapterMutation()

  const { data, isFetching } = useListChapersQuery(
    { courseId: courseId || '' },
    {
      skip: !courseId,
    },
  )

  useEffect(() => {
    if (data?.data?.chapters) {
      const initialExpanded: Record<string, boolean> = {}
      data.data.chapters.forEach((chap: Chapter) => {
        initialExpanded[chap._id] = true
      })
      setExpandedChapters(initialExpanded)
      setChapters(data.data.chapters)
    }
  }, [data, isFetching])

  const handleToggleAccordion = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }))
  }

  const handleUpdateChapter = async (chapterId: string, title: string, isDeleted = false) => {
    if (isDeleted && setHasLessons) {
      setHasLessons((prev) => {
        const { [chapterId]: _, ...rest } = prev
        return rest
      })
    }
    const payload = {
      courseId: courseId || '',
      chapterId,
      title,
      ...(isDeleted && { isDeleted }),
    }
    const response = await updateChapter(payload)
    if (!('error' in response)) {
      setIsEditingChapter(null)
    }
  }

  const handleMoveChapter = async (index: number, direction: 'up' | 'down') => {
    const newChapters = [...chapters]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= chapters.length) return
    
    const [movedChapter] = newChapters.splice(index, 1)
    newChapters.splice(targetIndex, 0, movedChapter)
    setChapters(newChapters)
    
    // Sort on backend
    const firstChapter = chapters[index]
    const secondChapter = chapters[targetIndex]
    
    if (firstChapter?._id && secondChapter?._id) {
      await sortChapters({
        firstDocId: firstChapter._id,
        secondDocId: secondChapter._id,
      })
    }
  }

  return (
    <Box>
      {!!chapters.length && (
        <>
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 600,
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              color: theme.palette.text.primary,
            }}
          >
            {t('EDUCATOR.SAVED_CHAPTERS.SAVED_CHAPTERS_TITLE')}
          </Typography>
          <Box
            sx={{
              background: theme.palette.background.paper,
              borderRadius: { xs: 2, md: 3 },
              p: { xs: 2, sm: 2.5, md: 3 },
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            {chapters.map((chap, index) => (
              <Box key={chap._id} sx={{ mb: { xs: 1.5, md: 2 } }}>
                <Accordion
                  expanded={!!expandedChapters[chap._id]}
                  sx={{
                    background: theme.palette.background.default,
                    borderRadius: '8px !important',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[2],
                    },
                    '&:before': {
                      display: 'none',
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: { xs: '8px 0', md: '12px 0' },
                    },
                  }}
                >
                  <AccordionSummary
                    aria-controls={`panel-${chap._id}-content`}
                    id={`panel-${chap._id}-header`}
                    sx={{
                      background: theme.palette.background.paper,
                      borderRadius: '8px',
                      minHeight: { xs: 48, md: 56 },
                      px: { xs: 1.5, md: 2 },
                      '&.Mui-expanded': {
                        minHeight: { xs: 48, md: 56 },
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                      gap={2}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleAccordion(chap._id)
                          }}
                          sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          {expandedChapters[chap._id] ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </IconButton>
                        
                        <Box display="flex" flexDirection="column">
                          <IconButton
                            size="small"
                            disabled={index === 0}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveChapter(index, 'up')
                            }}
                            sx={{ padding: 0.5 }}
                          >
                            <ChevronUp size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            disabled={index === chapters.length - 1}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveChapter(index, 'down')
                            }}
                            sx={{ padding: 0.5 }}
                          >
                            <ChevronDown size={16} />
                          </IconButton>
                        </Box>

                        {isEditingChapter === chap._id ? (
                          <TextField
                            size="small"
                            value={newChapterTitle}
                            onChange={(e) => setNewChapterTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              '& .MuiInputBase-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                        ) : (
                          <Typography 
                            variant="body1" 
                            sx={{
                              fontWeight: 500,
                              fontSize: { xs: '0.875rem', md: '1rem' },
                            }}
                          >
                            {t('EDUCATOR.SAVED_CHAPTERS.CHAPTER_NAME', {
                              number: index + 1,
                              title: chap.title,
                            })}
                          </Typography>
                        )}
                      </Box>
                      
                      <Box display="flex" gap={1} alignItems="center">
                        {isEditingChapter === chap._id && (
                          <Button
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateChapter(chap._id, newChapterTitle)
                            }}
                            size="small"
                            sx={{
                              textTransform: 'none',
                              minWidth: 80,
                            }}
                          >
                            {t('EDUCATOR.SAVED_CHAPTERS.UPDATE')}
                          </Button>
                        )}
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsEditingChapter((prev) =>
                              prev === chap._id ? null : chap._id,
                            )
                            setNewChapterTitle(chap.title)
                          }}
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <Edit size={18} />
                        </IconButton>
                        <DeleteModal
                          handleDelete={() =>
                            handleUpdateChapter(chap._id, chap?.title, true)
                          }
                          message="chapter"
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      background: theme.palette.background.default,
                      borderTop: `1px solid ${theme.palette.divider}`,
                      p: { xs: 1.5, md: 2 },
                    }}
                  >
                    <LessonsList chapterId={chap._id} courseId={courseId || ''} />
                  </AccordionDetails>
                </Accordion>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}

const LessonsList: React.FC<LessonsListProps> = ({ courseId, chapterId }) => {
  const { t } = useTranslation('education')
  const theme = useTheme()
  const [lessons, setLessons] = useState<Lesson[]>([])

  const { setHasLessons } = useFormContext<FormContextType>()

  const [sortLesson] = useSortLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()

  const { data, isFetching } = useGetLessonsDetailsQuery({
    courseId,
    chapterId,
  })

  useEffect(() => {
    if (data?.data) {
      setLessons(data.data)
      if (setHasLessons) {
        setHasLessons((prev) => ({
          ...prev,
          [chapterId]: data.data.length,
        }))
      }
    }
  }, [data, isFetching, chapterId, setHasLessons])

  const handleMoveLesson = async (index: number, direction: 'up' | 'down') => {
    const newLessons = [...lessons]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= lessons.length) return
    
    const [movedLesson] = newLessons.splice(index, 1)
    newLessons.splice(targetIndex, 0, movedLesson)
    setLessons(newLessons)
    
    // Sort on backend
    const firstLesson = lessons[index]
    const secondLesson = lessons[targetIndex]
    
    if (firstLesson?._id && secondLesson?._id) {
      await sortLesson({
        firstDocId: firstLesson._id,
        secondDocId: secondLesson._id,
      })
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (setHasLessons) {
      setHasLessons((prevCounts) => ({
        ...prevCounts,
        [chapterId]: prevCounts[chapterId] - 1,
      }))
    }
    await updateLesson({
      courseId,
      chapterId,
      lessonId,
      isDeleted: true,
    })
  }

  return (
    <Box>
      {!!lessons.length &&
        lessons.map((lessonDetail, index) => (
          <Box
            key={lessonDetail._id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              borderBottom: index < lessons.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
              py: { xs: 1, md: 1.5 },
              px: { xs: 0.5, md: 1 },
              borderRadius: 1,
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box display="flex" flexDirection="column">
                <IconButton
                  size="small"
                  disabled={index === 0}
                  onClick={() => handleMoveLesson(index, 'up')}
                  sx={{ padding: 0.5 }}
                >
                  <ChevronUp size={14} />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === lessons.length - 1}
                  onClick={() => handleMoveLesson(index, 'down')}
                  sx={{ padding: 0.5 }}
                >
                  <ChevronDown size={14} />
                </IconButton>
              </Box>
              <Typography 
                variant="body2" 
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '0.813rem', md: '0.875rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: { xs: '150px', sm: '250px', md: '350px' },
                }}
              >
                {t('EDUCATOR.SAVED_CHAPTERS.LESSON_NAME', {
                  number: index + 1,
                  title: lessonDetail.title,
                })}
              </Typography>
            </Box>
            
            <Box display="flex" gap={1} alignItems="center">
              <ViewResource 
                lessonDetail={{ ...lessonDetail, courseId }} 
                isEdit
              />
              <AddLessonsModal
                isEdit
                chapterId={chapterId}
                courseId={courseId}
                defaultValues={{
                  lessonTitle: lessonDetail.title,
                  resource: lessonDetail.file || '',
                  isFree: lessonDetail.isFree,
                }}
                lessonId={lessonDetail._id}
              />
              <DeleteModal
                handleDelete={() => handleDeleteLesson(lessonDetail._id)}
                message="lesson"
              />
            </Box>
          </Box>
        ))}
      
      <Box mt={2}>
        <AddLessonsModal
          isEdit={false}
          chapterId={chapterId}
          courseId={courseId}
        />
      </Box>
    </Box>
  )
}

export default SavedChapters