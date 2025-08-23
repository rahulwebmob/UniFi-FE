import {
  Box,
  Accordion,
  Typography,
  IconButton,
  AccordionDetails,
  AccordionSummary,
  useTheme,
} from '@mui/material'
import { GripVertical, ChevronDown } from 'lucide-react'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
import Draggable from 'react-draggable'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  useListChapersQuery,
  useSortLessonMutation,
  useUpdateLessonMutation,
  useSortChaptersMutation,
  useUpdateChapterMutation,
  useGetLessonsDetailsQuery,
} from '../../../../../../services/admin'
import ModalBox from '../../../../../../shared/components/ui-elements/modal-box'
import AddLesson from '../chapter/add-lessons-modal/add-lesson'
import ChapterToolbar from '../chapter/chapter-toolbar'

const SavedChapters = ({ courseId }) => {
  const { t } = useTranslation('education')
  const theme = useTheme()
  const { setHasLessons } = useFormContext()

  const [chapters, setChapters] = useState([])
  const [expandedChapters, setExpandedChapters] = useState({})
  const chapterRefs = useRef([])
  const addLessonRefs = useRef({})

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
    if (isDeleted) {
      setHasLessons((prev) => {
        const { [chapterId]: _, ...rest } = prev
        return rest
      })
    }
    const payload = {
      courseId,
      chapterId,
      title,
      ...(isDeleted && { isDeleted }),
    }
    await updateChapter(payload)
  }

  const handleChapterDragStop = async (_, newData, draggedIndex) => {
    const newChapters = [...chapters]
    const draggedChapter = newChapters[draggedIndex]

    if (!draggedChapter) {
      return
    }
    newChapters.splice(draggedIndex, 1)

    const dropIndex = Math.max(0, Math.min(Math.round(newData.y / 70), newChapters.length))

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
          <Typography variant="h6" fontWeight={600} mb={2}>
            {t('EDUCATOR.SAVED_CHAPTERS.SAVED_CHAPTERS_TITLE')}
          </Typography>
          <Box p={3}>
            {chapters.map((chap, index) => (
              <Draggable
                key={chap._id}
                nodeRef={
                  (chapterRefs.current[index] = chapterRefs.current[index] || React.createRef())
                }
                axis="y"
                position={{ x: 0, y: 0 }}
                onStop={(e, d) => handleChapterDragStop(e, d, index)}
                handle=".drag-chapter"
              >
                <Box ref={chapterRefs.current[index]} sx={{ mb: 2 }}>
                  <Accordion expanded={!!expandedChapters[chap._id]} key={chap._id}>
                    <AccordionSummary
                      aria-controls={`panel-${chap._id}-content`}
                      id={`panel-${chap._id}-header`}
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
                            sx={{
                              transition: 'transform 0.3s ease',
                              transform: expandedChapters[chap._id]
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                            }}
                          >
                            <ChevronDown size={20} />
                          </IconButton>
                          <Box
                            className="drag-chapter"
                            sx={{
                              cursor: 'grab',
                              color: theme.palette.grey[400],
                              transition: 'color 0.2s ease',
                              '&:hover': {
                                color: theme.palette.primary.main,
                              },
                              '&:active': {
                                cursor: 'grabbing',
                              },
                            }}
                          >
                            <GripVertical size={24} />
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight={500}>
                              {`Chapter ${index + 1}.  ${chap.title}`}
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" gap="5px" alignItems="center">
                          <ChapterToolbar
                            isLesson={false}
                            handleDelete={() => handleUpdateChapter(chap._id, chap?.title, true)}
                            handleEdit={(newTitle) => handleUpdateChapter(chap._id, newTitle)}
                            handleAddLesson={(closeModal) => {
                              if (!addLessonRefs.current[chap._id]) {
                                addLessonRefs.current[chap._id] = React.createRef()
                              }
                              return (
                                <AddLesson
                                  chapterId={chap._id}
                                  courseId={courseId}
                                  isEdit={false}
                                  defaultValues={{
                                    lessonTitle: '',
                                    resource: '',
                                    isFree: false,
                                  }}
                                  handleClose={closeModal}
                                />
                              )
                            }}
                            currentTitle={chap.title}
                            message="chapter"
                          />
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
  const theme = useTheme()
  const lessonRefs = useRef([])
  const addLessonRef = useRef(null)
  const editLessonRefs = useRef({})

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

    const dropIndex = Math.max(0, Math.min(Math.round(newData.y / 50), newLessons.length))

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
        lessons.map((lessonDetail, index) => {
          if (!editLessonRefs.current[lessonDetail._id]) {
            editLessonRefs.current[lessonDetail._id] = React.createRef()
          }

          return (
            <Draggable
              key={lessonDetail._id}
              nodeRef={(lessonRefs.current[index] = lessonRefs.current[index] || React.createRef())}
              axis="y"
              position={{ x: 0, y: 0 }}
              handle=".drag-handle"
              onStop={(e, d) => handleLessonDragStop(e, d, index)}
            >
              <Box
                ref={lessonRefs.current[index]}
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                width="100%"
                sx={{
                  borderRadius: '8px',
                  backgroundColor: 'background.paper',
                  mb: 1.5,
                  p: 2,
                  transition: 'all 0.2s ease',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    borderColor: theme.palette.primary.light,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    className="drag-handle"
                    sx={{
                      cursor: 'grab',
                      color: theme.palette.grey[400],
                      transition: 'color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                      '&:active': {
                        cursor: 'grabbing',
                      },
                    }}
                  >
                    <GripVertical size={20} />
                  </Box>
                  <Typography variant="body1" fontWeight={500}>
                    {`Lesson ${index + 1}. ${lessonDetail.title}`}
                  </Typography>
                </Box>
                <Box display="flex" gap="8px" alignItems="center">
                  <ChapterToolbar
                    isLesson
                    lessonDetail={{ ...lessonDetail, courseId }}
                    handleDelete={() => handleDeleteLesson(lessonDetail._id)}
                    handleEdit={() => {
                      editLessonRefs.current[lessonDetail._id]?.current?.openModal()
                    }}
                    currentTitle={lessonDetail.title}
                    message="lesson"
                  />
                  <ModalBox
                    ref={editLessonRefs.current[lessonDetail._id] || React.createRef()}
                    size="lg"
                  >
                    <AddLesson
                      chapterId={chapterId}
                      courseId={courseId}
                      isEdit
                      defaultValues={{
                        lessonTitle: lessonDetail.title,
                        resource: lessonDetail.file,
                        isFree: lessonDetail.isFree,
                      }}
                      lessonId={lessonDetail._id}
                      handleClose={() =>
                        editLessonRefs.current[lessonDetail._id]?.current?.closeModal()
                      }
                    />
                  </ModalBox>
                </Box>
              </Box>
            </Draggable>
          )
        })}
      {lessons.length > 0 && (
        <Box
          sx={{
            borderTop: `1px dashed ${theme.palette.divider}`,
            pt: 2,
            mt: 1,
          }}
        />
      )}

      <ModalBox ref={addLessonRef} size="lg">
        <AddLesson
          chapterId={chapterId}
          courseId={courseId}
          isEdit={false}
          defaultValues={{
            lessonTitle: '',
            resource: '',
            isFree: false,
          }}
          handleClose={() => addLessonRef.current?.closeModal()}
        />
      </ModalBox>
    </AccordionDetails>
  )
}

export default SavedChapters

SavedChapters.propTypes = {
  courseId: PropTypes.string.isRequired,
}

LessonsList.propTypes = {
  courseId: PropTypes.string.isRequired,
  chapterId: PropTypes.string.isRequired,
}
