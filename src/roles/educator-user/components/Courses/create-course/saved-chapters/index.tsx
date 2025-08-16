import Draggable from 'react-draggable'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import React, { useState, useEffect } from 'react'
import { Edit2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'

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
} from '@mui/material'

import ViewResource from '../view-resource'
import DeleteModal from '../chapter/delete-modal'
import AddLessonsModal from '../chapter/add-lessons-modal'
import {
  useListChapersQuery,
  useSortLessonMutation,
  useUpdateLessonMutation,
  useSortChaptersMutation,
  useUpdateChapterMutation,
  useGetLessonsDetailsQuery,
} from '../../../../../../services/admin'

const SavedChapters = ({ courseId }) => {
  const { t } = useTranslation('education')
  const { setHasLessons } = useFormContext()

  const [chapters, setChapters] = useState([])
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [isEditingChapter, setIsEditingChapter] = useState('')
  const [expandedChapters, setExpandedChapters] = useState({})

  const [sortChapters] = useSortChaptersMutation()
  const [updateChapter] = useUpdateChapterMutation()

  const { data, isFetching } = useListChapersQuery(
    { courseId },
    {
      skip: !courseId,
    },
  )

  useEffect(() => {
    if (data?.data?.chapters) {
      const initialExpanded = {}
      data?.data?.chapters?.forEach((chap) => {
        initialExpanded[chap._id] = true
      })
      setExpandedChapters(initialExpanded)
      setChapters(data.data.chapters)
    }
  }, [data, isFetching])

  const handleToggleAccordion = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }))
  }

  const handleUpdateChapter = async (chapterId, title, isDeleted = false) => {
    if (isDeleted)
      setHasLessons((prev) => {
        const copy = { ...prev }
        delete copy[chapterId]
        const rest = copy
        return rest
      })
    const payload = {
      courseId,
      chapterId,
      title,
      ...(isDeleted && { isDeleted }),
    }
    const response = await updateChapter(payload)
    if (!response.error) {
      setIsEditingChapter(null)
    }
  }

  const handleChapterDragStop = async (_, newData, draggedIndex) => {
    const newChapters = [...chapters]
    const draggedChapter = newChapters[draggedIndex]

    if (!draggedChapter) {
      return
    }
    newChapters.splice(draggedIndex, 1)

    const dropIndex = Math.max(
      0,
      Math.min(Math.round(newData.y / 70), newChapters.length),
    )

    newChapters.splice(dropIndex, 0, draggedChapter)

    setChapters(newChapters)

    const replacedChapterIndex = dropIndex + (dropIndex > draggedIndex ? -1 : 1)
    const replacedChapter = newChapters[replacedChapterIndex]

    if (draggedChapter?._id && replacedChapter?._id) {
      await sortChapters({
        firstDocId: draggedChapter._id,
        secondDocId: replacedChapter._id,
      })
    }
  }

  return (
    <Box>
      {!!chapters.length && (
        <>
          <Typography variant="h6">
            {t('EDUCATOR.SAVED_CHAPTERS.SAVED_CHAPTERS_TITLE')}
          </Typography>
          <Box
            sx={{
              background: (theme) => theme.palette.primary.light,
              borderRadius: '8px',
              padding: '10px',
            }}
          >
            {chapters.map((chap, index) => (
              <Draggable
                key={chap._id}
                axis="y"
                position={{ x: 0, y: 0 }}
                onStop={(e, d) => handleChapterDragStop(e, d, index)}
                handle=".drag-chapter"
              >
                <Box sx={{ mb: 1 }}>
                  <Accordion
                    expanded={!!expandedChapters[chap._id]}
                    key={chap._id}
                    sx={{
                      background: (theme) => theme.palette.primary.light,
                      borderRadius: '8px',
                      '& .MuiAccordionSummary-content': {
                        margin: '6px 0',
                      },
                    }}
                  >
                    <AccordionSummary
                      aria-controls={`panel-${chap._id}-content`}
                      id={`panel-${chap._id}-header`}
                      sx={{
                        background: (theme) => theme.palette.primary[100],
                        borderRadius: '4px',
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                        gap="20px"
                      >
                        <Box display="flex" alignItems="center" gap="10px">
                          <IconButton
                            size="small"
                            onClick={() => handleToggleAccordion(chap._id)}
                          >
                            {expandedChapters[chap._id] ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </IconButton>
                          <GripVertical
                            className="drag-chapter"
                            size={24}
                            style={{ cursor: 'grab' }}
                          />
                          {isEditingChapter === chap._id ? (
                            <Grid container>
                              <Grid size={{ xs: 12 }}>
                                <TextField
                                  size="small"
                                  fullWidth
                                  value={newChapterTitle}
                                  onChange={(e) =>
                                    setNewChapterTitle(e.target.value)
                                  }
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Typography>
                              {t('EDUCATOR.SAVED_CHAPTERS.CHAPTER_NAME', {
                                number: index + 1,
                                title: chap.title,
                              })}
                            </Typography>
                          )}
                        </Box>
                        <Box display="flex" gap="5px" alignItems="center">
                          {isEditingChapter === chap._id && (
                            <Button
                              variant="outlined"
                              onClick={() => {
                                void handleUpdateChapter(chap._id, newChapterTitle)
                              }}
                              size="small"
                            >
                              {t('EDUCATOR.SAVED_CHAPTERS.UPDATE')}
                            </Button>
                          )}
                          <DeleteModal
                            handleDelete={() =>
                              handleUpdateChapter(chap._id, chap?.title, true)
                            }
                            message="chapter"
                          />
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setIsEditingChapter((prev) =>
                                prev === chap._id ? null : chap._id,
                              )
                              setNewChapterTitle(chap.title)
                            }}
                          >
                            <Edit2 size={20} />
                          </IconButton>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <LessonsList chapterId={chap._id} courseId={courseId} />
                  </Accordion>
                </Box>
              </Draggable>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}

const LessonsList = ({ courseId, chapterId }) => {
  const { t } = useTranslation('education')
  const [lessons, setLessons] = useState([])

  const { setHasLessons } = useFormContext()

  const [sortLesson] = useSortLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()

  const { data, isFetching } = useGetLessonsDetailsQuery({
    courseId,
    chapterId,
  })

  useEffect(() => {
    if (data?.data) {
      setLessons(data.data)
      setHasLessons((prev) => ({
        ...prev,
        [chapterId]: data.data.length,
      }))
    }
  }, [data, isFetching, chapterId, setHasLessons])

  const handleLessonDragStop = async (_, newData, draggedIndex) => {
    const newLessons = [...lessons]
    const draggedItem = newLessons[draggedIndex]

    if (!draggedItem) {
      return
    }

    newLessons.splice(draggedIndex, 1)

    const dropIndex = Math.max(
      0,
      Math.min(Math.round(newData.y / 50), newLessons.length),
    )

    newLessons.splice(dropIndex, 0, draggedItem)

    setLessons(newLessons)

    const replacedItemIndex = dropIndex + (dropIndex > draggedIndex ? -1 : 1)
    const replacedItem = newLessons[replacedItemIndex]

    if (draggedItem._id && replacedItem?._id) {
      await sortLesson({
        firstDocId: draggedItem._id,
        secondDocId: replacedItem._id,
      })
    }
  }

  const handleDeleteLesson = async (lessonId) => {
    setHasLessons((prevCounts) => ({
      ...prevCounts,
      [chapterId]: prevCounts[chapterId] - 1,
    }))
    await updateLesson({
      courseId,
      chapterId,
      lessonId,
      isDeleted: true,
    })
  }

  return (
    <AccordionDetails>
      {!!lessons.length &&
        lessons.map((lessonDetail, index) => (
          <Draggable
            key={lessonDetail._id}
            axis="y"
            position={{ x: 0, y: 0 }}
            handle=".drag-handle"
            onStop={(e, d) => handleLessonDragStop(e, d, index)}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              width="100%"
              sx={{
                borderBottom: '1px solid',
                borderColor: (theme) => theme.palette.primary.light,
                padding: '10px',
              }}
            >
              <Box display="flex" alignItems="center">
                <GripVertical
                  style={{ cursor: 'grab' }}
                  className="drag-handle"
                  size={24}
                />
                <Typography variant="body1">
                  {t('EDUCATOR.SAVED_CHAPTERS.LESSON_NAME', {
                    number: index + 1,
                    title: lessonDetail.title,
                  })}
                </Typography>
              </Box>
              <Box display="flex" gap="8px" alignItems="center">
                <ViewResource lessonDetail={{ ...lessonDetail, courseId }} />
                <DeleteModal
                  handleDelete={() => handleDeleteLesson(lessonDetail._id)}
                  message="lesson"
                />
                <AddLessonsModal
                  isEdit
                  chapterId={chapterId}
                  courseId={courseId}
                  defaultValues={{
                    lessonTitle: lessonDetail.title,
                    resource: lessonDetail.file,
                    isFree: lessonDetail.isFree,
                  }}
                  lessonId={lessonDetail._id}
                />
              </Box>
            </Box>
          </Draggable>
        ))}
      <AddLessonsModal
        isEdit={false}
        chapterId={chapterId}
        courseId={courseId}
      />
    </AccordionDetails>
  )
}

export default SavedChapters
