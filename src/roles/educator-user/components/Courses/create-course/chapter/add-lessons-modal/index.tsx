import React, { useRef } from 'react'
import { Plus, Edit2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Box, Typography, IconButton } from '@mui/material'

import AddLesson from './add-lesson'
import ModalBox from '../../../../../../../shared/components/ui-elements/modal-box'

const AddLessonsModal = ({
  chapterId,
  courseId,
  isEdit,
  defaultValues,
  lessonId,
}) => {
  const { t } = useTranslation('education')
  const lessionRef = useRef(null)

  return (
    <>
      {isEdit ? (
        <IconButton color="primary">
          <Edit2
            onClick={() => lessionRef.current?.openModal()}
            size={20}
          />
        </IconButton>
      ) : (
        <Box display="flex" justifyContent="flex-end">
          <Typography
            onClick={() => lessionRef.current?.openModal()}
            variant="body1"
            color="primary"
            mt={1}
            sx={{ cursor: 'pointer' }}
          >
            <Plus size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {t('EDUCATOR.SAVED_CHAPTERS.ADD_MORE_LESSON')}
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
