import { Plus, Edit2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRef, useEffect } from 'react'

import { Box, Button, useTheme, IconButton } from '@mui/material'

import AddLesson from './add-lesson'
import ModalBox from '../../../../../../../shared/components/ui-elements/modal-box'
import type {
  AddLessonProps,
  ModalBoxHandle,
} from '../../../../../../../types/education.types'

interface AddLessonsModalProps extends Omit<AddLessonProps, 'handleClose'> {
  onClose: () => void
  openModal?: boolean
}

const AddLessonsModal = ({
  chapterId,
  courseId,
  isEdit,
  defaultValues,
  lessonId,
  onClose,
  openModal = false,
}: AddLessonsModalProps) => {
  const theme = useTheme()
  const { t } = useTranslation('education')
  const lessionRef = useRef<ModalBoxHandle | null>(null)

  useEffect(() => {
    if (openModal && lessionRef.current) {
      lessionRef.current.openModal()
    }
  }, [openModal])

  return (
    <>
      {isEdit ? (
        <IconButton
          size="small"
          onClick={() => lessionRef.current?.openModal()}
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.main + '10',
            },
          }}
        >
          <Edit2 size={16} />
        </IconButton>
      ) : (
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={() => lessionRef.current?.openModal()}
            startIcon={<Plus size={16} />}
            variant="outlined"
            size="small"
            sx={{
              textTransform: 'none',
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.main + '08',
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            {t('EDUCATOR.SAVED_CHAPTERS.ADD_MORE_LESSON')}
          </Button>
        </Box>
      )}
      <ModalBox ref={lessionRef} size="md" onCloseModal={onClose}>
        <AddLesson
          chapterId={chapterId}
          courseId={courseId}
          isEdit={isEdit}
          defaultValues={defaultValues}
          lessonId={lessonId}
          handleClose={() => lessionRef.current?.closeModal()}
        />
      </ModalBox>
    </>
  )
}

export default AddLessonsModal
