import React, { useRef } from 'react'
import { Typography, Box, IconButton } from '@mui/material'
import { Edit, Plus } from 'lucide-react'
import ModalBox from '../../../../../../../shared/components/ui-elements/modal-box'
import { useTranslation } from 'react-i18next'
import AddLesson from './add-lesson'

interface AddLessonsModalProps {
  chapterId: string
  courseId: string
  isEdit: boolean
  defaultValues?: {
    lessonTitle: string
    resource: string
    isFree?: boolean
  }
  lessonId?: string
}

interface ModalBoxHandle {
  openModal: () => void
  closeModal: () => void
}

const AddLessonsModal: React.FC<AddLessonsModalProps> = ({
  chapterId,
  courseId,
  isEdit,
  defaultValues = {
    lessonTitle: '',
    resource: '',
    isFree: false,
  },
  lessonId = '',
}) => {
  const { t } = useTranslation('education')
  const lessionRef = useRef<ModalBoxHandle>(null)

  return (
    <>
      {isEdit ? (
        <IconButton color="primary" onClick={() => lessionRef.current?.openModal()}>
          <Edit size={20} />
        </IconButton>
      ) : (
        <Box display="flex" justifyContent="flex-end">
          <Typography
            onClick={() => lessionRef.current?.openModal()}
            variant="body1"
            color="primary"
            mt={1}
            sx={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Plus size={20} /> {t('EDUCATOR.SAVED_CHAPTERS.ADD_MORE_LESSON')}
          </Typography>
        </Box>
      )}
      <ModalBox ref={lessionRef} size="sm">
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