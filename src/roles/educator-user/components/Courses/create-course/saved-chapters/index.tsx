import Draggable from 'react-draggable'
import { useTranslation } from 'react-i18next'
import React, { useRef, useState, useEffect } from 'react'
import {
  Eye,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  MoreVertical,
} from 'lucide-react'

import {
  Box,
  Grid,
  Menu,
  Button,
  useTheme,
  MenuItem,
  TextField,
  Accordion,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
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
import type { ChapterData, LessonData } from '../../../../../../types/education.types'

interface SavedChaptersProps {
  courseId: string
}

const SavedChapters = ({ courseId }: SavedChaptersProps) => {
  const theme = useTheme()
  const { t } = useTranslation('education')

  const [chapters, setChapters] = useState<ChapterData[]>([])
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [isEditingChapter, setIsEditingChapter] = useState<string | null>('')
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({})
  const chapterRefs = useRef<
    Record<string, React.RefObject<HTMLDivElement | null>>
  >({})
  const [anchorElChapter, setAnchorElChapter] = useState<HTMLElement | null>(
    null,
  )
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(
    null,
  )
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
      const initialExpanded: Record<string, boolean> = {}
      data?.data?.chapters?.forEach((chap: ChapterData) => {
        if (chap._id) {
          initialExpanded[chap._id] = true
        }
      })
      setExpandedChapters(initialExpanded)
      setChapters(data.data.chapters as ChapterData[])
    }
  }, [data, isFetching])

  const handleToggleAccordion = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }))
  }

  const handleChapterMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    chapter: ChapterData,
  ) => {
    setAnchorElChapter(event.currentTarget)
    setSelectedChapter(chapter)
  }

  const handleChapterMenuClose = () => {
    setAnchorElChapter(null)
    setSelectedChapter(null)
  }

  const handleUpdateChapter = async (
    chapterId: string,
    title: string,
    isDeleted = false,
  ) => {
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

  const handleChapterDragStop = (
    _: unknown,
    newData: { y: number },
    draggedIndex: number,
  ) => {
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
      void sortChapters({
        firstDocId: draggedChapter._id,
        secondDocId: replacedChapter._id,
      })
    }
  }

  return (
    <Box>
      {!!chapters.length && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
            {t('EDUCATOR.SAVED_CHAPTERS.SAVED_CHAPTERS_TITLE')}
          </Typography>
          <Box
            sx={{
              backgroundColor: 'background.default',
              borderRadius: '12px',
              p: 2,
              border: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            {chapters.map((chap, index) => {
              // Create ref for each chapter if it doesn't exist
              if (chap._id && !chapterRefs.current[chap._id]) {
                chapterRefs.current[chap._id] = React.createRef()
              }
              return (
                <Draggable
                  key={chap._id}
                  nodeRef={chap._id ? chapterRefs.current[chap._id] : undefined}
                  axis="y"
                  position={{ x: 0, y: 0 }}
                  onStop={(e, d) => handleChapterDragStop(e, d, index)}
                  handle=".drag-chapter"
                >
                  <Box
                    ref={chap._id ? chapterRefs.current[chap._id] : undefined}
                    sx={{ mb: 2 }}
                  >
                    <Accordion
                      expanded={chap._id ? !!expandedChapters[chap._id] : false}
                      key={chap._id}
                      sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: '8px !important',
                        border: `1px solid ${theme.palette.grey[200]}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                        '&:before': {
                          display: 'none',
                        },
                        '& .MuiAccordionSummary-content': {
                          margin: '12px 0',
                          alignItems: 'center',
                        },
                      }}
                    >
                      <AccordionSummary
                        aria-controls={`panel-${chap._id}-content`}
                        id={`panel-${chap._id}-header`}
                        sx={{
                          backgroundColor: theme.palette.grey[50],
                          borderRadius: '8px 8px 0 0',
                          '&:hover': {
                            backgroundColor: theme.palette.grey[100],
                          },
                        }}
                      >
                        <Box
                          display="flex"
                          flexDirection={{ xs: 'row', sm: 'row' }}
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                          gap={{ xs: 1, sm: 2 }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={{ xs: 0.5, sm: 1.5 }}
                            flex={1}
                            minWidth={0}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                chap._id && handleToggleAccordion(chap._id)
                              }
                              sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                border: `1px solid ${theme.palette.primary.main}`,
                                '&:hover': {
                                  backgroundColor: theme.palette.primary.dark,
                                },
                                width: 28,
                                height: 28,
                              }}
                            >
                              {chap._id && expandedChapters[chap._id] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </IconButton>
                            <Box
                              className="drag-chapter"
                              sx={{
                                cursor: 'grab',
                                color: theme.palette.grey[400],
                                padding: '4px',
                                borderRadius: '4px',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  color: theme.palette.primary.main,
                                  backgroundColor:
                                    theme.palette.primary.main + '10',
                                },
                                '&:active': {
                                  cursor: 'grabbing',
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              <GripVertical size={20} />
                            </Box>

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
                              <Box
                                sx={{
                                  flex: 1,
                                  minWidth: 0,
                                  maxWidth: { xs: '150px', sm: '100%' },
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    width: '100%',
                                  }}
                                >
                                  {t('EDUCATOR.SAVED_CHAPTERS.CHAPTER_NAME', {
                                    number: index + 1,
                                    title: chap.title,
                                  })}
                                </Typography>
                                {chap.lessons && chap.lessons.length > 0 && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {chap.lessons.length}{' '}
                                    {chap.lessons.length === 1
                                      ? 'lesson'
                                      : 'lessons'}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                          {isMobile ? (
                            <IconButton
                              size="small"
                              onClick={(e) => handleChapterMenuOpen(e, chap)}
                              sx={{
                                flexShrink: 0,
                                ml: 'auto',
                                order: 2,
                              }}
                            >
                              <MoreVertical size={18} />
                            </IconButton>
                          ) : (
                            <Box
                              display="flex"
                              gap={1}
                              alignItems="center"
                              sx={{
                                flexShrink: 0,
                                ml: 'auto',
                              }}
                            >
                              {isEditingChapter === chap._id && (
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    if (chap._id) {
                                      void handleUpdateChapter(
                                        chap._id,
                                        newChapterTitle,
                                      )
                                    }
                                  }}
                                  size="small"
                                  sx={{ textTransform: 'none' }}
                                >
                                  {t('EDUCATOR.SAVED_CHAPTERS.UPDATE')}
                                </Button>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setIsEditingChapter((prev) =>
                                    prev === chap._id ? null : chap._id || null,
                                  )
                                  setNewChapterTitle(chap.title || '')
                                }}
                                sx={{
                                  color: theme.palette.primary.main,
                                  '&:hover': {
                                    backgroundColor:
                                      theme.palette.primary.main + '10',
                                  },
                                }}
                              >
                                <Edit2 size={16} />
                              </IconButton>
                              <DeleteModal
                                handleDelete={() => {
                                  if (chap._id && chap.title) {
                                    void handleUpdateChapter(
                                      chap._id,
                                      chap.title,
                                      true,
                                    )
                                  }
                                }}
                                message="chapter"
                              />
                            </Box>
                          )}
                        </Box>
                      </AccordionSummary>
                      {chap._id && (
                        <LessonsList chapterId={chap._id} courseId={courseId} />
                      )}
                    </Accordion>
                  </Box>
                </Draggable>
              )
            })}
          </Box>

          {/* Mobile Menu for Chapters */}
          <Menu
            anchorEl={anchorElChapter}
            open={Boolean(anchorElChapter)}
            onClose={handleChapterMenuClose}
            sx={{
              '& .MuiPaper-root': {
                minWidth: 180,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setIsEditingChapter(selectedChapter?._id || null)
                setNewChapterTitle(selectedChapter?.title || '')
                handleChapterMenuClose()
              }}
            >
              <ListItemIcon>
                <Edit2 size={18} />
              </ListItemIcon>
              <ListItemText>Edit Chapter</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (
                  selectedChapter &&
                  selectedChapter._id &&
                  selectedChapter.title
                ) {
                  void handleUpdateChapter(
                    selectedChapter._id,
                    selectedChapter.title,
                    true,
                  )
                  handleChapterMenuClose()
                }
              }}
            >
              <ListItemIcon>
                <Trash2 size={18} color={theme.palette.error.main} />
              </ListItemIcon>
              <ListItemText>
                <Typography color="error">Delete Chapter</Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  )
}

interface LessonsListProps {
  courseId: string
  chapterId: string
}

const LessonsList = ({ courseId, chapterId }: LessonsListProps) => {
  const theme = useTheme()
  const { t } = useTranslation('education')
  const [lessons, setLessons] = useState<LessonData[]>([])
  const lessonRefs = useRef<
    Record<string, React.RefObject<HTMLDivElement | null>>
  >({})
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Local state for lesson counts instead of using form context
  const [, setLocalLessonCount] = useState(0)

  const [sortLesson] = useSortLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()

  const { data, isFetching } = useGetLessonsDetailsQuery({
    courseId,
    chapterId,
  })

  useEffect(() => {
    if (data?.data) {
      setLessons(data.data as LessonData[])
      setLocalLessonCount(data.data?.length || 0)
    }
  }, [data, isFetching, chapterId])

  const handleLessonDragStop = (
    _: unknown,
    newData: { y: number },
    draggedIndex: number,
  ) => {
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
      void sortLesson({
        firstDocId: draggedItem._id,
        secondDocId: replacedItem._id,
      })
    }
  }

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    lesson: LessonData,
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedLesson(lesson)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedLesson(null)
  }

  const handleDeleteLesson = async (lessonId: string) => {
    setLocalLessonCount((prev) => prev - 1)
    await updateLesson({
      courseId,
      chapterId,
      lessonId,
      isDeleted: true,
    })
    handleMenuClose()
  }

  return (
    <AccordionDetails sx={{ p: 2, backgroundColor: 'background.paper' }}>
      {!!lessons.length &&
        lessons.map((lessonDetail, index) => {
          // Create ref for each lesson if it doesn't exist
          if (lessonDetail._id && !lessonRefs.current[lessonDetail._id]) {
            lessonRefs.current[lessonDetail._id] = React.createRef()
          }
          return (
            <Draggable
              key={lessonDetail._id}
              nodeRef={
                lessonDetail._id
                  ? lessonRefs.current[lessonDetail._id]
                  : undefined
              }
              axis="y"
              position={{ x: 0, y: 0 }}
              handle=".drag-handle"
              onStop={(e, d) => handleLessonDragStop(e, d, index)}
            >
              <Box
                ref={
                  lessonDetail._id
                    ? lessonRefs.current[lessonDetail._id]
                    : undefined
                }
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                gap={{ xs: 0.5, sm: 0 }}
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: '8px',
                  border: `1px solid ${theme.palette.grey[200]}`,
                  p: { xs: 1.5, sm: 2 },
                  mb: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  },
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={{ xs: 1, sm: 1.5 }}
                >
                  <Box
                    className="drag-handle"
                    sx={{
                      cursor: 'grab',
                      color: theme.palette.grey[400],
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.main + '10',
                      },
                      '&:active': {
                        cursor: 'grabbing',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <GripVertical size={18} />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      maxWidth: { xs: '120px', sm: '100%' },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '0.875rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      {t('EDUCATOR.SAVED_CHAPTERS.LESSON_NAME', {
                        number: index + 1,
                        title: lessonDetail?.title,
                      })}
                    </Typography>
                  </Box>
                </Box>
                {isMobile ? (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, lessonDetail)}
                    sx={{
                      flexShrink: 0,
                      ml: 'auto',
                    }}
                  >
                    <MoreVertical size={18} />
                  </IconButton>
                ) : (
                  <Box
                    display="flex"
                    gap={1}
                    alignItems="center"
                    sx={{ flexShrink: 0 }}
                  >
                    <Box id={`view-resource-wrapper-${lessonDetail._id}`}>
                      <ViewResource
                        lessonDetail={{ ...lessonDetail, courseId }}
                        isEdit
                      />
                    </Box>
                    <DeleteModal
                      handleDelete={() =>
                        lessonDetail._id && handleDeleteLesson(lessonDetail._id)
                      }
                      message="lesson"
                    />
                    <AddLessonsModal
                      isEdit
                      chapterId={chapterId}
                      courseId={courseId}
                      defaultValues={{
                        lessonTitle: lessonDetail.title || '',
                        resource:
                          (typeof lessonDetail.resourceUrl === 'string'
                            ? lessonDetail.resourceUrl
                            : '') ||
                          (typeof lessonDetail.file === 'string'
                            ? lessonDetail.file
                            : '') ||
                          '',
                        isFree: Boolean(lessonDetail.isFree),
                      }}
                      lessonId={lessonDetail._id}
                      onClose={() => {}}
                    />
                  </Box>
                )}
              </Box>
            </Draggable>
          )
        })}
      <Box sx={{ mt: 2 }}>
        <AddLessonsModal
          isEdit={false}
          chapterId={chapterId}
          courseId={courseId}
          defaultValues={{ isFree: false, lessonTitle: '', resource: '' }}
          onClose={() => {}}
        />
      </Box>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && Boolean(selectedLesson)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            minWidth: 180,
          },
        }}
      >
        {selectedLesson && (
          <>
            <MenuItem
              onClick={() => {
                handleMenuClose()
                // Trigger the ViewResource button click after menu closes
                setTimeout(() => {
                  const viewButton = document.querySelector(
                    `#view-resource-wrapper-${selectedLesson._id} button`,
                  ) as HTMLButtonElement | null
                  if (viewButton) {
                    viewButton.click()
                  }
                }, 100)
              }}
              disabled={selectedLesson?.status !== 'completed'}
            >
              <ListItemIcon>
                <Eye size={18} />
              </ListItemIcon>
              <ListItemText>View Resource</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setShowEditModal(true)
                handleMenuClose()
              }}
            >
              <ListItemIcon>
                <Edit2 size={18} />
              </ListItemIcon>
              <ListItemText>Edit Lesson</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setShowDeleteModal(true)
                handleMenuClose()
              }}
            >
              <ListItemIcon>
                <Trash2 size={18} color={theme.palette.error.main} />
              </ListItemIcon>
              <ListItemText>
                <Typography color="error">Delete Lesson</Typography>
              </ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Delete Confirmation Modal - Render outside menu */}
      {showDeleteModal && selectedLesson && (
        <DeleteModal
          handleDelete={() => {
            if (selectedLesson._id) {
              void handleDeleteLesson(selectedLesson._id)
            }
            setShowDeleteModal(false)
            setSelectedLesson(null)
          }}
          message="lesson"
          forceOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedLesson(null)
          }}
        />
      )}

      {/* Edit Modal - Render outside menu */}
      {showEditModal && selectedLesson && (
        <AddLessonsModal
          isEdit
          chapterId={chapterId}
          courseId={courseId}
          defaultValues={{
            lessonTitle: selectedLesson.title || '',
            resource:
              (typeof selectedLesson.resourceUrl === 'string'
                ? selectedLesson.resourceUrl
                : '') ||
              (typeof selectedLesson.file === 'string'
                ? selectedLesson.file
                : '') ||
              '',
            isFree: Boolean(selectedLesson.isFree),
          }}
          lessonId={selectedLesson._id}
          onClose={() => {
            setShowEditModal(false)
            setSelectedLesson(null)
          }}
          openModal={showEditModal}
        />
      )}
    </AccordionDetails>
  )
}

export default SavedChapters
