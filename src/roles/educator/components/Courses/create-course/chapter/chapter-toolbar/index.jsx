import { Box, Button, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { MoreVertical, Edit2, Trash2, Plus, FileText, Video } from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useDownloadResourceMutation } from '../../../../../../../services/admin'
import CourseContent from '../../../../../../../shared/components/layout/Course/content-preview'
import ModalBox from '../../../../../../../shared/components/ui-elements/modal-box'

const ChapterToolbar = ({
  isLesson = false,
  handleDelete,
  handleEdit,
  handleAddLesson = () => {},
  currentTitle,
  lessonDetail,
}) => {
  const { t } = useTranslation(['education', 'application'])
  const modalRef = useRef(null)

  const [anchorEl, setAnchorEl] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [resourceUrl, setResourceUrl] = useState('')
  const [editTitle, setEditTitle] = useState(currentTitle)

  const [downloadResource] = useDownloadResourceMutation()

  const isPdf = useMemo(() => lessonDetail?.lessonType === 'pdf', [lessonDetail])

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEditClick = () => {
    if (isLesson) {
      handleEdit()
      handleClose()
    } else {
      setEditTitle(currentTitle)
      setModalType('edit')
      modalRef.current.openModal()
      handleClose()
    }
  }

  const handleDeleteClick = () => {
    setModalType('delete')
    modalRef.current.openModal()
    handleClose()
  }

  const handleAddLessonClick = () => {
    setModalType('addLesson')
    modalRef.current.openModal()
    handleClose()
  }

  const handleEditSave = () => {
    handleEdit(editTitle)
    modalRef.current.closeModal()
  }

  const handleDeleteConfirm = () => {
    handleDelete()
    modalRef.current.closeModal()
  }

  const handleViewResource = async () => {
    handleClose()
    try {
      const response = await downloadResource({
        lessonId: lessonDetail?._id,
        courseId: lessonDetail?.courseId,
        chapterId: lessonDetail?.chapterId,
      })

      if (response?.data?.url) {
        setResourceUrl(response.data.url)
        setModalType('viewResource')
        modalRef.current.openModal()
      }
    } catch {
      // error handling
    }
  }

  const renderModalContent = () => {
    switch (modalType) {
      case 'edit':
        if (isLesson) {
          return null
        }
        return (
          <Box>
            <Typography variant="h6" mb={2}>
              {t('EDUCATOR.CHAPTER_TOOLBAR.EDIT_CHAPTER_TITLE')}
            </Typography>
            <TextField
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder={t('EDUCATOR.CHAPTER_TOOLBAR.ENTER_CHAPTER_TITLE')}
              sx={{ mb: 2 }}
            />
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={() => modalRef.current.closeModal()} color="inherit">
                {t('application:MISCELLANEOUS.CANCEL')}
              </Button>
              <Button onClick={handleEditSave} variant="contained">
                {t('EDUCATOR.SAVED_CHAPTERS.UPDATE')}
              </Button>
            </Box>
          </Box>
        )
      case 'delete':
        return (
          <Box>
            <Typography variant="p1" mb={3} maxWidth={350}>
              {isLesson
                ? t('EDUCATOR.CHAPTER_TOOLBAR.CONFIRM_DELETE_LESSON')
                : t('EDUCATOR.CHAPTER_TOOLBAR.CONFIRM_DELETE_CHAPTER')}
            </Typography>
            <Box
              sx={{
                mt: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <Button onClick={handleDeleteConfirm} size="small" variant="contained" color="error">
                {t('application:MISCELLANEOUS.DELETE')}
              </Button>
              <Button size="small" variant="outlined" onClick={() => modalRef.current.closeModal()}>
                {t('application:MISCELLANEOUS.CANCEL')}
              </Button>
            </Box>
          </Box>
        )
      case 'addLesson':
        return handleAddLesson ? (
          <Box>{handleAddLesson(() => modalRef.current.closeModal())}</Box>
        ) : null
      case 'viewResource':
        return (
          <Box
            sx={{
              height: 'calc(100vh - 200px)',
            }}
          >
            <CourseContent url={resourceUrl} type={isPdf ? 'doc' : 'video'} />
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <MoreVertical size={20} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={handleEditClick}
          sx={{
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.lighter',
            },
          }}
        >
          <Edit2 size={16} style={{ marginRight: 8 }} />
          {isLesson
            ? t('EDUCATOR.CHAPTER_TOOLBAR.EDIT_LESSON')
            : t('EDUCATOR.CHAPTER_TOOLBAR.EDIT_CHAPTER')}
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.lighter',
            },
          }}
        >
          <Trash2 size={16} style={{ marginRight: 8 }} />
          {isLesson
            ? t('EDUCATOR.CHAPTER_TOOLBAR.DELETE_LESSON')
            : t('EDUCATOR.CHAPTER_TOOLBAR.DELETE_CHAPTER')}
        </MenuItem>
        {!isLesson && (
          <MenuItem
            onClick={handleAddLessonClick}
            sx={{
              color: 'success.main',
              '&:hover': {
                backgroundColor: 'success.lighter',
              },
            }}
          >
            <Plus size={16} style={{ marginRight: 8 }} />
            {t('EDUCATOR.CHAPTER_TOOLBAR.ADD_LESSON')}
          </MenuItem>
        )}
        {isLesson && (
          <MenuItem
            onClick={handleViewResource}
            sx={{
              color: 'success.main',
              '&:hover': {
                backgroundColor: 'success.lighter',
              },
            }}
          >
            {isPdf ? (
              <FileText size={16} style={{ marginRight: 8 }} />
            ) : (
              <Video size={16} style={{ marginRight: 8 }} />
            )}
            {isPdf ? 'View doc' : 'View video'}
          </MenuItem>
        )}
      </Menu>

      <ModalBox
        ref={modalRef}
        size={modalType === 'addLesson' || modalType === 'viewResource' ? 'lg' : 'md'}
      >
        {renderModalContent()}
      </ModalBox>
    </>
  )
}

export default ChapterToolbar

ChapterToolbar.propTypes = {
  isLesson: PropTypes.bool,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleAddLesson: PropTypes.func,
  currentTitle: PropTypes.string.isRequired,
  lessonDetail: PropTypes.object.isRequired,
}
